// 城市浮生记 — 个人中心
const app = getApp();

Page({
  data: {
    nickName: "城市漂流者",
    avatarUrl: "/images/app-icon.png",
    stats: [
      { label: "游玩次数", value: "0" },
      { label: "最高总资产", value: "¥0" },
      { label: "最长生存", value: "0天" },
    ],
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: "我的" });
    this.loadProfile();
  },
  onShow() {
    this.loadProfile();
  },
  loadProfile() {
    const profile = wx.getStorageSync("citylife_profile") || {};
    this.setData({
      nickName: profile.nickName || "城市漂流者",
      stats: [
        { label: "游玩次数", value: String(profile.playCount || 0) },
        {
          label: "最高总资产",
          value: "¥" + (profile.maxWealth || 0).toLocaleString(),
        },
        { label: "最长生存", value: (profile.maxDays || 0) + "天" },
      ],
    });
  },
  // 清除数据
  clearData() {
    wx.showModal({
      title: "提示",
      content: "确定要清除所有本地数据吗？",
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.loadProfile();
          wx.showToast({ title: "已清除", icon: "success" });
        }
      },
    });
  },
});
