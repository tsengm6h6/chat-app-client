import { io } from 'socket.io-client'
import { socketEvent } from './event'

// 負責提供連線後的 socket
export const socket = io(`${process.env.REACT_APP_SERVER_URL}`)

export const initSocket = ({ setValue }) => {
  console.log('socket init')
  socketEvent({ setValue })
}