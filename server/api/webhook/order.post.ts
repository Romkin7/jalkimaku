import { nanoid } from 'nanoid'
import { orders, coupons } from '../../utils/db'

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[-\s]/g, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const secret = getHeader(event, 'x-webhook-secret')
  if (secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { order_number, reg_plate, partner_id } = body ?? {}

  if (!order_number || !reg_plate) {
    throw createError({ statusCode: 400, message: 'order_number and reg_plate are required' })
  }

  const ordersCol = await orders()
  const existing = await ordersCol.findOne({ orderNumber: order_number })

  if (existing) {
    return { success: true, orderId: existing._id, duplicate: true }
  }

  const orderId = nanoid()
  await ordersCol.insertOne({
    _id: orderId,
    orderNumber: order_number,
    regPlate: normalizePlate(reg_plate),
    odooPartnerId: partner_id ?? null,
    createdAt: Math.floor(Date.now() / 1000),
  })

  const expiryDays = parseInt(config.couponExpiryDays as string, 10)
  const expiresAt = Math.floor(Date.now() / 1000) + expiryDays * 86400

  const couponId = nanoid()
  const couponCode = nanoid(10)
  await (await coupons()).insertOne({
    _id: couponId,
    orderId,
    code: couponCode,
    claimedAt: null,
    redeemedAt: null,
    expiresAt,
  })

  return { success: true, orderId, couponCode }
})
