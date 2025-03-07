export async function GET(request, { params }) {
    const { endpoint } = params;
    const backendUrl = `${process.env.BACKEND_API_URL}/metrics/${endpoint}`;
  
    try {
      const response = await fetch(backendUrl, {
        headers: {
          "x-api-key": process.env.API_KEY // Must be lowercase
        }
      });
  
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Proxy error",
        message: error.message
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }