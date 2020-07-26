# JiZhang

a simple but delightful bookkeeping app built with react.

[Try it online here.](http://zoubingwu.com/jizhang)

**Only supported mobile browser.** Adding it to home screen for better experience!

**只支持移动端浏览器**，可以通过添加到主屏幕来获得更好的体验。

## Background

这实际上是一个 [XMind 前端面试题 - 「打造一个简单记账本应用程序」](https://github.com/xmindltd/hiring/blob/master/frontend-1/README.md)。

其中完成的特性包括了：

- 加载所提供的数据
- 列表的形式展示账单，并且提供下拉框选择月份进行筛选
- 支持添加账单
- 简单地统计并展示所选月份的收入和支出总金额
- 对账单分类进行二次筛选
- 各种排序
- 根据账单分类进行支出金额统计

单纯出于展示的目的，且时间和精力的限制，还有可以做但未完成的部分：

- 没有高覆盖率的测试，只包含了比较有限的单元测试以展示编写测试的能力
- 没有针对桌面端网站的支持，因内容有限，只完成了对移动端浏览器的支持
- 没有完善的浏览器兼容性测试，只测试了最新的 chrome 和 safari 浏览器
- 没有 Server 端，一些基本数据来自 csv 文件，开发时会通过脚本将其转换为 JSON 并打包进入最后的产物
- 没有本地数据的持久化，刷新即重置所有新增的数据
- 暂不支持添加新的账单分类

## Development

Requirement:

- macOS (Windows/Linux should be fine but not tested.)
- Node.js 10 or above
- Yarn 1.19 (npm also works but yarn was recommended.)

Install dependencies:

```sh
yarn install
```

Dev:

```sh
yarn start
```

Test:

```sh
yarn test
```

Build:

```sh
yarn build
```

when build finished you can analyze bundle size at bundle/report.html

## Design Decisions

1. 根据需求来看，数据内容有限，交互非常简单，因此一开始就倾向只实现移动端网页，而不投入精力支持桌面端。
2. 既然目标为移动端，交互和体验也要向移动端对齐，因此只设计了一个列表展示页和一个新增账单的表单页，同时为了优化使用体验，交互上视图采用了 iOS 上比较常见的 Popover Card View。
3. 依赖选择上尽量轻量化，不过多引入第三方依赖，以免造成包体积过大，下载缓慢，从而影响体验。这里主要使用了 preact 和 react-spring 分别作为 UI 库和动画实现，利用 parcel 来负责编译打包，异步加载切分 js 模块，最终产出的两份 JS 体积分别为 14KB 和 92KB (with gzipped)
4. 数据层面，理想状态下数据应该通过服务端保存，前端分页按需加载，为了节约时间，csv 文件直接在开发环境被转换为 JSON 文件，通过 mock API 的方式来模拟通过异步 AJAX 请求获取数据。
5. 数据管理则通过使用 react hooks 中的 `useReducer` 和 `useContext`，手写了了一个简单数据管理实现。
6. 数据使用了 immer 转化为结构共享的 immutable 数据结构，依然可以使用 mutable 的方式来进行更新，使得 UI 在 diff 计算时可以获得更高的效率，也避免了很多 mutable 方式产生的问题。
7. 对于账单数据，为了优化查询效率，在拉取到相关的数据后会创建一颗形状为 **年 -> 月 -> 类型 -> id 合集** 的树，切换月份时则可以直接根据对应的年份和月份查询到相关的账单数据的合集，然后再进行进一步的筛选。
8. 相关计算数据查询的方式都使用了 memoize 技术进行缓存，只有当依赖变化时才会重新进行计算，否则直接使用上一次的缓存。
9. 渲染性能方面，列表页使用了 react-window 进行虚拟渲染，只会将可视范围内的数据渲染出真实的 DOM 节点。组件使用了 `React.memo`，在触发渲染时会进行浅比较，只有在 props 或者内部状态变化时才会触发 re-render。
