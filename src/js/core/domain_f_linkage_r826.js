/**
 * 域F(UI/UX) 联动增强 R826
 * 全系统优化·Domain F 第六十七轮循环
 *
 * 联动增强3项(补齐历轮域F未覆盖的 F→C/F→D/F→H 三大方向):
 *   1. f826_career_milestone_wall  F→C 职业里程碑墙 — UI层展示职业技能成长轨迹+履历时间线
 *   2. f826_social_constellation    F→D 社交星座图 — UI层展示NPC关系网络+亲密度分布
 *   3. f826_corp_vitality_panel     H→F 公司活力面板 — UI层展示公司健康度+团队士气
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 使用现代 triggers{minDay,interval,maxRepeats,excludeFlags} 范式。
 *  - text() 动态叙述替代 story 占位符（渲染层只调 text()）。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR826Loaded) return;
  RANDOM_EVENTS._domainFLinkageR826Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  function npcCn(id) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(id); if (n) return n; } catch (e) {}
    }
    return "一位老熟人";
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: F→C 职业里程碑墙 — UI层展示职业技能成长轨迹
    // 设计意图：职业域的技能成长/履历数据应在UI层有可视化里程碑墙。
    // 本事件在玩家入职≥90天时触发，给予"职业里程碑墙"标记。
    // 心理学：峰终定律 — 回顾职业成长轨迹产生成就感。
    // ========================================================================
    {
      id: "f826_career_milestone_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "职业里程碑墙",
      story: "你打开职业里程碑墙—─技能等级、工作履历、晋升节点……\n\n每一步都记录在案,见证你从新人到前辈的蜕变。",
      triggers: { minDay: 90, interval: 180, maxRepeats: 1, excludeFlags: ["_f826CareerWallDone"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f826CareerWallDone) return false;
        if (!st.employment || !st.employment.currentJob) return false;
        return st.player.day >= 90;
      },
      text: function (st) {
        if (!st) return null;
        var d = st.player && st.player.day ? st.player.day : 0;
        var jobTitle = "打工人";
        try {
          if (st.employment && st.employment.currentJob && st.employment.currentJob.path && typeof CAREER_PATHS !== "undefined") {
            var path = CAREER_PATHS[st.employment.currentJob.path];
            if (path && path.levels && path.levels[st.employment.currentJob.level]) {
              jobTitle = path.levels[st.employment.currentJob.level].name || path.name || jobTitle;
            }
          }
        } catch (e) {}
        return "你已在职场打拼" + d + "天,现任" + jobTitle + "—─技能等级、工作履历、晋升节点,每一步都记录在案。";
      },
      choices: [
        {
          text: "🏆 查看里程碑墙",
          hint: "心智+20, 管理XP+15, 置_f826CareerWall",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826CareerWallDone = true;
            st.flags._f826CareerWall = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
            grantXp("management", 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 职业里程碑墙已启用—─心智+20, 管理XP+15。", "success");
            }
          }
        },
        {
          text: "💪 继续深耕",
          hint: "心智+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826CareerWallDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 继续深耕。心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: F→D 社交星座图 — UI层展示NPC关系网络
    // 设计意图：社交域的NPC关系/亲密度数据应在UI层有可视化星座图。
    // 本事件在玩家已结识≥3个NPC且总好感≥60时触发。
    // 心理学：社会比较 — 看到自己的社交圈产生归属感。
    // ========================================================================
    {
      id: "f826_social_constellation",
      phase: "street",
      _isChainEvent: false,
      icon: "✨",
      title: "社交星座图",
      story: "你打开社交星座图—─每一个NPC是一颗星,亲密度是亮度。\n\n有的星很亮,有的星还在远处闪烁。",
      triggers: { minDay: 60, interval: 200, maxRepeats: 1, excludeFlags: ["_f826SocialStarDone"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f826SocialStarDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0, _totalAff = 0, _bestId = null, _bestAff = 0;
        for (var _id in st.relationships) {
          var _rel = st.relationships[_id];
          if (_rel && _rel.met) {
            _metCount++;
            var _aff = _rel.affinity || 0;
            _totalAff += _aff;
            if (_aff > _bestAff) { _bestAff = _aff; _bestId = _id; }
          }
        }
        return _metCount >= 3 && _totalAff >= 60;
      },
      text: function (st) {
        if (!st) return null;
        var _metCount = 0, _bestId = null, _bestAff = 0;
        for (var _id in st.relationships) {
          var _rel = st.relationships[_id];
          if (_rel && _rel.met) {
            _metCount++;
            var _aff = _rel.affinity || 0;
            if (_aff > _bestAff) { _bestAff = _aff; _bestId = _id; }
          }
        }
        var _bestName = _bestId ? npcCn(_bestId) : "一位老友";
        return "你的社交星座图上有" + _metCount + "颗星—─" + _bestName + "最亮(好感" + _bestAff + ")。每颗星都是一段缘分。";
      },
      choices: [
        {
          text: "✨ 查看星座图",
          hint: "心情+20, 魅力+15, 置_f826SocialStar",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826SocialStarDone = true;
            st.flags._f826SocialStar = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✨ 社交星座图已启用—─心情+20, 魅力+15。", "success");
            }
          }
        },
        {
          text: "🤝 主动联络",
          hint: "心情+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826SocialStarDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 主动联络,不让感情变淡。心情+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: F→H 公司活力面板 — UI层展示公司健康度+团队士气
    // 设计意图：公司域的运营数据(士气/现金流/团队规模)应在UI层有活力面板。
    // 本事件在玩家处于corporate阶段且公司运营≥30天时触发。
    // 心理学：禀赋效应 — 看到自己公司的运营成果产生经营满足感。
    // ========================================================================
    {
      id: "f826_corp_vitality_panel",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "公司活力面板",
      story: "你打开公司活力面板—─团队士气、现金流、人才结构……\n\n每一个数字,都反映着你经营的成果。",
      triggers: { minDay: 30, interval: 150, maxRepeats: 1, excludeFlags: ["_f826CorpVitalityDone"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._f826CorpVitalityDone) return false;
        if (!st.startup || !st.startup.company || !st.startup.active) return false;
        return true;
      },
      text: function (st) {
        if (!st) return null;
        var _morale = 0, _teamSize = 0;
        try {
          if (st.startup.company.morale !== undefined) _morale = Math.round(st.startup.company.morale);
        } catch (e) {}
        try {
          if (st.startup.team && st.startup.team.members) _teamSize = st.startup.team.members.length;
        } catch (e) {}
        return "公司活力面板: 士气" + _morale + "分, 团队" + _teamSize + "人—─每一个数字都反映着你经营的成果。";
      },
      choices: [
        {
          text: "🏢 查看活力面板",
          hint: "管理XP+20, 心智+15, 置_f826CorpVitality",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826CorpVitalityDone = true;
            st.flags._f826CorpVitality = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            grantXp("management", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 公司活力面板已启用—─管理XP+20, 心智+15。", "success");
            }
          }
        },
        {
          text: "📊 专注业务",
          hint: "心智+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f826CorpVitalityDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 专注业务,数据自有答案。心智+8。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
