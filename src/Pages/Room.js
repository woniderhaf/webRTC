import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { RTCView } from 'react-native-webrtc'
import useWebRTC from '../hooks/useWebRTC'



const Room = props => {
  const {roomId} = props.navigation.state.params
  const {clients, provideMediaRef, localMediaStream,peerConnections} = useWebRTC(roomId)
  const remoteStreams = peerConnections.current[clients[1]]?._remoteStreams
  let remoteStream = null 
  const arr = []
  if(remoteStreams) {
    for (let aaa of remoteStreams.values()) {
      remoteStream =  aaa.toURL()
    }
  }

  return (
    <View>
      {clients.map((clientId,i) => {
        console.log({clientId});
        return clientId != 'LOCAL_VIDEO' ? 
        (
        <React.Fragment key={i}>
          <RTCView
            streamURL={remoteStream}
            style={{width,height:height/clients.length, backgroundColor:'green'}}
            mirror={true}
          />
        </React.Fragment>
      )
      :
        (
        <React.Fragment key={i}>
        {localMediaStream.current 
        ? <RTCView

          streamURL={localMediaStream.current.toURL()}
          // streamURL={remoteStream}
          style={{width,height:height/clients.length,backgroundColor:'red'}}
          mirror={true}
        />
         : null}
        </React.Fragment>
      )
    })}
        
    </View>
  )
}
const {width,height} = Dimensions.get('window')
export default Room