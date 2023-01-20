
import React, { useEffect, useState } from 'react'
import {View,Text, TouchableOpacity, Platform} from 'react-native'
import socket from '../socket'



const Main = props => {
  const [rooms,setRooms] = useState([])
  const goto = (link,data) => props.navigation.navigate(link,data)

  const connectionRoom = (roomId) => {
    goto('Room', {roomId})
  }

  useEffect(() => {
    fetch('http://192.168.0.113:4444/rooms/get').then(res => res.json()).then(res => setRooms(res))
  },[])


  return (
    <View style={{flex:1, marginTop:Platform.OS === 'ios' ? 40:0}}>
      <Text style={{textAlign:'center', marginVertical:40,fontSize:20}}>Активные комнаты</Text>
     {rooms.length ? rooms.map((v,i) =>  (
      <TouchableOpacity key={v.id.toString()} onPress={() => connectionRoom(v.id)} style={{backgroundColor:'gray',marginTop:10 , paddingVertical:10,paddingHorizontal:8}}>
        <Text style={{color:'#FFF',textAlign:'right', fontSize:15}}>{v.id}</Text>
      </TouchableOpacity>
     ))  :
      <TouchableOpacity  onPress={() => connectionRoom(1234)} style={{backgroundColor:'gray',marginTop:10 , paddingVertical:10,paddingHorizontal:8}}>
        <Text style={{color:'#FFF',textAlign:'right', fontSize:15}}>1234</Text>
      </TouchableOpacity>}
    </View>
  );
}

export default Main