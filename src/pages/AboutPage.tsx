import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fizzty",
    url: "https://fizzty.com",
    logo: "https://fizzty.com/favicon.png",
    description: "Fizzty creates research-informed personality quizzes, trivia challenges, and wellness assessments. Our health content is based on published clinical frameworks and peer-reviewed studies.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "john.nedev@gmail.com",
      contactType: "customer service",
    },
    publishingPrinciples: "https://fizzty.com/about",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="About Fizzty — Who We Are" description="Learn about Fizzty, your destination for fun personality quizzes, trivia challenges, and trending content. See our editorial standards and research methodology." />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <Header />
      <main className="container max-w-3xl py-10">
        <h1 className="font-display text-3xl font-black text-foreground mb-6">About Fizzty</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p className="text-lg leading-relaxed">
            Fizzty is your go-to destination for fun, engaging personality quizzes, trivia challenges, and trending entertainment content. We believe everyone deserves a little spark of joy in their day — and what better way than discovering something new about yourself?
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">What We Do</h2>
            <p>We create and curate interactive quizzes and entertaining content that millions of people love. From "Which character are you?" personality tests to brain-teasing trivia, Fizzty is designed to surprise, delight, and keep you coming back for more.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">Our Mission</h2>
            <p>Our mission is simple: make the internet more fun. We craft every quiz and article with care, combining pop culture, trending topics, and a dash of humor to create content that's genuinely enjoyable to explore and share with friends.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">Why Fizzty?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personality Quizzes:</strong> Discover hidden sides of yourself with our thoughtfully designed personality tests.</li>
              <li><strong>Trivia Challenges:</strong> Test your knowledge on everything from movies and music to science and history.</li>
              <li><strong>Trending Content:</strong> Stay in the loop with the latest viral stories, celebrity news, and pop culture moments.</li>
              <li><strong>Community:</strong> Join millions of quiz-takers who share, compare, and discuss their results.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">Our Editorial Standards</h2>
            <p>We take content accuracy seriously — especially for health and wellness topics. Our editorial process includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Research-Based Content:</strong> All health-related quizzes are informed by published research, clinical screening tools, and peer-reviewed studies (e.g., AQ, RAADS-R, SCOFF).</li>
              <li><strong>Clear Sourcing:</strong> Health quizzes include a Sources &amp; References section linking to organizations like the WHO, NIH, CDC, and relevant academic publications.</li>
              <li><strong>Medical Disclaimers:</strong> Every health quiz prominently states that it is not a diagnostic tool and encourages users to consult qualified healthcare providers.</li>
              <li><strong>Regular Reviews:</strong> Content is periodically reviewed and updated to reflect current research and best practices.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">Get in Touch</h2>
            <p>
              Have a question, suggestion, or just want to say hi? We'd love to hear from you.
              Reach us at <a href="mailto:john.nedev@gmail.com" className="text-primary hover:underline">john.nedev@gmail.com</a> or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
