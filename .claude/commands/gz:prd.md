# /gz:prd — 需求规格生成


1. **输入源**：读取 `/Users/gz/Desktop/Advance/Task/week_two/stitch_ai_headshot_studio` 下的 HTML/CSS 设计稿。
2. **任务切分**：按「高内聚」原则在 `specs/PLAN.md` 中切分 Feature。
3. **输出**：在 `docs/` 生成 PRD，在 `specs/` 生成各级任务 `tasks.md` 和 `design.md`。
4. **数据建模**：`design.md` 必须包含针对业务场景的数据库 Schema 设计。

## 核心目标
- 将 HTML 设计稿转化为可实现的 Task 列表。
- **状态更新**：生成 specs 后，修改项目根目录的 `WORKFLOW.md`：
  - 标记 `PM` 为 `completed`，描述改为 `📝 产品经理 (PRD)<br/>需求已就绪`。
  - 标记 `Engineer` 为 `active`，描述改为 `🧑‍💻 工程师 (Coding)<br/>正在准备开发...`。