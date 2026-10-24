import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const PROGRESS_KEY = "barchemy.academy.completed.v1";
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

export function ErrorBoundary({error,retry}:{error:Error;retry:()=>void}) {
  return <View style={{flex:1,backgroundColor:"#120F14",padding:24,justifyContent:"center"}}>
    <Text style={{color:"#D6A84F",fontSize:22,fontWeight:"800"}}>Academy could not load</Text>
    <Text style={{color:"#F4E9D0",marginTop:16}}>{error?.message||"An unexpected error occurred."}</Text>
    <Pressable accessibilityRole="button" onPress={retry} style={{backgroundColor:"#D6A84F",padding:16,borderRadius:12,marginTop:22}}><Text style={{color:"#120F14",textAlign:"center"}}>TRY AGAIN</Text></Pressable>
    <Link href="/experience" style={{color:"#D6A84F",marginTop:22}}>RETURN TO BARCHEMY EXPERIENCE</Link>
  </View>;
}

export default function Academy() {
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    try {
      const raw=(globalThis as any).localStorage?.getItem(PROGRESS_KEY);
      const parsed=raw?JSON.parse(raw):[];
      if(Array.isArray(parsed)) setCompleted(parsed.filter((n):n is number=>Number.isInteger(n)&&n>=0&&n<lessons.length));
    } catch {}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try {(globalThis as any).localStorage?.setItem(PROGRESS_KEY,JSON.stringify(completed));}catch {}
  },[completed,ready]);
  const lesson = lessons[active];
  const isCorrect = answer === lesson.correct;
  const finished = completed.length === lessons.length;

  function chooseAnswer(index: number) {
    setAnswer(index);
    if (index === lesson.correct) setCompleted(previous => previous.includes(active) ? previous : [...previous, active]);
  }

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
      <Text style={s.progress} accessibilityRole="text">{finished ? "All three lessons completed!" : `${completed.length} of ${lessons.length} lessons completed`}</Text>
      <Text style={s.intro}>Correct answers save your lesson progress on this device, including after refreshing the page.</Text>
      <View style={s.lessonTabs}>
        {lessons.map((item, index) => (
          <Pressable key={item.title} accessibilityRole="button" onPress={() => selectLesson(index)} style={active===index ? {...s.tab,...s.activeTab} : s.tab}>
            <Text style={active===index ? {...s.tabText,...s.activeTabText} : s.tabText}>{completed.includes(index) ? "✓ COMPLETED" : `LESSON ${index+1}`}</Text>
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
          <Pressable key={choice} accessibilityRole="button" onPress={()=>chooseAnswer(index)} style={answer===index ? {...s.answer,...s.selectedAnswer} : s.answer}>
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
  progress:{color:"#D6A84F",fontWeight:"700",marginTop:18},
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
