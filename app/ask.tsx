import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type Mood = "fruity" | "bold" | "balanced" | "surprise";
type Message = { from: "guest" | "jbink"; text: string; mood?: Mood };
const choices: {label:string;mood:Mood}[] = [
 {label:"Something fruity",mood:"fruity"},
 {label:"Something bold",mood:"bold"},
 {label:"Something balanced",mood:"balanced"},
 {label:"Surprise me",mood:"surprise"}
];

const recipeOptions: {mood:Mood;name:string;needs:string[][]}[] = [
 {mood:"fruity",name:"Honey Lime Margarita",needs:[["tequila"],["lime"],["honey syrup","honey"]]},
 {mood:"bold",name:"Classic Old Fashioned",needs:[["bourbon","rye","whiskey"],["bitters"],["simple syrup","sugar","syrup"]]},
 {mood:"balanced",name:"Barchemy House Sour",needs:[["whiskey","bourbon","rye"],["lemon"],["simple syrup","syrup","sugar"]]},
 {mood:"surprise",name:"Pineapple Sunset",needs:[["rum"],["pineapple"],["lime"],["simple syrup","syrup","sugar"]]}
];
function myBarSuggestion(preferred?:Mood): {mood?:Mood;response:string} {
 try {
 const raw=(globalThis as any).localStorage?.getItem("barchemy.mybar.v1");
 const items=raw?JSON.parse(raw):[];
 const names:string[]=Array.isArray(items)?items.filter((x:any)=>x&&typeof x.name==="string"&&x.category!=="Equipment").map((x:any)=>x.name.trim().toLowerCase()):[];
 if(!names.length)return {response:"Your My Bar is empty on this device. Add a few ingredients, then ask me again."};
 const ranked=recipeOptions.map(recipe=>{
  const matched=recipe.needs.map(group=>group.some(term=>names.some(name=>name.includes(term))));
  return {...recipe,count:matched.filter(Boolean).length,missing:recipe.needs.filter((_,i)=>!matched[i]).map(group=>group[0])};
 }).sort((a,b)=>((b.mood===preferred?0.5:0)+b.count/b.needs.length)-((a.mood===preferred?0.5:0)+a.count/a.needs.length));
 const best=ranked[0];
 if(!best.count)return {response:"I can see "+names.length+" items in My Bar, but none match the core ingredients of my current guided recipes. Tell me a flavor you enjoy, or add a spirit and mixer."};
 const missing=best.missing.length?" You may still need: "+best.missing.join(", ")+".":" You've got the main flavor ingredients; check the recipe for ice, garnish, and exact measurements.";
 return {mood:best.mood,response:"From your saved My Bar ingredients, "+best.name+" is the closest match ("+best.count+" of "+best.needs.length+" core ingredient groups)."+missing};
 }catch{return {response:"I couldn't read My Bar on this device. Open My Bar to check your saved ingredients."};}
}

export function ErrorBoundary({error,retry}:{error:Error;retry:()=>void}) {
 return <View style={styles.page}><Text style={styles.title}>J.Bink's chat needs attention</Text>
 <Text style={styles.copy}>{error?.message || "Unable to load the chat."}</Text>
 <Pressable onPress={retry} style={styles.button}><Text style={styles.buttonText}>TRY AGAIN</Text></Pressable>
 <Link href="/home" style={styles.link}>RETURN TO THE BAR</Link></View>;
}

export default function Ask() {
 const [draft,setDraft]=useState("");
 const [messages,setMessages]=useState<Message[]>([]);
 function send() {
   const text=draft.trim();
   if(!text)return;
   const q=text.toLowerCase();
   const zero=/mocktail|non.alcohol|no alcohol|zero.proof|without alcohol|sober|alcohol.free/.test(q);
   const wantsBar=/ingredient|my bar|what i have|have at home|make with|use what i have|on hand|in my kitchen/.test(q);
   const preference: Mood|undefined=/bold|strong|bourbon|whiskey|old fashioned|rye/.test(q)?"bold":/fruit|tropical|sweet|margarita|tequila/.test(q)?"fruity":/balanced|sour|lemon/.test(q)?"balanced":/surprise|rum|pineapple/.test(q)?"surprise":undefined;
   let mood:Mood|undefined;
   let response:string;
   if(zero) response="Absolutely! For a zero-proof drink, try fresh citrus, a little syrup, and sparkling water over ice. My four guided recipes currently contain alcohol, so I won't link you to those as mocktails.";
   else if(wantsBar){const result=myBarSuggestion(preference);mood=result.mood;response=result.response;}
   else if(/shake|stir|jigger|measure|technique|learn|academy/.test(q)) response="Here's a bartender tip: shake drinks with citrus to chill and blend them; stir spirit-forward drinks for a silky finish. Barchemy Academy has hands-on lessons, too.";
   else if(/less sweet|not sweet|dry|tart/.test(q)){mood="balanced";response="Looking for less sweetness? Try the House Sour and start with a little less syrup, then taste and adjust. Want it more citrus-forward or more mellow?";}
   else if(/refresh|light|summer|hot day/.test(q)){mood="fruity";response="For a bright, refreshing direction, I'd start with a Honey Lime Margarita. You can adjust the honey syrup to your taste.";}
   else if(preference==="bold"){mood="bold";response="In the mood for something spirit-forward? The Classic Old Fashioned is rich, smooth, and stirred rather than shaken.";}
   else if(preference==="fruity"){mood="fruity";response="Let's go citrusy! The Honey Lime Margarita combines tequila, lime, and honey syrup. Prefer tart or sweet?";}
   else if(preference==="surprise"){mood="surprise";response="Surprise pour! Pineapple Sunset brings rum, pineapple, and lime together. Tropical enough for you?";}
   else if(preference==="balanced"){mood="balanced";response="The Barchemy House Sour balances whiskey, lemon, and syrup. It's a lovely place to start.";}
   else response="Tell me what flavors you enjoy—fruity, bold, tart, or refreshing—or ask what you can make with My Bar. I'll narrow it down with you.";
   setMessages(previous=>[...previous.slice(-18),{from:"guest",text},{from:"jbink",text:response,mood}]);
   setDraft("");
 }
 return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
   <Link href="/home" style={styles.link}>← J.BINK'S BAR</Link>
   <Text style={styles.eyebrow}>ASK J.BINK</Text>
   <Text style={styles.title}>What are you in the mood for?</Text>
   <Text style={styles.copy}>J.Bink's guided preview now considers flavor preferences and saved My Bar ingredients. Open-ended AI chat is still in development.</Text>
   <View style={styles.card}><Text style={styles.copy}>Welcome! Tell me what flavors you like, or choose a drink below.</Text></View>
   {messages.map((item,index)=><View key={index} style={styles.card}>
     <Text style={styles.eyebrow}>{item.from==="guest"?"YOU":"J.BINK"}</Text>
     <Text style={styles.copy}>{item.text}</Text>
     {item.mood ? <Link href={{pathname:"/first-pour",params:{mood:item.mood}}} style={styles.link}>OPEN GUIDED RECIPE →</Link> : null}
   </View>)}
   <TextInput accessibilityLabel="Message J.Bink" value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send" placeholder="Ask J.Bink a question..." placeholderTextColor="#BDB4BE" style={styles.input}/>
   <Pressable accessibilityRole="button" onPress={send} style={styles.button}><Text style={styles.buttonText}>SEND MESSAGE →</Text></Pressable>
   <Text style={styles.eyebrow}>CHOOSE A MOOD</Text>
   {choices.map(item=><Link key={item.mood} href={{pathname:"/first-pour",params:{mood:item.mood}}} style={styles.choice}>{item.label} →</Link>)}
   <Link href="/my-bar" style={styles.link}>VISIT MY BAR →</Link>
   <Link href="/academy" style={styles.link}>EXPLORE BARCHEMY ACADEMY →</Link>
 </ScrollView>;
}
const styles=StyleSheet.create({
 page:{flex:1,backgroundColor:"#120F14"},
 content:{padding:24,paddingTop:55,paddingBottom:60},
 eyebrow:{color:"#D6A84F",fontSize:12,fontWeight:"700",letterSpacing:2,marginTop:22},
 title:{color:"#F4E9D0",fontSize:29,fontWeight:"800",marginTop:12,marginBottom:16},
 copy:{color:"#F4E9D0",fontSize:16,lineHeight:24,marginTop:8},
 card:{backgroundColor:"#211A25",padding:18,borderRadius:15,marginTop:14},
 input:{color:"#F4E9D0",backgroundColor:"#211A25",borderWidth:1,borderColor:"#D6A84F",borderRadius:12,padding:16,marginTop:22,fontSize:16},
 button:{backgroundColor:"#D6A84F",padding:17,borderRadius:12,marginTop:12},
 buttonText:{color:"#120F14",fontWeight:"800",textAlign:"center"},
 link:{color:"#D6A84F",fontWeight:"700",marginTop:19},
 choice:{color:"#F4E9D0",backgroundColor:"#211A25",padding:18,marginTop:10,borderRadius:12,overflow:"hidden",fontWeight:"700"}
});
