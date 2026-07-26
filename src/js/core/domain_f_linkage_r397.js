/**
 * 域F(UI/UX) 联动增强 R397
 * 背景：域F 经 R19/R183/R186/R198/R384/R390 多轮加固后 A类净尽(死字段/未声明变量/除零均修复)。
 * 本轮聚焦3个历轮未覆盖的 UI→叙事桥接，优先命中当前最薄弱域：
 *   A(387/389最薄弱) / C(391) / G(392)。
 *   F→A f397_panel_clarity     收支面板一目了然 → 数据可视化的掌控感, mental + needs.happiness
 *   F→C f397_skill_showcase     成果展示面板清晰 → 呈现即练达, addSkillXp("management") + mental
 *   F→G f397_life_review_ui     季度复盘 PPT 清爽 → 创业回望人生阶段, mental + 生命周期叙事
 *
 * 严格照 domain_f_linkage_r390.js / domain_a_linkage_r389.js 已验证 IIFE 注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR397Loaded) return;
  RANDOM_EVENTS._domainFLinkageR397Loaded = true;

  // 安全技能经验（守真实键：management 为 state.skills 真实键）
  function grantSkillXpR397(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  // 安全消息（守全局 StateManager 可能未定义）
  function msgR397(text, type) {
    if (typeof StateManager !== "undefined" && StateManager && typeof StateManager.addMessage === "function") {
      try { StateManager.addMessage(text, type || "success"); } catch (e) { /* safe */ }
    }
  }

  // 安全心智/幸福（守真实字段 player.mental / needs.happiness）
  function bumpMental(st, n) {
    if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + (n || 0));
  }
  function bumpHappiness(st, n) {
    if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + (n || 0));
  }

  var EVENTS = [
    {
      // F→A: 收支面板一目了然 — UI 让数据可读, 反馈到数值平衡掌控感
      id: "f397_panel_clarity",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "一眼看懂的收支面板",
      story:
        "你打开生活面板，这个月收支第一次清清楚楚地摊在眼前——哪笔花得值、哪笔是冲动，一目了然。",
      triggers: { minDay: 30, excludeFlags: ["_f397PanelClarityCooldown"] },
      conditions: function (st) {
        if (st && st.gameOver) return false;
        if (!st || !st.resources) return false;
        // 需要一定现金积累才谈得上"看面板理账"
        if ((st.resources.cash || 0) < 50) return false;
        return true;
      },
      choices: [
        {
          text: "🗒️ 顺手记一笔下月的预算",
          hint: "心智+5, 幸福感+4, 置 _f397PanelClarityCooldown([PLACEHOLDER]天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f397PanelClarityCooldown = true;
            bumpMental(st, 5);
            bumpHappiness(st, 4);
            msgR397("📊 把账目看明白的那一刻，你对生活的掌控感回来了。心智+5，幸福感+4。", "success");
          }
        },
        {
          text: "🤷 看一眼就关了",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ]
    },
    {
      // F→C: 成果展示面板清晰 — UI 呈现即练达, 反哺职业技能
      id: "f397_skill_showcase",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "清爽的成果展示",
      story:
        "你把这段时间做的事整理进一个简洁的展示面板——原本零散的活儿，一下子有了条理和说服力。",
      triggers: { minDay: 45, excludeFlags: ["_f397SkillShowcaseCooldown"] },
      conditions: function (st) {
        if (st && st.gameOver) return false;
        if (!st || !st.skills) return false;
        // 需要至少一门拿得出手的技能(等级≥10)才有的展示
        var hasSkill = false;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          if (st.skills[k] && (st.skills[k].level || 0) >= 10) { hasSkill = true; break; }
        }
        if (!hasSkill) return false;
        return true;
      },
      choices: [
        {
          text: "💡 借这版面跟人讲清楚自己的价值",
          hint: "management XP+[PLACEHOLDER], 心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f397SkillShowcaseCooldown = true;
            grantSkillXpR397("management", 8);
            bumpMental(st, 3);
            msgR397("💡 把成果讲清楚，本身就是一种能力。管理经验+8，心智+3。", "success");
          }
        },
        {
          text: "📁 先存着, 以后再说",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ]
    },
    {
      // F→G: 季度复盘 PPT 清爽 — 创业阶段的 UI 仪式感连接生命周期回望
      id: "f397_life_review_ui",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📽️",
      title: "一页纸的复盘",
      story:
        "季度结束，你用一页清爽的幻灯片把这段创业路复盘了一遍——从起头到眼下，竟已走了这么远。",
      triggers: { minDay: 90, excludeFlags: ["_f397LifeReviewCooldown"] },
      conditions: function (st) {
        if (st && st.gameOver) return false;
        if (!st || !st.corporate) return false;
        // 需处于创业/公司阶段且有公司实体
        if (!st.corporate.company) return false;
        return true;
      },
      choices: [
        {
          text: "🌅 把复盘发给大家, 一起回望来路",
          hint: "心智+5, 置 _f397LifeReviewCooldown([PLACEHOLDER]天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f397LifeReviewCooldown = true;
            bumpMental(st, 5);
            msgR397("📽️ 一页纸的复盘让团队看见了来路。创业回望人生阶段，心智+5。", "success");
          }
        },
        {
          text: "📴 自己留着看就行",
          hint: "心智+2",
          apply: function (st) {
            bumpMental(st, 2);
            msgR397("📴 你独自翻着复盘页，心里默默给自己鼓了鼓劲。心智+2。", "info");
          }
        }
      ]
    }
  ];

  // 注入 RANDOM_EVENTS（带 id 去重守卫，避免与既有事件重复注册）
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find && RANDOM_EVENTS.find(function (ev) { return ev && ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
