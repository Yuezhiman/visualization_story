// 说明：我peak的临界值选取了0.6，对于大于0.6的点展示在花朵图内部。同时也代表了时间线图上山峰的高度
// 最好将事件按时间顺序排列，不然山峰会出bug
const events = [
  {
    title: "成为部门主管",
    description: "晋升为部门主管，承担更多管理职责。",
    time: new Date("2015-06-01"),
    peak: 0.85,  // 高于临界值，属于核心事件
    category: "职业",
    image: "career1.jpg",
    video: "career1.mp4"
  },
  {
    title: "孩子出生",
    description: "迎来了人生中的第一个孩子。",
    time: new Date("2018-03-10"),
    peak: 0.9,
    category: "家庭",
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
