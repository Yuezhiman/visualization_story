// 说明：我peak的临界值选取了0.6，对于大于0.6的点展示在花朵图内部。同时也代表了时间线图上山峰的高度
// 最好将事件按时间顺序排列，不然山峰会出bug
const events = [
  {
    title: "选秀起点：高中生的逆袭",
    description: "以高中生身份第 13 顺位被黄蜂选中，交易至湖人开启传奇生涯。",
    start: new Date("1996-06-26"),
    end: new Date("1996-06-26"),
    peak: 0.65,  // 高于临界值，属于核心事件
    category: "职业",
    image: ["1-1.png","1-2.jpg"],
    video: "1-3.mp4"
  },
  {
    title: "扣篮大赛：初露锋芒",
    description: "全明星周末斩获扣篮大赛冠军（19 岁，NBA 历史最年轻扣篮王），新秀赛 31 分创纪录。",
    start: new Date("1997-02-08"),
    end: new Date("1997-02-08"),
    peak: 0.7,
    category: "职业",
    image:[ "扣篮.gif","扣篮1.gif", "扣篮2.gif", "扣篮3.gif"],
  },
  {
  title: "三连冠：从副手到核心",
  description: "从替补到首发，总决赛 G4 带伤扭转战局，率队完成 “湖人三连冠”，成长为球队核心",
  start: new Date("2000-01-01"),
  end: new Date("2000-12-31"),
  // 如何生成时间段
  peak: 0.8,
  category: "职业",
  image: ["2-1.jpg", "2-2.jpg","2-3.png"]
  },
  {
    title: "舆论危机：形象重创",
    description: "深陷 “鹰郡事件” 性侵指控，虽刑事诉讼撤销但形象重创，赛季报销 + 商业代言流失",
    start: new Date("2003-01-01"),
    end: new Date("2003-12-31"),
    peak: 0.4,  // 低于临界值，放在外圈
    category: "社会责任",
    video: "3.mp4"
  },
  {
    title: "F4 折戟：团队的困境",
    description: "“F4 豪华阵容”（奥尼尔、科比、马龙、佩顿）总决赛爆冷负于活塞，科比命中率仅 38.1%，被批 “毒瘤”",
    start: new Date("2004-01-01"),
    end: new Date("2004-12-31"),
    peak: 0.3,
    category: "职业",
    image: ["3-1.png","3-2.png"]
  },
  {
    title: "81 分奇迹：进攻火力全开",
    description: "对阵猛龙狂砍 81 分（NBA 历史单场第二高分），诠释 “曼巴精神” 极致进攻能力",
    start: new Date("2006-01-22"),
    end: new Date("2006-01-22"),
    peak: 0.85,
    category: "职业",
    image: ["4-1.png","4-2.png","4-3.png"]
  },
  {
    title: "季后赛边缘：独木难支",
    description: "连续两年无缘季后赛，单赛季场均 31.6 分仍独木难支，球队重建期陷入 “科比去哪儿” 交易传闻漩涡s",
    start: new Date("2006-01-01"),
    end: new Date("2007-12-31"),
    peak: 0.45,
    category: "职业"
  },
  {
    title:"绿军阻击：错失巅峰一冠",
    description: "总决赛负于凯尔特人 “三巨头”，科比场均 25.7 分但关键战失误频发，错失 “单季 MVP + 总冠军” 双料登顶机会",
    start: new Date("2008-01-01"),
    end: new Date("2008-12-31"),
    peak: 0.45,
    category: "职业"
  },
  {
    title:"两连冠：复仇与巅峰",
    description:"连续两年夺冠，2010 年总决赛击败凯尔特人复仇成功，斩获个人第 5 冠并蝉联 FMVP，跻身历史顶级球星",
    start: new Date("2009-01-01"),
    end: new Date("2010-12-31"),
    peak: 0.9,
    category: "职业",
    image: ["5-1.jpg", "5-2.jpg"]
  },{
    title: "谢幕战：60 分的绝唱",
    description: "退役战狂砍 60 分逆转爵士，以 “历史最华丽谢幕” 告别赛场",
    start: new Date("2016-04-13"),
    end: new Date("2016-04-13"),
    peak: 0.95,
    category: "职业",
    image: ["11.jpg","11-2.png"],
    video: "11.mp4"
  },
  {
    title: "跨界荣耀：奥斯卡折桂",
    description: "动画短片《亲爱的篮球》获奥斯卡最佳动画短片奖，跨界破圈",
    start: new Date("2018-01-01"),
    end: new Date("2018-12-31"),
    peak: 0.9,
    category: "社会责任",
    video: "12.mp4"
  },
  {
    title: "永恒缅怀：精神的延续",
    description: "因直升机事故意外离世，全球万人空巷悼念",
    start: new Date("2020-01-26"),
    end: new Date("2020-01-26"),
    peak: 0.9,
    category: "职业",
    image: ["13-1.jpeg","13-1.jpg"],
    video: "13-1.mp4"
  },{
    title: "名人堂加冕：历史的肯定",
    description: "入选奈史密斯篮球名人堂（以球员身份首次提名即入选），职业生涯盖棺定论",
    start: new Date("2020-04-01"),
    end: new Date("2020-04-30"),
    peak: 0.85,
    category: "社会责任",
    image: ["14-1.png", "14-2.jpg", "14-3.jpg"]
  }

  
];
