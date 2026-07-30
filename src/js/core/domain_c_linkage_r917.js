/**
 * 域C(职业/成长) 联动增强 R917 — C→A技能市场数据v20 / C→E职业技能→投资v20 / C→G职业健康→生命质量v19
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR917Loaded)return;RANDOM_EVENTS._domainCLinkageR917Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c917_skill_market_v20",phase:"street",icon:"📊",title:"技能市场价值分析",story:"你参加了一场行业交流会，发现了一个令人震惊的趋势。\n\n「AI正在重塑所有行业的技能需求。未来五年，40%的现有技能将变得过时。」\n\n你看了看自己的技能组合——有些技能在升值，有些在贬值。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c917SkillMarketDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=9&&st.player.day>=800},
probability:0.05,repeatable:false,
choices:[{text:"📊 重新规划技能发展方向",hint:"智力+50,会计XP+60,系统标记技能前瞻者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917SkillMarketDone=true;st.flags._c917SkillForesight=true;var _t=0,_c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>0){_t+=st.skills[_sk].level;_c++}}st.flags._c917AvgSkillLevel=_c>0?Math.round(_t/_c):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+50);gx("accounting",60);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+50,会计XP+60。技能前瞻能力提升！","success")}},
{text:"😅 技能够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917SkillMarketDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"c917_career_invest_v20",phase:"street",icon:"💼",title:"职业技能投资",story:"你发现了一个秘密：职场上学到的技能，在投资市场上同样适用。\n\n「数据分析能力帮你识别投资机会，管理能力帮你控制风险，谈判能力帮你拿到更好的价格。」\n\n你的职业技能正在成为投资回报率最高的资产。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c917CareerInvestDone)return false;if(!st.skills)return false;return(((st.skills.management&&st.skills.management.level)||0)>=95||((st.skills.accounting&&st.skills.accounting.level)||0)>=95)&&st.player.day>=850},
probability:0.06,repeatable:false,
choices:[{text:"💼 加大职业技能投资",hint:"智力+48,管理XP+60,系统标记技能资本化",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917CareerInvestDone=true;st.flags._c917SkillCapitalizer=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+48);gx("management",60);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+48,管理XP+60。技能资本化思维建立！","success")}},
{text:"😅 职场和投资是两回事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917CareerInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"c917_career_health_v19",phase:"street",icon:"💪",title:"职业倦怠与健康",story:"你的身体在发出最后的警告。\n\n「长期高压工作导致皮质醇水平持续升高，免疫系统功能下降，心血管疾病风险增加70%。」\n\n你已经连续加班很久了。是时候做出改变了。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c917CareerHealthDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=100&&(st.status.health||100)<=1&&st.player.day>=700},
probability:0.08,repeatable:false,
choices:[{text:"💪 彻底改变工作方式",hint:"疲劳-100,健康+70,心智+50,系统标记工作生活平衡",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917CareerHealthDone=true;st.flags._c917WorkLifeBalance=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-100);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+70);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+50);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 疲劳-100,健康+70,心智+50。工作生活平衡建立！","success")}},
{text:"🔥 最后一搏，拼到成功",hint:"疲劳+80,健康-70,系统标记冒险者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c917CareerHealthDone=true;st.flags._c917RiskyPlayer=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+80);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-70);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 注意身体！这是拿命在拼。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();