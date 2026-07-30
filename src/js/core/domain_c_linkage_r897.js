/**
 * 域C(职业/成长) 联动增强 R897 — C→A技能市场数据v17 / C→E职业技能→投资v17 / C→G职业健康→生命质量v16
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR897Loaded)return;RANDOM_EVENTS._domainCLinkageR897Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c897_skill_market_v17",phase:"street",icon:"📊",title:"技能市场价值",story:"你打开行业薪酬报告。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c897SkillMarketDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=100)_c++}return _c>=6&&st.player.day>=650},
probability:0.05,repeatable:false,
choices:[{text:"📊 评估技能市场价值",hint:"智力+42,会计XP+48,置_c897SkillMarketValue",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897SkillMarketDone=true;st.flags._c897SkillMarketValue=true;var _t=0,_c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>0){_t+=st.skills[_sk].level;_c++}}st.flags._c897AvgSkillLevel=_c>0?Math.round(_t/_c):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+42);gx("accounting",48);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+42,会计XP+48。","success")}},
{text:"😅 技能够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897SkillMarketDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"c897_career_invest_v17",phase:"street",icon:"💼",title:"职业技能，也是投资资本",story:"你发现职场上学到的技能在投资场上也能用。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c897CareerInvestDone)return false;if(!st.skills)return false;return(((st.skills.management&&st.skills.management.level)||0)>=85||((st.skills.accounting&&st.skills.accounting.level)||0)>=85)&&st.player.day>=700},
probability:0.06,repeatable:false,
choices:[{text:"💼 将职业技能用于投资",hint:"智力+40,管理XP+48,置_c897CareerInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897CareerInvestDone=true;st.flags._c897CareerInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+40);gx("management",48);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+40,管理XP+48。","success")}},
{text:"😅 职场和投资是两回事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897CareerInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"c897_career_health_v16",phase:"street",icon:"💪",title:"职业倦怠，身体在报警",story:"连续加班……你的身体在发出警告。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c897CareerHealthDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=100&&(st.status.health||100)<=2&&st.player.day>=550},
probability:0.08,repeatable:false,
choices:[{text:"💪 调整工作节奏",hint:"疲劳-80,健康+55,心智+40,置_c897HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897CareerHealthDone=true;st.flags._c897HealthFirst=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-80);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+55);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+40);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 疲劳-80,健康+55,心智+40。","success")}},
{text:"🔥 再坚持一下",hint:"疲劳+60,健康-50,置_c897BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c897CareerHealthDone=true;st.flags._c897BurnoutRisk=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+60);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-50);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 注意身体！","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
