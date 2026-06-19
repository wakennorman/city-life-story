# -*- coding: utf-8 -*-
events_js_path = "D:/Claude Code+DeepSeekV4/city-life-story/src/js/core/events.js"

events_code = """

  // ---- ⑤ 社会民生与街头（7个） ----

  {
    id: "street_vendor_crackdown",
    phase: "street",
    icon: "\U0001f6a8",
    title: "城管来了",
    story: "区里创文创卫检查，城管突然严打——三轮车被没收了五辆。老赵的车被抬上卡车时他差点哭了：「我贷款买的车啊……」但街角那个有固定摊位的人照样做生意——有关系和没关系，就是不一样。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 10 && !st.flags._vendorCrackdownSeen;
    },
    choices: [
      { text: "\U0001f3ea 花钱办个固定摊位证", hint: "花¥2000办证，以后合法经营", apply: function(st) {
        st.flags._vendorCrackdownSeen = true;
        if (st.resources.cash >= 2000) {
          st.resources.cash -= 2000;
          st.flags._legalStallPermit = true;
          StateManager.addMessage("\U0001f3ea 你办了摊位证。贵，但再也不用躲城管了。", "event");
        } else {
          StateManager.addMessage("\U0001f3ea 连办证的钱都没有。你推着车躲了一天。", "warning");
        }
      }},
      { text: "\U0001f6b6 转做流动摊贩——打游击", hint: "低成本，但可能被没收装备", apply: function(st) {
        st.flags._vendorCrackdownSeen = true;
        st.flags._guerrillaVendor = true;
        StateManager.addMessage("\U0001f6b6 你学会了看风使舵——听到风声就收摊跑。生存技能+1。", "info");
      }},
      { text: "\U0001f4e2 帮被没收车的人去要车", hint: "跑腿费¥100/次，需要关系", apply: function(st) {
        st.flags._vendorCrackdownSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
        st.resources.cash += 100;
        StateManager.addMessage("\U0001f4e2 你帮老赵要回了三轮车。他千恩万谢。", "success");
      }},
    ],
  },

  {
    id: "minimum_wage_hike",
    phase: "street",
    icon: "\U0001f3c3",
    title: "最低工资上调",
    story: "市人社局发公告了：最低工资从¥2200调到¥2480。餐馆门口贴出了新菜单——「因人工成本上涨，部分菜品价格上调5%~10%」。王婶说：「涨工资是好事——但物价涨得比工资快。」",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 30 && !st.flags._minWageHikeSeen;
    },
    choices: [
      { text: "\U0001f4b0 这是好事——你的收入会涨", hint: "部分工作收入+10%", apply: function(st) {
        st.flags._minWageHikeSeen = true;
        st.flags._minWageRaised = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 8);
        StateManager.addMessage("\U0001f4b0 你的日结工资确实涨了——虽然不多，但够每天加个蛋。", "success");
      }},
      { text: "\U0001f3e0 担心房东要涨房租", hint: "物价上涨后房租通常跟着涨", apply: function(st) {
        st.flags._minWageHikeSeen = true;
        st.flags._rentWillIncrease = true;
        StateManager.addMessage("\U0001f3e0 房东果然在群里暗示了。涨¥100——不多，但工资涨的那点全填进去了。", "info");
      }},
      { text: "\U0001f4ad 跟工友讨论要不要找老板谈加薪", hint: "人多力量大，但也可能被开除", apply: function(st) {
        st.flags._minWageHikeSeen = true;
        st.flags._wageNegotiation = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
        StateManager.addMessage("\U0001f4ad 大家商量好了——一起去找老板。你被推选为代表。", "event");
      }},
    ],
  },

  {
    id: "social_security_reform",
    phase: "street",
    icon: "\U0001f3db️",
    title: "社保改革来了",
    story: "社保入税新政实施——以前最低基数交社保，现在必须按实际工资足额缴纳。灵活就业群里炸了锅：「自己交社保，一个月¥1500——我一个月才赚¥5000！」有人说不交了，有人说老了怎么办。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 40 && !st.flags._socialSecuritySeen;
    },
    choices: [
      { text: "\U0001f4b0 咬咬牙按最低档交社保", hint: "¥800/月，长远看是保障", apply: function(st) {
        st.flags._socialSecuritySeen = true;
        st.flags._paySocialSecurity = true;
        if (st.resources.cash >= 800) {
          st.resources.cash -= 800;
          StateManager.addMessage("\U0001f4b0 你交了¥800社保。心疼——但想到老了至少有个依靠。", "event");
        } else {
          StateManager.addMessage("\U0001f4b0 连¥800都掏不出来。你第一次真切感受到什么是「生存大于生活」。", "info");
        }
      }},
      { text: "\U0001f4bc 找个正规公司上班——让公司交", hint: "有稳定工作才能有社保", apply: function(st) {
        st.flags._socialSecuritySeen = true;
        st.flags._wantFormalJob = true;
        StateManager.addMessage("\U0001f4bc 你开始认真找工作了——不为别的，就为那五险一金。", "event");
      }},
      { text: "\U0001f91f 赌自己不会生病——不交了", hint: "省钱但高风险", apply: function(st) {
        st.flags._socialSecuritySeen = true;
        st.flags._noSocialSecurity = true;
        StateManager.addMessage("\U0001f91f 你赌自己年轻不会出事。年轻是你唯一的资本。", "info");
      }},
    ],
  },

  {
    id: "garbage_classification",
    phase: "street",
    icon: "\U0001f5d1️",
    title: "垃圾分类来了",
    story: "小区楼下多了四个颜色的垃圾桶。居委会大妈每天早晚站在垃圾桶边：「你这是什么垃圾？」有个人因为没分类被罚了¥50。但有人发现了商机——「代扔垃圾，¥5一次」。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 15 && !st.flags._garbageClassSeen;
    },
    choices: [
      { text: "\U0001f468‍\U0001f3eb 报名做垃圾分类指导员", hint: "收入不高但有名气加成", apply: function(st) {
        st.flags._garbageClassSeen = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
        st.resources.cash += 50;
        StateManager.addMessage("\U0001f468‍\U0001f3eb 你穿上了志愿者马甲。站了一天——比打工轻松。", "info");
      }},
      { text: "\U0001f6b6 帮人代扔垃圾", hint: "¥5/次，靠勤劳赚钱", apply: function(st) {
        st.flags._garbageClassSeen = true;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
        st.resources.cash += 60;
        StateManager.addMessage("\U0001f6b6 你帮几户老年人扔了垃圾。¥5不多，但积少成多。", "info");
      }},
      { text: "\U0001f4d6 认真学习分类规则", hint: "不被罚款就是赚", apply: function(st) {
        st.flags._garbageClassSeen = true;
        st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 1);
        StateManager.addMessage("\U0001f4d6 你背了分类口诀。「猪能吃的是湿垃圾」——记住了。", "success");
      }},
    ],
  },

  {
    id: "short_video_fever",
    phase: "street",
    icon: "\U0001f3a5",
    title: "短视频风口",
    story: "这条街上出了个网红——卖炒粉的阿珍，一个「炒粉翻锅」视频涨了10万粉。现在她直播炒粉，一晚流水¥3000。你也掏出手机试了试——拍了三条，播放量分别是12、3、0。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 25 && !st.flags._shortVideoSeen;
    },
    choices: [
      { text: "\U0001f3a5 认真做短视频——记录城市打工生活", hint: "投入精力不一定有回报", apply: function(st) {
        st.flags._shortVideoSeen = true;
        st.flags._triedShortVideo = true;
        var luck = Math.random();
        if (luck < 0.15) {
          st.flags._shortVideoWentViral = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
          st.resources.cash += 5000;
          StateManager.addMessage("\U0001f3a5 你拍的一条「城中村早餐摊」突然爆了！播放量200万！后台私信炸了。", "event");
        } else if (luck < 0.5) {
          st.resources.cash += 200;
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
          StateManager.addMessage("\U0001f3a5 你坚持发了一个月。有了500个粉丝——不多，但有人在看。", "info");
        } else {
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          StateManager.addMessage("\U0001f3a5 你拍了30条视频，平均播放量不到50。这行不是谁都能干的。", "info");
        }
      }},
      { text: "\U0001f4e6 给阿珍供货——她带货需要货源", hint: "做供应链赚钱稳", apply: function(st) {
        st.flags._shortVideoSeen = true;
        if (st.resources.cash >= 1000) {
          st.resources.cash -= 1000;
          st.flags._influencerSupply = true;
          StateManager.addMessage("\U0001f4e6 你跟阿珍谈了合作——她卖货你供货。靠谱的生意。", "event");
        } else {
          StateManager.addMessage("\U0001f4e6 想供货但没本钱。阿珍说：「下次吧。」", "info");
        }
      }},
      { text: "\U0001f4f1 刷短视频消磨时间", hint: "啥也不干", apply: function(st) {
        st.flags._shortVideoSeen = true;
        st.needs.happiness = Math.min(100, st.needs.happiness + 3);
        StateManager.addMessage("\U0001f4f1 刷了一晚上短视频。时间就这么过去了。", "info");
      }},
    ],
  },

  {
    id: "exam_competition",
    phase: "street",
    icon: "\U0001f4dd",
    title: "考公大军",
    story: "大学城旁边的书店里，考研和考公的资料占了整整两面墙。今年国考报名人数突破300万——一个岗位招1个，17000人报名。辅导班的广告说：「不过全退。」但学费¥49800。有人在大学城旁边开了钟点房——考试那周暴涨到¥500一晚。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 35 && !st.flags._examCompetitionSeen && (st.player.intelligence || 0) >= 20;
    },
    choices: [
      { text: "\U0001f4da 买套考公资料自己学", hint: "¥300，智力+2，开启一个新方向", apply: function(st) {
        st.flags._examCompetitionSeen = true;
        if (st.resources.cash >= 300) {
          st.resources.cash -= 300;
          st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
          st.flags._studyingCivilExam = true;
          StateManager.addMessage("\U0001f4da 你买了行测和申论。翻开第一页——15年前的知识好像在脑子里还没丢完。", "event");
        } else {
          StateManager.addMessage("\U0001f4da 连¥300的书都买不起。你心想——算了吧，搬砖更适合我。", "info");
        }
      }},
      { text: "\U0001f3e0 在大学城附近租间房做日租", hint: "考试期间需求暴涨", apply: function(st) {
        st.flags._examCompetitionSeen = true;
        if (st.resources.cash >= 3000) {
          st.resources.cash -= 3000;
          st.flags._examRentalBiz = true;
          StateManager.addMessage("\U0001f3e0 你租了一间房做日租。考试那几天赚了¥2000。", "event");
        } else {
          StateManager.addMessage("\U0001f3e0 想做日租生意但没启动资金。机会是给有准备的人的。", "info");
        }
      }},
      { text: "\U0001f3ea 去辅导班发传单", hint: "日结¥120", apply: function(st) {
        st.flags._examCompetitionSeen = true;
        st.resources.cash += 120;
        st.needs.fatigue = Math.min(100, st.needs.fatigue + 5);
        StateManager.addMessage("\U0001f3ea 你发了一天传单。每一个接过传单的人脸上都写着焦虑。", "info");
      }},
    ],
  },

  {
    id: "health_scam",
    phase: "street",
    icon: "\U0001f9ec",
    title: "免费体检陷阱",
    story: "街口新开了一家「健康理疗中心」，门口写着「免费测血压、测血糖、送鸡蛋一斤」。一群老年人排着队进去了。两个小时后每个人出来都提着一袋¥2980的「纳米磁疗被」。你知道是骗局——但那些老人笑得挺开心。",
    conditions: function(st) {
      return st.player.phase === "street" && st.player.day >= 20 && !st.flags._healthScamSeen;
    },
    choices: [
      { text: "\U0001f4e2 去揭穿骗局——告诉那些老人", hint: "名声+5，但可能被威胁", apply: function(st) {
        st.flags._healthScamSeen = true;
        st.flags._scamWhistleblower = true;
        st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
        var danger = Math.random();
        if (danger < 0.3) {
          st.status.health = Math.max(0, st.status.health - 5);
          StateManager.addMessage("\U0001f4e2 你被理疗中心的人威胁了。「多管闲事的下场你知道吧？」你说知道了。", "warning");
        } else {
          StateManager.addMessage("\U0001f4e2 你成功劝住了三个老人。他们的子女打电话来感谢你。", "event");
        }
      }},
      { text: "\U0001f4b0 去应聘做推销员——拿提成", hint: "灰色收入，卖一单提成¥500", apply: function(st) {
        st.flags._healthScamSeen = true;
        st.flags._scamSalesman = true;
        st.resources.cash += 500;
        st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
        StateManager.addMessage("\U0001f4b0 你卖出了一床被子。¥500提成拿到手——但那老太太说「小伙子你是个好人」的时候你不敢看她的眼睛。", "event");
      }},
      { text: "\U0001f6b6 领了鸡蛋就走", hint: "免费鸡蛋不拿白不拿", apply: function(st) {
        st.flags._healthScamSeen = true;
        st.needs.hunger = Math.min(100, st.needs.hunger + 3);
        StateManager.addMessage("\U0001f6b6 你领了一斤鸡蛋，听完推销就走了。销售在背后骂骂咧咧。", "info");
      }},
    ],
  },

"""

with open(events_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: now the last event in RANDOM_EVENTS is ev_price_war from Part 2.
# We need to insert AFTER its closing }, but BEFORE ];
# The current structure at end: "  },\n];\n\n/* ===== ... */"
# We want: "  },\n[new_events]  },\n];\n\n/* ===== ... */"

old_marker = "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"
new_marker = events_code + "  },\n];\n\n/* =========================================================\n * 二、事件触发与队列管理"

if old_marker in content:
    content = content.replace(old_marker, new_marker)
    with open(events_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Part 3 inserted!")
    # Check for the double } issue
    double_count = content.count("  },\n\n  },")
    print("Potential double }} count:", double_count)
else:
    print("ERROR: old_marker not found!")
    idx = content.find("二、事件触发与队列管理")
    if idx >= 0:
        print("Found at byte", idx)
        print("Context:", repr(content[idx-200:idx+20]))