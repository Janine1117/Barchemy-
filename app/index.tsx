import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const scenes = [
  {
    eyebrow: "WELCOME TO BARCHEMY",
    title: "Your bar. Your moment. Your magic.",
    copy: "Discover a world of flavor and a little cocktail magic, one sip at a time.",
    feature: "Your personal cocktail experience starts here.",
  },
  {
    eyebrow: "MEET J.BINK",
    title: "Your AI bartender is ready.",
    copy: "Feeling fruity, bold, or adventurous? J.Bink will help you find your next pour.",
    feature: "Discover a drink and explore its guided recipe.",
  },
  {
    eyebrow: "MAKE MEMORIES",
    title: "Every great pour has a story.",
    copy: "Mix something special, capture your favorites, and revisit them on your Memory Wall.",
    feature: "Sip. Smile. Repeat. ✨",
  },
];

export default function Welcome() {
  const [step, setStep] = useState(0);
  const scene = scenes[step];

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.brandRow}>
        <Text style={s.brand}>BARCHEMY</Text>
        <Text style={s.count}>{step + 1} / {scenes.length}</Text>
      </View>
      <View style={s.hero}>
        <Text style={s.sparkle}>✦</Text>
        <Text style={s.eyebrow}>{scene.eyebrow}</Text>
        <Text style={s.title}>{scene.title}</Text>
        <Text style={s.copy}>{scene.copy}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.feature}>{scene.feature}</Text>
      </View>
      <View style={s.dots}>
        {scenes.map((_, i) => (
          <View key={i} style={[s.dot, i === step && s.activeDot]} />
        ))}
      </View>
      {step === scenes.length - 1 ? (
        <Link href="/home" style={s.button}>ENTER J.BINK'S BAR</Link>
      ) : (
        <Pressable accessibilityRole="button" style={s.button} onPress={() => setStep(step + 1)}>
          <Text style={s.buttonText}>CONTINUE</Text>
        </Pressable>
      )}
      <View style={s.links}>
        {step > 0 ? (
          <Pressable accessibilityRole="button" onPress={() => setStep(step - 1)}>
            <Text style={s.link}>BACK</Text>
          </Pressable>
        ) : <View />}
        <Link href="/home" style={s.link}>SKIP INTRO</Link>
      </View>
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: "#120F14", paddingHorizontal: 28,
    paddingTop: 45, paddingBottom: 36, justifyContent: "center",
  },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 3 },
  count: { color: "#BDB4BE" },
  hero: { alignItems: "center", paddingVertical: 36 },
  sparkle: { color: "#D6A84F", fontSize: 38, marginBottom: 16 },
  eyebrow: { color: "#D6A84F", letterSpacing: 2, textAlign: "center" },
  title: { color: "#F4E9D0", fontSize: 34, lineHeight: 43, fontWeight: "800", marginTop: 15, textAlign: "center" },
  copy: { color: "#BDB4BE", fontSize: 16, lineHeight: 26, marginTop: 20, textAlign: "center" },
  card: { padding: 25, backgroundColor: "#211A25", borderRadius: 20, borderWidth: 1, borderColor: "#55405E" },
  feature: { color: "#F4E9D0", fontSize: 17, lineHeight: 25, textAlign: "center" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 25 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#55405E" },
  activeDot: { width: 25, backgroundColor: "#D6A84F" },
  button: {
    backgroundColor: "#D6A84F", color: "#120F14", fontWeight: "800",
    textAlign: "center", padding: 17, borderRadius: 14, overflow: "hidden",
  },
  buttonText: { color: "#120F14", fontWeight: "800", textAlign: "center" },
  links: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
  link: { color: "#D6A84F", fontWeight: "700", letterSpacing: 1 },
  toast: { color: "#BDB4BE", textAlign: "center", marginTop: 30 },
});
