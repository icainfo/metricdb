export async function GET(request, { params }) {
    const { endpoint } = params;
    const apiKey = process.env.API_KEY;
  
    try {
      // Convert hyphens to underscores for API endpoint compatibility
      const formattedEndpoint = endpoint.replace(/-/g, '_');
      const baseUrl = process.env.BACKEND_API_URL || 'https://metricapi-f7n6.onrender.com';
      
      const response = await fetch(`${baseUrl}/metrics/${formattedEndpoint}`, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error(`Proxy error: ${error.message}`);
      return Response.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  }