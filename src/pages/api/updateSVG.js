import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
  try {
    const { id, code_svg, chat_history } = await request.json();

    if (!id || !code_svg) {
      return new Response(
        JSON.stringify({ success: false, error: "id and code_svg are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const record = await pb.collection(Collections.Svg).update(id, {
      code_svg,
      chat_history: chat_history || [],
    });

    console.log(" SVG updated:", record.id);

    return new Response(
      JSON.stringify({ success: true, data: record }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(" Error updating SVG:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
