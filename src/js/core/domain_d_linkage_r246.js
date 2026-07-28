/**
 * 域D(NPC/社交) 联动增强 R246
 * 背景：域D A类修复 — old_ma(老马)全库零met路径→补first_meet登场事件 + decreaseColleagueRelationship死函数复活。
 *   此外，D域联动方向有显著缺口：
 *   1) D→G NPC关系健康 → 没有事件消费relationships统计数据→人生健康反馈
 *   2) D→A NPC网络价值量化 → 社交资本无叙事化呈现
 *   3) D→C 职业人脉 → NPC推荐工作/晋升零事件覆盖
 * 桥接：
 *   D→G  social_health_dashboard   社交网络概览 → relationships统计→心智+心情,置 _socialNetworkKeeper
 *   D→A  social_capital_insight    社交资本洞察 → 已结识NPC×affinity总和→cash+心智
 *   D→C  npc_career_referral       NPC职业推荐 → 高好感NPC引荐工作机会,addSkillXp("management")
 *
 * 严格照 npc_activation_events.js / domain_c_linkage_r191.js 已验证 IIFE 注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR246Loaded) return;
  RANDOM_EVENTS._domainDLinkageR246Loaded = true;

  // 获取已结识NPC数量
  function getMetNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // 获取总好感度
  function getTotalAffinity(st) {
    if (!st || !st.relationships) return 0;
    var total = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) total += (r.affinity || 0);
    }
    return total;
  }

  // 获取最高好感NPC的id和rel
  function getTopAffinityNpc(st) {
    if (!st || !st.relationships) return null;
    var bestId = null;
    var bestAff = -1;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = id;
      }
    }
    if (!bestId) return null;
    return { id: bestId, rel: st.relationships[bestId] };
  };

  // 获取NPC中文名
  function getNpcCn(id) {
    var names = {
      aunt_wang: "王婶", boss_li: "李工头", sister_zhang: "张姐", old_zhou: "老周",
      xiao_mei: "小美", chef_chen: "陈师傅", worker_lao_li: "老李", auntie_lin: "林阿姨",
      chen_ge: "陈哥", ajie: "阿杰", old_ma: "老马", uncle_chen_bank: "老陈",
      sister_wu: "吴姐", brother_huang: "黄哥"
    };
    return names[id] || id;
  }

  var EVENTS = [
    {
      // D→G: 社交网络概览 — 首次叙事化消费 relationships 统计数据
      id: "social_health_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "你的人际地图",
      story:
        "你数了数自己认识的人——{metCount}个人,总好感度{totalAff}。这座城市很大,但你的朋友圈让你不再孤单。有些人成了知己,有些人只是点头之交,但每个相遇都值得珍惜。",
      triggers: { minDay: 30, excludeFlags: ["_socialHealthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var met = getMetNpcCount(st);
        return met >= 2; // 至少结识2个NPC才触发
      },
      // [全系统自洽修复] 域C R685b A类: renderStory是渲染层从不调用的死接口(events_core R455后只调text())→story中{metCount}{totalAff}占位符原样泄漏给玩家；改为text()动态叙述+无占位符fallback
      text: function (st) {
        try {
          if (st) {
            var met = getMetNpcCount(st);
            var total = getTotalAffinity(st);
            return "你数了数自己认识的人——" + met + "个人,总好感度" + total + "。这座城市很大,但你的朋友圈让你不再孤单。有些人成了知己,有些人只是点头之交,但每个相遇都值得珍惜。";
          }
        } catch (e) { /* fallback */ }
        return "你数了数自己认识的人。这座城市很大,但你的朋友圈让你不再孤单。有些人成了知己,有些人只是点头之交,但每个相遇都值得珍惜。";
      },
      choices: [
        {
          text: "😊 感谢这些相遇",
          hint: "心智+4,心情+4,置 _socialNetworkKeeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._socialNetworkKeeper = true; // G域可消费:持续社交网络
            st.flags._socialHealthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😊 你感谢生命中的每一次相遇——圈子不大,但都是真心实意。心智+4,心情+4。", "success");
          }
        },
        {
          text: "😅 人太多记不住名字",
          hint: "平静面对,心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._socialNetworkKeeper = true;
            st.flags._socialHealthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😅 你觉得自己确实该好好记住这些人的名字。心智+2。", "info");
          }
        }
      ]
    },
    {
      // D→A: 社交资本洞察 — 已结识NPC×affinity总和转化为经济价值
      id: "social_capital_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "人脉就是钱脉",
      story:
        "今天跟{topNpcName}聊天的时候突然悟了——你在城里认识的这些人,不只是感情,更是实实在在的资源。他们知道哪里有好活儿、什么时候该跳槽、甚至能帮你介绍对象。",
      triggers: { minDay: 45, excludeFlags: ["_socialCapitalSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        // 至少有3个已结识NPC,且最高好感≥30
        var top = getTopAffinityNpc(st);
        if (!top || top.rel.affinity < 30) return false; // [PLACEHOLDER]
        return getMetNpcCount(st) >= 3;
      },
      choices: [
        {
          text: "💰 开始经营人脉网络",
          hint: "cash+[PLACEHOLDER],心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._socialCapitalSeen = true;
            var top = getTopAffinityNpc(st);
            var bonus = Math.round(getTotalAffinity(st) * 2 + 200); // [PLACEHOLDER]: 基于总好感×2+基础200
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + bonus;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              var name = getNpcCn(top ? top.id : "王婶");
              StateManager.addMessage("💰 你把人脉当资产来经营,今天收获了¥" + bonus + "的'人情回报'。人脉就是资源!心智+3。", "good");
            }
          }
        },
        {
          text: "🤗 交情不是为了利用",
          hint: "心情+5,心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._socialCapitalSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤗 你觉得朋友归朋友,不能什么都往钱上看。真诚比什么都重要。心情+5。", "info");
          }
        }
      ]
    },
    {
      // D→C: NPC职业推荐 — 高好感NPC引荐工作/晋升机会
      id: "npc_career_referral",
      phase: "street",
      _isChainEvent: false,
      icon: "📞",
      title: "熟人介绍的好活儿",
      story:
        "{topNpcName}给你打了个电话:「有个活儿,正缺人手,你先顶上。」有熟人引荐的机会,总觉得比海投简历靠谱多了。",
      triggers: { minDay: 30, excludeFlags: ["_npcReferralSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var top = getTopAffinityNpc(st);
        return !!top && top.rel.affinity >= 50; // [PLACEHOLDER]: 最高好感≥50才触发高级推荐
      },
      choices: [
        {
          text: "👍 马上联系那边",
          hint: "管理技能XP+8,cash+300,置 _npcReferralActive",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._npcReferralSeen = true;
            st.flags._npcReferralActive = true; // C域可消费:熟人推荐工作加成
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 8); } catch(e) { /* safe */ }
            }
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300; // [PLACEHOLDER]
            var top = getTopAffinityNpc(st);
            var name = getNpcCn(top ? top.id : "");
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👍 " + name + "的介绍真管用！管理技能+8,收到介绍费¥300。", "success");
          }
        },
        {
          text: "🙏 先谢谢,回头再说",
          hint: "人脉维持,心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._npcReferralSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            var top = getTopAffinityNpc(st);
            var name = getNpcCn(top ? top.id : "");
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🙏 你婉拒了" + name + "的提议,但保持了良好关系。心智+2。", "info");
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
