import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function FounderWelcome() {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.sparkle}>✦  ✨  ✦</Text>
        <Text style={s.brand}>BARCHEMY</Text>
        <Text style={s.eyebrow}>FOUNDER'S ACCESS</Text>
        <Text style={s.title}>You're part of the first pour.</Text>
        <View style={s.line} />
        <Text style={s.body}>Thank you for believing in the magic we're creating together.</Text>
        <Text style={s.highlight}>Welcome to the beginning of Barchemy.</Text>
        <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
      </View>
      <Text style={s.heading}>YOUR FOUNDER BENEFITS</Text>
      <Text style={s.item}>✦ This digital welcome card</Text>
      <Text style={s.item}>✦ Early Barchemy product updates</Text>
      <Text style={s.item}>✦ Opportunities to share feedback</Text>
      <Text style={s.note}>Founder's Access is a $9.99 one-time supporter purchase. It does not include a premium subscription, equity, or guaranteed future features. Keep your Stripe receipt as proof of purchase; visiting this public card alone does not verify a purchase.</Text>
      <Text style={s.note}>For delivery or purchase questions, email BarchemyAdmin@thingsbyjanine.me.</Text>
      <Link href="/experience" style={s.button}>EXPLORE BARCHEMY →</Link>
      <View style={s.legal}>
        <Link href="/terms" style={s.legalLink}>TERMS</Link>
        <Link href="/privacy" style={s.legalLink}>PRIVACY</Link>
        <Link href="/refunds" style={s.legalLink}>REFUNDS</Link>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#120F14" },
  content: { padding: 24, paddingTop: 46, paddingBottom: 60 },
  card: { backgroundColor: "#211A25", borderWidth: 2, borderColor: "#D6A84F", borderRadius: 24, padding: 30, alignItems: "center" },
  sparkle: { color: "#D6A84F", fontSize: 28 },
  brand: { color: "#D6A84F", fontWeight: "800", fontSize: 22, letterSpacing: 4, marginTop: 23 },
  eyebrow: { color: "#F4E9D0", letterSpacing: 2, fontSize: 12, marginTop: 18, fontWeight: "800" },
  title: { color: "#F4E9D0", fontSize: 29, fontWeight: "800", textAlign: "center", lineHeight: 38, marginTop: 19 },
  line: { width: 86, height: 2, backgroundColor: "#D6A84F", marginVertical: 26 },
  body: { color: "#F4E9D0", fontSize: 17, lineHeight: 26, textAlign: "center" },
  highlight: { color: "#D6A84F", fontWeight: "800", fontSize: 19, lineHeight: 27, textAlign: "center", marginTop: 20 },
  toast: { color: "#D6A84F", marginTop: 36, fontWeight: "800" },
  heading: { color: "#D6A84F", marginTop: 30, fontWeight: "800", letterSpacing: 1.5, fontSize: 13 },
  item: { color: "#F4E9D0", fontSize: 16, lineHeight: 27, marginTop: 12 },
  note: { color: "#BDB4BE", fontSize: 13, lineHeight: 20, marginTop: 21 },
  button: { color: "#120F14", backgroundColor: "#D6A84F", padding: 17, overflow: "hidden", borderRadius: 12, fontWeight: "800", textAlign: "center", marginTop: 28 },
  legal: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 28 },
  legalLink: { color: "#D6A84F", fontSize: 12, fontWeight: "800" }
});
