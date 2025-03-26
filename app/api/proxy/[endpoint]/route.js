// Modify the proxy route.js
export async function GET(request, { params }) {
  const { endpoint } = params;
  const backendUrl = new URL(
    `/metrics/${endpoint}`,
    process.env.BACKEND_API_URL
  ).toString();

  try {
    const response = await fetch(backendUrl, {
      headers: {
        "x-api-key": process.env.API_KEY
      }
    });

    // Create a streamed response
    const { readable, writable } = new TransformStream();
    response.body.pipeTo(writable);

    return new Response(readable, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...Object.fromEntries(
          Array.from(response.headers.entries())
            .filter(([key]) => key.toLowerCase() !== 'content-encoding')
        )
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Proxy failure",
      message: error.message
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}