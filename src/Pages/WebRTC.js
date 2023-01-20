import React, {useEffect,useRef,useState} from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import socket from '../socket/socket';
import {
  ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc'
const WebRTC = props => {

  const [remoteStream, setRemoteStream] = useState(null);

  const [localMediaStream,setLocalMediaStream] = useState(null)

  const [isFrontCam,setIsFromCam] = useState(true)
  const [cameraCount,setCameraCount] = useState(0)
  const [activeFrontCamera,setActiveFrontCamera] = useState(true)
  const [timestamp,setTimeStamp] = useState(null)

  let peerConnection = new RTCPeerConnection( peerConstraints );

  let mediaConstraints = {
    audio: true,
    video: true
  };

  useEffect(() => {
    start()  
    peerConnection.addEventListener( 'negotiationneeded', event => {
      console.log('negotiationneeded');
      console.log(event);
      // You can start the offer stages here.
      // Be careful as this event can be called multiple times.
    } );
  },[])

  // Получение медиапотока с помощью getUserMedia
  const getUserMedia = async () => {
    try {
      const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
      setLocalMediaStream(mediaStream)
      peerConnection.addStream(localMediaStream)

      // socket.emit('ROOM:JOIN', {roomId:props.navigation.state.params.roomId, userMedia:mediaStream})

      // getDisplayMedia()
    } catch( err ) {
      // Handle Error
    };
  }

  const start = async () => {
    await getMediaDevices()
    await getUserMedia()
  }

  let peerConstraints = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      }
    ]
  };


    
  //получение доступных камер
  const getMediaDevices = async () => {
    try {
      const devices = await mediaDevices.enumerateDevices();
      devices.map( device => {
        if ( device.kind !== 'videoinput' ) { return; };
        setCameraCount(prevState => prevState + 1)
      } );
    } catch( err ) {
      // Handle Error
    };
  }

  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true
    }
  };



  const getDisplayMedia = async () => {
    try {
      const mediaStream = await mediaDevices.getDisplayMedia();
      setLocalMediaStream(mediaStream)
      try {
        const offerDescription = await peerConnection.createOffer( sessionConstraints );
        await peerConnection.setLocalDescription( offerDescription );
        socket.emit('OFFERDESCR', offerDescription)
        // Send the offerDescription to the other participant.
      } catch( err ) {
        // Handle Errors
      };
    } catch( err ) {
      // Handle Error
    };
  }

  const callEnd = async () => {
    localMediaStream.getTracks().map(track => track.stop())
    setLocalMediaStream(null)
    props.navigation.navigate('Main')
    socket.emit('ROOM:LEAVED', {roomId:props.navigation.state.params.roomId, userMedia:localMediaStream})
  }
  const rotateCamera = async () => {
    try {
      // Taken from above, we don't want to flip if we don't have another camera.
      if ( cameraCount < 2 ) { return; };
    
      const videoTrack = await localMediaStream.getVideoTracks()[ 0 ];
      videoTrack._switchCamera();
      setActiveFrontCamera(prev => !prev)
      setIsFromCam(!isFrontCam)
    } catch( err ) {
      // Handle Error
    };
  }


  return (
    <View style={{flex:1, position:'relative'}}>
      <View style={{ position:'absolute', bottom:0,left:0,right:0, height:100, justifyContent:'center', paddingHorizontal:16}}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
          <Text>{props.navigation.state.params.roomId}</Text>
          {<TouchableOpacity
            onPress={callEnd}
            style={{backgroundColor:'blue', width:150,borderRadius:10,paddingVertical:15,paddingHorizontal:8}}>
            <Text style={{color:'#FFF'}}>Завершить звонок</Text>
          </TouchableOpacity>}

          {localMediaStream ? <TouchableOpacity
            onPress={rotateCamera}
            style={{backgroundColor:'blue', width:110, borderRadius:10,paddingVertical:15,paddingHorizontal:8}}>
            <Text style={{color:'#FFF', textAlign:'center'}}>Перевернуть камеру</Text>
          </TouchableOpacity> : null}
        </View>
      </View>




      <View style={{borderBottomLeftRadius:24,borderBottomRightRadius:24,overflow:'hidden'}}>
      {localMediaStream ?
        <RTCView
          style={{width, height:height - 100}}
          mirror={activeFrontCamera ? true : false}
          objectFit={'cover'}
          streamURL={localMediaStream.toURL()}
          zOrder={0}
        /> 
        : null}

        {remoteStream 
        ? 
          <View style={{height:height*0.2,width:width*0.3, position:'absolute', top:40,right:10}}>
            <RTCView 
              style={{ height:height*0.2, borderRadius:16}}
              mirror={activeFrontCamera ? true : false}
              objectFit={'cover'}
              streamURL={remoteStream?.toURL()}
              zOrder={0}
              
            />
          </View>
        : <View style={{height:height*0.20,width:width*0.3,backgroundColor:'#fff', position:'absolute', top:40,right:10,zIndex:10, borderRadius:16}}>

        </View>
        }

      </View>

    </View>

  )
}
const {width,height} = Dimensions.get('window')
export default WebRTC