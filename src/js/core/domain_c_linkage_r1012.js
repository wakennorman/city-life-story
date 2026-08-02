/**
 * 域C(职业/成长) 联动增强 R1012 — C→G职业健康v22 / C→E技能投资回报v22 / C→D职业社交圈v22 / C→A技能市场数据v22
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR1012Loaded)return;RANDOM_EVENTS._domainCLinkageR1012Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// C→G: 职业健康 — 长期加班导致慢性疲劳累积
{id:"c1012_career_health_v22",phase:"street",icon:"🏥",title:"身体的警报",story:"连续加班三周后，你开始频繁头痛。同事说你这几天脸色很差，建议你去医院看看。但你手头还有一个项目没做完。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1012HealthDone)return false;if(!st.career||!st.career.currentJob)return false;return(st.status?st.status.health:100)<30&&st.player.day>=200},
probability:0.08,repeatable:false,
choices:[{text:"🏥 请假去医院检查",hint:"健康+30,业绩-5,置_c1012Checkup",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012HealthDone=true;st.flags._c1012Checkup=true;if(!st.status)st.status={};st.status.health=Math.min(100,(st.status.health||50)+30);if(st.career&&st.career.currentJob)st.career.currentJob.performance=Math.max(0,(st.career.currentJob.performance||50)-5);if(typeof StateManager!=="undefined")StateManager.addMessage("🏥 健康+30,业绩-5。医生说幸好来得早，再拖就要住院了。","success")}},
{text:"💊 吃片止痛药扛过去",hint:"健康-10,业绩+5,置_c1012Ignore",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012HealthDone=true;st.flags._c1012Ignore=true;if(!st.status)st.status={};st.status.health=Math.max(0,(st.status.health||50)-10);if(st.career&&st.career.currentJob)st.career.currentJob.performance=Math.min(100,(st.career.currentJob.performance||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💊 健康-10,业绩+5。止痛药压住了症状，但你心里清楚这不是长久之计。","warning")}}]},

// C→E: 技能投资回报 — 考取证书后获得加薪机会
{id:"c1012_skill_invest_return",phase:"street",icon:"📜",title:"证书的价值",story:"你听说最近公司发布了新政策：持有职业资格证书的员工可以申请技能津贴。你翻出自己的证书，发现刚好符合条件。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1012CertDone)return false;if(!st.career||!st.career.currentJob)return false;return st.player.day>=300&&st.flags&&st.flags._certCount>=2},
probability:0.07,repeatable:false,
choices:[{text:"📜 提交申请，争取津贴",hint:"月薪+15%,置_c1012SkillSubsidy",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012CertDone=true;st.flags._c1012SkillSubsidy=true;if(st.career&&st.career.currentJob)st.career.currentJob.salary=Math.round((st.career.currentJob.salary||5000)*1.15);if(typeof StateManager!=="undefined")StateManager.addMessage("📜 月薪+15%！证书技能津贴已获批，知识就是财富！","success")}},
{text:"🤔 再等等，考个高级证再说",hint:"智力+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012CertDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🤔 智力+5。你决定先考高级证书，到时候申请更高的津贴。","info")}}]},

// C→D: 职业社交圈 — 职场前辈主动传授经验
{id:"c1012_career_social_network",phase:"street",icon:"👥",title:"职场前辈的指点",story:"茶水间里，一位在公司干了十年的老员工主动跟你搭话。他说看你做事踏实，想教你一些职场生存法则。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1012MentorDone)return false;if(!st.career||!st.career.currentJob)return false;return(st.career.currentJob.workDays||0)>=90&&st.player.day>=150},
probability:0.09,repeatable:false,
choices:[{text:"👥 虚心请教，认真学习",hint:"管理XP+40,人缘+8,智力+10,置_c1012Mentored",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012MentorDone=true;st.flags._c1012Mentored=true;gx("management",40);if(st.player){st.player.intelligence=Math.min(100,(st.player.intelligence||50)+10);if(st.player.corporate)st.player.corporate.popularity=Math.min(100,(st.player.corporate.popularity||50)+8)}if(typeof StateManager!=="undefined")StateManager.addMessage("👥 管理XP+40,智力+10,人缘+8。前辈的指点让你少走了很多弯路。","success")}},
{text:"😤 婉拒，相信自己",hint:"智力+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012MentorDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😤 智力+5。你决定靠自己摸索，虽然慢一点，但每一步都踏实。","info")}}]},

// C→A: 技能市场数据 — 技能水平影响商品价格感知
{id:"c1012_skill_market_insight",phase:"street",icon:"📊",title:"行业眼光",story:"你在工作中积累的行业知识，让你对市场上某些商品的价格有了更敏锐的判断。你发现最近供应商的报价有些偏高。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1012MarketInsightDone)return false;if(!st.career||!st.career.currentJob)return false;return st.player.day>=250&&(st.career.currentJob.workDays||0)>=180},
probability:0.06,repeatable:false,
choices:[{text:"📊 利用行业知识谈判",hint:"现金+3000,管理XP+30,置_c1012Negotiated",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012MarketInsightDone=true;st.flags._c1012Negotiated=true;st.resources=st.resources||{};st.resources.cash=(st.resources.cash||0)+3000;gx("management",30);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 现金+3000,管理XP+30。凭借行业经验，你成功谈下了更优的价格！","success")}},
{text:"📝 记下来，以后用得上",hint:"智力+8",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1012MarketInsightDone=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+8);if(typeof StateManager!=="undefined")StateManager.addMessage("📝 智力+8。这些市场信息你都记在了本子上，以后肯定用得上。","info")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();