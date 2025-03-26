// api/proxy/[endpoint]/route.js
export const config = {
  maxDuration: 30, // Extend to 30 seconds (Vercel Pro limit)
};

export async function GET(request, { params }) {
  const { endpoint } = params;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/metrics/${endpoint}`, {
      headers: { "x-api-key": process.env.API_KEY },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    clearTimeout(timeoutId);
    return new Response(JSON.stringify({
      error: "Backend timeout",
      message: "Service took too long to respond"
    }), { status: 504 });
  }
}