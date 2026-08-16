import {Link} from "expo-router"; import {StyleSheet,Text,View} from "react-native";
export default function Ask(){return <View style={s.c}><Text style={s.e}>ASK J.BINK</Text><Text style={s.t}>What are you in the mood for?</Text><Text style={s.copy}>Text-first alpha flow. J.Bink uses your request and My Bar context.</Text>
{["Something fruity","Something bold","Use what I have","Surprise me"].map(x=><Link key={x} href="/first-pour" style={s.p}>{x}</Link>)}
<Link href="/home" style={s.back}>Back to J.Bink's Bar</Link></View>}
const s=StyleSheet.create({c:{flex:1,backgroundColor:"#120F14",padding:28,paddingTop:70},e:{color:"#D6A84F",letterSpacing:2},t:{color:"#F4E9D0",fontSize:30,fontWeight:"700",marginTop:12},copy:{color:"#BDB4BE",fontSize:15,lineHeight:23,marginVertical:18},p:{backgroundColor:"#211A25",color:"#F4E9D0",padding:17,borderRadius:14,marginTop:10,borderWidth:1,borderColor:"#55405E"},back:{color:"#D6A84F",marginTop:28}})
