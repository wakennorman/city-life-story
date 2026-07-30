/**
 * 域G(核心机制/生命周期) 联动增强 R894b（本窗口深审轮）
 *
 * 【联动增强3项】
 *   1. G→E/H g894b_advisor_encore — 返聘顾问声誉变现：_retirementType="advisor" 修复后
 *      (R894b A类#1 补 _pensionBase) 的叙事闭环——老东家高价咨询单，退休≠退出经济系统。
 *      心理学锚点：禀赋效应（毕生经验被标价认可）。
 *   2. G→D g894b_quality_score_echo — _g824QualityScore 全库首读（r824 写-only素材）：
 *      生活质量分被老朋友看见，NPC 好感回响。锚点：社会比较的正向面。
 *   3. G→C g894b_career35_compound — _career35Path 转型路径二层回响（cross_system_integration
 *      只做一次性叙事）：转型/新赛道选择在远期兑现技能复利。锚点：峰终定律（选择的"终"回报）。
 *
 * 设计约束：IIFE 注册 RANDOM_EVENTS，显式 phase，met 铁律，done-flag 防重复，|| 守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR894bLoaded) return;
  RANDOM_EVENTS._domainGLinkageR894bLoaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = Object.keys(st.relationships);
    for (var i = 0; i < ids.length; i++) {
      var rel = st.relationships[ids[i]];
      if (rel && rel.met) return ids[i];
    }
    return null;
  }
  function npcName(id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(id); } catch (e) {}
    }
    return id;
  }
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch (e) {} }
  }
  function msg(text, type) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(text, type || "info");
    }
  }

  var EVENTS = [
    {
      // 联动1 G→E/H: 返聘顾问声誉变现（advisor 修复叙事闭环）
      id: "g894b_advisor_encore",
      phase: "street",
      icon: "💼",
      title: "老东家的电话",
      story: "退休后的一个午后，老东家打来电话：新项目卡在你最熟悉的环节，董事会点名要请你回去做一周专项顾问。'价钱好说，'对方顿了顿，'关键是只有你懂这套老系统。'",
      conditions: function (st) {
        if (!st || !st.flags || st.gameOver) return false;
        if (st.flags._g894bAdvisorEncoreDone) return false;
        if (st.flags._retirementType !== "advisor") return false;
        return (st.flags._pensionTotal || 0) > 0; // 至少领过一期养老金+顾问费(R894b A类#1修复后可达)
      },
      probability: 0.06, // [PLACEHOLDER]
      repeatable: false,
      choices: [
        {
          text: "💼 接下这一单",
          hint: "咨询费进账，管理经验+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bAdvisorEncoreDone = true;
            var base = st.flags._pensionBase;
            if (!isFinite(base) || base <= 0) base = 5000;
            var fee = Math.round(Math.min(base, 50000) * 1.5); // [PLACEHOLDER] 一周专项≈1.5倍月薪基数,同养老金50K封顶
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + fee;
            grantXp("management", 30); // [PLACEHOLDER]
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            msg("💼 一周顾问干得漂亮，咨询费 ¥" + fee.toLocaleString() + " 到账。经验这东西，越老越值钱。", "good");
          }
        },
        {
          text: "🍵 婉拒，留在阳台喝茶",
          hint: "退休生活不被打扰，幸福+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bAdvisorEncoreDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            msg("🍵 你婉拒了。有些价值不需要再证明一次——阳台上的茶正好温热。", "info");
          }
        }
      ]
    },
    {
      // 联动2 G→D: 生活质量分被朋友看见（_g824QualityScore 全库首读）
      id: "g894b_quality_score_echo",
      phase: "street",
      icon: "🌟",
      title: "朋友眼里的你",
      story: "老朋友端详着你：'说真的，这几年你把日子过明白了。身体、心态都在线——我们这拨人里，你算活得最清楚的。'",
      conditions: function (st) {
        if (!st || !st.flags || st.gameOver) return false;
        if (st.flags._g894bQualityEchoDone) return false;
        if ((st.flags._g824QualityScore || 0) < 70) return false; // 消费 r824 写-only 素材
        return !!firstMetNpc(st); // met 铁律
      },
      probability: 0.05, // [PLACEHOLDER]
      repeatable: false,
      choices: [
        {
          text: "😄 互相打趣一番",
          hint: "友谊升温",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bQualityEchoDone = true;
            var npc = firstMetNpc(st);
            if (npc && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npc, 4, "生活质量被认可的共鸣"); } catch (e) {} // [PLACEHOLDER] +4
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            msg("🌟 被" + (npc ? npcName(npc) : "老朋友") + "这么一说，你忽然意识到：把日子过好，本身就是了不起的成就。", "good");
          }
        },
        {
          text: "🤝 分享几条心得",
          hint: "帮朋友也理理生活，心智+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bQualityEchoDone = true;
            var npc2 = firstMetNpc(st);
            if (npc2 && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npc2, 6, "倾囊分享生活心得"); } catch (e) {} // [PLACEHOLDER] +6
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            grantXp("social", 15); // [PLACEHOLDER]
            msg("🤝 你把作息、记账、复盘的土办法讲了一遍。教是最好的学。", "good");
          }
        }
      ]
    },
    {
      // 联动3 G→C: 35岁转型选择的远期复利（_career35Path 二层回响）
      id: "g894b_career35_compound",
      phase: "street",
      icon: "🧗",
      title: "转型这条路，回头看",
      story: "整理旧物时翻到当年35岁危机时写下的计划表。那时的忐忑还在纸上，而现在——新领域的功夫已经长进了骨头里。当初咬牙的决定，正在按复利结算。",
      conditions: function (st) {
        if (!st || !st.flags || st.gameOver) return false;
        if (st.flags._g894bCareer35CompoundDone) return false;
        var p = st.flags._career35Path;
        if (p !== "transform" && p !== "newpath") return false;
        if (!st.flags._career35PathNarrated) return false; // 一层叙事(cross_system_integration)已过后才触发二层
        return st.player && (st.player.day || 0) >= 200; // [PLACEHOLDER] 转型后远期
      },
      probability: 0.05, // [PLACEHOLDER]
      repeatable: false,
      choices: [
        {
          text: "📚 把复盘写成方法论",
          hint: "管理+销售经验，心智+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bCareer35CompoundDone = true;
            grantXp("management", 25); // [PLACEHOLDER]
            grantXp("sales", 15); // [PLACEHOLDER]
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            msg("📚 你把转型的坑与桥都写了下来。那个35岁的深夜没有白熬。", "good");
          }
        },
        {
          text: "🔥 趁势再加把劲",
          hint: "疲劳+，但技能猛进",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g894bCareer35CompoundDone = true;
            grantXp("coding", 20); // [PLACEHOLDER]
            grantXp("management", 20); // [PLACEHOLDER]
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            msg("🔥 复利的秘诀是不下牌桌。你又给自己加了一档难度。", "info");
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
