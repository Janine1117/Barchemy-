import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import JBinkPortrait from "../components/JBinkPortrait";
import SeasonSelector, { useAtmosphere } from "../components/SeasonSelector";

const scenes = [
  { eyebrow:"01 · THE ENTRANCE", title:"Step into the Barchemy experience.", copy:"Where every pour becomes a story." },
  { eyebrow:"02 · MEET YOUR BARTENDER", title:"J.Bink is here to welcome you.", copy:"Your bartender helps you find the right drink for the moment." },
  { eyebrow:"03 · DISCOVER", title:"Find a cocktail that fits.", copy:"From something fruity to a bold classic, explore your next first pour." },
  { eyebrow:"04 · MY BAR", title:"Your bar, your ingredients.", copy:"Keep an eye on what's in your collection and discover what you can make." },
  { eyebrow:"05 · THE MEMORY WALL", title:"Make it a memory.", copy:"Capture your favorite cocktail moments and revisit them whenever you like." },
  { eyebrow:"06 · YOUR FIRST POUR AWAITS", title:"Your first pour awaits.", copy:"Start mixing with J.Bink, or explore the rest of Barchemy." },
];
const gold="#D6A84F", cream="#F4E9D0";

function Shelf() {
  return <View style={s.shelf}>
    {[58,81,68,92,62,76,58].map((height,i)=>
      <View key={i} style={{...s.bottle,height,backgroundColor:["#67472D","#927144","#603625","#A27332"][i%4]}} />
    )}
  </View>;
}
function Stage({step}:{step:number}) {
  if(step===0){
    return <View style={s.stage}>
      <Text style={s.star}>✦</Text>
      <Text style={s.stageBrand}>BARCHEMY</Text>
      <Text style={s.caption}>WELCOME TO YOUR NEW FAVORITE PLACE</Text>
      <Shelf />
      <Text style={s.stageCopy}>The doors are open. Let's make something special.</Text>
    </View>;
  }
  if(step===1 || step===5){
    return <View style={s.stage}>
      <JBinkPortrait />
      <Text style={s.stageBrand}>J.BINK</Text>
      <Text style={s.caption}>YOUR BARTENDER</Text>
      <View style={s.bubble}><Text style={s.bubbleText}>{step===1?"Welcome in! I'm J.Bink. What are we getting into tonight?":"Ready to mix? I’ll be right here when you are."}</Text></View>
    </View>;
  }
  if(step===2){
    return <View style={s.stage}>
      <Text style={s.stageLabel}>ASK J.BINK</Text>
      <Text style={s.previewTitle}>What are you in the mood for?</Text>
      {["🍍  Something fruity", "🥃  Something bold", "✦  Use what I have", "🍸  Surprise me"].map(x=>
        <View key={x} style={s.previewItem}><Text style={s.previewItemText}>{x}</Text></View>
      )}
    </View>;
  }
  if(step===3){
    return <View style={s.stage}>
      <Text style={s.stageLabel}>MY BAR</Text>
      <Text style={s.previewTitle}>Your collection</Text>
      <Text style={s.stageCopy}>A home for everything behind your bar.</Text>
      {["Spirits", "Liqueurs & Syrups", "Mixers", "Garnishes"].map((x,i)=>
        <View key={x} style={s.previewRow}>
          <Text style={s.previewItemText}>{x}</Text><Text style={s.previewDim}>{["🥃","🍯","🍋","🌿"][i]}</Text>
        </View>
      )}
    </View>;
  }
  return <View style={s.stage}>
    <Text style={s.star}>♡</Text>
    <Text style={s.stageLabel}>MEMORY WALL</Text>
    <Text style={s.previewTitle}>Capture the magic.</Text>
    <View style={s.memoryCard}>
      <Text style={s.stageLabel}>THE BARCHEMY HOUSE SOUR</Text>
      <Text style={s.stageCopy}>Bright · Balanced · Beginner-friendly</Text>
      <Text style={s.previewDim}>Your saved cocktail moments live here.</Text>
    </View>
    <Text style={s.stageCopy}>Sip. Smile. Repeat. ✨</Text>
  </View>;
}
export function ErrorBoundary({error,retry}:{error:Error;retry:()=>void}) {
 return <View style={{flex:1,backgroundColor:"#120F14",padding:24,justifyContent:"center"}}>
 <Text style={{color:"#D6A84F",fontSize:22,fontWeight:"800"}}>Bar tour could not load</Text>
 <Text style={{color:"#F4E9D0",marginTop:16}}>{error?.message||"An unexpected error occurred."}</Text>
 <Pressable accessibilityRole="button" onPress={retry} style={{backgroundColor:"#D6A84F",padding:16,borderRadius:12,marginTop:22}}><Text style={{color:"#120F14",textAlign:"center"}}>TRY AGAIN</Text></Pressable>
 <Link href="/experience" style={{color:"#D6A84F",marginTop:22}}>RETURN TO BARCHEMY EXPERIENCE</Link>
 </View>;
}
export default function Experience() {
  const [step,setStep]=useState(0);
  const scene=scenes[step];
  const {theme}=useAtmosphere();
  return <ScrollView style={s.page} contentContainerStyle={s.container}>
    <View style={s.top}>
      <Link href="/home" style={s.brand}>BARCHEMY</Link>
      <Text style={s.count}>{step+1} / {scenes.length}</Text>
    </View>
    <Text style={{color:theme.color,marginTop:15,fontWeight:"700"}}>{theme.icon} {theme.name.toUpperCase()} BAR ATMOSPHERE</Text>
    <View style={s.progress}>{scenes.map((_,i)=><View key={i} style={i<=step ? {...s.segment,...s.segmentOn} : s.segment}/>)}</View>
    <Text style={s.eyebrow}>{scene.eyebrow}</Text>
    <Text style={s.title}>{scene.title}</Text>
    <Text style={s.copy}>{scene.copy}</Text>
    <View style={{backgroundColor:theme.background,borderColor:theme.color,borderWidth:2,borderRadius:24}}><Stage step={step} /></View>
    <SeasonSelector />
    <Link href="/academy" style={s.secondaryButton}>EXPLORE BARCHEMY ACADEMY →</Link>
    {step===scenes.length-1
      ? <View style={s.finalActions}><Link href="/ask" style={s.button}>ASK J.BINK & START MIXING →</Link><Link href="/experience" style={s.secondaryButton}>EXPLORE BARCHEMY →</Link></View>
      : <Pressable accessibilityRole="button" style={s.button} onPress={()=>setStep(step+1)}><Text style={s.buttonText}>CONTINUE  →</Text></Pressable>}
    <View style={s.footer}>
      {step>0?<Pressable accessibilityRole="button" onPress={()=>setStep(step-1)}><Text style={s.footerLink}>← PREVIOUS</Text></Pressable>:<Link href="/home" style={s.footerLink}>← THE BAR</Link>}
      <Text style={s.footerLink}>SCENE {step+1} OF {scenes.length}</Text>
    </View>
    <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  container:{flexGrow:1,padding:24,paddingTop:46,paddingBottom:44},
  top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  brand:{color:gold,letterSpacing:3,fontWeight:"800",fontSize:20},
  count:{color:"#BDB4BE",fontSize:13},
  progress:{flexDirection:"row",gap:5,marginTop:23,marginBottom:28},
  segment:{height:4,backgroundColor:"#433346",flex:1,borderRadius:4},
  segmentOn:{backgroundColor:gold},
  eyebrow:{fontSize:12,letterSpacing:2,color:gold,fontWeight:"700"},
  title:{fontSize:29,lineHeight:37,color:cream,fontWeight:"800",marginTop:12},
  copy:{fontSize:16,lineHeight:23,color:"#BDB4BE",marginTop:12,marginBottom:22},
  stage:{backgroundColor:"#211A25",borderColor:"#5B412E",borderWidth:1,borderRadius:24,padding:22,alignItems:"center",minHeight:300,justifyContent:"center"},
  star:{fontSize:37,color:gold,marginBottom:10},
  stageBrand:{fontSize:25,color:gold,fontWeight:"800",letterSpacing:3,marginTop:12},
  caption:{fontSize:10,color:"#BDB4BE",letterSpacing:1.5,textAlign:"center",marginTop:8},
  stageCopy:{fontSize:14,color:cream,lineHeight:21,textAlign:"center",marginTop:16},
  shelf:{height:110,width:"100%",borderBottomWidth:6,borderColor:"#795332",flexDirection:"row",alignItems:"flex-end",justifyContent:"space-around",marginTop:28},
  bottle:{width:22,borderTopLeftRadius:8,borderTopRightRadius:8,opacity:.88},
  bubble:{backgroundColor:"#302631",borderRadius:15,padding:17,marginTop:18,width:"100%"},
  bubbleText:{fontSize:16,lineHeight:23,color:cream},
  stageLabel:{color:gold,fontSize:12,letterSpacing:2,fontWeight:"700",textAlign:"center"},
  previewTitle:{color:cream,fontSize:23,fontWeight:"700",textAlign:"center",marginTop:15,marginBottom:12},
  previewItem:{backgroundColor:"#302631",padding:14,marginTop:9,borderRadius:12,width:"100%"},
  previewItemText:{fontSize:16,color:cream},
  previewRow:{flexDirection:"row",justifyContent:"space-between",width:"100%",paddingVertical:16,borderBottomWidth:1,borderColor:"#58445B"},
  previewDim:{color:"#BDB4BE",fontSize:13,marginTop:8},
  memoryCard:{backgroundColor:"#302631",borderRadius:15,padding:20,marginTop:17,alignItems:"center",width:"100%"},
  button:{backgroundColor:gold,color:"#120F14",textAlign:"center",padding:18,fontWeight:"800",borderRadius:14,overflow:"hidden",marginTop:23},
  buttonText:{color:"#120F14",textAlign:"center",fontWeight:"800"},
  finalActions:{gap:12,marginTop:23},
  secondaryButton:{borderWidth:1,borderColor:gold,color:gold,textAlign:"center",padding:17,fontWeight:"800",borderRadius:14,overflow:"hidden"},
  footer:{flexDirection:"row",justifyContent:"space-between",marginTop:24,gap:12},
  footerLink:{color:gold,fontWeight:"700",fontSize:12},
  toast:{color:"#BDB4BE",textAlign:"center",marginTop:30}
});
