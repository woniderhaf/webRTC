
import React, { useEffect, useState, useRef } from 'react'
import {View,Text, TouchableOpacity, Platform} from 'react-native'
import ACTIONS from '../socket/actions'
import socket from '../socket/socket'
import uuid from 'react-native-uuid'

const Main = props => {
  const [rooms,setRooms] = useState([])
  const goto = (link,data) => props.navigation.navigate(link,data)
  const rootNode = useRef()
  const [data,setData] = useState(null)
  

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      setRooms(rooms)
    })
    socket.on(ACTIONS.ROOM_DATA, data => console.log({data}))

  },[])
  
  const connectionRoom = (roomId) => goto ('Room', {roomId})
  const goRoom =  () => goto('Room', {roomId:data.roomId})
  const createRoom =  () => {
    fetch('http://10.173.8.220:4444/createRoom', 
    { 
      method:'POST',
      // body:JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'Authorization':'eyJhbGciOiJIUzI1NiJ9.bWVkaWNpbmU.O_X9bVp1x9ZPgmvQ_fvEhmBcOi250rXiJzbXl9hO7RM'},
    }
    ).then(res => res.json()).then(res => {setData(res)})
  }
  
  // console.log({data});
  return (
    <View style={{flex:1, marginTop:Platform.OS === 'ios' ? 40:0}}>
      <Text style={{textAlign:'center', marginVertical:40,fontSize:20}}>Активные комнаты</Text>
  
     {rooms.map((roomId,i) =>  (
      <TouchableOpacity key={i} onPress={() => connectionRoom(roomId)} style={{backgroundColor:'gray',marginTop:10 , paddingVertical:10,paddingHorizontal:8}}>
        <Text style={{color:'#FFF',textAlign:'right', fontSize:15}}>{roomId}</Text>
      </TouchableOpacity>
     ))}
   
    {data 
      ?   
        <TouchableOpacity onPress={goRoom}  style={{marginTop:20, marginLeft:16, backgroundColor:'blue', width:140, paddingHorizontal:8,paddingVertical:12,borderRadius:10}}>
          <Text style={{color:'#fff'}}>Перейти в комнату</Text>
        </TouchableOpacity> 
      : 
        <TouchableOpacity onPress={createRoom}  style={{marginTop:20, marginLeft:16, backgroundColor:'blue', width:140, paddingHorizontal:8,paddingVertical:12,borderRadius:10}}>
           <Text style={{color:'#fff'}}>Создать комнату</Text>
        </TouchableOpacity>
      } 


    </View>
  );
}

export default Main