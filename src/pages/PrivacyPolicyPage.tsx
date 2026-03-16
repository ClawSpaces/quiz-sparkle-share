import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-10">
        <h1 className="font-display text-3xl font-black text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-US")}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">1. Introduction</h2>
            <p>Welcome to Fizzty (hereinafter "we", "us", or "the Website"). We respect your privacy and are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR) of the European Union and applicable legislation.</p>
            <p>This Privacy Policy explains what data we collect, how we use it, with whom we share it, and what your rights are.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">2. Data We Collect</h2>
            <p>We may collect the following data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Usage data:</strong> IP address, browser type, operating system, pages visited, time spent, referral source.</li>
              <li><strong>Device data:</strong> Device type, screen resolution, unique device identifiers.</li>
              <li><strong>Cookies and similar technologies:</strong> See section 3.</li>
              <li><strong>Interaction data:</strong> Quiz answers, reactions, comments.</li>
              <li><strong>Contact data:</strong> If you contact us, we may collect your name and email address.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">3. Cookies & Tracking Technologies</h2>
            <p>We use cookies and similar technologies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential cookies:</strong> For the proper functioning of the website.</li>
              <li><strong>Analytics cookies:</strong> To understand how the website is used (e.g., Google Analytics).</li>
              <li><strong>Advertising cookies:</strong> To display personalized advertisements (see section 4).</li>
            </ul>
            <p>You can manage your cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">4. Third-Party Advertising</h2>
            <p>Our website uses third-party advertising services, including:</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Google AdSense</h3>
            <p>Google, as a third-party provider, uses cookies (including the DoubleClick DART cookie) to serve ads based on your previous visits to our website or other websites. You can opt out of the DART cookie through the <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a> page.</p>
            <p>For more information: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>.</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Taboola</h3>
            <p>Taboola uses cookies and web beacons to collect information about your online activity to serve you relevant content and ads.</p>
            <p>You can opt out through: <a href="https://www.taboola.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Taboola Privacy Policy</a>.</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Ezoic</h3>
            <p>We use Ezoic as our ad management platform. Ezoic uses cookies and similar technologies to serve relevant advertisements and optimize ad placements. Ezoic may share data with its advertising partners. You can learn more and opt out through the <a href="https://www.ezoic.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ezoic Privacy Policy</a>.</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Other Advertising Networks</h3>
            <p>We may also work with other advertising networks that use similar technologies. You can manage your preferences through: <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (EU)</a> or <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">5. Purpose of Data Processing</h2>
            <p>Your data is used for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Operating and improving the website</li>
              <li>Statistical usage analysis</li>
              <li>Displaying relevant advertisements</li>
              <li>Responding to contact requests</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">6. Legal Basis for Processing (GDPR)</h2>
            <p>The processing of your data is based on:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consent (Article 6(1)(a) GDPR):</strong> For non-essential cookies and personalized advertising.</li>
              <li><strong>Legitimate interest (Article 6(1)(f) GDPR):</strong> For website operation, analytics, and security.</li>
              <li><strong>Legal obligation (Article 6(1)(c) GDPR):</strong> For compliance with tax or regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">7. Your Rights (GDPR)</h2>
            <p>Under the GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Right of access:</strong> To know what data we process about you.</li>
              <li><strong>Right to rectification:</strong> To request correction of inaccurate data.</li>
              <li><strong>Right to erasure:</strong> To request deletion of your data ("right to be forgotten").</li>
              <li><strong>Right to restriction:</strong> To restrict the processing of your data.</li>
              <li><strong>Right to data portability:</strong> To receive your data in a machine-readable format.</li>
              <li><strong>Right to object:</strong> To object to processing for direct marketing purposes.</li>
              <li><strong>Withdrawal of consent:</strong> You can withdraw your consent at any time.</li>
            </ul>
            <p>To exercise your rights, contact us at the email provided in section 10.</p>
            <p>You also have the right to lodge a complaint with your local data protection authority.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">8. Protection of Minors</h2>
            <p>Our website is not directed at children under the age of 16. We do not knowingly collect personal data from children under 16. If we become aware that we have collected such data, we will delete it immediately. If you are a parent/guardian and believe your child has provided us with personal data, please contact us.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">9. Changes to Privacy Policy</h2>
            <p>We reserve the right to modify this Privacy Policy at any time. Changes will be published on this page with an updated date. We encourage you to check this page regularly.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">10. Contact</h2>
            <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
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

export default PrivacyPolicyPage;
