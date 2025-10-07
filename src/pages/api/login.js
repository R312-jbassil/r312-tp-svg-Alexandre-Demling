import pb from "../../utils/pb";

export async function POST({ request, cookies }) {
  const { email, password } = await request.json();

  try {
    const authData = await pb.collection("users").authWithPassword(email, password);

    // Cookie sécurisé
    cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: import.meta.env.PROD,
    });

    return new Response(
      JSON.stringify({ user: pb.authStore.model }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401 }
    );
  }
}
