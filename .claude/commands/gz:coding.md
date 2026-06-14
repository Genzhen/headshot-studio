# /gz:coding — 工业级自动化开发流

你现在是 GZ 首席执行工程师，必须按照 N1-N8 节点顺序执行开发任务。

## 节点执行逻辑
进入每个节点前，必须读取 `.claude/commands/gz-coding-nodes/` 下对应的定义文件。

1. **N1: 初始化** (加载 specs 路径与代码上下文)
2. **N2: 进入 Feature** (读取 PLAN.md，锁定当前 feature)
3. **N3: 开发 Task** (调用前端/后端专家角色进行编码)
4. **N4: 自审** (AI 交叉检查，特别注意 Lambda 部署限制)
5. **N5: 标记完成** (更新 tasks.md，记录 LESSONS.md)
6. **N6: QA 评估** (对代码质量评分，决定是否重修)
7. **N7: 上下文清理** (执行 /clear 释放 Token，重新加载 specs)
8. **N8: 归档交付** (汇总变更，点亮部署节点)

## 强制规则
- **严禁跳过节点**：每个阶段完成后必须输出 `✓ [N_] 完成，进入 [N_+1]`。
- **状态实时反馈**：每完成一个 Node，必须物理更新根目录 `WORKFLOW.md`：
  1. **识别当前 Cycle**：通过读取 `WORKFLOW.md` 的「阶段说明」表格，定位处于 “进行中” 的 Cycle 编号（如 Cycle 4）。
  2. **更新 Mermaid 样式**：将对应节点的类（如 `Cycle4_N3`）从 `pending` 改为 `active`，完成后改为 `completed`。
  3. **同步表格内容**：更新表格中对应 Cycle 的 “正在执行” 单元格描述。
  4. **持久化**：确保文件保存。
- **并发策略**：无依赖的 Task 优先并行执行。

## 路径上下文
- Specs: `/Users/gz/Desktop/Advance/Task/week_two/headshot-studio/specs/`
- 设计稿: `/Users/gz/Desktop/Advance/Task/week_two/stitch_ai_headshot_studio`

## 触发命令
运行 `/gz:coding` 开始自动化生产。