import pb from "../../utils/pb";

export async function POST({ request, cookies }) {
  const { email, password, passwordConfirm } = await request.json();

  try {
    // Création utilisateur
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
    });

    // Auto login
    const authData = await pb.collection("users").authWithPassword(email, password);
    cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: import.meta.env.PROD,
    });

    return new Response(JSON.stringify({ user: pb.authStore.model }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
