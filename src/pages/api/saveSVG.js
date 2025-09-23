import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
  try {
    const { name, code_svg, chat_history } = await request.json();

    if (!name || !code_svg) {
      return new Response(
        JSON.stringify({ success: false, error: "Name and code_svg are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const record = await pb.collection(Collections.Svg).create({
      name,
      code_svg,
      chat_history: chat_history || [],
    });

    console.log("✅ SVG saved with ID:", record.id);

    return new Response(
      JSON.stringify({ success: true, data: record }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error saving SVG:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
