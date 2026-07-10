// 城市浮生记 — 首页
const app = getApp();

Page({
  data: {
    motto: "在这座城市里，每个人都有自己的故事。",
    gameTitle: "城市浮生记",
    gameSubtitle: "City Life Story",
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: "城市浮生记" });
  },
  // 开始游戏
  startGame() {
    wx.navigateTo({
      url: "/pages/game/game",
    });
  },
  // 查看个人中心
  goProfile() {
    wx.switchTab({
      url: "/pages/profile/profile",
    });
  },
});
