import { orders, coupons } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code } = body ?? {}

  if (!code) {
    throw createError({ statusCode: 400, message: 'code is required' })
  }

  const couponsCol = await coupons()
  const coupon = await couponsCol.findOne({ code })

  if (!coupon) {
    throw createError({ statusCode: 404, message: 'Kuponkia ei löydy' })
  }

  const now = Math.floor(Date.now() / 1000)

  if (coupon.redeemedAt) {
    throw createError({ statusCode: 409, data: { redeemedAt: coupon.redeemedAt }, message: 'Kuponki on jo käytetty' })
  }

  if (coupon.expiresAt < now) {
    throw createError({ statusCode: 410, message: 'Kuponki on vanhentunut' })
  }

  const order = await (await orders()).findOne({ _id: coupon.orderId })

  await couponsCol.updateOne({ _id: coupon._id }, { $set: { claimedAt: now, redeemedAt: now } })

  return { success: true, orderNumber: order?.orderNumber, regPlate: order?.regPlate, redeemedAt: now }
})
