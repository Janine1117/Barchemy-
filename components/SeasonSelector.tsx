import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const atmospheres = [
  {name:"Classic",icon:"🍸",color:"#D6A84F",background:"#211A25",description:"Warm amber light and the original J.Bink's Bar."},
  {name:"Spring",icon:"🌸",color:"#B9D99B",background:"#23352B",description:"Fresh greenery, florals, and bright citrus."},
  {name:"Summer",icon:"☀️",color:"#F2C86C",background:"#40301D",description:"Golden light and tropical inspiration."},
  {name:"Autumn",icon:"🍂",color:"#D49A63",background:"#3A2922",description:"Amber glow, apples, and cozy spice."},
  {name:"Winter",icon:"❄️",color:"#A4CFEB",background:"#202D3B",description:"Frosted blue accents and warming flavors."},
  {name:"Halloween",icon:"🎃",color:"#F1A15A",background:"#34213B",description:"Playful purple shadows and pumpkin glow."},
  {name:"Christmas",icon:"🎄",color:"#B8D6B4",background:"#21392E",description:"Evergreen details and festive warm lights."},
] as const;
export type Atmosphere = typeof atmospheres[number]["name"];
const KEY="barchemy.atmosphere.v1";
function stored():Atmosphere {
  try { const value=(globalThis as any).localStorage?.getItem(KEY); return atmospheres.find(x=>x.name===value)?.name ?? "Classic"; } catch { return "Classic"; }
}
export function useAtmosphere() {
  const [selected,setSelected]=useState<Atmosphere>("Classic");
  useEffect(()=>{
    const refresh=()=>setSelected(stored());
    refresh();
    if(typeof window!=="undefined") {
      window.addEventListener("barchemy-atmosphere",refresh);
      window.addEventListener("storage",refresh);
      return ()=>{window.removeEventListener("barchemy-atmosphere",refresh);window.removeEventListener("storage",refresh);};
    }
  },[]);
  function choose(name:Atmosphere) {
    setSelected(name);
    try { (globalThis as any).localStorage?.setItem(KEY,name); if(typeof window!=="undefined") window.dispatchEvent(new Event("barchemy-atmosphere")); } catch {}
  }
  return {selected,choose,theme:atmospheres.find(x=>x.name===selected)??atmospheres[0]};
}
export default function SeasonSelector() {
  const {selected,choose,theme}=useAtmosphere();
  return <View style={s.wrap}>
    <Text style={s.heading}>YOUR BAR ATMOSPHERE</Text>
    <Text style={s.copy}>Choose a season. Your selection stays with J.Bink's Bar on this device.</Text>
    <View style={s.options}>{atmospheres.map(x=><Pressable key={x.name} accessibilityRole="button" accessibilityState={{selected:selected===x.name}} onPress={()=>choose(x.name)} style={selected===x.name ? {...s.choice,borderColor:x.color,backgroundColor:x.background} : s.choice}>
      <Text style={s.choiceText}>{x.icon} {x.name}</Text>
    </Pressable>)}</View>
    <View style={{...s.preview,backgroundColor:theme.background,borderColor:theme.color}}>
      <Text style={{...s.current,color:theme.color}}>{theme.icon} {theme.name.toUpperCase()} AT J.BINK'S</Text>
      <Text style={s.copy}>{theme.description}</Text>
      <Text style={s.note}>Seasonal colors and inspiration are active. Fully illustrated seasonal environments are still being developed.</Text>
    </View>
  </View>;
}
const s=StyleSheet.create({
 wrap:{marginTop:22},heading:{color:"#D6A84F",fontSize:12,fontWeight:"800",letterSpacing:2},copy:{color:"#F4E9D0",lineHeight:22,marginTop:9},options:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:14},
 choice:{borderColor:"#5B455F",borderWidth:1,borderRadius:12,paddingVertical:11,paddingHorizontal:13,backgroundColor:"#211A25"},
 choiceText:{color:"#F4E9D0",fontSize:13,fontWeight:"700"},preview:{borderWidth:2,borderRadius:17,padding:17,marginTop:14},
 current:{fontWeight:"800",letterSpacing:1},note:{color:"#BDB4BE",fontSize:12,lineHeight:18,marginTop:12}
});
