import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";



const recipes = {
  balanced: {
    name: "The Barchemy House Sour",
    profile: "Bright · Balanced · Beginner-friendly",
    ingredients: ["2 oz whiskey", "3/4 oz fresh lemon juice", "3/4 oz simple syrup", "Ice", "Lemon twist"],
    steps: ["Gather a shaker, strainer, and serving glass.", "Measure your whiskey, lemon juice, and simple syrup.", "Add ice and shake until chilled.", "Strain into your serving glass.", "Taste and adjust sweetness or citrus to preference.", "Garnish with a lemon twist. Enjoy responsibly."],
  },
  fruity: {
    name: "Honey Lime Margarita",
    profile: "Citrusy · Fresh · Fruity",
    ingredients: ["2 oz tequila", "1 oz lime juice", "3/4 oz honey syrup", "Ice", "Lime wheel"],
    steps: ["Gather your shaker, strainer, and glass.", "Measure tequila, lime juice, and honey syrup.", "Shake vigorously with ice until chilled.", "Strain into a glass with fresh ice.", "Taste and adjust with a little more lime or syrup.", "Garnish with a lime wheel. Enjoy responsibly."],
  },
  bold: {
    name: "Classic Old Fashioned",
    profile: "Rich · Smooth · Bold",
    ingredients: ["2 oz bourbon or rye", "1 tsp simple syrup", "2 dashes aromatic bitters", "Ice", "Orange peel"],
    steps: ["Set out a rocks glass, mixing glass, and spoon.", "Measure whiskey, syrup, and bitters.", "Stir with ice until well chilled.", "Strain over fresh ice in a rocks glass.", "Taste and fine-tune sweetness if needed.", "Express an orange peel over the glass and garnish."],
  },
  surprise: {
    name: "Pineapple Sunset",
    profile: "Tropical · Refreshing · Golden",
    ingredients: ["1 1/2 oz rum", "2 oz pineapple juice", "1/2 oz lime juice", "1/2 oz simple syrup", "Ice"],
    steps: ["Prepare your shaker and a tall glass.", "Measure rum, pineapple, lime, and syrup.", "Shake everything with ice until chilled.", "Strain over fresh ice.", "Taste; adjust lime or syrup to suit you.", "Garnish with pineapple or lime and enjoy responsibly."],
  },
} as const;
type Mood = keyof typeof recipes;
const stepNames = ["Prepare", "Measure", "Mix", "Pour", "Taste", "Finish"];

export function ErrorBoundary({error,retry}:{error:Error;retry:()=>void}) {
  return <View style={{flex:1,backgroundColor:"#120F14",padding:24,justifyContent:"center"}}>
    <Text style={{color:"#D6A84F",fontSize:22,fontWeight:"800"}}>Guided recipe could not load</Text>
    <Text style={{color:"#F4E9D0",marginTop:16}}>{error?.message||"An unexpected error occurred."}</Text>
    <Pressable accessibilityRole="button" onPress={retry} style={{padding:16,backgroundColor:"#D6A84F",borderRadius:12,marginTop:22}}><Text style={{color:"#120F14",textAlign:"center"}}>TRY AGAIN</Text></Pressable>
    <Link href="/ask" style={{color:"#D6A84F",marginTop:22}}>RETURN TO J.BINK</Link>
  </View>;
}

export default function FirstPour() {
  const moodParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("mood") : null;
  const key: Mood = moodParam === "fruity" || moodParam === "bold" || moodParam === "surprise" ? moodParam : "balanced";
  const recipe = recipes[key];
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setStatus("");
    try {
      const { saveMemory } = await import("../Lib/memories");
      const result = await saveMemory(recipe.name, recipe.ingredients.join(" · ") + " — " + recipe.steps.join(" "));
      setSaved(result.ok);
      setStatus(result.message);
    } catch (error) {
      setSaved(false);
      setStatus(error instanceof Error ? error.message : "Unable to save this memory.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={s.page} contentContainerStyle={s.container}>
      <Text style={s.eyebrow}>THE FIRST POUR</Text>
      <Text style={s.title}>Your cocktail is ready.</Text>
      <Text style={s.name}>{recipe.name}</Text>
      <Text style={s.profile}>{recipe.profile}</Text>
      <View style={s.card}>
        <Text style={s.heading}>WHAT YOU'LL NEED</Text>
        {recipe.ingredients.map(x => <Text key={x} style={s.ingredient}>• {x}</Text>)}
      </View>
      <View style={s.card}>
        <Text style={s.heading}>GUIDED MIXING · STEP {step+1} OF {stepNames.length}</Text>
        <View style={s.stepRow}>
          {stepNames.map((name, i) => (
            <Pressable key={name} accessibilityRole="button" onPress={()=>setStep(i)} style={i===step ? { ...s.stepPill, ...s.stepActive } : s.stepPill}>
              <Text style={i===step ? { ...s.stepName, ...s.stepTextActive } : s.stepName}>{i+1}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={s.stepTitle}>{stepNames[step]}</Text>
        <Text style={s.instruction}>{recipe.steps[step]}</Text>
        <Pressable accessibilityRole="button" onPress={()=>setStep((step+1)%stepNames.length)} style={s.next}>
          <Text style={s.nextText}>{step===stepNames.length-1?"RESTART STEPS":"NEXT STEP  →"}</Text>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={()=>void handleSave()} disabled={saving} style={s.save}>
        <Text style={s.saveText}>{saving?"SAVING…":"SAVE TO MEMORY WALL"}</Text>
      </Pressable>
      {!!status && <Text style={s.status}>{status}</Text>}
      {saved && <Link href="/memory" style={s.viewMemories}>VIEW SAVED MEMORIES  →</Link>}
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
      <Link href="/ask" style={s.viewMemories}>BACK TO J.BINK →</Link>
    </ScrollView>
  );
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  container:{flexGrow:1,padding:24,paddingTop:58,paddingBottom:40},
  eyebrow:{color:"#D6A84F",letterSpacing:2,fontSize:12},
  title:{color:"#F4E9D0",fontSize:28,fontWeight:"800",marginTop:10},
  name:{color:"#F4E9D0",fontSize:23,fontWeight:"700",marginTop:22},
  profile:{color:"#BDB4BE",marginTop:8},
  card:{backgroundColor:"#211A25",padding:20,borderRadius:19,marginTop:22,borderColor:"#513B2E",borderWidth:1},
  heading:{color:"#D6A84F",letterSpacing:1.5,fontSize:12,fontWeight:"700"},
  ingredient:{color:"#F4E9D0",fontSize:15,lineHeight:26,marginTop:7},
  stepRow:{flexDirection:"row",gap:7,marginTop:19,justifyContent:"space-between"},
  stepPill:{borderColor:"#59465C",borderWidth:1,borderRadius:25,width:37,height:37,alignItems:"center",justifyContent:"center"},
  stepActive:{backgroundColor:"#D6A84F",borderColor:"#D6A84F"},
  stepName:{color:"#BDB4BE",fontWeight:"800"},
  stepTextActive:{color:"#120F14"},
  stepTitle:{color:"#F4E9D0",fontWeight:"800",fontSize:23,marginTop:19},
  instruction:{color:"#F4E9D0",fontSize:16,lineHeight:24,marginTop:12,minHeight:56},
  next:{borderRadius:12,borderWidth:1,borderColor:"#D6A84F",padding:13,marginTop:19},
  nextText:{color:"#D6A84F",fontWeight:"800",textAlign:"center"},
  save:{backgroundColor:"#D6A84F",padding:18,borderRadius:14,marginTop:23},
  saveText:{color:"#120F14",fontWeight:"800",textAlign:"center"},
  status:{color:"#F4E9D0",textAlign:"center",marginTop:16},
  viewMemories:{color:"#D6A84F",fontWeight:"800",textAlign:"center",marginTop:18},
  toast:{color:"#D6A84F",textAlign:"center",marginTop:25}
});
