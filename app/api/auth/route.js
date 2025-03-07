export async function POST(request) {
    const { password } = await request.json();
    
    if (password === process.env.AUTH_PASSWORD) {
      return Response.json({ success: true });
    }
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }