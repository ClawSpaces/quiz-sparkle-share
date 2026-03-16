import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface QuizSchemaProps {
  type: "quiz";
  title: string;
  description: string | null;
  image: string | null;
  categoryName?: string;
  categorySlug?: string;
  questions?: { text: string; answers: string[] }[];
}

interface ArticleSchemaProps {
  type: "article";
  title: string;
  description: string | null;
  image: string | null;
  datePublished: string;
  dateModified: string;
  categoryName?: string;
  categorySlug?: string;
}

interface WebsiteSchemaProps {
  type: "website";
}

type SchemaProps = QuizSchemaProps | ArticleSchemaProps | WebsiteSchemaProps;

const BASE_URL = "https://fizzty.com";

const buildBreadcrumbs = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    ...(item.url ? { item: item.url } : {}),
  })),
});

const SchemaMarkup = (props: SchemaProps) => {
  const schemas: object[] = [];

  if (props.type === "website") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Fizzty",
      url: BASE_URL,
      description: "Take free personality quizzes, trivia challenges and discover trending content.",
      publisher: { "@type": "Organization", name: "Fizzty" },
    });
  }

  if (props.type === "quiz") {
    const quizSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: props.title,
      description: props.description || undefined,
      image: props.image || undefined,
    };
    if (props.categoryName) {
      quizSchema.educationalAlignment = {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: props.categoryName,
      };
    }
    if (props.questions?.length) {
      quizSchema.hasPart = props.questions.map((q) => ({
        "@type": "Question",
        name: q.text,
        acceptedAnswer: { "@type": "Answer", text: q.answers.join(", ") },
      }));
    }
    schemas.push(quizSchema);

    const crumbs: BreadcrumbItem[] = [{ name: "Home", url: BASE_URL }];
    if (props.categoryName && props.categorySlug) {
      crumbs.push({ name: props.categoryName, url: `${BASE_URL}/category/${props.categorySlug}` });
    }
    crumbs.push({ name: props.title });
    schemas.push(buildBreadcrumbs(crumbs));
  }

  if (props.type === "article") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: props.title,
      description: props.description || undefined,
      image: props.image || undefined,
      author: { "@type": "Organization", name: "Fizzty" },
      publisher: { "@type": "Organization", name: "Fizzty", url: BASE_URL },
      datePublished: props.datePublished,
      dateModified: props.dateModified,
    });

    const crumbs: BreadcrumbItem[] = [{ name: "Home", url: BASE_URL }];
    if (props.categoryName && props.categorySlug) {
      crumbs.push({ name: props.categoryName, url: `${BASE_URL}/category/${props.categorySlug}` });
    }
    crumbs.push({ name: props.title });
    schemas.push(buildBreadcrumbs(crumbs));
  }

  if (schemas.length === 0) return null;

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;
