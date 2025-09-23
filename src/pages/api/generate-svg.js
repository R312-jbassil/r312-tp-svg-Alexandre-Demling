import OpenAI from "openai";

const BASE_URL = import.meta.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const ACCESS_TOKEN = import.meta.env.OPENROUTER_API_KEY;
const MODEL = import.meta.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

export const POST = async ({ request }) => {
  try {
    const { messages } = await request.json();

    const client = new OpenAI({
      baseURL: BASE_URL,
      apiKey: ACCESS_TOKEN,
    });

    const systemMessage = {
      role: "system",
      content:
        "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
    };

    const chatCompletion = await client.chat.completions.create({
      model: MODEL,
      messages: [systemMessage, ...(messages || [])],
    });

    const message = chatCompletion.choices[0].message || { role: "assistant", content: "" };

    const svgMatch = message.content.match(/<svg[\s\S]*?<\/svg>/i);
    const svgCode = svgMatch ? svgMatch[0] : "";

    return new Response(
      JSON.stringify({
        success: true,
        svg: svgCode,
        fullResponse: message.content,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur API /api/generate-svg :", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
