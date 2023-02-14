import {useEffect, useRef, useCallback, useState} from 'react';
import freeice from 'freeice';
import useStateWithCallback from './useStateWithCallback';
import socket from '../socket/socket';
import ACTIONS from '../socket/actions';
import {mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} from 'react-native-webrtc'
import { Linking } from 'react-native';
export const LOCAL_VIDEO = 'LOCAL_VIDEO';


export default function useWebRTC(roomID) {

  const [clients, updateClients] = useStateWithCallback([]);
  const [isCallEnd,setIsCallEnd] = useState(false)
  const [roomData,setRoomData] = useState(null)


  const rotateCamera = async() => {
    const videoTrack = await localMediaStream.current.getVideoTracks()[ 0 ];
    videoTrack._switchCamera();
  }

  const changeAudio = async(bool) => {
    try {
      const audioTrack = await localMediaStream.current.getAudioTracks()[ 0 ];

      if(bool) {
        audioTrack.enabled = true
      }
      else {
        audioTrack.enabled = false
      }
      return true
    } catch (error) {
      return false
    }

  }

  const changeCamera = async(videoBool) => {
    try {
      const videoTrack = await localMediaStream.current.getVideoTracks()[ 0 ];
      if(videoBool) {
        videoTrack.enabled = true
      }
      else {
        videoTrack.enabled = false
      }
      return true
    } catch (error) {
      return false
    }

  }

  const addNewClient = useCallback((newClient, cb) => {
    updateClients(list => {
      if (!list.includes(newClient)) {
        return [...list, newClient]
      }

      return list;
    }, cb);
  }, [clients, updateClients]);

  const callEnd = async () => {
    socket.emit(ACTIONS.LEAVE)
  }

  const soketAddFile = async (data) => {
    socket.emit(ACTIONS.ADD_FILE, data)
  }

  const peerConnections = useRef({});
  const localMediaStream = useRef(null);
  const peerMediaElements = useRef({
    [LOCAL_VIDEO]: null,
  })

  useEffect(() => {
    socket.on(ACTIONS.ROOM_DATA, res => {setRoomData(res); console.log('room data',res);})
    return () => {
      socket.off(ACTIONS.ROOM_DATA)
    }
  }, [])

  useEffect(() => {
    socket.on(ACTIONS.CALL_END, () => {
      setIsCallEnd(true)
    })
    async function handleNewPeer({peerID, createOffer}) {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerID].onicecandidate = event => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      }

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
        tracksNumber++

        if (tracksNumber > 0) { // video & audio tracks received
          tracksNumber = 0;
          addNewClient(peerID, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream;
            } else {
              // FIX LONG RENDER IN CASE OF MANY CLIENTS
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      }

      localMediaStream.current.getTracks().forEach(track => {
        peerConnections.current[peerID].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
      socket.off(ACTIONS.CALL_END)
    }
  }, []);

  useEffect(() => {
    async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION);
    }
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
    }
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({peerID}) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients(list => list.filter(c => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.off(ACTIONS.REMOVE_PEER);
    }
  }, []);

  useEffect(() => {
    try {
      async function startCapture() {
        const devices = await mediaDevices.enumerateDevices()
        const cameraDevices = devices.filter(device => device.kind === 'videoinput' ? device:false)
        const audioDevices = devices.filter(device => device.kind === 'audioinput' ? device:false)
        mediaStream = await mediaDevices.getUserMedia({
          audio: audioDevices.length ? true : false,
          video: {
            width: 1280,
            height: 720,
          }
        });
        if(cameraDevices.length < 1) {
          let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
          videoTrack.enabled = false;
        }
        localMediaStream.current = mediaStream

        addNewClient(LOCAL_VIDEO, () => {
          const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

          if (localVideoElement) {
            localVideoElement.volume = 0;
            localVideoElement.srcObject = localMediaStream.current;
          }
        });
      }
      startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
      .catch(e => {alert('Вы запретили аудио или видео'); Linking.openSettings()});

    return () => {
      localMediaStream.current?.getTracks().forEach(track => track.stop());
      localMediaStream.current =  null
      socket.emit(ACTIONS.LEAVE);
    };
    } catch (error) {
        
    }

 
  }, [roomID]);


  return {
    clients,
    localMediaStream,
    peerConnections,
    rotateCamera,
    changeAudio,
    changeCamera,
    callEnd,
    isCallEnd,
    soketAddFile,
    roomData
  };
}