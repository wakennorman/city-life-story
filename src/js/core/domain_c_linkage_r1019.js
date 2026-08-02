/**
 * 域C(职业/成长) 联动增强 R1019 — C→G职业健康平衡 / C→E技能投资回报 / C→D技能社交圈层
 */
(function(){"use strict";if(typeof RANDOM_EVENTS==="undefined"||!RANDOM_EVENTS)return;if(RANDOM_EVENTS._domainCLinkageR1019Loaded)return;RANDOM_EVENTS._domainCLinkageR1019Loaded=true;
function gx(k,a){if(typeof addSkillXp==="function"){try{addSkillXp(k,a)}catch(e){}}}
var E=[
// 1. C→G: 职业健康平衡—工作的代价
{id:"c1019_work_health",phase:"street",icon:"⚖️",title:"工作的代价",
story:"你最近工作太拼了，身体开始发出信号。\n\n腰酸背痛、眼睛干涩、精神疲惫——这些都在提醒你，再这样下去会出问题。\n\n你开始思考——到底要多努力才够？",
triggers:{minDay:30,interval:90,maxRepeats:8,excludeFlags:["_c1019WorkHealthCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1019WorkHealthCd)return false;return st.player.day>=30&&st.player.day%90===0&&st.needs&&st.needs.fatigue>=60},
probability:0.07,repeatable:true,
choices:[
{text:"😴 好好休息一天",hint:"疲劳-25,健康+5,置_c1019RestAware",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019WorkHealthCd=true;st.flags._c1019RestAware=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-25);if(st.status)st.status.health=Math.min(100,(st.status.health||80)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😴 疲劳-25,健康+5。休息不是偷懒——是为了走更远的路。","success")}},
{text:"🧘 调整工作节奏",hint:"疲劳-10,心智+5,置_c1019Balanced",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019WorkHealthCd=true;st.flags._c1019Balanced=true;if(st.needs)st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-10);if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("🧘 疲劳-10,心智+5。慢下来——有时候少即是多。","info")}},
{text:"💪 咬牙坚持",hint:"心智+8,健康-3,置_c1019Grit",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019WorkHealthCd=true;st.flags._c1019Grit=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+8);if(st.status)st.status.health=Math.max(0,(st.status.health||80)-3);if(typeof StateManager!=="undefined")StateManager.addMessage("💪 心智+8,健康-3。咬牙坚持的精神可嘉——但身体不会永远配合你。","warning")}}
]},
// 2. C→E: 技能投资回报—学习的经济价值
{id:"c1019_skill_value",phase:"street",icon:"🎓",title:"技能的价值",
story:"你发现掌握一项技能后，赚钱的路子变多了。\n\n以前只能做体力活，现在能接一些技术活了。\n\n你真切地感受到——投资自己，是回报率最高的投资。",
triggers:{minDay:60,interval:90,maxRepeats:6,excludeFlags:["_c1019SkillValueCd"]},
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1019SkillValueCd)return false;if(!st.skills)return false;var _hasSkill=false;for(var _k in st.skills){if(st.skills[_k]&&st.skills[_k].level>=30){_hasSkill=true;break}}return _hasSkill&&st.player.day>=60&&st.player.day%90===0},
probability:0.06,repeatable:true,
choices:[
{text:"🎓 继续深造技能",hint:"随机技能XP+25,智力+3,置_c1019LifelongLearner",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019SkillValueCd=true;st.flags._c1019LifelongLearner=true;if(st.skills){var _keys=Object.keys(st.skills);if(_keys.length>0){var _sk=Random.fromArray(_keys);gx(_sk,25)}}if(st.player)st.player.intelligence=Math.min(100,(st.player.intelligence||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🎓 技能XP+25,智力+3。终身学习——最好的投资是投资自己。","success")}},
{text:"💼 用技能接点私活",hint:"收入¥200~500,销售XP+5,置_c1019SkillMonetize",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019SkillValueCd=true;st.flags._c1019SkillMonetize=true;var _earn=200+Random.int(0,300);if(st.resources)st.resources.cash=(st.resources.cash||0)+_earn;gx("sales",5);if(typeof StateManager!=="undefined")StateManager.addMessage("💼 技能变现成功！赚了¥"+_earn+"。销售XP+5。","success")}},
{text:"😅 够用就行",hint:"心智+5",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019SkillValueCd=true;if(st.player)st.player.mental=Math.min(100,(st.player.mental||50)+5);if(typeof StateManager!=="undefined")StateManager.addMessage("😅 心智+5。知足常乐——但别忘了，这个时代不进步就是退步。","info")}}
]},
// 3. C→D: 技能社交圈层—同行交流
{id:"c1019_skill_social",phase:"street",icon:"👥",title:"同行交流圈",
story:"你在工作中认识了一些同行，大家聚在一起聊行业动态、分享经验。\n\n你发现每个人都有自己的独门绝技，交流中收获颇丰。\n\n这就是圈子的力量——一个人走得快，一群人走得远。",
conditions:function(st){if(!st||!st.player||st.gameOver)return false;if(st.flags&&st.flags._c1019SkillSocialCd)return false;if(!st.skills)return false;var _hasLv=false;for(var _k2 in st.skills){if(st.skills[_k2]&&st.skills[_k2].level>=20){_hasLv=true;break}}return _hasLv&&st.player.day>=45&&st.player.day%75===0},
probability:0.07,repeatable:true,
choices:[
{text:"👥 积极参加交流",hint:"社交XP+12,随机技能XP+10,置_c1019Networker",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019SkillSocialCd=true;st.flags._c1019Networker=true;gx("social",12);if(st.skills){var _keys2=Object.keys(st.skills);if(_keys2.length>0){var _sk2=Random.fromArray(_keys2);gx(_sk2,10)}}if(typeof StateManager!=="undefined")StateManager.addMessage("👥 社交XP+12,随机技能XP+10。交流是最好的学习方式。","success")}},
{text:"🤝 分享自己的经验",hint:"社交XP+8,魅力+3,置_c1019Mentor",apply:function(st){if(!st)return;st.flags=st.flags||{};st.flags._c1019SkillSocialCd=true;st.flags._c1019Mentor=true;gx("social",8);if(st.player)st.player.charm=Math.min(100,(st.player.charm||50)+3);if(typeof StateManager!=="undefined")StateManager.addMessage("🤝 社交XP+8,魅力+3。分享是最好的学习——教别人的时候，自己学得最深。","info")}}
]}
];
for(var i=0;i<E.length;i++){var exists=false;for(var j=0;j<RANDOM_EVENTS.length;j++){if(RANDOM_EVENTS[j]&&RANDOM_EVENTS[j].id===E[i].id){exists=true;break}}if(!exists)RANDOM_EVENTS.push(E[i])}})();