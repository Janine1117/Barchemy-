import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  points?: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
};

export default function LegalPage({ eyebrow, title, introduction, sections }: Props) {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Link href="/experience" style={s.back}>← BARCHEMY EXPERIENCE</Link>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.title}>{title}</Text>
      <Text style={s.date}>Effective October 26, 2026</Text>
      <Text style={s.intro}>{introduction}</Text>
      {sections.map((section) => (
        <View key={section.heading} style={s.section}>
          <Text style={s.heading}>{section.heading}</Text>
          {(section.paragraphs ?? []).map((paragraph, i) => (
            <Text key={i} style={s.body}>{paragraph}</Text>
          ))}
          {(section.points ?? []).map((point, i) => (
            <Text key={i} style={s.bullet}>• {point}</Text>
          ))}
        </View>
      ))}
      <View style={s.footer}>
        <Link href="/terms" style={s.link}>TERMS</Link>
        <Link href="/privacy" style={s.link}>PRIVACY</Link>
        <Link href="/refunds" style={s.link}>REFUNDS</Link>
      </View>
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#120F14" },
  content: { padding: 24, paddingTop: 48, paddingBottom: 64 },
  back: { color: "#D6A84F", fontWeight: "700" },
  eyebrow: { color: "#D6A84F", letterSpacing: 2, fontSize: 12, fontWeight: "800", marginTop: 32 },
  title: { color: "#F4E9D0", fontSize: 31, fontWeight: "800", marginTop: 12 },
  date: { color: "#BDB4BE", fontSize: 12, marginTop: 12 },
  intro: { color: "#F4E9D0", lineHeight: 24, marginTop: 20, fontSize: 16 },
  section: { paddingTop: 24, marginTop: 20, borderTopWidth: 1, borderTopColor: "#493846" },
  heading: { color: "#D6A84F", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  body: { color: "#F4E9D0", fontSize: 15, lineHeight: 24, marginTop: 10 },
  bullet: { color: "#F4E9D0", fontSize: 15, lineHeight: 24, marginTop: 8, paddingLeft: 8 },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20, marginTop: 38 },
  link: { color: "#D6A84F", fontSize: 12, fontWeight: "800" },
  toast: { color: "#D6A84F", textAlign: "center", marginTop: 28 }
});
