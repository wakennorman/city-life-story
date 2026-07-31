/**
 * 域C(职业/成长) 联动增强 R1003 — C→G职业健康 / C→E技能投资 / C→D职业社交
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR1003Loaded)return;RANDOM_EVENTS._domainCLinkageR1003Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康 — 长期工作压力
{id:"c1003_work_toll",phase:"street",icon:"💊",title:"工作的代价",
story:"你算了算，这些年你为工作付出了多少。\n\n时间、精力、健康、陪伴家人的机会——这些成本加起来，远远超过你的工资。\n\n你开始思考:工作的意义到底是什么？是为了生存，还是为了生活？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1003TollDone)return false;if(!st.needs)return false;return(st.needs.fatigue||0)>=50&&st.player.day>=50},
probability:0.05,repeatable:false,
choices:[{text:"💊 重新定义工作",hint:"健康+28,疲劳-25,心情+22,系统标记工作意义",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003TollDone=true;st.flags._c1003WorkMeaning=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+28);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+22)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+28,疲劳-25,心情+22。工作是为了生活——不要为了工作而忘记了生活。","success")}},
{text:"🔥 拼命工作",hint:"健康-10,疲劳+15,系统标记拼命者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003TollDone=true;st.flags._c1003Grinder=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-10,疲劳+15。你选择了拼命——但别忘了，工作不是人生的全部。","warning")}}]},
// 2. C→E: 技能投资 — 技能提升带来经济收益
{id:"c1003_skill_growth",phase:"street",icon:"📈",title:"成长的复利",
story:"你发现技能成长就像复利——前期慢，后期快。\n\n刚开始学习的时候，感觉进步很慢，甚至想放弃。但只要你坚持下来了，后面的进步会越来越快。\n\n那些曾经觉得很难的东西，现在回头看，也不过如此。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1003GrowthDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=20&&st.player.day>=120},
probability:0.04,repeatable:false,
choices:[{text:"📈 坚持技能成长",hint:"智力+25,会计XP+30,系统标记复利成长",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003GrowthDone=true;st.flags._c1003CompoundGrowth=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。成长的复利——现在每一分努力，未来都会加倍回报你。","success")}},
{text:"😅 够用就行",hint:"现金+6000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003GrowthDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+6000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+6000。","info")}}]},
// 3. C→D: 职业社交 — 技能提升带来社交圈变化
{id:"c1003_skill_connect",phase:"street",icon:"👥",title:"技能连接世界",
story:"你发现一个有趣的现象:当你掌握了一项技能，你就多了一个连接世界的方式。\n\n会修车，你能和修车师傅聊到一起。会编程，你能和程序员有共同语言。\n\n技能不仅是谋生的工具，更是社交的桥梁——它让你和不同的人产生连接。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1003ConnectDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=25&&st.player.day>=80},
probability:0.04,repeatable:false,
choices:[{text:"👥 用技能连接世界",hint:"魅力+20,社交XP+28,系统标记技能连接",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003ConnectDone=true;st.flags._c1003SkillBridge=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",28);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+28。技能是连接世界的桥梁——它让你和不同的人产生共鸣。","success")}},
{text:"😅 独自行走",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1003ConnectDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();