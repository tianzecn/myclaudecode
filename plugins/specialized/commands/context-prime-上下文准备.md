# 上下文准备

读取 README.md,然后运行 `git ls-files | grep -v -f (sed 's|^|^|; s|$|/|' .cursorignore | psub)` 来理解项目上下文
