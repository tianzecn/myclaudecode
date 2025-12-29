# 显示所有可用的开发工具

显示所有可用的开发工具

*命令最初由 IndyDevDan 创建 (YouTube: https://www.youtube.com/@indydevdan) / DislerH (GitHub: https://github.com/disler)*

## 说明

以以下格式显示系统提示中所有可用的工具:

1. **列出每个工具**及其 TypeScript 函数签名
2. **包含工具的用途**作为后缀
3. **使用双行间距**提高可读性
4. **格式化为项目符号**便于清晰组织

输出应帮助开发者理解:
- 当前 Claude Code 会话中有哪些可用工具
- 每个工具的确切函数签名以供参考
- 每个工具的主要用途

示例格式:
```typescript
• functionName(parameters: Type): ReturnType - 工具的用途

• anotherFunction(params: ParamType): ResultType - 此工具的功能
```

此命令适用于:
- 快速参考可用功能
- 理解工具签名
- 规划特定任务使用哪些工具
