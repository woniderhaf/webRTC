import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, Image, StatusBar, TouchableOpacity, Platform, TextInput , Linking, Modal} from 'react-native'

// img 
import employeeAvatar from '../../assets/employeeAvatar.jpg'

import { RTCView,  } from 'react-native-webrtc'
import useWebRTC from '../hooks/useWebRTC'
import socket from '../socket/socket'

//plug-ins
import RNFetchBlob from 'rn-fetch-blob'
import InCallManager from 'react-native-incall-manager'
import Sound from 'react-native-sound'
import {MotiView} from 'moti'
import DocumentPicker from 'react-native-document-picker'
import { SvgXml } from 'react-native-svg'
import { Easing } from 'react-native-reanimated'
import BottomSheet, { useBottomSheetTimingConfigs }  from '@gorhom/bottom-sheet'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

// icons
const icons = {
  callOff: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="36" fill="#EF4444"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9957 35.0023C27.5347 35.0035 31.4684 40.8568 26.0824 40.8587C20.8888 40.8594 18.8759 41.832 18.8768 35.2517C18.9577 34.5083 17.5914 27.9044 35.9955 27.9018C54.4019 27.8992 53.0406 34.5036 53.1213 35.247C53.1215 41.8443 51.1089 40.8541 45.9153 40.8548C40.5282 40.8556 44.4566 35.0011 35.9957 35.0023Z" fill="white"/></svg>`,
  camera: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M35.9999 41.6673V41.6673C32.8705 41.6673 30.3333 39.1301 30.3333 36.0007V27.5007C30.3333 24.3712 32.8705 21.834 35.9999 21.834V21.834C39.1293 21.834 41.6666 24.3712 41.6666 27.5007V36.0007C41.6666 39.1301 39.1293 41.6673 35.9999 41.6673Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M45.9166 34.584V35.859C45.9166 41.4137 41.4768 45.9173 35.9999 45.9173V45.9173C30.5231 45.9173 26.0833 41.4137 26.0833 35.859V34.584" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 27.4993H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.5833 31.7494H37.4166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.2917 36.0423H36.7084" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M36.0001 45.916V50.166" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M31.75 50.1673H40.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  micro: `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M37.5937 44.1452H26.4375C24.6766 44.1452 23.25 42.7186 23.25 40.9577V31.041C23.25 29.2801 24.6766 27.8535 26.4375 27.8535H37.5937C39.3547 27.8535 40.7812 29.2801 40.7812 31.041V40.9577C40.7812 42.7186 39.3547 44.1452 37.5937 44.1452Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40.7812 37.554L46.1575 41.8805C47.2002 42.7206 48.75 41.9783 48.75 40.6395V31.3604C48.75 30.0216 47.2002 29.2793 46.1575 30.1194L40.7812 34.4459" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  microBig: `<svg width="100" height="100" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="72" height="72" rx="36" fill="#4EA356"/><path fill-rule="evenodd" clip-rule="evenodd" d="M37.5937 44.1452H26.4375C24.6766 44.1452 23.25 42.7186 23.25 40.9577V31.041C23.25 29.2801 24.6766 27.8535 26.4375 27.8535H37.5937C39.3547 27.8535 40.7812 29.2801 40.7812 31.041V40.9577C40.7812 42.7186 39.3547 44.1452 37.5937 44.1452Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40.7812 37.554L46.1575 41.8805C47.2002 42.7206 48.75 41.9783 48.75 40.6395V31.3604C48.75 30.0216 47.2002 29.2793 46.1575 30.1194L40.7812 34.4459" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  callOffSmall:`<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="26" fill="#EF4444"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.9969 25.2794C19.8862 25.2803 22.7272 29.5077 18.8373 29.5091C15.0864 29.5096 13.6326 30.212 13.6333 25.4596C13.6917 24.9227 12.7049 20.1531 25.9968 20.1513C39.2903 20.1494 38.3071 24.9192 38.3654 25.4561C38.3656 30.2209 36.912 29.5057 33.1611 29.5063C29.2704 29.5068 32.1076 25.2786 25.9969 25.2794Z" fill="white"/></svg>`,
  rotateCamera:`<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="52" height="52" rx="26" fill="#F5F5F7"/><path d="M31.8333 27.166L30.6667 28.3327L29.5 27.166" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.5407 28.2073C30.6177 27.8713 30.6667 27.526 30.6667 27.1667C30.6667 24.5895 28.5772 22.5 26 22.5C25.0095 22.5 24.0949 22.8127 23.3389 23.3388" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M36.5 22.4993V32.9993C36.5 34.2885 35.4558 35.3327 34.1667 35.3327H17.8333C16.5442 35.3327 15.5 34.2885 15.5 32.9993V22.4993C15.5 21.2102 16.5442 20.166 17.8333 20.166H20.1667L21.8723 17.2447C22.0812 16.8865 22.465 16.666 22.8803 16.666H29.0683C29.4778 16.666 29.857 16.8807 30.0682 17.2307L31.8333 20.166H34.1667C35.4558 20.166 36.5 21.2102 36.5 22.4993Z" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.1665 27.1667L21.3332 26L22.4998 27.1667" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.4595 26.125C21.3825 26.461 21.3335 26.8063 21.3335 27.1657C21.3335 29.7428 23.423 31.8323 26.0002 31.8323C26.9907 31.8323 27.9053 31.5197 28.6613 30.9935" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  changeCamera:`<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="52" height="52" rx="26" fill="#F5F5F7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M27.3125 32.7077H18.125C16.6748 32.7077 15.5 31.5328 15.5 30.0827V21.916C15.5 20.4658 16.6748 19.291 18.125 19.291H27.3125C28.7627 19.291 29.9375 20.4658 29.9375 21.916V30.0827C29.9375 31.5328 28.7627 32.7077 27.3125 32.7077Z" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.9375 27.2789L34.365 30.8419C35.2237 31.5337 36.5 30.9224 36.5 29.8199V22.1782C36.5 21.0757 35.2237 20.4644 34.365 21.1562L29.9375 24.7192" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  changeAudio:`<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="52" height="52" rx="26" fill="#F5F5F7"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26.0002 30.6673V30.6673C23.423 30.6673 21.3335 28.5778 21.3335 26.0007V19.0007C21.3335 16.4235 23.423 14.334 26.0002 14.334V14.334C28.5773 14.334 30.6668 16.4235 30.6668 19.0007V26.0007C30.6668 28.5778 28.5773 30.6673 26.0002 30.6673Z" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.1668 24.834V25.884C34.1668 30.4585 30.5105 34.1673 26.0002 34.1673V34.1673C21.4898 34.1673 17.8335 30.4585 17.8335 25.884V24.834" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.4165 18.9993H26.5832" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.8335 22.4993H27.1668" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.4165 26.0345H26.5832" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.9998 34.166V37.666" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.5 37.6673H29.5" stroke="#838B97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  clip: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.87894 16.9484L15.5358 11.2916C16.3179 10.5095 16.3207 9.24239 15.5415 8.4575V8.4575C14.7587 7.66766 13.4817 7.66483 12.6953 8.45113L7.7456 13.4009" stroke="#838B97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.293 5.6348L4.89369 12.0341" stroke="#838B97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3643 12.7071L13.4145 17.6568" stroke="#838B97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.87895 16.9497L9.52539 17.3033C8.15856 18.6701 5.94248 18.6701 4.57565 17.3033V17.3033C3.20881 15.9365 3.20881 13.7204 4.57565 12.3536L4.9292 12" stroke="#838B97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3641 12.7062V12.7062C20.3165 10.7539 20.3165 7.58746 18.3641 5.63514V5.63514C16.4118 3.68282 13.2454 3.68282 11.2931 5.63514V5.63514" stroke="#838B97" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}

// start
const Room = ({route,navigation}) => {


  const {roomId} = route.params

  const {
    changeAudio:useChangeAudio,
    changeCamera:useChangeCamera,
    callEnd,
    rotateCamera,
    soketAddFile,
    localMediaStream,
    peerConnections,
    isCallEnd,
    roomData,
    clients,
  } = useWebRTC(roomId)

  const [isFrontCamera,setIsFrontCamera] = useState(true)
  const [isCamera,setIsCamera] = useState(true)
  const [isAudio,setIsAudio] = useState(true)

  const [error,setError] = useState(false)
  const [timer,setTimer] = useState(0)

  const [errorAudio,setErrorAudio] = useState(false)
  const [errorCamera,setErrorCamera] = useState(false)

  const [file,setFile] = useState(null)

  const callOffMp3 = new Sound('call_off.mp3', Sound.MAIN_BUNDLE, error => {})

  let timerRef = useRef(null)
  const panel = useRef(null)
  useEffect(() => {
    if(clients.length > 1) {
      panel.current.snapToIndex(0)
      changeColor('white')
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      panel.current.close()
      changeColor('#60B768')
      clearInterval(timerRef.current)
    }
  }, [clients])




  const changeColor = async(color) => {
    if(Platform.OS === 'android') {
      await changeNavigationBarColor(color)
    } 
  }

  useEffect(() => {
    callOffMp3.setNumberOfLoops(-1)
    InCallManager.start({media:'audio'})
    socket.on('ROOM-FULL', (res) => {
      res.code === 501 ? setError(true):null
    })    
    changeColor('#60B768')
    return () => {
      callOffMp3.stop()
      InCallManager.stop()
      changeColor('white')
      clearInterval(timerRef.current)
    }
  },[])
 

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
  const changeAudio =  async() => {
    const res = await useChangeAudio(!isAudio)
    if(res) {
      setIsAudio(prevState => !prevState)
    } else {
      setErrorAudio(true)
    }
  }
  const changeCamera = async () => {
    const res = await useChangeCamera(!isCamera)
    if(res) {
      setIsCamera(prev => !prev)
    } else {
      setErrorCamera(true)
    }
  }

  const callOff = () => {
    callEnd()
    callOffMp3.play(s => {
      navigation.navigate('Main')
    })
    // setIsCallEnd(false)
  }
  const redactorTimer = time => {
    let seconds = time < 59 ? time : time - 60*Math.floor(time/60)
    let minutes = (time / 60) >= 1 ? Math.floor(time/60) : 0
    const times = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` :seconds}`
    return times
  }
  const addFiles = async () => {
    const res = await DocumentPicker.pick({presentationStyle: 'fullScreen', type:['image/jpeg','image/png', 'image/webp', 'application/pdf', 'application/msword']})
    const uri = res[0].uri
    const base64 = await RNFetchBlob.fs.readFile(uri,'base64')
    setFile({name:res[0].name, base64, type:res[0].type})
  }

  useEffect(() => {
    if(isCallEnd) {
      setTimeout(() => {
        navigation.navigate('Main')
      }, 2000)
    }
  },[isCallEnd])
  const openSettings = async () => {
    await Linking.openSettings()
    setErrorAudio(false)
  }
  return (
    <>
       
    {isCallEnd ? <View style={{position:'absolute', left:0, top:0,right:0,bottom:0, backgroundColor: 'rgba(0,0,0, 0.7)', zIndex:400, justifyContent:'space-around'}}>
      <View/>
      <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:-100}}>Сеанс завершен</Text>
      <View/>
    </View> : null}
       
    {error ? 
      <View 
        style={{backgroundColor:'gray', position:'absolute', top:height/3, right:width/4, width:width/2,height:height/5,justifyContent:'space-between'}}
      >
        <Text style={{color:'white', fontSize:20,textAlign:'center'}}>Комната переполнена</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color:'white', fontSize:20,textAlign:'center'}}>Выйти</Text>
        </TouchableOpacity>
      </View> 
    : 
      <View style={{position:'relative',justifyContent:'flex-end',flex:1,backgroundColor:'#60B768' }}>
      {clients.length > 1 || isCallEnd ? <StatusBar backgroundColor={'transparent'} translucent/> :  <StatusBar backgroundColor={'#60B768'}/>}
       {clients.length > 1 ? <View style={{position:'absolute', top:40,width, zIndex:2000}}>
          <Text style={{color:'#000', fontSize:22,fontWeight:'500',textAlign:'center'}}>{redactorTimer(timer)}</Text>
        </View> : null}



        {remoteStream ? 
          <View style={[s.fullRTCView]}>
          {/* <View style={{width:140,height:200, position:'absolute', top:40,right:12, borderRadius:20, zIndex:100}}> */}
            <RTCView
            streamURL={remoteStream}
            style={{width:'100%',height:'100%'}}
            // style={{width:140,height:200, position:'absolute', top:40,right:20, borderRadius:20}}
            mirror={false}
            objectFit='cover'
            zOrder={100}
          /> 
          </View>
          : 
            <View style={{position:'absolute', top:130,left:0,right:0, alignItems:'center'}}>
              <Text style={{textAlign:'center', color:'#FFF',fontSize:16,fontWeight:'400'}}>Соединение...</Text>
              <View style={{marginTop:56}}>
              {[...Array(3).keys()].map(index => {
                return <MotiView
                  transition={{type:'timing', duration:2000,easing:Easing.out(Easing.ease), delay:500*index, loop:Infinity}}
                  from={{opacity:1,scale:1}}
                  animate={{opacity:0,scale:2}}
                  
                  key={index}
                  style={[
                    StyleSheet.absoluteFillObject,s.dot
                  ]}
                />
              })}
              {/* <SvgXml xml={icons.microBig}  style={{}}/> */}
              <Image source={roomData?.employee_avatar_url || employeeAvatar} style={{width:100,height:100,borderRadius:100}}/>
              </View>

            </View>
          }

        {remoteStream ? 
        <View style={{position:'absolute',width:108,height:144,bottom:194,right:20,borderRadius:12,overflow:'hidden'}}>
          <RTCView
            streamURL={localMediaStream.current.toURL()}
            style={{width:'100%',height:'100%', borderRadius:12}}
            mirror={isFrontCamera}
            objectFit='cover'
            zOrder={1}
          />
         </View>
         : null}

        <View 
          style={{ justifyContent:'center', paddingHorizontal:16,marginBottom:48, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}
        >

          <TouchableOpacity  onPress={changeAudio} >
          <SvgXml xml={icons.micro}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={changeCamera} >
            <SvgXml xml={icons.camera}/>
          </TouchableOpacity>

          <TouchableOpacity  onPress={callOff}>
            <SvgXml xml={icons.callOff}/>
          </TouchableOpacity>

        </View>

        <View style={{position:'absolute', left:0,top:0,right:0,bottom:0}}>
          <Modal
            animationType='slide'
            visible={errorAudio}
            transparent={true}
          >
            <View style={{
                width:270,height:80,
                padding:20,
                borderRadius:10, backgroundColor:'white', 
                alignSelf:'center',
                marginTop:height/3,
                shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4, elevation:5
              }}
            >
              <TouchableOpacity onPress={() => setErrorAudio(false)} style={{ position:'absolute', top:0,right:0}}>
                <Text style={{textAlign:'right', padding:10}}>&times;</Text>
              </TouchableOpacity>
              <Text style={{textAlign:'center'}}>Возможно вы запретили аудио</Text>
              <TouchableOpacity onPress={openSettings}>
                <Text style={{textAlign:'center', fontWeight:'600',fontSize:20, textDecorationLine:'underline'}}>перейти в настройки</Text>
              </TouchableOpacity>
            </View>

          </Modal>
        </View>

        <View style={{position:'absolute', left:0,top:0,right:0,bottom:0}}>
          <Modal
            animationType='slide'
            visible={errorCamera}
            transparent={true}
          >
            <View style={{
                width:270,height:80,
                padding:20,
                borderRadius:10, backgroundColor:'white', 
                alignSelf:'center',
                marginTop:height/3,
                shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4, elevation:5
              }}
            >
              <TouchableOpacity onPress={() => setErrorCamera(false)} style={{ position:'absolute', top:0,right:0}}>
                <Text style={{textAlign:'right', padding:10}}>&times;</Text>
              </TouchableOpacity>
              <Text style={{textAlign:'center'}}>Возможно вы запретили видео</Text>
              <TouchableOpacity onPress={openSettings}>
                <Text style={{textAlign:'center', fontWeight:'600',fontSize:20, textDecorationLine:'underline'}}>перейти в настройки</Text>
              </TouchableOpacity>
            </View>

          </Modal>
        </View>

        <View style={{position:'absolute', left:0,top:0,right:0,bottom:0}}>
          <Modal
            animationType='slide'
            visible={!!file}
            transparent={true}
          >
            <View style={{
                width:width-32,height:120,
                padding:20,
                paddingBottom:0,
                borderRadius:10, backgroundColor:'white', 
                alignSelf:'center',
                marginTop:height/3,
                shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.25, shadowRadius:4, elevation:5
              }}
            >
              
              <Text style={{textAlign:'center'}}>Отправить файл</Text>
              <Text style={{textAlign:'center', fontWeight:'600',fontSize:20, textDecorationLine:'underline'}}>{file?.name}</Text>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20}}>
                <TouchableOpacity onPress={() => setFile(null)}>
                  <Text style={{textAlign:'center', fontWeight:'500',fontSize:15}}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {soketAddFile(file); setFile(null) }}>
                  <Text style={{textAlign:'center', fontWeight:'500',fontSize:15}}>Да</Text>
                </TouchableOpacity>
              </View>

            </View>

          </Modal>
        </View>


        <BottomSheet
          ref={panel}
          snapPoints={[130]}
          animationConfigs={() => useBottomSheetTimingConfigs({easing: Easing.linear, duration:1000})}
          index={-1}
          handleStyle={{display:'none'}}
          // handleIndicatorStyle={{width:40,backgroundColor:'rgba(0,0,0,0.1)'}}
          // handleHeight={4}
          
        >
          <View style={{ height:'100%',width:'100%', paddingHorizontal:20, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            
            {isAudio ? <TouchableOpacity onPress={changeAudio} >
              <SvgXml xml={icons.changeAudio}/>
            </TouchableOpacity> : null}

            {!isAudio ? <TouchableOpacity onPress={changeAudio} style={{opacity:0.5}}>
              <SvgXml xml={icons.changeAudio}/>
            </TouchableOpacity> : null}

            { isCamera ? <TouchableOpacity onPress={changeCamera}>
              <SvgXml xml={icons.changeCamera}/>
            </TouchableOpacity> : null}

            { !isCamera ? <TouchableOpacity onPress={changeCamera} style={{opacity:0.5}}>
              <SvgXml xml={icons.changeCamera}/>
            </TouchableOpacity> : null}

            <TouchableOpacity onPress={cameraRotate}>
              <SvgXml xml={icons.rotateCamera}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={addFiles} style={{padding:16, borderRadius:52,backgroundColor:'#F5F5F7'}}>
              <SvgXml xml={icons.clip} style={{}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={callOff} >
              <SvgXml xml={icons.callOffSmall} />
            </TouchableOpacity>
          </View>
        </BottomSheet>

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
    height,
    overflow:'hidden'
  },
  center:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  dot:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:'#FFF',
    position:'absolute',
    top:0,
    left:0
  }
}
  
)
export default Room