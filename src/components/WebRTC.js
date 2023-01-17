import React, {useEffect,useState} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {WebRTCSimple} from 'react-native-webrtc-simple';


const WebRTC = props => {



  useEffect(() => {
      const configuration = {
        optional: null,
        key: Math.random().toString(36).substr(2, 4), //optional
      };
      
      // WebRTCSimple.start(configuration)
      //     .then((status) => {
      //     if (status) {
      //         const stream = WebRTCSimple.getLocalStream();
      //         console.log('My stream: ', stream);

      //         WebRTCSimple.getSessionId((id) => {
      //             console.log('UserId: ', id);
      //         });
      //     }
      //     })
      //     .catch();

      //   WebRTCSimple.listenings.callEvents((type, userData) => {
      //   console.log('Type: ', type);
      //   // START_CALL
      //   // RECEIVED_CALL
      //   // ACCEPT_CALL
      //   // END_CALL
      //   // MESSAGE
      //   // START_GROUP_CALL
      //   // RECEIVED_GROUP_CALL
      //   // JOIN_GROUP_CALL
      //   // LEAVE_GROUP_CALL
      // });

      // WebRTCSimple.listenings.getRemoteStream((remoteStream) => {
      //   console.log('Remote stream', remoteStream);
      // });

  }, []);

  const callToUser = (userId) => {
    const data = {};
    WebRTCSimple.events.call(userId, data);
  };

  const acceptCall = () => {
  WebRTCSimple.events.acceptCall();
  };

  const endCall = () => {
    WebRTCSimple.events.endCall();
  };

  const switchCamera = () => {
    WebRTCSimple.events.switchCamera();
  };

  const video = (enable) => {
    WebRTCSimple.events.videoEnable(enable);
  };

  const audio = (enable) => {
    WebRTCSimple.events.audioEnable(enable);
  };

  const sendMessage = (message) => {
      WebRTCSimple.events.message(message);
  };

  const groupCall = (sessionId) => {
      const data = {};
      WebRTCSimple.events.groupCall(sessionId, data);
  };

  const joinGroup = (groupSessionId) => {
    WebRTCSimple.events.joinGroup(groupSessionId);
  };

  const leaveGroup = () => {
    WebRTCSimple.events.leaveGroup();
  };
  return (
    <View style={{}}>
      <TouchableOpacity>Начать звонок</TouchableOpacity>
    </View>
  )
}

export default WebRTC