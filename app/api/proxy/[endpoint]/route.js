export async function GET(request, { params }) {
    const { endpoint } = params;
    
    // Construct the EXACT backend URL
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
  
      const headers = Object.fromEntries(response.headers);
      delete headers['content-encoding'];
      // Mirror the backend response exactly
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          ...Object.fromEntries(response.headers)
        }
      });
      
    } catch (error) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });
    }
  }