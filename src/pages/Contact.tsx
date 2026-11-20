// /contact (#visit) — prototype contact.html. The form column is the real slot booking
// (DEVIATIONS.md B1), with a switch to the prototype's quick-request form.
import { useState } from "react";
import { SiteLayout } from "@/site/layout/SiteLayout";
import { ContactList, LeadForm } from "@/site/components/Contact";
import { VisitBooking } from "@/site/components/VisitBooking";
import { SHOW_INTERNAL_NOTES } from "@/site/data/site";

const Contact = () => {
  const [quick, setQuick] = useState(false);
  return (
    <SiteLayout page="contact" crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}>
      <section className="band band--dark" id="visit" style={{ paddingTop: 56 }}>
        <div className="wrap enquiry">
          <div>
            <div className="section-head" style={{ margin: 0 }}>
              <span className="eyebrow">Contact &amp; site visits</span>
              <h1 style={{ fontSize: "var(--step-4)" }}>Come and see the lake for yourself.</h1>
              <p className="lede">
                Visit at sunset, when the lake looks its best.{" "}
                {/* DEVIATIONS.md A3: free pickup is unconfirmed (tbc) */}
                {SHOW_INTERNAL_NOTES && <><span className="tbc">We can pick you up from Gulshan, Baridhara or Mirpur DOHS.</span>{" "}</>}
                Living abroad? We will walk the site with you on a WhatsApp video call.
              </p>
            </div>
            <ContactList />
          </div>
          <div>
            {quick ? (
              <div className="stack">
                <LeadForm source="contact" />
                <p style={{ fontSize: ".92rem" }}>
                  <button type="button" className="link-arrow" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", fontWeight: 700 }} onClick={() => setQuick(false)}>Back to booking a visit time</button>
                </p>
              </div>
            ) : (
              <VisitBooking onQuickRequest={() => setQuick(true)} />
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
