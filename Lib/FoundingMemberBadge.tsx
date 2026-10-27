import { useEffect, useState } from "react";
import { Text } from "react-native";
import { supabase } from "./supabase";

/** Cosmetic display only; Stripe-verified server processes must write entitlements. */
export function FoundingMemberBadge() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("barchemy_entitlements")
        .select("active")
        .eq("user_id", user.id)
        .eq("entitlement", "founder")
        .maybeSingle();
      if (mounted) setActive(!error && data?.active === true);
    }
    void check();
    const subscription = supabase?.auth.onAuthStateChange(() => { setActive(false); void check(); });
    return () => { mounted = false; subscription?.data.subscription.unsubscribe(); };
  }, []);
  if (!active) return null;
  return <Text accessibilityLabel="Founding Member" style={{ color: "#D6A84F", fontWeight: "800", marginTop: 8 }}>✦ FOUNDING MEMBER ✦</Text>;
}
