import { useState, useEffect } from "react";

const CONSENT_KEY = "cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-4 shadow-lg md:p-6">
      <div className="container flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground md:max-w-[70%]">
          Αυτός ο ιστότοπος χρησιμοποιεί cookies για τη βελτίωση της εμπειρίας σας και την προβολή εξατομικευμένων διαφημίσεων. 
          Διαβάστε την{" "}
          <a href="/privacy" className="underline text-primary hover:text-primary/80">
            Πολιτική Απορρήτου
          </a>{" "}
          μας για περισσότερες πληροφορίες.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            Απόρριψη
          </button>
          <button
            onClick={handleAccept}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Αποδοχή
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
