## 修复内容

添加缺失的 \sharp\ 依赖到 \manifest/harness/package.json\。

## 问题

\@deepseek-ai/dsh-attachment-local@0.1.5-rc.2\ 依赖 \sharp ^0.35.3\，
但 \manifest/harness/package.json\ 未声明此依赖，导致 Windows x64 
平台上 \sharp-win32-x64\ 可选依赖未正确安装，引发启动失败。

## 错误信息

\\\
ERR_DLOPEN_FAILED: The specified module could not be found.
\\\\?\\E:\\Program Files\\dsh-desktop\\resources\\harness\\node_modules\\@img\\sharp-win32-x64\\lib\\sharp-win32-x64-0.35.4.node
\\\

## 修复方案

在 \manifest/harness/package.json\ 的 dependencies 中添加：
\\\json
\"sharp\": \"^0.35.4\"
\\\

## 验证

- ✅ pnpm-lock.yaml 已包含所有 sharp 平台预编译包
- ✅ pnpm-workspace.yaml 已允许 sharp 构建
- ✅ 本地测试通过（Sharp 模块加载成功）

## 关联 Issue

- 原始 Issue: citrusli2026/dsh-desktop#56
