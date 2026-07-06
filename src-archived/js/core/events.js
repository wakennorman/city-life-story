/**
 * 事件引擎 — 随机事件判定、新闻应用、过期清理
 */

/** 每日判定是否触发新闻 */
function rollDailyNews(state) {
  // 25%基础概率，已激活新闻时降低概率
  const chance = state.activeNews.length > 0 ? 0.12 : 0.25;
  if (Random.chance(chance)) {
    const news = getRandomNewsEvent();
    if (news && !state.flags.seenNewsToday.includes(news.id)) {
      news._appliedDay = state.player.day;
      state.activeNews.push(news);
      state.flags.seenNewsToday.push(news.id);
      applyNewsEffect(news, state);
      StateManager.addMessage(`📰 ${news.headline}`, "event");
    }
  }
  // 清理今日已见新闻列表（保留最近3天）
  if (state.player.day % 3 === 0) {
    state.flags.seenNewsToday = [];
  }
}

/** 职场随机事件 */
function rollCorporateEvent(state) {
  const events = [
    {
      cond: () => state.player.corporate.risk > 60,
      text: "⚠️ 线上事故！技术债爆发，KPI和尊严受损",
      apply: (st) => {
        st.player.corporate.kpi = Math.max(0, st.player.corporate.kpi - 20);
        st.player.corporate.dignity = Math.max(
          0,
          st.player.corporate.dignity - 15,
        );
        st.player.corporate.risk = Math.max(0, st.player.corporate.risk - 30);
      },
    },
    {
      cond: () => state.player.corporate.popularity > 70,
      text: "🎉 同事帮你分担了一部分工作，KPI意外提升",
      apply: (st) => {
        st.player.corporate.kpi = Math.min(150, st.player.corporate.kpi + 15);
        st.player.corporate.popularity = Math.min(
          100,
          st.player.corporate.popularity + 5,
        );
      },
    },
    {
      cond: () => state.player.corporate.ability > 70,
      text: "🏆 你的技术方案被CTO点赞！向上管理大幅提升",
      apply: (st) => {
        st.player.corporate.upwardMgmt = Math.min(
          100,
          st.player.corporate.upwardMgmt + 15,
        );
        st.player.corporate.ability = Math.min(
          100,
          st.player.corporate.ability + 3,
        );
      },
    },
    {
      cond: () => true,
      text: "🔄 公司组织架构调整，人心惶惶",
      apply: (st) => {
        st.player.corporate.popularity = Math.max(
          0,
          st.player.corporate.popularity - 5,
        );
        st.player.corporate.dignity = Math.max(
          0,
          st.player.corporate.dignity - 5,
        );
      },
    },
    {
      cond: () => state.player.corporate.hair < 40,
      text: "🩺 体检报告出来，医生建议减少加班",
      apply: (st) => {
        st.player.corporate.dignity = Math.max(
          0,
          st.player.corporate.dignity - 10,
        );
      },
    },
    {
      cond: () => state.corporate.team.length >= 3,
      text: "👥 下属提出离职，需要挽留还是放人？",
      apply: (st) => {
        const idx = Random.int(0, st.corporate.team.length - 1);
        const member = st.corporate.team[idx];
        if (member && Random.chance(0.3)) {
          st.corporate.team.splice(idx, 1);
          StateManager.addMessage(
            `👋 ${member.name} 离职了。团队少了一人。`,
            "warning",
          );
        }
      },
    },
  ];

  const eligible = events.filter((e) => e.cond());
  if (eligible.length > 0 && Random.chance(0.25)) {
    const evt = Random.fromArray(eligible);
    evt.apply(state);
    StateManager.addMessage(evt.text, "event");
  }
}

/** 每日结束时的清理 */
function dailyCleanup(state) {
  cleanupExpiredNews(state);
}

/** 季度结束时的职场清理 */
function quarterlyCleanup(state) {
  // 职场新闻清理（通过rollCorporateEvent）
}
