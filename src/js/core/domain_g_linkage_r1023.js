/**
 * 域G(核心机制/生命周期) 联动增强 R1023 — G→A生活成本感知 / G→B人生阶段叙事 / G→D社交效率
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR1023Loaded)return;RANDOM_EVENTS._domainGLinkageR1023Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生活成本感知—城市生存成本
{id:"g1023_cost_aware",phase:"street",icon:"💸",title:"城市生存成本",
story:"你算了一笔账——在这个城市生活，每个月到底要花多少钱？\n\n房租、吃饭、交通、日用品、偶尔的社交...\n\n每一项看起来都不多，但加起来就是一个让人心惊的数字。\n\n你开始理解——为什么那么多人说，活着就已经很努力了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1023CostAwareCd)return false;return st.player.day>=30&&st.player.day%60===0&&st.resources&&st.resources.cash!==undefined},
probability:0.07,repeatable:true,
choices:[
{text:"📝 制定月度预算",hint:"会计XP+12,心智+5,置_g1023Budgeter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023CostAwareCd=true;st.flags._g1023Budgeter=true;gx("accounting",12);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 会计XP+12,心智+5。预算不是限制——是把钱花在真正重要的地方。","success")}},
{text:"💪 想办法开源",hint:"心智+5,置_g1023OpenSource",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023CostAwareCd=true;st.flags._g1023OpenSource=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 心智+5。开源比节流更重要——你的收入天花板还远没到。","info")}}
]},
// 2. G→B: 人生阶段叙事—里程碑回顾
{id:"g1023_milestone",phase:"street",icon:"🎯",title:"人生里程碑",
story:"你回头看了看自己走过的路，发现已经走了很远。\n\n那些曾经觉得遥不可及的目标，有的已经实现了，有的正在实现。\n\n你忽然明白了——人生不是短跑，而是马拉松。\n\n重要的不是跑得多快，而是一直在跑。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1023MilestoneCd)return false;return st.player.day>=100&&st.player.day%100===0},
probability:0.10,repeatable:true,
choices:[
{text:"🎯 回顾已实现的目标",hint:"心智+10,智力+5,置_g1023GoalReviewer",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023MilestoneCd=true;st.flags._g1023GoalReviewer=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+10);st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5)}if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 心智+10,智力+5。回顾目标——你正在成为更好的自己。","success")}},
{text:"🎯 设定新的目标",hint:"心智+8,置_g1023GoalSetter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023MilestoneCd=true;st.flags._g1023GoalSetter=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("🎯 心智+8。新的目标，新的旅程——人生永远有下一个里程碑。","info")}}
]},
// 3. G→D: 社交效率—年龄带来的社交智慧
{id:"g1023_social_wisdom",phase:"street",icon:"🧠",title:"社交智慧",
story:"你发现随着年纪增长，社交变得越来越简单了。\n\n不再为了讨好别人而委屈自己，不再为了合群而做不喜欢的事。\n\n你知道哪些人值得深交，哪些关系应该放手。\n\n这就是年龄带来的礼物——社交智慧。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1023SocialWisdomCd)return false;return st.player.day>=200&&st.player.day%90===0&&st.player.age>=28},
probability:0.06,repeatable:true,
choices:[
{text:"🧠 梳理社交圈",hint:"社交XP+15,心智+8,置_g1023CircleCurator",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023SocialWisdomCd=true;st.flags._g1023CircleCurator=true;gx("social",15);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("🧠 社交XP+15,心智+8。梳理社交圈——把时间留给值得的人。","success")}},
{text:"💬 主动联系老朋友",hint:"社交XP+8,心情+5,置_g1023Proactive",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1023SocialWisdomCd=true;st.flags._g1023Proactive=true;gx("social",8);if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💬 社交XP+8,心情+5。主动联系——友情需要经营。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();