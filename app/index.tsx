import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  return <View style={s.container}>
    <Text style={s.eyebrow}>WELCOME TO BARCHEMY</Text>
    <Text style={s.title}>Your bar. Your moment. Your magic.</Text>
    <Link href="/experience" style={s.button}>ENTER BARCHEMY</Link>
      <View style={s.policyLinks}>
        <Link href="/terms" style={s.policyLink}>TERMS</Link>
        <Link href="/privacy" style={s.policyLink}>PRIVACY</Link>
        <Link href="/refunds" style={s.policyLink}>REFUNDS</Link>
      </View>
    <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
  </View>;
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:"#120F14",padding:28,justifyContent:"center"},
  eyebrow:{color:"#D6A84F",letterSpacing:2,textAlign:"center"},
  title:{color:"#F4E9D0",fontSize:34,lineHeight:42,fontWeight:"700",textAlign:"center",marginTop:16},
  button:{backgroundColor:"#D6A84F",color:"#120F14",fontWeight:"800",textAlign:"center",padding:16,borderRadius:14,marginTop:34,overflow:"hidden"},
  policyLinks:{flexDirection:"row",justifyContent:"center",gap:17,marginTop:27},
  policyLink:{color:"#D6A84F",fontSize:12,fontWeight:"700"},
  toast:{color:"#BDB4BE",textAlign:"center",marginTop:24}
});
