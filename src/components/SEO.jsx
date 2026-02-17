import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url, type = 'website' }) {
    const siteName = "Xhamia e Dushkajës - Kaçanik";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc = "Mirë se vini në faqen zyrtare të Xhamisë së Dushkajës në Kaçanik. Informohuni mbi kohët e namazit, aktivitetet javore, dhe jeta fetare në xhaminë tonë.";
    const siteUrl = "https://www.xhamiaedushkajes.org"; // Replace with real URL if different
    const defaultImage = "/img/logo/og-image.jpg"; // Prepare an OG image later

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <link rel="canonical" href={`${siteUrl}${url || ''}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:image" content={image || `${siteUrl}${defaultImage}`} />
            <meta property="og:url" content={`${siteUrl}${url || ''}`} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            <meta name="twitter:image" content={image || `${siteUrl}${defaultImage}`} />

            {/* Additional SEO */}
            <meta name="keywords" content="xhamia e dushkajes, kacanik, vaktet e namazit, feja islame, xhamia kacanik, imam nehat shehu, dhuro per xhamin" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Albanian" />
            <meta name="revisit-after" content="7 days" />
            <meta name="author" content="Xhamia e Dushkajës" />
        </Helmet>
    );
}
