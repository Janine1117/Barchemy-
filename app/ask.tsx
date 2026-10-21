import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import JBinkPortrait from "../components/JBinkPortrait";
import BottomNav from "../components/BottomNav";

const choices = [
  { label: "🍍 Something fruity", mood: "fruity", description: "Bright and refreshing" },
  { label: "🥃 Something bold", mood: "bold", description: "Classic and full-flavored" },
  { label: "🍋 Something balanced", mood: "balanced", description: "Easy to mix" },
  { label: "✦ Surprise me", mood: "surprise", description: "A fresh recommendation" },
] as const;

export default function Ask() {
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
  note:{color:"#BDB4BE",fontSize:12,lineHeight:18,marginTop:18}
});
