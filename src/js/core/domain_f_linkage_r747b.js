/**
 * 域F(UI/UX) 联动增强 R747b
 * 深审结论: 域F A类=0(死字段/假技能键/onclick悬空/wrapper反模式/tutorial DOM/flags写入方 六项审计全净尽)。
 * 零消费素材(UI层写入,事件层零读取):
 *   1) _maxEarnedMilestone   daily_report.js 日收入峰值档(1000/5000/10000),写入后无任何事件回响
 *   2) _milestoneEarned100K/500K/1M  daily_report.js 累计收入里程碑,同样零回响
 *   3) _streakMaster         daily_pipeline.js 连续工作100天永久称号,发放后全库无人再提起
 * 桥接：
 *   F→B  f747b_peak_day_echo      日收入峰值档→深夜复盘叙事(峰终定律:记住峰值那一天)
 *   F→D  f747b_milestone_gathering 累计里程碑→老友聚会(社会比较+关系回报,met铁律)
 *   F→C  f747b_streak_reputation  劳模称号→职场口碑(禀赋效应:称号是挣来的,变成职业资产)
 * 防御：全部||守卫；NPC引用一律 rel && rel.met；好感走 applyAffinityChange；done-flag防重；
 *       conditions全false时(素材未达成)事件静默不触发,叙事仍自洽。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR747bLoaded) return;
  RANDOM_EVENTS._domainFLinkageR747bLoaded = true;

  // [全系统自洽修复] 域F R747b: met NPC 安全遍历(域D铁律,含xiaoli等无档案NPC由met标记兜底)
  function pickMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = [];
    for (var k in st.relationships) {
      var rel = st.relationships[k];
      if (rel && rel.met) ids.push(k);
    }
    if (ids.length === 0) return null;
    return ids[Math.floor(Math.random() * ids.length)];
  }

  function npcName(id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(id) || "老朋友"; } catch (e) { return "老朋友"; }
    }
    return "老朋友";
  }

  // 累计里程碑最高档: 返回 {tier, label} 或 null
  function topMilestone(st) {
    if (!st || !st.flags) return null;
    if (st.flags._milestoneEarned1M) return { tier: 3, label: "累计收入破百万" };
    if (st.flags._milestoneEarned500K) return { tier: 2, label: "累计收入破50万" };
    if (st.flags._milestoneEarned100K) return { tier: 1, label: "累计收入破10万" };
    return null;
  }

  var EVENTS = [
    {
      // [全系统自洽修复] 域F R747b 联动1 F→B: _maxEarnedMilestone 首个事件层读取——峰值那一天的深夜复盘
      id: "f747b_peak_day_echo", phase: "street", _isChainEvent: false, icon: "📈",
      title: "最好的一天",
      story: "夜深了，你翻着日报里那条最高的收入记录，睡意全无。",
      triggers: { minDay: 30, interval: 45, maxRepeats: 1, excludeFlags: ["_f747bPeakCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._f747bPeakCd) return false;
        return (st.flags._maxEarnedMilestone || 0) >= 1000; // [PLACEHOLDER] 日收入峰值至少破千档
      },
      choices: [
        {
          text: "✍️ 复盘那天做对了什么", hint: "智力+4,心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bPeakCd = true;
            st.flags._f747bPeakStyle = "review";
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ 你把那天的每一步写了下来——运气会走，方法会留下。智力+4,心智+4。", "info");
            }
          }
        },
        {
          text: "😌 允许自己得意一晚", hint: "幸福+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bPeakCd = true;
            st.flags._f747bPeakStyle = "savor";
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😌 '这一天是我挣来的。' 你关掉灯，睡得很沉。幸福+8。", "success");
            }
          }
        }
      ],
      text: function (st) {
        var m = (st && st.flags && st.flags._maxEarnedMilestone) || 0;
        if (m >= 10000) return "单日破万那天的场景还历历在目——那不是运气，是积累到了。";
        if (m >= 5000) return "单日五千的纪录挂在那里，像一个还没兑现的承诺。";
        return "第一次单日破千的那个晚上，你请自己吃了顿好的。";
      }
    },
    {
      // [全系统自洽修复] 域F R747b 联动2 F→D: _milestoneEarned100K/500K/1M 首个事件层读取——里程碑聚会
      id: "f747b_milestone_gathering", phase: "street", _isChainEvent: false, icon: "🍻",
      title: "该聚一聚了",
      story: "手机里跳出一条消息：'听说你最近混得不错？'",
      triggers: { minDay: 60, interval: 60, maxRepeats: 1, excludeFlags: ["_f747bGatherCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._f747bGatherCd) return false;
        if (!topMilestone(st)) return false; // 零读取flag首消费
        if (!pickMetNpc(st)) return false; // 域D铁律:无已结识NPC不触发
        return ((st.resources && st.resources.cash) || 0) >= 400; // [PLACEHOLDER] 请得起客
      },
      choices: [
        {
          text: "🍻 做东请一顿", hint: "花¥400,好感+6,幸福+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bGatherCd = true;
            st.flags._f747bGatherStyle = "host";
            var npcId = pickMetNpc(st);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 400); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (npcId && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npcId, 6, "里程碑聚会做东"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              var ms = topMilestone(st);
              StateManager.addMessage("🍻 " + npcName(npcId) + "举杯：'为" + ((ms && ms.label) || "你的好日子") + "！' 好感+6,幸福+10。", "success");
            }
          }
        },
        {
          text: "🤫 低调，只说'还行'", hint: "心智+5,不破财",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bGatherCd = true;
            st.flags._f747bGatherStyle = "lowkey";
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 '还行，混口饭吃。' 财不露白，是这座城市教你的第一课。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var ms = topMilestone(st);
        if (ms && ms.tier >= 3) return "百万这道坎，你是悄悄迈过去的——但消息还是传开了。";
        if (ms && ms.tier >= 2) return "五十万的积累，街坊们看在眼里。";
        return "十万块，对刚进城那年的你来说是个天文数字。";
      }
    },
    {
      // [全系统自洽修复] 域F R747b 联动3 F→C: _streakMaster 永久称号首个事件层读取——劳模口碑变职业资产
      id: "f747b_streak_reputation", phase: "street", _isChainEvent: false, icon: "🏅",
      title: "劳模的名声",
      story: "'就是那位连续干了一百天的？'——你的称号比你先到了新场合。",
      triggers: { minDay: 110, interval: 60, maxRepeats: 1, excludeFlags: ["_f747bStreakCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._f747bStreakCd) return false;
        return !!st.flags._streakMaster; // 零读取永久称号首消费
      },
      choices: [
        {
          text: "💼 把口碑用在正事上", hint: "管理XP+10,销售XP+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bStreakCd = true;
            st.flags._f747bStreakUsed = "career";
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 10); } catch (e) {} // [PLACEHOLDER] 真实技能键
              try { addSkillXp("sales", 6); } catch (e) {} // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '靠谱'两个字，在这座城市比学历值钱。管理XP+10,销售XP+6。", "success");
            }
          }
        },
        {
          text: "😅 只是不敢停下来而已", hint: "心智+6,幸福+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f747bStreakCd = true;
            st.flags._f747bStreakUsed = "humble";
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 你笑着摆手。只有你知道那一百天是怎么熬过来的——所以它才是你的。心智+6,幸福+4。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
