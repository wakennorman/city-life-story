/**
 * 域B(事件/叙事) 联动增强 R1018 — B→A事件数据遗产 / B→D事件社交涟漪 / B→G叙事韧性成长 / B→C职业灵感
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainBLinkageR1018Loaded)return;RANDOM_EVENTS._domainBLinkageR1018Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. B→A: 事件数据遗产—意外之财与税务觉醒
{id:"b1018_windfall_tax",phase:"street",icon:"💰",title:"意外之财的税务提醒",
story:"你最近赚了一笔不错的收入，正高兴着呢，一个在税务局工作的朋友提醒你——\n\n「收入高了记得报税，不然年底罚死你。」\n\n你这才意识到，赚钱不只是加法，还有各种规则要遵守。",
triggers:{minDay:60,interval:90,maxRepeats:5,excludeFlags:["_b1018WindfallTaxCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1018WindfallTaxCd)return false;var _day=st.player.day||0;return _day>=60&&_day%90===0&&st.resources&&(st.resources.totalEarned||0)>=10000},
probability:0.06,repeatable:true,
choices:[
{text:"📋 了解税务知识",hint:"会计XP+18,智力+5,置_b1018TaxAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018WindfallTaxCd=true;st.flags._b1018TaxAware=true;gx("accounting",18);if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("📋 会计XP+18,智力+5。了解税务规则——合法省下的每一分钱都是赚的。","success")}},
{text:"💼 考虑找个会计",hint:"会计XP+8,置_b1018AccountantAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018WindfallTaxCd=true;st.flags._b1018AccountantAware=true;gx("accounting",8);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 会计XP+8。专业的事交给专业的人——但你得先懂点基础。","info")}},
{text:"😅 先不管",hint:"心智+3",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018WindfallTaxCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+3。船到桥头自然直——希望到时候别翻船。","warning")}}
]},
// 2. B→D: 事件社交涟漪—共同经历拉近关系
{id:"b1018_shared_experience",phase:"street",icon:"🤝",title:"同甘共苦的经历",
story:"你和一个朋友聊起了最近发生的事——\n\n那些艰难的日子，那些意外的惊喜，那些让人哭笑不得的遭遇。\n\n你们笑着笑着，忽然觉得——有人分享的经历，才是真正的人生。",
triggers:{minDay:30,interval:60,maxRepeats:8,excludeFlags:["_b1018SharedExpCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1018SharedExpCd)return false;if(!st.relationships)return false;var _met=0;for(var _id in st.relationships){if(st.relationships[_id]&&st.relationships[_id].met)_met++}return _met>=1&&st.player.day>=30&&st.player.day%60===0},
probability:0.07,repeatable:true,
choices:[
{text:"🤝 分享最近的经历",hint:"心情+10,好感+3,社交XP+8,置_b1018SharedBond",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018SharedExpCd=true;st.flags._b1018SharedBond=true;if(st.needs)st.needs.happiness=Math.min(100,(st.needs.happiness||50)+10);gx("social",8);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids=[];for(var _id2 in st.relationships){if(st.relationships[_id2]&&st.relationships[_id2].met)_ids.push(_id2)}if(_ids.length>0){var _p=typeof Random!=="undefined"?Random.int(0,_ids.length-1):0;applyAffinityChange(st,_ids[_p],3,"共同经历分享")}}if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 心情+10,社交XP+8。分享让快乐加倍，让痛苦减半。","success")}},
{text:"😊 静静倾听",hint:"心智+5,好感+2,置_b1018GoodListener",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018SharedExpCd=true;st.flags._b1018GoodListener=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(st.relationships&&typeof applyAffinityChange==="function"){var _ids3=[];for(var _id4 in st.relationships){if(st.relationships[_id4]&&st.relationships[_id4].met)_ids3.push(_id4)}if(_ids3.length>0){var _p2=typeof Random!=="undefined"?Random.int(0,_ids3.length-1):0;applyAffinityChange(st,_ids3[_p2],2,"静静倾听")}}if(typeof StateManager!=="undefined")StateManager.addMessage("😊 心智+5。倾听是最好的陪伴——有时候不需要说什么。","info")}}
]},
// 3. B→G: 叙事韧性成长—从失败中学习
{id:"b1018_failure_lesson",phase:"street",icon:"📚",title:"失败教会我的事",
story:"最近的一次尝试没有达到预期效果。你有些沮丧，但更多的是思考。\n\n你坐下来，认真地复盘了整个过程——\n\n哪里做得好，哪里可以改进，下次遇到类似情况该怎么办。\n\n失败不是终点，而是通往成功的学费。",
triggers:{minDay:45,interval:90,maxRepeats:6,excludeFlags:["_b1018FailureLessonCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._b1018FailureLessonCd)return false;return st.player.day>=45&&st.player.day%90===0&&st.flags&&st.flags._everBroke},
probability:0.08,repeatable:true,
choices:[
{text:"📚 认真复盘总结",hint:"心智+8,智力+5,置_b1018Reflective",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018FailureLessonCd=true;st.flags._b1018Reflective=true;if(st.player){st.player.mental=Math.min(100,(st.player.mental||50)+8);st.player.intelligence=Math.min(100,(st.player.intelligence||50)+5)}if(typeof StateManager!=="undefined")StateManager.addMessage("📚 心智+8,智力+5。复盘是最好的老师——为下一次成功积累经验。","success")}},
{text:"💪 继续前进",hint:"心智+5,置_b1018Resilient",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._b1018FailureLessonCd=true;st.flags._b1018Resilient=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 心智+5。跌倒了爬起来——韧性比天赋更重要。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();