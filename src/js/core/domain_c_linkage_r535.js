/**
 * 域C(职业/成长) 联动增强 R535
 * 桥接（三大零事件消费 career flag 全部打通首消费）：
 *   C→G  c535_career_yearbook    职业年鉴 → 首消费 flags._careerMonthlySnapshots(career_dev.js:3415,24月滚动快照),
 *     一年数据成型时对比首末薪资/存款——峰终定律的成长复盘叙事
 *   C→D  c535_jobhop_storyteller 跨界者故事 → 首消费 flags._crossPathJobhop+_careerPathsWorked(career_dev.js:2718),
 *     跨路径跳槽经历成为社交货币——向NPC分享职业转型故事换好感
 *   C→E  c535_peak_wealth_pivot  巅峰之后 → 首消费 flags._careerMaxLevelCelebrated(career_dev.js),
 *     职业到顶后收入曲线见顶——引导玩家从工资思维转向资产思维(职业-经济联动)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR535Loaded) return;
  RANDOM_EVENTS._domainCLinkageR535Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch (e) {} }
  }
  function npcName(st, npcId) {
    if (!npcId) return "老朋友";
    if (typeof getNpcDisplayName === "function") { try { return getNpcDisplayName(npcId) || "老朋友"; } catch (e) {} }
    return "老朋友";
  }

  var EVENTS = [
    {
      // ---- C→G 联动：职业年鉴（首消费 _careerMonthlySnapshots）----
      id: "c535_career_yearbook", phase: "street", _isChainEvent: false, icon: "📔",
      title: "职业年鉴",
      story: "翻开这一年的职业记录，数字背后是走过的路——{desc}",
      triggers: { minDay: 360, interval: 180, maxRepeats: 3, excludeFlags: ["_c535YearbookCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c535YearbookCooldown) return false;
        var snaps = st.flags && st.flags._careerMonthlySnapshots;
        return Array.isArray(snaps) && snaps.length >= 12; // 满一年月度快照才有"年鉴"可翻
      },
      choices: [
        { text: "📈 感慨成长", hint: "心情+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535YearbookCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("📔 '原来我已经走了这么远。' 一年的轨迹给了你继续向前的底气。心情+2,心智+1。", "success");
        }},
        { text: "🎯 定下一年目标", hint: "管理XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535YearbookCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch (e) {} } // [PLACEHOLDER]
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '明年这时候，我要比这条曲线更高。' 你把目标写在了年鉴末页。管理XP+4,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.flags) return null;
        var snaps = st.flags._careerMonthlySnapshots;
        if (!Array.isArray(snaps) || snaps.length < 2) return "你翻看着自己的职业记录，一段旅程正在成形。";
        var first = snaps[0] || {}, last = snaps[snaps.length - 1] || {};
        var s0 = (typeof first.salary === "number" && isFinite(first.salary)) ? first.salary : 0;
        var s1 = (typeof last.salary === "number" && isFinite(last.salary)) ? last.salary : 0;
        var b0 = (typeof first.bankBalance === "number" && isFinite(first.bankBalance)) ? first.bankBalance : 0;
        var b1 = (typeof last.bankBalance === "number" && isFinite(last.bankBalance)) ? last.bankBalance : 0;
        var salaryTxt = s1 > s0 ? ("日薪从¥" + Math.floor(s0) + "涨到了¥" + Math.floor(s1)) : (s1 < s0 ? ("日薪从¥" + Math.floor(s0) + "变成了¥" + Math.floor(s1) + "——起伏也是履历") : "薪水稳定如常");
        var bankTxt = b1 > b0 ? ("存款多了¥" + Math.floor(b1 - b0)) : "存款经历了波动";
        return "深夜整理旧物，你翻出这一年的职业记录：" + salaryTxt + "，" + bankTxt + "。" + snaps.length + "个月的数字连成一条线，那是别人看不见、只有你自己知道的路。";
      }
    },
    {
      // ---- C→D 联动：跨界者故事（首消费 _crossPathJobhop / _careerPathsWorked）----
      id: "c535_jobhop_storyteller", phase: "street", _isChainEvent: false, icon: "🔀",
      title: "跨界者",
      story: "换过赛道的人，故事总是更多——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 4, excludeFlags: ["_c535JobhopStoryCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c535JobhopStoryCooldown) return false;
        if (!st.flags || !st.flags._crossPathJobhop) return false; // 只有真正跨路径跳槽过的人才有"跨界故事"
        return !!firstMetNpc(st); // 域D铁律：必须有已结识NPC才谈得上"分享"
      },
      choices: [
        { text: "🗣️ 分享转型心得", hint: "好感+3,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535JobhopStoryCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "分享跨行业转型经历"); // [PLACEHOLDER]
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch (e) {} } // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔀 '换赛道最难的不是技能，是心态。' 你的故事让对方听得入神。好感+3,社交XP+3。", "success");
        }},
        { text: "🤐 轻描淡写", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535JobhopStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤐 '也没什么，就是换了份工作。' 有些路，自己知道走过就好。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var paths = (st.flags && st.flags._careerPathsWorked) || {};
        var n = 0; for (var k in paths) { if (paths[k]) n++; }
        var nid = firstMetNpc(st);
        var who = npcName(st, nid);
        var cnt = n >= 2 ? ("你走过" + n + "条不同的职业路径") : "你换过职业赛道";
        return who + "好奇地问起你的工作经历。" + cnt + "——从一个行业跳进另一个行业，这种经历在熟人眼里就是传奇。'讲讲呗，当初怎么敢换的？'";
      }
    },
    {
      // ---- C→E 联动：巅峰之后（首消费 _careerMaxLevelCelebrated）----
      id: "c535_peak_wealth_pivot", phase: "street", _isChainEvent: false, icon: "⛰️",
      title: "巅峰之后",
      story: "职级到顶那天起，工资条就不会再有惊喜了——{desc}",
      triggers: { minDay: 90, interval: 150, maxRepeats: 3, excludeFlags: ["_c535PeakPivotCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c535PeakPivotCooldown) return false;
        if (!st.flags || !st.flags._careerMaxLevelCelebrated) return false; // 职业已到顶
        return !!(st.resources && (st.resources.bankBalance || 0) >= 5000); // 有一定积蓄才谈得上资产配置 [PLACEHOLDER]
      },
      choices: [
        { text: "📊 研究资产配置", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535PeakPivotCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch (e) {} } // [PLACEHOLDER]
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '工资是加法，资产是乘法。' 你开始认真研究投资页面里那些曾被忽略的选项。会计XP+5,心智+2。", "success");
        }},
        { text: "😌 知足常乐", hint: "心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c535PeakPivotCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '到顶了也挺好，稳稳当当。' 不是每个人都需要第二曲线。心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "发工资的日子，你盯着到账短信忽然意识到：职级已经到顶，这个数字以后大概就是它了。账上躺着¥" + Math.floor(bank) + "的存款——是让钱继续躺着，还是让它也开始'上班'？";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
