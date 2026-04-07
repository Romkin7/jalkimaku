export interface Order {
  _id: string
  orderNumber: string
  regPlate: string
  odooPartnerId: number | null
  createdAt: number
}

export interface Coupon {
  _id: string
  orderId: string
  code: string
  claimedAt: number | null
  redeemedAt: number | null
  expiresAt: number
}

export interface Admin {
  _id: string
  username: string
  passwordHash: string
  createdAt: number
}
