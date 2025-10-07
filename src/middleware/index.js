// src/middleware/index.js
import pb from '../utils/pb';

export const onRequest = async (context, next) => {
  const { request, url, cookies, locals } = context;

  // --- 1. Authentification ---
  const cookie = cookies.get('pb_auth')?.value;
  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
    }
  }

  // --- 2. Protection des routes API ---
  if (url.pathname.startsWith('/api/')) {
    if (
      !context.locals.user &&
      url.pathname !== '/api/login' &&
      url.pathname !== '/api/signup'
    ) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    return next();
  }

  // --- 3. Redirection vers /login si page protégée ---
  if (!context.locals.user) {
    if (url.pathname !== '/login' && url.pathname !== '/signup' && url.pathname !== '/') {
      return Response.redirect(new URL('/login', url), 303);
    }
  }

  // --- 4. i18n (ta logique existante) ---
  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const lang = form?.get('language');
    if (lang === 'en' || lang === 'fr') {
      cookies.set('locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return Response.redirect(new URL(url.pathname + url.search, url), 303);
    }
  }

  const cookieLocale = cookies.get('locale')?.value;
  const acceptLang = request.headers.get('accept-language') || '';
  const browserLocale = acceptLang.split(',')[0]?.split('-')[0];

  const finalLocale =
    cookieLocale === 'en' || cookieLocale === 'fr'
      ? cookieLocale
      : browserLocale === 'fr'
      ? 'fr'
      : 'en';

  locals.lang = finalLocale;

  return next();
};
