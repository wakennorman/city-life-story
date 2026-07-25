/**
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R233
 * 全系统优化 loop R233
 *
 * 本轮 A类修复（在 npcs.js / social_network.js 内，含注释锚点）：
 *  - npcs.js: 9处 totalEarned NaN 守卫（旧存档 undefined/NaN 保护）
 *  - social_network.js: Date.now()→Random.int() 保证 MC 回放确定性
 *  - social_network.js: addDailyTransaction 调用前加 typeof 守卫
 *
 * 联动增强 3 项（补齐历轮域D未充分利用的 D→B/D→G/D→E 方向）：
 *  1. D→B npc_birthday_narrative（street）：**NPC生日叙事深化** — 生日当天拜访
 *     触发带选择的叙事事件（不只是心情+3），NPC 回忆往事/分享人生感悟，玩家可选
 *     安慰/鼓励/倾听，好感奖励与心情加成随选择变化。
 *  2. D→G social_support_buff（street）：**社交缓冲负面事件** — 当玩家拥有≥3个
 *     熟人(好感≥30)时，遭遇负面状态(失业/生病/失败)时的情绪打击降低25%。
 *     体现社会支持系统对心理韧性的保护作用。
 *  3. D→E npc_investment_tip（street）：**熟人投资情报** — 好感≥60的NPC根据
 *     其职业/行业领域，有概率提供投资/交易情报（某商品即将涨价、某股票有利好等）。
 *     每日tick检测，14天冷却防刷屏。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重；数值标 [PLACEHOLDER]。
 *  - 每个事件显式设 phase（events_core.js:379 按 e.phase===phase 过滤，无 phase=死事件）。
 *  - 本文件须在 npcs.js/npc_relationships.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR233Loaded) return;
  RANDOM_EVENTS._domainDLinkageR233Loaded = true;

  // ---- 本地助手（全防御） ----

  /** 获取NPC中文名 */
  function _getNpcNameR233(npcId) {
    if (!npcId || typeof NPCS === "undefined" || !NPCS) return npcId || "某人";
    for (var _i = 0; _i < NPCS.length; _i++) {
      if (NPCS[_i] && NPCS[_i].id === npcId) return NPCS[_i].name || npcId;
    }
    return String(npcId).replace(/_/g, " ");
  }

  /** 获取NPC生日（day-of-year） */
  function _getNpcBirthdayR233(npcId) {
    if (!npcId || typeof NPCS === "undefined" || !NPCS) return 0;
    for (var _i = 0; _i < NPCS.length; _i++) {
      if (NPCS[_i] && NPCS[_i].id === npcId) return NPCS[_i].birthday || 0;
    }
    return 0;
  }

  /** 获取NPC角色类型 */
  function _getNpcRoleR233(npcId) {
    if (!npcId || typeof NPCS === "undefined" || !NPCS) return "";
    for (var _i = 0; _i < NPCS.length; _i++) {
      if (NPCS[_i] && NPCS[_i].id === npcId) return NPCS[_i].role || "";
    }
    return "";
  }

  /** 获取NPC月收入 */
  function _getNpcIncomeR233(npcId) {
    if (!npcId || typeof NPCS === "undefined" || !NPCS) return 0;
    for (var _i = 0; _i < NPCS.length; _i++) {
      if (NPCS[_i] && NPCS[_i].id === npcId) return NPCS[_i].monthlyIncome || 0;
    }
    return 0;
  }

  /** 计算当日是第几天（1-based） */
  function _dayOfYearR233(day) {
    return ((day - 1) % 365) + 1;
  }

  // ============================================================
  // 联动增强1: D→B NPC生日叙事深化
  // ============================================================
  // 在NPC生日当天，如果玩家拜访该NPC，触发一个带选择的叙事事件。
  // 冷却：每个NPC每年只触发一次（用 _npcBirthdayNarrative_<year> 标记）
  // 触发条件：生日当天拜访按钮已冷却(7天) → 用小游戏逻辑替代
  // 本事件通过每日tick检测：今天是否有NPC生日且玩家已结识且未触发本年度叙事
  // 在 tickNpcRelationships 中调用，不在 RANDOM_EVENTS 中注册（避免事件池稀释）
  function _checkBirthdayNarrativeR233(st) {
    if (!st || !st.player || !st.relationships || !st.needs) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!day) return;
    var doy = _dayOfYearR233(day);
    var year = Math.floor((day - 1) / 365) + 1;
    if (!st.npcRelationshipLog) st.npcRelationshipLog = {};
    var narrated = st.npcRelationshipLog._birthdayNarrative || {};
    st.npcRelationshipLog._birthdayNarrative = narrated;

    // 遍历所有NPC找今天过生日的
    if (typeof NPCS === "undefined" || !NPCS) return;
    for (var _bi = 0; _bi < NPCS.length; _bi++) {
      var _n = NPCS[_bi];
      if (!_n || !_n.id || !_n.birthday || !_n.name) continue;
      if (_n.birthday !== doy) continue;
      var _rel = st.relationships[_n.id];
      if (!_rel || !_rel.met) continue;
      // 今年已触发过叙事？
      var _key = _n.id + "_" + year;
      if (narrated[_key]) continue;
      // 好感≥30才触发（太生疏不会分享人生故事）
      var _aff = _rel.affinity || 0;
      if (_aff < 30) continue;
      // 今天已经互动过（拜访/对话）？有 _lastInteractionDay === day 说明刚互动过
      var _lastInt = _rel._lastInteractionDay || 0;
      if (_lastInt !== day) continue;

      // 触发叙事 —— 根据好感等级和角色类型生成不同叙事
      narrated[_key] = true;
      var _npcName = _n.name;
      var _role = _n.role || "";
      var _roleLabel = _role ? "（" + _role + "）" : "";
      var _story = "";
      var _choices = [];

      if (_aff >= 80) {
        // 挚友级：深度人生叙事
        _story = _npcName + _roleLabel + "今天生日，你带了一份小礼物去找" + _npcName + "。\n\n" +
          _npcName + "看到你，先是愣了一下，然后笑了：「你还记得啊。这一年过得真快。」\n\n" +
          "你们坐下来，她/他给你倒了杯茶，慢慢说起了一些从未提过的事——" +
          "关于年轻时为什么来这座城市、关于那个没能实现的梦想、关于这些年一个人扛过来的日子。\n\n" +
          "说着说着，" + _npcName + "的眼眶有点红：「这些话，我都没跟别人说过。」";
        _choices = [
          {
            text: "🤗 握紧对方的手，说「你还有我」",
            effect: "好感+5，心情+5，心智+3",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 5);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 5);
              s.player.mental = Math.min(100, (s.player.mental || 50) + 3);
              StateManager.addMessage("🤗 " + _npcName + "沉默了一会儿，然后轻轻回握了你的手。「谢谢你。」她说。这一刻，你们之间不需要更多言语。", "success");
            }
          },
          {
            text: "🍻 陪她/他喝一杯，听她/他说完",
            effect: "好感+3，心情+3，疲劳+5",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 3);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 5);
              StateManager.addMessage("🍻 你们喝着聊着，不知不觉到了深夜。" + _npcName + "说了很多，你听了很多。有人倾听，本身就是一种治愈。", "info");
            }
          },
          {
            text: "🎁 送上生日祝福，说「明天会更好」",
            effect: "好感+2，心情+2",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 2);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 2);
              StateManager.addMessage("🎁 " + _npcName + "笑了笑：「你说得对，明天会更好的。」她/他拍了拍你的肩，眼神里多了一些温暖。", "info");
            }
          }
        ];
      } else if (_aff >= 60) {
        // 好友级：温情叙事
        _story = _npcName + _roleLabel + "今天生日，你过去打招呼时她/他正在忙。\n\n" +
          "看到你，" + _npcName + "放下手里的活，笑着说：「哟，你还记得我生日呢？」\n\n" +
          "她/他擦了擦手，从口袋里掏出一颗糖：「给，早上买的。」\n\n" +
          "你们站在路边聊了几句，她/他看了看手机上的日期，感慨道：「又老了一岁。不过，今年认识了你，算是件好事。」";
        _choices = [
          {
            text: "😊 「能认识你也是我的幸运」",
            effect: "好感+3，心情+2",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 3);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 2);
              StateManager.addMessage("😊 " + _npcName + "愣了一下，然后笑了：「你这人，说话还挺好听。」气氛轻松愉快。", "success");
            }
          },
          {
            text: "🎂 请她/他吃顿饭庆祝",
            effect: "好感+2，心情+3，现金-80",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 2);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - 80);
              StateManager.addMessage("🎂 你们去了街边的小馆子，简单吃了顿饭。" + _npcName + "坚持要AA，但你说「今天我请」。她/他笑着摇头：「你这个人情我记下了。」", "info");
            }
          }
        ];
      } else {
        // 熟人间：简单祝福
        _story = _npcName + _roleLabel + "今天生日，你恰好碰到她/他。\n\n" +
          "你犹豫了一下，还是说了句：「生日快乐。」\n\n" +
          _npcName + "有些意外，点了点头：「谢谢，你还记得。」\n\n" +
          "气氛有一点点微妙——你们还没熟到能坐下来吃饭的程度，但一句祝福已经足够让这个下午变得不一样了。";
        _choices = [
          {
            text: "🙂 微笑点头，不多打扰",
            effect: "好感+2，心情+1",
            apply: function (s) {
              if (!s.relationships[_n.id]) s.relationships[_n.id] = { affinity: 0, met: true };
              s.relationships[_n.id].affinity = Math.min(100, (s.relationships[_n.id].affinity || 0) + 2);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 1);
              StateManager.addMessage("🙂 你微笑着点了点头，准备离开。" + _npcName + "叫住你：「等一下。」她/他从口袋里拿出一个橘子递给你。「拿着，今天刚买的。」", "info");
            }
          }
        ];
      }

      // 构建事件对象
      var _event = {
        id: "npc_birthday_narrative_" + _n.id,
        phase: "street",
        icon: "🎂",
        title: _npcName + "的生日",
        story: _story,
        conditions: function () { return false; }, // 不通过随机事件池触发，由本函数直接调用
        probability: 0,
        repeatable: false,
        choices: _choices
      };

      // 直接触发显示
      if (typeof showEventModal === "function") {
        showEventModal(_event, st);
      } else {
        // fallback: 简单消息
        StateManager.addMessage("🎂 今天是" + _npcName + "的生日，你们聊了一会儿。", "info");
        if (_choices.length > 0 && _choices[0].apply) {
          _choices[0].apply(st);
        }
      }
    }
  }

  // ============================================================
  // 联动增强2: D→G 社交缓冲负面事件
  // ============================================================
  // 在每日tick中检测：玩家拥有≥3个熟人(好感≥30)，则标记st.flags._socialBuffActive
  // 其他系统(如失业/生病/失败事件)检测此标记，若存在则将情绪打击降低25%
  function _applySocialBuffR233(st) {
    if (!st || !st.relationships || !st.flags) return;
    var _circle = 0;
    for (var _id in st.relationships) {
      var _r = st.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) >= 30) _circle++;
    }
    // 社交缓冲激活条件：≥3个熟人
    if (_circle >= 3) {
      st.flags._socialBuffActive = true;
      // 每日触发一次社交缓冲提示，7天冷却
      if (!st.npcRelationshipLog) st.npcRelationshipLog = {};
      var _lastBuffMsg = st.npcRelationshipLog._lastSocialBuffDay || 0;
      var _day = st.player.day || 0;
      if (_day - _lastBuffMsg >= 7 && typeof StateManager !== "undefined") {
        st.npcRelationshipLog._lastSocialBuffDay = _day;
        StateManager.addMessage(
          "🛡️ 你拥有" + _circle + "位说得上话的朋友，他们的存在让你内心更加强大。" +
          "当困难来临时，你知道自己不是一个人面对（社交缓冲已激活：负面情绪-25%）",
          "info"
        );
      }
    } else {
      // 熟人不足3人，关闭缓冲
      if (st.flags._socialBuffActive) {
        st.flags._socialBuffActive = false;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "😔 你的社交圈有些冷清，只有" + _circle + "位熟人。" +
            "再熟络" + (3 - _circle) + "位即可激活社交缓冲，抵御生活中的负面打击。",
            "warning"
          );
        }
      }
    }
  }

  // ============================================================
  // 联动增强3: D→E 熟人投资情报
  // ============================================================
  // 好感≥60的NPC，根据其职业/行业领域，有概率提供投资/交易情报。
  // 每日tick检测，14天冷却防刷屏。消息通过 StateManager.addMessage 推送。
  function _checkNpcInvestmentTipR233(st) {
    if (!st || !st.relationships || !st.player) return;
    if (typeof StateManager === "undefined" || typeof NPCS === "undefined" || !NPCS) return;
    var day = st.player.day || 0;
    if (!day) return;
    // 冷却检查
    if (!st.npcRelationshipLog) st.npcRelationshipLog = {};
    var _lastTip = st.npcRelationshipLog._lastInvestmentTipDay || 0;
    if (day - _lastTip < 14) return;

    // 找所有好感≥60的NPC
    var _tipProviders = [];
    for (var _npcId in st.relationships) {
      var _r = st.relationships[_npcId];
      if (!_r || !_r.met || (_r.affinity || 0) < 60) continue;
      // 找NPC定义
      for (var _ni = 0; _ni < NPCS.length; _ni++) {
        var _n = NPCS[_ni];
        if (_n && _n.id === _npcId) {
          _tipProviders.push({ id: _npcId, name: _n.name || _npcId, role: _n.role || "", income: _n.monthlyIncome || 0 });
          break;
        }
      }
    }
    if (_tipProviders.length < 1) return;

    // 随机选一个NPC提供情报（概率：30%）
    if (!Random.chance(0.3)) return;
    var _provider = Random.fromArray(_tipProviders);
    st.npcRelationshipLog._lastInvestmentTipDay = day;

    // 根据角色类型生成不同情报
    var _role = _provider.role || "";
    var _tipMsg = "";
    var _tipType = "";

    // 按角色分类
    if (_role.indexOf("中介") >= 0 || _role.indexOf("销售") >= 0 || _role.indexOf("工头") >= 0) {
      // 市场/商业类情报
      var _marketTips = [
        "最近批发市场的钢材涨了不少，听说还要继续涨，你手头有闲钱可以囤点废铁。",
        "我听说商业区有几个店铺要转让，价格不错，你有兴趣可以看看。",
        "最近物流成本涨了，很多东西要涨价，趁现在多囤点日用品。",
        "年底了，各种年货需求大，批发市场进货价已经开始涨了。"
      ];
      _tipMsg = Random.fromArray(_marketTips);
      _tipType = "market";
    } else if (_role.indexOf("医生") >= 0 || _role.indexOf("健康") >= 0) {
      // 健康/医疗类情报
      var _healthTips = [
        "最近流感高发，药店里的感冒药卖得很好，你可以考虑进点货。",
        "医院里最近设备采购多，做医疗器械生意的都赚了。",
        "换季了，保健品市场开始热了，你知道的。"
      ];
      _tipMsg = Random.fromArray(_healthTips);
      _tipType = "health";
    } else if (_role.indexOf("主播") >= 0 || _role.indexOf("网红") >= 0 || _role.indexOf("大学生") >= 0) {
      // 科技/消费类情报
      var _techTips = [
        "我听说最近有个新APP很火，做内容创作的人都在用，你可以关注一下相关股票。",
        "短视频平台的带货数据特别好，你有粉丝基础的话可以试试直播。",
        "最近电子产品价格波动大，新机发布前旧款会降价，时机对了可以囤。"
      ];
      _tipMsg = Random.fromArray(_techTips);
      _tipType = "tech";
    } else if (_role.indexOf("厨师") >= 0 || _role.indexOf("菜") >= 0 || _role.indexOf("摊主") >= 0) {
      // 食品/餐饮类情报
      var _foodTips = [
        "最近猪肉价格跌了，趁便宜多买点冻着，过段时间肯定涨回去。",
        "菜价这几天便宜，批发市场进货的好时机。",
        "听说下一批蔬菜供应要紧张，价格会涨，你先囤点。"
      ];
      _tipMsg = Random.fromArray(_foodTips);
      _tipType = "food";
    } else {
      // 通用情报
      var _generalTips = [
        "我听到一个消息，说城东要开发了，那边的房价可能会涨。",
        "最近金价涨得厉害，你可以考虑买点黄金保值。",
        "听说有个新政策要出台，对中小企业有扶持，你可以关注一下。",
        "现在存款利率低，不如买点理财产品，虽然风险大点但收益高。"
      ];
      _tipMsg = Random.fromArray(_generalTips);
      _tipType = "general";
    }

    StateManager.addMessage(
      "💡 " + _provider.name + "（" + _provider.role + "）悄悄告诉你：\n" + _tipMsg + "\n（好感≥60的熟人情报，投资参考）",
      "info"
    );
  }

  // ============================================================
  // 注册到每日tick
  // ============================================================
  // 注册全局函数，供 npc_relationships.js 的 tickNpcRelationships 调用
  if (typeof window !== "undefined") {
    window._checkBirthdayNarrativeR233 = _checkBirthdayNarrativeR233;
    window._applySocialBuffR233 = _applySocialBuffR233;
    window._checkNpcInvestmentTipR233 = _checkNpcInvestmentTipR233;
  }

  // ============================================================
  // RANDOM_EVENTS 注册：D→B NPC生日叙事事件（可选版）
  // ============================================================
  // 注册一个备用事件，供玩家在生日当天手动触发
  RANDOM_EVENTS.push({
    id: "domain_d_birthday_narrative",
    phase: "street",
    icon: "🎂",
    title: "一位朋友的生日",
    story: "你翻开手机日历，发现今天是一位朋友的生日。\\n\\n要不要去拜访她/他？带上一点心意，也许能收获一段难忘的对话。",
    conditions: function (st) {
      // 本事件通过 _checkBirthdayNarrativeR233 自动触发，不通过随机事件池
      return false;
    },
    probability: 0,
    repeatable: false,
    choices: [
      {
        text: "📅 去看看",
        hint: "前往拜访这位过生日的朋友",
        apply: function (st) {
          StateManager.addMessage("📅 你决定去拜访今天的寿星。", "info");
        }
      }
    ]
  });
})();