# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 OpenCLI 插件，为 BOSS直聘求职者提供命令行工具。通过复用 Chrome 登录态，实现职位搜索、职位详情、打招呼、聊天列表、发送消息等功能。

## 可用命令

| 命令 | 功能 | 实现方式 |
|------|------|----------|
| `search` | 搜索职位 | API |
| `recommend` | 推荐职位 | API |
| `detail` | 职位详情 | API |
| `greet` | 打招呼 | API |
| `chatlist` | 聊天列表 | API |
| `chatmsg` | 聊天记录 | API |
| `send` | 发送消息 | UI自动化 |
| `resume-list` | 查看简历列表（在线简历和附件简历） | UI 自动化 |
| `resume-upload` | 上传 PDF 简历 | UI 自动化 |

## 使用示例

```bash
# 安装依赖并构建
npm install && npm run build

# 重新安装插件
opencli plugin uninstall boss-job && opencli plugin install "file://C:/Users/15981/Desktop/boss-job-cli"

# 搜索职位
opencli boss-job search 前端 --city 杭州 --limit 10

# 查看推荐职位
opencli boss-job recommend --limit 10

# 职位详情
opencli boss-job detail <security-id>

# 打招呼
opencli boss-job greet <security-id>

# 聊天列表
opencli boss-job chatlist --limit 10

# 聊天记录
opencli boss-job chatmsg <encrypt_uid> --security-id <security_id>

# 发送消息
opencli boss-job send <encrypt_uid> "你好，请问这个职位还在招吗？"

# 简历列表
opencli boss-job resume-list

# 上传简历
opencli boss-job resume-upload /path/to/your/resume.pdf
```

## 架构

OpenCLI 自动扫描目录下的 .ts 文件，查找 `cli()` 调用并注册命令。

```
├── utils.ts          # 工具函数：bossFetch, navigateTo, city/degree/salary 映射
├── search.ts         # 搜索职位 (API)
├── recommend.ts      # 推荐职位 (API)
├── detail.ts         # 职位详情 (API)
├── greet.ts          # 打招呼 (API)
├── chatlist.ts       # 聊天列表 (API)
├── chatmsg.ts        # 聊天记录 (API)
├── send.ts           # 发送消息 (UI自动化)
├── resume-list.ts    # 简历列表 (UI自动化)
└── resume-upload.ts  # 上传简历 (UI自动化)
```

## 开发要点

### 命令注册模式

```typescript
import { cli, Strategy } from '@jackwener/opencli/registry';
import { requirePage, navigateTo, bossFetch, verbose } from './utils.js';

cli({
  site: 'boss-job',
  name: 'command-name',
  description: '描述',
  domain: 'www.zhipin.com',
  strategy: Strategy.COOKIE,
  browser: true,
  args: [...],
  columns: ['col1', 'col2'],
  func: async (page, kwargs) => {
    requirePage(page);
    const data = await bossFetch(page, url);
    return [...];
  },
});
```

### 认证方式

使用 `bossFetch` 通过 `page.evaluate` 在浏览器上下文中发送 XHR 请求，自动携带 Cookie：

```typescript
const data = await bossFetch(page, 'https://www.zhipin.com/wapi/zpgeek/...');
// 可选参数: { allowNonZero: true } 允许非零返回码
```

### ID 说明

- **securityId**: 用于 `detail` 和 `greet` 命令，从搜索结果或推荐列表获取
- **encryptJobId**: 用于构建职位 URL
- **encryptUid**: 用于 `chatmsg` 和 `send` 命令，从聊天列表获取

**注意**：`recommend` 接口返回的职位可能包含已下线的职位，使用前建议先用 `detail` 命令验证职位是否有效。若职位已下线，API 返回 `code=17` "缺少必要参数"。

### UI 自动化注意事项

`send` 命令需要通过 UI 自动化实现，因为 BOSS直聘使用 MQTT 而非 HTTP 发送消息。关键点：

1. 使用 `MouseEvent` 模拟点击聊天列表项
2. 等待右侧聊天区域加载
3. 找到 `[contenteditable="true"]` 输入框
4. 点击"发送"按钮或按 Enter 键

## API 端点

- `/wapi/zpgeek/search/joblist.json` - 职位搜索
- `/wapi/zpgeek/recommend/job/list.json` - 推荐职位
- `/wapi/zpgeek/job/detail.json?securityId=...` - 职位详情
- `/wapi/zpgeek/friend/add.json?securityId=...` - 打招呼
- `/wapi/zprelation/friend/getGeekFriendList.json` - 聊天列表
- `/wapi/zpchat/geek/historyMsg` - 聊天记录

## 注意事项

1. 需先在 Chrome 中登录 zhipin.com
2. 需安装 OpenCLI Chrome 扩展以桥接浏览器
3. BOSS直聘有反爬检测，页面可能刷新，但不影响结果返回
4. 发送消息功能依赖 UI 自动化，页面结构变化时可能需要调整选择器
5. 推荐职位列表可能包含已下线职位，`detail`/`greet` 操作失败时通常表示职位已不可用

## 发布到 ClawHub

本项目同时作为 Claude Code skill 发布到 clawhub.com。

### Skill 目录结构

Skill 文件位于 `.claude/skills/boss-job/` 目录：

```
.claude/skills/boss-job/
└── SKILL.md  # Skill 定义文件
```

### 发布流程

1. **安装 clawhub CLI**
   ```bash
   npm i -g clawhub
   ```

2. **登录 clawhub**
   ```bash
   clawhub login --token <your-api-token> --no-browser
   ```

3. **发布/更新 skill**
   ```bash
   # 从 .claude/skills/boss-job 目录发布
   clawhub publish .claude/skills/boss-job \
     --slug boss-job \
     --name "boss-job" \
     --version <x.y.z> \
     --changelog "更新说明"
   ```

4. **验证发布**
   ```bash
   clawhub inspect boss-job
   ```

### 版本管理

- 使用语义化版本 (semver): `major.minor.patch`
- 更新内容较大时增加 minor 版本号
-  Bug 修复或小更新增加 patch 版本号
