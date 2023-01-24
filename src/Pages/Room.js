import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RTCView, V } from 'react-native-webrtc'
import useWebRTC from '../hooks/useWebRTC'
import InCallManager from 'react-native-incall-manager'
import socket from '../socket/socket'
import Sound from 'react-native-sound'
import audio from '../../assets/audio.png'
import audioOff from '../../assets/audioOff.png'
import camera from '../../assets/camera.png'
import cameraOff from '../../assets/cameraOff.png'
import cameraRotateIco from '../../assets/cameraRotate.png'
import callOffIco from '../../assets/callOff.png'

const Room = props => {

  const {roomId} = props.navigation.state.params
  const {
    changeAudio:useChangeAudio,
    changeCamera:useChangeCamera,
    clients,
    startCall,
    rotateCamera,
    localMediaStream,
    peerConnections
  } = useWebRTC(roomId)
  const [isFrontCamera,setIsFrontCamera] = useState(true)
  const [isCamera,setIsCamera] = useState(true)
  const [isAudio,setIsAudio] = useState(true)
  const [error,setError] = useState(false)
  const [timer,setTimer] = useState(0)
  const callOffMp3 = new Sound('call_off.mp3', Sound.MAIN_BUNDLE, error => {})
  let timerRef = useRef(null)
  useEffect(() => {
    if(clients.length > 1) {
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
  }, [clients])

  useEffect(() => {
    callOffMp3.setNumberOfLoops(-1)
    InCallManager.start({media:'audio'})
    socket.on('ROOM-FULL', (res) => {
      res.code === 501 ? setError(true):null
    })
 
    return () => {
      callOffMp3.stop()
      InCallManager.stop()
    }
  },[])
  useEffect(() => {
    callTime()
  }, [startCall])

  const callTime = () => {
    //timer
  }
  const remoteStreams = peerConnections.current[clients[1]]?._remoteStreams
  let remoteStream = null 
  if(remoteStreams) {
    for (let RemoteStream of remoteStreams.values()) {
      remoteStream =  RemoteStream.toURL()
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
    useChangeCamera(!isCamera)
    setIsCamera(prev => !prev)
  }

  const callOff = () => {
    callOffMp3.play(s => {
      props.navigation.goBack()
    })
  }
  const redactorTimer = time => {
    let seconds = time < 59 ? time : time - 60*Math.floor(time/60)
    let minutes = (time / 60) >= 1 ? Math.floor(time/60) : 0
    const times = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` :seconds}`
    return times
  }

  return (
    <>
    {error ? 
      <View 
        style={{backgroundColor:'gray', position:'absolute', top:height/3, right:width/4, width:width/2,height:height/5,justifyContent:'space-between'}}
      >
        <Text style={{color:'white', fontSize:20,textAlign:'center'}}>Ошибка</Text>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Text style={{color:'white', fontSize:20,textAlign:'center'}}>Выйти</Text>
        </TouchableOpacity>
      </View> 
    : 
      <View style={{position:'relative',justifyContent:'flex-end',flex:1 }}>

       {clients.length > 1 ? <View style={{position:'absolute', top:40,width, zIndex:2000}}>
          <Text style={{color:'#000', fontSize:22,fontWeight:'500',textAlign:'center'}}>{redactorTimer(timer)}</Text>
        </View> : null}


        {localMediaStream.current ? 
          <View style={[s.fullRTCView]}>
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
        // style={{width,height:height-100, position:'absolute', top:0,right:0}}
        mirror={false}
        objectFit='cover'
        zOrder={100}
        /> : null}

        <View 
          style={{ height: height < 750 ? 75 : 100, justifyContent:'center', paddingHorizontal:16, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}
        >

          <TouchableOpacity  onPress={cameraRotate} style={{height:50,width:50}}>
            <Image source={cameraRotateIco}/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={changeCamera} 
            style={{height:50,width:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}
          >
            <Image source={isCamera? camera : cameraOff}/>
          </TouchableOpacity>

          <TouchableOpacity  onPress={changeAudio} style={{height:50,width:50}}>
            <Image source={isAudio ? audio : audioOff}/>
          </TouchableOpacity>

          <TouchableOpacity  onPress={callOff} style={[{height:60,width:60, backgroundColor:'red', borderRadius:50}, s.center]}>
          <Image source={callOffIco}/>
          </TouchableOpacity>

        </View>

      </View>}
    </>

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