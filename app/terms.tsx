import LegalPage, { type LegalSection } from "../components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "Who operates Barchemy",
    paragraphs: ["Barchemy is operated by Things By Janine. Questions about these terms or a purchase can be sent to BarchemyAdmin@thingsbyjanine.me."]
  },
  {
    heading: "What the experience offers",
    paragraphs: [
      "Barchemy provides beverage recipes, guided mixing, an introductory J.Bink chat experience, mixology lessons, My Bar inventory tools, and a Memory Wall. Some features and seasonal environments are previews or remain in development. Open-ended AI conversation is not yet available.",
      "Barchemy does not sell or deliver alcoholic beverages. Recipes and educational content are for general information, not medical or professional advice. Check ingredients for allergies and use your own judgment."
    ]
  },
  {
    heading: "Age and responsible enjoyment",
    paragraphs: ["Alcohol-related features are intended only for people who are of legal drinking age where they live (21 or older in the United States). Follow local laws, consider alcohol-free options, never drink and drive, and do not use Barchemy to encourage dangerous or excessive drinking."]
  },
  {
    heading: "Accounts and saved content",
    paragraphs: [
      "If you create an account, provide accurate information and protect your sign-in credentials. Your saved recipes and inventory remain your content.",
      "My Bar inventory and memories saved while signed out are stored in the browser on your device. Signed-in cocktail memories are saved to your account through Supabase when that service is available. Device-only data may be lost if browser storage is cleared or you switch devices. Keep a separate copy of anything important to you."
    ]
  },
  {
    heading: "Barchemy Founder’s Access",
    paragraphs: [
      "Founder’s Access costs $9.99 USD as a single, non-recurring purchase, plus any applicable tax shown at checkout. It includes a digital welcome card, early product updates, and opportunities to share feedback about Barchemy.",
      "Founder’s Access is a supporter offering. It is not an investment, ownership stake, guaranteed future feature, lifetime premium subscription, or promise of priority access to features that do not yet exist. Current free app features remain available without this purchase. Payments are processed by Stripe."
    ]
  },
  {
    heading: "Refunds",
    paragraphs: ["For Founder’s Access, you can request a full refund within seven calendar days of purchase. See the separate Refund Policy for instructions and details. Your rights under applicable law are not limited by these terms."]
  },
  {
    heading: "Acceptable use and intellectual property",
    paragraphs: ["Do not interfere with the service, try to access other users' content, misuse accounts, or copy Barchemy branding or app materials for commercial redistribution without permission. You keep ownership of content you submit, while Barchemy retains its own names, designs, copy, and software, subject to applicable law."]
  },
  {
    heading: "Availability and changes",
    paragraphs: ["Barchemy is an evolving early-stage product. We may update features, correct content, or experience interruptions. We will update these terms when material conditions change. No provision here excludes rights or remedies that cannot lawfully be excluded."]
  },
  {
    heading: "Contact",
    paragraphs: ["Email BarchemyAdmin@thingsbyjanine.me for service, account, privacy, or purchasing questions."]
  }
];

export default function Terms() {
  return <LegalPage eyebrow="LEGAL" title="Terms of Service" introduction="Please read these terms before using Barchemy or purchasing Founder’s Access." sections={sections} />;
}
