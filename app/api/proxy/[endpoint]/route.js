export async function GET(request, { params }) {
  const { endpoint } = params;

  const backendUrl = new URL(
    `/metrics/${endpoint}`,
    process.env.BACKEND_API_URL
  ).toString();

  try {
    const response = await fetch(backendUrl, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData?.error || `API returned status ${response.status}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const raw = await response.text(); // decode safely
    return new Response(raw, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
