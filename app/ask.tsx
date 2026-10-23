import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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
 const [draft,setDraft]=useState("");
 const [conversation,setConversation]=useState<{from:"guest"|"jbink";text:string;mood?:string}[]>([]);
 useEffect(()=>{
   try { const raw=(globalThis as any).localStorage?.getItem("barchemy.mybar.v1");
     const items=raw?JSON.parse(raw):[];
     if(Array.isArray(items)) setOwned(items.filter(x=>typeof x?.name==="string").map(x=>x.name.toLowerCase()));
   } catch {}
 },[]);
 const matches=recipes.map(recipe=>({...recipe,have:recipe.needs.filter(need=>owned.some(item=>item.includes(need)||need.includes(item)||(need==="whiskey"&&item.includes("bourbon"))))})).sort((a,b)=>b.have.length-a.have.length);

  function respond() {
    const text=draft.trim();
    if(!text)return;
    const q=text.toLowerCase();
    const noAlcohol=/mocktail|non.?alcohol|no alcohol|zero.?proof|without alcohol|sober/.test(q);
    let mood="balanced",reply="";
    if(noAlcohol) reply="Absolutely! Try sparkling water, fresh citrus, and a little syrup for a balanced zero-proof drink. My guided recipes currently contain alcohol, so I won't send you to one for this request.";
    else if(/fruit|tropical|pineapple|sweet|margarita|tequila/.test(q)){mood="fruity";reply="Sounds like a bright, fruity pour! Honey Lime Margarita could be your next pick.";}
    else if(/bold|strong|bourbon|whiskey|old fashioned|rye/.test(q)){mood="bold";reply="For a spirit-forward classic, try the Old Fashioned. Measure carefully and sip responsibly.";}
    else if(/surprise|rum|pineapple/.test(q)){mood="surprise";reply="How about a Pineapple Sunset? Tropical and refreshing.";}
    else if(/have|ingredient|my bar|make with/.test(q)){reply="Open 'Find Drinks From My Ingredients' below to see what your saved collection can make.";}
    else if(/how|shake|stir|learn|jigger|measure/.test(q)){reply="Great question! Barchemy Academy covers tools and mixing technique. Citrus cocktails are usually shaken; spirit-forward classics are usually stirred.";}
    else reply="I can help you find fruity, bold, balanced, or surprise recipes. You can also ask about mixing technique or your saved ingredients.";
    setConversation(previous=>[...previous,{from:"guest",text},{from:"jbink",text:reply,mood:!noAlcohol&&/fruit|tropical|pineapple|sweet|margarita|tequila|bold|strong|bourbon|whiskey|old fashioned|rye|surprise|rum/.test(q)?mood:undefined}]);
    setDraft("");
  }
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
      <Text style={s.section}>CHAT WITH J.BINK · GUIDED PREVIEW</Text>
      <Text style={s.note}>Ask about flavors, cocktail styles, or techniques. This is an interactive scripted preview, not open-ended AI.</Text>
      {conversation.map((message,index)=><View key={index} style={[s.chatBubble,message.from==="guest"&&s.guestBubble]}>
        <Text style={s.chatLabel}>{message.from==="guest"?"YOU":"J.BINK"}</Text>
        <Text style={s.message}>{message.text}</Text>
        {message.mood&&<Link href={{pathname:"/first-pour",params:{mood:message.mood}}} style={s.matchLink}>OPEN GUIDED RECIPE →</Link>}
      </View>)}
      <TextInput accessibilityLabel="Message J.Bink" placeholder="Ask J.Bink something..." placeholderTextColor="#998B9C" value={draft} onChangeText={setDraft} onSubmitEditing={respond} style={s.chatInput} returnKeyType="send"/>
      <Pressable accessibilityRole="button" onPress={respond} style={s.inventoryButton}><Text style={s.inventoryButtonText}>SEND MESSAGE →</Text></Pressable>
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
  matchLink:{color:"#D6A84F",fontWeight:"800",marginTop:5},
  chatBubble:{backgroundColor:"#302631",padding:16,borderRadius:14,marginTop:10,gap:8},
  guestBubble:{backgroundColor:"#243A32"},
  chatLabel:{color:"#D6A84F",fontSize:11,fontWeight:"800",letterSpacing:1},
  chatInput:{backgroundColor:"#211A25",borderColor:"#66516B",borderWidth:1,borderRadius:12,padding:15,color:"#F4E9D0",marginTop:14,fontSize:16}
});
