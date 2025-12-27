---
description: Generate complete development archive - check code, create summary, commit, push, and create GitHub Issue
---

# Development Summary Workflow

This workflow helps you create a complete development archive after finishing your work, including code review, summary generation, standardized Git commits, code push, and GitHub Issue creation.

## Prerequisites

- Git repository with changes to commit
- GitHub CLI (`gh`) installed and authenticated
- Remote repository configured

## Steps

### 1. Check Git Status

First, review the current Git status to understand what will be committed:

```bash
git status
git diff --stat
git diff --cached --stat
```

**Verify:**
- Confirm there are changes to commit
- Identify modified/added/deleted files
- Check for untracked files that should be included
- Exclude files that shouldn't be committed (.env, secrets, node_modules, etc.)

### 2. Analyze Change Details

Examine the specific content of code changes:

```bash
git diff
git diff --cached
git log --oneline -10
```

**Extract:**
- Main modified files and functions
- New feature modules
- Deleted or refactored code
- Configuration file changes

### 3. Generate Development Summary

Create a detailed development summary based on the changes. The summary should include:

**Template:**
```markdown
## Development Summary

### 📋 Background
[Describe what problem was solved or what feature was implemented]

### 🛠 Technical Solution
[Describe core implementation approach and architecture design]
- Technology Stack: [frameworks/libraries/tools used]
- Architecture Design: [core architecture approach]
- Key Algorithms: [if applicable]

### 📝 Key Code Changes
[List main modified files and functions]
| File | Change Description |
|------|-------------------|
| `path/to/file1.ts` | [specific changes] |
| `path/to/file2.ts` | [specific changes] |

### 🐛 Challenges & Solutions
[Record difficulties encountered during development and solutions]
1. **Challenge**: [problem description]
   **Solution**: [solution method]

### ✅ Testing & Verification
[Explain how code correctness was verified]
- Unit Tests: [test coverage]
- Integration Tests: [test results]
- Manual Verification: [verification steps and results]

---
**Commit Hash**: [commit-hash]
**Commit Time**: [timestamp]
```

### 4. Evaluate If Commits Should Be Split

If there are many file changes, evaluate whether to split into multiple commits:

**Criteria:**
- Changes involving multiple independent features → suggest splitting
- Multi-file changes for a single feature → can be combined
- Mixed feat/fix/refactor types → suggest splitting

**If splitting is needed:**
- Ask user for confirmation
- Provide splitting suggestions and rationale

### 5. Stage Changes

// turbo
Stage all relevant changes:

```bash
git add -A
```

**Notes:**
- Review staged files before committing
- Exclude files that shouldn't be committed
- Use `git reset HEAD <file>` to exclude specific files if needed

### 6. Create Standardized Commit

Use Chinese Conventional Commits format:

**Format:**
```
[type](scope): [brief description (within 50 characters)]

[detailed explanation (optional, describe specific changes)]
- Change point 1
- Change point 2
```

**Type Mapping:**
- `feat`: New feature (emoji: ✨)
- `fix`: Bug fix (emoji: 🐛)
- `docs`: Documentation update (emoji: 📝)
- `style`: Code formatting (emoji: 💄)
- `refactor`: Code refactoring (emoji: ♻️)
- `test`: Testing related (emoji: ✅)
- `chore`: Build/tools (emoji: 🔧)
- `perf`: Performance optimization (emoji: ⚡)

**Example:**
```bash
git commit -m "feat(auth): 实现用户登录功能

- 添加 JWT 认证中间件
- 实现会话管理服务
- 新增登录/登出 API 端点"
```

### 7. Push to Remote

// turbo
Push changes to the remote repository:

```bash
git push origin $(git branch --show-current)
```

**Notes:**
- Dynamically get current branch name
- If remote branch doesn't exist, use `-u` parameter to set upstream
- Handle push failures gracefully (conflicts, permissions, etc.)

### 8. Get Commit Information

// turbo
Retrieve commit hash and details for reference:

```bash
git log -1 --format="%H %h %s"
```

### 9. Create GitHub Issue

Create an Issue in the GitHub repository to record the development process.

**Determine Issue Title:**
- Feature development: `[feat] Feature Name`
- Bug fix: `[fix] Problem Description`
- Refactoring: `[refactor] Refactoring Content`
- Documentation: `[docs] Documentation Update Content`

**Determine Issue Labels:**
- New feature → `enhancement`
- Bug fix → `bug`
- Documentation → `documentation`
- Refactoring → `refactor`
- Performance optimization → `performance`

**Create Issue:**
```bash
gh issue create \
  --title "[Issue Title]" \
  --body "[Issue Content with Development Summary]" \
  --label "[label]"
```

**Issue Template:**
```markdown
## 📋 Development Record

[Development Summary Content - from Step 3]

---

### 📎 Related Information

| Item | Content |
|------|---------|
| **Commit** | [`[short-hash]`](commit-url) |
| **Branch** | `[branch-name]` |
| **Completion Time** | [timestamp] |

---

> This Issue records the development process. Development is complete.
```

### 10. Return Results

Provide final links and summary to the user:

```markdown
## 🎉 Development Archive Complete

| Item | Content |
|------|---------|
| **Issue** | [#issue-number](issue-url) |
| **Commit** | [`abc1234`](commit-url) |
| **Branch** | `branch-name` |

### Execution Summary
- ✅ Code changes checked
- ✅ Development summary generated
- ✅ Code committed (Conventional Commits format)
- ✅ Code pushed to remote
- ✅ GitHub Issue created

### Development Summary Overview
[Brief description of core content of this development]
```

## Error Handling

### No Changes to Commit
1. Check `git status` output
2. If no changes, notify user there's no code to commit
3. Ask if only creating an Issue record (without commit info)

### Push Failed
1. Check if branch exists on remote
2. If it's a new branch, use `git push -u origin [branch]`
3. If there are conflicts, prompt user to resolve: `git pull --rebase`
4. Retry push or notify user of specific issue

### GitHub CLI Not Authenticated
1. Check `gh auth status`
2. If not authenticated, guide user: `gh auth login`
3. Provide authentication step instructions

### Repository Doesn't Have Issues Enabled
1. Check if repository has Issues enabled
2. If not enabled, prompt user to enable in GitHub settings
3. Or ask if skipping Issue creation step

### Too Many File Changes
1. If changes exceed 20 files
2. Ask user to confirm if commits should be split
3. Provide splitting suggestions (by feature module, by change type, etc.)

## Success Criteria

- ✅ Pre-commit code check completed
- ✅ Development summary generated with all necessary sections
- ✅ Commit message follows Chinese Conventional Commits format
- ✅ Code successfully pushed to remote repository
- ✅ GitHub Issue created with complete development record
- ✅ Issue title is concise and clear, labels are correct
- ✅ Issue and commit links returned to user
