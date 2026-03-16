import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Terms of Use — Fizzty" description="Read Fizzty's terms of use for accessing our quizzes, articles, and content." />
      <Header />
      <main className="container max-w-3xl py-10">
        <h1 className="font-display text-3xl font-black text-foreground mb-2">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-US")}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using the Fizzty website (hereinafter "the Website"), you fully and unconditionally accept these Terms of Use. If you do not agree with any of these terms, please do not use the Website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">2. Service Description</h2>
            <p>The Website provides entertainment content, including personality quizzes, trivia quizzes, articles, news, and related content. The service is provided free of charge and is supported by advertisements.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">3. Intellectual Property</h2>
            <p>All content on the Website — including text, graphics, photographs, illustrations, logos, designs, quizzes, and software — is protected by intellectual property laws and international conventions.</p>
            <p>Reproduction, copying, modification, publication, transmission, distribution, or exploitation of any content without prior written permission is prohibited.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">4. Rules of Use</h2>
            <p>When using the Website, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Website for illegal purposes</li>
              <li>Interfere with the operation or security of the Website</li>
              <li>Use automated means (bots, scrapers) to access content</li>
              <li>Publish false, misleading, or offensive content</li>
              <li>Violate third-party intellectual property rights</li>
              <li>Collect personal data of other users without their consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">5. User Content</h2>
            <p>If you submit content (comments, quiz answers, reactions), you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and publish that content in connection with the operation of the Website.</p>
            <p>You are solely responsible for the content you submit. We reserve the right to remove any content we deem inappropriate.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">6. Advertisements</h2>
            <p>The Website includes advertisements from third-party providers, including Google AdSense, Taboola, and other advertising networks. These advertisements may use cookies and tracking technologies (see <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>).</p>
            <p>We are not responsible for the content or practices of advertisers or third-party websites linked through advertisements.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">7. Third-Party Links</h2>
            <p>The Website may contain links to third-party websites. We do not control and are not responsible for the content, privacy policies, or practices of these websites.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">8. Disclaimer</h2>
            <p>The content of the Website is provided "as is" and "as available," without warranties of any kind, express or implied. Specifically:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Quiz results are purely for entertainment purposes and do not constitute professional assessment or advice.</li>
              <li>Articles and news are informational in nature and do not constitute professional advice.</li>
              <li>We do not guarantee the accuracy, completeness, or timeliness of the content.</li>
              <li>We do not guarantee that the Website will operate without interruption or errors.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use or inability to use the Website</li>
              <li>Any content or information obtained through the Website</li>
              <li>Unauthorized access to data</li>
              <li>Actions of third parties through the Website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">10. Modification of Terms</h2>
            <p>We reserve the right to modify these Terms of Use at any time without prior notice. Changes take effect from the moment of publication on the Website. Continued use of the Website after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">11. Governing Law & Jurisdiction</h2>
            <p>These Terms of Use are governed by applicable law. For any dispute arising from the use of the Website, the competent courts shall have jurisdiction.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">12. Contact</h2>
            <p>If you have questions regarding these Terms of Use, please contact us:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Email:</strong> <a href="mailto:john.nedev@gmail.com" className="text-primary hover:underline">john.nedev@gmail.com</a></li>
              <li><strong>Website:</strong> <a href="https://fizzty.com" className="text-primary hover:underline">fizzty.com</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
