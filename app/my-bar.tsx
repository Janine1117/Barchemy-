import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";


const categories = ["Spirits", "Liqueurs & Syrups", "Mixers", "Fresh Ingredients", "Garnishes", "Equipment"] as const;
type Category = typeof categories[number];
type Ingredient = { name: string; category: Category };
const STORAGE_KEY = "barchemy.mybar.v1";

function getStorage() {
  try { return (globalThis as any).localStorage ?? null; } catch { return null; }
}
export function ErrorBoundary({error,retry}:{error:Error;retry:()=>void}) {
  return <View style={{flex:1,backgroundColor:"#120F14",padding:24,justifyContent:"center"}}>
    <Text style={{color:"#D6A84F",fontSize:22,fontWeight:"800"}}>My Bar could not load</Text>
    <Text style={{color:"#F4E9D0",marginTop:16}}>{error?.message||"An unexpected error occurred."}</Text>
    <Pressable accessibilityRole="button" onPress={retry} style={{backgroundColor:"#D6A84F",padding:16,borderRadius:12,marginTop:22}}><Text style={{color:"#120F14",textAlign:"center"}}>TRY AGAIN</Text></Pressable>
    <Link href="/experience" style={{color:"#D6A84F",marginTop:22}}>RETURN TO BARCHEMY EXPERIENCE</Link>
  </View>;
}

export default function MyBar() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [category,setCategory]=useState<Category>("Spirits");
  const [name,setName]=useState("");
  const [message,setMessage]=useState("");
  useEffect(()=>{
    try {
      const saved=getStorage()?.getItem(STORAGE_KEY);
      if(saved) {
        const parsed=JSON.parse(saved);
        if(Array.isArray(parsed)) setItems(parsed.filter((x)=>x&&typeof x.name==="string"&&categories.includes(x.category)));
      }
    } catch { setMessage("Saved ingredients could not be loaded."); }
  },[]);
  function store(next:Ingredient[]) {
    setItems(next);
    try { getStorage()?.setItem(STORAGE_KEY,JSON.stringify(next)); } catch { setMessage("Local saving is unavailable on this device."); }
  }
  function add() {
    const clean=name.trim();
    if(!clean) { setMessage("Enter an ingredient to add it."); return; }
    if(items.some(x=>x.name.toLowerCase()===clean.toLowerCase()&&x.category===category)){
      setMessage("That ingredient is already in this category."); return;
    }
    store([...items,{name:clean,category}]);
    setName("");
    setMessage("Added to your bar on this device.");
  }
  function remove(item:Ingredient) {
    store(items.filter(x=>!(x.name===item.name&&x.category===item.category)));
    setMessage("Ingredient removed.");
  }
  const categoryItems=items.filter(x=>x.category===category);
  return <ScrollView style={s.page} contentContainerStyle={s.container}>
    <Text style={s.eyebrow}>MY BAR</Text>
    <Text style={s.title}>Your bar. Your ingredients.</Text>
    <Text style={s.copy}>Build your personal collection. Ingredients entered here are stored on this device.</Text>
    <View style={s.categories}>
      {categories.map(x=>
        <Pressable key={x} accessibilityRole="button" onPress={()=>{setCategory(x);setMessage("");}} style={category===x ? {...s.category,...s.categorySelected} : s.category}>
          <Text style={category===x ? {...s.categoryName,...s.categoryNameSelected} : s.categoryName}>{x}</Text>
          <Text style={s.count}>{items.filter(y=>y.category===x).length}</Text>
        </Pressable>
      )}
    </View>
    <View style={s.card}>
      <Text style={s.cardTitle}>{category.toUpperCase()}</Text>
      {categoryItems.length===0 ? <Text style={s.empty}>Nothing added yet. Start with your first ingredient.</Text> :
        categoryItems.map(x=><View key={x.name} style={s.itemRow}>
          <Text style={s.itemName}>{x.name}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={"Remove "+x.name} onPress={()=>remove(x)}>
            <Text style={s.remove}>REMOVE</Text>
          </Pressable>
        </View>)
      }
      <TextInput placeholder="Add an ingredient" placeholderTextColor="#998B9C" value={name} onChangeText={setName} style={s.input} onSubmitEditing={add} returnKeyType="done"/>
      <Pressable accessibilityRole="button" style={s.addButton} onPress={add}><Text style={s.addText}>ADD TO MY BAR  +</Text></Pressable>
      {!!message&&<Text style={s.message}>{message}</Text>}
    </View>
    <Text style={s.note}>Your ingredient collection is not yet synced with recipe recommendations or other devices.</Text>
    <Link href="/experience" style={s.back}>← BARCHEMY EXPERIENCE</Link>
    <Link href="/ask" style={s.back}>ASK J.BINK →</Link>
    <Text style={s.toast}>Sip. Smile. Repeat. ✨</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#120F14"},
  container:{flexGrow:1,padding:23,paddingTop:59,paddingBottom:40},
  eyebrow:{color:"#D6A84F",letterSpacing:2,fontSize:12},
  title:{color:"#F4E9D0",fontSize:29,fontWeight:"800",marginTop:12},
  copy:{color:"#BDB4BE",fontSize:15,lineHeight:23,marginTop:10,marginBottom:20},
  categories:{flexDirection:"row",flexWrap:"wrap",gap:8},
  category:{backgroundColor:"#211A25",borderColor:"#51425C",borderWidth:1,padding:13,borderRadius:13,minWidth:"47%",flexGrow:1},
  categorySelected:{borderColor:"#D6A84F",backgroundColor:"#3B2F20"},
  categoryName:{color:"#F4E9D0",fontWeight:"700",fontSize:13},
  categoryNameSelected:{color:"#D6A84F"},
  count:{color:"#BDB4BE",fontSize:12,marginTop:7},
  card:{backgroundColor:"#211A25",borderRadius:19,padding:19,marginTop:20,borderWidth:1,borderColor:"#5B412E"},
  cardTitle:{color:"#D6A84F",fontWeight:"700",letterSpacing:1.5},
  empty:{color:"#BDB4BE",marginTop:15,lineHeight:23},
  itemRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",borderBottomColor:"#51415A",borderBottomWidth:1,paddingVertical:13},
  itemName:{color:"#F4E9D0",fontSize:16},
  remove:{color:"#D6A84F",fontSize:11},
  input:{backgroundColor:"#120F14",color:"#F4E9D0",borderWidth:1,borderColor:"#59455C",padding:15,borderRadius:12,marginTop:18,fontSize:16},
  addButton:{backgroundColor:"#D6A84F",padding:16,borderRadius:12,marginTop:12},
  addText:{color:"#120F14",fontWeight:"800",textAlign:"center"},
  message:{color:"#D6A84F",marginTop:12},
  note:{color:"#BDB4BE",marginTop:20,lineHeight:20,fontSize:12},
  toast:{color:"#D6A84F",textAlign:"center",marginTop:22},
  back:{color:"#D6A84F",fontWeight:"700",textAlign:"center",marginTop:20}
});
