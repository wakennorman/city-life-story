/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R931
 * 全系统优化·Domain C 第七十轮循环
 *
 * 【联动增强3项】
 *   1. C→G 职业健康平衡v1 — 职业倦怠/过劳触发健康警示事件
 *   2. C→E 技能投资回报v1 — 技能等级影响投资回报率分析
 *   3. C→D 职业社交圈v1 — 职业成就影响社交圈层
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动现有文件。
 *  - 所有 state 访问均 || 防御。
 *  - 严格遵守目标域数据格式。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR931Loaded) return;
  RANDOM_EVENTS._domainCLinkageR931Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→G 职业健康平衡v1
    // 设计意图：高强度工作(连续工作天数多)触发健康警示事件，
    //    让玩家意识到"工作虽好，身体更重要"。
    // 心理学：损失厌恶 — 玩家更害怕失去健康而非获得收入
    // ========================================================================
    {
      id: "c931_health_balance_v1",
      phase: "street",
      icon: "🏥",
      title: "身体在抗议",
      story: "你最近连续工作太多天了。\n\n早上起来，腰酸背痛，眼睛发涩。你照了照镜子——脸色不太好。\n\n再这样下去，身体迟早要出问题。",
      triggers: { minDay: 30, interval: 100, maxRepeats: 4, excludeFlags: ["_c931HealthBalanceCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c931HealthBalanceCd) return false;
        // 需要连续工作≥5天 或 疲劳≥70
        var _streak = st.flags._workStreak || 0;
        var _fatigue = (st.needs && st.needs.fatigue) || 0;
        var _hasJob = st.career && st.career.currentJob;
        return (_streak >= 5 || _fatigue >= 70) && _hasJob && st.player.day >= 30;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "🏥 休息一天，调整状态",
          hint: "疲劳-20, 健康+5, 置_c931TakeRest",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931HealthBalanceCd = true;
            st.flags._c931TakeRest = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            if (st.player) st.player.health = Math.min(100, (st.player.health || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 你决定休息一天，身体感觉好多了——疲劳-20, 健康+5。", "success");
            }
          }
        },
        {
          text: "💪 再撑一下，项目要紧",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931HealthBalanceCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你咬牙坚持，心智+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→E 技能投资回报v1
    // 设计意图：高技能等级应让玩家获得更好的投资回报率，
    //    激励玩家持续提升技能。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能
    // ========================================================================
    {
      id: "c931_skill_invest_return_v1",
      phase: "street",
      icon: "📈",
      title: "技能就是最好的投资",
      story: "你盘点了一下自己的技能水平——这些年在职场上学到的东西，比想象中值钱。\n\n「如果把这些技能用在投资上，会不会有更好的回报？」一个念头闪过。",
      triggers: { minDay: 80, interval: 120, maxRepeats: 3, excludeFlags: ["_c931SkillInvestCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c931SkillInvestCd) return false;
        if (!st.skills) return false;
        // 计算最高技能等级
        var _maxLv = 0;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) > _maxLv) _maxLv = _sl.level || 0;
        }
        // 需要至少有一个技能Lv≥40才触发
        return _maxLv >= 40 && st.player.day >= 80;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "📈 用技能指导投资",
          hint: "智力+15, 会计XP+20, 置_c931SkillInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931SkillInvestCd = true;
            st.flags._c931SkillInvestor = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            grantXp("accounting", 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你用职业技能指导投资决策——智力+15, 会计XP+20。", "success");
            }
          }
        },
        {
          text: "😅 投资风险太大",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931SkillInvestCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 投资风险太大。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→D 职业社交圈v1
    // 设计意图：职业成就(晋升/跳槽)应影响社交圈层，
    //    让玩家感到"职位越高，社交圈越广"。
    // 心理学：社会比较 — 职业地位影响社交圈层
    // ========================================================================
    {
      id: "c931_career_social_circle_v1",
      phase: "street",
      icon: "👥",
      title: "职场人脉，新的社交圈",
      story: "你在职场上的发展，不知不觉间打开了新的社交圈子。\n\n以前的同事、现在的同行、行业里的前辈……你的人脉网在慢慢扩大。",
      triggers: { minDay: 60, interval: 130, maxRepeats: 3, excludeFlags: ["_c931CareerSocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c931CareerSocialCd) return false;
        if (!st.career || !st.career.currentJob) return false;
        // 需要在当前岗位工作≥30天
        var _daysInJob = st.player.day - (st.career.currentJob.startedDay || 0);
        // 或累计工作天数≥120天
        var _totalWorkDays = (st.flags._consecutiveWorkDays || 0) + (st.career.totalWorkDays || 0);
        return (_daysInJob >= 30 || _totalWorkDays >= 120) && st.player.day >= 60;
      },
      probability: 0.04,
      repeatable: true,
      choices: [
        {
          text: "👥 拓宽人脉圈",
          hint: "魅力+10, 社交好感+3, 置_c931SocialNetwork",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931CareerSocialCd = true;
            st.flags._c931SocialNetwork = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            // 如有可能，给随机已结识NPC加好感
            if (st.relationships && typeof applyAffinityChange === "function") {
              var _metIds = [];
              for (var _id in st.relationships) {
                if (st.relationships[_id] && st.relationships[_id].met) _metIds.push(_id);
              }
              if (_metIds.length > 0) {
                var _pick = typeof Random !== "undefined"
                  ? Random.int(0, _metIds.length - 1)
                  : Math.floor(Math.random() * _metIds.length);
                applyAffinityChange(st, _metIds[_pick], 3, "职场社交");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👥 你拓宽了职场人脉圈——魅力+10。", "success");
            }
          }
        },
        {
          text: "😅 专心工作就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c931CareerSocialCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 专心工作就好。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // 去重注册
  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();