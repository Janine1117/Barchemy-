import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import JBinkPortrait from "../components/JBinkPortrait";

const seasons = [
  { name: "Autumn", icon: "🍂", accent: "#B67A45", title: "A warm welcome", detail: "Spiced citrus, apple, and cozy gathering inspiration.", suggestion: "Try a warming apple-and-cinnamon flavor direction." },
  { name: "Winter", icon: "❄️", accent: "#91BDD0", title: "A little winter sparkle", detail: "Crisp citrus, cranberry, and refreshing winter colors.", suggestion: "Explore cranberry and rosemary in a zero-proof spritz." },
  { name: "Summer", icon: "☀️", accent: "#E4B955", title: "Bright days, fresh flavors", detail: "Berries, pineapple, and garden-fresh herbs.", suggestion: "Explore a bright pineapple-and-mint combination." },
  { name: "Halloween", icon: "🎃", accent: "#D78A43", title: "A playful after-dark mood", detail: "Deep berry colors, spice, and a little theatrical flair.", suggestion: "Try a blackberry-and-lime mocktail idea." },
  { name: "Christmas", icon: "✨", accent: "#A8C7A5", title: "A festive gathering", detail: "Pomegranate, orange, rosemary, and celebratory sparkle.", suggestion: "Explore a pomegranate-and-orange holiday punch." }
] as const;

export default function Experience() {
  const [seasonIndex, setSeasonIndex] = useState(0);
  const season = seasons[seasonIndex];
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <View style={s.brandRow}>
        <Text style={s.brand}>BARCHEMY</Text>
        <Link href="/" style={s.back}>← WELCOME</Link>
      </View>
      <Text style={s.eyebrow}>THE BARCHEMY EXPERIENCE</Text>
      <Text style={s.title}>Where every pour becomes a story.</Text>
      <Text style={s.intro}>Welcome to a world of discovery, creativity, and memorable moments. J.Bink's Bar is just one destination.</Text>

      <View style={s.hero}>
        <JBinkPortrait />
        <Text style={s.heroName}>MEET J.BINK</Text>
        <Text style={s.heroText}>Your AI bartender is ready to help you explore, learn, and make something special.</Text>
        <Link href="/home" style={s.primary}>ENTER J.BINK'S BAR →</Link>
        <Link href="/bar-tour" style={s.secondary}>EXPLORE THE SIX BAR SCENES</Link>
      </View>

      <Text style={s.section}>EXPLORE BARCHEMY</Text>
      <View style={s.card}>
        <Text style={s.cardIcon}>🎓</Text>
        <Text style={s.cardTitle}>BARCHEMY ACADEMY</Text>
        <Text style={s.cardBody}>Learn cocktail tools, mixing techniques, and flavor balance with interactive lessons and quizzes.</Text>
        <Link href="/academy" style={s.cardLink}>START LEARNING →</Link>
      </View>
      <View style={s.card}>
        <Text style={s.cardIcon}>✦</Text>
        <Text style={s.cardTitle}>CREATE & REMEMBER</Text>
        <Text style={s.cardBody}>Find a drink, mix it step by step, keep track of ingredients, and save your favorite moments.</Text>
        <View style={s.links}>
          <Link href="/ask" style={s.miniLink}>ASK J.BINK</Link>
          <Link href="/first-pour" style={s.miniLink}>FIRST POUR</Link>
          <Link href="/my-bar" style={s.miniLink}>MY BAR</Link>
          <Link href="/memory" style={s.miniLink}>MEMORIES</Link>
        </View>
      </View>

      <Text style={s.section}>SEASONAL INSPIRATION</Text>
      <Text style={s.description}>Choose a mood to preview the colors and flavors planned for Barchemy's changing seasonal environments.</Text>
      <View style={s.seasonRow}>
        {seasons.map((item, index) => (
          <Pressable key={item.name} accessibilityRole="button" accessibilityState={{ selected: seasonIndex === index }} onPress={() => setSeasonIndex(index)} style={[s.seasonChoice,seasonIndex===index && {borderColor:item.accent,backgroundColor:"#332A31"}]}>
            <Text style={s.seasonIcon}>{item.icon}</Text>
            <Text style={s.seasonText}>{item.name}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[s.seasonPreview,{borderColor:season.accent}]}>
        <Text style={s.seasonEyebrow}>SEASONAL MOOD PREVIEW · {season.name.toUpperCase()}</Text>
        <Text style={s.seasonHeadline}>{season.title}</Text>
        <Text style={s.seasonBody}>{season.detail}</Text>
        <Text style={s.seasonHint}>{season.suggestion}</Text>
        <Text style={s.previewNote}>Visual environments and themed recipe collections are still in development.</Text>
      </View>

      <Text style={s.section}>MORE OF THE BARCHEMY WORLD</Text>
      <View style={s.planned}>
        <Text style={s.plannedTitle}>PARTY PLANNER  ·  COMING SOON</Text>
        <Text style={s.plannedBody}>Menus, shopping, preparation, and memorable gatherings.</Text>
      </View>
      <View style={s.planned}>
        <Text style={s.plannedTitle}>BARCHEMY SOCIETY  ·  COMING SOON</Text>
        <Text style={s.plannedBody}>Discover creations and connect with a creative community.</Text>
      </View>
      <View style={s.planned}>
        <Text style={s.plannedTitle}>BARCHEMY MAGIC  ·  COMING SOON</Text>
        <Text style={s.plannedBody}>Explore flavor challenges, seasonal events, and discovery.</Text>
      </View>
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  content:{flexGrow:1,padding:22,paddingTop:47,paddingBottom:52},
  brandRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  brand:{color:"#D6A84F",fontWeight:"800",letterSpacing:3,fontSize:21},
  back:{color:"#D6A84F",fontWeight:"700",fontSize:12},
  eyebrow:{color:"#D6A84F",letterSpacing:2,fontSize:12,fontWeight:"700",marginTop:32},
  title:{color:"#F4E9D0",fontWeight:"800",fontSize:31,lineHeight:39,marginTop:12},
  intro:{color:"#BDB4BE",fontSize:16,lineHeight:24,marginTop:14,marginBottom:23},
  hero:{backgroundColor:"#211A25",borderColor:"#785D3A",borderWidth:1,borderRadius:22,padding:20,alignItems:"center"},
  heroName:{color:"#D6A84F",fontWeight:"800",letterSpacing:2,fontSize:19,marginTop:17},
  heroText:{color:"#F4E9D0",fontSize:15,lineHeight:23,textAlign:"center",marginTop:9},
  primary:{backgroundColor:"#D6A84F",color:"#120F14",fontWeight:"800",textAlign:"center",padding:17,borderRadius:13,overflow:"hidden",width:"100%",marginTop:20},
  secondary:{color:"#D6A84F",fontWeight:"700",marginTop:18,textAlign:"center"},
  section:{color:"#D6A84F",fontSize:12,letterSpacing:2,fontWeight:"800",marginTop:33,marginBottom:12},
  card:{backgroundColor:"#211A25",borderRadius:18,padding:20,marginTop:11,borderColor:"#4B3B50",borderWidth:1},
  cardIcon:{fontSize:24},
  cardTitle:{color:"#F4E9D0",fontWeight:"800",letterSpacing:1,fontSize:16,marginTop:12},
  cardBody:{color:"#BDB4BE",lineHeight:22,marginTop:8},
  cardLink:{color:"#D6A84F",fontWeight:"800",marginTop:17},
  links:{flexDirection:"row",flexWrap:"wrap",gap:9,marginTop:17},
  miniLink:{color:"#D6A84F",borderWidth:1,borderColor:"#765B3B",borderRadius:11,overflow:"hidden",paddingHorizontal:13,paddingVertical:12,fontSize:12,fontWeight:"700"},
  description:{color:"#BDB4BE",lineHeight:22,marginBottom:14},
  seasonRow:{flexDirection:"row",flexWrap:"wrap",gap:9},
  seasonChoice:{backgroundColor:"#211A25",borderColor:"#4B3B50",borderWidth:1,borderRadius:13,paddingVertical:12,paddingHorizontal:13,alignItems:"center",minWidth:92},
  seasonIcon:{fontSize:22},
  seasonText:{color:"#F4E9D0",fontWeight:"700",fontSize:12,marginTop:7},
  seasonPreview:{backgroundColor:"#211A25",borderRadius:18,borderWidth:2,padding:21,marginTop:16},
  seasonEyebrow:{color:"#D6A84F",letterSpacing:1.4,fontSize:11,fontWeight:"800"},
  seasonHeadline:{color:"#F4E9D0",fontWeight:"800",fontSize:24,marginTop:13},
  seasonBody:{color:"#F4E9D0",lineHeight:23,marginTop:12},
  seasonHint:{color:"#D6A84F",lineHeight:22,marginTop:13},
  previewNote:{color:"#BDB4BE",fontSize:12,lineHeight:18,marginTop:16,fontStyle:"italic"},
  planned:{borderBottomWidth:1,borderBottomColor:"#453747",paddingVertical:17},
  plannedTitle:{color:"#F4E9D0",fontWeight:"800",fontSize:13,letterSpacing:.6},
  plannedBody:{color:"#BDB4BE",lineHeight:21,marginTop:7},
  toast:{color:"#D6A84F",textAlign:"center",marginTop:31}
});
