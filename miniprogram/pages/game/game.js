// 城市浮生记 — 游戏主页面（WebView 嵌入）
Page({
  data: {
    gameUrl: "https://wakennorman.github.io/city-life-story/dist/index.html",
    loading: true,
    loadError: false,
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: "城市浮生记" });
  },
  onWebViewLoad() {
    this.setData({ loading: false, loadError: false });
  },
  onWebViewError() {
    this.setData({ loading: false, loadError: true });
  },
  retry() {
    this.setData({ loading: true, loadError: false });
  },
});
