/**
 * 域C(职业/成长) 联动增强 R1011 — C→G职业健康 / C→E技能投资 / C→D职业社交
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR1011Loaded)return;RANDOM_EVENTS._domainCLinkageR1011Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康 — 工作压力与健康平衡
{id:"c1011_health_cost",phase:"street",icon:"💊",title:"健康的成本",
story:"你算了一笔账:这些年的高强度工作，换来了收入，但也付出了健康的代价。\n\n颈椎病、失眠、焦虑——这些职业病正在悄悄侵蚀你的生活质量。\n\n你开始思考:用健康换钱，再用钱买健康，这真的是唯一的路吗？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1011HealthCostDone)return false;if(!st.needs)return false;return(st.needs.fatigue||0)>=55&&st.player.day>=55},
probability:0.05,repeatable:false,
choices:[{text:"💊 重视健康投资",hint:"健康+30,疲劳-25,心情+20,系统标记健康投资",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011HealthCostDone=true;st.flags._c1011HealthInvest=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+30);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20)}if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康+30,疲劳-25,心情+20。健康是最好的投资——没有之一。","success")}},
{text:"🔥 趁年轻多赚点",hint:"健康-10,疲劳+15,系统标记拼命者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011HealthCostDone=true;st.flags._c1011Grinder2=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+15);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-10,疲劳+15。趁年轻多赚点——但健康不是用钱能买回来的。","warning")}}]},
// 2. C→E: 技能投资 — 技能提升带来回报
{id:"c1011_skill_compound",phase:"street",icon:"📈",title:"技能的复利",
story:"你发现技能提升带来的回报，不是线性的，而是指数级的。\n\n刚开始的时候，学了很久也没什么变化。但一旦突破了某个临界点，进步就会越来越快。\n\n这就是技能的复利效应——前期积累，后期爆发。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1011CompoundDone)return false;if(!st.skills)return false;var _maxLv=0;for(var _sk in st.skills){if(st.skills[_sk]&&st.skills[_sk].level>_maxLv)_maxLv=st.skills[_sk].level}return _maxLv>=22&&st.player.day>=130},
probability:0.04,repeatable:false,
choices:[{text:"📈 坚持积累",hint:"智力+25,会计XP+30,系统标记复利积累",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011CompoundDone=true;st.flags._c1011Compound=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);gx("accounting",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📈 智力+25,会计XP+30。技能的复利——前期积累，后期爆发。","success")}},
{text:"😅 够用就行",hint:"现金+6000",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011CompoundDone=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+6000;if(typeof StateManager!=="undefined")StateManager.addMessage("😅 现金+6000。","info")}}]},
// 3. C→D: 职业社交 — 技能带来的社交圈变化
{id:"c1011_skill_door",phase:"street",icon:"👥",title:"技能打开的门",
story:"你发现技能是一种神奇的东西——它不仅能帮你赚钱，还能帮你打开一扇扇门。\n\n每一扇门后面，都是一个新世界，一群新朋友，一种新的可能性。\n\n你拥有的技能越多，能打开的门就越多。你的世界，由你的技能决定。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1011DoorDone)return false;if(!st.skills)return false;var _total=0;for(var _sk in st.skills){if(st.skills[_sk])_total+=st.skills[_sk].level||0}return _total>=20&&st.player.day>=70},
probability:0.04,repeatable:false,
choices:[{text:"👥 用技能打开新世界",hint:"魅力+20,社交XP+28,系统标记技能开门",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011DoorDone=true;st.flags._c1011DoorOpen=true;if(st.player)st.player.charm=Math.min(100,(st.player.charm||20)+20);gx("social",28);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 魅力+20,社交XP+28。技能是打开世界的钥匙——你拥有的技能越多，世界就越大。","success")}},
{text:"😅 独善其身",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1011DoorDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+8。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();