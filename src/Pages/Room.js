import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, StatusBar } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RTCView, V } from 'react-native-webrtc'
import useWebRTC from '../hooks/useWebRTC'
import InCallManager from 'react-native-incall-manager'
import socket from '../socket/socket'
import Sound from 'react-native-sound'
import callOffIco from '../../assets/callOff.svg'
import { Svg, SvgXml } from 'react-native-svg'

// icons
const icons = {
  callOff: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="36" fill="#EF4444"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9957 35.0023C27.5347 35.0035 31.4684 40.8568 26.0824 40.8587C20.8888 40.8594 18.8759 41.832 18.8768 35.2517C18.9577 34.5083 17.5914 27.9044 35.9955 27.9018C54.4019 27.8992 53.0406 34.5036 53.1213 35.247C53.1215 41.8443 51.1089 40.8541 45.9153 40.8548C40.5282 40.8556 44.4566 35.0011 35.9957 35.0023Z" fill="white"/></svg>`,
  camera: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9999 41.6673V41.6673C32.8705 41.6673 30.3333 39.1301 30.3333 36.0007V27.5007C30.3333 24.3712 32.8705 21.834 35.9999 21.834V21.834C39.1293 21.834 41.6666 24.3712 41.6666 27.5007V36.0007C41.6666 39.1301 39.1293 41.6673 35.9999 41.6673Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M45.9166 34.584V35.859C45.9166 41.4137 41.4768 45.9173 35.9999 45.9173V45.9173C30.5231 45.9173 26.0833 41.4137 26.0833 35.859V34.584" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 27.4993H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.5833 31.7494H37.4166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 36.0423H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.0001 45.916V50.166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M31.75 50.1673H40.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  micro: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M37.5937 44.1452H26.4375C24.6766 44.1452 23.25 42.7186 23.25 40.9577V31.041C23.25 29.2801 24.6766 27.8535 26.4375 27.8535H37.5937C39.3547 27.8535 40.7812 29.2801 40.7812 31.041V40.9577C40.7812 42.7186 39.3547 44.1452 37.5937 44.1452Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40.7812 37.554L46.1575 41.8805C47.2002 42.7206 48.75 41.9783 48.75 40.6395V31.3604C48.75 30.0216 47.2002 29.2793 46.1575 30.1194L40.7812 34.4459" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

}

// start
const Room = ({route,navigation}) => {


  const {roomId} = route.params
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
      clearInterval(timerRef.current)
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
      <View style={{position:'relative',justifyContent:'flex-end',flex:1,backgroundColor:'#60B768' }}>
        <StatusBar backgroundColor={'#60B768'}/>
       {clients.length > 1 ? <View style={{position:'absolute', top:40,width, zIndex:2000}}>
          <Text style={{color:'#000', fontSize:22,fontWeight:'500',textAlign:'center'}}>{redactorTimer(timer)}</Text>
        </View> : null}


        {remoteStream ? 
          <View style={[s.fullRTCView]}>
          {/* <View style={{width:140,height:200, position:'absolute', top:40,right:12, borderRadius:20, zIndex:100}}> */}
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

        {remoteStream ? 
        // <View style={{position:'absolute',width,height:height-100,top:0,left:0}}>
          <RTCView
        streamURL={remoteStream}
        style={{width:140,height:200, position:'absolute', top:40,right:12, borderRadius:20}}
        // style={{width:'100%',height:'100%'}}
        mirror={false}
        objectFit='cover'
        zOrder={1}
        />
        // </View>
         : null}

        <View 
          style={{ justifyContent:'center', paddingHorizontal:16,marginBottom:48, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}
        >

          <TouchableOpacity  onPress={cameraRotate} >
          <SvgXml xml={icons.micro}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={changeCamera} >
            <SvgXml xml={icons.camera}/>
          </TouchableOpacity>

          {/* <TouchableOpacity  onPress={changeAudio} style={{height:50,width:50}}>
          <SvgXml xml={icons.callOff}/>
          </TouchableOpacity> */}

          <TouchableOpacity  onPress={callOff}>
            <SvgXml xml={icons.callOff}/>
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