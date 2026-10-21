import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import JBinkPortrait from "../components/JBinkPortrait";
import BottomNav from "../components/BottomNav";

const greetings = {
  Classic: "Welcome to my bar. Tell me what sounds good, and we'll find your next favorite cocktail.",
  Funny: "Pull up a stool! The only bad question is whether we have more ice.",
  Coach: "You have great taste in the making. Let's create something you'll be proud to pour.",
  Host: "The bar is open! Let's pick the right drink for the moment.",
};
type Vibe = keyof typeof greetings;
const vibes: Vibe[] = ["Classic", "Funny", "Coach", "Host"];

export default function Home() {
  const [vibe, setVibe] = useState<Vibe>("Classic");
  return (
    <ScrollView style={s.page} contentContainerStyle={s.container}>
      <View style={s.brandRow}>
        <Text style={s.brand}>BARCHEMY</Text>
        <Link href="/experience" style={s.intro}>VIEW INTRO  ↗</Link>
      </View>
      <Text style={s.eyebrow}>THE BARCHEMY EXPERIENCE</Text>
      <Text style={s.heading}>Welcome to J.Bink's Bar.</Text>
      <View style={s.hero}>
        <View style={s.portrait}><JBinkPortrait /></View>
        <Text style={s.heroName}>J.BINK</Text>
        <Text style={s.heroRole}>YOUR BARTENDER</Text>
        <View style={s.bubble}>
          <Text style={s.bubbleText}>{greetings[vibe]}</Text>
        </View>
        <View style={s.actions}>
          <Link href="/first-pour" style={s.primary}>START A RECIPE</Link>
          <Link href="/ask" style={s.outline}>ASK J.BINK</Link>
        </View>
      </View>
      <Text style={s.sectionLabel}>J.BINK'S WELCOME STYLES</Text>
      <Text style={s.small}>Choose how J.Bink greets you.</Text>
      <View style={s.vibeRow}>
        {vibes.map((item) => (
          <Pressable accessibilityRole="button" key={item} onPress={() => setVibe(item)} style={[s.vibe, item === vibe && s.selected]}>
            <Text style={[s.vibeText, item === vibe && s.selectedText]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.sectionLabel}>EVERYTHING YOU NEED, ALL IN BARCHEMY</Text>
      <View style={s.tiles}>
        <Link href="/ask" style={s.tile}>✦  FIND A DRINK</Link>
        <Link href="/my-bar" style={s.tile}>◈  MY BAR</Link>
        <Link href="/first-pour" style={s.tile}>♧  THE FIRST POUR</Link>
        <Link href="/memory" style={s.tile}>♡  MEMORY WALL</Link>
      </View>
      <BottomNav />
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  container:{flexGrow:1,padding:22,paddingTop:45,paddingBottom:40},
  brandRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  brand:{color:"#D6A84F",fontSize:20,letterSpacing:3,fontWeight:"800"},
  intro:{color:"#D6A84F",fontSize:11,fontWeight:"700"},
  eyebrow:{color:"#D6A84F",fontSize:11,letterSpacing:2,marginTop:26},
  heading:{color:"#F4E9D0",fontSize:28,fontWeight:"700",marginTop:8,marginBottom:18},
  hero:{backgroundColor:"#211A25",borderRadius:24,padding:20,borderWidth:1,borderColor:"#57412E",alignItems:"center"},
  portrait:{borderRadius:18,overflow:"hidden"},
  heroName:{fontSize:24,color:"#D6A84F",letterSpacing:3,fontWeight:"800",marginTop:12},
  heroRole:{color:"#BDB4BE",fontSize:11,letterSpacing:2,marginTop:4},
  bubble:{backgroundColor:"#302631",borderRadius:16,padding:16,width:"100%",marginTop:18},
  bubbleText:{color:"#F4E9D0",fontSize:16,lineHeight:24},
  actions:{flexDirection:"row",gap:10,width:"100%",marginTop:17},
  primary:{flex:1,textAlign:"center",backgroundColor:"#315743",color:"#F4E9D0",fontWeight:"800",fontSize:12,paddingVertical:15,borderRadius:12,overflow:"hidden"},
  outline:{flex:1,textAlign:"center",borderColor:"#D6A84F",borderWidth:1,color:"#D6A84F",fontWeight:"800",fontSize:12,paddingVertical:14,borderRadius:12,overflow:"hidden"},
  sectionLabel:{color:"#D6A84F",letterSpacing:1.4,fontSize:12,marginTop:27,fontWeight:"700"},
  small:{color:"#BDB4BE",marginTop:8},
  vibeRow:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:13},
  vibe:{paddingHorizontal:17,paddingVertical:12,borderRadius:12,borderColor:"#5B455F",borderWidth:1,backgroundColor:"#211A25"},
  selected:{borderColor:"#D6A84F",backgroundColor:"#46371D"},
  vibeText:{color:"#BDB4BE",fontWeight:"700"},
  selectedText:{color:"#F4E9D0"},
  tiles:{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:13},
  tile:{width:"48%",backgroundColor:"#211A25",color:"#F4E9D0",fontWeight:"700",textAlign:"center",paddingVertical:21,borderRadius:15,overflow:"hidden",fontSize:12},
  toast:{color:"#D6A84F",textAlign:"center",marginTop:22}
});
