/**
 * 域B(事件/叙事) 联动增强 R190
 * 主题承接本轮A类修复：news.js 的 jobBonus/jobPenalty/investmentEffect 修复后，
 *   「行业新闻 → 工作收入 / 投资风向」的关联真正生效——于是玩家开始有意识地留意新闻、并把新闻带进生活。
 * 桥接：
 *   B→D  news_r190_streettalk   街头巷议新闻成为街坊闲聊的谈资 → 与已结识NPC攀谈涨好感
 *   B→C  news_r190_trend_skill  顺着行业风向补相关本事 → 技能XP(真实键)
 *   B→E  news_r190_market_sense 从新闻里嗅到投资风向 → 置投资本金意识 flag(供经济/投资域门控)
 *
 * 严格照 domain_a_linkage_r189.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：心智 st.player.mental；幸福 st.needs.happiness；技能键 "sales"/"english"(addSkillXp 白名单)；
 *   NPC 好感走 applyAffinityChange 守 rel.met(域D铁律，只读 relationships)；投资意识复用 _dataInvestorMindset flag。
 *   数值标 [PLACEHOLDER]，待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR190Loaded) return;
  RANDOM_EVENTS._domainBLinkageR190Loaded = true;

  // 取首个已结识(met)的 NPC id——避免硬编码未激活NPC致死事件（域D铁律：只读 relationships + rel.met 守卫）
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      // B→D: 最近的行业新闻(招工/物价/裁员)成了街坊闲聊的谈资，一来二去拉近了距离
      id: "news_r190_streettalk",
      phase: "street",
      _isChainEvent: false,
      icon: "📰",
      title: "巷口的新闻闲话",
      story:
        "巷口小卖部门前，几个熟面孔正就着最近的新闻你一言我一语——哪个厂又在招人、菜价怎么又涨了、听说外卖单子也不好接了。自从这些新闻实打实影响到大伙的营生，人人都成了半个『时评家』。你要不要凑过去搭两句？",
      triggers: { minDay: 10, excludeFlags: ["_newsR190StreetTalkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        // 需至少有一位已结识的街坊可搭话
        return firstMetNpc(st) !== null;
      },
      choices: [
        {
          text: "🗣️ 凑过去,顺着新闻聊几句家常",
          hint: "街坊好感+,心情+",
          apply: function (st) {
            st.flags._newsR190StreetTalkSeen = true;
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 5, "新闻闲话拉近距离"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🗣️ 从涨价聊到招工，从招工聊到谁家孩子考学——一场新闻闲话,倒把街坊的心又走近了一层。",
                "success",
              );
          },
        },
        {
          text: "🚶 点头笑笑,径直走过",
          hint: "务实,无变化",
          apply: function (st) {
            st.flags._newsR190StreetTalkSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🚶 你冲他们点点头,没停下脚步——新闻听过就好,日子还得自己过。",
                "info",
              );
          },
        },
      ],
    },
    {
      // B→C: 新闻真切影响到收入后,你开始顺着行业风向补短板(外语/口才),把握下一波机会
      id: "news_r190_trend_skill",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "顺风向补本事",
      story:
        "这阵子的新闻让你看明白一个理:风口来的时候,有本事的人才接得住。外贸回暖时懂外语的吃香,服务业用工荒时嘴甜手勤的抢手。与其被新闻牵着走,不如趁早给自己添几样傍身的本事。",
      triggers: { minDay: 18, excludeFlags: ["_newsR190TrendSkillSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        return true;
      },
      choices: [
        {
          text: "📖 顺着风向,认真补一门本事",
          hint: "技能经验+",
          apply: function (st) {
            st.flags._newsR190TrendSkillSeen = true;
            // 真实技能键(addSkillXp 白名单):优先外语(外贸新闻)其次口才(服务业)
            if (typeof addSkillXp === "function") {
              addSkillXp("english", 6); // [PLACEHOLDER]
              addSkillXp("sales", 4); // [PLACEHOLDER]
            }
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "📖 你把碎时间用来啃外语、练口才——新闻里的风向,成了你给自己排的功课表。",
                "success",
              );
          },
        },
        {
          text: "😌 走一步看一步,不折腾",
          hint: "心态平和,无变化",
          apply: function (st) {
            st.flags._newsR190TrendSkillSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😌 风口年年有,你不急着追——把手头的活干扎实,比啥都强。",
                "info",
              );
          },
        },
      ],
    },
    {
      // B→E: 反复琢磨财经新闻后,你第一次动了「顺着新闻做投资」的念头→投资本金意识
      id: "news_r190_market_sense",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧭",
      title: "新闻里的风向标",
      story:
        "翻着一条条财经新闻:哪个行业订单爆满、哪类大宗商品要涨、哪家公司在裁员收缩。你忽然意识到,这些消息早已不只是茶余饭后的谈资——读懂了它们,就等于读懂了钱要往哪儿流。要不要试着把这份『新闻盘感』用到投资上?",
      triggers: { minDay: 30, excludeFlags: ["_newsR190MarketSenseSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        if ((st.resources.cash || 0) < 15000) return false; // [PLACEHOLDER] 本金门槛
        return true;
      },
      choices: [
        {
          text: "🧭 把新闻盘感用到投资决策上",
          hint: "开启投资本金意识",
          apply: function (st) {
            st.flags._newsR190MarketSenseSeen = true;
            st.flags._dataInvestorMindset = true; // B→E: 复用投资意识 flag,供经济/投资域事件门控
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🧭 你开始把每天的财经新闻当成投资的风向标——机会,往往就藏在别人一扫而过的字里行间。",
                "success",
              );
          },
        },
        {
          text: "🛡️ 新闻看看就好,投资还是谨慎",
          hint: "稳健,无变化",
          apply: function (st) {
            st.flags._newsR190MarketSenseSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🛡️ 你提醒自己:新闻能看趋势,却猜不准涨跌——真金白银的事,还得多留个心眼。",
                "info",
              );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
