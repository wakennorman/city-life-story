/**
 * 职业专属随机事件池 — v3.10
 *
 * 覆盖11条职业路径，每路径 4-8 个叙事事件
 * 参考：BitLife（职业叙事）、大多数（中国职场现实）、
 *       Papers Please（体制内压力）、Disco Elysium（选择后果）
 *
 * 加载时机：career_dev.js 已定义 CAREER_PATHS 后，
 *           events_core.js 已初始化 RANDOM_EVENTS 后
 */
(function () {
  // ===== 工具函数 =====
  function _job(st) {
    return st.career && st.career.currentJob;
  }
  function _path(st, pathId) {
    return _job(st) && _job(st).path === pathId;
  }
  function _workDays(st) {
    return (_job(st) && _job(st).workDays) || 0;
  }
  function _cap(st) {
    return typeof ensureCareerCapital === "function"
      ? ensureCareerCapital(st)
      : null;
  }
  function _clamp(cap) {
    if (cap && typeof clampCareerCapital === "function")
      clampCareerCapital(cap);
  }
  function _msg(text, type) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage)
      StateManager.addMessage(text, type || "info");
  }
  // [全系统自洽修复] 域B A类: Random 始终已定义, 删除 Math.random 死代码兜底
  function _chance(p) {
    return Random.chance(p);
  }

  var EVENTS = [
    // ================================================================
    //  医疗护理路径（medical）
    // ================================================================
    {
      id: "med_patient_dispute",
      phase: "street",
      icon: "😤",
      title: "医患纠纷",
      story:
        "一名患者家属冲进护士站，拍着台子骂你粗心导致病人输液渗液。其他同事都缩着头，护士长不在。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "medical") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "🙇 道歉并立即处理",
          hint: "损点声誉，但化解危机",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.max(0, cap.reputation - 5);
              _clamp(cap);
            }
            st.player.mental = Math.max(0, (st.player.mental || 50) - 8);
            _msg(
              "🙇 你平静道歉并处置了渗液，家属情绪稳定下来。声誉-5，心理-8。",
              "warning",
            );
          },
        },
        {
          text: "📋 据理力争，调出护理记录",
          hint: "有理走遍天下",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 8);
                _clamp(cap);
              }
              _msg(
                "📋 护理记录显示操作无误。家属看后沉默，主任为你出头了。声誉+8。",
                "success",
              );
            } else {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 15);
              _msg(
                "😰 家属不依不饶升级到投诉，医院让你写检查报告。心理-15。",
                "warning",
              );
            }
          },
        },
        {
          text: "📞 立即呼叫护士长",
          hint: "转移压力给上级",
          apply: function (st) {
            _msg(
              "📞 护士长赶来，用老练的方式化解了矛盾。你背了半小时骂，心里憋屈。",
              "info",
            );
            st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
          },
        },
      ],
    },

    {
      id: "med_night_shift_overload",
      phase: "street",
      icon: "🌙",
      title: "连续夜班透支",
      story:
        "已经连续3天夜班了。今晚病区又来了急诊。你的手都在微微发抖，脑子里一片混沌。",
      probability: 0.05,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "medical") && _workDays(st) > 60;
      },
      choices: [
        {
          text: "💪 撑住，尽职完成工作",
          hint: "身体透支但收获认可",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 6);
              _clamp(cap);
            }
            st.player.physique = Math.max(0, (st.player.physique || 30) - 8);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            _msg(
              "💪 你撑过了这个夜班。主任悄悄说「你是最能扛的护士」。声誉+6，体力-8，疲劳+25。",
              "warning",
            );
          },
        },
        {
          text: "🏥 申请换班，身体第一",
          hint: "理智但影响绩效",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.burnout = Math.max(0, cap.burnout - 10);
              _clamp(cap);
            }
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            _msg(
              "🛌 你换到了白班。倦怠值-10，疲劳-15。同事有些微辞但你感觉好多了。",
              "success",
            );
          },
        },
        {
          text: "☕ 偷偷去小卖部买咖啡提神",
          hint: "撑一时，后患无穷",
          apply: function (st) {
            if (_chance(0.7)) {
              _msg(
                "☕ 咖啡管用！撑过了今晚，但手腕的抖动让你开始担心自己的健康状况。",
                "info",
              );
              st.player.physique = Math.max(0, (st.player.physique || 30) - 3);
            } else {
              _msg(
                "😴 咖啡没抗住，你在值班室打盹被巡查主任发现，被警告一次。",
                "warning",
              );
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 8);
                _clamp(cap);
              }
            }
          },
        },
      ],
    },

    {
      id: "med_outbreak_volunteer",
      phase: "street",
      icon: "🚑",
      title: "重大疫情援助招募",
      story:
        "医院通知：省内某市出现不明病毒聚集性感染，急需一线护士支援。志愿者名额有限，报名就是上战场。",
      probability: 0.015,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "medical") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "✋ 报名，义不容辞",
          hint: "高风险高荣誉",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 20);
              cap.burnout = Math.min(100, cap.burnout + 20);
              _clamp(cap);
            }
            st.player.physique = Math.max(0, (st.player.physique || 30) - 10);
            st.player.mental = Math.max(0, (st.player.mental || 50) - 15);
            st.flags = st.flags || {};
            st.flags._medVolunteerHonor = true;
            _msg(
              "🏅 你报名并完成了援助任务。回来后科室为你挂横幅，医院记三等功。声誉+20。",
              "success",
            );
          },
        },
        {
          text: "🤔 我有家人要照顾，无法前往",
          hint: "正当理由，无惩罚",
          apply: function (st) {
            _msg(
              "👨‍👩‍👧 你以家庭原因婉拒，同事理解。科里另一位护士去了，大家送行时你心里五味杂陈。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "med_near_miss",
      phase: "street",
      icon: "⚠️",
      title: "险些发生医疗差错",
      story:
        "你刚要给3床打药，突然发现拿错了！药拿的是4床的。两个患者名字只差一个字。好险——但要不要上报？",
      probability: 0.03,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "medical") && _workDays(st) > 120;
      },
      choices: [
        {
          text: "📝 如实上报不良事件",
          hint: "诚实会被记录，但这是职业操守",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.max(0, cap.reputation - 3);
              _clamp(cap);
            }
            st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
            _msg(
              "📝 你上报了险情。护士长说「发现了就是好的，感谢你的诚实」，科室据此改了排班流程。",
              "info",
            );
          },
        },
        {
          text: "🤫 悄悄改过来，不说了",
          hint: "侥幸心理，但隐患未消",
          apply: function (st) {
            if (_chance(0.8)) {
              _msg(
                "🤫 没人发现，你换好了药，这件事就此过去。但你做梦都在出汗。",
                "warning",
              );
            } else {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 20);
                _clamp(cap);
              }
              _msg(
                "😱 事情还是被发现了！领导翻监控追责，你被通报批评。声誉-20。",
                "warning",
              );
            }
          },
        },
        {
          text: "🔄 建议科室建立双核查制度",
          hint: "从系统角度解决问题",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 10);
              _clamp(cap);
            }
            _msg(
              "✅ 你的建议被采纳，科室新增了「双人核查」规定。护士长在会上表扬了你的职业素养。声誉+10。",
              "success",
            );
          },
        },
      ],
    },

    {
      id: "med_colleague_credit_steal",
      phase: "street",
      icon: "😒",
      title: "功劳被前辈截胡",
      story:
        "你连续三周观察总结的病人护理方案，被带教老师直接以自己名字写成了科室论文提交。你发现了这件事。",
      probability: 0.025,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "medical") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "😤 私下找她谈，要求署名",
          hint: "需要一定心理强度",
          apply: function (st) {
            if (st.needs && (st.player.mental || 0) >= 50) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 6);
                _clamp(cap);
              }
              _msg(
                "💬 你据理力争，老师只好补上了你的名字作为第二作者。以后她也不敢小看你了。声誉+6。",
                "success",
              );
            } else {
              _msg(
                "😔 你鼓足勇气说了几句，但声音发抖，她态度敷衍，你最终没争到什么。",
                "warning",
              );
              st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
            }
          },
        },
        {
          text: "📧 向护士长反映情况",
          hint: "走正式渠道",
          apply: function (st) {
            if (_chance(0.5)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 4);
                _clamp(cap);
              }
              _msg(
                "🏛️ 护士长调查后认定你有贡献，论文已更新署名，但气氛很尴尬。声誉+4。",
                "info",
              );
            } else {
              _msg(
                "😶 护士长含糊其辞，说「以后自己多留心」。你意识到科室有些事是潜规则。",
                "warning",
              );
            }
          },
        },
        {
          text: "💭 算了，以后留好证据",
          hint: "忍气吞声，吃一堑长一智",
          apply: function (st) {
            _msg(
              "📒 你默默咽下这口气，但开始用笔记记录每天的工作细节。以后再也不会这样了。",
              "info",
            );
            var cap = _cap(st);
            if (cap) {
              cap.industryResources = Math.min(100, cap.industryResources + 3);
              _clamp(cap);
            }
          },
        },
      ],
    },

    {
      id: "med_promotion_exam",
      phase: "street",
      icon: "📖",
      title: "职称晋升考试",
      story:
        "护士长通知：护理局职称考试报名开始了。你有资格报考，但需要花时间备考，同时医院里工作量没有减少。",
      probability: 0.02,
      repeatable: false,
      conditions: function (st) {
        return (
          _path(st, "medical") &&
          _workDays(st) > 730 &&
          st.career.currentJob.id !== "med_head_nurse"
        );
      },
      choices: [
        {
          text: "📚 全力备考，申请减轻排班",
          hint: "短期压力换长期晋升",
          apply: function (st) {
            if (_chance(0.65)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 12);
                _clamp(cap);
              }
              _msg(
                "🎓 你顺利通过了职称考试！护士长说下次晋升你是优先候选人。声誉+12。",
                "success",
              );
            } else {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
              _msg(
                "😓 没过，题目太难了，你烦躁了两周。但下次你知道考试方向了，疲劳+20。",
                "warning",
              );
            }
          },
        },
        {
          text: "⏳ 今年太忙，等下次",
          hint: "保持现状",
          apply: function (st) {
            _msg(
              "📅 你决定推迟一年。这个决定没有错，但时间总是过得很快。",
              "info",
            );
          },
        },
      ],
    },

    // ================================================================
    //  公务员路径（civil）
    // ================================================================
    {
      id: "civil_annual_review",
      phase: "street",
      icon: "📊",
      title: "年度绩效考核",
      story:
        "单位年终考核开始。领导让每个人填写自评，但谁都知道评级最终取决于和领导的关系。",
      probability: 0.06,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "civil") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "💼 把今年业绩认真整理成汇报材料",
          hint: "用实力说话",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              if (_chance(0.7)) {
                cap.reputation = Math.min(100, cap.reputation + 10);
                _clamp(cap);
                if (st.career.currentJob) {
                  st.career.currentJob.salary = Math.round(
                    st.career.currentJob.salary * 1.05,
                  );
                }
                _msg(
                  "📈 领导认可你的业绩材料，绩效评「优秀」，薪资+5%。声誉+10。",
                  "success",
                );
              } else {
                cap.reputation = Math.min(100, cap.reputation + 4);
                _clamp(cap);
                _msg(
                  "📋 考核结果「良好」，正常过关。你的材料准备很充分，但今年指标压力大。声誉+4。",
                  "info",
                );
              }
            }
          },
        },
        {
          text: "🍻 年底请领导吃顿饭",
          hint: "社交资本换绩效",
          apply: function (st) {
            var socialScore =
              (st.skills && st.skills.social && st.skills.social.level) || 0;
            if (socialScore >= 50 || _chance(0.5)) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
              var cap = _cap(st);
              if (cap) {
                cap.partnerTrust = Math.min(100, (cap.partnerTrust || 0) + 8);
                _clamp(cap);
              }
              if (st.career.currentJob) {
                st.career.currentJob.salary = Math.round(
                  st.career.currentJob.salary * 1.06,
                );
              }
              _msg(
                "🍽️ 饭局气氛融洽，领导给了「优秀」评定，薪资+6%。花了¥800，合伙人信任+8。",
                "success",
              );
            } else {
              // [全系统自洽修复] 域B A类#3: cash守卫
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
              _msg(
                "😐 领导客气地吃完了，考核结果还是「良好」。钱没白花，关系维护住了。花了¥800。",
                "info",
              );
            }
          },
        },
        {
          text: "😐 无所谓，随便填填",
          hint: "佛系应对",
          apply: function (st) {
            _msg(
              "🗂️ 你草草填完自评交上去，结果「合格」。在单位继续默默无闻。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "civil_petition_handling",
      phase: "street",
      icon: "📢",
      title: "接访上访群众",
      story:
        "今天轮到你接访。一位60多岁的老大爷来反映土地征收问题，说了两个小时没有重复，但这件事超出了你的职责范围。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "civil") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "📋 耐心记录，转交有权处理的部门",
          hint: "按程序走，压力不大",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 5);
              _clamp(cap);
            }
            _msg(
              "✅ 你认真记录并开了转办函。大爷临走说「总算碰到个办实事的」。声誉+5。",
              "success",
            );
          },
        },
        {
          text: "📞 直接联系相关部门负责人帮他跑腿",
          hint: "超额付出，获得口碑",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 10);
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 6);
              _clamp(cap);
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
            _msg(
              "🤝 你帮大爷联系到了土地局专员，问题有了进展。口碑在单位传开了。声誉+10，疲劳+12。",
              "success",
            );
          },
        },
        {
          text: "😤 告诉他这里管不了，让他去别处",
          hint: "推诿，有风险",
          apply: function (st) {
            if (_chance(0.3)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 12);
                _clamp(cap);
              }
              _msg(
                "😡 大爷在门口大声说「这里的人根本不管事」，被巡视组听到了，你被约谈。声誉-12。",
                "warning",
              );
            } else {
              _msg("😐 大爷悻悻而去，今天就这样过去了，什么也没解决。", "info");
            }
          },
        },
      ],
    },

    {
      id: "civil_anti_corruption_check",
      phase: "street",
      icon: "🔍",
      title: "廉政专项检查",
      story:
        "纪检组来单位做例行专项检查。同事们一早就开始整理档案，有人悄悄删手机里的聊天记录。你也想到了一些事情。",
      probability: 0.025,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "civil") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "🗂️ 按规整理资料，坦然面对",
          hint: "清者自清",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            _msg(
              "✅ 检查组查了你的档案，没有问题。领导事后表扬你「工作规范」。声誉+8。",
              "success",
            );
          },
        },
        {
          text: "🤫 整理一下，删掉一些「不太合适」的记录",
          hint: "有隐患？",
          apply: function (st) {
            if (_chance(0.25)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 25);
                _clamp(cap);
              }
              _msg(
                "😱 检查组发现了痕迹，要求你配合调查。事情比想象中严重。声誉-25。",
                "warning",
              );
              st.player.mental = Math.max(0, (st.player.mental || 50) - 20);
            } else {
              _msg(
                "😮‍💨 检查顺利结束，没有问题。这次算过去了，但心理阴影留下了。",
                "info",
              );
            }
          },
        },
        {
          text: "🙋 主动向组织说明一件有模糊地带的事",
          hint: "主动坦白，风险低",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 5);
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 10);
              _clamp(cap);
            }
            _msg(
              "🤝 你主动说明了一件模糊的事，组织认定不构成问题，并表扬你的自觉。声誉+5，信任+10。",
              "success",
            );
          },
        },
      ],
    },

    {
      id: "civil_leader_secretary",
      phase: "street",
      icon: "📋",
      title: "领导要你当秘书",
      story:
        "分管副局长找你谈话，说欣赏你的文笔和做事认真，想把你调去做他的文字秘书。这意味着更多责任，也意味着离核心更近。",
      probability: 0.02,
      repeatable: false,
      conditions: function (st) {
        return (
          _path(st, "civil") &&
          _workDays(st) > 730 &&
          st.career.currentJob.id !== "civil_chief"
        );
      },
      choices: [
        {
          text: "✅ 接受，跟着领导走",
          hint: "仕途加速，但个人时间减少",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 20);
              cap.reputation = Math.min(100, cap.reputation + 12);
              cap.burnout = Math.min(100, cap.burnout + 15);
              _clamp(cap);
            }
            if (st.career.currentJob) {
              st.career.currentJob.salary = Math.round(
                st.career.currentJob.salary * 1.15,
              );
            }
            _msg(
              "🏛️ 你成为副局长秘书，薪资+15%，处于权力核心。但随时待命的压力很大。声誉+12，倦怠+15。",
              "success",
            );
          },
        },
        {
          text: "🙏 婉拒，继续做业务工作",
          hint: "保持独立，慢慢晋升",
          apply: function (st) {
            _msg(
              "📊 你礼貌地表达了希望继续做专业业务的想法。领导点头，也许过段时间还会再问。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "civil_overnight_report",
      phase: "street",
      icon: "🌙",
      title: "紧急公文加班",
      story:
        "下午5点，上级突然下发通知，要求明早8点前提交一份关于城市更新的专项调研报告，字数不少于5000字。",
      probability: 0.05,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "civil") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "💻 自己通宵写，力求完美",
          hint: "高质量报告，身体代价",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 30);
            st.player.physique = Math.max(0, (st.player.physique || 30) - 5);
            _msg(
              "📄 你熬夜写完并获得领导好评。「这篇写得很扎实」。声誉+8，疲劳+30，体力-5。",
              "success",
            );
          },
        },
        {
          text: "🤝 找同事分工合写，共担压力",
          hint: "效率高，人缘好",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 8);
              cap.reputation = Math.min(100, cap.reputation + 4);
              _clamp(cap);
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            _msg(
              "🤝 你组织了3个同事分工完成报告，虽然质量参差不齐，但准时交了。信任+8，声誉+4，疲劳+15。",
              "info",
            );
          },
        },
        {
          text: "📝 东拼西凑改改旧报告交差",
          hint: "低风险，但质量堪忧",
          apply: function (st) {
            if (_chance(0.4)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 8);
                _clamp(cap);
              }
              _msg(
                "😓 领导扫了一眼说「这些数据都是三年前的」，当场退回，让你重写。声誉-8。",
                "warning",
              );
            } else {
              _msg("😅 幸好上级部门也来不及仔细看，报告糊弄过去了。", "info");
            }
          },
        },
      ],
    },

    {
      id: "civil_face_project",
      phase: "street",
      icon: "🏗️",
      title: "领导安排「面子工程」",
      story:
        "主任让你负责一个街道绿化改造项目，但方案完全不合理——就是为了配合上级视察造声势。你心里不认同。",
      probability: 0.03,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "civil") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "🫡 照做，视察前搞好表面工程",
          hint: "服从命令，快速完事",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.burnout = Math.min(100, cap.burnout + 8);
              _clamp(cap);
            }
            st.player.mental = Math.max(0, (st.player.mental || 50) - 8);
            _msg(
              "🏗️ 视察顺利，领导满意。但你看着那些三天后就会枯死的盆栽，心情很复杂。倦怠+8，心理-8。",
              "warning",
            );
          },
        },
        {
          text: "📊 在执行的同时，附上一份可持续改进方案",
          hint: "埋下长期收益的种子",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 6);
              cap.industryResources = Math.min(100, cap.industryResources + 5);
              _clamp(cap);
            }
            _msg(
              "📋 视察完成，你附上的后续方案也获得了处长的关注。声誉+6，行业资源+5。",
              "success",
            );
          },
        },
        {
          text: "🗣️ 私下向主任提出方案不合理",
          hint: "需要一定的勇气和关系",
          apply: function (st) {
            var cap = _cap(st);
            if ((cap && cap.partnerTrust >= 40) || _chance(0.35)) {
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 8);
                _clamp(cap);
              }
              _msg(
                "💬 主任听进去了，稍微修改了方案。你赢得了他的信任。声誉+8。",
                "success",
              );
            } else {
              if (cap) {
                cap.partnerTrust = Math.max(0, cap.partnerTrust - 10);
                _clamp(cap);
              }
              _msg(
                "😶 主任脸色不好看地说「你先做好执行，方向由我定」。关系有点紧张，信任-10。",
                "warning",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  IT技术路径（tech）
    // ================================================================
    {
      id: "tech_age_35_crisis",
      phase: "street",
      icon: "⏰",
      title: "35岁危机预警",
      story:
        "你注意到最近招聘要求上都写着「35岁以下」。公司内部流传一份「优化名单」，据说上面大多数都是你这个年龄层的。",
      probability: 0.04,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "tech") && st.player.age >= 33 && _workDays(st) > 730;
      },
      choices: [
        {
          text: "📚 抓紧学新技术，转型架构方向",
          hint: "投资未来",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.industryResources = Math.min(100, cap.industryResources + 10);
              _clamp(cap);
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
            _msg(
              "🧑‍💻 你报了架构设计课程，开始向技术管理转型。短期很累，行业资源+10，疲劳+20。",
              "info",
            );
          },
        },
        {
          text: "🏢 开始评估创业/跳槽到小公司做CTO",
          hint: "主动掌控命运",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.clientLeads = Math.min(100, cap.clientLeads + 12);
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            _msg(
              "💡 你开始整理人脉和资源，评估出路。客户线索+12，声誉+8。机会在慢慢成形。",
              "success",
            );
          },
        },
        {
          text: "😔 焦虑但什么也没做",
          hint: "摆烂，后果自负",
          apply: function (st) {
            st.player.mental = Math.max(0, (st.player.mental || 50) - 15);
            var cap = _cap(st);
            if (cap) {
              cap.burnout = Math.min(100, cap.burnout + 12);
              _clamp(cap);
            }
            _msg(
              "😔 你陷入焦虑，刷了一周招聘帖子什么都没投。心理-15，倦怠+12。",
              "warning",
            );
          },
        },
      ],
    },

    {
      id: "tech_legacy_code_crisis",
      phase: "street",
      icon: "🐛",
      title: "祖传代码炸了",
      story:
        "生产环境突然宕机，原因是五年前某个离职同事写的代码，今天被一个边缘请求触发了。老板在钉钉群一直@你。",
      probability: 0.05,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "tech") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "⚡ 立即查，两小时内修复上线",
          hint: "能力展示机会",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 12);
                _clamp(cap);
              }
              _msg(
                "🚀 你两小时内定位问题并热修复上线。老板在群里@全员说「这就是关键时刻的人才」。声誉+12。",
                "success",
              );
            } else {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
              _msg(
                "😰 折腾了五个小时才解决，你的脑子已经烧成了灰。过程很痛苦，但问题解决了。疲劳+25。",
                "warning",
              );
            }
          },
        },
        {
          text: "🔀 推到运维回滚，给自己争取时间",
          hint: "聪明的方式",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.industryResources = Math.min(100, cap.industryResources + 5);
              _clamp(cap);
            }
            _msg(
              "🔄 回滚稳定后你找到了根因，写了详细的RCA报告。老板更欣赏你的系统思维。行业资源+5。",
              "success",
            );
          },
        },
      ],
    },

    {
      id: "tech_colleague_pip",
      phase: "street",
      icon: "📉",
      title: "同事被PIP，你慌了",
      story:
        "你最能干的同事突然发消息说被放上了PIP（绩效改进计划）。她工作不比你差，这让整个组的气氛变得很怪。",
      probability: 0.03,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "tech") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "📊 加倍展示自己的价值，多刷存在感",
          hint: "防御性积极",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 6);
              cap.burnout = Math.min(100, cap.burnout + 8);
              _clamp(cap);
            }
            _msg(
              "📈 你开始每周发进度周报，主动承担新需求。领导注意到了你。声誉+6，倦怠+8。",
              "info",
            );
          },
        },
        {
          text: "🤝 私下安慰同事，帮她渡过难关",
          hint: "人情味，但有时间代价",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 12);
              _clamp(cap);
            }
            _msg(
              "💬 你帮同事梳理了几个难搞的模块。她顺利渡过了考察期，现在你们关系更铁了。信任+12。",
              "success",
            );
          },
        },
        {
          text: "😶 低调观望，什么都不做",
          hint: "沉默是金？",
          apply: function (st) {
            _msg(
              "🔍 你缩着头，结果发现PIP只是裁员的前奏……但还没轮到你。今天算过去了。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "tech_side_project_viral",
      phase: "street",
      icon: "🌟",
      title: "开源项目爆红",
      story:
        "你周末写的一个小工具被V2EX某大佬转发，一夜之间GitHub star从3涨到了2000+，还有人私信问你要不要商业合作。",
      probability: 0.015,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "tech") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "🚀 认真运营，接商业合作",
          hint: "副业爆发机会",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 18);
              cap.clientLeads = Math.min(100, cap.clientLeads + 15);
              _clamp(cap);
            }
            st.resources.cash += 8000;
            _msg(
              "🎉 你接了几个小商业合作，额外收入¥8000，同时在行业建立了个人品牌。声誉+18，客户线索+15。",
              "success",
            );
          },
        },
        {
          text: "😄 享受一下热度，但继续本职工作",
          hint: "均衡发展",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 10);
              _clamp(cap);
            }
            _msg(
              "🌟 你维护着开源项目，没有刻意商业化。在社区有了一定知名度，简历亮眼了很多。声誉+10。",
              "info",
            );
          },
        },
      ],
    },

    // ================================================================
    //  金融财务路径（finance）
    // ================================================================
    {
      id: "fin_audit_anomaly",
      phase: "street",
      icon: "🔍",
      title: "发现账目异常",
      story:
        "年度审计时，你发现一笔200万的支出有些奇怪——金额分多次走，汇到一个关联公司。你越查越心惊。",
      probability: 0.025,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "finance") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "📊 整理证据，向上级合规部门汇报",
          hint: "正直但有风险",
          apply: function (st) {
            if (_chance(0.5)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 20);
                _clamp(cap);
              }
              st.resources.cash += 5000;
              _msg(
                "🏆 你举报属实，合规部门认定你立了大功，获得¥5000奖励，声誉大涨。声誉+20。",
                "success",
              );
            } else {
              var cap2 = _cap(st);
              if (cap2) {
                cap2.reputation = Math.max(0, cap2.reputation - 10);
                _clamp(cap2);
              }
              _msg(
                "😬 调查后发现是正常的关联交易，你的判断有误。被上级说「不要乱揣测」。声誉-10。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤐 装没看见，闭口不提",
          hint: "明哲保身",
          apply: function (st) {
            if (_chance(0.2)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 20);
                _clamp(cap);
              }
              _msg(
                "😱 事后监管介入调查，你被问到「当时为何没报告」。职业信誉受损。声誉-20。",
                "warning",
              );
            } else {
              _msg(
                "😮‍💨 什么都没发生，这件事过去了。但你睡眠变差了，总觉得有什么事没做对。",
                "info",
              );
            }
          },
        },
        {
          text: "💬 私下找直属领导说明情况",
          hint: "让领导来决定",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 8);
              _clamp(cap);
            }
            _msg(
              "🔒 领导说「知道了，我来处理」，之后什么消息都没有。你懂了一些事情。信任+8。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "fin_client_midnight_call",
      phase: "street",
      icon: "📞",
      title: "客户午夜来电",
      story:
        "凌晨1点，大客户给你打电话，说他的投资账户今天浮亏20%，语气激动。他要求你「给个说法」。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "finance") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "📞 接听，耐心安抚解释",
          hint: "服务至上，但影响睡眠",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.clientLeads = Math.min(100, cap.clientLeads + 10);
              cap.reputation = Math.min(100, cap.reputation + 6);
              _clamp(cap);
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            _msg(
              "📞 你接了电话，安抚了客户两小时。明天他还是你的客户。客户线索+10，声誉+6，疲劳+15。",
              "success",
            );
          },
        },
        {
          text: "😴 不接，明天工作时间再说",
          hint: "边界清晰，但有风险",
          apply: function (st) {
            if (_chance(0.35)) {
              var cap = _cap(st);
              if (cap) {
                cap.clientLeads = Math.max(0, cap.clientLeads - 15);
                _clamp(cap);
              }
              _msg(
                "😡 客户第二天找了你的竞品，走了。你少了一个大客户，客户线索-15。",
                "warning",
              );
            } else {
              _msg(
                "😌 你睡了觉。第二天客户自己冷静了，见面时也理解了你。",
                "info",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  销售路径（sales）
    // ================================================================
    {
      id: "sales_big_deal_lost",
      phase: "street",
      icon: "💸",
      title: "大单泡汤",
      story:
        "你跟了三个月的大单，客户昨天签了竞品。原因是对方给了回扣，而你坚持没有走灰色渠道。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "sales") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "😤 生气，但认了——坚守了底线",
          hint: "心理代价换职业操守",
          apply: function (st) {
            st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 5);
              _clamp(cap);
            }
            _msg(
              "💼 你没有走灰色渠道。这个单子没了，但你在圈子里的口碑更干净了。心理-10，声誉+5。",
              "info",
            );
          },
        },
        {
          text: "📞 找客户负责人继续谈，看有没有转机",
          hint: "死磕",
          apply: function (st) {
            if (_chance(0.3)) {
              var cap = _cap(st);
              if (cap) {
                cap.clientLeads = Math.min(100, cap.clientLeads + 12);
                _clamp(cap);
              }
              st.resources.cash += Math.round(
                ((_job(st) && _job(st).salary) || 8000) * 0.3,
              );
              _msg(
                "🔄 对方内部有变化，你抓住机会谈成了一部分合作。客户线索+12，意外奖金到账。",
                "success",
              );
            } else {
              _msg("📵 对方没有接你的电话，彻底凉了。", "info");
            }
          },
        },
      ],
    },

    {
      id: "sales_quarter_end_rush",
      phase: "street",
      icon: "🏃",
      title: "季末冲量",
      story:
        "月底最后三天，团队离目标还差15%。老板说：达标有大额提成，不达标全组降薪。你压着几个客户在犹豫中。",
      probability: 0.05,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "sales") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "📞 轮番打电话，能签就签",
          hint: "拼了，不择手段追单",
          apply: function (st) {
            if (_chance(0.55)) {
              st.resources.cash += 6000;
              var cap = _cap(st);
              if (cap) {
                cap.clientLeads = Math.min(100, cap.clientLeads + 8);
                _clamp(cap);
              }
              _msg(
                "🏆 最后时刻你签下了两单，团队达标！提成¥6000到账！客户线索+8。",
                "success",
              );
            } else {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
              _msg(
                "😰 拼到凌晨，签了一单但还是差，最终降薪……疲劳+25，这个月很难过。",
                "warning",
              );
            }
          },
        },
        {
          text: "🤝 专注服务最有可能签的1个客户",
          hint: "精准打单",
          apply: function (st) {
            if (_chance(0.7)) {
              st.resources.cash += 4000;
              _msg(
                "🎯 精准攻克，最重要的那单签了，团队差一点达标。提成¥4000。老板也认可了你的判断力。",
                "success",
              );
            } else {
              _msg(
                "😓 那个客户还是没签，目标没达成。但你复盘了哪里出了问题，下次会不一样。",
                "info",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  教育培训路径（education）
    // ================================================================
    {
      id: "edu_parent_complaint",
      phase: "street",
      icon: "👨‍👩‍👧",
      title: "家长投诉",
      story:
        "一位家长在家长群发了长文，说你对孩子「态度冷漠、不用心」，还@了校长，群里有几个家长跟帖附和。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "education") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "📞 主动打电话给家长私下沟通",
          hint: "灭火第一",
          apply: function (st) {
            if (_chance(0.65)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 5);
                _clamp(cap);
              }
              _msg(
                "📞 家长接了电话，原来是误解，沟通后他在群里道歉了。化解了危机，声誉+5。",
                "success",
              );
            } else {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
              _msg(
                "😡 家长态度很差，坚持说你有问题。你心里委屈但无话可说。心理-10。",
                "warning",
              );
            }
          },
        },
        {
          text: "📊 在群里用数据说话：列出该生的进步记录",
          hint: "专业反击",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            _msg(
              "📈 你晒出了详细的学习进步表，家长群里风向转了。校长私信说「处理得好」。声誉+8。",
              "success",
            );
          },
        },
        {
          text: "😶 不管，反正你问心无愧",
          hint: "硬抗",
          apply: function (st) {
            if (_chance(0.4)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.max(0, cap.reputation - 8);
                _clamp(cap);
              }
              _msg(
                "😤 校长找你谈话，说「下次及时沟通，不要让事情发酵」。声誉-8。",
                "warning",
              );
            } else {
              _msg(
                "😌 风波自动平息了，其他家长觉得那位家长过分了，纷纷帮你说话。",
                "success",
              );
            }
          },
        },
      ],
    },

    {
      id: "edu_year_end_evaluation",
      phase: "street",
      icon: "🏆",
      title: "年终优秀教师评选",
      story:
        "学校年终评优，名额就一个。你和老王都是候选，但老王跟校长关系更熟，评委也基本上是内定的。",
      probability: 0.02,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "education") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "📝 整理教学成果材料，走正常流程",
          hint: "尽人事，听天命",
          apply: function (st) {
            if (_chance(0.45)) {
              st.resources.cash += 3000;
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 15);
                _clamp(cap);
              }
              _msg(
                "🏆 你获得了优秀教师称号，附带¥3000奖金！声誉大涨。",
                "success",
              );
            } else {
              _msg(
                "😐 结果如预期，老王拿了。但你的材料被存档了，明年还有机会。",
                "info",
              );
            }
          },
        },
        {
          text: "🤝 主动走动，维护与校领导的关系",
          hint: "人情关系投资",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#3: cash守卫
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            if (_chance(0.6)) {
              st.resources.cash += 3000;
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 15);
                _clamp(cap);
              }
              _msg(
                "🏆 你精心维护了关系，最终校长在关键时刻投了你一票。优秀教师！花了¥500但赚了¥3000。",
                "success",
              );
            } else {
              var cap2 = _cap(st);
              if (cap2) {
                cap2.partnerTrust = Math.min(100, cap2.partnerTrust + 6);
                _clamp(cap2);
              }
              _msg(
                "😐 还是没拿到，但你和校长的关系近了一步，信任+6。下次有机会。花了¥500。",
                "info",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  物流快递路径（logistics）
    // ================================================================
    {
      id: "log_damaged_package",
      phase: "street",
      icon: "📦",
      title: "快递破损引发纠纷",
      story:
        "一位买家在平台投诉，说收到的包裹里有损坏，要求全额赔偿，语气很凶，已经联系了平台客服。",
      probability: 0.05,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "logistics") && _workDays(st) > 60;
      },
      choices: [
        {
          text: "📸 要求买家提供照片，核实损坏情况",
          hint: "按规矩走",
          apply: function (st) {
            if (_chance(0.7)) {
              _msg(
                "✅ 核实后属于运输损坏，走保险赔付。流程正规，平台评分没有受影响。",
                "success",
              );
            } else {
              _msg(
                "😒 买家提的图片根本看不出问题，可能是碰瓷。上报后最终不了了之。",
                "info",
              );
            }
          },
        },
        {
          text: "💰 直接垫付小额赔偿，快速解决",
          hint: "花钱了事，效率第一",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#3: cash守卫
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 4);
              _clamp(cap);
            }
            _msg(
              "💸 你自掏¥150垫付了赔偿，买家撤了投诉。好评到账，站点评分+。声誉+4。",
              "success",
            );
          },
        },
      ],
    },

    {
      id: "log_singles_day_overload",
      phase: "street",
      icon: "📬",
      title: "双十一爆仓危机",
      story:
        "双十一，仓库已经三天没睡觉处理快递。包裹堆了五米高，投诉电话打爆，主管让你「想办法」。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "logistics") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "💪 带头加班，组织团队连夜清仓",
          hint: "肉身扛，赢声誉",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 10);
              _clamp(cap);
            }
            st.player.physique = Math.max(0, (st.player.physique || 30) - 8);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 30);
            _msg(
              "🏆 你带队连续作战，三天内清了仓。总部通报表扬，声誉+10，体力-8，疲劳+30。",
              "success",
            );
          },
        },
        {
          text: "📦 临时外包，找兼职帮忙",
          hint: "花钱解决问题",
          apply: function (st) {
            st.resources.cash = Math.max(0, st.resources.cash - 1200);
            _msg(
              "🛵 花¥1200找了10个临时工，两天清完，投诉量回落。成本控制不算完美但解决了问题。",
              "info",
            );
          },
        },
      ],
    },

    // ================================================================
    //  餐饮服务路径（catering）
    // ================================================================
    {
      id: "cat_health_inspection",
      phase: "street",
      icon: "🔬",
      title: "食品安全突击检查",
      story:
        "食药监局今天突击检查！后厨乱糟糟的，洗菜池有问题，一个同事手上的伤口没有包扎就在切菜。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "catering") && _workDays(st) > 60;
      },
      choices: [
        {
          text: "🚨 立即拦下同事，重新处理问题区域",
          hint: "亡羊补牢",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 6);
                _clamp(cap);
              }
              _msg(
                "✅ 你反应迅速处置了问题，检查官看到后说「处理得好」，店铺顺利通过。声誉+6。",
                "success",
              );
            } else {
              // [全系统自洽修复] 域B A类#3: cash守卫
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
              _msg(
                "😰 还是被发现了，罚款¥2000并责令整改。但因你积极处置，没有关店。",
                "warning",
              );
            }
          },
        },
        {
          text: "😰 慌乱，什么都没做",
          hint: "被动受罚",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#3: cash守卫
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.max(0, cap.reputation - 10);
              _clamp(cap);
            }
            _msg(
              "😱 检查官记录了多处违规，罚款¥5000，被列入重点监察名单。声誉-10。",
              "warning",
            );
          },
        },
      ],
    },

    {
      id: "cat_viral_dish",
      phase: "street",
      icon: "📱",
      title: "菜品意外爆红网络",
      story:
        "一个博主无意间拍了你们店的招牌菜，短视频播放量破了百万。一夜间店门口排起了长队，但后厨完全没做好准备。",
      probability: 0.015,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "catering") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "🚀 加班加点，抓住流量红利",
          hint: "高强度但收益大",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 15);
              cap.clientLeads = Math.min(100, cap.clientLeads + 20);
              _clamp(cap);
            }
            st.resources.cash += 8000;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            _msg(
              "🏆 你们撑过了爆单期，额外收入¥8000，积累了大量回头客。声誉+15，客户线索+20，疲劳+25。",
              "success",
            );
          },
        },
        {
          text: "📋 控制接单量，保证质量",
          hint: "慢而稳",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            st.resources.cash += 3000;
            _msg(
              "🍜 你控制了接单节奏，口碑评分没有下滑，稳稳赚了¥3000，声誉+8。长远来看是对的。",
              "success",
            );
          },
        },
        {
          text: "😩 应付不来，关掉了外卖接单",
          hint: "错失机会",
          apply: function (st) {
            _msg(
              "😔 流量来了又去，你没能把握住。这次错过了，但至少店里没有翻车。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "cat_bad_review_crisis",
      phase: "street",
      icon: "⭐",
      title: "恶评危机",
      story:
        "大众点评出现了一条图文并茂的1星差评，说在你们店发现了异物，并配了「照片」。但你知道那根本不可能发生。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "catering") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "📞 联系买家协商处理，私下了解情况",
          hint: "以和为贵",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) {
                cap.clientLeads = Math.min(100, cap.clientLeads + 6);
                _clamp(cap);
              }
              _msg(
                "✅ 对方是误解，沟通后删除了差评并道歉。你送了一张优惠券，赚了个回头客。客户线索+6。",
                "success",
              );
            } else {
              _msg(
                "😒 对方态度强硬，坚持不删。你只能让平台介入，流程很慢。",
                "info",
              );
            }
          },
        },
        {
          text: "📝 平台投诉举报，证明是虚假评价",
          hint: "正规渠道维权",
          apply: function (st) {
            if (_chance(0.5)) {
              var cap = _cap(st);
              if (cap) {
                cap.reputation = Math.min(100, cap.reputation + 5);
                _clamp(cap);
              }
              _msg(
                "🗑️ 平台经核实认定是恶意差评，已删除，并给了补偿流量。声誉+5。",
                "success",
              );
            } else {
              _msg(
                "⏳ 平台说「正在处理中」，已经等了两周，没有回音。差评还挂着。",
                "warning",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  医师路径（doctor）— v3.11 新增
    // ================================================================
    {
      id: "doc_misdiagnosis_scare",
      phase: "street",
      icon: "🔬",
      title: "险些误诊",
      story:
        "急诊来了一位胸痛患者，心电图为阴性，你差点按一般肌肉拉伤处理。但就在准备让病人回去时，你多看了一眼——氧饱和度偏低。",
      probability: 0.035,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "doctor") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "📋 立即收住院做冠脉CTA",
          hint: "谨慎为上",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) cap.reputation = Math.min(100, cap.reputation + 10);
            _clamp(cap);
            _msg(
              "📋 CTA显示前降支狭窄90%！急诊介入后患者转危为安。患者家属送来锦旗。声誉+10。",
              "success",
            );
          },
        },
        {
          text: "🧪 先做个心梗三项+心电图复查",
          hint: "保险但可能错过时间窗",
          apply: function (st) {
            if (_chance(0.65)) {
              _msg(
                "📊 心梗三项果然异常！你紧急呼叫心内科会诊，患者及时接受了治疗。",
                "success",
              );
            } else {
              _msg(
                "😰 等待结果时患者病情加重……虽然最终确诊了，但你被主任严厉批评。",
                "warning",
              );
              var cap = _cap(st);
              if (cap) cap.reputation = Math.max(0, cap.reputation - 5);
              _clamp(cap);
            }
          },
        },
        {
          text: "🙏 让患者回家休息，开点止痛药",
          hint: "轻率决定，有风险",
          apply: function (st) {
            if (_chance(0.8)) {
              _msg(
                "😅 患者回去了，第二天回来说吃了药好些了。但你一整天都在回想这个病例。",
                "info",
              );
            } else {
              var cap = _cap(st);
              if (cap) cap.reputation = Math.max(0, cap.reputation - 20);
              _clamp(cap);
              st.player.mental = Math.max(0, (st.player.mental || 50) - 20);
              _msg(
                "⚠️ 患者后来在别的医院确诊心梗并投诉了你，医务科找你谈话。声誉-20，心理-20。",
                "warning",
              );
            }
          },
        },
      ],
    },

    {
      id: "doc_night_emergency_crisis",
      phase: "street",
      icon: "🚑",
      title: "午夜急救大出血",
      story:
        "凌晨3点，急诊收治了一名严重车祸伤者，多部位复合伤。你刚独立值班，麻醉科和外科主任都在赶来的路上。",
      probability: 0.03,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "doctor") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "⚡ 就地紧急处置，建立三路静脉通道",
          hint: "争分夺秒",
          apply: function (st) {
            if (_chance(0.55)) {
              var cap = _cap(st);
              if (cap) cap.reputation = Math.min(100, cap.reputation + 15);
              _clamp(cap);
              _msg(
                "🏆 你沉着处置稳住了患者生命体征！外科主任赶到后说「处理得很专业」。声誉+15。",
                "success",
              );
            } else {
              _msg(
                "😰 患者腹腔出血太快，你拼尽全力也只维持了基本循环。主任接手后批评了你的液体管理。",
                "warning",
              );
            }
            st.player.physique = Math.max(0, (st.player.physique || 30) - 5);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
          },
        },
        {
          text: "📞 持续电话催促主任，保守维持",
          hint: "安全但缺乏主动性",
          apply: function (st) {
            _msg(
              "📞 主任10分钟后赶到，接手了抢救。患者最终转危为安，但没人夸你也没人骂你。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "doc_medical_license_exam",
      phase: "street",
      icon: "📖",
      title: "执业医师资格考试",
      story:
        "医院通知你参加执业医师资格考试。这是从实习医生转为正式医生的必经之路。通过率只有60%，但不过就要再等一年。",
      probability: 0.025,
      repeatable: false,
      conditions: function (st) {
        return (
          _path(st, "doctor") &&
          _workDays(st) > 180 &&
          st.career.currentJob.id !== "doc_attending"
        );
      },
      choices: [
        {
          text: "📚 全职备考一个月",
          hint: "全力冲刺",
          apply: function (st) {
            if (_chance(0.75)) {
              st.flags = st.flags || {};
              st.flags._passedMedLicense = true;
              var certs = st.certificates || [];
              if (certs.indexOf("medical_license") < 0)
                certs.push("medical_license");
              st.certificates = certs;
              var cap = _cap(st);
              if (cap) cap.reputation = Math.min(100, cap.reputation + 10);
              _clamp(cap);
              _msg(
                "🎉 你通过了执业医师考试！获得医师资格证。从此可以独立行医了！声誉+10。",
                "success",
              );
            } else {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 15);
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
              _msg(
                "😔 差了几分没过。明年再战，这次有了经验会更有把握。",
                "warning",
              );
            }
          },
        },
        {
          text: "📋 边工作边备考",
          hint: "平衡但通过率较低",
          apply: function (st) {
            if (_chance(0.45)) {
              st.flags = st.flags || {};
              st.flags._passedMedLicense = true;
              var certs = st.certificates || [];
              if (certs.indexOf("medical_license") < 0)
                certs.push("medical_license");
              st.certificates = certs;
              _msg(
                "🎉 辛苦了一年，终于通过了执业医师考试！获得医师资格证。",
                "success",
              );
            } else {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
              _msg("📅 太忙了，复习时间不够。下次得全职备考才行。", "info");
            }
          },
        },
      ],
    },

    {
      id: "doc_conflict_with_pharma",
      phase: "street",
      icon: "💊",
      title: "医药代表拜访",
      story:
        "一名医药代表找到你，暗示只要你在处方中多用他们公司的药，每月会有「额外津贴」。这药效果和现有药物差不多，但价格高出三倍。",
      probability: 0.025,
      repeatable: false,
      conditions: function (st) {
        return (
          _path(st, "doctor") &&
          _workDays(st) > 365 &&
          st.career.currentJob.id !== "doc_intern"
        );
      },
      choices: [
        {
          text: "🚫 严词拒绝，并上报医德医风办公室",
          hint: "坚守原则",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) cap.reputation = Math.min(100, cap.reputation + 12);
            _clamp(cap);
            _msg(
              "✅ 你将情况报告了医德办。医院决定在全院通报警示该代表，你的职业道德获得一致好评。声誉+12。",
              "success",
            );
          },
        },
        {
          text: "🤫 收下名片但不表态",
          hint: "不得罪，也不违规",
          apply: function (st) {
            _msg(
              "💼 你收了名片但没有承诺什么。留条后路，但这个圈子比你想象的小。",
              "info",
            );
            var cap = _cap(st);
            if (cap)
              cap.industryResources = Math.min(100, cap.industryResources + 3);
            _clamp(cap);
          },
        },
        {
          text: "💰 接受合作",
          hint: "有道德风险",
          apply: function (st) {
            if (_chance(0.6)) {
              st.resources.cash += 3000;
              _msg(
                "💸 你每个月多拿了约¥3000「学术费」。你知道这不是完全合规的。",
                "warning",
              );
            } else {
              var cap = _cap(st);
              if (cap) cap.reputation = Math.max(0, cap.reputation - 15);
              _clamp(cap);
              _msg(
                "⚠️ 事情败露了！有人举报了你，医务科找你约谈。声誉-15。",
                "warning",
              );
            }
          },
        },
      ],
    },

    // ================================================================
    //  事业单位路径（public_institution）— v3.11 新增
    // ================================================================
    {
      id: "pi_bianzhi_exam",
      phase: "street",
      icon: "📋",
      title: "编制考试机会",
      story:
        "单位通知：2026年度事业编制公开招聘开始报名。你现在的岗位还是合同制，考上编制才能真正稳定下来。",
      probability: 0.03,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "public_institution") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "📚 全力备考事业编考试",
          hint: "争取铁饭碗",
          apply: function (st) {
            if (_chance(0.5)) {
              st.flags = st.flags || {};
              st.flags._hasBianzhi = true;
              var cap = _cap(st);
              if (cap) cap.reputation = Math.min(100, cap.reputation + 15);
              _clamp(cap);
              st.resources.cash += 5000;
              _msg(
                "🎉 你成功考上事业编制！从此有了「铁饭碗」，单位奖励¥5000，声誉+15。",
                "success",
              );
            } else {
              st.player.mental = Math.max(0, (st.player.mental || 50) - 10);
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
              _msg(
                "📖 笔试过了但面试被刷。明年继续，这次攒了经验。心理-10，疲劳+20。",
                "warning",
              );
            }
          },
        },
        {
          text: "⏳ 再等等，过两年准备充分了再考",
          hint: "推迟机会",
          apply: function (st) {
            _msg("📅 你决定先积累经验和人脉，等时机成熟再考编。", "info");
          },
        },
      ],
    },

    {
      id: "pi_assessment_year_end",
      phase: "street",
      icon: "📊",
      title: "年终述职考评",
      story:
        "单位年度考核开始了。处长要求每人做5分钟PPT述职。你平时工作勤恳但不善言辞，隔壁工位的小王年年考核第一。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "public_institution") && _workDays(st) > 180;
      },
      choices: [
        {
          text: "📊 花一周精心准备PPT和数据",
          hint: "用实力说话",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
              if (st.career.currentJob) {
                st.career.currentJob.salary = Math.round(
                  st.career.currentJob.salary * 1.05,
                );
              }
              _msg(
                "📈 述职结果优秀！处长在大会上表扬了你，年度考核「优秀」，薪资+5%。声誉+8。",
                "success",
              );
            } else {
              _msg(
                "📋 述职平稳完成，考核「称职」。你的努力处长看到了，但不善表达还是吃亏。",
                "info",
              );
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          },
        },
        {
          text: "🍵 向分管领导提前沟通工作成果",
          hint: "先做铺垫",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) {
              cap.partnerTrust = Math.min(100, cap.partnerTrust + 5);
              var score = cap.partnerTrust || 0;
              _clamp(cap);
              _msg(
                "💬 领导提前了解了你全年的工作，述职时帮你补充了几个亮点。考核顺利过关，信任+5。",
                "success",
              );
            }
          },
        },
        {
          text: "😐 随便应付，反正大家都差不多",
          hint: "表现平平",
          apply: function (st) {
            _msg(
              "📝 你匆匆交了述职报告。考核结果「基本称职」，无功无过。",
              "info",
            );
          },
        },
      ],
    },

    {
      id: "pi_policy_writing_opportunity",
      phase: "street",
      icon: "📜",
      title: "参与政策文件起草",
      story:
        "处长点名让你参与一项市级政策的起草工作。这是展现能力的好机会，但也意味着连续一段时间的加班和巨大压力。",
      probability: 0.02,
      repeatable: false,
      conditions: function (st) {
        return _path(st, "public_institution") && _workDays(st) > 365;
      },
      choices: [
        {
          text: "✅ 接下任务，全力以赴",
          hint: "高风险高收益",
          apply: function (st) {
            if (_chance(0.6)) {
              var cap = _cap(st);
              if (cap) cap.reputation = Math.min(100, cap.reputation + 15);
              _clamp(cap);
              st.resources.cash += 3000;
              _msg(
                "🏆 你起草的政策文件获得市领导批示肯定！单位通报表扬，名声大噪。声誉+15，奖金¥3000。",
                "success",
              );
            } else {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 30);
              st.player.mental = Math.max(0, (st.player.mental || 50) - 12);
              _msg(
                "📄 政策被退回修改了好几轮。虽然最终通过了，但过程极其痛苦。疲劳+30，心理-12。",
                "warning",
              );
            }
          },
        },
        {
          text: "🙏 以目前工作已满为由婉拒",
          hint: "保守稳妥",
          apply: function (st) {
            _msg("😮‍💨 你婉拒了。别的同事接了任务，你的生活暂时清净了。", "info");
          },
        },
      ],
    },

    {
      id: "pi_public_service_campaign",
      phase: "street",
      icon: "🤝",
      title: "社区服务公益活动",
      story:
        "单位牵头组织一次社区公益活动——为老年人免费体检和健康咨询。处长希望大家自愿报名参加。",
      probability: 0.04,
      repeatable: true,
      conditions: function (st) {
        return _path(st, "public_institution") && _workDays(st) > 90;
      },
      choices: [
        {
          text: "✋ 报名参加，周末去社区服务",
          hint: "积累群众基础和领导印象",
          apply: function (st) {
            var cap = _cap(st);
            if (cap) cap.reputation = Math.min(100, cap.reputation + 6);
            _clamp(cap);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            _msg(
              "🤝 你在活动中表现积极，社区书记说「这小伙子/姑娘不错」。月末总结被点名表扬。声誉+6，心情+5。",
              "success",
            );
          },
        },
        {
          text: "😐 有事去不了",
          hint: "不参加也没事",
          apply: function (st) {
            _msg(
              "📋 你没报名，处长也没说什么。但去参加的同事月底得了表扬。",
              "info",
            );
          },
        },
      ],
    },

    // ====================================================================
    // v3.99 (loop R3) 联动增强：设计/法律/运营 三条路径首次专属事件
    // 设计意图：career_path_events.js 原仅覆盖 10 条路径，design/legal/operations
    //   三条路径零专属叙事。本轮各补 1 个路径专属事件。
    // [自洽修复] 守卫：_path(st, "pathId") + workDays>N + seen flag
    // ====================================================================

    // ====== 设计路径：客户改稿危机 ======
    {
      id: "design_client_revision",
      phase: "street",
      icon: "🎨",
      title: "客户改稿危机",
      story:
        "客户第 7 次把设计稿退回来：「感觉不对，再改改。」\n\n你盯着屏幕上的配色和排版，专业判断告诉你这稿已经达标了——但对方是甲方。\n\n「感觉不对」四个字，是每个设计师的噩梦。",
      conditions: function (st) {
        // [R16 域C修复] 移除冗余 _chance (已由 probability 控制); 加 st.flags 守卫
        return (
          _path(st, "design") &&
          _workDays(st) > 60 &&
          (!st.flags || !st.flags._designRevisionSeen)
        );
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🎨 引导客户说出具体需求",
          hint: "专业方法化解，设计XP+10、声誉+5",
          apply: function (st) {
            // [A类修复 loop R16] "design" 非真实技能键(state.skills 无 design)，
            //   addSkillXp 内部 state.skills[key] 未命中即静默丢弃 → 奖励永远无效。
            //   设计路径在 CAREER_PATHS 中以 coding 为门槛技能(reqSkills.coding)，改用 coding。
            if (typeof addSkillXp === "function") addSkillXp("coding", 10);
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 5);
              _clamp(cap);
            }
            _msg(
              "🎨 你用专业问卷引导客户表达了真实需求。三稿过！设计功底(编程/工具)XP+10，声誉+5。",
              "success",
            );
          },
        },
        {
          text: "😤 照改，但要加钱",
          hint: "加签补充协议，但关系-",
          apply: function (st) {
            st.resources.cash = (st.resources.cash || 0) + 800;
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.max(0, cap.reputation - 3);
              _clamp(cap);
            }
            _msg(
              "😤 你让客户加了¥800改动费。钱到账了，但电话里他的语气冷了。现金+¥800，声誉-3。",
              "warning",
            );
          },
        },
      ],
    },

    // ====== 法律路径：庭审第一次 ======
    {
      id: "legal_first_trial",
      phase: "street",
      icon: "⚖️",
      title: "第一次上庭",
      story:
        "师傅把案子卷宗推给你：「今天你主讲，我在旁边把关。」\n\n你握着装订了三天的证据册走进法庭，手心的汗把封面浸了一块深色。\n\n对面是执业十五年的老律师，法官的表情看不出倾向——但你已经准备了每一个可能被追问的角度。\n\n这是你职业生涯的第一个庭。",
      conditions: function (st) {
        return (
          _path(st, "legal") &&
          _workDays(st) > 90 &&
          (!st.flags || !st.flags._legalFirstTrialSeen)
        );
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🎤 据理力争，打出气势",
          hint: "庭审表现+，师傅认可",
          apply: function (st) {
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._legalFirstTrialSeen = true;
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 10);
              _clamp(cap);
            }
            _msg(
              "🎤 你顶住了对方律师的反击，法官三次点头。师傅在庭后说「这孩子能扛事」。声誉+10。",
              "success",
            );
          },
        },
        {
          text: "📋 申请调解，稳妥收场",
          hint: "师傅失望，但案子平和结束",
          apply: function (st) {
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._legalFirstTrialSeen = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            _msg(
              "📸 你提议调解、促成和解。师傅说你不够拼，但当事人握手言和让你心里踏实。心情+8。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 运营路径：线上活动突发事件 ======
    {
      id: "ops_campaign_crisis",
      phase: "street",
      icon: "📦",
      title: "线上活动突发崩了",
      story:
        "大促正进行时，服务器突然崩溃。\n\n老板在群里连发了五个问号，运营总监把所有组长拉到紧急会议室。\n\n你的 KPI 挂在这活动上——但备份策略半年前你提过，预算没批。\n\n要不要现在说「我早说过」？",
      conditions: function (st) {
        return (
          _path(st, "operations") &&
          _workDays(st) > 75 &&
          (!st.flags || !st.flags._opsCampaignCrisisSeen)
        );
      },
      probability: 0.05,
      repeatable: true,
      choices: [
        {
          text: "🛠️ 先救火，不提旧账",
          hint: "紧急修复+事后请功",
          apply: function (st) {
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._opsCampaignCrisisSeen = true;
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 8);
              _clamp(cap);
            }
            _msg(
              "🛠️ 你连夜抢修，活动数据在凌晨4点恢复。总监在晨会上当众表扬，避而不提旧事是高情商。声誉+8。",
              "success",
            );
          },
        },
        {
          text: "📝 救援 + 同时补交复盘报告",
          hint: "专业但得罪人",
          apply: function (st) {
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._opsCampaignCrisisSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 15);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            _msg(
              "📝 你修完bug又写了11页复盘报告，老板点头但老同事觉得你在刷存在感。管理XP+15，疲劳+15。",
              "info",
            );
          },
        },
      ],
    },

    // ====== 联动增强（Domain C 轮次）：职业成长 → 核心/经济/社交 桥接 ======
    // [全系统自洽修复] 域C 联动:职业巅峰(满级有收益 C→G) + 年终加薪(C→E) + 行业饭局(C→D/E 社会比较)
    {
      id: "career_apex_peak",
      phase: "street",
      // [全系统自洽修复] 域B 修复: 缺失 phase 字段 → 注入 queueRandomEvent 时被过滤永不触发
      icon: "🏔️",
      title: "职业巅峰",
      story:
        "你站在了这条职业路径的顶端。窗外城市灯火通明，你想起当年刚入行时连报销单都不会填。\n\n这一路，有人提携，也有人使绊。如今你成了后来者眼中的「那个前辈」。",
      probability: 0.5,
      repeatable: false,
      conditions: function (st) {
        // [R16 域C修复] 移除副作用(st.flags写入)，加 st.flags 守卫
        var job = _job(st);
        if (!job || !job.path) return false;
        var path =
          typeof CAREER_PATHS !== "undefined" ? CAREER_PATHS[job.path] : null;
        if (!path || !path.levels || !path.levels.length) return false;
        var top = path.levels[path.levels.length - 1];
        if (!top || job.id !== top.id) return false;
        return (
          !st.flags ||
          !(st.flags._careerApexSeen && st.flags._careerApexSeen[job.path])
        );
      },
      choices: [
        {
          text: "🌅 享受这一刻",
          hint: "声望+5，心情+12（峰终时刻）",
          apply: function (st) {
            st.flags._careerApexSeen = st.flags._careerApexSeen || {};
            st.flags._careerApexSeen[st.career.currentJob.path] = true;
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 5);
              _clamp(cap);
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            _msg(
              "🏔️ 你登上了职业巅峰，行业声望+5，久违的满足感涌上心头。心情+12。",
              "success",
            );
          },
        },
        {
          text: "🎯 巅峰也是新起点",
          hint: "声望+3，管理XP+20",
          apply: function (st) {
            st.flags._careerApexSeen = st.flags._careerApexSeen || {};
            st.flags._careerApexSeen[st.career.currentJob.path] = true;
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 3);
              _clamp(cap);
            }
            if (typeof addSkillXp === "function") addSkillXp("management", 20);
            _msg("🎯 你把巅峰当作新起点，钻研更深的领域。管理XP+20。", "info");
          },
        },
      ],
    },
    {
      id: "career_senior_bonus",
      phase: "street",
      // [全系统自洽修复] 域B 修复: 缺失 phase 字段 → 注入 queueRandomEvent 时被过滤永不触发
      icon: "🧧",
      title: "年终加薪",
      story:
        "HR 找你谈年度评定。\n\n「你今年的绩效在组里排前 20%。按制度，给你上调一档薪资，外加一笔年终奖。」\n\n具体的数字，取决于你的级别。",
      probability: 0.35,
      repeatable: true,
      conditions: function (st) {
        var job = _job(st);
        if (!job) return false;
        return _workDays(st) > 365;
      },
      choices: [
        {
          text: "💰 收下，犒劳自己",
          hint: "现金+[PLACEHOLDER 倍数待playtest]，设高级收入档",
          apply: function (st) {
            var job = _job(st);
            var salary = (job && job.salary) || 8000;
            var mult = 1.5; // [PLACEHOLDER] 年终奖倍数待 playtest 标定（建议 1~2 倍月薪）
            var cash = Math.round(salary * mult);
            st.resources.cash = (st.resources.cash || 0) + cash;
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._seniorIncomeTier = true;
            _msg(
              "🧧 年终奖到手 ¥" + cash + "！你给自己加了顿好的。",
              "success",
            );
          },
        },
        {
          text: "📈 全部存起来",
          hint: "现金+同上，转投资本金",
          apply: function (st) {
            var job = _job(st);
            var salary = (job && job.salary) || 8000;
            var mult = 1.5; // [PLACEHOLDER] 同上
            var cash = Math.round(salary * mult);
            st.resources.cash = (st.resources.cash || 0) + cash;
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._seniorInvestReady = true;
            _msg("📈 年终奖 ¥" + cash + " 转入投资账户，静待复利。", "info");
          },
        },
      ],
    },
    {
      id: "career_industry_dinner",
      phase: "street",
      // [全系统自洽修复] 域B 修复: 缺失 phase 字段 → 注入 queueRandomEvent 时被过滤永不触发
      icon: "🍷",
      title: "行业饭局",
      story:
        "同行群里有人组局，据说是圈内大佬做东。去的话得自费打车加份子钱，但不去可能错过人脉。\n\n以你现在的级别，去不去？",
      probability: 0.3,
      repeatable: true,
      conditions: function (st) {
        return _workDays(st) > 180 && _workDays(st) < 2000;
      },
      choices: [
        {
          text: "🍷 去，混个脸熟",
          hint: "花费¥[PLACEHOLDER]，声望+4（社会比较/禀赋）",
          apply: function (st) {
            var cost = 500; // [PLACEHOLDER] 饭局花费待 playtest 标定
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
            var cap = _cap(st);
            if (cap) {
              cap.reputation = Math.min(100, cap.reputation + 4);
              _clamp(cap);
            }
            st.flags = st.flags || {}; // [R16 域C修复]
            st.flags._industryDinnerCount =
              (st.flags._industryDinnerCount || 0) + 1;
            _msg(
              "🍷 饭局上你认识了几个同行，交换了微信。声望+4，花了¥" +
                cost +
                "。",
              "success",
            );
          },
        },
        {
          text: "🏠 不去，攒钱要紧",
          hint: "守住现金，错过人脉",
          apply: function (st) {
            _msg("🏠 你婉拒了饭局。钱袋子保住了，但少了一层人脉。", "hint");
          },
        },
      ],
    },
  ];

  // 推入全局随机事件池
  if (typeof RANDOM_EVENTS !== "undefined") {
    for (var i = 0; i < EVENTS.length; i++) {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();
