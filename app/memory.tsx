import { useEffect, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { supabase } from "../Supabase";

type Memory = {
  id: string;
  title: string;
  note: string | null;
  created_at: string;
};

export default function Memory() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setMessage("Sign in to see your saved cocktail memories.");
      return;
    }

    const { data, error } = await supabase
      .from("memories")
      .select("id,title,note,created_at")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMemories(data ?? []);
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString();
  }

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.c}
    >
      <Text style={s.e}>MEMORY WALL</Text>
      <Text style={s.t}>Capture the magic.</Text>

      {loading && <Text style={s.status}>Loading your memories...</Text>}

      {!loading && message !== "" && (
        <View style={s.card}>
          <Text style={s.h}>Your memories will live here.</Text>
          <Text style={s.copy}>{message}</Text>

          <Pressable style={s.btn} onPress={() => router.push("/auth")}>
            <Text style={s.btnText}>SIGN IN</Text>
          </Pressable>
        </View>
      )}

      {!loading && message === "" && memories.length === 0 && (
        <View style={s.card}>
          <Text style={s.h}>Your memories will live here.</Text>
          <Text style={s.copy}>
            Save your first cocktail moment and it will appear here.
          </Text>
        </View>
      )}

      {!loading &&
        message === "" &&
        memories.map((memory) => (
          <View key={memory.id} style={s.memoryCard}>
            <Text style={s.memoryTitle}>{memory.title}</Text>

            {memory.note && (
              <Text style={s.memoryNote}>{memory.note}</Text>
            )}

            <Text style={s.date}>{formatDate(memory.created_at)}</Text>
          </View>
        ))}

      <Pressable onPress={() => router.push("/home")}>
        <Text style={s.back}>Back to J.Bink's Bar</Text>
      </Pressable>

      <Text style={s.toast}>Sip. Smile. Repeat.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#120F14",
  },
  c: {
    padding: 28,
    paddingTop: 70,
    paddingBottom: 50,
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
  status: {
    color: "#BDB4BE",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#211A25",
    padding: 24,
    borderRadius: 20,
    marginTop: 30,
  },
  h: {
    color: "#F4E9D0",
    fontSize: 19,
    fontWeight: "700",
  },
  copy: {
    color: "#BDB4BE",
    lineHeight: 23,
    marginTop: 10,
  },
  btn: {
    backgroundColor: "#D6A84F",
    padding: 14,
    borderRadius: 13,
    marginTop: 20,
  },
  btnText: {
    color: "#160F12",
    textAlign: "center",
    fontWeight: "700",
  },
  memoryCard: {
    backgroundColor: "#211A25",
    padding: 22,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#55405E",
  },
  memoryTitle: {
    color: "#D6A84F",
    fontSize: 21,
    fontWeight: "700",
  },
  memoryNote: {
    color: "#F4E9D0",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 23,
  },
  date: {
    color: "#8F858F",
    fontSize: 13,
    marginTop: 14,
  },
  back: {
    color: "#D6A84F",
    marginTop: 28,
    textAlign: "center",
  },
  toast: {
    color: "#D6A84F",
    marginTop: 30,
    fontStyle: "italic",
    textAlign: "center",
  },
});
