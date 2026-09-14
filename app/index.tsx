import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={s.container}>
      <Text style={s.eyebrow}>WELCOME TO BARCHEMY</Text>
      <Text style={s.title}>Your bar. Your moment. Your magic.</Text>
      <Link href="/home" style={s.button}>
        ENTER BARCHEMY
      </Link>
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120F14",
    padding: 28,
    paddingTop: 90,
    justifyContent: "center",
  },
  eyebrow: {
    color: "#D6A84F",
    letterSpacing: 2,
    textAlign: "center",
  },
  title: {
    color: "#F4E9D0",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#D6A84F",
    color: "#120F14",
    fontWeight: "800",
    textAlign: "center",
    padding: 16,
    borderRadius: 14,
    marginTop: 34,
    overflow: "hidden",
  },
  toast: {
    color: "#BDB4BE",
    textAlign: "center",
    marginTop: 24,
  },
});
