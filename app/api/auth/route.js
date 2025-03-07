export async function POST(request) {
    const { password } = await request.json();
    
    // Add debug logging (remove after fix)
    console.log('Received password:', password || 'empty');
    console.log('Stored password:', process.env.AUTH_PASSWORD ? '***' : 'not set');
  
    if (password === process.env.AUTH_PASSWORD) {
      return Response.json({ success: true });
    }
    return Response.json({ 
      error: "Invalid credentials",
      debug: {
        received: password,
        expectedLength: process.env.AUTH_PASSWORD?.length || 0
      }
    }, { status: 401 });
  }