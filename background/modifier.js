chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [1], // 先移除可能存在的规则
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "User-Agent",
            operation: "set",
            value: "HiFiNi歌词扩展/1.0",
          },
          {
            header: "X-HiFiNi-Extension",
            operation: "set",
            value: "true",
          },
        ],
      },
      condition: {
        urlFilter: "ipinfo.leskur.cn", // 只修改这个域名的请求
        resourceTypes: ["xmlhttprequest"],
      },
    },
  ],
});
