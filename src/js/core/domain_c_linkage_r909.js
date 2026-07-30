/**
 * 域C(职业/成长) 联动增强 R909 — C→A技能市场数据v19 / C→E职业技能→投资v19 / C→G职业健康→生命质量v18
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR909Loaded)return;RANDOM_EVENTS._domainCLinkageR909Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c909_skill_market_v19",phase:"street",icon:"📊",title:"技能市场价值分析",story:"你打开最新行业薪酬报告，发现技能市场正在发生结构性变化。\n\n「高技能人才缺口持续扩大，复合型技能人才溢价高达40%。」\n\n你看了看自己的技能面板——距离顶尖人才还差多远？",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c909SkillMarketDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=8&&st.player.day>=750},
probability:0.05,repeatable:false,
choices:[{text:"📊 深度分析技能市场",hint:"智力+48,会计XP+55,系统标记技能市场专家",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909SkillMarketDone=true;st.flags._c909SkillMarketExpert=true;var _t=0,_c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>0){_t+=st.skills[_sk].level;_c++}}st.flags._c909AvgSkillLevel=_c>0?Math.round(_t/_c):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+48);gx("accounting",55);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+48,会计XP+55,技能市场分析能力提升！","success")}},
{text:"😅 技能够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909SkillMarketDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。知足常乐。","info")}}]},
{id:"c909_career_invest_v19",phase:"street",icon:"💼",title:"职业技能，投资资本",story:"你发现职场上学到的技能在投资场上也能用。\n\n「管理层的决策能力、会计的数据分析能力、编程的量化思维——这些在投资领域都是高价值技能。」\n\n你的职场技能正在成为另一种资本。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c909CareerInvestDone)return false;if(!st.skills)return false;return(((st.skills.management&&st.skills.management.level)||0)>=95||((st.skills.accounting&&st.skills.accounting.level)||0)>=95)&&st.player.day>=800},
probability:0.06,repeatable:false,
choices:[{text:"💼 将职业技能用于投资",hint:"智力+45,管理XP+55,系统标记投资型职业者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909CareerInvestDone=true;st.flags._c909CareerInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+45);gx("management",55);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+45,管理XP+55,职业投资视角已建立！","success")}},
{text:"😅 职场和投资是两回事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909CareerInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"c909_career_health_v18",phase:"street",icon:"💪",title:"职业倦怠，身体在报警",story:"连续加班、高压KPI、无休止的会议……你的身体在发出最后警告。\n\n「长期高压工作会导致免疫功能下降、心血管疾病风险增加60%。」\n\n体检报告上的数字越来越刺眼。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c909CareerHealthDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=100&&(st.status.health||100)<=1&&st.player.day>=650},
probability:0.08,repeatable:false,
choices:[{text:"💪 调整工作节奏，健康第一",hint:"疲劳-95,健康+65,心智+48,系统标记健康优先",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909CareerHealthDone=true;st.flags._c909HealthFirst=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-95);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+65);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+48);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 疲劳-95,健康+65,心智+48。身体是革命的本钱！","success")}},
{text:"🔥 再坚持一下，成功在望",hint:"疲劳+75,健康-65,系统标记过劳风险",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c909CareerHealthDone=true;st.flags._c909BurnoutRisk=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+75);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-65);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 注意身体！过劳风险极高。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();