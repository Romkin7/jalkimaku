# Rengas Center → Jälkimaku webhook integration

Integration instructions for rengascenterilola.fi and klaukkalanrengas.fi to trigger
Jälkimaku coupon creation when a customer buys a full set of 4 new tyres.

## Trigger condition

Call this webhook **once per order**, only when the order is paid and contains
a full set of 4 new tyres. This filtering happens on the Rengas Center side —
Jälkimaku has no visibility into order line items, only what you send it.

## Endpoint

```
POST https://jalkimaku.fi/api/webhook/order
Content-Type: application/json
x-webhook-secret: <shared secret, provided out of band>
```

This must be called server-to-server (from your backend/Odoo, not from browser
JavaScript) — the secret must never be exposed client-side.

## Request body

```json
{
  "order_number": "SO-2026-00142",
  "reg_plate": "ABC-123",
  "partner_id": 4821,
  "email": "asiakas@example.com",
  "customer_name": "Matti Meikäläinen"
}
```

| Field           | Required | Notes                                                                                     |
|-----------------|----------|---------------------------------------------------------------------------------------------|
| `order_number`  | yes      | Must be unique per order. Used as the idempotency key (see below).                          |
| `reg_plate`     | yes      | Any casing/spacing/dashes are fine — normalized server-side.                                |
| `partner_id`    | no       | Odoo partner id, if available.                                                              |
| `email`         | no       | If present, Jälkimaku emails the customer their coupon (code, expiry, activation link) as soon as it's created. If omitted, no email is sent and the customer can still fetch their coupon on jalkimaku.fi with their reg plate. |
| `customer_name` | no       | Used only to personalize the email greeting ("Hei Matti,"). Falls back to a generic greeting if omitted. |

## Responses

- `200` — coupon created:
  ```json
  { "success": true, "orderId": "...", "couponCode": "..." }
  ```
- `200` — order already processed (safe to retry, no duplicate coupon created):
  ```json
  { "success": true, "orderId": "...", "duplicate": true }
  ```
- `400` — missing `order_number` or `reg_plate`
- `401` — missing/incorrect `x-webhook-secret`

## Reliability

The endpoint is idempotent on `order_number` — if a call times out or the
response is lost, retry with the same `order_number` and it will not create a
duplicate coupon.

Coupon creation and the customer email are decoupled: a `200` with
`couponCode` means the coupon was created regardless of whether the email
send succeeded. Email delivery failures are logged server-side and never
turn into a webhook error, so retries are only ever driven by
`order_number`/`reg_plate` correctness, not email deliverability.

## Open questions

- Neither the request payload nor the Jälkimaku order record currently tracks
  *which* site/shop an order came from. If that's needed later for reporting,
  say so and we'll add a `site` field to the webhook and schema.
- **Minimum price: to be defined.** The trigger condition is currently "4 new
  tyres, paid" with no price floor, so a full set of budget tyres qualifies
  the same as a full set of premium ones. If a minimum order value should
  apply, it needs to be decided and enforced on the Rengas Center side (the
  webhook has no visibility into pricing, only what's sent to it).
