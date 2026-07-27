/**
 * 域B(事件/叙事) 联动增强 R573
 * 选题：R426 写入的三个叙事 flag 全库零读取（只写不读=玩家选择无后果，叙事断裂）——本轮全部首消费闭环。
 *   B→G  b573_identity_reconcile   首消费 _b426IdentityDoubt（整容后自我认同动摇→和解/沉沦分叉，生命叙事闭环）
 *   B→E  b573_info_literacy_payoff 首消费 _b426GymInvestInsight（场外信息素养→核实习惯变现，投资心态回报）
 *   B→E  b573_fomo_temptation      首消费 _b426GymFomoUrge（FOMO倾向→追高诱惑测试，损失厌恶教学时刻）
 * 全字段 || 防御；conditions 全 false 时事件静默不发火，叙事仍自洽。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR573Loaded) return;
  RANDOM_EVENTS._domainBLinkageR573Loaded = true;

  var EVENTS = [
    // B→G：整容自我认同动摇 → 和解或沉沦（消费 _b426IdentityDoubt，此前零读取）
    {
      id: "b573_identity_reconcile",
      phase: "street",
      _isChainEvent: false,
      icon: "🪞",
      title: "镜子里的人",
      story: "深夜洗漱，你又在镜子前停了很久。整容之后，那种「镜子里的人是不是我」的疑惑一直没有散去。\n\n今晚，你翻出了手术前的旧照片。照片里的人笑得有点拘谨，但眼神是熟悉的。\n\n「变的是脸，还是我自己？」你需要给自己一个答案。",
      triggers: { minDay: 30, excludeFlags: ["_b573IdentityReconciled"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.flags && st.flags._b426IdentityDoubt && !st.flags._b573IdentityReconciled);
      },
      choices: [
        {
          text: "🤝 和过去的自己和解",
          hint: "心智+8，心情+5",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573IdentityReconciled = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🪞 「脸是名片，人是内容。」你把旧照片设成了手机相册的收藏——不是怀念，是承认。那份动摇终于落了地。心智+8，心情+5。", "success");
            }
          },
        },
        {
          text: "😔 继续回避这个问题",
          hint: "心智-3，疑惑仍在",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573IdentityReconciled = true;
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😔 你把旧照片塞回了抽屉深处。有些问题不回答，它就一直在。心智-3。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },

    // B→E：健身房场外信息素养 → 核实习惯的回报（消费 _b426GymInvestInsight，此前零读取）
    {
      id: "b573_info_literacy_payoff",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "核实的习惯",
      story: "健身房里那次听来的「内幕消息」你没有直接跟，而是回家查了公司财报——这个习惯救了你。\n\n今天你又刷到一条被疯转的「暴涨预告」，评论区一片狂热。换作以前你可能已经下单了，但现在你的第一反应是：消息源是谁？动机是什么？\n\n查完之后你发现：这是一场典型的拉高出货。",
      triggers: { minDay: 30, interval: 120, maxRepeats: 2, excludeFlags: ["_b573InfoLiteracyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.flags && st.flags._b426GymInvestInsight && !st.flags._b573InfoLiteracyCooldown);
      },
      choices: [
        {
          text: "📖 把方法记进投资笔记",
          hint: "会计XP+6，投资意识觉醒",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573InfoLiteracyCooldown = true;
            st.flags._dataInvestorMindset = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 「三步核实法：查消息源、查财报、查谁在卖。」你把它写进了投资笔记的第一页。会计XP+6，心智+4。", "success");
            }
          },
        },
        {
          text: "💬 发帖提醒别人别追",
          hint: "社交XP+5，心情+4",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573InfoLiteracyCooldown = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch (e) {} }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💬 你把查证过程整理成帖子发了出去，有人骂你挡财路，也有人私信道谢。社交XP+5，心情+4。", "success");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: true,
    },

    // B→E：FOMO 倾向 → 追高诱惑测试（消费 _b426GymFomoUrge，此前零读取；损失厌恶教学时刻）
    {
      id: "b573_fomo_temptation",
      phase: "street",
      _isChainEvent: false,
      icon: "🔥",
      title: "这次不一样？",
      story: "那种「别人都在赚钱、只有我踏空」的焦灼感又来了。\n\n最近有支票连拉了好几天，群里天天有人晒收益截图。你的手指已经悬在「买入」按钮上——账户里的钱在烧你的手。\n\n理性的声音很小，但还在：「你是想投资，还是只是怕错过？」",
      triggers: { minDay: 45, interval: 150, maxRepeats: 2, excludeFlags: ["_b573FomoCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!(st.flags && st.flags._b426GymFomoUrge && !st.flags._b573FomoCooldown)) return false;
        return ((st.resources && st.resources.cash) || 0) >= 2000;
      },
      choices: [
        {
          text: "🧊 关掉App，明天再说",
          hint: "心智+7，克制成功",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573FomoCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧊 你把手机扣在桌上出门跑了两圈。第二天那支票开始回调——你没躲过所有诱惑，但躲过了这一次。心智+7。", "success");
            }
          },
        },
        {
          text: "🔥 冲了，就买一手",
          hint: "现金-2000，大概率买在山顶",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._b573FomoCooldown = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
            var win = Math.random() < 0.25;
            if (win) {
              if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2600;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
              if (typeof StateManager !== "undefined" && StateManager.addMessage) {
                StateManager.addMessage("🎲 这次居然赚了600块。但你心里清楚：靠运气赚的钱，迟早凭实力亏回去。现金+600。", "info");
              }
            } else {
              if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1300;
              if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 4);
              if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch (e) {} }
              if (typeof StateManager !== "undefined" && StateManager.addMessage) {
                StateManager.addMessage("📉 三天后你割肉离场，亏了700块。这700块买到一个教训：FOMO是市场收割散户的第一镰刀。心智-4，会计XP+4。", "warning");
              }
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: true,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
