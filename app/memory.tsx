import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { loadMemories, type MemoryRow } from "../lib/memories";

export default function Memory() {
  const [memories, setMemories] = useState<MemoryRow[]>([]);
  const [message, setMessage] = useState("Loading your memories…");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await loadMemories();
      setMemories(result.memories);

      if (!result.ok) {
        setMessage(result.message);
      } else if (result.memories.length === 0) {
        setMessage("No memories saved yet. Save a cocktail from The First Pour.");
      } else {
        setMessage("");
      }
    } catch (error) {
      setMemories([]);
      setMessage(error instanceof Error ? error.message : "Unable to load memories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.eyebrow}>MEMORY WALL</Text>
      <Text style={s.title}>Capture the magic.</Text>

      {message ? (
        <View style={s.card}>
          <Text style={s.heading}>{loading ? "One moment…" : "Your memories live here."}</Text>
          <Text style={s.copy}>{message}</Text>
        </View>
      ) : null}

      {memories.map((memory) => (
        <View key={memory.id} style={s.card}>
          <Text style={s.heading}>{memory.title}</Text>
          <Text style={s.copy}>{memory.recipe}</Text>
          <Text style={s.date}>{new Date(memory.created_at).toLocaleString()}</Text>
        </View>
      ))}

      <Pressable accessibilityRole="button" onPress={() => void refresh()} style={s.refreshButton}>
        <Text style={s.refreshText}>{loading ? "LOADING…" : "REFRESH MEMORIES"}</Text>
      </Pressable>

      <Text style={s.toast}>Sip. Smile. Repeat.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#120F14",
    padding: 28,
    paddingTop: 70,
    paddingBottom: 48,
  },
  eyebrow: { color: "#D6A84F", letterSpacing: 2 },
  title: { color: "#F4E9D0", fontSize: 30, fontWeight: "700", marginTop: 10 },
  card: { backgroundColor: "#211A25", padding: 22, borderRadius: 20, marginTop: 18 },
  heading: { color: "#F4E9D0", fontSize: 19, fontWeight: "700" },
  copy: { color: "#BDB4BE", lineHeight: 23, marginTop: 10 },
  date: { color: "#8E858F", fontSize: 12, marginTop: 14 },
  refreshButton: { borderWidth: 1, borderColor: "#D6A84F", padding: 14, borderRadius: 12, marginTop: 20 },
  refreshText: { color: "#D6A84F", textAlign: "center", fontWeight: "700" },
  toast: { color: "#D6A84F", textAlign: "center", marginTop: 28 },
});
