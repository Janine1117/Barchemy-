import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import JBinkPortrait from "../components/JBinkPortrait";
import BottomNav from "../components/BottomNav";

const choices = [
  { label: "🍍 Something fruity", mood: "fruity", description: "Bright and refreshing" },
  { label: "🥃 Something bold", mood: "bold", description: "Classic and full-flavored" },
  { label: "🍋 Something balanced", mood: "balanced", description: "Easy to mix" },
  { label: "✦ Surprise me", mood: "surprise", description: "A fresh recommendation" },
] as const;

const recipes = [
 {mood:"balanced",name:"Barchemy House Sour",needs:["whiskey","lemon","simple syrup"]},
 {mood:"fruity",name:"Honey Lime Margarita",needs:["tequila","lime","honey syrup"]},
 {mood:"bold",name:"Classic Old Fashioned",needs:["bourbon","bitters","simple syrup"]},
 {mood:"surprise",name:"Pineapple Sunset",needs:["rum","pineapple","lime"]}
] as const;
export default function Ask() {
 const [owned,setOwned]=useState<string[]>([]);
 const [show,setShow]=useState(false);
 useEffect(()=>{
   try { const raw=(globalThis as any).localStorage?.getItem("barchemy.mybar.v1");
     const items=raw?JSON.parse(raw):[];
     if(Array.isArray(items)) setOwned(items.filter(x=>typeof x?.name==="string").map(x=>x.name.toLowerCase()));
   } catch {}
 },[]);
 const matches=recipes.map(recipe=>({...recipe,have:recipe.needs.filter(need=>owned.some(item=>item.includes(need)||need.includes(item)||(need==="whiskey"&&item.includes("bourbon"))))})).sort((a,b)=>b.have.length-a.have.length);

  return (
    <ScrollView style={s.page} contentContainerStyle={s.container}>
      <Text style={s.eyebrow}>ASK J.BINK</Text>
      <Text style={s.title}>What are you in the mood for?</Text>
      <View style={s.bartender}>
        <JBinkPortrait />
        <View style={s.bubble}>
          <Text style={s.message}>Hey there! I've got a few ideas for your next pour. Pick a mood, and we'll start mixing.</Text>
        </View>
      </View>
      <Text style={s.section}>MIX FROM MY BAR</Text>
      <Pressable accessibilityRole="button" onPress={()=>setShow(!show)} style={s.inventoryButton}><Text style={s.inventoryButtonText}>{show?"HIDE RECIPE MATCHES":"FIND DRINKS FROM MY INGREDIENTS"} · {owned.length} saved</Text></Pressable>
      {show && (owned.length===0 ? <Text style={s.note}>Add ingredients in My Bar first to see matches.</Text> : matches.map(recipe=><View key={recipe.mood} style={s.matchCard}>
        <Text style={s.choice}>{recipe.name} · {recipe.have.length}/{recipe.needs.length} key ingredients</Text>
        <Text style={s.detail}>Available: {recipe.have.join(", ")||"none yet"}</Text>
        <Text style={s.detail}>Missing: {recipe.needs.filter(x=>!recipe.have.includes(x)).join(", ")||"none of the key ingredients"}</Text>
        <Link href={{pathname:"/first-pour",params:{mood:recipe.mood}}} style={s.matchLink}>VIEW RECIPE →</Link>
      </View>))}
      <Text style={s.note}>Matches use a starter recipe library and your locally saved inventory. Check all ingredients before mixing.</Text>
      <Text style={s.section}>LET'S FIND YOUR DRINK</Text>
      {choices.map((choice) => (
        <Link
          key={choice.mood}
          href={{ pathname: "/first-pour", params: { mood: choice.mood } }}
          style={s.option}
        >
          <Text style={s.choice}>{choice.label}</Text>
          <Text style={s.detail}>  ·  {choice.description}</Text>
        </Link>
      ))}
      <Text style={s.note}>This preview uses curated cocktail choices. Open-ended AI chat is still in development.</Text>
      <BottomNav />
    </ScrollView>
  );
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  container:{padding:24,paddingTop:60,paddingBottom:40,flexGrow:1},
  eyebrow:{color:"#D6A84F",letterSpacing:2,fontSize:12},
  title:{color:"#F4E9D0",fontSize:30,fontWeight:"700",marginTop:12,marginBottom:19},
  bartender:{backgroundColor:"#211A25",borderRadius:22,padding:20,alignItems:"center",borderColor:"#5A4230",borderWidth:1},
  bubble:{backgroundColor:"#302631",borderRadius:14,padding:17,width:"100%",marginTop:15},
  message:{color:"#F4E9D0",fontSize:16,lineHeight:24},
  section:{color:"#D6A84F",letterSpacing:2,marginTop:25,marginBottom:8,fontSize:12},
  option:{backgroundColor:"#211A25",color:"#F4E9D0",padding:16,borderWidth:1,borderColor:"#55405E",borderRadius:13,marginTop:10,overflow:"hidden"},
  choice:{color:"#F4E9D0",fontWeight:"700",fontSize:15},
  detail:{color:"#BDB4BE",fontSize:12},
  note:{color:"#BDB4BE",fontSize:12,lineHeight:18,marginTop:18},
  inventoryButton:{backgroundColor:"#315743",padding:15,borderRadius:12,marginTop:12},
  inventoryButtonText:{color:"#F4E9D0",fontWeight:"800",textAlign:"center"},
  matchCard:{backgroundColor:"#211A25",borderRadius:12,padding:15,marginTop:10,gap:9},
  matchLink:{color:"#D6A84F",fontWeight:"800",marginTop:5}
});
