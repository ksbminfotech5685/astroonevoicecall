export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    if (!amount || amount < 10) {
      return Response.json({ error: "Invalid amount" }, { status: 400 })
    }

    // In production, use your RAZORPAY_SECRET_KEY to create orders
    // For now, generate a mock order_id for testing
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("[v0] Order created:", { orderId, amount })

    return Response.json({
      orderId,
      amount,
      currency: "INR",
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return Response.json({ error: "Failed to create order" }, { status: 500 })
  }
}
