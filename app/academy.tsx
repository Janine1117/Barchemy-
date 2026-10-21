import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const lessons = [
  {
    title: "Tools of the Trade",
    subtitle: "Your first mixing kit",
    body: "A shaker chills and combines ingredients. A jigger helps measure accurately. A strainer keeps ice and solids out of a finished cocktail. Start with these basics.",
    question: "What is a jigger used for?",
    answers: ["Measuring ingredients", "Crushing ice", "Garnishing a glass"],
    correct: 0,
    takeaway: "Measure consistently so you can repeat and adjust a recipe with confidence."
  },
  {
    title: "Shake or Stir?",
    subtitle: "Choose the right technique",
    body: "Shaking rapidly chills and dilutes drinks containing citrus, juice, cream, or egg white. Stirring gently chills spirit-forward drinks while preserving a smoother, clearer texture.",
    question: "Which technique generally suits a citrus sour?",
    answers: ["Stir gently", "Shake with ice", "Serve without mixing"],
    correct: 1,
    takeaway: "Technique changes temperature, dilution, and texture—not just presentation."
  },
  {
    title: "Balance the Flavor",
    subtitle: "Sweet, sour, and strong",
    body: "Taste for balance instead of following numbers blindly. Citrus brings acidity, syrups add sweetness, and a base spirit adds structure. Mocktails can balance these elements too.",
    question: "If a drink tastes too tart, what might help?",
    answers: ["More citrus", "A small amount of syrup", "More ice only"],
    correct: 1,
    takeaway: "Make small adjustments, taste again, and write down what you like."
  }
] as const;

export default function Academy() {
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = lessons[active];
  const isCorrect = answer === lesson.correct;

  function selectLesson(index: number) {
    setActive(index);
    setAnswer(null);
  }

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Link href="/experience" style={s.back}>← BARCHEMY EXPERIENCE</Link>
      <Text style={s.eyebrow}>BARCHEMY ACADEMY</Text>
      <Text style={s.title}>Learn the art of the pour.</Text>
      <Text style={s.intro}>Build confidence through quick, practical mixology lessons. No drink required to learn.</Text>
      <View style={s.lessonTabs}>
        {lessons.map((item, index) => (
          <Pressable key={item.title} accessibilityRole="button" onPress={() => selectLesson(index)} style={[s.tab,active===index&&s.activeTab]}>
            <Text style={[s.tabText,active===index&&s.activeTabText]}>LESSON {index+1}</Text>
            <Text style={s.tabLabel}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.eyebrow}>LESSON {active+1} OF {lessons.length}</Text>
        <Text style={s.heading}>{lesson.title}</Text>
        <Text style={s.subtitle}>{lesson.subtitle}</Text>
        <Text style={s.body}>{lesson.body}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.eyebrow}>CHECK YOUR KNOWLEDGE</Text>
        <Text style={s.question}>{lesson.question}</Text>
        {lesson.answers.map((choice,index) => (
          <Pressable key={choice} accessibilityRole="button" onPress={()=>setAnswer(index)} style={[s.answer, answer===index&&s.selectedAnswer]}>
            <Text style={s.answerText}>{choice}</Text>
          </Pressable>
        ))}
        {answer!==null && (
          <Text accessibilityRole="text" style={s.feedback}>{isCorrect ? "✓ Correct! " : "Not quite. Try another answer. "}{isCorrect ? lesson.takeaway : ""}</Text>
        )}
      </View>
      <Pressable accessibilityRole="button" onPress={()=>selectLesson((active+1)%lessons.length)} style={s.next}>
        <Text style={s.nextText}>{active===lessons.length-1 ? "RESTART ACADEMY LESSONS" : "NEXT LESSON →"}</Text>
      </Pressable>
      <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
    </ScrollView>
  );
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  content:{flexGrow:1,padding:23,paddingTop:53,paddingBottom:45},
  back:{color:"#D6A84F",fontWeight:"700",fontSize:12,marginBottom:30},
  eyebrow:{color:"#D6A84F",letterSpacing:2,fontSize:12,fontWeight:"700"},
  title:{color:"#F4E9D0",fontSize:30,fontWeight:"800",marginTop:12},
  intro:{color:"#BDB4BE",fontSize:16,lineHeight:24,marginTop:12},
  lessonTabs:{gap:10,marginTop:24},
  tab:{backgroundColor:"#211A25",borderRadius:15,borderWidth:1,borderColor:"#51405A",padding:15},
  activeTab:{borderColor:"#D6A84F",backgroundColor:"#30251B"},
  tabText:{color:"#BDB4BE",fontSize:11,fontWeight:"700",letterSpacing:1},
  activeTabText:{color:"#D6A84F"},
  tabLabel:{color:"#F4E9D0",fontSize:16,fontWeight:"700",marginTop:5},
  card:{backgroundColor:"#211A25",borderRadius:18,padding:20,marginTop:20,borderWidth:1,borderColor:"#51405A"},
  heading:{color:"#F4E9D0",fontSize:24,fontWeight:"800",marginTop:12},
  subtitle:{color:"#D6A84F",marginTop:7},
  body:{color:"#F4E9D0",fontSize:16,lineHeight:26,marginTop:16},
  question:{color:"#F4E9D0",fontSize:18,fontWeight:"700",lineHeight:26,marginTop:12,marginBottom:8},
  answer:{borderWidth:1,borderColor:"#55405E",borderRadius:12,padding:15,marginTop:9},
  selectedAnswer:{borderColor:"#D6A84F",backgroundColor:"#3A2F25"},
  answerText:{color:"#F4E9D0"},
  feedback:{color:"#D6A84F",lineHeight:22,marginTop:15},
  next:{backgroundColor:"#D6A84F",borderRadius:14,padding:17,marginTop:22},
  nextText:{color:"#120F14",fontWeight:"800",textAlign:"center"},
  toast:{color:"#D6A84F",textAlign:"center",marginTop:29}
});
