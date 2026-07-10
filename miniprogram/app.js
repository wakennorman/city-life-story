// 城市浮生记 — 微信小程序
App({
  onLaunch() {
    // 初始化本地存储
    const profile = wx.getStorageSync("citylife_profile");
    if (!profile) {
      wx.setStorageSync("citylife_profile", {
        nickName: "城市漂流者",
        playCount: 0,
        maxWealth: 0,
        maxDays: 0,
        firstPlay: Date.now(),
      });
    }
  },
  globalData: {
    userInfo: null,
  },
});
