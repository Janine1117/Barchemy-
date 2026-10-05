import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { saveMemory } from "../Lib/memories";

const TITLE = "The Barchemy House Sour";
const RECIPE =
  "Prepare • Measure • Mix • Taste • Adjust • Finish — Bright, balanced, beginner-friendly.";

export default function FirstPour() {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setStatus("");

    try {
      const result = await saveMemory(TITLE, RECIPE);
      setStatus(result.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save this memory.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.eyebrow}>THE FIRST POUR</Text>
      <Text style={s.title}>Your cocktail is ready.</Text>
      <Text style={s.name}>{TITLE}</Text>
      <Text style={s.meta}>Bright • Balanced • Beginner-friendly</Text>

      <View style={s.card}>
        <Text style={s.eyebrow}>GUIDED FLOW</Text>
        {["Prepare", "Measure", "Mix", "Taste", "Adjust", "Finish"].map((step, index) => (
          <Text key={step} style={s.step}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={saving}
        onPress={handleSave}
        style={({ pressed }) => [s.button, (pressed || saving) && s.buttonPressed]}
      >
        <Text style={s.buttonText}>{saving ? "SAVING…" : "SAVE THE MEMORY"}</Text>
      </Pressable>

      {status ? <Text style={s.status}>{status}</Text> : null}
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#120F14", padding: 28, paddingTop: 70 },
  eyebrow: { color: "#D6A84F", letterSpacing: 2 },
  title: { color: "#F4E9D0", fontSize: 30, fontWeight: "700", marginTop: 10 },
  name: { color: "#F4E9D0", fontSize: 23, fontWeight: "700", marginTop: 24 },
  meta: { color: "#BDB4BE", marginTop: 6 },
  card: { backgroundColor: "#211A25", padding: 22, borderRadius: 20, marginTop: 24 },
  step: { color: "#F4E9D0", fontSize: 17, marginTop: 14 },
  button: { backgroundColor: "#D6A84F", padding: 16, borderRadius: 14, marginTop: 24 },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: "#120F14", fontWeight: "800", textAlign: "center" },
  status: { color: "#F4E9D0", textAlign: "center", marginTop: 14, lineHeight: 20 },
  toast: { color: "#D6A84F", textAlign: "center", marginTop: 24 },
});
