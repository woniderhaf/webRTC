import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RTCView } from 'react-native-webrtc'
import useWebRTC from '../hooks/useWebRTC'
import InCallManager from 'react-native-incall-manager'

import audio from '../../assets/audio.png'
import audioOff from '../../assets/audioOff.png'
import camera from '../../assets/camera.png'
import cameraOff from '../../assets/cameraOff.png'
import cameraRotateIco from '../../assets/cameraRotate.png'
import callOffIco from '../../assets/callOff.png'

const Room = props => {

  const {roomId} = props.navigation.state.params
  const {clients, rotateCamera, localMediaStream,peerConnections,changeAudio:useChangeAudio,changeCamera:useChangeCamera} = useWebRTC(roomId)
  const [isFrontCamera,setIsFrontCamera] = useState(true)
  const [isCamera,setIsCamera] = useState(true)
  const [isAudio,setIsAudio] = useState(true)

  useEffect(() => {
    InCallManager.start({media:'audio'})
    return InCallManager.stop()
  },[])

  const remoteStreams = peerConnections.current[clients[1]]?._remoteStreams
  let remoteStream = null 
  if(remoteStreams) {
    for (let aaa of remoteStreams.values()) {
      remoteStream =  aaa.toURL()
    }
  }
  const cameraRotate = () => {
    setIsFrontCamera(prevState => !prevState)
    rotateCamera()
  }
  const changeAudio = () => {
    setIsAudio(prevState => !prevState)
    useChangeAudio()
  }
  const changeCamera = () => {
    useChangeCamera(isAudio,!isCamera)
    setIsCamera(prev => !prev)
  }

  const callOff = () => {
    props.navigation.goBack()
  }
  return (
    <View style={{position:'relative',justifyContent:'flex-end',flex:1 }}>

      {/* <View style={{ position:'absolute', top:0,left:0,right:0}}>
        {clients.map((clientId,i) => {
          return clientId === 'LOCAL_VIDEO' ? 
          (
            localMediaStream.current 
            ?
              <RTCView
                key={clientId}
                streamURL={localMediaStream.current.toURL()}
                style={clients.length > 1 ? {width:100,height:200, position:'absolute', top:40,right:20, borderColor:'red',borderWidth:2} : s.fullRTCView}
                mirror={isFrontCamera}
                objectFit='cover'
                zOrder={100}
              />
              : null
          )
          :
          (
              <RTCView
                streamURL={remoteStream}
                style={{width:'100%',height, position:'absolute', top:0,left:0,right:0}}
                mirror={!isFrontCamera}
                objectFit='cover'
                zOrder={1000}
                key={i}
              />

        )
      })}
          
      </View> */}
      
      {localMediaStream.current ? 
      <View style={s.fullRTCView}>
        <RTCView
        streamURL={localMediaStream.current.toURL()}
        style={{width:'100%',height:'100%'}}
        // style={{width:140,height:200, position:'absolute', top:40,right:20, borderRadius:20}}
        mirror={isFrontCamera}
        objectFit='cover'
        zOrder={100}
      /> 
      </View>
      : null}
      {remoteStream ? <RTCView
      streamURL={remoteStream}
      style={{width:140,height:200, position:'absolute', top:40,right:12, borderRadius:20}}
      // style={s.fullRTCView}
      mirror={false}
      objectFit='cover'
      zOrder={100}
    /> : null}
      <View style={{ height: height < 750 ? 75 : 100, justifyContent:'center', paddingHorizontal:16, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>

        <TouchableOpacity  onPress={cameraRotate} style={{height:50,width:50}}>
          <Image source={cameraRotateIco}/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={changeCamera} style={{height:50,width:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <Image source={isCamera? camera : cameraOff}/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={changeAudio} style={{height:50,width:50}}>
          <Image source={isAudio ? audio : audioOff}/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={callOff} style={[{height:60,width:60, backgroundColor:'red', borderRadius:50}, s.center]}>
        <Image source={callOffIco}/>
        </TouchableOpacity>

      </View>


    </View>

  )
}
const {width,height} = Dimensions.get('window')
const s = StyleSheet.create({
  fullRTCView : {
    position:'absolute',
    left:0,
    right:0,
    top:0,
    width,
    height:height - 100,
    borderBottomLeftRadius:32,
    borderBottomRightRadius:32,
    overflow:'hidden'
  },
  center:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
}
  
)
export default Room