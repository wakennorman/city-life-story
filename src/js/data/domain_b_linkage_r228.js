/**
 * 域B联动增强 R228 — 事件/叙事 × 跨域桥接
 * [全系统自洽修复] 域B R228: 生日/天气预报/市场情绪数据首次被事件消费
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

  function _getBirthdayNpcToday(st) {
    if (typeof NPCS === 'undefined' || !NPCS || !NPCS.length) return null;
    var metIds = _getMetNpcIds(st);
    if (metIds.length === 0) return null;
    var dayOfYear = ((st.player.day - 1) % 365) + 1;
    for (var i = 0; i < metIds.length; i++) {
      for (var j = 0; j < NPCS.length; j++) {
        if (NPCS[j] && NPCS[j].id === metIds[i] && NPCS[j].birthday === dayOfYear) {
          return NPCS[j].id;
        }
      }
    }
    return null;
  }

  function _npcName(npcId) {
    if (typeof getNpcById === 'function') {
      var n = getNpcById(npcId);
      if (n && n.name) return n.name;
    }
    return npcId;
  }

  var npc_birthday_surprise = {
    id: 'npc_birthday_surprise',
    title: '🎂 今天是个特别的日子',
    phase: 'street',
    repeatable: false,
    priority: 88,
    conditions: function (st) {
      if (!st || !st.player || !st.flags) return false;
      if (st.flags._birthdaySurpriseSeen) return false;
      var npcId = _getBirthdayNpcToday(st);
      if (!npcId) return false;
      st._birthdayNpcToday = npcId;
      return true;
    },
    probability: 0.9,
    getStory: function (st) {
      var npcId = st._birthdayNpcToday;
      var name = _npcName(npcId);
      var L = [];
      L.push('今天是' + name + '的生日。');
      L.push('');
      L.push('你在街上碰见TA，TA先是愣了一下，然后笑了：');
      L.push('没想到你还记得今天是我生日！');
      L.push('');
      L.push('你们聊了很久。TA眼里有光。');
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      var npcId = st._birthdayNpcToday;
      st.flags._birthdaySurpriseSeen = true;
      delete st._birthdayNpcToday;
      if (choiceId === 'celebrate') {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
        if (typeof applyAffinityChange === 'function') applyAffinityChange(st, npcId, 8, 'birthday_celebrate');
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🎂 你请' + _npcName(npcId) + '吃了顿饭，花200元。TA感动得眼眶泛红。好感+16(生日翻倍)，心情+10。', 'success');
      } else {
        if (typeof applyAffinityChange === 'function') applyAffinityChange(st, npcId, 5, 'birthday_wish');
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🎉 你送上了真诚的祝福。' + _npcName(npcId) + '笑得合不拢嘴。好感+10(生日翻倍)，心情+5。', 'success');
      }
    },
    choices: [
      { text: '🎂 请TA吃顿饭(花200元,好感+16)', id: 'celebrate' },
      { text: '🎉 送口头祝福(免费,好感+10)', id: 'wish' },
    ],
    icons: ['🎂', '生日'],
  };

  var forecast_come_true = {
    id: 'forecast_come_true',
    title: '天气被说中了',
    phase: 'street',
    repeatable: true,
    priority: 60,
    conditions: function (st) {
      if (!st || !st.weather || !st.flags) return false;
      if (st.flags._forecastComeTrueCooldown) { if ((st.player.day || 0) - st.flags._forecastComeTrueCooldown < 30) return false; }
      var fc = st.weather.forecast;
      if (!Array.isArray(fc) || fc.length === 0) return false;
      var todayFc = null;
      for (var i = 0; i < fc.length; i++) { if (fc[i] && fc[i].day === 0) { todayFc = fc[i]; break; } }
      if (!todayFc) return false;
      if (todayFc.weatherId === st.weather.current && st.weather.current !== 'sunny' && todayFc.confidence < 0.85) return true;
      return false;
    },
    probability: 0.06,
    getStory: function (st) {
      var wMap = { heavy_rain: '暴雨', stormy: '暴风雨', typhoon: '台风', snowy: '大雪', foggy: '大雾', heatwave: '高温热浪', cold_snap: '寒潮', heavy_smog: '重度雾霾', windy: '大风', rainy: '中雨', cloudy: '阴天', sandstorm: '沙尘暴' };
      var wName = wMap[st.weather.current] || st.weather.current;
      var L = [];
      L.push('昨天天气预报说今天可能有' + wName + '，你还半信半疑。');
      L.push('');
      L.push('结果今天一早推开窗——果然说中了。');
      L.push('');
      L.push('你突然意识到：这座城市的天气是有规律的。了解一座城市，从了解它的天气开始。');
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._forecastComeTrueCooldown = st.player.day;
      if (choiceId === 'observe') {
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        // [全系统自洽修复] 域C R391: addSkillXp('intelligence')非真实技能键→映射accounting(观察天气规律→数据敏感)
        if (typeof addSkillXp === 'function') addSkillXp('accounting', 5);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🌤️ 你开始认真观察天气规律。心智+3，会计XP+5。', 'success');
      } else {
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🌤️ 你感慨天气预报真准。心情+5。', 'info');
      }
    },
    choices: [
      { text: '📖 认真观察记录天气规律', id: 'observe' },
      { text: '😊 感慨一下就过去了', id: 'casual' },
    ],
    icons: ['🌤️', '天气'],
  };

  var market_sentiment_event = {
    id: 'market_sentiment_event',
    title: '街谈巷议',
    phase: 'street',
    repeatable: true,
    priority: 70,
    conditions: function (st) {
      if (!st || !st._worldParams || !st._worldParams.sectorHeat || !st.flags) return false;
      if (st.flags._marketSentCooldown) { if ((st.player.day || 0) - st.flags._marketSentCooldown < 45) return false; }
      var heat = st._worldParams.sectorHeat;
      var total = 0, count = 0;
      for (var k in heat) { if (Object.prototype.hasOwnProperty.call(heat, k) && isFinite(heat[k])) { total += heat[k]; count++; } }
      if (count === 0) return false;
      var avg = total / count;
      if (avg > 1.25) { st._mktSentMode = 'hot'; return true; }
      if (avg < 0.78) { st._mktSentMode = 'cold'; return true; }
      return false;
    },
    probability: 0.05,
    getStory: function (st) {
      var mode = st._mktSentMode || 'hot';
      var L = [];
      if (mode === 'hot') {
        L.push('最近满大街都在聊赚钱的事。');
        L.push('');
        L.push('菜市场的阿姨说股票涨了、工地上的工友说建材涨价了、连巷口卖水果的老头都在讨论哪个行业风口。');
        L.push('');
        L.push('这座城市弥漫着一股狂热的气息——每个人都觉得自己能抓住机会。');
      } else {
        L.push('最近街上弥漫着一股压抑的气氛。');
        L.push('');
        L.push('店铺关门的消息一个接一个，工地上也没活了，连平时最乐天的老周都叹气说今年难熬。');
        L.push('');
        L.push('这座城市正在经历一场寒流。每个人都在缩紧口袋。');
      }
      return L.join('\n');
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._marketSentCooldown = st.player.day;
      var mode = st._mktSentMode || 'hot';
      delete st._mktSentMode;
      if (mode === 'hot') {
        if (choiceId === 'invest') {
          st.flags._dataInvestorMindset = true;
          if (typeof addSkillXp === 'function') addSkillXp('accounting', 8);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🔥 你决定搭上这波热潮。投资意识觉醒，会计XP+8，心情+5。', 'success');
        } else {
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('🧠 狂热中保持清醒是一种能力。心智+5。', 'info');
        }
      } else {
        if (choiceId === 'save') {
          if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          st.flags._frugalMindset = true;
          if (typeof addSkillXp === 'function') addSkillXp('management', 5);
          if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('💰 现金为王。你决定捂紧钱包等寒冬过去。节俭意识觉醒，管理XP+5。', 'info');
        } else {
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 3); st.player.morality = Math.min(100, (st.player.morality || 50) + 3); }
          if (typeof StateManager !== 'undefined' && StateManager.addMessage) StateManager.addMessage('❄️ 寒冬里敢于逆势布局，需要的不只是钱。心智+3，道德+3。', 'success');
        }
      }
    },
    choices: [
      { text: '🔥 跟风抓住机会(投资意识+会计XP)', id: 'invest' },
      { text: '🧠 冷静旁观(心智+5)', id: 'watch' },
    ],
    icons: ['📊', '市场'],
  };

  RANDOM_EVENTS.push(npc_birthday_surprise);
  RANDOM_EVENTS.push(forecast_come_true);
  RANDOM_EVENTS.push(market_sentiment_event);

  if (typeof console !== 'undefined' && console.log) {
    console.log('[B R228] 3 linkage events registered');
  }
})();