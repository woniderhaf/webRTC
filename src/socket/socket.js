import {io} from 'socket.io-client'

const socket = io('http://192.168.0.108:4444', {transports:['websocket'], });

export default socket