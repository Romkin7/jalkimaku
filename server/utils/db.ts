import { MongoClient } from 'mongodb'
import type { Order, Coupon, Admin } from '../db/schema'

let _client: MongoClient | undefined

async function getClient(): Promise<MongoClient> {
  if (_client) return _client
  _client = new MongoClient(process.env.MONGODB_URI!)
  await _client.connect()
  return _client
}

async function getDb() {
  return (await getClient()).db()
}

export const orders = async () => (await getDb()).collection<Order>('orders')
export const coupons = async () => (await getDb()).collection<Coupon>('coupons')
export const admins = async () => (await getDb()).collection<Admin>('admins')
