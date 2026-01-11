# UX/UI Design Document: Journal Entry Agent

**Document Version:** 2.0
**Last Updated:** 2026-01-11
**Product:** Loyalis - AI-Powered Financial Management Platform
**Feature:** Journal Entry Agent for Automated Accounting
**Related Documents:** PRD-JOURNAL-ENTRY-AGENT.md, TRD-JOURNAL-ENTRY-AGENT.md, STYLING-GUIDE.md

**🔄 v2.0 Update:** Updated to use **CopilotKit** for frontend chat UI with **Microsoft Agent Framework** backend

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Principles](#2-design-principles)
3. [Visual Design System](#3-visual-design-system)
4. [CopilotKit Integration](#4-copilotkit-integration) **NEW**
5. [Information Architecture](#5-information-architecture)
6. [User Personas & Scenarios](#6-user-personas--scenarios)
7. [User Flows](#7-user-flows)
8. [Wireframes & Components](#8-wireframes--components)
9. [Interactive Prototypes](#9-interactive-prototypes)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility](#11-accessibility)
12. [Error States & Edge Cases](#12-error-states--edge-cases)
13. [Animation & Micro-interactions](#13-animation--micro-interactions)

---

## 1. Executive Summary

### 1.1 Design Vision

Create an **intelligent, conversational interface** that guides non-expert users through complex accounting tasks with the ease of chatting with a professional accountant, while maintaining the precision and compliance requirements of financial record-keeping.

### 1.2 Core UX Objectives

1. **Reduce Cognitive Load:** Transform complex double-entry accounting into simple conversational inputs
2. **Build Trust:** Provide clear explanations and validation at every step
3. **Ensure Accuracy:** Prevent errors through intelligent defaults and real-time validation
4. **Educate Users:** Help users learn accounting concepts through contextual guidance
5. **Maintain Efficiency:** Enable power users to bypass AI assistance when desired

### 1.3 Success Metrics (UX)

- **Task Completion Rate:** >90% of users successfully create and post entries
- **Time-on-Task:** <2 minutes average per entry (vs. 5-7 minutes manual)
- **Error Recovery Rate:** >95% of validation errors resolved without support
- **Feature Adoption:** >80% of users choose AI-assisted mode over manual
- **User Satisfaction:** >4.5/5 rating on ease of use

---

## 2. Design Principles

### 2.1 Conversation-First Design

**Principle:** Accounting entries should feel like describing a transaction to a colleague, not filling out a complex form.

**Application:**
- Natural language input fields with generous placeholder text
- Conversational tone in AI responses ("Let me help you with that...")
- Progressive disclosure - ask one question at a time
- Show AI "thinking" states to set expectations

### 2.2 Transparency & Explainability

**Principle:** Users should always understand why the AI suggests a specific entry.

**Application:**
- Show confidence scores for AI suggestions
- Display which use case template was matched
- Explain accounting logic in plain language
- Provide links to regulatory references

### 2.3 Forgiveness & Flexibility

**Principle:** Users can make mistakes, change their mind, or take control at any time.

**Application:**
- Allow switching between AI and manual modes
- Enable editing of AI suggestions before finalizing
- Provide clear undo/restart options
- Never punish users for asking clarifying questions

### 2.4 Progressive Complexity

**Principle:** Show simple cases simply, reveal complexity only when needed.

**Application:**
- Default to single-line inputs for common scenarios
- Expand to show VAT breakdown only when applicable
- Hide auxiliary dimensions until required by account type
- Offer "Advanced" toggle for power users

---

## 3. Visual Design System

### 3.1 Color Palette

Based on `/home/chris/repo/Badget/STYLING-GUIDE.md`:

```css
/* Primary Colors - OKLCH */
--background: oklch(98.46% 0.002 247.84);       /* Off-white */
--foreground: oklch(0.145 0 0);                 /* Dark text */
--primary: oklch(0.205 0 0);                    /* Dark primary */
--secondary: oklch(0.9400 0);                   /* Light secondary */

/* Semantic Colors */
--success: oklch(0.828 0.189 84.429);           /* Green - Validated entries */
--warning: oklch(0.769 0.188 70.08);            /* Yellow - Warnings */
--error: oklch(0.646 0.222 41.116);             /* Red - Errors */
--info: oklch(0.6 0.118 184.704);               /* Blue - AI suggestions */

/* Accounting-Specific */
--debit: oklch(0.6 0.118 184.704);              /* Blue for debits */
--credit: oklch(0.828 0.189 84.429);            /* Green for credits */
--ai-accent: oklch(0.398 0.07 227.392);         /* Purple for AI features */
```

### 3.2 Typography

```css
/* Headers */
h1 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* Body Text */
.body-lg { font-size: 1.125rem; line-height: 1.75; }
.body { font-size: 1rem; line-height: 1.5; }
.body-sm { font-size: 0.875rem; line-height: 1.5; }

/* Accounting Numbers */
.amount {
  font-family: 'Inter', system-ui, sans-serif;
  font-variant-numeric: tabular-nums; /* Monospaced numbers */
  font-weight: 500;
}
```

### 3.3 Component Styling Standards

Based on `/home/chris/repo/Badget/STYLING-GUIDE.md`:

**Cards:**
```css
.accounting-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px); /* 14px */
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

**Buttons:**
```css
.button-primary {
  height: 2.5rem;               /* h-10 */
  padding: 0 1.5rem;            /* px-6 */
  border-radius: calc(var(--radius) - 2px); /* 8px */
  background: var(--primary);
  color: var(--primary-foreground);
  transition: all 300ms ease-out;
}

.button-ai {
  background: linear-gradient(135deg, var(--ai-accent) 0%, var(--info) 100%);
  border: 1px solid oklch(0.398 0.07 227.392 / 0.3);
}
```

**Input Fields:**
```css
.input {
  height: 2.25rem;              /* h-9 */
  padding: 0.5rem 0.75rem;      /* px-3 py-2 */
  border: 1px solid var(--input);
  border-radius: calc(var(--radius) - 2px); /* 8px */
  background: var(--background);
}

.input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px var(--ring) / 0.5;
}
```

### 3.4 Iconography

Use **Lucide icons** (consistent with existing Loyalis design):

- **Agent/AI:** `<IconSparkles />` or `<IconBrain />`
- **Account:** `<IconFileText />`
- **Debit:** `<IconArrowUp />` or `<IconPlus />`
- **Credit:** `<IconArrowDown />` or `<IconMinus />`
- **Validation:** `<IconCheckCircle2 />`, `<IconAlertTriangle />`, `<IconXCircle />`
- **Search:** `<IconSearch />`
- **Customer:** `<IconUser />`
- **Supplier:** `<IconBuilding />`

---

## 4. Information Architecture

### 4.1 Navigation Structure

```
Dashboard
└── Accounting (new section)
    ├── Journal Entries
    │   ├── List View (all entries)
    │   ├── Create Entry
    │   │   ├── AI-Assisted Mode (default)
    │   │   └── Manual Mode
    │   └── View/Edit Entry
    ├── Chart of Accounts
    │   └── Browse CoA (read-only in v1.0)
    ├── Auxiliary Data
    │   ├── Customers
    │   ├── Suppliers
    │   ├── Departments
    │   ├── Projects
    │   └── Inventory Items
    └── Reports (future)
```

### 4.2 Page Hierarchy

**Primary:** `/dashboard/accounting/journal-entries/create` (AI-assisted entry creation)
**Secondary:** `/dashboard/accounting/journal-entries` (entry list/management)
**Tertiary:** `/dashboard/accounting/chart-of-accounts` (reference)

---

## 5. User Personas & Scenarios

### 5.1 Primary Persona: Small Business Owner (非专业会计)

**Name:** 李明 (Li Ming)
**Age:** 35
**Business:** Small trading company (贸易公司)
**Accounting Knowledge:** Basic (understands invoices, not double-entry)
**Tech Savviness:** Medium (uses WeChat, Excel, basic SaaS tools)

**Goals:**
- Record daily transactions accurately
- Prepare for monthly tax filing
- Avoid hiring expensive accountant

**Pain Points:**
- Confused by debit/credit terminology
- Afraid of making costly mistakes
- Doesn't understand VAT treatment

**User Scenario:**
> Li Ming receives 10,000 RMB payment from a customer via bank transfer. He opens Loyalis, goes to "Create Journal Entry," and describes the transaction: "收到客户张三的货款 10000元 通过银行转账"
>
> The AI agent suggests:
> - Debit: 1002 银行存款 10,000
> - Credit: 1122 应收账款 10,000
>
> Li Ming selects "Customer: 张三" from a dropdown and clicks "Post Entry." Done in 45 seconds.

### 5.2 Secondary Persona: Part-Time Bookkeeper (兼职会计)

**Name:** 王静 (Wang Jing)
**Age:** 42
**Clients:** 5 small businesses
**Accounting Knowledge:** Professional (Intermediate Accountant certificate)
**Tech Savviness:** High

**Goals:**
- Process transactions efficiently across multiple clients
- Minimize repetitive data entry
- Ensure compliance with standards

**Pain Points:**
- Tedious manual entry of similar transactions
- Complex VAT calculations
- Context-switching between clients

**User Scenario:**
> Wang Jing processes 30 transactions for a client. For routine entries (salaries, rent), she uses AI suggestions. For complex entries (inventory adjustments), she switches to manual mode.
>
> She appreciates keyboard shortcuts (Cmd+K for account search) and the ability to duplicate previous entries as templates.

---

## 6. User Flows

### 6.1 Core Flow: AI-Assisted Entry Creation (End-to-End)

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRY POINT                               │
│  User: Navigates to "Create Journal Entry"                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  STEP 1: MODE SELECTION                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ● AI-Assisted (Recommended)                         │   │
│  │  ○ Manual Entry                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  Default: AI-Assisted selected                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           STEP 2: INITIAL INPUT (SIMPLE FORM)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  I know one side of the entry:                       │   │
│  │                                                       │   │
│  │  ( ) Debit  (●) Credit                               │   │
│  │                                                       │   │
│  │  Account: [Search accounts... 🔍]                    │   │
│  │           Dropdown: "1002 银行存款"                  │   │
│  │                                                       │   │
│  │  Amount: [10000] CNY                                 │   │
│  │                                                       │   │
│  │  What happened? (optional but recommended)           │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ 收到客户张三的货款                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │          [✨ Generate Entry with AI]                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: AI PROCESSING (LOADING)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🤖 AI Assistant is analyzing...                     │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━ 60%                       │   │
│  │                                                       │   │
│  │  ✓ Found account: 1002 银行存款                      │   │
│  │  ✓ Identified scenario: AR Collection (95% match)    │   │
│  │  ⏳ Generating balanced entry...                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 4: AI SUGGESTION (PREVIEW & VALIDATE)           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🎯 Suggested Entry                                  │   │
│  │  Based on: 应收账款收款 (AR Collection)              │   │
│  │  Confidence: ████████░░ 95%                          │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Side   │ Account Code │ Account Name    │ Amount│  │   │
│  │  ├────────┼──────────────┼─────────────────┼───────┤  │   │
│  │  │ Credit │ 1002         │ 银行存款        │10,000 │  │   │
│  │  │ Debit  │ 1122         │ 应收账款  👤    │10,000 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ℹ️ Explanation:                                     │   │
│  │  This entry reduces Accounts Receivable (customer    │   │
│  │  paid what they owe) and increases Bank Deposits.    │   │
│  │                                                       │   │
│  │  ⚠️ Required Information:                            │   │
│  │  Please select which customer made this payment.     │   │
│  │                                                       │   │
│  │  Customer: [Select Customer ▼]                       │   │
│  │           [ + Add New Customer ]                     │   │
│  │                                                       │   │
│  │  [ ✏️ Edit Manually ]  [ ✓ Looks Good, Continue ]   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                   ┌─────┴─────┐
                   │           │
               Edit Path    Happy Path
                   │           │
                   ▼           ▼
         ┌─────────────┐  ┌──────────────────┐
         │ MANUAL EDIT │  │ SELECT CUSTOMER  │
         └─────────────┘  └──────────────────┘
                   │           │
                   └─────┬─────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            STEP 5: FINAL VALIDATION & REVIEW                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✓ Validation Results                                │   │
│  │                                                       │   │
│  │  ✓ Debit-Credit Balance: OK (10,000 = 10,000)       │   │
│  │  ✓ Account Codes: Valid                             │   │
│  │  ✓ Auxiliary Dimensions: Complete (Customer: 张三)   │   │
│  │  ✓ VAT Treatment: Not applicable                    │   │
│  │                                                       │   │
│  │  Entry Date: [2026-01-11] 📅                         │   │
│  │  Description: [收到客户张三的货款]                    │   │
│  │                                                       │   │
│  │  Entry Number: JE-202601-0042 (auto-generated)       │   │
│  │                                                       │   │
│  │         [ ← Back ]  [ 💾 Save as Draft ]  [ ✓ Post ] │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                STEP 6: SUCCESS CONFIRMATION                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✓ Entry Posted Successfully                         │   │
│  │                                                       │   │
│  │  Entry #: JE-202601-0042                             │   │
│  │  Date: 2026-01-11                                    │   │
│  │  Amount: 10,000 CNY                                  │   │
│  │                                                       │   │
│  │  🎉 Great job! Your books are up to date.           │   │
│  │                                                       │   │
│  │  [ View Entry ]  [ ✨ Create Another ]  [ × Close ] │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Alternative Flow: Complex Transaction (Multi-turn Conversation)

```
User Input:
"Credit 应付账款 11300, 采购商品"

AI Response:
"我需要确认一下。这11,300元是:
 1. 含税总价
 2. 不含税价格
请选择。"

User:
"含税"

AI Response:
"增值税率是多少? (商品通常是13%)
[13% (推荐)] [9%] [6%] [其他]"

User:
[Selects "13%"]

AI:
"好的,我为你生成了分录:
 借: 1243 库存商品        10,000 (净价)
 借: 222101 应交增值税     1,300 (进项税额)
 贷: 2202 应付账款        11,300 (总价)

请选择:
1. 供应商
2. 存货项目"

[User completes selections, entry posted]
```

### 6.3 Edge Case Flow: Validation Failure

```
User submits entry with VAT account + auxiliary dimension (not allowed)

AI Response:
"⚠️ 验证失败

问题:
- 科目 222101 (应交增值税) 不能使用辅助核算。
  根据财会〔2016〕22号文件,增值税科目必须使用多栏账,
  不使用客户/供应商辅助核算。

建议:
我已经帮你移除了该科目的辅助核算设置。
请确认修改后的分录:

[Updated entry preview]

[ ✓ Accept Changes ]  [ ✏️ Edit Manually ]"
```

---

## 7. Wireframes & Components

### 7.1 Page: Create Journal Entry (AI-Assisted Mode)

**Layout Structure:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard > Accounting > Journal Entries > Create               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Page Header                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Create Journal Entry                                │  │  │
│  │  │  Let AI help you create accurate accounting entries │  │  │
│  │  │                                                       │  │  │
│  │  │  [Mode Toggle: ● AI-Assisted  ○ Manual]             │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Main Content (2-column layout on desktop)                │  │
│  │                                                            │  │
│  │  ┌──────────────────────────┬─────────────────────────┐   │  │
│  │  │  LEFT: Input Panel       │  RIGHT: AI Assistant   │   │  │
│  │  │  (60% width)             │  (40% width)           │   │  │
│  │  │                          │                         │   │  │
│  │  │  [Initial Input Form]    │  [AI Chat Interface]   │   │  │
│  │  │  or                      │  or                     │   │  │
│  │  │  [Entry Preview Table]   │  [Explanation Card]    │   │  │
│  │  │                          │                         │   │  │
│  │  └──────────────────────────┴─────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Bottom Action Bar (sticky)                               │  │
│  │  [← Cancel]              [💾 Save Draft]    [✓ Post]      │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 Component: Initial Input Form

```tsx
// Component: InitialInputForm.tsx

<Card className="p-6 space-y-6">
  {/* Header */}
  <div className="flex items-center gap-2">
    <IconSparkles className="h-5 w-5 text-ai-accent" />
    <h3 className="text-lg font-semibold">Tell me about the transaction</h3>
  </div>

  {/* Side Selection */}
  <div className="space-y-2">
    <Label className="text-sm font-medium">I know one side of the entry:</Label>
    <RadioGroup defaultValue="credit" className="flex gap-4">
      <RadioGroupItem value="debit" id="debit" />
      <Label htmlFor="debit">Debit (借)</Label>

      <RadioGroupItem value="credit" id="credit" />
      <Label htmlFor="credit">Credit (贷)</Label>
    </RadioGroup>
  </div>

  {/* Account Search */}
  <div className="space-y-2">
    <Label htmlFor="account" className="text-sm font-medium">
      Account <span className="text-destructive">*</span>
    </Label>
    <AccountSearchCombobox
      placeholder="Search by code or name... (e.g., 1002, 银行存款)"
      onSelect={handleAccountSelect}
    />
  </div>

  {/* Amount */}
  <div className="space-y-2">
    <Label htmlFor="amount" className="text-sm font-medium">
      Amount <span className="text-destructive">*</span>
    </Label>
    <div className="relative">
      <Input
        id="amount"
        type="number"
        placeholder="0.00"
        className="pr-12 amount"
        step="0.01"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        CNY
      </span>
    </div>
  </div>

  {/* Description */}
  <div className="space-y-2">
    <Label htmlFor="description" className="text-sm font-medium">
      What happened?
      <span className="text-xs text-muted-foreground ml-2">
        (Helps AI understand the transaction)
      </span>
    </Label>
    <Textarea
      id="description"
      placeholder="E.g., 收到客户张三的货款&#10;Purchased inventory from supplier ABC&#10;Paid office rent for January"
      rows={3}
      className="resize-none"
    />
  </div>

  {/* Submit Button */}
  <Button
    size="lg"
    className="w-full bg-gradient-to-r from-ai-accent to-info hover:opacity-90"
    onClick={handleGenerateEntry}
  >
    <IconSparkles className="mr-2 h-5 w-5" />
    Generate Entry with AI
  </Button>
</Card>
```

### 7.3 Component: Entry Preview Table

```tsx
// Component: EntryPreviewTable.tsx

<Card className="p-0 overflow-hidden">
  {/* Header */}
  <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <IconCheckCircle2 className="h-5 w-5 text-success" />
      <h3 className="text-lg font-semibold">Suggested Entry</h3>
    </div>
    <Badge variant="secondary" className="gap-1">
      <IconSparkles className="h-3 w-3" />
      AI Generated
    </Badge>
  </div>

  {/* Use Case Info */}
  <div className="p-4 bg-info/5 border-b flex items-start gap-3">
    <IconFileText className="h-5 w-5 text-info mt-0.5" />
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">Based on: 应收账款收款 (AR Collection)</span>
        <Badge variant="outline" className="text-xs">
          Confidence: 95%
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        This entry records customer payment for previously recognized revenue.
        No VAT treatment needed as tax was already accounted for during sale.
      </p>
    </div>
  </div>

  {/* Entry Lines Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-muted/30 border-b">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium">Side</th>
          <th className="px-4 py-3 text-left text-sm font-medium">Account</th>
          <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
          <th className="px-4 py-3 text-left text-sm font-medium">Auxiliary</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {/* Debit Line */}
        <tr className="hover:bg-muted/20 transition-colors">
          <td className="px-4 py-4">
            <Badge variant="outline" className="bg-debit/10 text-debit border-debit/30">
              <IconArrowUp className="h-3 w-3 mr-1" />
              Debit
            </Badge>
          </td>
          <td className="px-4 py-4">
            <div className="space-y-0.5">
              <div className="font-medium">1002 银行存款</div>
              <div className="text-xs text-muted-foreground">Bank Deposits</div>
            </div>
          </td>
          <td className="px-4 py-4 text-right">
            <span className="font-mono font-medium text-lg">10,000.00</span>
          </td>
          <td className="px-4 py-4 text-muted-foreground text-sm">-</td>
        </tr>

        {/* Credit Line */}
        <tr className="hover:bg-muted/20 transition-colors">
          <td className="px-4 py-4">
            <Badge variant="outline" className="bg-credit/10 text-credit border-credit/30">
              <IconArrowDown className="h-3 w-3 mr-1" />
              Credit
            </Badge>
          </td>
          <td className="px-4 py-4">
            <div className="space-y-0.5">
              <div className="font-medium">1122 应收账款</div>
              <div className="text-xs text-muted-foreground">Accounts Receivable</div>
            </div>
          </td>
          <td className="px-4 py-4 text-right">
            <span className="font-mono font-medium text-lg">10,000.00</span>
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <IconUser className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-warning">Required</span>
            </div>
          </td>
        </tr>
      </tbody>

      {/* Total Row */}
      <tfoot className="bg-muted/50 border-t-2 border-primary/20">
        <tr>
          <td className="px-4 py-3 font-semibold">Total</td>
          <td className="px-4 py-3"></td>
          <td className="px-4 py-3 text-right font-mono font-semibold text-lg">
            10,000.00
          </td>
          <td className="px-4 py-3"></td>
        </tr>
      </tfoot>
    </table>
  </div>

  {/* Validation Status */}
  <div className="p-4 bg-success/5 border-t flex items-center gap-2">
    <IconCheckCircle2 className="h-5 w-5 text-success" />
    <span className="text-sm font-medium text-success">
      Entry is balanced (Debits = Credits)
    </span>
  </div>
</Card>
```

### 7.4 Component: Auxiliary Selector Dialog

```tsx
// Component: AuxiliarySelectorDialog.tsx

<Dialog open={showAuxSelector} onOpenChange={setShowAuxSelector}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <IconUser className="h-5 w-5" />
        Select Customer
      </DialogTitle>
      <DialogDescription>
        This account (1122 应收账款) requires customer information for
        proper tracking. Select the customer who made this payment.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customer List */}
      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-2 space-y-1">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              className={cn(
                "w-full px-3 py-2 text-left rounded-md transition-colors",
                "hover:bg-accent",
                selectedCustomer?.id === customer.id && "bg-accent"
              )}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="font-medium">{customer.customerName}</div>
              <div className="text-xs text-muted-foreground">
                {customer.customerCode}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Add */}
      <Button variant="outline" className="w-full" onClick={handleAddCustomer}>
        <IconPlus className="h-4 w-4 mr-2" />
        Add New Customer
      </Button>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowAuxSelector(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleConfirmCustomer}
        disabled={!selectedCustomer}
      >
        Confirm Selection
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 7.5 Component: AI Chat Interface

```tsx
// Component: AIChatInterface.tsx

<Card className="h-full flex flex-col">
  {/* Header */}
  <div className="p-4 border-b flex items-center gap-2">
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ai-accent to-info flex items-center justify-center">
      <IconSparkles className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold">AI Accounting Assistant</h3>
      <p className="text-xs text-muted-foreground">Always here to help</p>
    </div>
  </div>

  {/* Chat Messages */}
  <ScrollArea className="flex-1 p-4">
    <div className="space-y-4">
      {/* AI Message */}
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ai-accent to-info flex items-center justify-center flex-shrink-0">
          <IconSparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            I found this is most likely an <strong>Accounts Receivable collection</strong>.
            The entry would reduce AR (customer paid what they owe) and increase
            Bank Deposits.
          </div>
          <span className="text-xs text-muted-foreground">Just now</span>
        </div>
      </div>

      {/* User Message */}
      <div className="flex gap-3 justify-end">
        <div className="flex-1 space-y-2 text-right">
          <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm inline-block">
            收到客户张三的货款
          </div>
          <span className="text-xs text-muted-foreground block">2 minutes ago</span>
        </div>
      </div>

      {/* AI Thinking Indicator */}
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ai-accent to-info flex items-center justify-center flex-shrink-0">
          <IconSparkles className="h-4 w-4 text-white animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-muted-foreground">Analyzing transaction...</span>
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>

  {/* Input (disabled when AI controls flow) */}
  <div className="p-4 border-t">
    <div className="relative">
      <Input
        placeholder="Type your question..."
        disabled
        className="pr-10"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2"
        disabled
      >
        <IconSend className="h-4 w-4" />
      </Button>
    </div>
    <p className="text-xs text-muted-foreground mt-2">
      Follow the AI's guidance to complete your entry
    </p>
  </div>
</Card>
```

### 7.6 Page: Journal Entry List

**Layout Structure:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard > Accounting > Journal Entries                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Page Header                                               │  │
│  │  Journal Entries                 [+ Create New Entry]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Filters Bar                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ [Search...] [Date Range] [Status▼] [Created By▼]    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Summary Cards (3-column grid)                            │  │
│  │  ┌────────────┬────────────┬────────────┐                 │  │
│  │  │ Total      │ This Month │ Pending    │                 │  │
│  │  │ 1,247      │ 89         │ 12         │                 │  │
│  │  │ Entries    │ Entries    │ Drafts     │                 │  │
│  │  └────────────┴────────────┴────────────┘                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Entries Table                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ Entry # │ Date       │ Description │ Amount │ Status│  │  │
│  │  ├─────────┼────────────┼─────────────┼────────┼───────┤  │  │
│  │  │ JE-0042 │ 2026-01-11 │ AR Receipt  │10,000  │Posted │  │  │
│  │  │ 🤖 AI   │            │             │        │  ✓    │  │  │
│  │  ├─────────┼────────────┼─────────────┼────────┼───────┤  │  │
│  │  │ JE-0041 │ 2026-01-10 │ Rent Exp    │ 5,000  │Posted │  │  │
│  │  │         │            │             │        │  ✓    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │  [← Previous]  Page 1 of 25  [Next →]                     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Interactive Prototypes

### 8.1 Prototype Flow: AR Receipt (Happy Path)

**Figma/Interactive Prototype URL:** `https://figma.com/proto/loyalis-journal-entry-agent`

**Key Interactions:**

1. **Landing:** User clicks "Create Journal Entry" from sidebar
2. **Mode Toggle:** AI-Assisted mode pre-selected (default)
3. **Account Search:** Type-ahead search with fuzzy matching
   - User types "银行" → Shows "1002 银行存款", "1012 其他货币资金"
   - Clicking account populates form
4. **Amount Input:** Numeric keyboard on mobile, decimal precision enforced
5. **Description:** Auto-suggest based on previous entries (future enhancement)
6. **Generate Button:**
   - Hover: Gradient intensifies
   - Click: Shows loading state with progress steps
7. **Preview Table:**
   - Rows animate in from top
   - Balance check shows checkmark animation
8. **Auxiliary Selector:**
   - Dialog slides up from bottom
   - Search filters list in real-time
   - Selected customer shows checkmark
9. **Post Button:**
   - Disabled until all validations pass
   - Success: Confetti animation + toast notification

### 8.2 Prototype Flow: Inventory Purchase (Complex VAT)

**Key Interactions:**

1. User enters: Credit AP 11,300
2. AI asks: "含税总价还是不含税?" (Multiple choice buttons)
3. User selects "含税总价"
4. AI asks: "增值税率?" (Chips with common rates: 13%, 9%, 6%)
5. User selects "13%"
6. AI generates 3-line entry:
   - Debit: Inventory 10,000
   - Debit: VAT Input 1,300
   - Credit: AP 11,300
7. AI prompts for:
   - Supplier (dialog)
   - Inventory item (dialog)
8. Both dialogs show search + quick add
9. Validation → Post → Success

---

## 9. Responsive Design

### 9.1 Breakpoints

Following `/home/chris/repo/Badget/STYLING-GUIDE.md`:

- **Mobile:** 0-639px (base styles)
- **Tablet:** 640px-1023px (`md:`)
- **Desktop:** 1024px+ (`lg:`)

### 9.2 Mobile Layout Adaptations

**Create Entry Page (Mobile):**

```
┌────────────────────────┐
│ [← Back] Create Entry  │
├────────────────────────┤
│                        │
│ Mode: ● AI  ○ Manual   │
│                        │
│ [Input Form - Full]    │
│ - Side selector        │
│ - Account search       │
│ - Amount               │
│ - Description          │
│                        │
│ [Generate Button]      │
│                        │
├────────────────────────┤
│ [Preview - Collapsible]│
│ Tap to expand          │
├────────────────────────┤
│                        │
│ [AI Chat - Drawer]     │
│ Swipe up to view       │
│                        │
├────────────────────────┤
│ [Sticky Actions]       │
│ [Cancel] [Post]        │
└────────────────────────┘
```

**Table on Mobile:**
- Horizontal scroll enabled
- Card view toggle for better mobile UX
- Simplified columns (Entry #, Date, Amount, Status)

### 9.3 Tablet Optimizations

- Entry list: 2 summary cards per row (vs. 3 on desktop)
- Create entry: Single column layout with AI chat below form
- Sidebar collapses to icons only

---

## 10. Accessibility

### 10.1 WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
```typescript
// All interactive elements must be keyboard accessible
<Button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>

// Tab order follows visual flow
<form>
  <input tabIndex={1} />
  <select tabIndex={2} />
  <button tabIndex={3}>Submit</button>
</form>

// Skip links for screen readers
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**Screen Reader Support:**
```tsx
// Proper ARIA labels
<Button aria-label="Generate journal entry with AI assistance">
  <IconSparkles aria-hidden="true" />
  Generate Entry
</Button>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {aiMessage}
</div>

// Form validation announcements
<span id="amount-error" role="alert" aria-live="assertive">
  Amount must be greater than zero
</span>
<Input
  aria-describedby="amount-error"
  aria-invalid={hasError}
/>
```

**Color Contrast:**
- All text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1
- Interactive elements: Visual focus indicators (3px ring)

**Focus Management:**
```typescript
// Focus trapping in dialogs
import { useFocusTrap } from '@/hooks/use-focus-trap'

function AuxiliarySelectorDialog() {
  const trapRef = useFocusTrap()

  return (
    <DialogContent ref={trapRef}>
      {/* Dialog content */}
    </DialogContent>
  )
}

// Return focus after dialog closes
onClose={() => {
  setOpen(false)
  previousFocusRef.current?.focus()
}}
```

---

## 11. Error States & Edge Cases

### 11.1 Validation Errors

**Error: Debit-Credit Imbalance**

```tsx
<Alert variant="destructive" className="flex items-start gap-3">
  <IconAlertTriangle className="h-5 w-5 mt-0.5" />
  <div className="flex-1">
    <AlertTitle>Entry is not balanced</AlertTitle>
    <AlertDescription className="space-y-2">
      <p>
        Total debits (10,500) do not equal total credits (10,000).
        The difference is <strong>500 CNY</strong>.
      </p>
      <p className="text-sm">
        💡 Check if you entered the correct amounts or if a line is missing.
      </p>
    </AlertDescription>
  </div>
</Alert>
```

**Error: Missing Auxiliary Dimension**

```tsx
<Alert variant="warning" className="flex items-start gap-3">
  <IconInfo className="h-5 w-5 mt-0.5" />
  <div className="flex-1">
    <AlertTitle>Customer selection required</AlertTitle>
    <AlertDescription>
      Account 1122 (应收账款) requires customer information.
      Please select a customer before posting this entry.
    </AlertDescription>
    <Button
      variant="outline"
      size="sm"
      className="mt-3"
      onClick={() => setShowCustomerSelector(true)}
    >
      Select Customer
    </Button>
  </div>
</Alert>
```

### 11.2 AI Agent Errors

**Error: No Matching Use Case**

```tsx
<Card className="p-6 border-warning bg-warning/5">
  <div className="flex items-start gap-3">
    <IconSparkles className="h-5 w-5 text-warning mt-0.5" />
    <div className="flex-1 space-y-3">
      <div>
        <h3 className="font-semibold">Couldn't find a matching scenario</h3>
        <p className="text-sm text-muted-foreground mt-1">
          I'm not sure how to categorize this transaction based on your description.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Can you provide more details?</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
          <li>Is this a sale, purchase, payment, or other type of transaction?</li>
          <li>Is there a customer or supplier involved?</li>
          <li>Are you paying or receiving money?</li>
        </ul>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRetry}>
          Try Again
        </Button>
        <Button variant="default" size="sm" onClick={handleSwitchToManual}>
          Switch to Manual Mode
        </Button>
      </div>
    </div>
  </div>
</Card>
```

**Error: LLM API Timeout**

```tsx
<Alert variant="destructive">
  <IconAlertCircle className="h-4 w-4" />
  <AlertTitle>AI service temporarily unavailable</AlertTitle>
  <AlertDescription className="space-y-2">
    <p>The AI assistant is taking longer than expected to respond.</p>
    <div className="flex gap-2 mt-3">
      <Button variant="outline" size="sm" onClick={handleRetry}>
        <IconRefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
      <Button variant="default" size="sm" onClick={handleSwitchToManual}>
        Continue Manually
      </Button>
    </div>
  </AlertDescription>
</Alert>
```

### 11.3 Empty States

**No Journal Entries Yet**

```tsx
<div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
    <IconFileText className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
    Start recording your business transactions with our AI-powered assistant.
    It's easier than you think!
  </p>
  <div className="flex gap-3">
    <Button onClick={() => router.push('/dashboard/accounting/journal-entries/create')}>
      <IconSparkles className="h-4 w-4 mr-2" />
      Create First Entry with AI
    </Button>
    <Button variant="outline" onClick={() => setShowDemo(true)}>
      <IconPlay className="h-4 w-4 mr-2" />
      Watch Demo
    </Button>
  </div>
</div>
```

---

## 12. Animation & Micro-interactions

### 12.1 Page Transitions

```tsx
// Using Framer Motion (existing in Loyalis)
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export function CreateEntryPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Page content */}
    </motion.div>
  )
}
```

### 12.2 AI Processing States

```tsx
// Multi-stage loading animation
const processingSteps = [
  { label: "Analyzing input...", duration: 500 },
  { label: "Looking up accounts...", duration: 800 },
  { label: "Matching scenarios...", duration: 1000 },
  { label: "Generating entry...", duration: 700 },
]

<div className="space-y-3">
  {processingSteps.map((step, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: currentStep >= idx ? 1 : 0.3, x: 0 }}
      className="flex items-center gap-3"
    >
      {currentStep > idx ? (
        <IconCheckCircle2 className="h-5 w-5 text-success" />
      ) : currentStep === idx ? (
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-muted" />
      )}
      <span className={cn(
        "text-sm",
        currentStep >= idx ? "text-foreground" : "text-muted-foreground"
      )}>
        {step.label}
      </span>
    </motion.div>
  ))}
</div>
```

### 12.3 Success Animations

```tsx
// Checkmark animation on validation success
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
>
  <IconCheckCircle2 className="h-12 w-12 text-success" />
</motion.div>

// Confetti on entry posted
import confetti from 'canvas-confetti'

function handlePostSuccess() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}
```

### 12.4 Interactive Feedback

```tsx
// Button press effect
<Button
  className="active:scale-95 transition-transform"
  whileTap={{ scale: 0.95 }} // Framer Motion alternative
>
  Post Entry
</Button>

// Hover state for table rows
<tr className="hover:bg-muted/20 transition-colors cursor-pointer">

// Input focus glow
<Input className="focus:ring-ring/50 focus:ring-[3px] transition-shadow" />
```

---

## Appendix A: Component Library

### Complete List of Accounting Components

```
src/components/accounting/
├── journal-entry-form.tsx          # Manual entry form
├── ai-assistant-chat.tsx           # AI conversation UI
├── entry-preview-table.tsx         # Entry preview with validation
├── entry-list-table.tsx            # Journal entry list
├── account-search-combobox.tsx     # Account lookup widget
├── auxiliary-selector-dialog.tsx   # Generic aux selector
│   ├── customer-selector.tsx       # Customer-specific
│   ├── supplier-selector.tsx       # Supplier-specific
│   ├── department-selector.tsx     # Department-specific
│   └── inventory-selector.tsx      # Inventory-specific
├── entry-validation-panel.tsx      # Validation results display
├── use-case-badge.tsx              # Use case template indicator
├── amount-input.tsx                # Formatted currency input
├── side-toggle.tsx                 # Debit/Credit toggle
├── entry-summary-cards.tsx         # Dashboard metrics
└── coa-browser.tsx                 # Chart of Accounts browser
```

---

## Appendix B: User Testing Script

### Usability Test: AI-Assisted Entry Creation

**Scenario:** "You received a 10,000 RMB payment from Customer A via bank transfer for an invoice you sent last month."

**Tasks:**
1. Navigate to journal entry creation
2. Create the entry using AI assistance
3. Complete all required information
4. Post the entry

**Success Criteria:**
- ✅ Task completion without assistance
- ✅ Time < 2 minutes
- ✅ No validation errors
- ✅ User understands AI suggestions

**Observation Points:**
- Does user understand debit/credit selection?
- Does user find account search intuitive?
- Does AI explanation make sense?
- Does user complete auxiliary selection without confusion?

---

## Appendix C: Design Checklist

```
✅ Visual Design
- [ ] Color system defined (OKLCH)
- [ ] Typography hierarchy established
- [ ] Component styles aligned with STYLING-GUIDE.md
- [ ] Icons selected (Lucide)
- [ ] Shadow system applied

✅ User Flows
- [ ] Happy path: AI-assisted entry (simple)
- [ ] Happy path: AI-assisted entry (complex VAT)
- [ ] Alternative: Manual entry
- [ ] Error recovery: Validation failures
- [ ] Error recovery: AI confusion

✅ Components
- [ ] Initial input form
- [ ] Entry preview table
- [ ] AI chat interface
- [ ] Auxiliary selectors (5 types)
- [ ] Validation panel
- [ ] Entry list table

✅ Responsive Design
- [ ] Mobile layouts (320px-639px)
- [ ] Tablet layouts (640px-1023px)
- [ ] Desktop layouts (1024px+)
- [ ] Touch targets ≥ 44px
- [ ] Horizontal scroll for tables

✅ Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support (ARIA)
- [ ] Focus indicators (3px ring)
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus trapping in dialogs

✅ Animations
- [ ] Page transitions (Framer Motion)
- [ ] Loading states (multi-stage)
- [ ] Success animations (confetti)
- [ ] Hover/active feedback
- [ ] Smooth scrolling

✅ Error States
- [ ] Validation errors (5+ types)
- [ ] AI errors (3+ types)
- [ ] Empty states
- [ ] Network errors
- [ ] Graceful degradation
```

---

---

## 4. CopilotKit Integration

### 4.1 Why CopilotKit?

**CopilotKit** provides a production-ready copilot UI framework that eliminates the need for custom chat interface development:

**Benefits:**
- ✅ Pre-built `<CopilotSidebar>` component with conversation threading
- ✅ Automatic message streaming and state management
- ✅ Built-in error handling and retry logic
- ✅ TypeScript-first API with React hooks
- ✅ Customizable styling to match Loyalis design system
- ✅ Seamless integration with Microsoft Agent Framework backend

### 4.2 CopilotKit Architecture

```tsx
<CopilotKit runtimeUrl="/api/copilotkit">
  {/* Provide context to AI */}
  <useCopilotReadable>
    Current entry draft, family data
  </useCopilotReadable>

  {/* Define actions AI can trigger */}
  <useCopilotAction>
    Update entry, request customer selection, etc.
  </useCopilotAction>

  {/* UI Components */}
  <CopilotSidebar>
    <JournalEntryCreationUI />
  </CopilotSidebar>
</CopilotKit>
```

### 4.3 CopilotSidebar UI Behavior

**Default Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Main Content (70%)           │  CopilotSidebar (30%)       │
│                               │                             │
│  ┌─────────────────────────┐  │  ┌───────────────────────┐ │
│  │ Entry Form / Preview    │  │  │ 🤖 AI Assistant       │ │
│  │                         │  │  │                       │ │
│  │ - Account search        │  │  │ [Conversation]        │ │
│  │ - Amount input          │  │  │  User: 收到客户...    │ │
│  │ - Description           │  │  │  AI: 这是应收账款...  │ │
│  │                         │  │  │                       │ │
│  │ [Entry Preview Table]   │  │  │  [Suggested Entry]    │ │
│  │                         │  │  │                       │ │
│  └─────────────────────────┘  │  │ [Input Box]           │ │
│                               │  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Behavior:**
- Sidebar becomes bottom drawer
- Swipe up to expand full-screen chat
- Swipe down to minimize

### 4.4 Custom CopilotKit Styling

To match Loyalis design system, we override CopilotKit's default styles:

```css
/* src/app/globals.css */

/* Sidebar Container */
.copilotKitSidebar {
  border-left: 1px solid var(--border);
  background: var(--card);
  font-family: inherit; /* Use Loyalis fonts */
}

/* Message Bubbles */
.copilotKitMessage {
  border-radius: calc(var(--radius) - 2px); /* 8px */
  padding: 0.75rem 1rem;
  max-width: 85%; /* Prevent ultra-wide bubbles */
}

.copilotKitMessage[data-role="assistant"] {
  background: var(--muted);
  border: 1px solid var(--border);
  color: var(--foreground);
}

.copilotKitMessage[data-role="user"] {
  background: var(--primary);
  color: var(--primary-foreground);
  margin-left: auto; /* Align right */
}

/* AI Thinking Indicator */
.copilotKitThinking {
  color: var(--muted-foreground);
  font-style: italic;
}

.copilotKitThinking::before {
  content: "🤖 ";
}

/* Input Box */
.copilotKitInput {
  border: 1px solid var(--input);
  border-radius: calc(var(--radius) - 2px);
  background: var(--background);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.copilotKitInput:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgb(var(--ring) / 0.5);
}

/* Suggestions / Quick Replies */
.copilotKitSuggestion {
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 4px); /* 6px */
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.copilotKitSuggestion:hover {
  background: var(--secondary)/80;
  transform: translateY(-1px);
}

/* Structured Data Cards (e.g., Entry Preview) */
.copilotKitDataCard {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px); /* 14px */
  padding: 1rem;
  margin: 0.5rem 0;
}
```

### 4.5 CopilotKit Hooks Usage

**1. Make Data Readable to AI:**
```tsx
import { useCopilotReadable } from "@copilotkit/react-core"

function JournalEntryPage() {
  const [entryDraft, setEntryDraft] = useState(null)
  const chartOfAccounts = useChartOfAccounts()

  // AI can read current entry draft
  useCopilotReadable({
    description: "Current journal entry draft being created",
    value: entryDraft,
  })

  // AI can read available accounts
  useCopilotReadable({
    description: "Chart of Accounts for this family",
    value: chartOfAccounts,
  })
}
```

**2. Define Actions AI Can Trigger:**
```tsx
import { useCopilotAction } from "@copilotkit/react-core"

function JournalEntryPage() {
  // Action: Update entry draft
  useCopilotAction({
    name: "updateEntryDraft",
    description: "Update the journal entry with AI-generated suggestions",
    parameters: [
      {
        name: "lines",
        type: "array",
        description: "Array of journal entry lines (debit/credit)",
      },
      {
        name: "useCaseId",
        type: "string",
        description: "Business scenario template ID used",
      },
    ],
    handler: async ({ lines, useCaseId }) => {
      setEntryDraft({ lines, useCaseId })
      toast.success("AI generated entry suggestion")
      return "Entry draft updated successfully"
    },
  })

  // Action: Request customer selection
  useCopilotAction({
    name: "requestCustomerSelection",
    description: "Prompt user to select a customer for auxiliary accounting",
    parameters: [
      {
        name: "accountCode",
        type: "string",
        description: "Account that requires customer selection",
      },
    ],
    handler: async ({ accountCode }) => {
      setShowCustomerDialog(true)
      setRequiredAccountCode(accountCode)
      return "Customer selection dialog opened"
    },
  })

  // Action: Validate entry
  useCopilotAction({
    name: "validateEntry",
    description: "Validate the complete journal entry for compliance",
    parameters: [
      {
        name: "entry",
        type: "object",
        description: "Complete journal entry to validate",
      },
    ],
    handler: async ({ entry }) => {
      const validationResult = await validateJournalEntry(entry)
      setValidationErrors(validationResult.errors)

      if (validationResult.isValid) {
        return "✅ Entry is valid and ready to post"
      } else {
        return `❌ Validation failed:\n${validationResult.errors.join("\n")}`
      }
    },
  })
}
```

**3. Custom Message Rendering:**
```tsx
import { CopilotSidebar } from "@copilotkit/react-ui"
import { EntryPreviewCard } from "@/components/accounting/entry-preview-card"

<CopilotSidebar
  labels={{
    title: "AI Accounting Assistant",
    initial: "Describe your transaction, and I'll help create the journal entry!",
    placeholder: "E.g., 收到客户张三的货款10000元...",
  }}
  defaultOpen={true}
  onInProgress={(inProgress) => {
    // Show loading state in main UI
    setAiProcessing(inProgress)
  }}
  makeSystemMessage={(message) => {
    // Custom rendering for structured data
    if (message.data?.suggestedEntry) {
      return <EntryPreviewCard entry={message.data.suggestedEntry} />
    }
    return message.content
  }}
>
  {children}
</CopilotSidebar>
```

### 4.6 User Interaction Patterns

**Pattern 1: Conversational Entry Creation**
```
User: "收到客户张三的货款10000元"

AI: "我理解了,这是一笔应收账款的收款。让我为你生成凭证:

[Shows EntryPreviewCard with suggested entry]

请从下拉菜单中选择客户 '张三'。"

[CopilotKit triggers requestCustomerSelection action]
[User selects customer from dialog]

User: "已选择"

AI: "好的!凭证已完成验证,可以过账了。"

[Shows Post Entry button in main UI]
```

**Pattern 2: Multi-turn Clarification**
```
User: "购买商品11300元"

AI: "请确认:这11300元是含税总价还是不含税价格?"

[Shows quick reply buttons: "含税总价" | "不含税价格"]

User: [Clicks "含税总价"]

AI: "增值税率是多少? 商品通常是13%。"

[Shows quick reply chips: "13%" | "9%" | "6%" | "其他"]

User: [Clicks "13%"]

AI: "好的,已生成凭证:
- 借: 库存商品 10,000
- 借: 应交增值税(进项税额) 1,300
- 贷: 应付账款 11,300

请选择供应商和存货项目。"
```

### 4.7 CopilotKit vs Custom Chat UI

| Feature | Custom Build | CopilotKit |
|---------|-------------|------------|
| **Development Time** | 2-3 weeks | 2-3 days |
| **Message Threading** | Manual implementation | Built-in |
| **Streaming** | Complex WebSocket/SSE | Automatic |
| **Error Handling** | Custom logic | Retry & fallback |
| **Mobile Responsive** | Custom media queries | Adaptive by default |
| **Accessibility** | Manual ARIA | Built-in WCAG |
| **Conversation History** | Custom state management | Automatic persistence |
| **Rich Content Rendering** | Custom components | `makeSystemMessage` hook |
| **Maintenance** | Ongoing | Framework updates |

**Decision: Use CopilotKit** to accelerate development and leverage production-tested UI patterns.

---

## 5. Information Architecture

*[Previous Information Architecture section remains, numbering updated to section 5]*

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Claude Code | Initial UX/UI design document |
| **2.0** | **2026-01-11** | **Claude Code** | **Added CopilotKit integration design** |

---

**End of UX/UI Design Document**
