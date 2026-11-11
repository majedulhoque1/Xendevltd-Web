import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SITE_CONTACT } from "@/lib/contact";

const UPDATED = "11 November 2026";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Who we are",
    body: [
      "Xen Developments Ltd. (\"Xen\", \"we\") builds and sells residential apartments in Dhaka, including Lakeview Tasmee in Sector 14, Jolshiri Abashon. This policy explains what personal information we collect when you contact us through this website, Facebook, Instagram or Messenger, and how we use it.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "Information you give us: your name, phone number, email address, the project you are interested in, your preferred visit date, and anything you write in a message, form or chat.",
      "Facebook and Instagram lead forms and Messenger: when you fill in one of our forms or message our Page, Meta shares with us the details you submit (for example your name and phone number) and your messages.",
      "Website usage: we use Google Tag Manager and Google Analytics to understand which pages are visited. These tools use cookies and collect technical data such as your device type, browser and approximate location. They do not give us your name.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "To reply to your enquiry, call you back, send you price sheets, floor plans and project information, and arrange site visits.",
      "To keep a record of our conversations so we don't ask you the same questions twice.",
      "To improve our website and advertising.",
      "We do not sell your personal information, and we do not share it with other developers or agents.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "Only Xen's sales team and the service providers that run our systems: website hosting, our booking database, Google (analytics) and Meta (Facebook, Instagram and Messenger). They process data on our behalf and under their own privacy terms.",
      "We may disclose information if the law requires it.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep enquiry and contact details for as long as we are in touch about a property, and for up to two years after our last contact, unless you ask us to delete them sooner.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can ask us at any time to show you, correct or delete the information we hold about you, or to stop contacting you. Call or email us using the details below and we will act on it within 14 days.",
      "You can block or delete cookies in your browser settings.",
    ],
  },
];

const Privacy = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | Xen Developments";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container-wide max-w-3xl">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 className="font-serif text-2xl mb-4">{s.title}</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-serif text-2xl mb-4">Contact us</h2>
              <div className="space-y-1 text-muted-foreground leading-relaxed">
                <p>Xen Developments Ltd.</p>
                <p>{SITE_CONTACT.addressLine1}</p>
                <p>{SITE_CONTACT.addressLine2}</p>
                <p>
                  Phone: <a className="text-primary hover:underline" href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimary}</a>
                </p>
                <p>
                  Email: <a className="text-primary hover:underline" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
