# opencli-plugin-boss-job

BOSS直聘求职者命令行工具 — OpenCLI 插件

通过复用 Chrome 浏览器登录态，在终端中完成 **职位搜索、推荐浏览、职位详情、打招呼、聊天列表、聊天消息查看、发送消息、简历列表、简历上传、简历删除** 等功能。

---

## 功能一览

| 命令 | 说明 | 实现方式 |
|------|------|----------|
| `search` | 搜索职位，支持城市/经验/学历/薪资/行业筛选 | API |
| `recommend` | 查看首页推荐职位 | API |
| `detail` | 查看职位详情 | API |
| `greet` | 向招聘方打招呼 | API |
| `chatlist` | 查看聊天列表 | API |
| `chatmsg` | 查看与某人的聊天消息 | API |
| `send` | 向招聘方发送聊天消息 | UI 自动化 |
| `resume-list` | 查看附件简历列表 | API |
| `resume-upload` | 上传 PDF 简历 | API |
| `resume-delete` | 删除附件简历 | API |
---
## 快速启动

### 1. 安装 OpenCLI

```bash
npm install -g @jackwener/opencli
```

### 2. 安装 OpenCLI Chrome 扩展

方式 A — 从 Chrome Web Store 安装 OpenCLI 扩展

方式 B — 手动安装：
1. 到 OpenCLI GitHub [Releases](https://github.com/jackwener/opencli/releases) 页面下载最新的 opencli-extension-v{version}.zip。
2. 解压后打开chrome://extensions，启用“开发者模式”。
3. 点击“加载已解压的扩展程序”，然后选择解压后的目录。

### 3. 安装 boss-job 插件

```bash
opencli plugin install github:SPYQWER1/opencli-plugin-boss-job
```

### 4. 开始使用

在 Chrome 中登录 [BOSS直聘](https://www.zhipin.com)，然后在终端运行：

```bash
opencli boss-job search 前端
```

## 使用

### 搜索职位

```bash
opencli boss-job search 前端 --city 杭州 --experience 3-5年 --degree 本科 --salary 15-20K --limit 10
```

参数说明：

| 参数 | 说明 | 示例 |
|------|------|------|
| `query` | 搜索关键词（必填） | `前端`、`AI`、`产品经理` |
| `--city` | 城市名或城市代码 | `杭州`、`上海` |
| `--experience` | 经验要求 | `应届`、`1-3年`、`3-5年`、`5-10年` |
| `--degree` | 学历要求 | `大专`、`本科`、`硕士`、`博士` |
| `--salary` | 薪资范围 | `5-10K`、`10-15K`、`20-30K` |
| `--industry` | 行业 | `互联网` |
| `--page` | 页码 | `1` |
| `--limit` | 返回数量 | `10` |

### 推荐职位

```bash
opencli boss-job recommend --limit 10
```

### 职位详情

```bash
opencli boss-job detail <securityId>
```

`securityId` 从 `search` 或 `recommend` 结果中获取。

### 打招呼

```bash
opencli boss-job greet <securityId>
```

### 聊天列表

```bash
opencli boss-job chatlist --limit 10
```

### 聊天消息

```bash
opencli boss-job chatmsg <encryptUid> --security-id <securityId>
```

### 发送消息

```bash
opencli boss-job send <encryptUid> "你好，请问这个职位还在招吗？"
```

> `send` 命令通过 UI 自动化实现（BOSS直聘使用 MQTT 协议，不支持直接 HTTP 发消息）。

### 简历列表

```bash
opencli boss-job resume-list
```

查看所有在线简历和附件简历。

### 上传简历

```bash
opencli boss-job resume-upload /path/to/your/resume.pdf
```

上传成功后会显示最新的简历列表。

### 删除附件简历

```bash
opencli boss-job resume-delete <resumeId>
```

`resumeId` 从 `resume-list` 结果中获取。删除成功后会显示剩余简历列表。

## 注意事项

1. **必须先登录**：使用前需在 Chrome 浏览器中登录 zhipin.com，插件通过复用 Cookie 进行 API 调用。

---


## License

MIT
