export async function GET() {
  // In production, set RAZORPAY_KEY_ID in Project Settings → Environment Variables
  const key = process.env.RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag"
  return Response.json({ key })
}
