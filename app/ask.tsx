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
   const zero=/mocktail|non.alcohol|no alcohol|zero.proof|without alcohol|sober/.test(q);
   let mood:Mood|undefined;
   let response:string;
   if(zero) response="For a zero-proof option, try citrus, a little syrup, and sparkling water. Our guided cocktail recipes contain alcohol.";
   else if(/fruit|tropical|sweet|margarita|tequila/.test(q)){mood="fruity";response="Try a Honey Lime Margarita! It's fresh and citrusy.";}
   else if(/bold|strong|bourbon|whiskey|old fashioned|rye/.test(q)){mood="bold";response="Try a Classic Old Fashioned, a spirit-forward favorite.";}
   else if(/surprise|rum|pineapple/.test(q)){mood="surprise";response="How about a Pineapple Sunset? It's tropical and refreshing.";}
   else if(/ingredient|my bar|what i have|have at home/.test(q)) response="Visit My Bar to save your ingredients, then choose a cocktail to mix.";
   else if(/shake|stir|jigger|measure|technique|learn/.test(q)) response="Shaking suits citrus drinks; stirring suits spirit-forward cocktails. Barchemy Academy has lessons on both.";
   else {mood="balanced";response="Let's start with the Barchemy House Sour, or choose a mood below.";}
   setMessages(previous=>[...previous.slice(-18),{from:"guest",text},{from:"jbink",text:response,mood}]);
   setDraft("");
 }
 return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
   <Link href="/home" style={styles.link}>← J.BINK'S BAR</Link>
   <Text style={styles.eyebrow}>ASK J.BINK</Text>
   <Text style={styles.title}>What are you in the mood for?</Text>
   <Text style={styles.copy}>Chat with J.Bink's guided preview. Open-ended AI conversations are still in development.</Text>
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
