import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const scenes = [
  ["THE DOORS OPEN", "Step inside Barchemy", "A place where every pour becomes a story."],
  ["MEET J.BINK", "Your AI bartender awaits", "J.Bink welcomes you, helps you choose a vibe, and suggests drinks."],
  ["EXPLORE THE BAR", "Find your next cocktail", "Ask J.Bink for something fruity, bold, or unexpected."],
  ["MY BAR", "Your ingredients. Your drinks.", "Keep track of your ingredients and explore what you can make."],
  ["MEMORY WALL", "Make every moment count", "Save a cocktail moment and revisit it later."],
  ["THE BAR AWAITS", "Ready to mix some magic?", "Continue into J.Bink's Bar."],
];
const gold = "#D6A84F", cream = "#F4E9D0";
export default function Experience() {
  const [step, setStep] = useState(0);
  const scene = scenes[step];
  return <ScrollView style={{ backgroundColor:"#120F14" }} contentContainerStyle={{ padding:28, paddingTop:70, flexGrow:1, justifyContent:"center" }}>
    <Text style={{ color:gold, letterSpacing:3 }}>BARCHEMY  ·  {step+1} / {scenes.length}</Text>
    <Text style={{ color:cream, fontSize:30, fontWeight:"800", marginTop:20 }}>{scene[1]}</Text>
    <Text style={{ color:"#BDB4BE", fontSize:16, lineHeight:25, marginTop:15 }}>{scene[2]}</Text>
    <View style={{ backgroundColor:"#211A25", borderColor:"#634D30", borderWidth:1, padding:25, borderRadius:22, minHeight:260, justifyContent:"center", marginTop:28 }}>
      <Text style={{ color:gold, letterSpacing:2, fontSize:14 }}>{scene[0]}</Text>
      <Text style={{ color:cream, fontSize:26, marginTop:15 }}>{step===1 ? "J.BINK  ✦" : step===2 ? "ASK J.BINK  🍸" : step===3 ? "MY BAR  ✦" : step===4 ? "SIP. SMILE. REPEAT. ✨" : "WELCOME TO BARCHEMY"}</Text>
      <Text style={{ color:"#BDB4BE", lineHeight:24, marginTop:16 }}>{step===1 ? "Hey there! What are we in the mood for today?" : step===2 ? "Something fruity   ·   Something bold   ·   Surprise me" : step===3 ? "Spirits   ·   Mixers   ·   Garnishes" : step===4 ? "Your favorite cocktail moments live here." : "Where every pour becomes a story."}</Text>
    </View>
    {step===scenes.length-1
      ? <Link href="/home" style={{ backgroundColor:gold, color:"#120F14", textAlign:"center", padding:18, marginTop:26, fontWeight:"800", borderRadius:14, overflow:"hidden" }}>ENTER J.BINK'S BAR</Link>
      : <Pressable onPress={()=>setStep(step+1)} style={{ backgroundColor:gold, padding:18, marginTop:26, borderRadius:14 }}><Text style={{ color:"#120F14", textAlign:"center", fontWeight:"800" }}>CONTINUE  →</Text></Pressable>}
    <View style={{ flexDirection:"row", justifyContent:"space-between", marginTop:24 }}>
      {step>0 ? <Pressable onPress={()=>setStep(step-1)}><Text style={{ color:gold }}>← BACK</Text></Pressable> : <Link href="/" style={{color:gold}}>← WELCOME</Link>}
      <Link href="/home" style={{color:gold}}>SKIP INTRO</Link>
    </View>
    <Text style={{ color:"#BDB4BE", textAlign:"center", marginTop:30 }}>Sip. Smile. Repeat. ✨</Text>
  </ScrollView>;
}
