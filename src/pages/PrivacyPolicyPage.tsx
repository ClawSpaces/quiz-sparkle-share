import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-10">
        <h1 className="font-display text-3xl font-black text-foreground mb-2">Πολιτική Απορρήτου</h1>
        <p className="text-sm text-muted-foreground mb-8">Τελευταία ενημέρωση: {new Date().toLocaleDateString("el-GR")}</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">1. Εισαγωγή</h2>
            <p>Καλώς ήρθατε στο QuizMania (εφεξής «εμείς», «μας» ή «η Ιστοσελίδα»). Σεβόμαστε το απόρρητό σας και δεσμευόμαστε να προστατεύουμε τα προσωπικά σας δεδομένα σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR) της Ευρωπαϊκής Ένωσης και την ισχύουσα ελληνική νομοθεσία (Ν. 4624/2019).</p>
            <p>Η παρούσα Πολιτική Απορρήτου εξηγεί ποια δεδομένα συλλέγουμε, πώς τα χρησιμοποιούμε, με ποιον τα μοιραζόμαστε και ποια είναι τα δικαιώματά σας.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">2. Δεδομένα που Συλλέγουμε</h2>
            <p>Ενδέχεται να συλλέγουμε τα ακόλουθα δεδομένα:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Δεδομένα χρήσης:</strong> Διεύθυνση IP, τύπος προγράμματος περιήγησης, λειτουργικό σύστημα, σελίδες που επισκέπτεστε, χρόνος παραμονής, πηγή παραπομπής.</li>
              <li><strong>Δεδομένα συσκευής:</strong> Τύπος συσκευής, ανάλυση οθόνης, μοναδικά αναγνωριστικά συσκευής.</li>
              <li><strong>Cookies και παρόμοιες τεχνολογίες:</strong> Βλ. ενότητα 3.</li>
              <li><strong>Δεδομένα αλληλεπίδρασης:</strong> Απαντήσεις σε quizzes, αντιδράσεις, σχόλια.</li>
              <li><strong>Δεδομένα επικοινωνίας:</strong> Εάν επικοινωνήσετε μαζί μας, ενδέχεται να συλλέξουμε το όνομα και τη διεύθυνση email σας.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">3. Cookies & Τεχνολογίες Παρακολούθησης</h2>
            <p>Χρησιμοποιούμε cookies και παρόμοιες τεχνολογίες για τους ακόλουθους σκοπούς:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Απαραίτητα cookies:</strong> Για τη σωστή λειτουργία της ιστοσελίδας.</li>
              <li><strong>Cookies ανάλυσης:</strong> Για την κατανόηση του τρόπου χρήσης της ιστοσελίδας (π.χ. Google Analytics).</li>
              <li><strong>Cookies διαφήμισης:</strong> Για την προβολή εξατομικευμένων διαφημίσεων (βλ. ενότητα 4).</li>
            </ul>
            <p>Μπορείτε να διαχειριστείτε τις προτιμήσεις σας για τα cookies μέσω των ρυθμίσεων του προγράμματος περιήγησής σας.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">4. Διαφημίσεις Τρίτων</h2>
            <p>Η ιστοσελίδα μας χρησιμοποιεί υπηρεσίες διαφήμισης τρίτων μερών, συμπεριλαμβανομένων:</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Google AdSense</h3>
            <p>Η Google, ως τρίτος πάροχος, χρησιμοποιεί cookies (συμπεριλαμβανομένου του cookie DoubleClick DART) για την προβολή διαφημίσεων βάσει προηγούμενων επισκέψεών σας στην ιστοσελίδα μας ή σε άλλες ιστοσελίδες. Η χρήση του cookie DART από τη Google επιτρέπει σε αυτήν και στους συνεργάτες της να σας προβάλλουν διαφημίσεις βάσει της επίσκεψής σας στην ιστοσελίδα μας ή/και σε άλλες ιστοσελίδες στο Διαδίκτυο.</p>
            <p>Μπορείτε να εξαιρεθείτε από τη χρήση του cookie DART μέσω της σελίδας <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ρυθμίσεις Διαφημίσεων Google</a>.</p>
            <p>Για περισσότερες πληροφορίες: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Πολιτική Απορρήτου Google</a>.</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Taboola</h3>
            <p>Η Taboola χρησιμοποιεί cookies και web beacons για τη συλλογή πληροφοριών σχετικά με τη δραστηριότητά σας στο διαδίκτυο, ώστε να σας προβάλλει σχετικό περιεχόμενο και διαφημίσεις.</p>
            <p>Μπορείτε να εξαιρεθείτε μέσω: <a href="https://www.taboola.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Πολιτική Απορρήτου Taboola</a>.</p>

            <h3 className="font-display text-lg font-semibold text-foreground mt-4">Άλλα Διαφημιστικά Δίκτυα</h3>
            <p>Ενδέχεται να συνεργαζόμαστε και με άλλα διαφημιστικά δίκτυα τα οποία χρησιμοποιούν παρόμοιες τεχνολογίες. Μπορείτε να διαχειριστείτε τις προτιμήσεις σας μέσω: <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (EU)</a> ή <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">5. Σκοπός Επεξεργασίας Δεδομένων</h2>
            <p>Τα δεδομένα σας χρησιμοποιούνται για:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Τη λειτουργία και βελτίωση της ιστοσελίδας</li>
              <li>Τη στατιστική ανάλυση χρήσης</li>
              <li>Την προβολή σχετικών διαφημίσεων</li>
              <li>Την απάντηση σε αιτήματα επικοινωνίας</li>
              <li>Τη συμμόρφωση με νομικές υποχρεώσεις</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">6. Νομική Βάση Επεξεργασίας (GDPR)</h2>
            <p>Η επεξεργασία των δεδομένων σας βασίζεται σε:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Συγκατάθεση (Άρθρο 6(1)(α) GDPR):</strong> Για cookies μη απαραίτητα και εξατομικευμένες διαφημίσεις.</li>
              <li><strong>Έννομο συμφέρον (Άρθρο 6(1)(στ) GDPR):</strong> Για τη λειτουργία της ιστοσελίδας, στατιστικά ανάλυσης και ασφάλεια.</li>
              <li><strong>Νομική υποχρέωση (Άρθρο 6(1)(γ) GDPR):</strong> Για συμμόρφωση με φορολογικές ή κανονιστικές υποχρεώσεις.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">7. Τα Δικαιώματά σας (GDPR)</h2>
            <p>Σύμφωνα με τον GDPR, έχετε τα ακόλουθα δικαιώματα:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Δικαίωμα πρόσβασης:</strong> Να μάθετε ποια δεδομένα σας επεξεργαζόμαστε.</li>
              <li><strong>Δικαίωμα διόρθωσης:</strong> Να ζητήσετε τη διόρθωση ανακριβών δεδομένων.</li>
              <li><strong>Δικαίωμα διαγραφής:</strong> Να ζητήσετε τη διαγραφή των δεδομένων σας («δικαίωμα στη λήθη»).</li>
              <li><strong>Δικαίωμα περιορισμού:</strong> Να περιορίσετε την επεξεργασία των δεδομένων σας.</li>
              <li><strong>Δικαίωμα φορητότητας:</strong> Να λάβετε τα δεδομένα σας σε μηχαναγνώσιμη μορφή.</li>
              <li><strong>Δικαίωμα εναντίωσης:</strong> Να αντιταχθείτε στην επεξεργασία δεδομένων για σκοπούς άμεσης εμπορικής προώθησης.</li>
              <li><strong>Ανάκληση συγκατάθεσης:</strong> Μπορείτε να ανακαλέσετε τη συγκατάθεσή σας ανά πάσα στιγμή.</li>
            </ul>
            <p>Για να ασκήσετε τα δικαιώματά σας, επικοινωνήστε μαζί μας στο email που αναφέρεται στην ενότητα 10.</p>
            <p>Έχετε επίσης το δικαίωμα να υποβάλετε καταγγελία στην <a href="https://www.dpa.gr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">8. Προστασία Ανηλίκων</h2>
            <p>Η ιστοσελίδα μας δεν απευθύνεται σε παιδιά κάτω των 16 ετών. Δεν συλλέγουμε εν γνώσει μας προσωπικά δεδομένα από παιδιά κάτω των 16 ετών. Εάν αντιληφθούμε ότι έχουμε συλλέξει τέτοια δεδομένα, θα τα διαγράψουμε αμέσως. Εάν είστε γονέας/κηδεμόνας και πιστεύετε ότι το παιδί σας μας έχει παράσχει προσωπικά δεδομένα, παρακαλούμε επικοινωνήστε μαζί μας.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">9. Αλλαγές στην Πολιτική Απορρήτου</h2>
            <p>Διατηρούμε το δικαίωμα να τροποποιούμε την παρούσα Πολιτική Απορρήτου ανά πάσα στιγμή. Οι αλλαγές θα δημοσιεύονται στην παρούσα σελίδα με ενημερωμένη ημερομηνία. Σας ενθαρρύνουμε να ελέγχετε τακτικά αυτήν τη σελίδα.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground">10. Επικοινωνία</h2>
            <p>Εάν έχετε ερωτήσεις σχετικά με την παρούσα Πολιτική Απορρήτου ή θέλετε να ασκήσετε τα δικαιώματά σας, επικοινωνήστε μαζί μας:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Email:</strong> contact@quizmania.gr</li>
              <li><strong>Ιστοσελίδα:</strong> quizmania.gr</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
