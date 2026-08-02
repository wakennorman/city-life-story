/**
 * 域G联动增强 R179 — 核心机制/生命周期 × 跨域桥接
 * [全系统自洽修复] 域G R179: lifecycle → Phase2(H)/职业(C)/NPC(D) 联动
 *
 * 3个新事件：
 *   ① G→H: 十年磨一剑 — 长期生存(365d+)创业解锁叙事
 *   ② G→C: 三十而立 — 年龄里程碑职业觉醒(365d+ XP奖励)
 *   ③ G→D: 患难见真情 — 重大健康危机后NPC深情回应
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (typeof RANDOM_EVENTS === 'undefined' || !RANDOM_EVENTS) return;

  // ===== ① G→H: 十年磨一剑 =====
  // 长期生存(365d+) + 高技能(总技能等级≥200) → 创业叙事解锁
  // 奖励: 创业启动资金减免 + 管理技能XP
  var g_ten_years_grind = {
    id: 'g_ten_years_grind',
    title: '十年磨一剑',
    phase: 'street',
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.player || !st.flags) return false;
      if (st.flags._gTenYearsGrindDone) return false;
      if ((st.player.day || 0) < 365) return false;
      // 总技能等级 ≥ 200（代表长期积累）
      var totalSkill = 0;
      if (st.skills) {
        for (var k in st.skills) {
          if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
            totalSkill += (st.skills[k].level || 0);
          }
        }
      }
      if (totalSkill < 200) return false;
      return true;
    },
    probability: 0.08,
    getStory: function (st) {
      var day = (st.player && st.player.day) || 365;
      return '你已经在这个城市摸爬滚打了整整' + Math.floor(day / 365) + '年。\n\n从当初连租房都找不到的愣头青，到现在闭着眼都能画出城市的地铁图。\n\n你认识的人、走过的路、摔过的跟头——都在你心里结成了一本厚厚的账本。\n\n最近你总在想：是时候做点自己的事了。\n\n那些熬过的夜、学会的技能、攒下的人脉，不该只用来给别人打工。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._gTenYearsGrindDone = true;
      if (choiceId === 'start_business') {
        // H域桥接: 长期生存积累 → 创业启动资金减免标记
        st.flags._longTermStartupDiscount = true;
        st.flags._startupNarrativeReady = true;
        // C域桥接: 管理技能XP奖励
        if (typeof addSkillXp === 'function') {
          addSkillXp('management', 15);
        }
        if (st.player) {
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        }
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('🔥 你决定不再等了。是时候为自己干一场了。管理XP+15，精神+5，心情+8。创业启动金减免已解锁！', 'success');
        }
      } else {
        // 保守路线: 继续积累
        if (st.player) {
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
        }
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('💭 你把这股劲压在心里。时机未到，但快了。精神+3，智力+3。', 'info');
        }
      }
    },
    choices: [
      { text: '🔥 是时候了，干自己的事业', id: 'start_business' },
      { text: '💭 再等等，多攒点底气', id: 'keep_patient' },
    ],
    icons: ['⚔️', '创业'],
  };

  // ===== ② G→C: 三十而立 =====
  // 365天里程碑 → 职业觉醒叙事 + XP奖励
  // 奖励: 根据已积累技能给额外XP + 职业方向提示
  var g_thirty_standing = {
    id: 'g_thirty_standing',
    title: '三十而立',
    phase: 'street',
    repeatable: false,
    priority: 82,
    conditions: function (st) {
      if (!st || !st.player || !st.flags) return false;
      if (st.flags._gThirtyStandingDone) return false;
      // 365天±15天窗口触发
      var day = st.player.day || 0;
      if (day < 350 || day > 380) return false;
      return true;
    },
    probability: 0.15,
    getStory: function (st) {
      var day = (st.player && st.player.day) || 365;
      return '你算了算，来到这里已经快一年了（第' + day + '天）。\n\n古人说三十而立——不是说到三十岁就自然立住了，而是说到了这个年纪，你该知道自己要往哪走了。\n\n你想起刚来时的样子：青涩、莽撞、什么都不懂。\n\n现在的你，至少知道了自己擅长什么、不擅长什么。\n\n这份「自知」，就是这一年的工资之外，最大的收获。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._gThirtyStandingDone = true;
      if (choiceId === 'specialize') {
        // C域桥接: 基于当前最高技能加额外XP
        var bestSkill = null;
        var bestLevel = 0;
        if (st.skills) {
          for (var k in st.skills) {
            if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
              var lvl = (st.skills[k].level || 0);
              if (lvl > bestLevel) {
                bestLevel = lvl;
                bestSkill = k;
              }
            }
          }
        }
        if (bestSkill && typeof addSkillXp === 'function') {
          addSkillXp(bestSkill, 10);
        }
        if (st.player) {
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        }
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          var msg = '🎯 你决定深耕自己的方向。' + (bestSkill ? '核心技能+' : '') + '10XP，精神+5，心情+5。';
          StateManager.addMessage(msg, 'success');
        }
      } else {
        // 广撒网路线
        if (st.player) {
          st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
        }
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('🌊 你决定不给自己设限。多尝试、多体验——年轻就是资本。智力+5，精神+2。', 'info');
        }
      }
    },
    choices: [
      { text: '🎯 选定一个方向深耕', id: 'specialize' },
      { text: '🌊 继续广撒网探索', id: 'explore_wide' },
    ],
    icons: ['🎂', '里程碑'],
  };

  // ===== ③ G→D: 患难见真情 =====
  // 健康危机(health曾<20) + 已恢复(health≥60) + 有好友(好感≥60的NPC)
  // → NPC深情回应，加深关系
  var g_true_friendship = {
    id: 'g_true_friendship',
    title: '患难见真情',
    phase: 'street',
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.player || !st.flags || !st.relationships) return false;
      if (st.flags._gTrueFriendshipDone) return false;
      // 健康曾低于20（标记由 illness.js 或 health 系统写入）
      var hadCrisis = st.flags._hadHealthCrisis || false;
      if (!hadCrisis) return false;
      // 当前健康≥60（已恢复）
      var health = (st.status && st.status.health) || 0;
      if (health < 60) return false;
      // 至少有一个好感≥60的已结识NPC
      var hasCloseFriend = false;
      for (var id in st.relationships) {
        if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= 60) {
          hasCloseFriend = true;
          break;
        }
      }
      if (!hasCloseFriend) return false;
      return true;
    },
    probability: 0.12,
    getStory: function (st) {
      return '你刚从一场大病中缓过来。\n\n那些天躺在床上，烧得迷迷糊糊的时候，手机震了几下——是几个老朋友发来的消息。\n\n"听说你病了，好些了吗？"\n"需要帮忙说一声。"\n"别硬撑，身体要紧。"\n\n你当时没力气回，但现在好了，你想起来——这些人在你最难的时候，没有当没看见。\n\n在这个城市里，这比什么都珍贵。';
    },
    getText: function (st) {
      return this.getStory(st);
    },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._gTrueFriendshipDone = true;
      if (choiceId === 'thank_them') {
        // D域桥接: 提升所有好感≥60 NPC的好感
        var count = 0;
        if (st.relationships) {
          for (var id in st.relationships) {
            if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
            var r = st.relationships[id];
            if (r && r.met && (r.affinity || 0) >= 60) {
              if (typeof applyAffinityChange === 'function') {
                applyAffinityChange(st, id, 8, '患难见真情·大病初愈');
              } else {
                r.affinity = (r.affinity || 0) + 8;
              }
              count++;
            }
          }
        }
        if (st.player) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        }
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('🤝 你给每个关心你的朋友回了消息。' + count + '位好友好感+8，心情+10，精神+5。', 'success');
        }
      } else {
        // 默默记在心里
        if (st.player) {
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        }
        if (st.flags) st.flags._gratitudeUnspoken = true;
        if (typeof StateManager !== 'undefined' && StateManager.addMessage) {
          StateManager.addMessage('🙏 你把这份情谊记在心里。有些感谢，放在心里反而更重。精神+3。', 'info');
        }
      }
    },
    choices: [
      { text: '🤝 一一回复感谢', id: 'thank_them' },
      { text: '🙏 默默记在心里', id: 'silent_gratitude' },
    ],
    icons: ['💚', '友情'],
  };

  // ===== IIFE注入 =====
  RANDOM_EVENTS.push(g_ten_years_grind, g_thirty_standing, g_true_friendship);
})();