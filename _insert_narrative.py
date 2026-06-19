# -*- coding: utf-8 -*-
events_js_path = "D:/Claude Code+DeepSeekV4/city-life-story/src/js/core/events.js"

events_code = """

  // ============================================================
  // 七、叙事模板事件（6个新增模板）
  // ============================================================

  {
    id: "last_baton",
    phase: "street",
    icon: "\U0001f3b5",
    title: "最后一棒",
    story: "这条街上掀起了一股「网红脆皮五花肉」的热潮——第一家店门口排了30米长队，一天流水¥8000。第二家店在对面开张，生意也还行。第三家、第四家……现在这条街上有8家脆皮五花肉。第一家店的老板已经开始贴转让广告了。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 30 && !st.flags._lastBatonSeen;
    },
    choices: [
      { text: "\U0001f9c0 趁现在还赚钱——开一家", hint: "¥5000投入，可能血本无归", apply: function(st) {
        st.flags._lastBatonSeen = true;
        if (st.resources.cash >= 5000) {
          st.resources.cash -= 5000;
          st.flags._lastBatonStarted = true;
          st.flags._lastBatonDay = st.player.day;
          var luck = Math.random();
          if (luck < 0.25) {
            // 早期入场赚钱
            st.flags._lastBatonEarly = true;
            st.resources.cash += 12000;
            StateManager.addMessage("\U0001f9c0 你开张了！前两周生意火爆——赚了¥12000。但看着满街的模仿者，你知道该收手了。", "event");
          } else if (luck < 0.6) {
            // 不赚不亏
            st.resources.cash += 2000;
            StateManager.addMessage("\U0001f9c0 生意一般般。赚了一点但不多——风口来得快去得也快。", "info");
          } else {
            // 亏了
            StateManager.addMessage("\U0001f9c0 你开业太晚了。整条街都在打折甩卖——你的投资打了水漂。", "warning");
          }
        } else {
          StateManager.addMessage("\U0001f9c0 连启动资金都不够。你在门口看了一会儿——生意确实好，但好得不正常。", "info");
        }
      }},
      { text: "\U0001f4b2 给第一家店供货——赚快钱", hint: "¥2000进货卖给网红店", apply: function(st) {
        st.flags._lastBatonSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.resources.cash += 3500;
          StateManager.addMessage("\U0001f4b2 你给网红店供了三天货。赚了¥1500——虽然不多但稳。", "success");
        } else {
          StateManager.addMessage("\U0001f4b2 想供货连本钱都没有。风口就在眼前但你上不了车。", "info");
        }
      }},
      { text: "\U0001f914 观察——什么都不做", hint: "等待泡沫破裂", apply: function(st) {
        st.flags._lastBatonSeen = true;
        st.flags._lastBatonWise = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
        StateManager.addMessage("\U0001f914 你看着这条街从一个风口变成了一场闹剧。三个月后，8家店关了6家。你学到了：当所有人都觉得稳赚不赔的时候，就是该离场的时候。", "success");
      }},
    ],
  },

  {
    id: "sunk_cost_trap",
    phase: "street",
    icon: "\U0001f3b0",
    title: "沉没成本",
    story: "你之前投了一笔生意——现在回头看全是坑。¥50万砸进去了，项目半死不活。合伙人的电话来了：「再投¥10万就能撑到下一轮融资——已经走到这一步了，放弃太可惜。」你握着手机，手心全是汗。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 60 && !st.flags._sunkCostSeen && st.resources.cash >= 50000;
    },
    choices: [
      { text: "\U0001f4b0 追加投资——已经走到这一步了", hint: "投¥10万，50%可能翻盘，50%全亏", apply: function(st) {
        st.flags._sunkCostSeen = true;
        if (st.resources.cash >= 100000) {
          st.resources.cash -= 100000;
          st.flags._sunkCostAdded = true;
          var luck = Math.random();
          if (luck < 0.45) {
            st.resources.cash += 300000;
            StateManager.addMessage("\U0001f4b0 赌对了！项目被大厂收购——你拿回¥30万。但你知道这概率跟抛硬币差不多。", "event");
          } else {
            StateManager.addMessage("\U0001f4b0 又赔了。合伙人已经联系不上了。你坐在出租屋里算了一下——在这项目上总共亏了¥15万。", "danger");
          }
        } else {
          StateManager.addMessage("\U0001f4b0 想追加但钱不够。也许是好事——有人替你做了止损的决定。", "info");
        }
      }},
      { text: "✋ 止损——不投了", hint: "亏了就亏了，认了", apply: function(st) {
        st.flags._sunkCostSeen = true;
        st.flags._sunkCostStopped = true;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        StateManager.addMessage("✋ 你说了「不」。合伙人在电话里骂了你。但你挂了电话之后，心里反而轻松了。你想起一句听过的话：沉没成本不是成本。", "success");
      }},
      { text: "\U0001f91d 找其他投资人接盘——自己脱身", hint: "需要人脉，名声≥30才有可能", apply: function(st) {
        st.flags._sunkCostSeen = true;
        if ((st.player.fame || 0) >= 30) {
          st.flags._sunkCostBailed = true;
          st.resources.cash -= 5000;
          StateManager.addMessage("\U0001f91d 你通过关系找到了接盘侠。亏了¥5万的中介费——但比全亏好一万倍。", "event");
        } else {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
          StateManager.addMessage("\U0001f91d 你联系了所有认识的人。没人愿意接——你名声不够，别人不信你。", "warning");
        }
      }},
    ],
  },

  {
    id: "siege_reversal",
    phase: "corporate",
    icon: "\U0001f3f0",
    title: "围城反转",
    story: "你终于拿到了辰光网络的offer——P8，年薪¥80万，独立办公室，配MacBook Pro和一台显示器。入职第一天，你发现旁边工位的同事在收拾东西：「公司第三季度要裁20%，你不知道？」HR的微笑很专业：「组织架构优化，正常调整。」",
    conditions: function(st) {
      return st.player.phase === "corporate" && st.player.day >= 80 && !st.flags._siegeReversalSeen;
    },
    choices: [
      { text: "\U0001f50d 低调观察——谁是安全的谁是危险的", hint: "智力+3，收集信息", apply: function(st) {
        st.flags._siegeReversalSeen = true;
        st.flags._siegeObserved = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
        StateManager.addMessage("\U0001f50d 你花了两周搞清楚了公司的权力格局。核心业务线稳如老狗，边缘部门人人自危。幸好你被分配到了核心组。", "event");
      }},
      { text: "\U0001f4e2 找领导表忠心——展示价值", hint: "降低被裁概率，但代价是开始卷", apply: function(st) {
        st.flags._siegeReversalSeen = true;
        st.flags._siegeKpiMode = true;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
        StateManager.addMessage("\U0001f4e2 你主动接了一个别人不想做的项目。领导很满意。但你每天加班到11点——这就是「福报」吗？", "info");
      }},
      { text: "\U0001f468‍\U0001f4bb 更新简历开始面试", hint: "骑驴找马最安全", apply: function(st) {
        st.flags._siegeReversalSeen = true;
        st.flags._siegeJobHunting = true;
        StateManager.addMessage("\U0001f468‍\U0001f4bb 你偷偷更新了简历。外面的机会确实不少——但待遇都比这里差。你在想到底什么才是对的。", "info");
      }},
    ],
  },

  {
    id: "short_self",
    phase: "corporate",
    icon: "\U0001f4c9",
    title: "做空自己公司",
    story: "作为辰光网络的P8员工，你看到了Q3的内部数据——新增用户连续三个月下滑，最大客户合同到期没续签，CFO上周悄悄减持了股票。你知道公司股价三个月内必跌。一个念头冒了出来：做空自己公司。",
    conditions: function(st) {
      return st.player.phase === "corporate" && st.player.day >= 100 && !st.flags._shortSelfSeen && (st.flags._siegeReversalSeen || st.flags._siegeObserved);
    },
    choices: [
      { text: "\U0001f4b0 做空公司股票——这是理性的", hint: "¥50000保证金，合法但职业风险极高", apply: function(st) {
        st.flags._shortSelfSeen = true;
        if (st.resources.cash >= 50000) {
          st.resources.cash -= 50000;
          st.flags._shortedOwnCompany = true;
          st.flags._shortDay = st.player.day;
          // 30天后结算
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "short_self_settle", 30, "corporate");
          }
          StateManager.addMessage("\U0001f4b0 你建立了做空仓位。每天上班看着同事们认真工作的样子——你觉得有点分裂。", "event");
        } else {
          StateManager.addMessage("\U0001f4b0 做空需要¥50000保证金。你连做空自己的资本都没有。", "info");
        }
      }},
      { text: "⚠️ 跟合规部报告——有人可能利用内幕信息", hint: "举报别人，保护自己", apply: function(st) {
        st.flags._shortSelfSeen = true;
        st.flags._shortReported = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
        StateManager.addMessage("⚠️ 你匿名向合规部报告了CFO的减持行为。当然——你没说自己也有做空的念头。", "event");
      }},
      { text: "\U0001f4dd 记录下所有数据——但不交易", hint: "保留证据，留待后用", apply: function(st) {
        st.flags._shortSelfSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
        StateManager.addMessage("\U0001f4dd 你默默把关键数据截了图。不是为了交易——是为了某天万一被裁了，有谈判的筹码。", "info");
      }},
    ],
  },

  {
    id: "gray_to_legit",
    phase: "street",
    icon: "\U0001f4c4",
    title: "灰色地带合法化",
    story: "以前你靠倒卖发票和刷单赚了第一桶金——那时候大家都在干，没人管。但现在行业正规化了——政府出台了监管办法，发了牌照。当年那些灰色技能突然变成了「合规经验」。以前的「污点」现在成了「先发优势」。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 90 && !st.flags._grayToLegitSeen && (st.flags._grayJoined || st.flags._grayRefused);
    },
    choices: [
      { text: "\U0001f4bc 申请正规牌照——把经验变成优势", hint: "花¥20000办牌照，合法经营", apply: function(st) {
        st.flags._grayToLegitSeen = true;
        if (st.resources.cash >= 20000) {
          st.resources.cash -= 20000;
          st.flags._grayLegitBiz = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          StateManager.addMessage("\U0001f4bc 你拿到了牌照。以前偷偷摸摸做的事现在光明正大。以前的同行说你是叛徒——但你觉得他们在嫉妒。", "event");
        } else {
          StateManager.addMessage("\U0001f4bc 连办牌照的钱都不够。你知道这是个机会——但机会需要钱。", "info");
        }
      }},
      { text: "\U0001f3e0 低调退出——钱已经赚够了", hint: "功成身退", apply: function(st) {
        st.flags._grayToLegitSeen = true;
        st.flags._grayRetired = true;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        StateManager.addMessage("\U0001f3e0 你清空了所有灰色收入的历史记录。虽然以前的路不正——但你出来了。这就够了。", "event");
      }},
      { text: "\U0001f464 帮以前同行的朋友也转正", hint: "名声+5，但费时费力", apply: function(st) {
        st.flags._grayToLegitSeen = true;
        st.flags._grayHelpedOthers = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
        StateManager.addMessage("\U0001f464 你帮三个以前的朋友办了正规手续。他们请你吃了顿饭——第一次干干净净地吃饭。", "success");
      }},
    ],
  },

  {
    id: "class_rollback",
    phase: "street",
    icon: "\U0001f4a8",
    title: "从天而降",
    story: "你中了彩票——或者拆迁款到账了——或者买的币突然翻了100倍。反正你一夜之间有了¥200万。你搬进了高档公寓，请工友吃了¥5000一顿的饭，给老家打了¥20万。然后……三个月后，钱花了一半。而且没有新的收入来源。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 50 && !st.flags._classRollbackSeen && (st.flags._demolitionGambled || st.flags._cryptoBought || st.resources.cash >= 50000);
    },
    choices: [
      { text: "\U0001f3e6 买房——把现金变成资产", hint: "花¥150万买房，月供¥5000", apply: function(st) {
        st.flags._classRollbackSeen = true;
        st.flags._rollbackBoughtHouse = true;
        st.resources.cash -= 1500000;
        var oldTier = st.housing && st.housing.tier ? st.housing.tier : 0;
        if (typeof st.housing !== 'undefined' && st.housing !== null) {
          st.housing.tier = Math.max(st.housing.tier || 0, 5);
        }
        if (typeof scheduleChainEvent === "function") {
          scheduleChainEvent(st, "rollback_aftermath", 60, "street");
        }
        StateManager.addMessage("\U0001f3e6 你买了房——市中心两居室。月供¥5000。你知道这不叫「财富自由」——这叫「换了种活法」。", "event");
      }},
      { text: "\U0001f4b0 存银行吃利息——稳健", hint: "¥200万存大额存单，年息3.5%", apply: function(st) {
        st.flags._classRollbackSeen = true;
        st.flags._rollbackSaved = true;
        st.resources.cash -= 2000000;
        st.flags._rollbackPrincipal = 2000000;
        st.flags._rollbackDay = st.player.day;
        if (typeof scheduleChainEvent === "function") {
          scheduleChainEvent(st, "rollback_interest_life", 30, "street");
        }
        StateManager.addMessage("\U0001f4b0 你存了¥200万大额存单。每个月利息¥5800——比打工强。但你知道物价在涨，这个利息会越来越不值钱。", "event");
      }},
      { text: "\U0001f3e4 投资自己——学技能开公司", hint: "花¥50万学技能+注册公司", apply: function(st) {
        st.flags._classRollbackSeen = true;
        st.flags._rollbackStartedBiz = true;
        st.resources.cash -= 500000;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 10);
        if (typeof scheduleChainEvent === "function") {
          scheduleChainEvent(st, "rollback_biz_outcome", 45, "street");
        }
        StateManager.addMessage("\U0001f3e4 你报了MBA班，注册了一家小公司。有人笑你：「暴发户想当企业家。」你没理他们。", "event");
      }},
      { text: "\U0001f37b 继续高消费——钱花了再赚", hint: "爽一时，但钱会花完", apply: function(st) {
        st.flags._classRollbackSeen = true;
        st.flags._rollbackBurned = true;
        st.resources.cash -= 50000;
        st.needs.happiness = Math.min(100, st.needs.happiness + 25);
        if (typeof scheduleChainEvent === "function") {
          scheduleChainEvent(st, "rollback_penniless", 30, "street");
        }
        StateManager.addMessage("\U0001f37b 你租了一辆奔驰，请全城的朋友喝了三天酒。卡里少了¥50000——但这是你这辈子最快乐的72小时。", "event");
      }},
    ],
  },

"""

with open(events_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Insert before closing ]; of RANDOM_EVENTS
# After Part 3, the end looks like: "  },\n];\n\n/* ===== ... */"
old_marker = "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"

# Remove the trailing "}," from events_code's last event and we'll use the marker's
events_code_trimmed = events_code.rstrip()
# Make sure no trailing comma causes issues
new_marker = events_code_trimmed + "\n  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"

if old_marker in content:
    content = content.replace(old_marker, new_marker)
    with open(events_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Narrative template events inserted!")
else:
    print("ERROR: old_marker not found!")
    idx = content.find("二、事件触发与队列管理")
    if idx >= 0:
        print("Found at byte", idx)
        print("Context:", repr(content[idx-200:idx+20]))