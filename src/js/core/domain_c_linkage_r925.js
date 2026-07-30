/**
 * 域C(职业/成长) 联动增强 R925 — C→A技能市场数据v21 / C→E职业技能→投资v21 / C→G职业健康→生命质量v20
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR925Loaded)return;RANDOM_EVENTS._domainCLinkageR925Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c925_skill_market_v21",phase:"street",icon:"📊",title:"技能市场价值分析",story:"你参加了一场高端的行业论坛，听到了一些令人震撼的数据。\n\n「AI时代，能够与AI协作的人才将成为最稀缺的资源。纯体力和纯重复性脑力工作正在被加速替代。」\n\n你看了看自己的技能组合——哪些技能在升值，哪些在贬值？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c925SkillMarketDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=10&&st.player.day>=850},
probability:0.05,repeatable:false,
choices:[{text:"📊 重新规划技能发展路线",hint:"智力+52,会计XP+65,系统标记技能规划师",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925SkillMarketDone=true;st.flags._c925SkillPlanner=true;var _t=0,_c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>0){_t+=st.skills[_sk].level;_c++}}st.flags._c925AvgSkillLevel=_c>0?Math.round(_t/_c):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+52);gx("accounting",65);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+52,会计XP+65。技能规划能力大幅提升！","success")}},
{text:"😅 技能够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925SkillMarketDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"c925_career_invest_v21",phase:"street",icon:"💼",title:"职业技能投资",story:"你发现了一个惊人的事实：你在职场上学到的技能，在投资市场上的回报率远超你的想象。\n\n「数据分析能力提升投资决策准确率30%，管理能力降低投资风险25%，谈判能力提升交易收益率15%。」\n\n你的职业技能，是你最被低估的资产。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c925CareerInvestDone)return false;if(!st.skills)return false;return(((st.skills.management&&st.skills.management.level)||0)>=95||((st.skills.accounting&&st.skills.accounting.level)||0)>=95)&&st.player.day>=900},
probability:0.06,repeatable:false,
choices:[{text:"💼 建立职业技能投资系统",hint:"智力+50,管理XP+65,系统标记技能投资系统",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925CareerInvestDone=true;st.flags._c925SkillInvestmentSystem=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+50);gx("management",65);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+50,管理XP+65。职业技能投资系统建立！","success")}},
{text:"😅 职场和投资是两回事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925CareerInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"c925_career_health_v20",phase:"street",icon:"💪",title:"职业倦怠的终极警告",story:"你的身体和精神已经达到了极限。\n\n「长期高压工作导致:睡眠质量下降80%,记忆力下降40%,情绪波动增加60%。」\n\n医生说:如果再这样下去，不是要不要休息的问题，而是必须住院的问题。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c925CareerHealthDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=100&&(st.status.health||100)<=1&&st.player.day>=750},
probability:0.08,repeatable:false,
choices:[{text:"💪 强制休息，彻底改变",hint:"疲劳-100,健康+75,心智+55,系统标记强制休息者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925CareerHealthDone=true;st.flags._c925MandatoryRest=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-100);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+75);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+55);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 疲劳-100,健康+75,心智+55。强制休息，重新出发！","success")}},
{text:"🔥 拼到底，不成功便成仁",hint:"疲劳+85,健康-75,系统标记终极冒险者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c925CareerHealthDone=true;st.flags._c925UltimateRiskTaker=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+85);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-75);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 这是在拿命赌博！","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();