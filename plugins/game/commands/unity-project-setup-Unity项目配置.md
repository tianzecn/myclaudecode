---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [project-name] | --2d | --3d | --mobile | --vr | --console
description: 主动配置专业的 Unity 游戏开发项目，包含行业标准结构、必备包和平台优化配置
---

# Unity 项目配置与开发环境

初始化专业的 Unity 游戏开发项目：$ARGUMENTS

## 当前 Unity 环境

- Unity 版本：!`unity-editor --version 2>/dev/null || echo "Unity Editor not found"`
- 当前目录：!`pwd`
- 可用模板：!`find . -name "*.unitypackage" 2>/dev/null | wc -l` 个 Unity 包
- Git 状态：!`git status --porcelain 2>/dev/null | wc -l` 个未提交变更
- 系统信息：!`system_profiler SPSoftwareDataType | grep "System Version" 2>/dev/null || uname -a`

## 任务

配置完整的 Unity 项目，包含专业开发环境和平台特定优化。

## 创建内容：

### 项目结构
```
Assets/
├── _Project/
│   ├── Scripts/
│   │   ├── Managers/
│   │   ├── Player/
│   │   ├── UI/
│   │   ├── Gameplay/
│   │   └── Utilities/
│   ├── Art/
│   │   ├── Textures/
│   │   ├── Materials/
│   │   ├── Models/
│   │   └── Animations/
│   ├── Audio/
│   │   ├── Music/
│   │   ├── SFX/
│   │   └── Voice/
│   ├── Prefabs/
│   │   ├── Characters/
│   │   ├── Environment/
│   │   ├── UI/
│   │   └── Effects/
│   ├── Scenes/
│   │   ├── Development/
│   │   ├── Production/
│   │   └── Testing/
│   ├── Settings/
│   │   ├── Input/
│   │   ├── Rendering/
│   │   └── Audio/
│   └── Resources/
├── Plugins/
├── StreamingAssets/
└── Editor/
    ├── Scripts/
    └── Resources/
```

### 必备包
- Universal Render Pipeline (URP)
- Input System
- Cinemachine
- ProBuilder
- Timeline
- Addressables
- Unity Analytics
- Version Control（如果可用）

### 项目设置
- 针对目标平台优化的质量设置
- 输入系统配置
- 物理设置
- 时间和渲染配置
- 多平台构建设置

### 开发工具
- 代码格式化规则（.editorconfig）
- Unity 优化的 .gitignore 配置
- 更好编译的程序集定义文件
- 改进工作流的自定义编辑器脚本

### 版本控制配置
- Git 仓库初始化
- Unity 专用 .gitignore
- 大资源的 LFS 配置
- 分支策略文档

## 使用方法：

```bash
npx claude-code-templates@latest --command unity-project-setup
```

## 交互式选项：

1. **项目类型选择**
   - 2D 游戏
   - 3D 游戏
   - 移动游戏
   - VR/AR 游戏
   - 混合（2D/3D）

2. **目标平台**
   - PC（Windows/Mac/Linux）
   - 移动端（iOS/Android）
   - 主机（PlayStation/Xbox/Nintendo）
   - WebGL
   - VR（Oculus/SteamVR）

3. **版本控制**
   - Git
   - Plastic SCM
   - Perforce
   - 无

4. **附加包**
   - TextMeshPro
   - Post Processing
   - Unity Ads
   - Unity Analytics
   - Unity Cloud Build
   - 自定义包选择

## 生成的文件：

### 核心脚本
- `GameManager.cs` - 主游戏控制器
- `SceneLoader.cs` - 场景管理系统
- `AudioManager.cs` - 音频系统控制器
- `InputManager.cs` - 输入处理系统
- `UIManager.cs` - UI 系统管理器
- `SaveSystem.cs` - 保存/加载功能

### 编辑器工具
- `ProjectSetupWindow.cs` - 自定义编辑器窗口
- `SceneQuickStart.cs` - 场景配置自动化
- `AssetValidator.cs` - 资源验证工具
- `BuildAutomation.cs` - 构建管线辅助工具

### 配置文件
- `ProjectSettings.asset` - 优化的项目设置
- `QualitySettings.asset` - 多平台质量层级
- `InputActions.inputactions` - 输入系统配置
- `AssemblyDefinitions` - 模块化编译配置

### 文档
- `README.md` - 项目概述和配置说明
- `CONTRIBUTING.md` - 开发指南
- `CHANGELOG.md` - 版本历史模板
- `API_REFERENCE.md` - 代码文档模板

## 配置后检查清单：

- [ ] 审查并调整目标平台的质量设置
- [ ] 为游戏控制配置输入动作
- [ ] 为所有目标平台设置构建配置
- [ ] 审查文件夹结构并根据需要重命名
- [ ] 配置版本控制并进行初始提交
- [ ] 如需要，配置持续集成
- [ ] 配置分析和崩溃报告
- [ ] 审查并自定义编码标准

## 平台特定配置：

### 移动端
- 触摸输入配置
- 性能优化设置
- 电池使用优化
- 应用商店提交配置

### PC
- 多分辨率支持
- 键盘/鼠标输入配置
- 图形选项菜单模板
- Windows/Mac/Linux 构建配置

### 主机
- 平台特定输入映射
- 成就/奖杯集成配置
- 在线服务配置
- 认证要求模板

此命令创建一个生产就绪的 Unity 项目结构，可从原型扩展到发布游戏，遵循行业最佳实践和 Unity 推荐模式。
