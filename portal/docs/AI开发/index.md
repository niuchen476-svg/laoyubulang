# AI 开发

> Claude · LLM · Prompt Engineering · API 接入实践

---

!!! note "正在建设中"
    这里将持续收录 AI 开发相关的实战笔记与踩坑记录。

## 规划板块

<div class="home-grid" markdown>

<div class="home-card" markdown>

### 🧠 Prompt 工程

系统提示词设计、角色扮演、CoT 推理链实践。

</div>

<div class="home-card" markdown>

### 🔌 API 接入

Anthropic SDK 使用、工具调用、流式输出、Prompt Cache。

</div>

<div class="home-card" markdown>

### 🛠 项目实战

基于 Claude 的实际项目开发记录与架构设计。

</div>

</div>

---

## 快速参考：Claude API 最简调用

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "你好，Claude！"}
    ]
)
print(message.content[0].text)
```

!!! tip "推荐模型"
    - **Sonnet 4.6** (`claude-sonnet-4-6`) — 日常开发首选，速度与能力均衡
    - **Opus 4.7** (`claude-opus-4-7`) — 复杂推理与长上下文任务
    - **Haiku 4.5** (`claude-haiku-4-5-20251001`) — 高频轻量调用
