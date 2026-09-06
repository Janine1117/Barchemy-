import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { supabase } from "../Supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/home");
  }

  async function signUp() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.replace("/home");
    } else {
      setMessage("Account created. Check your email to confirm your account.");
    }
  }

  return (
    <View style={s.c}>
      <Text style={s.e}>BARCHEMY</Text>
      <Text style={s.t}>Welcome to the bar.</Text>
      <Text style={s.copy}>
        Create an account to save your cocktail memories privately.
      </Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        placeholderTextColor="#8F858F"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={s.input}
        placeholder="Password"
        placeholderTextColor="#8F858F"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={s.btn} onPress={signIn} disabled={loading}>
        <Text style={s.btnText}>
          {loading ? "PLEASE WAIT..." : "SIGN IN"}
        </Text>
      </Pressable>

      <Pressable style={s.secondary} onPress={signUp} disabled={loading}>
        <Text style={s.secondaryText}>CREATE ACCOUNT</Text>
      </Pressable>

      {!!message && <Text style={s.message}>{message}</Text>}
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
    fontSize: 13,
  },
  t: {
    color: "#F4E9D0",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 12,
  },
  copy: {
    color: "#BDB4BE",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#211A25",
    color: "#F4E9D0",
    padding: 16,
    borderRadius: 13,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#55405E",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#D6A84F",
    padding: 15,
    borderRadius: 13,
    marginTop: 22,
  },
  btnText: {
    color: "#160F12",
    textAlign: "center",
    fontWeight: "700",
  },
  secondary: {
    padding: 15,
    borderRadius: 13,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#55405E",
  },
  secondaryText: {
    color: "#F4E9D0",
    textAlign: "center",
    fontWeight: "700",
  },
  message: {
    color: "#D6A84F",
    marginTop: 20,
    lineHeight: 22,
  },
});
