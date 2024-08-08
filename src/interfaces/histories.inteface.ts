export interface History {
  id?: string
  createdAt?: string
  amount?: number
  type?: string
  match?: Match
}

export interface Match {
  id?: string
  table?: Table
}

export interface Table {
  id?: string
  name?: string
}
