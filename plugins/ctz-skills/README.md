# ctz-skills

tianzecn 的通用开发技能集合 - 提升 Claude Code 开发效率的实用技能和命令。

## 安装

```bash
/plugin install ctz-skills@tianzecn-plugins
```

## 命令列表

### /ctz-skills:优化CLAUDE

优化 CLAUDE.md 文件，应用 humanlayer.dev 最佳实践。

**使用方式：**
```bash
/ctz-skills:优化CLAUDE
```

**工作流程：**
1. 分析现有 CLAUDE.md（行数、章节）
2. 将内容分类（🟢保留/🟡移动/🔴删除）
3. 用户确认优化方案
4. 创建 agent_docs/ 存放详细文档
5. 重写精简版 CLAUDE.md（目标 60-200 行）
6. 验证并报告结果

---

## 技能列表

### claudemd-optimization

优化 CLAUDE.md 文件，遵循 [Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) 最佳实践。

**使用场景：**
- `/init` 生成基础 CLAUDE.md 后进行优化
- 项目迭代后精简臃肿的 CLAUDE.md
- 应用渐进式披露策略，创建 agent_docs/ 目录

**触发方式：**
```
"优化 claude.md"
"精简 claude.md"
"claude.md 太长了"
```

**核心原则：**
1. **少即是多** - 控制在 60-300 行（理想 < 150 行）
2. **三维度覆盖** - WHAT / WHY / HOW
3. **渐进式披露** - 详细内容放 agent_docs/
4. **不当 linter** - 用 Biome/ESLint 处理格式
5. **手工精心打磨** - 不要自动生成

## 版本历史

### v1.0.0 (2025-12-28)
- 初始发布
- 添加 claudemd-optimization 技能
