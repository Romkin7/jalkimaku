function formatExpiry(expiresAt: number): string {
  return new Date(expiresAt * 1000).toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface CouponEmailParams {
  to: string
  name: string | null
  code: string
  orderNumber: string
  expiresAt: number
}

export async function sendCouponEmail(params: CouponEmailParams): Promise<void> {
  const config = useRuntimeConfig()

  if (!config.brevoApiKey) {
    console.warn('[email] BREVO_API_KEY is not configured, skipping coupon email to', params.to)
    return
  }

  const couponUrl = `${config.siteUrl}/coupon/${params.code}`
  const expiryFormatted = formatExpiry(params.expiresAt)
  const greeting = params.name ? `Hei ${params.name},` : 'Hei,'

  const htmlContent = `
    <div style="font-family: 'Sora', Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 8px;">Jälkimaku</p>
      <h1 style="font-size: 1.4rem; margin: 0 0 16px;">${greeting} kuponkisi on valmis!</h1>
      <p style="font-size: 0.95rem; line-height: 1.5; margin: 0 0 20px;">
        Kiitos rengasostoksestasi! Saat ilmaisen aterian MR PASTRAMIlla (Espoo WESTEND) tilausnumerolla
        <strong>${params.orderNumber}</strong>.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; font-family: monospace; font-size: 1.5rem; font-weight: 700; letter-spacing: 0.2em; color: #003087; background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 8px; padding: 12px 24px;">
          ${params.code}
        </div>
      </div>
      <p style="font-size: 0.95rem; line-height: 1.5; margin: 0 0 20px;">
        Kuponki on voimassa <strong>${expiryFormatted}</strong> asti. Näytä koodi tai alla oleva linkki ravintolassa
        aterian yhteydessä, niin henkilökunta aktivoi sen puolestasi.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${couponUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; font-weight: 700; border-radius: 8px; padding: 12px 28px;">
          Näytä kuponki
        </a>
      </div>
      <p style="font-size: 0.8rem; line-height: 1.5; color: #6b7280; margin: 0;">
        Voit myös tallentaa tämän linkin ja avata sen ravintolassa: ${couponUrl}
      </p>
    </div>
  `

  const textContent = `${greeting}\n\nKuponkisi on valmis! Koodi: ${params.code}\nVoimassa ${expiryFormatted} asti.\nNäytä koodi tai avaa linkki ravintolassa: ${couponUrl}\n\nTilausnumero: ${params.orderNumber}`

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.brevoApiKey as string,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: config.emailFromName, email: config.emailFromAddress },
      to: [{ email: params.to, name: params.name ?? undefined }],
      subject: 'Kuponkisi on valmis – Jälkimaku',
      htmlContent,
      textContent,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo send failed (${response.status}): ${body}`)
  }
}
