/**
 * 域G(核心机制/生命周期) 联动增强 R913 — G→A人生数据v32 / G→D人生社交v30 / G→E财富健康v21
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR913Loaded)return;RANDOM_EVENTS._domainGLinkageR913Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"g913_life_data_v32",phase:"street",icon:"📊",title:"人生数据画像",story:"你回顾自己走过的路，那些数字记录着你的成长轨迹。\n\n「第一天:现金¥200,体质30,智力20。第500天:现金¥58,000,体质55,智力65。」\n\n数据不会说谎。你看到了自己的进步，也看到了那些需要继续努力的方向。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g913LifeDataDone)return false;var _ld=st.lifeData||[];return _ld.length>=30&&st.player.day>=500},
probability:0.06,repeatable:false,
choices:[{text:"📊 深入分析人生数据",hint:"智力+25,心智+25,系统标记人生数据意识",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913LifeDataDone=true;st.flags._g913LifeDataAwareness=true;if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+25);st.player.mental=Math.min(100,(st.player.mental||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+25,心智+25。人生数据意识建立！","success")}},
{text:"😅 过去就过去了",hint:"心情+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913LifeDataDone=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心情+8。活在当下。","info")}}]},
{id:"g913_social_life_v30",phase:"street",icon:"👥",title:"人生阶段，社交变化",story:"你发现随着年龄增长，朋友圈在悄然变化。\n\n「二十岁时朋友遍天下，三十岁时只剩几个知心人。」\n\n这不是坏事，而是成长的必然。你开始更珍惜那些经过时间考验的友谊。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g913SocialLifeDone)return false;if(!st.relationships)return false;var _hc=0;for(var _ni in st.relationships){if(st.relationships[_ni]&&(st.relationships[_ni].affinity||0)>=50)_hc++}return _hc>=5&&(st.player.age||20)>=40&&st.player.day>=600},
probability:0.05,repeatable:false,
choices:[{text:"👥 珍惜老朋友，拓展新圈子",hint:"心智+20,社交XP+35,系统标记社交成熟",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913SocialLifeDone=true;st.flags._g913SocialMaturity=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+20);gx("social",35);if(typeof StateManager!=="undefined")StateManager.addMessage("👥 心智+20,社交XP+35。社交成熟度提升！","success")}},
{text:"😅 随缘吧",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913SocialLifeDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"g913_wealth_health_v21",phase:"street",icon:"💰",title:"五十岁的人生反思",story:"五十岁，你开始思考人生的意义。\n\n「前半生用命换钱，后半生用钱换命——但很多人到老才发现，钱换不回健康。」\n\n你看着镜子里的自己，问了一个问题:这些年，你活成了自己想要的样子吗？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g913WealthHealthDone)return false;return(st.player.age||20)>=50&&st.player.day>=800},
probability:0.10,repeatable:false,
choices:[{text:"💰 重新规划人生下半场",hint:"健康+30,心情+20,心智+25,系统标记人生下半场规划",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913WealthHealthDone=true;st.flags._g913LifeSecondHalf=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+30);if(st.needs){st.needs.happiness=Math.min(100,(st.needs.happiness||50)+20);st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-15)}if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 健康+30,心情+20,心智+25。人生下半场规划开始！","success")}},
{text:"😔 继续埋头赚钱",hint:"现金+10000,健康-10,系统标记赚钱至上",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g913WealthHealthDone=true;st.flags._g913MoneyAboveAll=true;if(st.resources)st.resources.cash=(st.resources.cash||0)+10000;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-10);if(typeof StateManager!=="undefined")StateManager.addMessage("😔 现金+10000,但健康-10。钱能买到一切，除了健康。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();