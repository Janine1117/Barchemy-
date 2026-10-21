import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const tabs = [
  { icon: "⌂", label: "Home", href: "/home" },
  { icon: "✦", label: "Chat", href: "/ask" },
  { icon: "◈", label: "My Bar", href: "/my-bar" },
  { icon: "♧", label: "Create", href: "/first-pour" },
  { icon: "♡", label: "Memories", href: "/memory" },
] as const;

export default function BottomNav() {
  const path = usePathname();
  return (
    <View style={s.nav}>
      {tabs.map((tab) => {
        const current = path === tab.href;
        return (
          <Link key={tab.href} href={tab.href} asChild>
            <Pressable accessibilityRole="button" accessibilityLabel={tab.label} style={[s.tab, current && s.active]}>
              <Text style={[s.icon, current && s.activeText]}>{tab.icon}</Text>
              <Text style={[s.label, current && s.activeText]}>{tab.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}
const s=StyleSheet.create({
  nav:{flexDirection:"row",backgroundColor:"#19141C",borderTopColor:"#5B412E",borderTopWidth:1,marginTop:28,borderRadius:15,paddingVertical:12,justifyContent:"space-around"},
  tab:{flex:1,alignItems:"center",justifyContent:"center",paddingVertical:4},
  active:{backgroundColor:"#302533",borderRadius:12},
  icon:{color:"#BDB4BE",fontSize:21,textAlign:"center"},
  label:{color:"#BDB4BE",fontSize:10,textAlign:"center",marginTop:4},
  activeText:{color:"#D6A84F",fontWeight:"700"}
});
