/**
 * 域G(核心机制/生命周期) 联动增强 R1053 — G→A健康寿命轨迹 / G→B城市记忆碎片 / G→E健康投资意识
 *
 * 设计原则：
 *   1. 全部 state 访问均带 || 守卫，防NaN/TypeError传播
 *   2. 使用 Random 对象而非 Math.random()，确保种子可复现
 *   3. 事件冷却用 flags 去重，避免重复触发
 *   4. 遵守域D铁律：NPC访问须 rel && rel.met
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainGLinkageR1053Loaded)return;RANDOM_EVENTS._domainGLinkageR1053Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. G→A: 健康寿命轨迹 — 年龄增长触发健康趋势提醒
// 设计意图：让玩家感知年龄对健康的影响，模拟真实衰老过程
{id:"g1053_health_trend",phase:"street",icon:"📈",title:"健康趋势报告",
story:"你看着镜子里的自己，意识到身体正在悄悄变化。\n\n某些以前轻而易举的事，现在做起来有点吃力了。\n\n你开始认真思考——如果不注意身体，未来的日子可能不会太好过。\n\n健康不是一夜之间变差的，而是每一天都在累积。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1053HealthTrend)return false;var _age=st.player.age||0;var _day=st.player.day||0;return _age>=25&&_day%60===0},
probability:0.06,repeatable:true,
choices:[
{text:"🏃 加强锻炼",hint:"体质+5,健康+3,置_g1053Exercise",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthTrend=true;st.flags._g1053Exercise=true;if(st.player)st.player.physique=Math.min(100,(st.player.physique||50)+5);if(st.status)st.status.health=Math.min(100,(st.status.health||100)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🏃 体质+5,健康+3。运动是最好的抗衰老药——没有之一。","success")}},
{text:"🥗 调整饮食",hint:"健康+3,饱腹+10,置_g1053Diet",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthTrend=true;st.flags._g1053Diet=true;if(st.status)st.status.health=Math.min(100,(st.status.health||100)+3);if(st.needs)st.needs.hunger=Math.min(100,(st.needs.hunger||50)+10);if(typeof StateManager!=="undefined")StateManager.addMessage("🥗 健康+3,饱腹+10。吃进去的东西，决定了你未来的身体。","success")}},
{text:"😅 不管了，活着就行",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthTrend=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。顺其自然也是一种活法。","info")}}
]},
// 2. G→B: 城市记忆碎片 — 随机触发城市记忆叙事
// 设计意图：利用峰终定律，让玩家在随机时间点回味城市生活的温暖瞬间
{id:"g1053_city_memory",phase:"street",icon:"🌆",title:"城市的记忆碎片",
story:"你走在熟悉的街道上，忽然有一种奇怪的感觉——\n\n这座城市已经不再陌生了。你知道哪家店的包子最好吃，知道哪个路口容易堵车，知道哪条巷子可以抄近路。\n\n这些看似无用的知识，拼凑起来就是你在城市里活下来的地图。\n\n你笑了笑，继续往前走。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1053CityMemory)return false;var _day=st.player.day||0;return _day>=45&&_day%45===0},
probability:0.05,repeatable:true,
choices:[
{text:"📝 记下这一刻",hint:"心智+5,魅力+3,置_g1053MemoryWriter",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053CityMemory=true;st.flags._g1053MemoryWriter=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+5);st.player.charm=Math.min(100,(st.player.charm||50)+3)}if(typeof StateManager!=="undefined")StateManager.addMessage("📝 心智+5,魅力+3。记录下的每一点回忆，都是城市生活最好的注脚。","success")}},
{text:"📸 拍张照片",hint:"心情+8,置_g1053Photo",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053CityMemory=true;st.flags._g1053Photo=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📸 心情+8。照片里的城市，比记忆中的更温柔。","info")}},
{text:"😊 默默感受这一刻",hint:"心智+3,置_g1053Feel",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053CityMemory=true;st.flags._g1053Feel=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+3。有些感受，适合放在心里，慢慢回味。","info")}}
]},
// 3. G→E: 健康投资意识 — 健康状态影响投资决策认知
// 设计意图：健康不仅影响身体，也影响财务判断力——身心一体
{id:"g1053_health_invest_awareness",phase:"street",icon:"💡",title:"健康与财富",
story:"你突然想到一个问题——如果身体垮了，赚再多钱又有什么用？\n\n病房里的钱，不是钱，是续命费。\n\n你开始重新审视自己的生活方式——也许对自己好一点，才是最划算的投资。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._g1053HealthInvest)return false;var _health=st.status&&st.status.health||100;var _day=st.player.day||0;return _health<50&&_day%30===0&&_day>=60},
probability:0.08,repeatable:true,
choices:[
{text:"🏥 去医院做个全面检查",hint:"健康+8,会计XP+5,置_g1053Checkup",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthInvest=true;st.flags._g1053Checkup=true;if(st.status)st.status.health=Math.min(100,(st.status.health||100)+8);gx("accounting",5);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 健康+8,会计XP+5。全面检查花点钱，但比生病了再花钱划算多了。","success")}},
{text:"💰 给自己买份保险",hint:"心智+5,置_g1053Insurance",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthInvest=true;st.flags._g1053Insurance=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💰 心智+5。保险不是消费，是对未来不确定性的投资。","info")}},
{text:"😅 先扛着",hint:"心智+2",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._g1053HealthInvest=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+2);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+2。扛着——这是很多人的选择，但未必是好的选择。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();