import { Image, StyleSheet, View } from "react-native";

const PORTRAIT = "https://raw.githubusercontent.com/Janine1117/Barchemy-/main/assets/jbink-portrait.svg";

export default function JBinkPortrait() {
  return (
    <View style={styles.frame}>
      <Image
        accessibilityLabel="J.Bink, Barchemy's bartender"
        source={{ uri: PORTRAIT }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#8F6A3B", backgroundColor: "#221820" },
  image: { width: 210, height: 293 },
});
