import LegalPage, { type LegalSection } from "../components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "Our 7-day Founder’s Access promise",
    paragraphs: ["If you purchase the $9.99 USD one-time Barchemy Founder’s Access product and change your mind, you can request a full refund within seven calendar days of the purchase date. Applicable consumer rights that cannot be waived remain in effect after that period."]
  },
  {
    heading: "How to request a refund",
    points: [
      "Email BarchemyAdmin@thingsbyjanine.me within seven calendar days of your purchase.",
      "Use the subject: Barchemy Founder’s Access refund request.",
      "Include the email address used at checkout and the purchase date or Stripe receipt reference. Please do not send payment-card numbers."
    ]
  },
  {
    heading: "What happens next",
    paragraphs: ["We will issue a full refund for requests made within the seven-day window, using the original payment method through Stripe. The time for the funds to appear depends on Stripe and your bank or payment provider. If you have not received the promised digital welcome card, contact us at the same email so we can help with delivery."]
  },
  {
    heading: "What the purchase includes",
    paragraphs: ["Founder’s Access is a one-time supporter product offering a digital welcome card, early product updates, and opportunities to provide feedback. It is not a recurring subscription and does not grant lifetime premium features or ownership of Barchemy."]
  },
  {
    heading: "Contact",
    paragraphs: ["Questions about refunds or delivery? Email BarchemyAdmin@thingsbyjanine.me."]
  }
];

export default function Refunds() {
  return <LegalPage eyebrow="FOUNDER'S ACCESS" title="Refund Policy" introduction="We want you to feel comfortable supporting Barchemy's early journey." sections={sections} />;
}
