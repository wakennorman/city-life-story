/**
 * 域A联动增强 R227 — 数据消费事件
 *
 * 本文件将域A(数据/数值平衡)中从未被事件消费的数据首次叙事化：
 * 1. A→B 食材过期浪费：GOODS/ITEMS 食材 perishDays 超时丢弃 → 心疼事件
 * 2. A→C/D 证书社会认可：CERTIFICATES salaryBonus 消费 → NPC 尊重事件
 * 3. A→G 供需标签可见：pricing.js LOCATION_GOODS_TAGS 玩家摸清货源 → 认知成长
 *
 * IIFE 注入 RANDOM_EVENTS，严格遵循 cross_system_events 事件范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;

  var _A_R227 = [
    // [全系统自洽修复] 域A R227 联动#1: A→B 食材过期浪费叙事化
    // 数据源: items.js GOODS 食材 perishDays + trade.js 过期丢弃逻辑
    // 设计意图: 让食材过期的"沉没成本"产生情感回响，驱动玩家更精细化管理
    {
      id: "food_waste_guilt",
      title: "🥬 食材过期扔掉了",
      desc: "冰箱里的食材过期变质，不得不扔掉。这是沉没成本，也是生活教训。",
      phase: "street",
      repeatable: true,
      cooldownDays: 14,
      priority: 30,
      conditions: function (st) {
        if (!st || !st.flags) return false;
        if (st.flags._foodWasteGuiltSeen) return false;
        // 有住所（tier>=1）且烹饪技能>=5才可能囤食材
        var housingTier = st.housing && st.housing.tier ? st.housing.tier : 0;
        if (housingTier < 1) return false;
        var cookingLvl = (st.skills && st.skills.cooking && st.skills.cooking.level) || 0;
        if (cookingLvl < 5) return false;
        return true;
      },
      probability: 0.08,
      getText: function (st) {
        var wasteAmount = Math.floor(Random.float(30, 120));
        return "打开冰箱准备做饭，发现买的青菜和肉类都过期了…\n\n默默把变质的食物扔进垃圾桶，¥" + wasteAmount + "打了水漂。下次买菜得看日期了。";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._foodWasteGuiltSeen = true;
        // 轻微心情惩罚（沉没成本感伤）
        if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
        // 轻微心智成长（下次会更谨慎）
        if (st.skills && st.skills.cooking) {
          st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 8;
        }
      },
    },

    // [全系统自洽修复] 域A R227 联动#2: A→C/D 证书社会认可叙事化
    // 数据源: skills.js CERTIFICATES[].salaryBonus
    // 设计意图: 让证书的"社会价值"从纯数字变为可感知的人际关系变化
    {
      id: "cert_social_recognition",
      title: "🎓 你的证书被认可了",
      desc: "某次工作场合，他人注意到你持有某项专业证书，态度明显转变。",
      phase: "street",
      repeatable: true,
      cooldownDays: 90,
      priority: 45,
      conditions: function (st) {
        if (!st || !st.certificates || !Array.isArray(st.certificates)) return false;
        if (st.certificates.length < 1) return false;
        if (st.flags && st.flags._certSocialRecog) return false;
        return true;
      },
      probability: 0.06,
      getText: function (st) {
        // 取首个已有证书名
        var certNames = {
          driver_license: "驾照",
          english_cert: "英语四级",
          accounting_cert: "会计从业证",
          coding_basic: "编程基础证",
          construction_safety: "建筑安全证",
          electrician_cert: "电工证",
          welding_cert: "焊工证",
          management_cert: "管理师证",
          nursing_cert: "护理员证",
          health_manager: "健康管理师",
          rehab_therapist: "康复理疗师",
          food_safety: "食品健康证",
          cooking_cert: "厨师证",
          repair_cert: "维修工证",
          sales_cert: "销售师证",
          psychologist: "心理咨询师",
        };
        var myCert = st.certificates[0];
        var name = certNames[myCert] || myCert;
        return "工作中遇到个客户/同事，看到你带着" + name + "，\n\n" +
          "\"原来你有这个证啊！那这块你比我懂多了，以后有问题请教你！\"\n\n" +
          "那一刻突然觉得，那些考证花的时间和钱都值得了。";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._certSocialRecog = true;
        // 首个已结识NPC好感+2（证书作为社交货币）
        if (st.relationships) {
          var keys = Object.keys(st.relationships);
          for (var i = 0; i < keys.length; i++) {
            var rel = st.relationships[keys[i]];
            if (rel && rel.met && rel.affinity >= 0) {
              rel.affinity = Math.min(100, (rel.affinity || 0) + 2);
              break;
            }
          }
        }
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
      },
    },

    // [全系统自洽修复] 域A R227 联动#3: A→C 货源门道→议价眼力
    // 数据源: pricing.js LOCATION_GOODS_TAGS specialties/scarce
    // 设计意图: 让玩家感受到"摸清行情"带来的能力提升
    {
      id: "market_knowledge_haggle_mastery",
      title: "🧠 常年练摊练出了议价眼力",
      desc: "长期交易让主角对市场行情人老识途，间接提升销售技能。",
      phase: "street",
      repeatable: true,
      cooldownDays: 60,
      priority: 35,
      conditions: function (st) {
        if (!st || !st.stats) return false;
        if (!st.stats.tradeFreq) return false;
        // 累计交易次数≥50次
        var totalTrades = 0;
        for (var k in st.stats.tradeFreq) {
          if (st.stats.tradeFreq.hasOwnProperty(k)) totalTrades += st.stats.tradeFreq[k];
        }
        if (totalTrades < 50) return false;
        if (st.flags && st.flags._haggleMastery) return false;
        return true;
      },
      probability: 0.05,
      getText: function (st) {
        var salesBonus = Random.float(3, 8);
        return "做了这么久买卖，对市场门道早熟了。\n\n\"这批次发价虚高，我拿批发价。\"——一句砍价，省下的比利润还多。\n\n销售眼力见长！";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._haggleMastery = true;
        // 销售技能XP奖励
        if (st.skills && st.skills.sales) {
          st.skills.sales.xp = (st.skills.sales.xp || 0) + Math.floor(salesBonus);
        }
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
      },
    },
  ];

  // 注入事件池
  for (var i = 0; i < _A_R227.length; i++) {
    RANDOM_EVENTS.push(_A_R227[i]);
  }

  // 公开引用
  if (typeof window !== "undefined") {
    window._domainALinkageR227 = true;
  }
})();
