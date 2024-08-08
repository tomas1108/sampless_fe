export interface BanksHistory {
  id?: string
  created_at?: string
  amount?: number
  status?: string
  type?: string
  bank?: Bank
}

export interface Bank {
  id?: string
}
