import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import type { User } from '@/interfaces/user.inteface'
import type { History } from '@/interfaces/histories.inteface'
import type { BanksHistory } from '@/interfaces/bank.histories.inteface'

export const users = ref<User[]>([])
export const histories = ref<History[]>([])
export const bankHistories = ref<BanksHistory[]>([])

class WebSocketService {
  public socket: Socket | null = null

  connect() {
    const url = import.meta.env.VITE_WS_URL
    const token = localStorage.getItem('token')

    this.socket = io(url, {
      auth: {
        token: token ? `Bearer ${token}` : null
      }
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    this.socket.on('afterCreateUser', (data: any) => {
      this.handleAfterCreateUser(data)
    })

    this.socket.on('afterUpdateUser', (data: any) => {
      this.handleAfterUpdateUser(data)
    })

    this.socket.on('afterDeleteUser', (data: any) => {
      this.handleAfterDeleteUser(data)
    })

    this.socket.on('afterCreateRecharge', (data: any) => {
      this.handleAfterCreateBankHistory(data)
    })

    this.socket.on('afterCreateWithdraw', (data: any) => {
      this.handleAfterCreateBankHistory(data)
    })

    this.socket.on('afterCreateWinMessages', (data: any) => {
      this.handleAfterCreateWinOrLoseHistory(data)
    })

    this.socket.on('afterCreateLoseHistory', (data: any) => {
      this.handleAfterCreateWinOrLoseHistory(data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  handleAfterCreateUser(user: User) {
    if (user.id) {
      const existingIndex = users.value.findIndex((u) => u.id === user.id)
      if (existingIndex === -1) {
        users.value.unshift(user)
      } else {
        users.value.splice(existingIndex, 1)
      }
    }
  }

  handleAfterUpdateUser(user: User) {
    if (user.id) {
      const existingIndex = users.value.findIndex((u) => u.id === user.id)
      if (existingIndex !== -1) {
        users.value.splice(existingIndex, 1)
      }
      users.value.unshift(user)
    }
  }

  handleAfterDeleteUser(user: User) {
    users.value = users.value.filter((u) => u.id !== user.id)
  }

  handleAfterCreateBankHistory(bankHistory: BanksHistory) {
    if (bankHistory.id) {
      const existingIndex = bankHistories.value.findIndex((b) => b.id === bankHistory.id)
      if (existingIndex === -1) {
        histories.value.unshift(bankHistory)
      } else {
        histories.value.splice(existingIndex, 1)
      }
    }
  }

  handleAfterCreateWinOrLoseHistory(history: History) {
    if (history.id) {
      const existingIndex = histories.value.findIndex((h) => h.id === history.id)
      if (existingIndex === -1) {
        histories.value.unshift(history)
      } else {
        histories.value.splice(existingIndex, 1)
      }
    }
  }
}

const webSocketService = new WebSocketService()
export default webSocketService
