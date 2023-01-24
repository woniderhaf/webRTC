
import React, { useEffect, useState, useRef } from 'react'
import {View,Text, TouchableOpacity, Platform} from 'react-native'
import ACTIONS from '../socket/actions'
import socket from '../socket/socket'
import uuid from 'react-native-uuid'

const Main = props => {
  const [rooms,setRooms] = useState([])
  const goto = (link,data) => props.navigation.navigate(link,data)
  const rootNode = useRef()

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      setRooms(rooms)
    })

  },[])
  
  const connectionRoom = (roomId) => goto('Room', {roomId})
  const createRoom =  () => goto('Room', {roomId:uuid.v4()})
  

  return (
    <View style={{flex:1, marginTop:Platform.OS === 'ios' ? 40:0}}>
      <Text style={{textAlign:'center', marginVertical:40,fontSize:20}}>Активные комнаты</Text>
  
     {rooms.map((roomId,i) =>  (
      <TouchableOpacity key={i} onPress={() => connectionRoom(roomId)} style={{backgroundColor:'gray',marginTop:10 , paddingVertical:10,paddingHorizontal:8}}>
        <Text style={{color:'#FFF',textAlign:'right', fontSize:15}}>{roomId}</Text>
      </TouchableOpacity>
     ))}
      <TouchableOpacity onPress={createRoom}  style={{marginTop:20, marginLeft:16, backgroundColor:'blue', width:140, paddingHorizontal:8,paddingVertical:12,borderRadius:10}}>
      <Text style={{color:'#fff'}}>Создать комнату</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Main