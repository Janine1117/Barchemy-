import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={s.container}>
      <Text style={s.eyebrow}>J.BINK'S BAR</Text>
      <Text style={s.title}>Good to see you.</Text>
      <Text style={s.question}>What are we getting into today?</Text>

      <View style={s.card}>
        <Text style={s.eyebrow}>ASK J.BINK</Text>
        <Text style={s.copy}>
          Tell me what you're craving, what you have, or the mood you're after.
        </Text>
        <Link href="/ask" style={s.button}>
          ASK J.BINK
        </Link>
      </View>

      <View style={s.row}>
        <Link href="/my-bar" style={s.tile}>
          MY BAR
        </Link>
        <Link href="/memory" style={s.tile}>
          MEMORIES
        </Link>
      </View>

      <View style={s.row}>
        <Link href="/first-pour" style={s.tile}>
          FIRST POUR
        </Link>
        <Link href="/memory" style={s.tile}>
          MEMORY WALL
        </Link>
      </View>

      <Text style={s.toast}>Sip. Smile. Repeat.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#120F14", padding: 28, paddingTop: 70 },
  eyebrow: { color: "#D6A84F", letterSpacing: 2 },
  title: { color: "#F4E9D0", fontSize: 30, fontWeight: "700", marginTop: 10 },
  question: { color: "#BDB4BE", fontSize: 17, marginTop: 8 },
  card: { backgroundColor: "#211A25", padding: 22, borderRadius: 20, marginTop: 28 },
  copy: { color: "#BDB4BE", lineHeight: 23, marginTop: 10 },
  button: {
    backgroundColor: "#D6A84F",
    color: "#120F14",
    fontWeight: "800",
    textAlign: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
    overflow: "hidden",
  },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  tile: {
    flex: 1,
    backgroundColor: "#211A25",
    color: "#F4E9D0",
    textAlign: "center",
    paddingVertical: 22,
    borderRadius: 16,
    overflow: "hidden",
    fontWeight: "700",
  },
  toast: { color: "#D6A84F", textAlign: "center", marginTop: 28 },
});
