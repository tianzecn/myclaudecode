---
allowed-tools: Read, Glob, Grep, Bash
argument-hint: [scope] | --modules | --patterns | --dependencies | --security
description: 全面的架构审查，分析设计模式并提供改进建议
---

# 架构审查

执行全面的系统架构分析和改进规划：**$ARGUMENTS**

## 当前架构上下文

- 项目结构：!`find . -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.go" | head -5 && echo "..."`
- 包依赖：!`[ -f package.json ] && echo "Node.js project" || [ -f requirements.txt ] && echo "Python project" || [ -f go.mod ] && echo "Go project" || echo "Multiple languages"`
- 测试框架：!`find . -name "*.test.*" -o -name "*spec.*" | head -3 && echo "..." || echo "No test files found"`
- 文档：!`find . -name "README*" -o -name "*.md" | wc -l` 个文档文件

## 任务

执行全面的架构分析，提供可操作的改进建议：

**审查范围**：使用 $ARGUMENTS 聚焦于特定模块、设计模式、依赖分析或安全架构

**架构分析框架**：
1. **系统结构评估** - 映射组件层次结构，识别架构模式，分析模块边界，评估分层设计
2. **设计模式评估** - 识别已实现的模式，评估模式一致性，检测反模式，评估模式有效性
3. **依赖架构** - 分析耦合级别，检测循环依赖，评估依赖注入，评估架构边界
4. **数据流分析** - 跟踪信息流，评估状态管理，评估数据持久化策略，验证转换模式
5. **可扩展性和性能** - 分析扩展能力，评估缓存策略，评估瓶颈，审查资源管理
6. **安全架构** - 审查信任边界，评估身份验证模式，分析授权流程，评估数据保护

**高级分析**：组件可测试性、配置管理、错误处理模式、监控集成、可扩展性评估。

**质量评估**：代码组织、文档充分性、团队沟通模式、技术债务评估。

**输出**：详细的架构评估，包含具体的改进建议、重构策略和实施路线图。
