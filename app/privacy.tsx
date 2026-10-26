import LegalPage, { type LegalSection } from "../components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: ["Barchemy is operated by Things By Janine. Privacy questions and requests can be sent to BarchemyAdmin@thingsbyjanine.me."]
  },
  {
    heading: "Information involved in the experience",
    points: [
      "If you register or sign in: your email address and authentication information handled through Supabase.",
      "If you save recipes: cocktail titles, recipe details, and timestamps. Signed-in memories can be stored with your account; otherwise, memories can be saved in the browser on your device.",
      "If you use My Bar: your spirits, mixers, garnishes, and equipment selections can be kept in the browser's local storage.",
      "If you ask J.Bink a question: the current guided-preview chat processes your text in the app to show a scripted response. It is not currently an open-ended third-party AI conversation.",
      "If you purchase Founder’s Access: Stripe collects and processes payment and relevant billing/contact details. We can view transaction, customer contact, and payment-status information in Stripe to support your purchase and deliver benefits. The Barchemy app does not handle your full payment-card number.",
      "Basic technical information, such as IP addresses, requests, device/browser details, and errors, may be processed by hosting and service providers to run and secure the website."
    ]
  },
  {
    heading: "How information is used",
    paragraphs: ["We use information to provide the app, authenticate accounts, save and retrieve content, process purchases, provide the promised Founder’s Access benefits and product updates, respond to support requests, prevent misuse, and maintain the service. Founder supporters can request to stop receiving product-update emails by contacting BarchemyAdmin@thingsbyjanine.me."]
  },
  {
    heading: "Service providers and sharing",
    paragraphs: ["Barchemy currently relies on Render for website hosting, Supabase for account and database services, and Stripe for payment processing. These providers may process information needed to perform those functions under their own applicable terms and privacy notices. We do not offer an in-app public sharing feature for saved memories in the current release."]
  },
  {
    heading: "Browser storage and accounts",
    paragraphs: ["Barchemy uses browser storage to keep some device-specific features working between visits. Supabase may use browser storage to maintain a signed-in session. Clearing browser data may remove local inventories and memories. If you are signed in, account-based memories can remain available through Supabase when the service is configured and reachable."]
  },
  {
    heading: "Retention and your choices",
    paragraphs: ["Local browser data remains until you clear it or your browser removes it. Account and purchase records may be retained as needed to provide service, meet legal obligations, resolve disputes, and support transactions. You can request access, correction, or deletion of personal information by emailing BarchemyAdmin@thingsbyjanine.me. Some financial records must be kept where required by law."]
  },
  {
    heading: "Security and age",
    paragraphs: ["We use service-provider security features and take reasonable steps to protect information, but no online system can promise perfect security. Barchemy's alcohol-related experience is intended for users of legal drinking age (21 or older in the United States), and is not directed to children."]
  },
  {
    heading: "Changes and contact",
    paragraphs: ["If our data practices materially change, we will update this policy and its effective date. Contact BarchemyAdmin@thingsbyjanine.me with questions or requests."]
  }
];

export default function Privacy() {
  return <LegalPage eyebrow="YOUR INFORMATION" title="Privacy Policy" introduction="Your cocktail memories are personal. Here's how the current Barchemy web experience handles information." sections={sections} />;
}
