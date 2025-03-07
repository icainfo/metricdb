export async function GET(request, { params }) {
    const { endpoint } = params;
    const apiKey = process.env.API_KEY;
  
    try {
      // Convert kebab-case to snake_case and add metrics suffix
      const formattedEndpoint = `${endpoint.replace(/-/g, '_')}_metrics_${endpoint.replace(/-/g, '_')}_get`;
      const baseUrl = process.env.BACKEND_API_URL;
      
      console.log(`[PROXY] Calling endpoint: ${baseUrl}/metrics/${formattedEndpoint}`);
      
      const response = await fetch(`${baseUrl}/metrics/${formattedEndpoint}`, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PROXY ERROR] ${formattedEndpoint}:`, errorText);
        throw new Error(`API responded with ${response.status}`);
      }
      
      const data = await response.json();
      return Response.json(data);
      
    } catch (error) {
      console.error(`[PROXY CRITICAL ERROR] ${endpoint}:`, error.message);
      return Response.json({ 
        error: "Failed to fetch data",
        endpoint,
        internalError: error.message
      }, { status: 500 });
    }
  }