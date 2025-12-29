---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [testing-scope] | --components | --pages | --responsive | --cross-browser | --accessibility
description: 配置全面的视觉回归测试,支持跨浏览器和响应式测试
---

# 配置视觉测试

设置全面的视觉回归测试,包含响应式和可访问性验证:**$ARGUMENTS**

## 当前视觉测试上下文

- 前端框架: !`grep -l "react\\|vue\\|angular" package.json 2>/dev/null || echo "检测框架"`
- 现有测试: !`find . -name "cypress" -o -name "playwright" -o -name "storybook" | head -1 || echo "无视觉测试"`

## 任务

实现全面视觉测试,包含回归检测和可访问性验证:

**测试范围**: 使用 $ARGUMENTS 聚焦于组件测试、页面测试、响应式测试、跨浏览器测试或可访问性测试

**视觉测试框架**:
1. **工具选择和设置** - 选择视觉测试工具(Percy、Chromatic、BackstopJS、Playwright)
2. **基线创建** - 捕获视觉基线、组织截图结构
3. **测试场景设计** - 创建组件测试、设计页面工作流
4. **集成设置** - 配置CI/CD集成、设置自动化执行
5. **回归检测** - 配置差异算法、设置阈值管理
6. **高级测试** - 设置可访问性测试、配置跨浏览器验证

**输出**: 完整的视觉测试设置,包含基线管理、回归检测、CI集成和全面验证工作流。
