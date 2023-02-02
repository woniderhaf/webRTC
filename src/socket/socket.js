import {io} from 'socket.io-client'

// const socket = io('http://192.168.0.104:4444', {transports:['websocket'], });
// const socket = io('http://192.168.0.113:4444', {transports:['websocket'], });
const socket = io('http://10.173.8.220:4444', {transports:['websocket'], });

// const socket = io('http://localhost:4444', {transports:['websocket'], });
export default socket