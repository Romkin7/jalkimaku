import { orders, coupons } from '../../utils/db'
import { sendCouponEmail } from '../../utils/email'

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[-\s]/g, '')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { regPlate } = body ?? {}

  if (!regPlate) {
    throw createError({ statusCode: 400, message: 'regPlate is required' })
  }

  const normalized = normalizePlate(regPlate)
  const now = Math.floor(Date.now() / 1000)

  const order = await (await orders()).findOne({ regPlate: normalized })

  if (!order) {
    throw createError({
      statusCode: 404,
      message: 'Ei löydy voimassa olevaa kuponkia tälle rekisterinumerolle',
    })
  }

  const coupon = await (await coupons()).findOne({
    orderId: order._id,
    redeemedAt: null,
    expiresAt: { $gt: now },
  })

  if (!coupon) {
    throw createError({
      statusCode: 404,
      message: 'Ei löydy voimassa olevaa kuponkia tälle rekisterinumerolle',
    })
  }

  if (order.email) {
    sendCouponEmail({
      to: order.email,
      name: order.customerName,
      code: coupon.code,
      orderNumber: order.orderNumber,
      expiresAt: coupon.expiresAt,
    }).catch((err) => {
      console.error('[coupon/claim] failed to send coupon email:', err)
    })
  }

  return { code: coupon.code, expiresAt: coupon.expiresAt, orderNumber: order.orderNumber }
})
