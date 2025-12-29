---
description: Shell控制面板生成 - 生成符合生产标准的 Shell 交互式控制面板脚本，5层核心架构，支持双模式运行
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, TodoWrite
---

<任务定义>
  你是一个 **生产级 Shell 控制面板生成专家**，专门生成符合企业级标准的 Bash 交互式控制面板脚本。

  <核心目标>
    - **自动化程度高** - 首次运行自动配置所有依赖和环境，后续运行智能检查、按需安装
    - **生产就绪** - 可直接用于生产环境，无需手动干预
    - **双模式运行** - 支持交互式菜单和命令行直接调用
    - **高可维护性** - 模块化设计，易于扩展和维护
    - **自修复能力** - 自动检测并修复常见问题
  </核心目标>

  <技术要求>
    - **语言**: Bash Shell (兼容 bash 4.0+)
    - **依赖**: 自动检测和安装（Python3, pip, curl, git）
    - **平台**: Ubuntu/Debian, CentOS/RHEL, macOS
    - **文件数量**: 单文件实现
    - **执行模式**: 幂等设计，可重复执行
  </技术要求>
</任务定义>

<用户请求>
  $ARGUMENTS
</用户请求>

<架构设计>
  ## 5层核心功能架构

  ### Layer 1: 环境检测与自动安装模块

  **功能需求**:
  ```yaml
  requirements:
    os_detection:
      - 自动识别操作系统类型 (Ubuntu/Debian/CentOS/RHEL/macOS)
      - 识别系统版本号
      - 识别包管理器 (apt-get/yum/dnf/brew)

    dependency_check:
      - 检查必需依赖: python3, pip3, curl
      - 检查推荐依赖: git
      - 返回缺失依赖列表

    auto_install:
      - 提示用户确认安装（交互模式）
      - 静默自动安装（--force 模式）
      - 调用对应包管理器安装
      - 安装失败时提供明确错误信息

    venv_management:
      - 检测虚拟环境是否存在
      - 不存在则创建 .venv/
      - 自动激活虚拟环境
      - 检查 pip 版本，仅在过旧时升级
      - 仅在缺失或版本不匹配时安装依赖
  ```

  **关键函数**:
  ```bash
  detect_environment()         # 检测 OS 和包管理器
  command_exists()             # 检查命令是否存在
  check_system_dependencies()  # 检查系统依赖
  auto_install_dependency()    # 自动安装缺失依赖
  setup_venv()                 # 配置 Python 虚拟环境
  verify_dependencies()        # 验证所有依赖完整性
  ```

  ### Layer 2: 初始化与自修复机制

  **功能需求**:
  ```yaml
  requirements:
    directory_management:
      - 检查必需目录: data/, logs/, modules/, pids/
      - 缺失时自动创建
      - 设置正确的权限 (755)

    pid_cleanup:
      - 扫描所有 .pid 文件
      - 检查进程是否存活 (kill -0)
      - 清理僵尸 PID 文件
      - 记录清理日志

    permission_check:
      - 验证关键目录的写权限
      - 验证脚本自身的执行权限
      - 权限不足时给出明确提示

    config_validation:
      - 检查 .env 文件存在性
      - 验证必需的环境变量
      - 缺失时从模板创建或提示用户

    safe_mode:
      - 初始化失败时进入安全模式
      - 只启动基础功能
      - 提供修复建议
  ```

  **关键函数**:
  ```bash
  init_system()           # 系统初始化总入口
  init_directories()      # 创建目录结构
  clean_stale_pids()      # 清理过期 PID
  check_permissions()     # 权限检查
  validate_config()       # 配置验证
  enter_safe_mode()       # 安全模式
  ```

  ### Layer 3: 参数化启动与非交互模式

  **功能需求**:
  ```yaml
  requirements:
    command_line_args:
      options:
        - name: --silent / -s
          description: 静默模式，无交互提示
          effect: SILENT=1

        - name: --force / -f
          description: 强制执行，自动确认
          effect: FORCE=1

        - name: --no-banner
          description: 不显示 Banner
          effect: NO_BANNER=1

        - name: --debug / -d
          description: 显示调试信息
          effect: DEBUG=1

        - name: --help / -h
          description: 显示帮助信息
          effect: print_usage && exit 0

      commands:
        - start: 启动服务
        - stop: 停止服务
        - restart: 重启服务
        - status: 显示状态
        - logs: 查看日志
        - diagnose: 系统诊断

    exit_codes:
      - 0: 成功
      - 1: 一般错误
      - 2: 参数错误
      - 3: 依赖缺失
      - 4: 权限不足
  ```

  **关键函数**:
  ```bash
  parse_arguments()       # 解析命令行参数
  print_usage()           # 显示帮助信息
  execute_command()       # 执行非交互命令
  interactive_mode()      # 交互式菜单
  ```

  ### Layer 4: 模块化插件系统

  **功能需求**:
  ```yaml
  requirements:
    plugin_structure:
      directory: modules/
      naming: *.sh
      loading: 自动扫描并 source

    plugin_interface:
      initialization:
        - 函数名: ${MODULE_NAME}_init()
        - 调用时机: 模块加载后立即执行
        - 用途: 注册命令、验证依赖

      cleanup:
        - 函数名: ${MODULE_NAME}_cleanup()
        - 调用时机: 脚本退出前
        - 用途: 清理资源、保存状态

    plugin_registry:
      - 维护已加载模块列表: LOADED_MODULES
      - 支持模块查询: list_modules()
      - 支持模块启用/禁用
  ```

  **关键函数**:
  ```bash
  load_modules()          # 扫描并加载模块
  register_module()       # 注册模块信息
  check_module_deps()     # 检查模块依赖
  list_modules()          # 列出已加载模块
  ```

  ### Layer 5: 监控、日志与诊断系统

  **功能需求**:
  ```yaml
  requirements:
    logging_system:
      levels:
        - INFO: 一般信息（青色）
        - SUCCESS: 成功操作（绿色）
        - WARN: 警告信息（黄色）
        - ERROR: 错误信息（红色）
        - DEBUG: 调试信息（蓝色，需开启 --debug）

      output:
        console:
          - 彩色输出（交互模式）
          - 纯文本（非交互模式）
          - 可通过 --silent 禁用

        file:
          - 路径: logs/control.log
          - 格式: "时间戳 [级别] 消息"
          - 自动追加，不覆盖

      rotation:
        - 检测日志大小
        - 超过阈值时轮转 (默认 10MB)
        - 保留格式: logfile.log.1, logfile.log.2

    process_monitoring:
      metrics:
        - PID: 进程 ID
        - CPU: CPU 使用率 (%)
        - Memory: 内存使用率 (%)
        - Uptime: 运行时长

    system_diagnostics:
      collect_info:
        - 操作系统信息
        - Python 版本
        - 磁盘使用情况
        - 目录状态
        - 最近日志 (tail -n 10)
        - 进程状态
  ```

  **关键函数**:
  ```bash
  log_info()              # 信息日志
  log_success()           # 成功日志
  log_warn()              # 警告日志
  log_error()             # 错误日志
  log_debug()             # 调试日志
  rotate_logs()           # 日志轮转
  get_process_info()      # 获取进程信息
  diagnose_system()       # 完整诊断
  ```
</架构设计>

<用户界面设计>
  ## Banner 设计

  ```yaml
  requirements:
    ascii_art:
      - 使用 ASCII 字符绘制
      - 宽度不超过 80 字符
      - 包含项目名称
      - 可选版本号

    color_scheme:
      - 主色调: 青色 (CYAN)
      - 强调色: 绿色 (GREEN)
      - 警告色: 黄色 (YELLOW)
      - 错误色: 红色 (RED)

    toggle:
      - 支持 --no-banner 禁用
      - 非交互模式自动禁用
  ```

  **示例**:
  ```
  ╔══════════════════════════════════════════════╗
  ║      Enhanced Control Panel v2.0            ║
  ╚══════════════════════════════════════════════╝
  ```

  ## 菜单设计

  ```yaml
  requirements:
    layout:
      - 清晰的分隔线
      - 数字编号选项
      - 彩色标识（绿色数字，白色文字）
      - 退出选项用红色

    structure:
      main_menu:
        - 标题: "Main Menu" 或中文
        - 功能选项: 1-9
        - 退出选项: 0

      sub_menu:
        - 返回主菜单: 0
        - 面包屑导航: 显示当前位置

    interaction:
      - read -p "选择: " choice
      - 无效输入提示
      - 操作完成后 "按回车继续..."
  ```

  **示例**:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    1) Start Service
    2) Stop Service
    3) Show Status
    0) Exit
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```
</用户界面设计>

<服务管理功能>
  ## 核心操作

  ```yaml
  requirements:
    start_service:
      process:
        - 检查服务是否已运行
        - 已运行则提示并退出
        - 启动后台进程 (nohup ... &)
        - 保存 PID 到文件
        - 验证启动成功
        - 输出日志路径

      error_handling:
        - 启动失败时清理 PID 文件
        - 记录错误日志
        - 返回非零退出码

    stop_service:
      process:
        - 读取 PID 文件
        - 检查进程是否存在
        - 发送 SIGTERM 信号
        - 等待进程退出 (最多 30 秒)
        - 超时则发送 SIGKILL
        - 删除 PID 文件

      error_handling:
        - PID 文件不存在时提示
        - 进程已死但 PID 存在时清理

    restart_service:
      process:
        - 调用 stop_service
        - 等待 1-2 秒
        - 调用 start_service

    status_check:
      display:
        - 服务状态: Running/Stopped
        - PID (如果运行)
        - CPU 使用率
        - 内存使用率
        - 运行时长
        - 日志文件大小
        - 最后一次启动时间
  ```

  ## PID 文件管理

  ```yaml
  requirements:
    location: data/ 或 pids/
    naming: service_name.pid
    content: 单行纯数字 (进程 ID)

    operations:
      create:
        - echo $! > "$PID_FILE"
        - 立即刷新到磁盘

      read:
        - pid=$(cat "$PID_FILE")
        - 验证是否为数字

      check:
        - kill -0 "$pid" 2>/dev/null
        - 返回 0 表示进程存活

      cleanup:
        - rm -f "$PID_FILE"
        - 记录清理日志
  ```
</服务管理功能>

<项目结构规范>
  ```yaml
  project_root/
    control.sh              # 主控制脚本（本脚本）

    modules/                # 可选插件目录
      database.sh           # 数据库管理模块
      backup.sh             # 备份模块
      monitoring.sh         # 监控模块

    data/                   # 数据目录
      *.pid                 # PID 文件
      *.db                  # 数据库文件

    logs/                   # 日志目录
      control.log           # 控制面板日志
      service.log           # 服务日志

    .venv/                  # Python 虚拟环境（自动创建）

    requirements.txt        # Python 依赖（如需要）
    .env                    # 环境变量（如需要）
  ```
</项目结构规范>

<代码规范>
  ## Shell 编码规范

  ```yaml
  requirements:
    shebang: "#!/bin/bash"

    strict_mode:
      - set -e: 遇到错误立即退出
      - set -u: 使用未定义变量报错
      - set -o pipefail: 管道中任何命令失败则失败
      - 写法: set -euo pipefail

    constants:
      - 全大写: RED, GREEN, CYAN
      - readonly 修饰: readonly RED='\033[0;31m'

    variables:
      - 局部变量: local var_name
      - 全局变量: GLOBAL_VAR_NAME
      - 引用: "${var_name}" (总是加引号)

    functions:
      - 命名: snake_case
      - 声明: function_name() { ... }
      - 返回值: return 0/1 或 echo result

    comments:
      - 每个函数前注释功能
      - 复杂逻辑添加行内注释
      - 分隔符: # ===== Section =====
  ```

  ## 错误处理

  ```yaml
  requirements:
    command_check:
      - if ! command_exists python3; then
      - command -v cmd &> /dev/null

    file_check:
      - if [ -f "$file" ]; then
      - if [ -d "$dir" ]; then

    error_exit:
      - log_error "Error message"
      - exit 1 或 return 1

    trap_signals:
      - trap cleanup_function EXIT
      - trap handle_sigint SIGINT
      - 确保资源清理
  ```
</代码规范>

<代码结构模板>
  ```bash
  #!/bin/bash
  # ==============================================================================
  # 项目名称控制面板
  # ==============================================================================

  set -euo pipefail

  # ==============================================================================
  # LAYER 1: 环境检测与智能安装（按需安装，避免重复）
  # ==============================================================================

  # 颜色定义
  readonly RED='\033[0;31m'
  # ... 其他颜色

  # 路径定义
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  # ... 其他路径

  # 环境检测函数
  detect_environment() { ... }
  check_system_dependencies() { ... }
  verify_dependencies() { ... }
  # ... 其他函数

  # ==============================================================================
  # LAYER 2: 初始化与自修复
  # ==============================================================================

  init_directories() { ... }
  clean_stale_pids() { ... }
  # ... 其他函数

  # ==============================================================================
  # LAYER 3: 参数化启动
  # ==============================================================================

  parse_arguments() { ... }
  print_usage() { ... }
  # ... 其他函数

  # ==============================================================================
  # LAYER 4: 模块化插件系统
  # ==============================================================================

  load_modules() { ... }
  # ... 其他函数

  # ==============================================================================
  # LAYER 5: 监控与日志
  # ==============================================================================

  log_info() { ... }
  get_process_info() { ... }
  # ... 其他函数

  # ==============================================================================
  # 服务管理功能（用户定制区）
  # ==============================================================================

  start_service() {
      log_info "Starting service..."
      # 👇 在这里添加你的启动逻辑
  }

  stop_service() {
      log_info "Stopping service..."
      # 👇 在这里添加你的停止逻辑
  }

  # ==============================================================================
  # 交互式菜单
  # ==============================================================================

  print_banner() { ... }
  show_menu() { ... }
  interactive_mode() { ... }

  # ==============================================================================
  # 主入口
  # ==============================================================================

  main() {
      parse_arguments "$@"
      init_system
      load_modules

      if [ -n "$COMMAND" ]; then
          execute_command "$COMMAND"
      else
          interactive_mode
      fi
  }

  main "$@"
  ```
</代码结构模板>

<验收标准>
  ## 功能完整性

  - ✅ 包含全部 5 个层级的功能
  - ✅ 支持交互式和非交互式两种模式
  - ✅ 实现所有核心服务管理功能
  - ✅ 包含完整的日志和监控系统

  ## 代码质量

  - ✅ 通过 shellcheck 检查（无错误）
  - ✅ 符合 Bash 编码规范
  - ✅ 所有函数有错误处理
  - ✅ 变量正确引用（加引号）

  ## 可用性

  - ✅ 首次运行即可使用（自动初始化）
  - ✅ 后续运行快速启动（智能检查，无重复安装）
  - ✅ 幂等性验证通过（重复运行不改变已有环境）
  - ✅ 帮助信息清晰（--help）
  - ✅ 错误提示明确

  ## 可维护性

  - ✅ 代码结构清晰
  - ✅ 函数职责单一
  - ✅ 易于添加新功能
  - ✅ 支持模块化扩展
</验收标准>

<使用示例>
  ## 基本使用

  ```bash
  # 首次运行（自动配置环境）
  ./control.sh --force

  # 后续运行（智能检查，启动快速）
  ./control.sh

  # 交互式菜单
  ./control.sh

  # 命令行模式
  ./control.sh start --silent
  ./control.sh status
  ./control.sh stop --silent
  ```

  ## CI/CD 集成

  ```yaml
  # GitHub Actions
  - name: Deploy
    run: |
      chmod +x control.sh
      ./control.sh start --silent --force
      ./control.sh status || exit 1
  ```

  ## Systemd 集成

  ```ini
  [Service]
  ExecStart=/path/to/control.sh start --silent
  ExecStop=/path/to/control.sh stop --silent
  Restart=on-failure
  ```
</使用示例>

<定制指南>
  ## 最小修改清单

  用户只需修改以下 3 处即可使用：

  1. **项目路径**（可选）
     ```bash
     PROJECT_ROOT="${SCRIPT_DIR}"
     ```

  2. **启动逻辑**
     ```bash
     start_service() {
         # 👇 添加你的启动命令
         nohup python3 app.py >> logs/app.log 2>&1 &
         echo $! > data/app.pid
     }
     ```

  3. **停止逻辑**
     ```bash
     stop_service() {
         # 👇 添加你的停止命令
         kill $(cat data/app.pid)
         rm -f data/app.pid
     }
     ```
</定制指南>

<输出要求>
  生成的脚本应该：

  1. **单文件**: 所有代码在一个 .sh 文件中
  2. **完整性**: 可以直接运行，无需额外文件
  3. **注释**: 关键部分有清晰注释
  4. **结构**: 使用注释分隔各个层级
  5. **定制区**: 标注 `👇 在这里添加你的逻辑` 供用户定制

  生成完成后，同时生成：
  1. **README.md** - 快速开始指南
  2. **modules/example.sh** - 模块示例（可选）
  3. **使用说明** - 如何定制脚本
</输出要求>

<安全建议>
  - ❌ 不要在脚本中硬编码密码、Token
  - ✅ 使用 .env 文件管理敏感信息
  - ✅ .env 文件添加到 .gitignore
  - ✅ 限制脚本权限 (chmod 750)
  - ✅ 验证用户输入（防止注入）
</安全建议>
