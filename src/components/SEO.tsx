import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/99afa513-9269-40cd-9fe9-523dd8068d1f/id-preview-cdc0fd3f--822a068a-b79b-4c77-b043-2d6475162f04.lovable.app-1773066915015.png";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "quiz";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const SEO = ({ title, description, image, imageAlt, url, type = "website", noindex = false, publishedTime, modifiedTime, metaTitle, metaDescription }: SEOProps) => {
  const displayTitle = metaTitle || title;
  const fullTitle = displayTitle.includes("Fizzty") ? displayTitle : `${displayTitle} | Fizzty`;
  const displayDescription = metaDescription || description;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const ogImageAlt = imageAlt || displayTitle;
  const canonical = url || (typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://fizzty.com");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={displayDescription} />
      <link rel="canonical" href={canonical} />
      <meta name="author" content="Fizzty" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={displayDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type === "quiz" ? "website" : type} />
      <meta property="og:site_name" content="Fizzty" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={displayDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      <meta name="twitter:site" content="@Fizzty" />
    </Helmet>
  );
};

export default SEO;
