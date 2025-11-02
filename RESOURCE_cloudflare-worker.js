export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle GET requests (show a friendly status page)
    if (request.method === "GET") {
      return new Response(
        `<html>
          <head><title>L'Oréal Chatbot Worker</title></head>
          <body>
            <h2>L'Oréal Chatbot Worker is running!</h2>
            <p>This endpoint is for POST requests from your app or API client.</p>
            <p>To test, use Postman or your web app.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html", ...corsHeaders },
          status: 200,
        }
      );
    }

    // --- POST logic below ---
    const apiKey = env.OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const userInput = await request.json();

    const requestBody = {
      model: "gpt-4o",
      messages: userInput.messages,
      max_tokens: 300,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), { headers: corsHeaders });
  },
};
