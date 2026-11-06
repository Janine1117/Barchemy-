export type Mood = "fruity" | "bold" | "balanced" | "surprise";
const recipeOptions: {mood:Mood;name:string;needs:string[][]}[] = [
 {mood:"fruity",name:"Honey Lime Margarita",needs:[["tequila"],["lime"],["honey syrup","honey"]]},
 {mood:"bold",name:"Classic Old Fashioned",needs:[["bourbon","rye","whiskey","whisky"],["bitters"],["simple syrup"]]},
 {mood:"balanced",name:"Barchemy House Sour",needs:[["whiskey","whisky","bourbon","rye"],["lemon"],["simple syrup"]]},
 {mood:"surprise",name:"Pineapple Sunset",needs:[["rum"],["pineapple"],["lime"],["simple syrup"]]}
];
function myBarSuggestion(preferred?:Mood): {mood?:Mood;response:string} {
 try {
 const raw=(globalThis as any).localStorage?.getItem("barchemy.mybar.v1");
 const items=raw?JSON.parse(raw):[];
 const names:string[]=Array.isArray(items)?items.filter((x:any)=>x&&typeof x.name==="string"&&x.category!=="Equipment").map((x:any)=>x.name.trim().toLowerCase()):[];
 if(!names.length)return {response:"Your My Bar is empty on this device. Add a few ingredients, then ask me again."};
 const ranked=recipeOptions.map(recipe=>{
  const matched=recipe.needs.map(group=>group.some(term=>names.some(name=>matchesIngredient(name,term))));
  return {...recipe,count:matched.filter(Boolean).length,missing:recipe.needs.filter((_,i)=>!matched[i]).map(group=>group[0])};
 }).sort((a,b)=>Number(b.count===b.needs.length)-Number(a.count===a.needs.length) || b.count/b.needs.length-a.count/a.needs.length || Number(b.mood===preferred)-Number(a.mood===preferred));
 const best=ranked[0];
 const preferenceNote=preferred && best.mood!==preferred ? " This is a different flavor direction from your preference because it matches more of your saved ingredients." : "";
 if(!best.count)return {response:"I can see "+names.length+" items in My Bar, but none match the core ingredients of my current guided recipes. Tell me a flavor you enjoy, or add a spirit and mixer."};
 const missing=best.missing.length?" You may still need: "+best.missing.join(", ")+".":" You've got the main flavor ingredients; check the recipe for ice, garnish, and exact measurements.";
 return {mood:best.mood,response:"From your saved My Bar ingredients, "+best.name+" is the closest match ("+best.count+" of "+best.needs.length+" core ingredient groups)."+preferenceNote+missing};
 }catch{return {response:"I couldn't read My Bar on this device. Open My Bar to check your saved ingredients."};}
}


function words(text:string) { return text.toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
export function matchesIngredient(name:string,term:string) {
 const normalized=words(name);
 if (/\b(?:non alcoholic|alcohol free|zero proof|flavou?red|flavou?r)\b/.test(normalized)) return false;
 const tokens=" "+normalized+" ";
 if(term==="honey" && /\b(?:whiskey|whisky|bourbon|liqueur)\b/.test(normalized))return false;
 if((term==="lime"||term==="lemon"||term==="pineapple") && /\b(?:syrup|soda|bitters|liqueur|rum|vodka|gin)\b/.test(normalized))return false;
 return tokens.includes(" "+words(term)+" ");
}
type Reply={mood?:Mood;response:string};
export function guidedResponse(text:string,previousMood?:Mood):Reply {
 const q=words(text);
 const zero=/\b(mocktail|mocktails|non alcoholic|nonalcoholic|no alcohol|zero proof|without alcohol|sober|alcohol free)\b/.test(q);
 const lessSweet=/\b(less sweet|not sweet|not too sweet|no sugar|sugar free|dry|tart)\b/.test(q);
 const restrictionText=q.replace(/\b(less sweet|not sweet|not too sweet|no sugar|sugar free)\b/g,"");
 const excluded=/\b(no|without|avoid|hate|allerg(?:y|ic)|don t like|do not like)\b/.test(restrictionText) && !zero;
 const bar=/\b(my bar|what i have|have at home|make with|use what i have|on hand|in my kitchen)\b/.test(q);
 const technique=/\b(shake|shaken|stir|stirred|jigger|measure|technique|learn|academy)\b/.test(q);
 const preference:Mood|undefined=/\b(pineapple|rum|tropical|surprise)\b/.test(q)?"surprise":/\b(tequila|margarita)\b/.test(q)?"fruity":/\b(bourbon|whiskey|whisky|old fashioned|rye|bold|strong)\b/.test(q)?"bold":/\b(balanced|sour|lemon)\b/.test(q)?"balanced":/\b(fruit|fruity|sweet|refreshing|refresh|summer)\b/.test(q)?"fruity":undefined;
 if(zero) return {response:lessSweet ? "For a tart zero-proof spritz, combine citrus and sparkling water over ice; leave out added syrup. My guided recipes contain alcohol, so these links are not mocktails." : "For a zero-proof spritz, combine citrus, sparkling water, and optional syrup over ice. Tell me which fruit you have for a more specific direction. My guided recipes contain alcohol, so these links are not mocktails."};
 if(excluded && !/^(less sweet|not sweet|not too sweet|no sugar|sugar free|dry|tart)$/.test(q))return {response:"I hear an ingredient exclusion or restriction. Which ingredients should I leave out? My four fixed guided recipes cannot yet be adapted automatically, so I need to check before recommending one."};
 if(technique) {
 if(/\bjigger|\bmeasure/.test(q))return {response:"A jigger measures portions. Check the markings on your own tool, then use the amounts listed in the recipe. Academy covers measuring practice."};
 if(/\bstir|\bstirred/.test(q))return {response:"Stir spirit-forward drinks such as an Old Fashioned with ice until chilled, then strain. Academy has a mixing-technique lesson."};
 if(/\bshake|\bshaken/.test(q))return {response:"Shake citrus drinks with ice in a securely closed shaker, then strain. The House Sour and Honey Lime Margarita use this technique."};
 return {response:"Open Barchemy Academy below for interactive lessons on tools, mixing techniques, and flavor balance. Which topic would you like help with?"};
 }
 if(/\b(no sugar|sugar free)\b/.test(q))return {response:"My four guided recipes include syrup, and fruit can contain sugar too. I cannot label these recipes sugar-free. Would an unsweetened sparkling-water idea help?"};
 if(bar){const result=myBarSuggestion(preference);return {...result,response:result.response+(lessSweet?" You also asked for less sweetness: the linked recipe is the standard version; any syrup adjustment is optional and is not saved to the recipe.":"")};}
 if(/\b(ingredients?|recipe)\b/.test(q)&&!preference&&!previousMood)return {response:"Which recipe do you want ingredients for: House Sour, Honey Lime Margarita, Old Fashioned, or Pineapple Sunset?"};
 if(lessSweet){const mood=preference||previousMood||"balanced";return {mood,response:"For "+recipeOptions.find(r=>r.mood===mood)!.name+", start with less syrup and taste before adding more. The link opens the standard recipe; this adjustment is not saved."};}
 const mood=preference || (/^(yes|sweet|tart|more mellow|ingredients|recipe)$/.test(q)?previousMood:undefined);
 if(mood){const recipe=recipeOptions.find(r=>r.mood===mood)!;return {mood,response:recipe.name+" uses "+recipe.needs.map(group=>group[0]).join(", ")+". "+(mood==="bold"?"This is a stirred, spirit-forward option.":mood==="surprise"?"This is the rum-and-pineapple tropical option.":mood==="fruity"?"This is the tequila-and-lime citrus option.":"This is the whiskey-and-lemon sour option.")+" Open the guided recipe for exact amounts and steps."};}
 return {response:"I can help with four guided recipes, saved My Bar matches, zero-proof ideas, and Academy basics. Tell me a flavor or name a recipe. Open-ended AI chat is still in development."};
}
