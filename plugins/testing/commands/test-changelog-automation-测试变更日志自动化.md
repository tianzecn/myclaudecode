---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [automation-type] | --changelog | --workflow-demo | --ci-integration | --validation
description: 自动化变更日志测试工作流,集成 CI 并验证
---

# 测试变更日志自动化

使用全面CI集成自动化变更日志测试工作流:**$ARGUMENTS**

## 当前自动化上下文

- 变更日志文件: !`find . -name "CHANGELOG*" -o -name "changelog*" | head -1 || echo "未检测到变更日志"`
- CI系统: !`find . -name ".github" -o -name ".gitlab-ci.yml" -o -name "Jenkinsfile" | head -1 || echo "未检测到CI"`

## 任务

实现全面的变更日志自动化,包含测试和验证工作流:

**自动化类型**: 使用 $ARGUMENTS 聚焦于变更日志自动化、工作流演示、CI集成或验证测试

**变更日志自动化框架**:
1. **自动化设置** - 配置变更日志生成、设置版本控制集成
2. **工作流集成** - 设计CI/CD集成、配置自动化触发器
3. **测试策略** - 创建变更日志验证测试、实现格式验证
4. **质量保证** - 配置自动化格式化、实现一致性检查
5. **验证框架** - 设计自动化验证规则、实现合规性检查
6. **CI集成** - 设置自动化执行、配置部署触发器

**输出**: 完整的变更日志自动化,包含测试工作流、CI集成、验证规则和维护程序。
