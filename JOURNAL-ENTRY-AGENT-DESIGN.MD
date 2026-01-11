## 二、分场景账套生成 Excel 模板设计（可导入系统）

你的目标是：**系统自动为小企业按行业/场景生成账套**，并能直接导入（比如 CSV/Excel 到数据库）。基于文中标准和小企业会计准则，我给你一个结构化模板方案。

建议 Excel 文件包含**多个 Sheet**：

1. `科目_通用`
2. `科目_制造业`
3. `科目_服务业`
4. `科目_贸易业`

每个 sheet 的列建议统一，这样导入逻辑简单。

### 2.1 通用科目表模板结构（列设计）

建议列字段（Excel 列名）：

- **CompanyType:** 通用 / 制造 / 服务 / 贸易 / 自定义
- **AccountCode:** 科目编码（4 位为主，预留支持 6 位扩展）
- **AccountName:** 科目名称
- **AccountCategory:** 资产/负债/所有者权益/成本/损益
- **ParentCode:** 上级科目编码（顶级为空）
- **Level:** 科目层级（1/2/3…）
- **BalanceDirection:** 借/贷/平
- **IsLeaf:** 是否末级科目（Y/N）
- **IsQuantityAmount:** 是否数量金额式（Y/N）
- **AllowVoucherDirectPost:** 是否允许直接记账（Y/N）
- **Aux_Customer:** 是否启用客户辅助核算（Y/N）
- **Aux_Supplier:** 是否启用供应商辅助核算（Y/N）
- **Aux_Department:** 是否启用部门辅助核算（Y/N）
- **Aux_Project:** 是否启用项目辅助核算（Y/N）
- **Aux_Inventory:** 是否启用存货辅助核算（Y/N）
- **IsVATParent:** 是否为增值税父科目（如 2221 应交税费）（Y/N）
- **VATColumnType:** VAT 栏目标识（空/进项税额/销项税额/进项税额转出/出口退税/...）
- **Notes:** 备注（如法规依据、行业说明）

你可以在系统里将这一行行解析为 COA 元数据。

### 2.2 通用科目示例（`科目_通用`）

```text
CompanyType | AccountCode | AccountName     | AccountCategory | ParentCode | Level | BalanceDirection | IsLeaf | IsQuantityAmount | AllowVoucherDirectPost | Aux_Customer | Aux_Supplier | Aux_Department | Aux_Project | Aux_Inventory | IsVATParent | VATColumnType | Notes
通用        | 1001        | 库存现金         | 资产            |            | 1     | 借               | Y      | N                | Y                       | N            | N            | N              | N           | N             | N           |               | 小企业会计科目表标准科目
通用        | 1002        | 银行存款         | 资产            |            | 1     | 借               | Y      | N                | Y                       | N            | N            | N              | N           | N             | N           |               | 
通用        | 1243        | 库存商品         | 资产            |            | 1     | 借               | Y      | Y                | Y                       | N            | N            | N              | N           | Y             | N           |               | 贸易/制造建议启用数量金额
通用        | 2101        | 短期借款         | 负债            |            | 1     | 贷               | Y      | N                | Y                       | N            | N            | N              | N           | N             | N           |               | 
通用        | 2201        | 应付账款         | 负债            |            | 1     | 贷               | Y      | N                | Y                       | N            | Y            | N              | N           | N             | N           |               | 建议启用供应商辅助
通用        | 2221        | 应交税费         | 负债            |            | 1     | 贷               | N      | N                | N                       | N            | N            | N              | N           | N             | Y           |               | 下挂应交增值税
通用        | 222101      | 应交增值税       | 负债            | 2221       | 2     | 贷               | Y      | N                | Y                       | N            | N            | N              | N           | N             | N           |               | 多栏账：进项/销项等
通用        | 3101        | 实收资本         | 所有者权益       |            | 1     | 贷               | Y      | N                | Y                       | N            | N            | N              | N           | N             | N           |               | 
通用        | 5101        | 主营业务收入     | 损益            |            | 1     | 贷               | Y      | N                | Y                       | N            | N            | N              | Y           | N             | N           |               | 服务/贸易建议启用项目辅助
通用        | 5201        | 管理费用         | 损益            |            | 1     | 借               | Y      | N                | Y                       | N            | N            | Y              | Y           | N             | N           |               | 可启用部门辅助
```

> 你可以按这个模式批量扩展为完整“小企业会计科目表（2025版）”，并按行业微调辅助核算标志。

### 2.3 制造业专用模板（`科目_制造业`）

在 `科目_制造业` 中，重点补充/标注：

- **生产相关：**
  - **4101 生产成本**（成本类）：  
    - `Aux_Department = Y`（可选，用于生产车间核算）  
    - `Aux_Project = Y`（用于订单/产品线）
  - **4301 制造费用**（如你文中提到“制造费用”）：  
    - `Aux_Department = Y` 建议开启。
- **存货：**
  - **1243 库存商品**：  
    - `IsQuantityAmount = Y`  
    - `Aux_Inventory = Y`（按商品或品类）。
- **建议再加：**
  - 原材料、在产品、产成品（如果你打算走更细粒度）。

示例行（只写新增/有差异的）：

```text
CompanyType | AccountCode | AccountName | AccountCategory | ParentCode | Level | BalanceDirection | IsLeaf | IsQuantityAmount | Aux_Department | Aux_Inventory | Notes
制造业      | 4101        | 生产成本     | 成本            |            | 1     | 借               | Y      | N                | Y              | N             | 按车间或订单归集生产成本
制造业      | 4301        | 制造费用     | 成本            |            | 1     | 借               | Y      | N                | Y              | N             | 制造费用按部门核算
制造业      | 1243        | 库存商品     | 资产            |            | 1     | 借               | Y      | Y                | N              | Y             | 数量金额式，按产品辅助核算
```

### 2.4 服务业专用模板（`科目_服务业`）

重点：

- **费用与收入按部门/项目辅助核算：**
  - 管理费用：`Aux_Department = Y`
  - 主营业务收入：`Aux_Project = Y` 或 `Aux_Customer = Y`
- 增值税科目同通用，只是注意可能有**加计抵减**相关明细。

示例：

```text
CompanyType | AccountCode | AccountName     | AccountCategory | Aux_Department | Aux_Project | Aux_Customer | Notes
服务业      | 5201        | 管理费用         | 损益            | Y              | N           | N            | 部门费用考核
服务业      | 5101        | 主营业务收入     | 损益            | N              | Y           | Y            | 按项目+客户分析收入
服务业      | 22210102    | 未交增值税-待加计抵减 | 负债        | N              | N           | N            | 文中提到的加计抵减明细科目
```

### 2.5 贸易业专用模板（`科目_贸易业`）

重点：

- **库存商品**：数量金额式 + 商品类别辅助核算。
- **主营业务成本**：按商品或客户辅助。
- 可能增加“委托代销商品”等。

示例：

```text
CompanyType | AccountCode | AccountName       | AccountCategory | IsQuantityAmount | Aux_Inventory | Aux_Customer | Notes
贸易业      | 1243        | 库存商品           | 资产            | Y                | Y             | N            | 按商品类别辅助 + 数量金额式
贸易业      | 5401        | 主营业务成本       | 损益            | N                | Y             | Y            | 按商品+客户分析成本
贸易业      | 1405        | 委托代销商品       | 资产            | Y                | Y             | N            | 文中建议的委托代销业务科目
```

---

## 三、场景与 use case 的 Excel 模板（可导入系统）

你前面说的“use case 层”，就是把**业务意图 → 会计分录模板**结构化。建议单独一个 Excel：

### 3.1 Sheet：`UseCases`

列设计：

- **UseCaseId:** 内部唯一标识，如 `UC_AR_Receipt`
- **UseCaseName:** 场景名称（中文），如 “应收款收款（客户付款）”
- **Industry:** 适用行业（通用/制造/服务/贸易/...）
- **Description:** 场景描述（自然语言，给人看）
- **TriggerKeywords:** 触发关键词（逗号分隔，如 “收款,客户,货款,回款”）
- **DefaultDebitAccountCode:** 默认借方科目编码（若用户先输入贷方，则反之）
- **DefaultCreditAccountCode:** 默认贷方科目编码
- **AllowMultiLine:** 是否多行分录（Y/N）
- **PatternType:** 单借单贷 / 一借多贷 / 多借一贷 / 复杂
- **JournalPatternJSON:** 模板化结构（JSON 字符串），给 agent/tool 使用
- **VATHandling:** 增值税处理方式说明（如“销项税额=收入×税率”）
- **AuxRequirement:** 对辅助核算的要求说明（如“应收需客户辅助”）
- **RiskNote:** 风险提示（如“注意区分预收款与收入”）

### 3.2 常见 use case 示例行

#### 3.2.1 应收款收款（AR 收款）

```text
UseCaseId            | UseCaseName          | Industry | Description
UC_AR_Receipt        | 应收账款收款         | 通用     | 客户支付货款或服务款项，冲减应收账款，增加货币资金

TriggerKeywords      | DefaultDebitAccountCode | DefaultCreditAccountCode | AllowMultiLine | PatternType
收款,客户,货款,回款 | 1002                      | 2203(或1122/应收账款)    | N              | 单借单贷

JournalPatternJSON
{"lines":[{"role":"debit","account":"1002","amount":"=input.amount"},{"role":"credit","account":"1122","amount":"=input.amount"}]}

VATHandling
通常收入在开票/确认收入时已确认销项税额，收款仅冲应收，不再处理增值税

AuxRequirement
1122 应收账款必须指定客户；如多笔发票，可在系统中按发票明细冲销

RiskNote
注意区分预收款场景：如客户支付但尚未发货或未履约，应记为预收账款
```

> 你系统里可以保持 `DefaultDebitAccountCode` / `DefaultCreditAccountCode` 为空，由 agent 根据用户输入哪一边来推导另一边。

#### 3.2.2 预收款（收到货款未发货）

```text
UseCaseId            | UseCaseName      | Industry | Description
UC_Advance_From_Cust | 客户预收款       | 通用     | 收到客户预付款，但商品或服务未履约，确认为负债

TriggerKeywords      | DefaultDebitAccountCode | DefaultCreditAccountCode | AllowMultiLine | PatternType
预收,定金,订金       | 1002                      | 2203(预收账款)           | N              | 单借单贷

JournalPatternJSON
{"lines":[{"role":"debit","account":"1002","amount":"=input.amount"},{"role":"credit","account":"2203","amount":"=input.amount"}]}

VATHandling
通常不开票或不开增值税专票，暂不产生销项税额，待履约时确认收入并计提增值税

AuxRequirement
2203 预收账款建议启用客户辅助核算

RiskNote
不要直接记收入和销项税额，避免提前纳税和收入失真
```

#### 3.2.3 采购入库（一般纳税人，贸易业）

```text
UseCaseId             | UseCaseName         | Industry | Description
UC_Purchase_Inventory | 商品采购入库（含进项） | 贸易业   | 购买商品入库，确认库存和进项税额，形成应付账款

TriggerKeywords       | DefaultDebitAccountCode | DefaultCreditAccountCode | AllowMultiLine | PatternType
采购,进货,进仓         | 1243,222101(进项税额)      | 2202(应付账款)            | Y              | 多借一贷

JournalPatternJSON
{"lines":[
  {"role":"debit","account":"1243","amount":"=input.amount_without_vat"},
  {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat_amount"},
  {"role":"credit","account":"2202","amount":"=input.total_amount"}
]}

VATHandling
根据发票税率拆分价税，进项税额入“应交税费-应交增值税-进项税额”专栏

AuxRequirement
2202 应付账款启用供应商辅助；1243 启用存货/商品辅助

RiskNote
注意区分计入费用还是库存商品；简易计税项目进项不得抵扣，需计入成本
```

你可以类似方式定义：

- UC_Sales_Revenue（销售收入+销项税）
- UC_Expense_Payment（费用支付）
- UC_Salary_Payroll（工资发放 + 税费 + 社保）
- UC_Depreciation（折旧）
- UC_VAT_Settlement（月末结转增值税）

这些 use case Excel 数据就是未来 **agent 工具的配置源**。

---

## 四、Microsoft Agent Framework 的 Journal Entry Agent 设计

你想要的是：

> company COA 是长期固定的 context，reasoning 阶段通过对话确定 use case，然后加载相应的 tool，用 use case 模板作为 tool parameter。

我按这个思路用“组件 + 流程”的方式设计。

### 4.1 核心组件

1. **长期上下文（Long-term Context）**
   - 内容：
     - 公司基本信息（行业、纳税人类型、执行准则：小企业会计准则）。
     - 当前公司 COA（从你上面 Excel 导入后的结构化数据）作为工具模板导入。
     - 可用 use case 列表（从 `UseCases` 模板导入）。
   - 在 agent 层面作为**只读配置**加载，每次会话都可访问。

2. **工具层（Tools）**

   至少三个方向的 tool：

   - **Tool 1: GetUseCaseCandidates**
     - 输入：用户自然语言描述 + 已输入的一侧科目/金额。
     - 输出：匹配的 use case 列表（UseCaseId、名称、解释、置信度）。
     - 实现策略：基于 `TriggerKeywords`、行业、已有科目类型做过滤和打分。

   - **Tool 2: GetJournalTemplateForUseCase**
     - 输入：UseCaseId、公司 COA、用户已给信息（side、account、amount）。
     - 输出：
       - 建议的完整分录行（科目编码、名称、借/贷、金额公式、需要补充的字段如客户/供应商等）。
       - 可选多个候选（不同科目细分或不同处理策略）。

   - **Tool 3: ValidateAndFinalizeEntry**
     - 输入：用户确认后的分录 + COA + VAT 规则。
     - 输出：校验结果（平衡性、科目有效性、辅助核算完整性、增值税专栏是否正确）+ 需要修正的提示。

3. **对话代理（JournalEntryAgent）**

   - 能访问：
     - 长期 COA & use case 配置。
     - 上述三个 tools。
   - 职责：
     - 用自然语言与用户交互，澄清场景 → 调用 `GetUseCaseCandidates` → 确定 use case。
     - 调用 `GetJournalTemplateForUseCase` 获取模板化建议。
     - 将建议用自然语言说明，并允许用户修改。
     - 最后调用 `ValidateAndFinalizeEntry`，返回“可入账”的结构。

### 4.2 典型对话与推理流程（逻辑层面）

场景：用户只输入一侧——“借：银行存款 10,000，帮我补另一边”。

1. **步骤 1：解析用户输入**
   - Agent 从用户输入中抽取：
     - 金额：10,000
     - 科目：银行存款（匹配 COA 中的 1002）
     - 方向：借
   - 判断需要补的是贷方。

2. **步骤 2：通过对话确定 use case**
   - Agent 问：
     - “这笔是客户付款、银行贷款到账、股东投入，还是其他？”
   - 用户答：“客户付货款。”

3. **步骤 3：调用 `GetUseCaseCandidates`**
   - 输入：  
     - text: “客户付货款”  
     - account: 1002 借方  
   - 输出：`UC_AR_Receipt` 置信度最高。

4. **步骤 4：调用 `GetJournalTemplateForUseCase`**
   - 输入：
     - UseCaseId=UC_AR_Receipt
     - KnownSide: Debit 1002
     - Amount: 10,000
   - 输出建议分录：
     - 借：1002 银行存款 10,000
     - 贷：1122 应收账款 10,000（需指定客户辅助）

5. **步骤 5：与用户确认**
   - Agent 解释：
     - “根据你的描述，这看起来是冲减应收账款的收款。建议：贷方记应收账款 10,000，并选择对应客户。是否确认？”
   - 用户可修改（例如改成预收款），此时 Agent 重新走 use case 或仅替换科目。

6. **步骤 6：调用 `ValidateAndFinalizeEntry`**
   - 校验借贷平衡、科目合法、辅助核算是否完整。
   - 返回最终结构给你的记账系统入库。

### 4.3 Agent 的配置思路（在 Microsoft 的 Agent Framework 里）

无论你用的是哪一层封装（Azure AI Agents、Copilot Studio 等），可以按以下原则配置：

- **System / Persona Prompt：**
  - 固定说明：
    - 你是“小企业会计系统的记账助手”，遵守《小企业会计准则》《会计信息化工作规范》《增值税会计处理规定》。
    - 公司 COA 已由宿主应用提供，不能随意新增或修改科目，只能在其范围内建议。
    - 所有凭证必须借贷平衡。

- **长期上下文注入：**
  - 通过 framework 的“静态内存”/“外部知识”机制，将：
    - 当前公司 COA（结构化 JSON）
    - UseCases 列表
  - 注入到 agent 的可访问范围。

- **Tool Registration：**
  - 在 framework 中为 `GetUseCaseCandidates`、`GetJournalTemplateForUseCase`、`ValidateAndFinalizeEntry` 注册函数工具。
  - 工具参数结构严格来自你前面设计的 Excel 模板字段（导入后变成数据库/配置表）。

- **推理策略：**
  - 在 agent 指令中定义简单的流程偏好：
    1. 当用户提供一侧科目+金额但没有说明业务背景时，优先通过对话补充信息。
    2. 然后调用 `GetUseCaseCandidates` → 选择置信度最高或向用户展示前 2–3 个候选。
    3. 再调用 `GetJournalTemplateForUseCase` 生成建议分录。
    4. 用户确认后调用 `ValidateAndFinalizeEntry` 完成。

---

## **2. 分场景账套生成 Excel 模板（完整版）**
我会把：
- 通用科目表  
- 制造业科目表  
- 服务业科目表  
- 贸易业科目表  

全部扩展成**可直接导入系统的结构化字段**（你可以导入数据库或生成 Excel）。

## **3. Use Case 模板（完整版）**
我会给你：
- 20–30 个小企业高频 use case  
- 每个 use case 的字段（UseCaseId、触发词、默认借贷、VAT 处理、辅助核算要求、JSON 模板）  
- 适用于你的“AI 推理 → 模板匹配 → 生成分录”流程  

## **4. Microsoft Agent Framework 的 Journal Entry Agent（完整设计）**
我会给你：
- Agent 的 system prompt 结构  
- Tools 的 JSON schema  
- 推理流程（对话 → use case → 模板 → 校验）  
- 如何把 COA 和 use case 作为长期 context 注入  
- 如何让 agent 自动选择正确的模板  

---

# 🔥 现在继续推进：  
## **2. 分场景账套生成 Excel 模板（完整版）**

下面是你可以直接导入系统的字段结构（你可以把它映射到数据库或生成 Excel）。

---

# 📘 **2.1 Excel 字段定义（统一字段）**

所有行业模板都使用同一套字段：

| 字段名 | 说明 |
|-------|------|
| CompanyType | 通用 / 制造 / 服务 / 贸易 |
| AccountCode | 科目编码（4 位或 6 位） |
| AccountName | 科目名称 |
| AccountCategory | 资产 / 负债 / 权益 / 成本 / 损益 |
| ParentCode | 上级科目编码 |
| Level | 层级 |
| BalanceDirection | 借 / 贷 / 平 |
| IsLeaf | 是否末级 |
| IsQuantityAmount | 是否数量金额式 |
| AllowVoucherDirectPost | 是否允许直接记账 |
| Aux_Customer | 是否启用客户辅助 |
| Aux_Supplier | 是否启用供应商辅助 |
| Aux_Department | 是否启用部门辅助 |
| Aux_Project | 是否启用项目辅助 |
| Aux_Inventory | 是否启用存货辅助 |
| IsVATParent | 是否为 VAT 父科目 |
| VATColumnType | VAT 栏目类型（进项/销项/转出等） |
| Notes | 备注 |

---

# 📘 **2.2 通用科目表（可导入）**

以下是**小企业会计准则标准科目表（精简版）**，你可以直接扩展成完整 60 科目版本。

```
CompanyType | AccountCode | AccountName | AccountCategory | ParentCode | Level | BalanceDirection | IsLeaf | IsQuantityAmount | AllowVoucherDirectPost | Aux_Customer | Aux_Supplier | Aux_Department | Aux_Project | Aux_Inventory | IsVATParent | VATColumnType | Notes
通用 | 1001 | 库存现金 | 资产 | | 1 | 借 | Y | N | Y | N | N | N | N | N | N | | 
通用 | 1002 | 银行存款 | 资产 | | 1 | 借 | Y | N | Y | N | N | N | N | N | N | | 
通用 | 1122 | 应收账款 | 资产 | | 1 | 借 | Y | N | Y | Y | N | N | N | N | N | | 客户辅助
通用 | 2202 | 应付账款 | 负债 | | 1 | 贷 | Y | N | Y | N | Y | N | N | N | N | | 供应商辅助
通用 | 2221 | 应交税费 | 负债 | | 1 | 贷 | N | N | N | N | N | N | N | N | Y | | VAT 父科目
通用 | 222101 | 应交增值税 | 负债 | 2221 | 2 | 贷 | Y | N | Y | N | N | N | N | N | N | | 多栏账
通用 | 3101 | 实收资本 | 权益 | | 1 | 贷 | Y | N | Y | N | N | N | N | N | N | | 
通用 | 4101 | 生产成本 | 成本 | | 1 | 借 | Y | N | N | N | N | Y | N | N | N | | 制造业常用
通用 | 5101 | 主营业务收入 | 损益 | | 1 | 贷 | Y | N | Y | N | N | N | Y | N | N | | 项目辅助
通用 | 5401 | 主营业务成本 | 损益 | | 1 | 借 | Y | N | N | N | N | N | N | Y | N | | 
通用 | 5201 | 管理费用 | 损益 | | 1 | 借 | Y | N | Y | N | N | Y | Y | N | N | | 部门辅助
```

---

# 📘 **2.3 制造业科目表（增量）**

```
制造 | 1243 | 库存商品 | 资产 | | 1 | 借 | Y | Y | Y | N | N | N | N | Y | N | | 数量金额式
制造 | 1403 | 原材料 | 资产 | | 1 | 借 | Y | Y | Y | N | N | N | N | Y | N | | 
制造 | 4101 | 生产成本 | 成本 | | 1 | 借 | Y | N | N | N | N | Y | N | N | N | | 
制造 | 4301 | 制造费用 | 成本 | | 1 | 借 | Y | N | N | N | N | Y | N | N | N | | 
```

---

# 📘 **2.4 服务业科目表（增量）**

```
服务 | 5101 | 主营业务收入 | 损益 | | 1 | 贷 | Y | N | Y | N | N | N | Y | N | N | | 项目辅助
服务 | 5201 | 管理费用 | 损益 | | 1 | 借 | Y | N | Y | N | N | Y | Y | N | N | | 部门辅助
服务 | 22210102 | 未交增值税-待加计抵减 | 负债 | 222101 | 3 | 贷 | Y | N | N | N | N | N | N | N | N | | 
```

---

# 📘 **2.5 贸易业科目表（增量）**

```
贸易 | 1243 | 库存商品 | 资产 | | 1 | 借 | Y | Y | Y | N | N | N | N | Y | N | | 数量金额式
贸易 | 5401 | 主营业务成本 | 损益 | | 1 | 借 | Y | N | N | N | N | N | N | Y | N | | 
贸易 | 1405 | 委托代销商品 | 资产 | | 1 | 借 | Y | Y | Y | N | N | N | N | Y | N | | 
```

---

太好了，我们直接进入 **Use Case 模板（完整版）** 的构建阶段，把你未来的 AI 记账系统真正需要的那一层“业务意图 → 会计模板”完整铺开。

为了让你能直接导入数据库或生成 Excel，我会继续保持结构化、字段清晰、可机器读取的格式。

---

# 🧩 **3. Use Case 模板（完整版 30 个场景）**

这些 use case 是为“小企业会计系统 + AI 推理 + 自动补全分录”而设计的。  
每个 use case 都包含：

- UseCaseId（唯一标识）
- UseCaseName（中文名称）
- Industry（适用行业）
- TriggerKeywords（触发词）
- Description（业务描述）
- PatternType（单借单贷、多借一贷等）
- JournalPatternJSON（模板）
- VATHandling（增值税逻辑）
- AuxRequirement（辅助核算要求）
- RiskNote（风险提示）

你可以把这些直接放进 Excel。

---

# 📘 **3.1 收入类 Use Cases（6 个）**

---

## **UC_Sales_Cash**（现金销售）

```
UseCaseId: UC_Sales_Cash
UseCaseName: 现金销售（含销项税）
Industry: 通用、贸易、服务
TriggerKeywords: 销售, 收款, 现金, 货款, 开票
Description: 客户当场付款，确认收入并计提销项税额
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1001","amount":"=input.total"},
    {"role":"credit","account":"5101","amount":"=input.net"},
    {"role":"credit","account":"222101","vatColumn":"销项税额","amount":"=input.vat"}
  ]
}
VATHandling: 按税率拆分价税，计入销项税额
AuxRequirement: 收入可启用项目/客户辅助
RiskNote: 注意区分预收款
```

---

## **UC_Sales_Bank**（银行收款销售）

```
UseCaseId: UC_Sales_Bank
UseCaseName: 银行收款销售
Industry: 通用、贸易、服务
TriggerKeywords: 银行, 收款, 到账, 货款
Description: 客户通过银行转账支付货款
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.total"},
    {"role":"credit","account":"5101","amount":"=input.net"},
    {"role":"credit","account":"222101","vatColumn":"销项税额","amount":"=input.vat"}
  ]
}
VATHandling: 计提销项税额
AuxRequirement: 收入按项目/客户辅助
RiskNote: 若未履约，应记预收款
```

---

## **UC_AR_Receipt**（应收账款收款）

```
UseCaseId: UC_AR_Receipt
UseCaseName: 应收账款收款
Industry: 通用
TriggerKeywords: 回款, 收款, 客户付款, 应收
Description: 客户支付已确认收入的款项
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.amount"},
    {"role":"credit","account":"1122","amount":"=input.amount"}
  ]
}
VATHandling: 不再处理 VAT
AuxRequirement: 1122 必须指定客户
RiskNote: 若未开票/未履约，应记预收款
```

---

## **UC_Advance_From_Customer**（客户预收款）

```
UseCaseId: UC_Advance_From_Customer
UseCaseName: 客户预收款
Industry: 通用
TriggerKeywords: 预收, 定金, 订金, 预付款
Description: 客户提前付款但未履约
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.amount"},
    {"role":"credit","account":"2203","amount":"=input.amount"}
  ]
}
VATHandling: 不计销项税
AuxRequirement: 2203 启用客户辅助
RiskNote: 不得提前确认收入
```

---

## **UC_Revenue_Recognition**（履约确认收入）

```
UseCaseId: UC_Revenue_Recognition
UseCaseName: 履约确认收入（冲预收）
Industry: 服务、贸易
TriggerKeywords: 履约, 发货, 提供服务, 确认收入
Description: 已预收款项，履约后确认收入
PatternType: 多借多贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"2203","amount":"=input.total"},
    {"role":"credit","account":"5101","amount":"=input.net"},
    {"role":"credit","account":"222101","vatColumn":"销项税额","amount":"=input.vat"}
  ]
}
VATHandling: 履约时计提销项税额
AuxRequirement: 客户辅助
RiskNote: 注意履约时点
```

---

## **UC_Other_Income**（其他收益）

```
UseCaseId: UC_Other_Income
UseCaseName: 其他收益（政府补助等）
Industry: 服务业常见
TriggerKeywords: 补助, 补贴, 赔偿, 其他收入
Description: 非主营业务收入
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.amount"},
    {"role":"credit","account":"5301","amount":"=input.amount"}
  ]
}
VATHandling: 一般不涉及 VAT
AuxRequirement: 无
RiskNote: 注意区分营业外收入
```

---

# 📘 **3.2 采购与成本类 Use Cases（6 个）**

---

## **UC_Purchase_Inventory**（采购入库）

```
UseCaseId: UC_Purchase_Inventory
UseCaseName: 商品采购入库（含进项税）
Industry: 贸易、制造
TriggerKeywords: 采购, 进货, 入库, 发票
Description: 商品入库并确认应付账款
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1243","amount":"=input.net"},
    {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat"},
    {"role":"credit","account":"2202","amount":"=input.total"}
  ]
}
VATHandling: 进项税额抵扣
AuxRequirement: 2202 供应商辅助；1243 存货辅助
RiskNote: 简易计税不得抵扣
```

---

## **UC_Purchase_Expense**（费用采购）

```
UseCaseId: UC_Purchase_Expense
UseCaseName: 费用采购（含进项税）
Industry: 通用
TriggerKeywords: 费用, 发票, 支出, 采购
Description: 购买服务或费用类项目
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.net"},
    {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat"},
    {"role":"credit","account":"2202","amount":"=input.total"}
  ]
}
VATHandling: 可抵扣进项
AuxRequirement: 供应商辅助
RiskNote: 部分费用不得抵扣
```

---

## **UC_Pay_AP**（支付应付账款）

```
UseCaseId: UC_Pay_AP
UseCaseName: 支付应付账款
Industry: 通用
TriggerKeywords: 付款, 支付, 应付, 供应商
Description: 向供应商付款
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"2202","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及 VAT
AuxRequirement: 供应商辅助
RiskNote: 注意区分预付款
```

---

## **UC_Prepay_Supplier**（预付供应商）

```
UseCaseId: UC_Prepay_Supplier
UseCaseName: 预付供应商
Industry: 通用
TriggerKeywords: 预付, 定金, 订金, 供应商
Description: 先付款后收货
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1123","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不计进项
AuxRequirement: 供应商辅助
RiskNote: 收货后需冲预付
```

---

## **UC_Inventory_Cost_Adjust**（存货成本调整）

```
UseCaseId: UC_Inventory_Cost_Adjust
UseCaseName: 存货成本调整
Industry: 贸易、制造
TriggerKeywords: 调整, 成本, 存货
Description: 存货成本差异调整
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5401","amount":"=input.amount"},
    {"role":"credit","account":"1243","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及 VAT
AuxRequirement: 存货辅助
RiskNote: 注意成本差异原因
```

---

## **UC_Cost_of_Goods_Sold**（销售成本结转）

```
UseCaseId: UC_COGS
UseCaseName: 销售成本结转
Industry: 贸易、制造
TriggerKeywords: 成本, 结转, 销售
Description: 销售商品时结转成本
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5401","amount":"=input.amount"},
    {"role":"credit","account":"1243","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及 VAT
AuxRequirement: 存货辅助
RiskNote: 注意与收入匹配原则
```

---

# 📘 **3.3 费用类 Use Cases（6 个）**

---

## **UC_Expense_Payment**（费用支付）

```
UseCaseId: UC_Expense_Payment
UseCaseName: 费用支付（无发票）
Industry: 通用
TriggerKeywords: 支付, 费用, 报销
Description: 无发票或不得抵扣
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不计进项
AuxRequirement: 部门辅助
RiskNote: 注意发票管理
```

---

## **UC_Expense_Reimbursement**（员工报销）

```
UseCaseId: UC_Expense_Reimbursement
UseCaseName: 员工报销
Industry: 通用
TriggerKeywords: 报销, 员工, 费用
Description: 员工垫付费用后报销
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 根据发票决定是否抵扣
AuxRequirement: 部门辅助
RiskNote: 注意发票归属
```

---

## **UC_Rent_Expense**（租金费用）

```
UseCaseId: UC_Rent_Expense
UseCaseName: 租金费用
Industry: 通用
TriggerKeywords: 租金, 房租, 租赁
Description: 支付租金
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.net"},
    {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat"},
    {"role":"credit","account":"1002","amount":"=input.total"}
  ]
}
VATHandling: 可抵扣进项
AuxRequirement: 部门辅助
RiskNote: 注意租赁合同税率
```

---

## **UC_Utilities**（水电费）

```
UseCaseId: UC_Utilities
UseCaseName: 水电费
Industry: 通用
TriggerKeywords: 水费, 电费, 能源
Description: 支付水电费
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.net"},
    {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat"},
    {"role":"credit","account":"1002","amount":"=input.total"}
  ]
}
VATHandling: 可抵扣进项
AuxRequirement: 部门辅助
RiskNote: 注意税率变化
```

---

## **UC_Travel_Expense**（差旅费）

```
UseCaseId: UC_Travel_Expense
UseCaseName: 差旅费
Industry: 通用
TriggerKeywords: 差旅, 机票, 酒店
Description: 差旅费用
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 机票无 VAT，酒店可抵扣
AuxRequirement: 部门辅助
RiskNote: 注意发票类型
```

---

## **UC_Office_Expense**（办公费用）

```
UseCaseId: UC_Office_Expense
UseCaseName: 办公费用
Industry: 通用
TriggerKeywords: 办公, 文具, 打印
Description: 办公用品费用
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5201","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 根据发票决定
AuxRequirement: 部门辅助
RiskNote: 注意费用归属
```

---

# 📘 **3.4 工资与税费 Use Cases（6 个）**

---

## **UC_Salary_Accrual**（计提工资）

```
UseCaseId: UC_Salary_Accrual
UseCaseName: 计提工资
Industry: 通用
TriggerKeywords: 工资, 薪资, 计提
Description: 月末计提工资
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5601","amount":"=input.amount"},
    {"role":"credit","account":"2211","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 部门辅助
RiskNote: 注意工资表一致性
```

---

## **UC_Salary_Payment**（发放工资）

```
UseCaseId: UC_Salary_Payment
UseCaseName: 发放工资
Industry: 通用
TriggerKeywords: 发工资, 工资发放
Description: 向员工发放工资
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"2211","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意个税申报
```

---

## **UC_Social_Security**（社保缴纳）

```
UseCaseId: UC_Social_Security
UseCaseName: 社保缴纳
Industry: 通用
TriggerKeywords: 社保, 五险一金
Description: 缴纳社保
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"2212","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意单位与个人部分
```

---

## **UC_Tax_Payable**（计提税费）

```
UseCaseId: UC_Tax_Payable
UseCaseName: 计提税费
Industry: 通用
TriggerKeywords: 税, 计提, 税费
Description: 计提税费
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5602","amount":"=input.amount"},
    {"role":"credit","account":"2221","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意税种区分
```

---

## **UC_Tax_Payment**（缴纳税费）

```
UseCaseId: UC_Tax_Payment
UseCaseName: 缴纳税费
Industry: 通用
TriggerKeywords: 缴税, 税款, 支付税费
Description: 缴纳税款
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"2221","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意税务申报一致性
```

---

## **UC_VAT_Settlement**（增值税结转）

```
UseCaseId: UC_VAT_Settlement
UseCaseName: 增值税月末结转
Industry: 通用
TriggerKeywords: 结转, 增值税, 月末
Description: 月末将销项与进项差

当然继续，把 **Use Case 模板（完整版）** 补完，并进入你真正需要的下一阶段：  
**4. Journal Entry Agent（Microsoft Agent Framework 完整设计）**。

我会先把上一条未完的 Use Case（增值税结转）补完，然后继续补齐剩余的 use case，最后进入 Agent 设计。

---

# 📘 **3.4 工资与税费 Use Cases（续）**

## **UC_VAT_Settlement**（增值税月末结转）

```
UseCaseId: UC_VAT_Settlement
UseCaseName: 增值税月末结转
Industry: 通用
TriggerKeywords: 结转, 增值税, 月末, 转出未交, 转出多交
Description: 月末将销项税额与进项税额的差额结转至“未交增值税”
PatternType: 多借多贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"222101","vatColumn":"销项税额","amount":"=input.output_vat"},
    {"role":"credit","account":"222101","vatColumn":"进项税额","amount":"=input.input_vat"},
    {"role":"credit","account":"222102","amount":"=input.net_vat_payable"}
  ]
}
VATHandling: 按财会〔2016〕22号规定执行
AuxRequirement: 不使用辅助核算
RiskNote: 必须使用多栏账，不得用辅助核算替代
```

---

# 📘 **3.5 固定资产与折旧 Use Cases（4 个）**

---

## **UC_FixedAsset_Purchase**（购买固定资产）

```
UseCaseId: UC_FixedAsset_Purchase
UseCaseName: 购买固定资产（含进项税）
Industry: 通用
TriggerKeywords: 固定资产, 设备, 购置, 发票
Description: 购买固定资产并确认进项税额
PatternType: 多借一贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1601","amount":"=input.net"},
    {"role":"debit","account":"222101","vatColumn":"进项税额","amount":"=input.vat"},
    {"role":"credit","account":"2202","amount":"=input.total"}
  ]
}
VATHandling: 固定资产进项可抵扣
AuxRequirement: 供应商辅助
RiskNote: 注意折旧年限与税法一致性
```

---

## **UC_Depreciation**（计提折旧）

```
UseCaseId: UC_Depreciation
UseCaseName: 计提折旧
Industry: 通用
TriggerKeywords: 折旧, 固定资产, 计提
Description: 月末计提折旧
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5603","amount":"=input.amount"},
    {"role":"credit","account":"1602","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 部门辅助可选
RiskNote: 注意折旧方法与残值率
```

---

## **UC_Dispose_FixedAsset**（固定资产处置）

```
UseCaseId: UC_Dispose_FixedAsset
UseCaseName: 固定资产处置
Industry: 通用
TriggerKeywords: 处置, 报废, 出售, 固定资产
Description: 固定资产出售或报废
PatternType: 多借多贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.proceeds"},
    {"role":"debit","account":"1602","amount":"=input.accumulated_depreciation"},
    {"role":"credit","account":"1601","amount":"=input.original_cost"},
    {"role":"credit","account":"5301","amount":"=input.gain_or_loss"}
  ]
}
VATHandling: 出售资产需计销项税
AuxRequirement: 无
RiskNote: 注意资产净值与损益处理
```

---

## **UC_Asset_Impairment**（资产减值）

```
UseCaseId: UC_Asset_Impairment
UseCaseName: 资产减值
Industry: 通用
TriggerKeywords: 减值, 资产价值下降
Description: 资产发生减值
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5604","amount":"=input.amount"},
    {"role":"credit","account":"1603","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 小企业准则仅长期股权投资允许计提减值
```

---

# 📘 **3.6 其他常见 Use Cases（4 个）**

---

## **UC_Other_Payable**（其他应付款）

```
UseCaseId: UC_Other_Payable
UseCaseName: 其他应付款
Industry: 通用
TriggerKeywords: 代付, 其他款项
Description: 形成其他应付款
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5601","amount":"=input.amount"},
    {"role":"credit","account":"2241","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 可启用往来辅助
RiskNote: 注意区分应付账款
```

---

## **UC_Other_Receivable**（其他应收款）

```
UseCaseId: UC_Other_Receivable
UseCaseName: 其他应收款
Industry: 通用
TriggerKeywords: 借款, 员工借支
Description: 形成其他应收款
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1221","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 可启用员工辅助
RiskNote: 注意借支管理
```

---

## **UC_Interest_Income**（利息收入）

```
UseCaseId: UC_Interest_Income
UseCaseName: 利息收入
Industry: 通用
TriggerKeywords: 利息, 银行利息
Description: 银行利息收入
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"1002","amount":"=input.amount"},
    {"role":"credit","account":"5301","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意银行对账
```

---

## **UC_Bank_Fee**（银行手续费）

```
UseCaseId: UC_Bank_Fee
UseCaseName: 银行手续费
Industry: 通用
TriggerKeywords: 手续费, 银行扣费
Description: 银行扣除手续费
PatternType: 单借单贷
JournalPatternJSON:
{
  "lines":[
    {"role":"debit","account":"5302","amount":"=input.amount"},
    {"role":"credit","account":"1002","amount":"=input.amount"}
  ]
}
VATHandling: 不涉及
AuxRequirement: 无
RiskNote: 注意银行流水核对
```

---

# 🎉 **至此，完整 Use Case 模板（30 个）已经构建完毕。**

你现在拥有：

- 可导入 Excel 的结构化 use case 数据  
- 每个 use case 的 JSON 模板  
- VAT 处理逻辑  
- 辅助核算要求  
- 风险提示  

这就是你 AI 记账系统的“业务意图层”。

---
下面我直接把 **Journal Entry Agent** 当成一个在 Microsoft Agent Framework 里要真实落地的“产品组件”来设计。你可以把它看成：**前面 COA + Use Case Excel 的消费者**。

---

## 一、整体架构概览（Agent 在系统里的位置）

逻辑分层可以这样看：

1. **数据层（由你系统维护）：**
   - 公司 COA（从 Excel/DB 加载，长期固定上下文）
   - Use Case 模板（我们刚设计的 30+ 个 use case）
2. **服务层 / Tools：**
   - `GetUseCaseCandidates`
   - `GetJournalTemplateForUseCase`
   - `ValidateAndFinalizeEntry`
3. **Agent 层（Microsoft Agent Framework）：**
   - 一个专门的 `JournalEntryAgent`
   - 拥有长期 COA 上下文
   - 拥有调用上述 tools 的权限
   - 负责对话、澄清业务场景、选择 use case、调用模板并返回记账建议

---

## 二、长期上下文：COA + Use Case 在 Agent 里的形态

### 2.1 COA（公司科目表）上下文

你在系统中已经有 COA 元数据（来自 Excel 模板），在 agent 里可以这样暴露：

```json
{
  "company": {
    "id": "COMP_123",
    "name": "某某小企业",
    "industry": "贸易",
    "taxpayerType": "一般纳税人",
    "gaap": "小企业会计准则"
  },
  "chartOfAccounts": [
    {
      "code": "1002",
      "name": "银行存款",
      "category": "资产",
      "balanceDirection": "借",
      "isLeaf": true,
      "aux": {
        "customer": false,
        "supplier": false,
        "department": false,
        "project": false,
        "inventory": false
      }
    },
    {
      "code": "1122",
      "name": "应收账款",
      "category": "资产",
      "balanceDirection": "借",
      "isLeaf": true,
      "aux": { "customer": true, "supplier": false, "department": false, "project": false, "inventory": false }
    }
    // ...
  ]
}
```

Agent 不负责修改 COA，只负责读取匹配（如根据“银行存款”找到 `1002`）。

### 2.2 Use Case 模板上下文

Use case 从数据库加载后，对 agent 暴露为只读配置，例如：

```json
{
  "useCases": [
    {
      "id": "UC_AR_Receipt",
      "name": "应收账款收款",
      "industry": ["通用"],
      "triggerKeywords": ["回款","收款","客户付款","应收"],
      "patternType": "single_debit_single_credit",
      "journalPattern": {
        "lines": [
          {"role": "debit", "account": "1002", "amount": "=input.amount"},
          {"role": "credit", "account": "1122", "amount": "=input.amount"}
        ]
      },
      "vatHandling": "none",
      "auxRequirement": {
        "1122": ["customer"]
      }
    }
    // ...
  ]
}
```

在 Microsoft Agent Framework 中，这部分可以通过：

- “外部知识” / “context injection”
- 或 Tool 的参数（如 GetUseCaseCandidates 内部查询 DB）

来提供给 agent 使用。

---

## 三、Tools 设计（核心接口与 JSON Schema）

下面假定你用 HTTP/函数方式暴露工具，Agent 通过 Microsoft Agent Framework 的 `function calling` 调用。

### 3.1 Tool：GetUseCaseCandidates

**目的：**  
根据用户自然语言 + 已知一侧分录（科目、方向、金额）→ 返回匹配 use case 排名列表。

**输入 schema：**

```json
{
  "type": "object",
  "properties": {
    "companyId": { "type": "string" },
    "industry": { "type": "string" },
    "text": { "type": "string", "description": "用户描述，如：客户付货款" },
    "knownSide": {
      "type": "object",
      "properties": {
        "side": { "type": "string", "enum": ["debit", "credit"] },
        "accountCode": { "type": "string" },
        "amount": { "type": "number" }
      },
      "required": ["side", "accountCode"]
    }
  },
  "required": ["companyId", "text", "knownSide"]
}
```

**输出 schema：**

```json
{
  "type": "object",
  "properties": {
    "candidates": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "useCaseId": { "type": "string" },
          "useCaseName": { "type": "string" },
          "confidence": { "type": "number" },
          "reason": { "type": "string" }
        },
        "required": ["useCaseId", "confidence"]
      }
    }
  },
  "required": ["candidates"]
}
```

Agent 行为：  
- 当用户描述不明确时，先补问：这是收款/预收/贷款还是别的？  
- 然后调用 `GetUseCaseCandidates`，取 top-1 或 top-N 展示给用户确认。

---

### 3.2 Tool：GetJournalTemplateForUseCase

**目的：**  
给定 use case + 已知一侧信息 → 套用模板 → 输出完整分录建议（包括需要用户补充的字段）。

**输入 schema：**

```json
{
  "type": "object",
  "properties": {
    "companyId": { "type": "string" },
    "useCaseId": { "type": "string" },
    "knownSide": {
      "type": "object",
      "properties": {
        "side": { "type": "string", "enum": ["debit", "credit"] },
        "accountCode": { "type": "string" },
        "amount": { "type": "number" },
        "currency": { "type": "string" }
      },
      "required": ["side", "accountCode", "amount"]
    },
    "extraInput": {
      "type": "object",
      "description": "VAT 拆分信息、税率、折扣等，如 {\"total\":100, \"vatRate\":0.13}"
    }
  },
  "required": ["companyId", "useCaseId", "knownSide"]
}
```

**输出 schema：**

```json
{
  "type": "object",
  "properties": {
    "lines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "side": { "type": "string", "enum": ["debit", "credit"] },
          "accountCode": { "type": "string" },
          "accountName": { "type": "string" },
          "amount": { "type": "number" },
          "vatColumn": { "type": "string", "nullable": true },
          "auxToFill": {
            "type": "array",
            "items": { "type": "string" },
            "description": "需要用户补充的辅助核算维度，如 ['customer']"
          }
        },
        "required": ["side", "accountCode", "amount"]
      }
    },
    "explanation": { "type": "string" }
  },
  "required": ["lines"]
}
```

Agent 行为：  
- 调用后，将返回的 `lines` 呈现给用户，用自然语言解释每一行。  
- 提示用户补充 `auxToFill`（比如：请选择客户）。

---

### 3.3 Tool：ValidateAndFinalizeEntry

**目的：**  
对最终分录结构做硬性校验：借贷平衡、科目合法、辅助核算是否齐全、增值税科目是否合法。

**输入 schema：**

```json
{
  "type": "object",
  "properties": {
    "companyId": { "type": "string" },
    "journalDraft": {
      "type": "object",
      "properties": {
        "date": { "type": "string", "format": "date" },
        "description": { "type": "string" },
        "lines": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "side": { "type": "string", "enum": ["debit", "credit"] },
              "accountCode": { "type": "string" },
              "amount": { "type": "number" },
              "currency": { "type": "string" },
              "aux": {
                "type": "object",
                "properties": {
                  "customerId": { "type": "string" },
                  "supplierId": { "type": "string" },
                  "departmentId": { "type": "string" },
                  "projectId": { "type": "string" },
                  "inventoryId": { "type": "string" }
                }
              },
              "vatColumn": { "type": "string", "nullable": true }
            },
            "required": ["side", "accountCode", "amount"]
          }
        }
      },
      "required": ["date", "lines"]
    }
  },
  "required": ["companyId", "journalDraft"]
}
```

**输出 schema：**

```json
{
  "type": "object",
  "properties": {
    "isValid": { "type": "boolean" },
    "errors": {
      "type": "array",
      "items": { "type": "string" }
    },
    "warnings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "normalizedJournal": {
      "type": "object",
      "description": "修正后的凭证（如金额四舍五入、排序等）"
    }
  },
  "required": ["isValid", "errors", "warnings"]
}
```

Agent 行为：  
- 如果 `isValid = false`，用自然语言解释错误，提示用户修正。  
- 如果 `true`，将 `normalizedJournal` 返回给宿主系统入库。

---

## 四、JournalEntryAgent 的配置与推理流程

### 4.1 Agent 的 system prompt（核心内容）

你可以在 Microsoft Agent Framework 中为 `JournalEntryAgent` 写一个 system prompt，大意如下（伪代码）：

```text
你是一个“小企业会计记账助手”，服务于执行《小企业会计准则》的企业。
你的目标是：
- 在用户只提供一侧科目/金额的情况下，帮助确定业务场景（use case）；
- 基于公司固定的科目表（COA）和预配置的 use case 模板，生成建议的平衡会计分录；
- 严格遵守：借贷平衡、科目合法、辅助核算完整、不随意新增科目。

使用策略：
1. 当用户描述不清时，先用少量问题澄清业务意图（例如：这是客户付款、供应商付款、预收款、预付款、还是其他？）。
2. 澄清后，调用工具 GetUseCaseCandidates，根据返回的候选列表，向用户展示 1–3 个最有可能的 use case，用自然语言解释区别，并让用户确认。
3. 用户确认 use case 后，调用 GetJournalTemplateForUseCase，生成分录建议。
4. 向用户展示分录建议，包括科目、方向、金额，并指出需要用户选择的辅助核算项（客户、供应商、部门、项目等）。
5. 用户确认并补全辅助核算后，调用 ValidateAndFinalizeEntry 校验。
6. 若校验失败，解释具体原因并请求用户修正；若成功，说明“这是一条平衡且合规的分录”，并将 normalizedJournal 返回给宿主系统。

注意：
- 不要虚构公司的科目，只能使用 COA 中已有的 accountCode。
- 对于增值税相关场景，要保证“应交税费—应交增值税”的处理符合模板和法规逻辑。
- 对用户始终解释你是根据哪个 use case 模板给出的建议，让凭证具有可解释性。
```

你可以根据产品语气做一点微调，但核心流程保持不变。

---

### 4.2 推理流程（端到端示例）

用户输入（中文）：

> 借：银行存款 10,000，是客户把上次货款付了，帮我补另一边。

Agent 大致行为：

1. **解析输入：**
   - 已知：
     - side = debit
     - account = 银行存款 → 匹配 COA 找到 `1002`
     - amount = 10,000
     - text = “客户把上次货款付了”
2. **判断是否需要澄清：**
   - 文本已较明确：客户 + 上次货款 → 高置信度“应收账款收款”。
   - Agent 可以简单确认一次：
     - “这是之前已经确认收入并开票的货款回款，对吗？不是预收款/押金？”
3. **调用 `GetUseCaseCandidates`：**

   ```json
   {
     "companyId": "COMP_123",
     "industry": "贸易",
     "text": "客户把上次货款付了",
     "knownSide": {
       "side": "debit",
       "accountCode": "1002",
       "amount": 10000
     }
   }
   ```

   你系统返回候选：
   - UC_AR_Receipt (0.93)
   - UC_Advance_From_Customer (0.21)

4. **Agent 选用 UC_AR_Receipt，并调用 `GetJournalTemplateForUseCase`：**

   ```json
   {
     "companyId": "COMP_123",
     "useCaseId": "UC_AR_Receipt",
     "knownSide": {
       "side": "debit",
       "accountCode": "1002",
       "amount": 10000,
       "currency": "CNY"
     },
     "extraInput": {}
   }
   ```

   返回：

   ```json
   {
     "lines": [
       {
         "side": "debit",
         "accountCode": "1002",
         "accountName": "银行存款",
         "amount": 10000,
         "auxToFill": []
       },
       {
         "side": "credit",
         "accountCode": "1122",
         "accountName": "应收账款",
         "amount": 10000,
         "auxToFill": ["customer"]
       }
     ],
     "explanation": "根据应收账款收款模板，借记银行存款，贷记应收账款。"
   }
   ```

5. **Agent 告诉用户：**

   - 建议分录：
     - 借：1002 银行存款 10,000
     - 贷：1122 应收账款 10,000（需要选择客户）
   - 并问：“这笔货款是哪个客户？”让用户选客户。

6. **用户选客户后，Agent 调用 `ValidateAndFinalizeEntry`：**

   ```json
   {
     "companyId": "COMP_123",
     "journalDraft": {
       "date": "2026-01-11",
       "description": "客户A支付上次货款",
       "lines": [
         {
           "side": "debit",
           "accountCode": "1002",
           "amount": 10000,
           "currency": "CNY",
           "aux": {}
         },
         {
           "side": "credit",
           "accountCode": "1122",
           "amount": 10000,
           "currency": "CNY",
           "aux": { "customerId": "CUST_A" }
         }
       ]
     }
   }
   ```

   返回 `isValid = true`，Agent 将 `normalizedJournal` 交给宿主系统入库。

---

## 五、如何在你的系统里落地这套 Agent

你这边要做的事情其实可以拆为 4 步：

1. **把 Excel/模板固化为配置与元数据：**
   - COA：导入到 `coa` 表。
   - Use Case：导入到 `use_cases` 表及 `use_case_journal_patterns` 表。

2. **实现 3 个服务（Tools）：**
   - `GetUseCaseCandidates`：
     - 用 triggerKeywords + 简单 NLP / embeddings + 已知科目匹配 use case。
   - `GetJournalTemplateForUseCase`：
     - 从 `use_case_journal_patterns` 读模板，替换 `=input.*` 字段，输出分录建议。
   - `ValidateAndFinalizeEntry`：
     - 查 `coa` 确认科目合法；
     - 检查借贷平衡；
     - 校验辅助核算维度是否齐全；
     - 对增值税科目做硬校验。

3. **在 Microsoft Agent Framework 中注册这个 Agent 和工具：**
   - 设置 system prompt；
   - 声明 3 个工具（函数）及各自参数 schema；
   - 将 companyId / industry / COA 通过 context 注入。

4. **在前端（记账界面）接线：**
   - 用户输入一侧分录信息，点击“AI 补全另一侧”；
   - 前端调用 Agent；
   - Agent 通过 tools 返回建议分录；
   - 用户确认 → 前端将最终分录提交到你的记账系统。

---

完全正确，而且这是一个**更干净、更工程化、更可维护**的架构。

你刚刚这句话，其实点中了“AI 记账系统架构”的核心原则：

> **Agent 不需要持久加载 COA，只需要一个“科目查找工具（lookup tool）”即可。**

这会让整个系统变得更模块化、更安全、更可控。

我来把这个思路完整展开，让你看到它在 Microsoft Agent Framework 中是如何形成一个**最佳实践级别的架构**。

---

# 🎯 为什么不把 COA 放进长期 context？

因为：

### **1. COA 是结构化数据，不适合放进 LLM 的长期上下文**
- COA 可能有几十到几百条科目。
- 长期 context 会被 LLM 解析成自然语言 → 容易产生幻觉或误读。
- 结构化数据应该由工具处理，而不是让 LLM“记住”。

### **2. COA 会因客户不同而变化**
- 每个客户的 COA 不同。
- 如果放在长期 context，你需要为每个客户创建一个新的 agent 实例。
- 这不符合多租户 SaaS 的设计。

### **3. 工具调用比上下文更可靠**
- 工具返回的是结构化 JSON。
- Agent 不会“猜”，不会“幻觉”，不会“记错”。
- 工具可以做权限控制、审计、缓存、索引优化。

### **4. 你未来还会扩展 COA 功能**
例如：
- 搜索科目（模糊匹配）
- 根据行业推荐科目
- 校验科目是否允许借/贷
- 校验辅助核算是否启用
- 校验 VAT 栏目是否正确

这些都应该是 **tool 的职责**，不是 agent 的职责。

---

# 🧩 因此最佳架构是：

## **Agent = 纯推理 + 对话管理**  
## **Tools = 数据访问 + 规则校验 + 模板生成**

---

# 🛠 你需要的 COA Lookup Tool（建议设计）

下面是一个你可以直接实现的工具：

## **Tool：LookupAccount**

### 输入：

```json
{
  "companyId": "COMP_123",
  "query": "银行存款"
}
```

### 输出：

```json
{
  "matches": [
    {
      "accountCode": "1002",
      "accountName": "银行存款",
      "category": "资产",
      "balanceDirection": "借",
      "aux": {
        "customer": false,
        "supplier": false,
        "department": false,
        "project": false,
        "inventory": false
      }
    }
  ]
}
```

### 功能：

- 支持中文名称匹配（银行存款 → 1002）
- 支持模糊匹配（银行 → 1002、100201 等）
- 支持拼音匹配（yinhang → 银行存款）
- 支持编码匹配（1002 → 银行存款）
- 支持多结果 disambiguation（如“费用”可能匹配多个科目）

---

# 🧠 Agent 如何使用 LookupAccount？

当用户输入：

> 借：银行存款 10,000

Agent 的行为：

1. 解析出“银行存款”
2. 调用 LookupAccount：

```json
{"companyId":"COMP_123","query":"银行存款"}
```

3. 得到：

```json
{"matches":[{"accountCode":"1002","accountName":"银行存款"}]}
```

4. Agent 将 `1002` 作为 knownSide 的 accountCode 传给：

- `GetUseCaseCandidates`
- `GetJournalTemplateForUseCase`

---

# 🧩 这样做的优势

## **1. Agent 不需要记住任何科目 → 永远不会幻觉科目**
例如不会出现：
- “贷：应收账款 1123”这种不存在的科目
- “库存商品 1244”这种错误编码

## **2. COA 可以随时更新，不需要重启 Agent**
- 新增科目
- 修改科目名称
- 启用辅助核算
- 启用 VAT 栏目

Agent 不需要知道这些变化，只需要调用 lookup tool。

## **3. 多租户 SaaS 变得简单**
每个公司有自己的 COA  
→ lookup tool 根据 companyId 查询  
→ Agent 不需要知道公司是谁

## **4. Use Case 模板也不需要长期 context**
Use case 也可以通过 tool 查询：

- `GetUseCaseCandidates`
- `GetJournalTemplateForUseCase`

Agent 只负责 orchestrate（编排）。

---

# 🧩 最终架构（最优解）

```
┌──────────────────────────────┐
│        JournalEntryAgent      │
│  - 对话理解                   │
│  - 推理 use case              │
│  - 调用工具                   │
│  - 解释分录                   │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│                 Tools                    │
│                                          │
│  LookupAccount (查科目)                  │
│  GetUseCaseCandidates (找场景)           │
│  GetJournalTemplateForUseCase (套模板)   │
│  ValidateAndFinalizeEntry (校验)         │
└──────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│              Data Layer                  │
│  COA (公司科目表)                         │
│  UseCases (场景模板)                      │
│  VAT Rules                                │
│  辅助核算配置                              │
└──────────────────────────────────────────┘
```

---

下面我给你设计一套 **LookupAccount（科目查找）模糊匹配算法**，专门为“小企业会计系统 + AI Agent”打造，目标是：

- **极高准确率**（避免错配科目）
- **极强容错性**（中文、拼音、缩写、编码都能查）
- **极快响应**（适合在线调用）
- **可解释性**（Agent 能告诉用户为什么匹配到这个科目）

这套算法你可以直接在 TypeScript、Python、Go、Rust 中实现。

---

# 🎯 LookupAccount 的核心目标

当用户输入：

- “银行”
- “yinhang”
- “yhck”
- “1002”
- “存款”
- “bank”
- “银存”
- “行存”
- “银行存款”
- “银行存款科目”
- “借银行存款”
- “银行存款 1002”

系统都能正确返回：

```
1002 银行存款
```

---

# 🧩 LookupAccount 模糊匹配算法（完整设计）

算法分为 **五层匹配策略**，从强到弱依次执行：

1. **编码精确匹配（Exact Code Match）**
2. **中文精确匹配（Exact Chinese Match）**
3. **中文模糊匹配（Fuzzy Chinese Match）**
4. **拼音匹配（Pinyin Match）**
5. **拼音首字母匹配（Pinyin Initial Match）**
6. **混合匹配（Hybrid Token Match）**
7. **评分排序（Scoring & Ranking）**

最终返回一个排序后的候选列表。

---

# 🧱 Step 1：编码精确匹配（最高优先级）

如果用户输入是：

- 全数字（如 “1002”）
- 数字 + 空格（如 “1002 ”）
- 数字 + 中文（如 “1002 银行存款”）

则：

```
提取数字 → 匹配 AccountCode
```

示例：

| 输入 | 匹配 |
|------|------|
| 1002 | 银行存款 |
| 1122 | 应收账款 |
| 2202 | 应付账款 |

**权重：1.0（最高）**

---

# 🧱 Step 2：中文精确匹配（Exact Chinese）

如果用户输入完全等于科目名称：

- “银行存款”
- “应收账款”
- “主营业务收入”

直接命中。

**权重：0.95**

---

# 🧱 Step 3：中文模糊匹配（Fuzzy Chinese）

使用 **子串匹配 + 编辑距离（Levenshtein）**：

- “银行” → 银行存款
- “存款” → 银行存款
- “应收” → 应收账款
- “主营收入” → 主营业务收入（编辑距离 1）

匹配规则：

```
score = substring_score * 0.7 + (1 - edit_distance_ratio) * 0.3
```

示例：

| 输入 | 匹配 | 说明 |
|------|------|------|
| 银行 | 银行存款 | 子串匹配 |
| 存款 | 银行存款 | 子串匹配 |
| 主营收入 | 主营业务收入 | 编辑距离小 |

**权重：0.85**

---

# 🧱 Step 4：拼音全拼匹配（Full Pinyin Match）

将所有科目名称转为拼音：

- 银行存款 → yinhangcunkuan
- 应收账款 → yingshouzhangkuan
- 主营业务收入 → zhuyingyewushouru

用户输入：

- “yinhang”
- “yingshou”
- “zhuying”

匹配规则：

```
if pinyin.startsWith(input_pinyin):
    score = 0.8
elif input_pinyin in pinyin:
    score = 0.7
```

**权重：0.8**

---

# 🧱 Step 5：拼音首字母匹配（Initials Match）

生成首字母：

- 银行存款 → yhck
- 应收账款 → yszk
- 主营业务收入 → zywysr

用户输入：

- “yhck”
- “ysz”
- “zyyw”

匹配规则：

```
if initials.startsWith(input_initials):
    score = 0.75
```

**权重：0.75**

---

# 🧱 Step 6：混合匹配（Hybrid Token Match）

处理用户输入中混合内容：

- “借银行存款”
- “贷应收账款”
- “银行存款科目”
- “银行存款 1002”
- “收款用哪个科目”
- “银行存款账户”

策略：

1. 去掉停用词（借、贷、科目、账户、用、哪个）
2. 提取关键词
3. 对关键词执行中文 + 拼音匹配

示例：

输入：“借银行存款”

→ tokens = ["银行存款"]

→ 匹配成功。

**权重：0.7**

---

# 🧱 Step 7：评分排序（Scoring & Ranking）

最终得分：

```
final_score = 
    code_match * 1.0 +
    exact_chinese * 0.95 +
    fuzzy_chinese * 0.85 +
    pinyin_full * 0.8 +
    pinyin_initial * 0.75 +
    hybrid_match * 0.7
```

返回：

```
[
  {accountCode: "1002", score: 0.98},
  {accountCode: "1001", score: 0.42},
  ...
]
```

Agent 会选择 top-1 或展示 top-3。

---

# 🧠 额外增强：行业权重（Industry Boost）

如果公司行业是“贸易业”，则：

- 库存商品（1243）
- 主营业务收入（5101）
- 主营业务成本（5401）

优先级提高：

```
final_score *= 1.1
```

---

# 🧠 额外增强：科目类别权重（Category Boost）

如果用户输入包含：

- “收入” → 优先匹配损益类（5xxx）
- “成本” → 优先匹配成本类（5401）
- “存货” → 优先匹配资产类（1243）

---

# 🧠 额外增强：上下文权重（Context Boost）

如果 knownSide 是：

- 借方 → 优先匹配贷方常用科目
- 贷方 → 优先匹配借方常用科目

例如：

用户输入“借：银行存款”，系统知道：

- 银行存款常见贷方对手是：
  - 应收账款
  - 主营业务收入
  - 预收账款
  - 其他应付款

这些科目得分提高。

---

# 🧩 最终 LookupAccount 算法伪代码

```python
def lookup_account(company_id, query):
    tokens = preprocess(query)
    candidates = []

    for account in COA[company_id]:
        score = 0

        if exact_code_match(query, account.code):
            score += 1.0

        if exact_chinese_match(tokens, account.name):
            score += 0.95

        score += fuzzy_chinese_score(tokens, account.name) * 0.85
        score += pinyin_full_score(tokens, account.pinyin) * 0.8
        score += pinyin_initial_score(tokens, account.initials) * 0.75
        score += hybrid_match_score(tokens, account) * 0.7

        score *= industry_boost(account)
        score *= category_boost(account, tokens)
        score *= context_boost(account, knownSide)

        if score > threshold:
            candidates.append((account, score))

    return sort_by_score_desc(candidates)
```

---

# 🎉 你现在拥有一个工业级的 LookupAccount 模糊匹配算法

它具备：

- 中文模糊匹配  
- 拼音匹配  
- 首字母匹配  
- 编码匹配  
- 行业增强  
- 科目类别增强  
- 上下文增强  
- 多策略融合评分  

这是你 AI 记账系统的关键基础设施。


