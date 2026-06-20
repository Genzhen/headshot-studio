# 文档索引

项目文档统一归档于此。活跃文档放在分类子目录，历史文档按类别归入 `archive/`。

## 📂 目录结构

```
docs/
├── README.md                    ← 本文件
├── PRD.md                       ← 产品需求文档
├── aws-iam-deployer-policy.json ← AWS 部署 IAM 策略
├── aws-lambda-deploy.md         ← AWS Lambda 部署指南
│
├── workflow/                    ← 当前工作流文档
│   └── AUTO_WORKFLOW_GUIDE.md   ← N1-N8 自动循环工作流使用指南 (v2.0)
│
└── archive/                     ← 历史归档（仅供参考，不再维护）
    ├── workflow/                ← 历史工作流方案
    │   ├── WORKFLOW_ENHANCEMENT.md
    │   └── WORKFLOW_ENHANCEMENT_SUMMARY.md
    ├── status/                  ← 历史状态报告
    │   ├── EXECUTION_PLAN.md
    │   ├── PROJECT_STATUS.md
    │   └── WORKFLOW.md          ← 旧 Cycle 1-4 看板（已归档）
    └── legacy/                  ← 已废弃文件
        ├── AGENTS.md            ← CLAUDE.md 的重复副本
        └── tasks.md             ← 已被 TASKS_BACKLOG.md 取代
```

## 📍 活跃文档位置

| 用途 | 位置 |
|------|------|
| 项目总览 | `README.md` (根目录) |
| AI 指令上下文 | `.claude/CLAUDE.md` |
| 开发规则 | `.claude/rules/*.md` |
| 工作流使用指南 | `docs/workflow/AUTO_WORKFLOW_GUIDE.md` |
| **实时执行状态** | `specs/TASKS_BACKLOG.md` 顶部「当前执行状态」 |
| 产品需求文档 | `docs/PRD.md` |
| 部署指南 | `docs/aws-lambda-deploy.md` |
| 部署 IAM 策略 | `docs/aws-iam-deployer-policy.json` |
| 开发计划 | `specs/PLAN.md` |
| 任务清单 | `specs/TASKS_BACKLOG.md` |
| 经验记录 | `specs/LESSONS.md` |
| 项目概况 | `specs/overview.md` |

## 🗂️ 归档规则

- **一次性文档**（评估方案、总结报告）→ `archive/` 按类别归入
- **时间点状态报告** → `archive/status/`
- **已废弃/被取代的文件** → `archive/legacy/`
- **当前使用的工作流说明** → `workflow/`
