import {io} from 'socket.io-client'

const socket = io('http://192.168.0.114:4444', {transports:['websocket'], });
// const socket = io('https://testms.medmis.ru', {transports:['websocket'], });

export default socket