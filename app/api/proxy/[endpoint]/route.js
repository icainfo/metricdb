export async function GET(request, { params }) {
    const { endpoint } = params;
    const apiKey = process.env.API_KEY;
    
    try {
      // Use the endpoint as-is, without transformation
      const baseUrl = process.env.BACKEND_API_URL;
      const requestUrl = `${baseUrl}/metrics/${endpoint}`;
      
      console.log(`[PROXY] Calling endpoint: ${requestUrl}`);
      
      const response = await fetch(requestUrl, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PROXY ERROR] ${endpoint}:`, errorText);
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