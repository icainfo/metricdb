export async function GET(request, { params }) {
    const { endpoint } = params;
    const apiKey = process.env.API_KEY;
    
    // Convert kebab-case to snake_case for backend endpoints
    const normalizedEndpoint = endpoint.replace(/-/g, '_');
    
    try {
      const backendUrl = `${process.env.BACKEND_API_URL}/metrics/${normalizedEndpoint}`;
      
      const response = await fetch(backendUrl, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Backend responded with ${response.status}`);
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
        error: "Proxy error",
        message: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://metricdb.vercel.app"
        }
      });
    }
}