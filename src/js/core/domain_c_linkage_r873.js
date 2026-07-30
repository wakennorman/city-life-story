/**
 * 域C(职业/成长) 联动增强 R873 — C→A技能市场数据v14 / C→E职业技能→投资v14 / C→G职业健康→生命质量v13
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR873Loaded)return;RANDOM_EVENTS._domainCLinkageR873Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"c873_skill_market_v14",phase:"street",icon:"📊",title:"技能市场价值",story:"你打开行业薪酬报告。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c873SkillMarketDone)return false;if(!st.skills)return false;var _c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>=90)_c++}return _c>=5&&st.player.day>=500},
probability:0.05,repeatable:false,
choices:[{text:"📊 评估技能市场价值",hint:"智力+35,会计XP+40,置_c873SkillMarketValue",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873SkillMarketDone=true;st.flags._c873SkillMarketValue=true;var _t=0,_c=0;for(var _sk in st.skills){if(st.skills[_sk]&&(st.skills[_sk].level||0)>0){_t+=st.skills[_sk].level;_c++}}st.flags._c873AvgSkillLevel=_c>0?Math.round(_t/_c):0;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+35);gx("accounting",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+35,会计XP+40。","success")}},
{text:"😅 技能够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873SkillMarketDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"c873_career_invest_v14",phase:"street",icon:"💼",title:"职业技能，也是投资资本",story:"你发现职场上学到的技能在投资场上也能用。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c873CareerInvestDone)return false;if(!st.skills)return false;return(((st.skills.management&&st.skills.management.level)||0)>=70||((st.skills.accounting&&st.skills.accounting.level)||0)>=70)&&st.player.day>=550},
probability:0.06,repeatable:false,
choices:[{text:"💼 将职业技能用于投资",hint:"智力+32,管理XP+40,置_c873CareerInvestor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873CareerInvestDone=true;st.flags._c873CareerInvestor=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+32);gx("management",40);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 智力+32,管理XP+40。","success")}},
{text:"😅 职场和投资是两回事",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873CareerInvestDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。","info")}}]},
{id:"c873_career_health_v13",phase:"street",icon:"💪",title:"职业倦怠，身体在报警",story:"连续加班、高压KPI……你的身体在发出警告。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c873CareerHealthDone)return false;if(!st.needs||!st.status)return false;return(st.needs.fatigue||0)>=100&&(st.status.health||100)<=10&&st.player.day>=400},
probability:0.08,repeatable:false,
choices:[{text:"💪 调整工作节奏",hint:"疲劳-50,健康+40,心智+30,置_c873HealthFirst",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873CareerHealthDone=true;st.flags._c873HealthFirst=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-50);if(st.status)st.status.health=Math.min(100,(st.status.health||50)+40);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+30);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 疲劳-50,健康+40,心智+30。","success")}},
{text:"🔥 再坚持一下",hint:"疲劳+35,健康-30,心智+8,置_c873BurnoutRisk",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c873CareerHealthDone=true;st.flags._c873BurnoutRisk=true;if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+35);if(st.status)st.status.health=Math.max(0,(st.status.health||50)-30);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 注意身体！","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();
