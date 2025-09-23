import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PB_URL || "http://127.0.0.1:8090");

const email = import.meta.env.PB_ADMIN_EMAIL;
const password = import.meta.env.PB_ADMIN_PASSWORD;

if (email && password) {
  try {
    await pb.admins.authWithPassword(email, password);
    console.log(" Authentification admin réussie");
  } catch (err) {
    console.error(" Impossible de se connecter à PocketBase :", err);
  }
} else {
  console.warn(" PB_ADMIN_EMAIL ou PB_ADMIN_PASSWORD non défini !");
}

export default pb;
