import {Link} from "expo-router";
import {StyleSheet,Text,View} from "react-native";
export default function Arrival(){
 return <View style={s.c}>
  <Text style={s.mark}>✦ B ✦</Text><Text style={s.t}>BARCHEMY</Text>
  <Text style={s.sub}>Where Every Pour Becomes a Story.</Text>
  <View style={s.card}><Text style={s.j}>J.Bink</Text>
   <Text style={s.copy}>Your AI bartender, guide, and creative cocktail companion.</Text>
   <Text style={s.small}>J.Bink is a chatbot—not a human—and his canonical character stays consistent.</Text>
  </View>
  <Link href="/home" style={s.btn}>ENTER BARCHEMY</Link>
  <Text style={s.toast}>Sip. Smile. Repeat.
 </View>
}
const s=StyleSheet.create({c:{flex:1,backgroundColor:"#120F14",alignItems:"center",justifyContent:"center",padding:28},mark:{color:"#D6A84F",fontSize:28},t:{color:"#F4E9D0",fontSize:38,fontWeight:"700",letterSpacing:4},sub:{color:"#CDBD9A",marginTop:8,textAlign:"center"},card:{width:"100%",marginTop:42,padding:24,borderRadius:22,backgroundColor:"#211A25",borderWidth:1,borderColor:"#55405E"},j:{color:"#D6A84F",fontSize:25,fontWeight:"700"},copy:{color:"#F4E9D0",fontSize:18,marginTop:10},small:{color:"#BDB4BE",fontSize:13,marginTop:12},btn:{marginTop:28,backgroundColor:"#D6A84F",color:"#160F12",padding:15,borderRadius:14,fontWeight:"700"},toast:{color:"#BDB4BE",marginTop:22,fontStyle:"italic"}})
