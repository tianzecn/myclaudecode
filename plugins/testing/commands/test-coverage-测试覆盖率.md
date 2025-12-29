---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [coverage-type] | --line | --branch | --function | --statement | --report
description: 分析并改善测试覆盖率,提供全面报告和差距识别
---

# 测试覆盖率

使用详细报告和差距分析分析并改善测试覆盖率:**$ARGUMENTS**

## 当前覆盖率上下文

- 测试框架: !`find . -name "jest.config.*" -o -name ".nycrc*" -o -name "coverage.xml" | head -1 || echo "检测框架"`
- 现有覆盖率: !`find . -name "coverage" -type d | head -1 && echo "存在覆盖率数据" || echo "无覆盖率数据"`

## 任务

执行全面覆盖率分析,包含改进建议和报告:

**覆盖率类型**: 使用 $ARGUMENTS 聚焦于行覆盖率、分支覆盖率、函数覆盖率、语句覆盖率或全面报告

**覆盖率分析框架**:
1. **覆盖率工具设置** - 配置适当工具(Jest、NYC、Istanbul、Coverage.py、JaCoCo)
2. **覆盖率测量** - 生成行覆盖率、分支覆盖率、函数覆盖率、语句覆盖率报告
3. **差距分析** - 识别关键未覆盖路径、分析覆盖率质量
4. **阈值管理** - 配置覆盖率阈值、实现质量门控
5. **报告和可视化** - 生成详细报告、创建覆盖率仪表板
6. **改进规划** - 优先排序覆盖率差距、推荐测试添加

**输出**: 全面的覆盖率分析,包含详细报告、差距识别、改进建议和质量指标跟踪。
