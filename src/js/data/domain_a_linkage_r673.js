/**
 * 域A联动增强 R673 — 数据/数值平衡 × 跨域桥接
 * [全系统自洽修复] 域A R673: 交易额记录/技能市场价值/NPC人情首次被事件消费
 */
(function () {
  "use strict";
  if (typeof window === 'undefined') return;
  if (typeof RANDOM_EVENTS === 'undefined' || !RANDOM_EVENTS) return;

  function _getMetNpcIds(st) {
    var ids = [];
    if (!st.relationships) return ids;
    for (var k in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, k)) {
        if (st.relationships[k] && st.relationships[k].met === true) ids.push(k);
      }
    }
    return ids;
  }

  function _getBestAffinityNpc(st, minAffinity = 40) {
    if (!st || !st.relationships) return null;
    var bestNpc = null;
    var bestAffinity = -1;
    for (var k in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, k)) {
        var rel = st.relationships[k];
        if (rel && rel.met === true && (rel.affinity || 0) > bestAffinity) {
          if ((rel.affinity || 0) >= minAffinity) {
            bestAffinity = rel.affinity;
            bestNpc = k;
          }
        }
      }
    }
    return bestNpc;
  }

  function _getNpcName(npcId) {
    if (typeof getNpcById === 'function') {
      var n = getNpcById(npcId);
      if (n && n.name) return n.name;
    }
    return npcId || '未知';
  }

  function _getSkillMarketValue(skillId) {
    // Reuse getSkillMarketValue from skills.js if available
    if (typeof getSkillMarketValue === 'function') {
      return getSkillMarketValue(skillId);
    }
    // Fallback: count jobs requiring this skill
    if (typeof STREET_JOBS === 'undefined' || !Array.isArray(STREET_JOBS)) return 0;
    var count = 0;
    for (var i = 0; i < STREET_JOBS.length; i++) {
      var job = STREET_JOBS[i];
      if (job && job.requirements && job.requirements[skillId]) count++;
    }
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    if (count >= 1) return 1;
    return 0;
  }

  // ============================================================
  // Event A1: A→D NPC人情价差事件 — NPC高好感提供交易优惠
  // ============================================================
  var npc_trade_discount_event = {
    id: 'npc_trade_discount',
    title: '🤝 NPC熟人优惠',
    phase: 'street',
    repeatable: true,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.relationships || !st.trade) return false;
      if (st.flags._npcTradeDiscountCooldown) {
        var day = (st.player.day || 0);
        if (day - st.flags._npcTradeDiscountCooldown < 7) return false;
      }
      // 查找是否有高好感已结识NPC
      var bestNpc = _getBestAffinityNpc(st, 40);
      if (!bestNpc) return false;
      st._currentTradeNpc = bestNpc;
      st.flags._npcTradeDiscountCooldown = st.player.day || 0;
      return true;
    },
    probability: 0.08,
    getStory: function (st) {
      var npcId = st._currentTradeNpc;
      var name = _getNpcName(npcId);
      var affinity = (st.relationships[npcId].affinity || 0);
      var L = [];
      L.push('你在市场/摊位上遇到了熟人了。' + name + '看到你正在购物，主动走了过来。');
      L.push('');
      L.push('听说你最近在做生意，' + name + '说：' + (affinity >= 70 ? "老熟人了，给你个特别优惠！" : "大家都是朋友，给你便宜点吧。") + '');
      L.push('');
      L.push('因为你们关系不错，本次购物获得' + Math.floor(affinity / 10) + '%折扣。');
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      var npcId = st._currentTradeNpc;
      var affinity = (st.relationships[npcId].affinity || 0);
      var discount = Math.floor(affinity / 10);
      
      // 应用优惠效果
      if (choiceId === 'accept') {
        st.flags._npcTradeDiscountSeen = true;
        delete st._currentTradeNpc;
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage(
            '🎉 ' + _getNpcName(npcId) + '给了你' + discount + '%的熟客优惠！下次再来还有可能更优惠。',
            'success'
          );
        }
        // [全系统自洽修复] 域A: 置 NPC 交易情报标志
        if (st.flags) st.flags._npcTradeInfoBonus = true;
      } else {
        delete st._currentTradeNpc;
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('你礼貌地拒绝了。' + _getNpcName(npcId) + '有些失望。', 'info');
        }
      }
    },
    choices: [
      { text: '🎉 接受优惠', id: 'accept' },
      { text: '🙏 礼貌拒绝', id: 'decline' },
    ],
    icons: ['🤝', 'NPC'],
  };

  // ============================================================
  // Event A2: A→B 交易里程碑叙事 — 累计交易额触发市场感悟事件
  // ============================================================
  var trade_milestone_event = {
    id: 'trade_milestone',
    title: '💰 交易里程碑',
    phase: 'street',
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.trade || !st.flags) return false;
      if (st.flags._tradeMilestoneSeen) return false;
      // 检查累计交易额是否达到门槛
      var totalSpent = (st.trade._totalSpent || 0);
      if (totalSpent >= 5000) { // ¥5000 门槛
        st.flags._tradeMilestoneSeen = true;
        st._milestoneSpent = totalSpent;
        return true;
      }
      return false;
    },
    probability: 1.0, // 达到条件必触发
    getStory: function (st) {
      var spent = st._milestoneSpent || 5000;
      var L = [];
      L.push('回顾这段时间的交易活动，你发现自己已经累计花费了 ¥' + spent.toLocaleString() + ' 进行商品买卖。');
      L.push('');
      L.push('从最初的几块钱小打小闹，到现在几十元的交易，你对市场的理解越来越深刻。');
      L.push('');
      L.push('你意识到：买卖不仅仅是赚钱，更是对市场规律的掌握。每一次交易，都是在积累经验和认知。');
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      delete st._milestoneSpent;
      if (choiceId === 'reflect') {
        if (typeof addSkillXp === 'function') addSkillXp('sales', 5);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage(
            '💡 你从交易经验中领悟到市场规律。销售XP+5。',
            'success'
          );
        }
        // 置交易敏锐度标志，供后续事件消费
        if (st.flags) st.flags._tradeAcuity = true;
      } else {
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('你点点头，继续你的交易事业。心情+5。', 'info');
        }
      }
    },
    choices: [
      { text: '📖 认真反思交易经验', id: 'reflect' },
      { text: '😊 简单庆祝一下', id: 'celebrate' },
    ],
    icons: ['💰', '交易'],
  };

  // ============================================================
  // Event A3: A→C 技能市场价值觉醒 — 高需求技能触发价值认知事件
  // ============================================================
  var skill_market_awakening = {
    id: 'skill_market_value',
    title: '💡 技能市场价值',
    phase: 'street',
    repeatable: true,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.skills || !st.flags) return false;
      if (st.flags._skillMarketValueCooldown) {
        var day = (st.player.day || 0);
        if (day - st.flags._skillMarketValueCooldown < 14) return false;
      }
      // 检查是否有高市场价值的技能
      var skillsToCheck = ['sales', 'cooking', 'repair', 'accounting', 'coding'];
      var foundHighValue = false;
      var bestSkill = null;
      var bestValue = 0;
      for (var i = 0; i < skillsToCheck.length; i++) {
        var skillKey = skillsToCheck[i];
        if (st.skills[skillKey] && st.skills[skillKey].level > 0) {
          var marketVal = _getSkillMarketValue(skillKey);
          if (marketVal >= 2 && marketVal > bestValue) {
            bestValue = marketVal;
            bestSkill = skillKey;
            foundHighValue = true;
          }
        }
      }
      if (foundHighValue) {
        st.flags._skillMarketValueCooldown = st.player.day || 0;
        st._currentMarketSkill = bestSkill;
        st._currentMarketValue = bestValue;
        return true;
      }
      return false;
    },
    probability: 0.15,
    getStory: function (st) {
      var skillKey = st._currentMarketSkill;
      var marketVal = st._currentMarketValue || 0;
      var skillName = '';
      switch(skillKey) {
        case 'sales': skillName = '销售'; break;
        case 'cooking': skillName = '烹饪'; break;
        case 'repair': skillName = '维修'; break;
        case 'accounting': skillName = '会计'; break;
        case 'coding': skillName = '编程'; break;
        default: skillName = skillKey;
      }
      var L = [];
      L.push('你突然意识到，自己在' + skillName + '方面的技能其实很有市场价值。');
      L.push('');
      L.push('从工作的要求、朋友的咨询，到各种技能证书的提升，越来越多的人需要用到这项技能。');
      L.push('');
      L.push('市场对你这项技能的需求等级为：' + (marketVal === 3 ? '很高（众多工作都需要）' : marketVal === 2 ? '较高（部分工作需要）' : '一般'));
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      var skillKey = st._currentMarketSkill;
      var marketVal = st._currentMarketValue || 0;
      delete st._currentMarketSkill;
      delete st._currentMarketValue;
      
      if (choiceId === 'capitalize') {
        if (typeof addSkillXp === 'function') addSkillXp(skillKey, 3);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage(
            '🎯 你决定深化这项技能的应用。' + skillKey + 'XP+3。',
            'success'
          );
        }
        // 置技能市场关注标志
        if (st.flags) st.flags._skillMarketAware = true;
      } else {
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('你点点头，继续积累经验。心情+3。', 'info');
        }
      }
    },
    choices: [
      { text: '🎯 专注提升该技能', id: 'capitalize' },
      { text: '😊 先观望再说', id: 'wait' },
    ],
    icons: ['💡', '技能'],
  };

  // ============================================================
  // 注册事件
  // ============================================================
  RANDOM_EVENTS.push(npc_trade_discount_event);
  RANDOM_EVENTS.push(trade_milestone_event);
  RANDOM_EVENTS.push(skill_market_awakening);

  if (typeof console !== 'undefined' && console.log) {
    console.log('[A R673] 3 linkage events registered: npc_trade_discount, trade_milestone, skill_market_value');
  }
})();
