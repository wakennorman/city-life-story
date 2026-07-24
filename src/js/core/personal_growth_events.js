/**
 * 个人成长事件 — 接入 state.personalGrowth 子系统
 *
 * 设计意图：state.js 中的 personalGrowth { hobbies, health, image, goals, learning }
 * 字段目前**没有任何随机事件读取或写入**。个人成长的叙事弧线——健康危机、
 * 心理崩溃、形象崩塌、目标deadline——全部缺失。
 *
 * 本文件用 5 个事件填补：
 *   1. pg_health_crisis     — 突发健康问题（基础health低触发）
 *   2. pg_burnout_warning   — 心理崩溃预警（stress/anxiety/depression高）
 *   3. pg_image_crisis      — 形象崩塌时刻（形象低触发）
 *   4. pg_goal_deadline     — 人生目标deadline逼近
 *   5. pg_hobby_breakthrough — 爱好练习突破（长期投入回报）
 *
 * 接入方式：与 cross_system_events.js 相同的 IIFE 注入模式
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._personalGrowthEventsLoaded) return;
  RANDOM_EVENTS._personalGrowthEventsLoaded = true;

  var PG_EVENTS = [
    // ===== 事件1：突发健康问题=====
    // 联动：personalGrowth.health.physical + 疾病 + 现金
    {
      id: "pg_health_crisis",
      phase: "street",
      icon: "🏥",
      title: "医院急诊室",
      story:
        "你蹲下去捡掉在地上的水杯，再站起来时眼前一黑，直直往后倒去。\\n\\n醒来时你已经躺在医院急诊室里，护士说你是低血糖加严重疲劳送来的。\\n\\n医生看了你的报告：「你这身体，再这么熬下去会出大事。住院观察三天，费用¥2800。」",
      // [conditions→triggers]
      triggers: {
        minDay: 40,
        excludeFlags: ["_healthCrisisSeen"],
      },
      // [全系统自洽修复] 域B 修复: personalGrowth.health.physical 是对象{score,lastCheckup}而非数字，原代码 object<50 恒为false → 事件永不触发
      conditions: function (st) {
        var phys =
          st.personalGrowth && st.personalGrowth.health
            ? st.personalGrowth.health.physical
            : null;
        var healthVal =
          phys && typeof phys === "object" ? phys.score : phys || 80;
        return healthVal < 50 && Random.chance(0.02);
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🏥 住院三天观察",
          hint: "¥2800，健康+25",
          apply: function (st) {
            st.flags._healthCrisisSeen = true;
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(2800, st.resources.cash || 0);
            st.resources.cash -= cost;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.health) st.personalGrowth.health = {};
            st.personalGrowth.health.physical = Math.min(
              100,
              (typeof st.personalGrowth.health.physical === "object"
                ? st.personalGrowth.health.physical.score || 30
                : st.personalGrowth.health.physical || 30) + 25,
            );
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🏥 你住院三天，医生说你幸亏送来得及时。出了院看着账单¥" +
                cost +
                "，心里五味杂陈。健康+25，疲劳-30。身体是革命的本钱。",
              "warning",
            );
          },
        },
        {
          text: "🚪 办完手续就出院",
          hint: "省钱但健康改善有限",
          apply: function (st) {
            st.flags._healthCrisisSeen = true;
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(500, st.resources.cash || 0);
            st.resources.cash -= cost;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.health) st.personalGrowth.health = {};
            st.personalGrowth.health.physical = Math.min(
              100,
              (typeof st.personalGrowth.health.physical === "object"
                ? st.personalGrowth.health.physical.score || 30
                : st.personalGrowth.health.physical || 30) + 8,
            );
            StateManager.addMessage(
              "🚪 你当天办了手续出院。医生劝你至少观察一天，你没听。健康+8。有些便宜以后要加倍还。",
              "warning",
            );
          },
        },
        {
          text: "🏃 出院后开始认真运动",
          hint: "需要决心，长期受益",
          apply: function (st) {
            st.flags._healthCrisisSeen = true;
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(500, st.resources.cash || 0);
            st.resources.cash -= cost;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.health) st.personalGrowth.health = {};
            st.personalGrowth.health.physical = Math.min(
              100,
              (typeof st.personalGrowth.health.physical === "object"
                ? st.personalGrowth.health.physical.score || 30
                : st.personalGrowth.health.physical || 30) + 15,
            );
            if (!st.personalGrowth.hobbies) st.personalGrowth.hobbies = {};
            if (!st.personalGrowth.hobbies.running)
              st.personalGrowth.hobbies.running = { level: 1, exp: 0 };
            st.flags._startedExercise = true;
            st.player.physique = Math.min(100, (st.player.physique || 50) + 2);
            StateManager.addMessage(
              "🏃 出院那天你在医院门口发了誓：「再也不这样了。」第二天开始跑步。健康+15，体质+2。身体不是铁打的，得养。",
              "success",
            );
          },
        },
      ],
    },

    // ===== 事件2：心理崩溃预警=====
    // 联动：personalGrowth.psychology + 心情 + 睡眠
    {
      id: "pg_burnout_warning",
      phase: "street",
      icon: "😶‍🌫️",
      title: "凌晨三点的天花板",
      story:
        "你睁着眼睛盯着天花板。这是今晚第三次爬起来数羊了。\\n\\n手机屏幕上是凌晨3:14。窗外黑漆漆的，你脑子里却在过今天——不，是这一周、这一个月的所有事：房租、工作、家人的电话、还不完的债。\\n\\n胸口像压了块石头。你不确定自己还能撑多久。",
      // [全系统自洽修复] 域B 修复: ①原路径 psychology 不存在(应为 health.mental) ②原阈值 stress>=75 等在 gameplay 中几乎不可达 → 事件永不触发。改为读取 health.mental + 心情/疲劳双维度兜底
      conditions: function (st) {
        if (!st.housing || st.housing.tier < 1) return false; // [Layer3]
        if (!st.career || !st.career.currentJob) return false; // [Layer3]
        var mental =
          st.personalGrowth && st.personalGrowth.health
            ? st.personalGrowth.health.mental
            : null;
        var stressVal = mental ? mental.stress || 0 : 0;
        var anxietyVal = mental ? mental.anxiety || 0 : 0;
        var lowHappy = (st.needs && st.needs.happiness) || 50;
        var highFatigue = (st.needs && st.needs.fatigue) || 0;
        return (
          st.player.day >= 30 &&
          (stressVal >= 60 ||
            anxietyVal >= 55 ||
            lowHappy < 25 ||
            highFatigue >= 80) &&
          !st.flags._burnoutSeen &&
          Random.chance(0.04)
        );
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📱 给心理医生打电话",
          hint: "¥500，专业疏导",
          apply: function (st) {
            st.flags._burnoutSeen = true;
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(500, st.resources.cash || 0);
            st.resources.cash -= cost;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.health) st.personalGrowth.health = {};
            if (!st.personalGrowth.health.mental)
              st.personalGrowth.health.mental = {
                score: 50,
                stress: 0,
                anxiety: 0,
                depression: 0,
                lastTherapy: 0,
              };
            var psy = st.personalGrowth.health.mental;
            psy.stress = Math.max(0, (psy.stress || 0) - 25);
            psy.anxiety = Math.max(0, (psy.anxiety || 0) - 20);
            psy.depression = Math.max(0, (psy.depression || 0) - 15);
            psy.score = Math.min(100, (psy.score || 50) + 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            StateManager.addMessage(
              "📱 医生听你说了半小时。他说：「你不是一个人在战斗。」挂了电话后你哭了一会儿，然后睡了久违的觉。压力-25，焦虑-20，抑郁-15。",
              "success",
            );
          },
        },
        {
          text: "🌅 天一亮就出门跑步",
          hint: "运动释放压力",
          apply: function (st) {
            st.flags._burnoutSeen = true;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.health) st.personalGrowth.health = {};
            if (!st.personalGrowth.health.mental)
              st.personalGrowth.health.mental = {
                score: 50,
                stress: 0,
                anxiety: 0,
                depression: 0,
                lastTherapy: 0,
              };
            var psy = st.personalGrowth.health.mental;
            psy.stress = Math.max(0, (psy.stress || 0) - 15);
            psy.anxiety = Math.max(0, (psy.anxiety || 0) - 10);
            psy.score = Math.min(100, (psy.score || 50) + 8);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "🌅 你在公园跑了五公里，出了一身汗。回来路上买了个煎饼果子。压力-15，焦虑-10。有时候运动比什么都管用。",
              "info",
            );
          },
        },
        {
          text: "😴 继续躺着，明天再说",
          hint: "短期无改善",
          apply: function (st) {
            st.flags._burnoutSeen = true;
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "😴 你翻了个身，继续盯着天花板。时间慢慢过去，天亮了。问题没有消失，只是被推迟了。心情-5。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件3：形象崩塌时刻=====
    // 联动：personalGrowth.image + 魅力 + 面试/社交
    {
      id: "pg_image_crisis",
      phase: "street",
      icon: "🪞",
      title: "镜子前的自己",
      story:
        "你面试回来站在镜子前。头发油腻腻地贴在额头上，衬衫皱了皱，领口还有一点没擦干净的咖啡渍。\\n\\n你不确定自己是不是变丑了。不，应该说——你确定自己已经很久没认真打扮过了。\\n\\n手机相册里翻到半年前的照片，你都不认识那个人了。",
      // [全系统自洽修复] 域B 修复: personalGrowth.image 实际字段为{style,skincare,fitness,plastic}，原代码引用 appearance/grooming(不存在)→ NaN → 事件永不触发
      conditions: function (st) {
        if (!st.flags || !st.flags._lastInterviewDay) return false; // [Layer3]
        var img =
          st.personalGrowth && st.personalGrowth.image
            ? st.personalGrowth.image
            : { style: 30, skincare: 30, fitness: 30, plastic: 0 };
        var s = img.style || 0;
        var sk = img.skincare || 0;
        var fit = img.fitness || 0;
        var avgImg = (s + sk + fit) / 3;
        return (
          st.player.day >= 60 &&
          avgImg < 45 &&
          !st.flags._imageCrisisSeen &&
          Random.chance(0.02)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "💇 今天就开始收拾自己",
          hint: "¥300+AP，全面升级",
          apply: function (st) {
            st.flags._imageCrisisSeen = true;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.image)
              st.personalGrowth.image = {
                style: 30,
                skincare: 30,
                fitness: 30,
                plastic: 0,
              };
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(300, st.resources.cash || 0);
            st.resources.cash -= cost;
            var img = st.personalGrowth.image;
            img.style = Math.min(100, (img.style || 0) + 8);
            img.skincare = Math.min(100, (img.skincare || 0) + 10);
            img.fitness = Math.min(100, (img.fitness || 0) + 12);
            st.player.charm = Math.min(100, (st.player.charm || 50) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            StateManager.addMessage(
              "💇 你推掉了一下午的活，从头到脚重新收拾了一遍。出来时路过镜子，连自己都愣了一下——这还是我吗？护肤+10，体型+12，魅力+3。",
              "success",
            );
          },
        },
        {
          text: "🛒 只买点便宜的东西应付一下",
          hint: "¥50，小幅改善",
          apply: function (st) {
            st.flags._imageCrisisSeen = true;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.image)
              st.personalGrowth.image = {
                style: 30,
                skincare: 30,
                fitness: 30,
                plastic: 0,
              };
            if (!st.resources) st.resources = { cash: 0 };
            var cost = Math.min(50, st.resources.cash || 0);
            st.resources.cash -= cost;
            var img = st.personalGrowth.image;
            img.skincare = Math.min(100, (img.skincare || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
            StateManager.addMessage(
              "🛒 你买了瓶洗发水、一包湿巾。出门时头发至少不油了。护肤+5。小钱办小事。",
              "info",
            );
          },
        },
        {
          text: "🙄 管他呢，又没人看",
          hint: "自暴自弃，形象继续下滑",
          apply: function (st) {
            st.flags._imageCrisisSeen = true;
            if (!st.personalGrowth) st.personalGrowth = {};
            if (!st.personalGrowth.image)
              st.personalGrowth.image = {
                style: 30,
                skincare: 30,
                fitness: 30,
                plastic: 0,
              };
            var img = st.personalGrowth.image;
            img.style = Math.max(0, (img.style || 0) - 3);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 3);
            StateManager.addMessage(
              "🙄 你看了镜子一眼，关上了门。无所谓了。风格-3，心情-3。有些改变永远不会发生，除非你开始。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== 事件4：人生目标deadline逼近=====
    // [全系统自洽修复] 域B 修复: 原路径 lifeGoals.active 不存在(state.js 仅有 goals:[])，事件永不触发。改为读取 goals + 梦想目标兜底
    // 联动：personalGrowth.goals + 梦想目标(dreamId) + 时间压力 + 选择
    {
      id: "pg_goal_deadline",
      phase: "street",
      icon: "⏰",
      title: "还有30天",
      story:
        '手机日历上有个标记——你的一个目标，deadline是30天后。\\n\\n你点开看："30岁前存款¥50,000"。\\n\\n你查了查余额：¥12,300。还有30天。\\n\\n你想了想自己现在的节奏，按这个速度，大概率完不成。\\n\\n但你又不甘心。',
      conditions: function (st) {
        if (!st.resources || st.resources.cash < 5000 || st.resources.cash > 20000) return false; // [Layer3]
        // 任何已激活目标：personalGrowth.goals 或已选梦想(_dreamId)即为"有目标"
        var goals = (st.personalGrowth && st.personalGrowth.goals) || [];
        var hasDream = !!(st.flags && st.flags._dreamId);
        return (
          st.player.day >= 90 &&
          (goals.length > 0 || hasDream) &&
          !st.flags._goalDeadlineSeen &&
          Random.chance(0.02)
        );
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "🔥 冲刺！压缩开支，加兼职",
          hint: "高压但可能达成目标",
          apply: function (st) {
            st.flags._goalDeadlineSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 8);
            st.player.morality = Math.max(0, (st.player.morality || 50) - 2); // 过度压榨自己
            StateManager.addMessage(
              "🔥 你开始了30天冲刺。每天工作到凌晨，周末也不休息。一个月后……算了，先拼完再说。疲劳+20，心情-8。",
              "warning",
            );
            // 30天后来回报（模拟）
            setTimeout(function () {
              if (!st.resources) st.resources = {};
              if (Random.chance(0.4)) {
                var bonus = Random.int(1000, 5000);
                st.resources.cash = Math.max(0, (st.resources.cash || 0) + bonus);
                StateManager.addMessage(
                  "🔥 30天过去了，你多赚了¥" +
                    bonus +
                    "。目标……差一点，但比以前更接近了。",
                  "info",
                );
              } else {
                StateManager.addMessage(
                  "🔥 30天过去了，你还是没完成目标。身体也垮了。但至少你尽力了。",
                  "warning",
                );
              }
            }, 100);
          },
        },
        {
          text: "📝 调整目标：把deadline往后推",
          hint: "更现实的选择",
          apply: function (st) {
            st.flags._goalDeadlineSeen = true;
            var goals = (st.personalGrowth && st.personalGrowth.goals) || [];
            if (goals.length > 0 && goals[0]) {
              goals[0].deadline = (goals[0].deadline || 30) + 60;
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            } else {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
            }
            StateManager.addMessage(
              "📝 你把deadline往后推了60天。不是放弃，是给自己多一点时间。心情+5。有些目标值得等。",
              "info",
            );
          },
        },
        {
          text: "😌 接受现实，调整期望",
          hint: "与自己和解",
          apply: function (st) {
            st.flags._goalDeadlineSeen = true;
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "😌 你看着目标，笑了笑。人生不是只有deadline。你已经做得很好了。心情+8，道德+3。",
              "success",
            );
          },
        },
      ],
    },

    // [全系统自洽修复] 域B 修复: personalGrowth.hobbies 在 legacy 流程中始终为{}，事件永不触发。改为爱好+技能双通道：有爱好高level→爱好突破；否则高等级技能(level>=8)→技能突破
    // ===== 事件5：长期投入的突破（爱好+技能双通道）=====
    {
      id: "pg_hobby_breakthrough",
      phase: "street",
      icon: "🎨",
      title: "那一刻你明白了",
      story:
        "你练了这件事已经很久了。\\n\\n也许是练了几个月吉他，也许是练了几个月书法，也许是跑了半年马拉松。\\n\\n今天突然，某个瞬间——你和它之间的隔阂消失了。你不再是在「学」它，你就是在「做」它。\\n\\n这种感觉很奇妙。你突然觉得，之前所有的辛苦都值得了。",
      conditions: function (st) {
        var hobbies =
          st.personalGrowth && st.personalGrowth.hobbies
            ? st.personalGrowth.hobbies
            : {};
        var hobbyHigh = Object.keys(hobbies).filter(function (k) {
          return hobbies[k] && (hobbies[k].level || 0) >= 3;
        });
        if (hobbyHigh.length > 0) {
          return (
            st.player.day >= 80 &&
            !st.flags._hobbyBreakthrough &&
            Random.chance(0.04)
          );
        }
        // 爱好为空时回退到技能通道：任一技能 level>=8 即"长期投入"
        var skills = st.skills || {};
        var skillHigh = Object.keys(skills).filter(function (k) {
          return skills[k] && (skills[k].level || 0) >= 8;
        });
        return (
          st.player.day >= 80 &&
          skillHigh.length > 0 &&
          !st.flags._hobbyBreakthrough &&
          Random.chance(0.03)
        );
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🏆 继续精进，朝更高目标努力",
          hint: "长期投入，回报丰厚",
          apply: function (st) {
            st.flags._hobbyBreakthrough = true;
            var hobbies =
              st.personalGrowth && st.personalGrowth.hobbies
                ? st.personalGrowth.hobbies
                : {};
            var hobbyHigh = Object.keys(hobbies).filter(function (k) {
              return hobbies[k] && (hobbies[k].level || 0) >= 3;
            });
            var label = "坚持";
            if (hobbyHigh.length > 0) {
              var hk = hobbyHigh[Random.int(0, hobbyHigh.length - 1)];
              hobbies[hk].level = (hobbies[hk].level || 0) + 1;
              label = hk;
            } else {
              var skills = st.skills || {};
              var skillHigh = Object.keys(skills).filter(function (k) {
                return skills[k] && (skills[k].level || 0) >= 8;
              });
              if (skillHigh.length > 0) {
                var sk = skillHigh[Random.int(0, skillHigh.length - 1)];
                st.skills[sk].xp = (st.skills[sk].xp || 0) + 80;
                label = sk;
              }
            }
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            StateManager.addMessage(
              "🏆 你决定继续精进" +
                label +
                "。那种「突破」的感觉,让你觉得之前所有的辛苦都值了。名气+3，心情+15。坚持是最朴素的力量。",
              "success",
            );
          },
        },
        {
          text: "🤝 教给别人，分享这份快乐",
          hint: "社交+技能",
          apply: function (st) {
            st.flags._hobbyBreakthrough = true;
            st.player.charm = Math.min(100, (st.player.charm || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
            StateManager.addMessage(
              "🤝 你把这份技能教给了身边几个人。他们学得很快，你也很高兴。魅力+3，心情+10。教会别人是另一种精进。",
              "info",
            );
          },
        },
        {
          text: "🎯 尝试变现，做成副业",
          hint: "收入+但不一定适合所有人",
          apply: function (st) {
            st.flags._hobbyBreakthrough = true;
            if (!st.resources) st.resources = {};
            var income = Random.int(300, 1500);
            st.resources.cash = Math.max(0, (st.resources.cash || 0) + income);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            StateManager.addMessage(
              "🎯 你尝试把这个爱好做成副业，头三个月小赚¥" +
                income +
                "。不多，但证明了一条路。心情+5。",
              "info",
            );
          },
        },
      ],
    },
  ];

  // 注入到 RANDOM_EVENTS
  for (var i = 0; i < PG_EVENTS.length; i++) {
    RANDOM_EVENTS.push(PG_EVENTS[i]);
  }
})();
