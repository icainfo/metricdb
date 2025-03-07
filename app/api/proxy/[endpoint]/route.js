export async function GET(request, { params }) {
    const { endpoint } = params;
    const backendUrl = `${process.env.BACKEND_API_URL}/metrics/${endpoint}`;
  
    console.log(`Proxying to: ${backendUrl}`); // Add this line
  
    try {
      const response = await fetch(backendUrl, {
        headers: {
          "x-api-key": process.env.API_KEY // Match exact header name
        }
      });  
  
      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify(error), { 
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://metricdb.vercel.app"
        }
      });
  
    } catch (error) {
      console.error(`Proxy error: ${error.message}`);
      return new Response(JSON.stringify({
        error: "Proxy failure",
        message: error.message
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }