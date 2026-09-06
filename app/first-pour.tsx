import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { supabase } from "../Supabase";

export default function Pour() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveMemory() {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push("/auth");
      return;
    }

    const { error } = await supabase.from("memories").insert({
      user_id: user.id,
      title: "The Barchemy House Sour",
      note: "Bright • Balanced • Beginner-friendly",
    });

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/memory");
  }

  return (
    <View style={s.c}>
      <Text style={s.e}>THE FIRST POUR</Text>
      <Text style={s.t}>Your cocktail is ready.</Text>
      <Text style={s.name}>The Barchemy House Sour</Text>
      <Text style={s.meta}>Bright • Balanced • Beginner-friendly</Text>

      <View style={s.card}>
        <Text style={s.e}>GUIDED FLOW</Text>
        {["Prepare", "Measure", "Mix", "Taste", "Adjust", "Finish"].map(
          (x, i) => (
            <Text key={x} style={s.step}>
              {i + 1}. {x}
            </Text>
          )
        )}
      </View>

      <Pressable style={s.btn} onPress={saveMemory} disabled={saving}>
        <Text style={s.btnText}>
          {saving ? "SAVING..." : "SAVE THE MEMORY"}
        </Text>
      </Pressable>

      {!!message && <Text style={s.message}>{message}</Text>}

      <Pressable onPress={() => router.push("/home")}>
        <Text style={s.back}>Back to J.Bink's Bar</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: "#120F14",
    padding: 28,
    paddingTop: 70,
  },
  e: {
    color: "#D6A84F",
    letterSpacing: 2,
  },
  t: {
    color: "#F4E9D0",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 10,
  },
  name: {
    color: "#D6A84F",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 22,
  },
  meta: {
    color: "#BDB4BE",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#211A25",
    padding: 22,
    borderRadius: 20,
    marginTop: 28,
  },
  step: {
    color: "#F4E9D0",
    paddingVertical: 6,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#D6A84F",
    padding: 15,
    textAlign: "center",
    borderRadius: 13,
    marginTop: 24,
  },
  btnText: {
    color: "#160F12",
    textAlign: "center",
    fontWeight: "700",
  },
  message: {
    color: "#D6A84F",
    marginTop: 16,
    textAlign: "center",
  },
  back: {
    color: "#D6A84F",
    marginTop: 22,
    textAlign: "center",
  },
});
