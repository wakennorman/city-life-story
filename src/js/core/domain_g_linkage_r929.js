/**
 * 域G(核心机制/生命周期) 联动增强 R929 — G→B人生回味叙事 / G→E财富蜡像馆 / G→D社交茧房
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 *  - done-flag 防重复。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR929Loaded)return;RANDOM_EVENTS._domainGLinkageR929Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→B: 人生回味叙事 — 特定年龄触发的人生回顾叙事，根据玩家选择产生不同情绪回响
{id:"g929_life_retrospect",phase:"street",icon:"📖",title:"人生回望",
story:"某个深夜，你躺在床上，忽然想起这些年走过的路。\n\n那些咬牙坚持的瞬间，那些放弃的抉择，那些让你失眠的夜晚——\n\n它们都过去了，但从未真正消失。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g929RetrospectDone)return false;var _age=st.player.age||20;return _age>=35&&_age<=45&&st.player.day>=400},
probability:0.04,repeatable:false,
choices:[{text:"📖 回味奋斗的甘苦",hint:"心智+30,魅力+15,置_g929RetrospectGrit",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929RetrospectDone=true;st.flags._g929RetrospectGrit=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+30);st.player.charm=Math.min(100,(st.player.charm||20)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 你回望来时路——那些艰难成就了今天的你。心智+30,魅力+15。","success")}},
{text:"😌 放下过往，轻装前行",hint:"心情+25,疲劳-15,置_g929RetrospectLight",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929RetrospectDone=true;st.flags._g929RetrospectLight=true;if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15)}if(typeof StateManager!=="undefined")StateManager.addMessage("😌 放下包袱，轻装前行。心情+25,疲劳-15。","info")}}]},
// 2. G→E: 财富蜡像馆 — 当玩家积累相当财富后，触发对财富意义的思考，影响后续投资决策
{id:"g929_wealth_museum",phase:"street",icon:"🏛️",title:"财富蜡像馆",
story:"你站在银行大厅里，看着电子屏上跳动的数字。\n\n¥" + (function(){try{var _s=typeof StateManager!=="undefined"?StateManager.getState():null;if(_s&&_s.resources){var _c=(_s.resources.cash||0)+(_s.resources.bankBalance||0);return Math.floor(_c).toLocaleString()}return "?"}catch(e){return "?"}})()+" 的资产总额，是你这些年省吃俭用、拼命工作的结果。\n\n但问题是——这些钱，够了吗？你还要继续赚多少？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g929WealthMuseumDone)return false;if(!st.resources)return false;var _t=(st.resources.cash||0)+(st.resources.bankBalance||0);return _t>=500000&&st.player.day>=300},
probability:0.05,repeatable:false,
choices:[{text:"🏛️ 设定财务自由目标",hint:"会计XP+40,智力+20,置_g929FinGoalSet",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929WealthMuseumDone=true;st.flags._g929FinGoalSet=true;gx("accounting",40);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+20);if(typeof StateManager!=="undefined")StateManager.addMessage("🏛️ 你设定了清晰的财务自由目标。会计XP+40,智力+20。","success")}},
{text:"😅 继续攒，越多越好",hint:"现金+5000,置_g929KeepHoarding",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929WealthMuseumDone=true;st.flags._g929KeepHoarding=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+5000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 你决定继续攒钱——越多越好。现金+5000。","info")}}]},
// 3. G→D: 社交茧房 — 中年后社交圈自然缩小，引发对友谊质量的思考
{id:"g929_social_cocoon",phase:"street",icon:"🦋",title:"社交茧房",
story:"手机通讯录翻了几页，能说的上话的人越来越少了。\n\n不是你变得孤僻了，而是你开始分得清——哪些是应酬，哪些是朋友。\n\n社交圈像茧房，越到中年，越小，但也越暖。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g929SocialCocoonDone)return false;var _age=st.player.age||20;if(_age<40)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=60)_hc++}return _hc>=3&&_hc<=8&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"🦋 珍惜真心朋友",hint:"心智+25,社交XP+30,置_g929CherishTrue",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929SocialCocoonDone=true;st.flags._g929CherishTrue=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("🦋 朋友贵精不贵多。心智+25,社交XP+30。","success")}},
{text:"😔 感到孤独",hint:"心情-10,心智+10,置_g929LonelyRealize",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g929SocialCocoonDone=true;st.flags._g929LonelyRealize=true;if(st.needs)st.needs.happiness=Math.max(0,(st.needs.happiness||50)-10);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 孤独让你更清醒地认识了自己。心智+10。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();