---
allowed-tools: Bash
argument-hint: [--cache] [--deps] [--all]
description: 清理 Next.js 构建产物、缓存和依赖,回收磁盘空间
---

## Next.js 构建清理工具

**清理选项**: $ARGUMENTS

## 清理类型

### 1. 基础清理(默认)
- 清理 `.next/` 构建输出
- 清理 Turbopack 缓存
- 清理 TypeScript 构建信息

### 2. 缓存清理(`--cache`)
包括基础清理,额外清理:
- npm/yarn/pnpm 缓存
- Next.js 缓存
- 浏览器测试缓存
- 临时文件

### 3. 依赖清理(`--deps`)
包括基础和缓存清理,额外清理:
- `node_modules/` 目录
- 包管理器锁文件备份

### 4. 完整清理(`--all`)
清理所有内容并重新安装依赖

## 清理操作

### 基础清理脚本
```bash
#!/bin/bash
echo "🧹 清理 Next.js 构建产物..."

# 删除 Next.js 构建输出
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ 已删除 .next/"
fi

# 删除 Turbopack 缓存
if [ -d ".turbo" ]; then
  rm -rf .turbo
  echo "✅ 已删除 .turbo/"
fi

# 删除 TypeScript 构建信息
if [ -f "tsconfig.tsbuildinfo" ]; then
  rm -f tsconfig.tsbuildinfo
  echo "✅ 已删除 tsconfig.tsbuildinfo"
fi

echo "✨ 基础清理完成"
```

### 缓存清理脚本
```bash
#!/bin/bash
echo "🗑️ 清理缓存..."

# 检测包管理器
if [ -f "package-lock.json" ]; then
  PKG_MANAGER="npm"
elif [ -f "yarn.lock" ]; then
  PKG_MANAGER="yarn"
elif [ -f "pnpm-lock.yaml" ]; then
  PKG_MANAGER="pnpm"
else
  PKG_MANAGER="npm"
fi

echo "📦 检测到包管理器: $PKG_MANAGER"

# 清理包管理器缓存
case $PKG_MANAGER in
  npm)
    npm cache clean --force
    echo "✅ 已清理 npm 缓存"
    ;;
  yarn)
    yarn cache clean
    echo "✅ 已清理 yarn 缓存"
    ;;
  pnpm)
    pnpm store prune
    echo "✅ 已清理 pnpm 存储"
    ;;
esac

# 清理其他缓存目录
CACHE_DIRS=(
  ".next/cache"
  ".eslintcache"
  ".stylelintcache"
  "coverage"
  ".nyc_output"
  "playwright-report"
  "test-results"
)

for dir in "${CACHE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    rm -rf "$dir"
    echo "✅ 已删除 $dir/"
  elif [ -f "$dir" ]; then
    rm -f "$dir"
    echo "✅ 已删除 $dir"
  fi
done

echo "✨ 缓存清理完成"
```

### 依赖清理和重装脚本
```bash
#!/bin/bash
echo "📦 清理依赖并重新安装..."

# 确定包管理器
if [ -f "package-lock.json" ]; then
  PKG_MANAGER="npm"
  LOCK_FILE="package-lock.json"
elif [ -f "yarn.lock" ]; then
  PKG_MANAGER="yarn"
  LOCK_FILE="yarn.lock"
elif [ -f "pnpm-lock.yaml" ]; then
  PKG_MANAGER="pnpm"
  LOCK_FILE="pnpm-lock.yaml"
else
  PKG_MANAGER="npm"
  LOCK_FILE=""
fi

# 删除 node_modules
if [ -d "node_modules" ]; then
  echo "🗑️ 删除 node_modules/..."
  rm -rf node_modules
  echo "✅ 已删除 node_modules/"
fi

# 备份锁文件
if [ -n "$LOCK_FILE" ] && [ -f "$LOCK_FILE" ]; then
  echo "💾 备份 $LOCK_FILE..."
  cp "$LOCK_FILE" "${LOCK_FILE}.backup"
  echo "✅ 已备份到 ${LOCK_FILE}.backup"
fi

# 重新安装依赖
echo "⏳ 重新安装依赖..."
case $PKG_MANAGER in
  npm)
    npm install
    ;;
  yarn)
    yarn install
    ;;
  pnpm)
    pnpm install
    ;;
esac

if [ $? -eq 0 ]; then
  echo "✅ 依赖重新安装成功"

  # 删除备份锁文件
  if [ -f "${LOCK_FILE}.backup" ]; then
    rm "${LOCK_FILE}.backup"
    echo "🧹 已删除备份文件"
  fi
else
  echo "❌ 依赖安装失败"

  # 恢复备份
  if [ -f "${LOCK_FILE}.backup" ]; then
    mv "${LOCK_FILE}.backup" "$LOCK_FILE"
    echo "♻️ 已恢复备份锁文件"
  fi
  exit 1
fi

echo "✨ 依赖清理和重装完成"
```

### 完整清理脚本
```bash
#!/bin/bash
echo "🚀 执行完整清理..."

# 显示磁盘空间(清理前)
echo "📊 清理前磁盘使用情况:"
du -sh .next node_modules .turbo 2>/dev/null | sort -hr

# 基础清理
echo ""
echo "1️⃣ 基础清理..."
rm -rf .next .turbo tsconfig.tsbuildinfo

# 缓存清理
echo ""
echo "2️⃣ 缓存清理..."
rm -rf .next/cache .eslintcache .stylelintcache coverage .nyc_output \
       playwright-report test-results

# 清理包管理器缓存
if command -v npm &> /dev/null; then
  npm cache clean --force 2>/dev/null
fi

# 依赖清理
echo ""
echo "3️⃣ 依赖清理..."
if [ -d "node_modules" ]; then
  rm -rf node_modules
  echo "✅ 已删除 node_modules/"
fi

# 重新安装依赖
echo ""
echo "4️⃣ 重新安装依赖..."
if [ -f "package-lock.json" ]; then
  npm install
elif [ -f "yarn.lock" ]; then
  yarn install
elif [ -f "pnpm-lock.yaml" ]; then
  pnpm install
else
  npm install
fi

# 显示磁盘空间(清理后)
echo ""
echo "📊 清理后磁盘使用情况:"
du -sh .next node_modules .turbo 2>/dev/null | sort -hr

echo ""
echo "✨ 完整清理完成!"
```

## 磁盘空间分析

### 空间使用报告
```bash
#!/bin/bash
echo "📊 分析磁盘空间使用情况..."

# 检查各个目录大小
echo ""
echo "目录大小:"
echo "=========================================="

dirs=(".next" "node_modules" ".turbo" "coverage" "dist" "out")
total=0

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    size=$(du -sh "$dir" 2>/dev/null | cut -f1)
    size_bytes=$(du -sb "$dir" 2>/dev/null | cut -f1)
    printf "%-20s %10s\n" "$dir/" "$size"
    total=$((total + size_bytes))
  fi
done

echo "=========================================="
# 转换总大小为人类可读格式
total_mb=$((total / 1024 / 1024))
printf "%-20s %10s MB\n" "总计" "$total_mb"

# 列出最大的文件
echo ""
echo "最大的文件(前 10):"
echo "=========================================="
find . -type f \( \
  -path "./node_modules/*" -o \
  -path "./.next/*" -o \
  -path "./dist/*" -o \
  -path "./out/*" \
\) -exec du -h {} + 2>/dev/null | sort -rh | head -10

echo "=========================================="
```

## 选择性清理

### 按时间清理
```bash
#!/bin/bash
# 清理超过 7 天的构建产物

echo "🕐 清理旧构建产物(>7 天)..."

# 查找并删除旧的构建文件
find .next -type f -mtime +7 -delete 2>/dev/null
find .turbo -type f -mtime +7 -delete 2>/dev/null

echo "✅ 已清理 7 天前的构建产物"
```

### 保留特定文件的清理
```bash
#!/bin/bash
# 清理但保留特定文件

echo "🎯 选择性清理..."

# 保存重要文件
PRESERVE_FILES=(
  ".next/BUILD_ID"
  ".next/package.json"
)

# 创建临时目录
TMP_DIR=$(mktemp -d)

# 备份要保留的文件
for file in "${PRESERVE_FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$TMP_DIR/$(dirname $file)"
    cp "$file" "$TMP_DIR/$file"
  fi
done

# 删除 .next 目录
rm -rf .next

# 恢复保留的文件
if [ -d "$TMP_DIR/.next" ]; then
  mkdir -p .next
  cp -r "$TMP_DIR/.next/"* .next/
fi

# 清理临时目录
rm -rf "$TMP_DIR"

echo "✅ 选择性清理完成"
```

## 安全措施

### 清理前确认
```bash
#!/bin/bash
# 交互式清理确认

echo "⚠️  即将清理以下内容:"
echo "  - .next/ 构建输出"
echo "  - node_modules/ 依赖"
echo "  - 各种缓存目录"
echo ""

# 显示将释放的空间
SPACE=$(du -sh .next node_modules .turbo 2>/dev/null | awk '{sum+=$1} END {print sum}')
echo "预计释放空间: ~$SPACE"
echo ""

read -p "确认继续清理? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 已取消清理"
  exit 0
fi

echo "🧹 开始清理..."
# 执行清理操作...
```

### 创建备份
```bash
#!/bin/bash
# 清理前创建备份

BACKUP_DIR=".cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 创建备份到 $BACKUP_DIR..."

# 备份重要文件
cp package.json "$BACKUP_DIR/" 2>/dev/null
cp package-lock.json "$BACKUP_DIR/" 2>/dev/null
cp yarn.lock "$BACKUP_DIR/" 2>/dev/null
cp pnpm-lock.yaml "$BACKUP_DIR/" 2>/dev/null

echo "✅ 备份完成"
echo "💡 如需恢复,请从 $BACKUP_DIR 复制文件"
```

## 清理后验证

### 验证项目状态
```bash
#!/bin/bash
echo "✅ 验证项目状态..."

# 检查依赖
if [ ! -d "node_modules" ]; then
  echo "❌ node_modules/ 未找到"
  exit 1
fi

# 检查关键包
REQUIRED_PACKAGES=("next" "react" "react-dom")
for pkg in "${REQUIRED_PACKAGES[@]}"; do
  if [ ! -d "node_modules/$pkg" ]; then
    echo "❌ 缺少必需包: $pkg"
    exit 1
  fi
done

# 测试构建
echo "🏗️ 测试构建..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ 构建成功 - 项目状态正常"
else
  echo "❌ 构建失败 - 请检查项目配置"
  exit 1
fi
```

## 清理摘要

执行清理后,提供详细摘要:
- 删除的目录和文件
- 释放的磁盘空间
- 清理耗时
- 重新安装依赖的结果
- 下一步建议(如重新构建等)
