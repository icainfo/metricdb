export async function GET(request, { params }) {
  const { endpoint } = params;

  // Construct the backend URL
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

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const headers = Object.fromEntries(response.headers);
    delete headers['content-encoding']; // Fix content-encoding issue

    // Return the response body with correct headers
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...headers
      }
    });

  } catch (error) {
    // Handle errors gracefully
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
