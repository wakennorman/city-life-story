/**
 * 域H(Phase2/公司) 联动增强 R922 — H→A企业数据资产v20 / H→B公司传奇叙事v20 / H→G创始人健康v20
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 *  - 每日触发概率 ≤8%，避免事件疲劳。
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainHLinkageR922Loaded)return;RANDOM_EVENTS._domainHLinkageR922Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
{id:"h922_enterprise_data_v20",phase:"corporate",icon:"📊",title:"企业的数据资产",story:"你发现公司的数据资产比想象的更值钱。\n\n「客户数据、交易记录、运营数据——这些不仅是数字，更是洞察市场趋势的密码。」\n\n一个投资人对你公司的数据资产表现出了浓厚兴趣。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h922EnterpriseDataDone)return false;if(!st.corporate)return false;var _ph=st.corporate.perfHistory||[];return _ph.length>=10&&st.player.day>=650&&st.corporate.active},
probability:0.06,repeatable:false,
choices:[{text:"📊 建立数据资产管理体系",hint:"智力+28,管理XP+40,系统标记数据资产管理",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922EnterpriseDataDone=true;st.flags._h922DataAssetManager=true;if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+28);gx("management",40);if(typeof StateManager!=="undefined")StateManager.addMessage("📊 智力+28,管理XP+40。数据资产管理能力提升！","success")}},
{text:"😅 数据就是数据",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922EnterpriseDataDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"h922_company_saga_v20",phase:"corporate",icon:"📖",title:"公司品牌故事",story:"你的公司在行业媒体上被报道了。\n\n「从零到一:这家公司如何用三年时间颠覆行业认知。」\n\n文章发布后，你的手机被消息轰炸。潜在客户、合作伙伴、投资人……都在联系你。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h922CompanySagaDone)return false;var _st=st.startup||{};var _co=_st.company||{};return(_co.valuation||0)>=8000000&&st.player.day>=750&&_st.status==="running"},
probability:0.06,repeatable:false,
choices:[{text:"📖 借势扩大品牌影响力",hint:"心智+22,名气+18,系统标记品牌建设者",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922CompanySagaDone=true;st.flags._h922BrandBuilder=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+22);st.player.fame=Math.min(100,(st.player.fame||0)+18)}if(typeof StateManager!=="undefined")StateManager.addMessage("📖 心智+22,名气+18。品牌影响力扩大！","success")}},
{text:"😅 低调发展",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922CompanySagaDone=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。","info")}}]},
{id:"h922_founder_health_v20",phase:"corporate",icon:"💪",title:"创始人健康管理",story:"连续几个季度的高强度工作，你的身体终于亮起了红灯。\n\n「您的体检报告显示:颈椎病、胃溃疡、睡眠障碍——这些都是长期高压工作的典型症状。」\n\n医生建议你立即调整工作节奏，否则后果严重。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._h922FounderHealthDone)return false;if(!st.status||!st.needs)return false;var _st=st.startup||{};return(st.status.health||100)<=25&&(st.needs.fatigue||0)>=85&&st.player.day>=550&&_st.status==="running"},
probability:0.08,repeatable:false,
choices:[{text:"💪 建立健康管理计划",hint:"健康+45,疲劳-45,心情+25,系统标记创始人健康管理",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922FounderHealthDone=true;st.flags._h922FounderHealthPlan=true;if(st.status)st.status.health=Math.min(100,(st.status.health||50)+45);if(st.needs){st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-45);st.needs.happiness=Math.min(100,(st.needs.happiness||50)+25)}if(typeof StateManager!=="undefined")StateManager.addMessage("💪 健康+45,疲劳-45,心情+25。创始人健康管理计划启动！","success")}},
{text:"🔥 公司要紧，身体其次",hint:"健康-20,疲劳+25,系统标记过劳创始人",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._h922FounderHealthDone=true;st.flags._h922OverworkedFounder2=true;if(st.status)st.status.health=Math.max(0,(st.status.health||50)-20);if(st.needs)st.needs.fatigue=Math.min(100,(st.needs.fatigue||0)+25);if(typeof StateManager!=="undefined")StateManager.addMessage("🔥 健康-20,疲劳+25。公司很重要，但命更重要。","warning")}}]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();