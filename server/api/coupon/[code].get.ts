import { orders, coupons } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({ statusCode: 400, message: 'code is required' })
  }

  const coupon = await (await coupons()).findOne({ code })

  if (!coupon) {
    throw createError({ statusCode: 404, message: 'Kuponkia ei löydy' })
  }

  const order = await (await orders()).findOne({ _id: coupon.orderId })

  return {
    code: coupon.code,
    expiresAt: coupon.expiresAt,
    orderNumber: order?.orderNumber ?? null,
  }
})
