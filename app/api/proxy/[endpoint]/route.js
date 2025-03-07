export async function GET(request, { params }) {
    const { endpoint } = params;
    
    // Keep the original kebab-case format
    const backendUrl = `${process.env.BACKEND_API_URL}/metrics/${endpoint}`;
    
    try {
      const response = await fetch(backendUrl, {
        headers: {
          "X-API-Key": process.env.API_KEY,
          "Content-Type": "application/json"
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