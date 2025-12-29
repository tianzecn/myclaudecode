---
allowed-tools: Bash(ps:*), Bash(netstat:*), Bash(top:*)
description: 启动全面的调试会话
---

## 系统上下文

- 运行的进程：!`ps aux | grep -E "(node|python|java)" | head -10`
- 端口使用情况：!`netstat -tlnp | head -10`
- 系统资源：!`top -b -n1 | head -20`

## 你的任务

我遇到了一个问题：$ARGUMENTS

帮我系统地调试这个问题：

1. **分析问题**：分解问题
2. **检查日志**：建议要检查的相关日志文件
3. **系统状态**：分析当前系统状态
4. **复现步骤**：帮助创建最小复现
5. **解决策略**：提出调试方法

提供逐步的调试说明。
