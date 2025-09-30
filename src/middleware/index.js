export const onRequest = async (context) => {
  const { request, url, cookies, locals, next } = context;

  // Ignorer les endpoints API
  if (url.pathname.startsWith('/api/')) return next();

  //  Gestion du formulaire de langue
  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const lang = form?.get('language');

    if (lang === 'en' || lang === 'fr') {
      cookies.set('locale', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return Response.redirect(new URL(url.pathname + url.search, url), 303);
    }
  }

  //  Lecture du cookie
  const cookieLocale = cookies.get('locale')?.value;

  //  Détection de la langue du navigateur
  const acceptLang = request.headers.get('accept-language') || '';
  const browserLocale = acceptLang.split(',')[0]?.split('-')[0];

  //  Détermination de la langue finale
  const finalLocale =
    cookieLocale === 'en' || cookieLocale === 'fr'
      ? cookieLocale
      : browserLocale === 'fr'
      ? 'fr'
      : 'en';

  //  Stocker dans locals pour Astro
  locals.lang = finalLocale;

  return next();
};
