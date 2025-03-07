export async function GET(request, { params }) {
    const { endpoint } = params;
    const apiKey = process.env.API_KEY;
  
    try {
      const formattedEndpoint = endpoint.replace(/-/g, '_');
      const baseUrl = process.env.BACKEND_API_URL;
      
      const apiUrl = `${baseUrl}/metrics/${formattedEndpoint}`;
      console.log(`Proxying request to: ${apiUrl}`);
  
      const response = await fetch(apiUrl, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        console.error(`API responded with ${response.status}: ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error(`Proxy error for ${endpoint}:`, error.message);
      return Response.json({ 
        error: "Failed to fetch data",
        endpoint,
        message: error.message
      }, { status: 500 });
    }
  }