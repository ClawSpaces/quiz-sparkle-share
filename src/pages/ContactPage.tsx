import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be under 5000 characters"),
});

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    // Open mailto as a simple solution
    const subject = encodeURIComponent(`Contact from ${result.data.name}`);
    const body = encodeURIComponent(`Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`);
    window.location.href = `mailto:john.nedev@gmail.com?subject=${subject}&body=${body}`;

    setSending(false);
    toast({ title: "Opening your email client…", description: "If nothing happens, please email us directly at john.nedev@gmail.com" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-10">
        <h1 className="font-display text-3xl font-black text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Have a question or feedback? We'd love to hear from you.</p>

        <div className="mb-8 flex items-center gap-2 rounded-lg border bg-card p-4">
          <Mail className="h-5 w-5 text-primary" />
          <a href="mailto:john.nedev@gmail.com" className="text-sm text-primary hover:underline">
            john.nedev@gmail.com
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              rows={5}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" disabled={sending} className="w-full">
            Send Message
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
