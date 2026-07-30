/**
 * 域G(核心机制/生命周期) 联动增强 R967 — G→A生命周期数据沉淀 / G→B人生章节叙事 / G→D社交里程碑
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR967Loaded)return;RANDOM_EVENTS._domainGLinkageR967Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 生命周期数据—特定年龄触发数据回顾
{id:"g967_age_data_review",phase:"street",icon:"📊",title:"数据的重量",
story:"你翻开了自己在这座城市的生活记录——那些数字串联起了一段段回忆。\n\n「第一天:兜里¥300，体重65kg，体脂率20%。第500天:存款¥50000，体重70kg，体脂率18%。」\n\n数据不会说谎，它记录着你的每一个选择，每一次改变。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g967AgeDataDone)return false;return st.player.day>=500&&st.player.day%100===0},
probability:0.04,repeatable:false,
choices:[{text:"📊 深入分析数据变化",hint:"智力+30,心智+25,系统标记数据意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967AgeDataDone=true;st.flags._g967DataAware=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+30);st.player.mental=Math.min(100,(st.player.mental||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+30,心智+25。数据是时间的脚印——你学会了从数字中看到自己。","success")}},
{text:"😅 数字而已",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967AgeDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
// 2. G→B: 人生章节—中年回顾人生阶段
{id:"g967_midlife_chapter",phase:"street",icon:"📖",title:"人生下半场",
story:"你站在人生的分水岭上，回头看是来路，向前看是未知。\n\n「前半生你在为别人而活——为父母、为家庭、为生存。下半生，你该为自己而活了。」\n\n这个念头一旦出现，就再也无法忽视。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g967MidlifeDone)return false;return(st.player.age||20)>=40&&st.player.day>=400},
probability:0.04,repeatable:false,
choices:[{text:"📖 规划人生下半场",hint:"心智+35,魅力+15,系统标记人生规划",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967MidlifeDone=true;st.flags._g967LifePlanner=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+35);st.player.charm=Math.min(100,(st.player.charm||20)+15)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+35,魅力+15。人生下半场——你决定为自己而活。","success")}},
{text:"😔 走一步看一步",hint:"心智+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967MidlifeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+8。","info")}}]},
// 3. G→D: 社交里程碑—年龄增长带来社交圈变化
{id:"g967_social_evolution",phase:"street",icon:"👥",title:"社交圈的进化",
story:"你发现自己的社交圈随着人生阶段在不断变化。\n\n二十岁时，你追求朋友的数量。三十岁时，你在意朋友的质量。到了现在，你只在乎那些真正懂你的人。\n\n这不是冷漠，这是成熟。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g967SocialEvoDone)return false;if(!st.relationships)return false;return(st.player.age||20)>=35&&st.player.day>=300},
probability:0.04,repeatable:false,
choices:[{text:"👥 珍惜真朋友",hint:"心情+25,社交XP+30,系统标记社交成熟",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967SocialEvoDone=true;st.flags._g967SocialMature=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25);gx("social",30);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心情+25,社交XP+30。朋友不在多，贵在真。","success")}},
{text:"😔 越来越孤独了",hint:"心智+10,系统标记孤独感",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g967SocialEvoDone=true;st.flags._g967Lonely=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 心智+10。成长有时是孤独的——但孤独让人清醒。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();