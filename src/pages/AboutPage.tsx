import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
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
