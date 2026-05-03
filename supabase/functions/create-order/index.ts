/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    console.log("🟢 FUNCTION HIT")

    // ✅ Read secrets INSIDE serve only
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")

    console.log("KEY_ID exists:", !!RAZORPAY_KEY_ID)
    console.log("SECRET exists:", !!RAZORPAY_KEY_SECRET)

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured")
    }

    const body = await req.json()
    const amt = Number(body.amount)

    if (!amt || isNaN(amt) || amt <= 0) {
      throw new Error("Invalid amount")
    }

    // ✅ Simple btoa, Math.round for paise
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amt * 100),
        currency: "INR",
        receipt: `booking_${Date.now()}`,
      }),
    })

    const data = await response.json()
    console.log("📬 Razorpay status:", response.status)
    console.log("📬 Razorpay response:", JSON.stringify(data))

    if (!response.ok) {
      throw new Error(data?.error?.description || "Failed to create order")
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    console.error("❌ Error:", error?.message)
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})