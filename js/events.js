// 说明：我peak的临界值选取了0.6，对于大于0.6的点展示在花朵图内部。同时也代表了时间线图上山峰的高度
// 最好将事件按时间顺序排列，不然山峰会出bug
const events = [
  {
    title: "选秀起点：高中生的逆袭",
    description: "以高中生身份第 13 顺位被黄蜂选中，交易至湖人开启传奇生涯。",
    time: new Date("1996-06-26"),
    peak: 0.85,  // 高于临界值，属于核心事件
    category: "职业",
    image: ["1-1.png","1-2.jpg"],
    video: "1-3.mp4"
  },
  {
    title: "扣篮大赛：初露锋芒",
    description: "全明星周末斩获扣篮大赛冠军（19 岁，NBA 历史最年轻扣篮王），新秀赛 31 分创纪录。",
    time: new Date("1997-02-08"),
    peak: 0.9,
    category: "职业",
    image: "family1.jpg"
  },
  {
  title: "二胎",
  description: "相应国家政策",
  time: new Date("2020-01-01"),
  peak: 0.8,
  category: "家庭",
  images: ["pic1.jpg", "pic2.jpg"],
  video: "video1.mp4"
  },
  {
    title: "志愿者活动",
    description: "参与环保公益组织，为城市清洁做出贡献。",
    time: new Date("2020-09-15"),
    peak: 0.4,  // 低于临界值，放在外圈
    category: "社会责任",
    image: "social1.jpg"
  },
  {
    title: "发起创业项目",
    description: "成立个人创业公司。",
    time: new Date("2021-01-01"),
    peak: 0.7,
    category: "职业",
    video: "startup.mp4"
  }
  
];
