import { defineConfig } from "vitepress";
import { set_sidebar } from "../utils/auto-gen-sidebar.mjs"; // 改成自己的路径
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 标题
  title: "智桥相关文档",
  // 首页描述
  description: "做大做强，再创辉煌",
  // 设置浏览器显示图标
  head: [["link", { rel: "icon", href: "/docs.png" }]],
  themeConfig: {
    // 首页logo
    logo: "/docs.png",
    // 定义右侧边栏标题
    outlineTitle: "文档目录",
    // 定义右侧边栏显示标题
    outline: [2, 6],
    // 关闭侧边栏
    // sidebar: "heading",
    // 右侧边栏靠左
    aside: "true",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "说明", link: "/markdown-examples" },
      {
        text: "相关文档",
        items: [
          // {
          //   text: "物流平台对接",
          //   link: "/document/tepbridge/logistics/zto",
          //   // items: [
          //   //   { text: "中通物流对接说明", link: "/tepbridge/logistics/zto" },
          //   //   { text: "顺丰物流对接说明", link: "/tepbridge/logistics/sf" },
          //   //   { text: "demo", link: "/tepbridge/logistics/demo" },
          //   // ],
          // },
          {
            text: "智桥API接口文档",
            link: "/document/tepbridge/api/wdtwms/universal/ApiCallingConvention",
          },
          // {
          //   text: "springsecurity",
          //   link: "/document/backend/springsecurity",
          // },
        ],
      },
    ],
    //侧边栏
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown 演示', link: '/markdown-examples' },
    //       { text: '运行API演示', link: '/api-examples' }
    //     ]
    //   },

    //   {
    //     text: 'Examples2',
    //     items: [
    //       { text: 'Markdown 演示', link: '/markdown-examples' },
    //       { text: '运行API演示', link: '/api-examples' }
    //     ]
    //   }
    // ],
    sidebar: [
      // {
      //   text: "物流对接说明",
      //   icon: "tip",
      //   collapsed: false,
      //   items: [
      //     { text: "中通物流对接说明", link: "/document/tepbridge/logistics/zto" },
      //     { text: "顺丰物流对接说明", link: "/document/tepbridge/logistics/sf" },
      //     { text: "京东物流对接说明", link: "/document/tepbridge/logistics/jd" },
      //     { text: "德邦物流对接说明", link: "/document/tepbridge/logistics/db" },
      //   ],
      // },
      {
        text: "接口文档",
        icon: "tip",
        collapsed: false,
        items: [
          {
            text: "接口调用规范",
            link: "/document/tepbridge/api/wdtwms/universal/apiCallingConvention.md"
          },
          { text: "通用API接口文档",
            items: [
              // { text: "接口调用规范", link: "/document/tepbridge/api/wdtwms/universal/apiCallingConvention.md" },
              { text: "物流公司编码", link: "/document/tepbridge/api/wdtwms/universal/logisticsCode" },
              { text: "接口文档", link: "/document/tepbridge/api/wdtwms/universal/universalApi" },
            ]
          },
          { text: "标准API接口文档",
            items: [
              // { text: "接口调用规范", link: "/document/tepbridge/api/wdtwms/standard/apiCallingConvention.md" },
              { text: "物流类型编码", link: "/document/tepbridge/api/wdtwms/standard/logisticsCode.md" },
              { text: "单号类型编码", link: "/document/tepbridge/api/wdtwms/standard/numberNoTypeCode.md" },
              { text: "所有接口", items: [
                  // { text: "单品信息增量查询接口", link: "/document/tepbridge/api/wdtwms/standard/singleProductApi" },
                  // { text: "货品信息更新接口", link: "/document/tepbridge/api/wdtwms/standard/productUpdate" },
                  { text: "库存查询接口", link: "/document/tepbridge/api/wdtwms/standard/stockSelect" },
                ] },
            ]
          },
        ],
      },
    ],

    // 导航栏快速地址图标
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    // 新增页脚信息
    footer: {
      //备案号信息
      copyright: "Copyright@ 2025 Albert Yang",
    },
    //设置搜索框
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
});
