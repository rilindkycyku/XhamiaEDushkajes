import { Helmet } from 'react-helmet-async';

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_NAME   = 'Xhamia e Dushkajës';
const SITE_URL    = 'https://www.xhamiaedushkajes.org';
const DEFAULT_IMG = `${SITE_URL}/img/logo/og-image.jpg`;
const DEFAULT_KW  = 'xhamia e dushkajes, kacanik, vaktet e namazit, feja islame, xhamia kacanik, imam nehat shehu, dhuro per xhamin, kosovo, islam';
const DEFAULT_DESC = 'Mirë se vini në faqen zyrtare të Xhamisë së Dushkajës në Kaçanik. Informohuni mbi kohët e namazit, aktivitetet javore, dhe jeta fetare në xhaminë tonë.';

// ─── Breadcrumb map ───────────────────────────────────────────────────────────
const BREADCRUMB_MAP = {
  '/':                     [{ name: 'Kryefaqja', url: SITE_URL }],
  '/rrethxhamis':          [{ name: 'Kryefaqja', url: SITE_URL }, { name: 'Rreth Xhamisë', url: `${SITE_URL}/rrethxhamis` }],
  '/aktivitetejavore':     [{ name: 'Kryefaqja', url: SITE_URL }, { name: 'Aktivitete Javore', url: `${SITE_URL}/aktivitetejavore` }],
  '/kohetenamazitpersot':  [{ name: 'Kryefaqja', url: SITE_URL }, { name: 'Kohët e Namazit', url: `${SITE_URL}/kohetenamazitpersot` }],
  '/dhuroperxhamin':       [{ name: 'Kryefaqja', url: SITE_URL }, { name: 'Dhuro për Xhaminë', url: `${SITE_URL}/dhuroperxhamin` }],
  '/kontakti':             [{ name: 'Kryefaqja', url: SITE_URL }, { name: 'Kontakti', url: `${SITE_URL}/kontakti` }],
};

// ─── JSON-LD helpers ──────────────────────────────────────────────────────────

/** Mosque (Organization) schema - shown on the home page */
const mosqueSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Mosque',
  name: SITE_NAME,
  alternateName: ['Xhamia e Dushkajës - Kaçanik', 'Xhamia Dushkajës Kaçanik'],
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo/logo.png`,
  image: DEFAULT_IMG,
  description: 'Mirë se vini! Xhamia e Dushkajës - Kaçanik. Imam: Nehat ef. Shehu.',
  sameAs: [
    'https://www.facebook.com/xhamiaedushkajeskacanik',
    'https://youtube.com/@xhamiaedushkajeskacanik',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kaçanik',
    addressRegion: 'Kaçanik',
    addressCountry: 'XK',
  },
});

/** WebPage + BreadcrumbList schema - shown on all inner pages */
const webPageSchema = (title, description, url, breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: title,
      description,
      isPartOf: { '@id': SITE_URL },
      inLanguage: 'sq',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
  ],
});

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * @param {object} props
 * @param {string} [props.title]       - Page title fragment (omit for home)
 * @param {string} [props.description] - Page description
 * @param {string} [props.image]       - Absolute OG image URL
 * @param {string} [props.url]         - Relative path e.g. "/rrethxhamis"
 * @param {string} [props.type]        - OG type, default "website"
 * @param {string} [props.keywords]    - Extra keywords merged with defaults
 * @param {boolean} [props.noindex]    - Set true to prevent indexing (TV page, 404s)
 */
export default function SEO({
  title,
  description,
  image,
  url = '/',
  type = 'website',
  keywords,
  noindex = false,
}) {
  const isHome = url === '/' || url === '' || !title;

  const fullTitle = isHome
    ? SITE_NAME
    : `${title} - ${SITE_NAME}`;

  const metaDesc    = description || DEFAULT_DESC;
  const metaImage   = image || DEFAULT_IMG;
  const canonicalUrl = `${SITE_URL}${url === '/' ? '' : url}`;
  const metaKeywords = keywords ? `${keywords}, ${DEFAULT_KW}` : DEFAULT_KW;

  const breadcrumbs = BREADCRUMB_MAP[url] ?? [{ name: 'Kryefaqja', url: SITE_URL }];
  const jsonLd = isHome ? mosqueSchema() : webPageSchema(fullTitle, metaDesc, canonicalUrl, breadcrumbs);

  return (
    <Helmet>
      {/* ── Standard ── */}
      <html lang="sq" />
      <title>{fullTitle}</title>
      <meta name="description"  content={metaDesc} />
      <meta name="keywords"     content={metaKeywords} />
      <meta name="author"       content={SITE_NAME} />
      <meta name="language"     content="Albanian" />
      <meta name="robots"       content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      <link rel="canonical"     href={canonicalUrl} />

      {/* ── Theme ── */}
      <meta name="theme-color" content="#064e3b" />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={metaImage} />
      <meta property="og:image:alt"   content={`${SITE_NAME} - foto kryesore`} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="sq_AL" />

      {/* ── Twitter / X ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image"       content={metaImage} />
      <meta name="twitter:image:alt"   content={`${SITE_NAME} - foto kryesore`} />

      {/* ── JSON-LD Structured Data ── */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
