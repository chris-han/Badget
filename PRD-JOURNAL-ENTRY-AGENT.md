# Product Requirements Document: AI-Powered Journal Entry Agent

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Product:** Loyalis - AI-Powered Financial Management Platform
**Feature:** Journal Entry Agent for Automated Accounting

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Context](#2-background--context)
3. [Product Vision & Objectives](#3-product-vision--objectives)
4. [User Personas & Use Cases](#4-user-personas--use-cases)
5. [Functional Requirements](#5-functional-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Data Models & Schema](#7-data-models--schema)
8. [AI Agent Design](#8-ai-agent-design)
9. [User Experience & Workflow](#9-user-experience--workflow)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Technical Constraints](#11-technical-constraints)
12. [Success Metrics](#12-success-metrics)
13. [Implementation Roadmap](#13-implementation-roadmap)
14. [Appendix](#14-appendix)

---

## 1. Executive Summary

### 1.1 Purpose

This PRD defines the requirements for building an AI-powered Journal Entry Agent that automates the creation of balanced accounting entries for small businesses operating under Chinese Small Business Accounting Standards (小企业会计准则).

### 1.2 Problem Statement

Small business accountants spend significant time manually creating journal entries, which involves:
- Understanding the business transaction context
- Determining the correct Chart of Accounts (CoA) mappings
- Ensuring debit-credit balance
- Applying correct VAT treatment
- Managing auxiliary accounting dimensions (customer, supplier, department, project, inventory)
- Validating compliance with accounting standards

**Current Pain Points:**
- Manual entry is error-prone and time-consuming
- Requires deep accounting knowledge
- Inconsistent categorization across users
- Complex VAT calculations
- Difficulty maintaining compliance

### 1.3 Proposed Solution

An AI agent that:
1. Accepts partial journal entry input (one side only: debit OR credit)
2. Infers the business scenario through conversational reasoning
3. Automatically generates the balancing entry
4. Ensures compliance with accounting standards and VAT regulations
5. Validates completeness and accuracy

### 1.4 Success Criteria

- **Accuracy:** >95% correct journal entry suggestions
- **Efficiency:** Reduce entry time by >70%
- **User Adoption:** >80% of users actively use the agent
- **Compliance:** 100% adherence to Small Business Accounting Standards
- **User Satisfaction:** >4.5/5 rating

---

## 2. Background & Context

### 2.1 Regulatory Framework (监管框架)

The system must comply with:

1. **小企业会计准则** (Small Business Accounting Standards)
   - Defines standard Chart of Accounts (定义标准会计科目表)
   - Prescribes accounting treatment for common transactions (规定常见交易的会计处理)
   - Specifies reporting requirements (明确报告要求)
   - **Reference Document:** `/home/chris/repo/Badget/小企业会计准则.pdf`

2. **增值税会计处理规定** (VAT Accounting Treatment Regulations - 财会〔2016〕22号)
   - Multi-column ledger requirements for VAT accounts (增值税科目多栏账要求)
   - Prohibition of auxiliary accounting for VAT sub-accounts (禁止增值税子科目使用辅助核算)
   - Specific VAT settlement procedures (增值税结算程序)
   - **Reference Document:** 财会〔2016〕22号文件

3. **会计信息化工作规范** (Accounting Informatization Work Regulations)
   - Data structure requirements (数据结构要求)
   - Audit trail requirements (审计跟踪要求)
   - System security requirements (系统安全要求)

4. **小企业会计准则-会计科目、主要账务处理和财务报表** (Small Business Accounting Standards - Accounts, Major Accounting Treatment, and Financial Statements)
   - **Reference Document:** `/home/chris/repo/Badget/小企业会计准则-会计科目、主要账务处理和财务报表.pdf`

5. **小企业会计账套规范** (Small Business Accounting Books Specifications)
   - **Reference Document:** `/home/chris/repo/Badget/小企业会计账套规范.pdf` or `.docx`

6. **标准会计科目表** (Standard Chart of Accounts)
   - **Reference Document:** `/home/chris/repo/Badget/小企业科目表.xlsx`

### 2.2 Industry Context

**Target Industries:**
- Manufacturing (制造业)
- Service (服务业)
- Trading/Commerce (贸易业)

Each industry has specific CoA requirements and common transaction patterns.

### 2.3 Technical Context

**Existing Platform:** Loyalis (see README2.md for technical stack)

**Technology Stack:**
- **Backend:** Next.js 14 (App Router), PostgreSQL, Prisma ORM
- **Package Management:** Bun, UV
- **Authentication:** Better-auth
- **UI:** React, TypeScript, Tailwind CSS, shadcn/ui
- **External Integration:** Plaid (financial data)
- **AI/ML:** OpenAI GPT-4, Claude

**Architecture Pattern:** Dual-layer (Authentication Layer + Application Layer)

---

## 3. Product Vision & Objectives

### 3.1 Vision

Create an intelligent accounting assistant that enables non-expert users to perform expert-level bookkeeping through natural language interaction and automated reasoning.

### 3.2 Product Objectives

1. **Democratize Professional Accounting**
   - Enable small business owners without accounting expertise to maintain books
   - Reduce dependency on external accountants for routine entries

2. **Ensure Compliance by Design**
   - Embed regulatory requirements into the system
   - Prevent non-compliant entries through validation

3. **Increase Operational Efficiency**
   - Reduce time spent on manual data entry
   - Minimize errors and rework

4. **Provide Educational Value**
   - Explain accounting logic to users
   - Build accounting knowledge over time

### 3.3 Non-Goals (Out of Scope)

- Automated financial statement generation (future phase)
- Tax filing automation (future phase)
- Multi-currency support (v1.0)
- Integration with government tax systems (future phase)
- Custom CoA creation (v1.0 uses templates only)

---

## 4. User Personas & Use Cases

### 4.1 Primary Personas

**Persona 1: Small Business Owner (非专业会计)**
- **Background:** Owns a small trading company, no formal accounting training
- **Goals:** Maintain accurate books without hiring full-time accountant
- **Pain Points:** Doesn't understand debit/credit, afraid of making mistakes
- **Tech Savviness:** Medium (uses basic business software)

**Persona 2: Part-Time Bookkeeper (兼职会计)**
- **Background:** Manages books for 3-5 small businesses
- **Goals:** Process transactions efficiently, minimize errors
- **Pain Points:** Repetitive data entry, complex VAT calculations
- **Tech Savviness:** High (comfortable with accounting software)

**Persona 3: Junior Accountant (初级会计)**
- **Background:** Recent accounting graduate, limited practical experience
- **Goals:** Learn proper accounting practices, avoid mistakes
- **Pain Points:** Uncertainty about edge cases, VAT treatment
- **Tech Savviness:** High

### 4.2 Core Use Cases

**UC-01: AR Receipt (应收账款收款)**
- **Trigger:** Customer pays for previous invoice
- **User Input:** "Debit: Bank 10,000" + "customer payment for invoice"
- **Expected Output:** Credit: Accounts Receivable 10,000 (with customer selection)

**UC-02: Inventory Purchase (商品采购入库)**
- **Trigger:** Received goods with VAT invoice
- **User Input:** "Credit: Accounts Payable 11,300" + "purchased inventory"
- **Expected Output:**
  - Debit: Inventory 10,000
  - Debit: VAT Input 1,300
  - (with supplier and inventory item selection)

**UC-03: Expense Payment (费用支付)**
- **Trigger:** Paid for rent, utilities, etc.
- **User Input:** "Credit: Bank 5,000" + "paid rent"
- **Expected Output:** Debit: Administrative Expenses 5,000 (possibly with VAT split)

**UC-04: Revenue Recognition (销售收入确认)**
- **Trigger:** Delivered goods/services to customer
- **User Input:** "Debit: Bank 11,300" + "sold goods"
- **Expected Output:**
  - Credit: Revenue 10,000
  - Credit: VAT Output 1,300

**UC-05: Salary Payment (工资发放)**
- **Trigger:** Paid employee salaries
- **User Input:** "Credit: Bank 45,000" + "paid salaries"
- **Expected Output:** Debit: Salaries Payable 45,000

See [Appendix A](#appendix-a-complete-use-case-catalog) for full catalog of 30+ use cases.

---

## 5. Functional Requirements

### 5.1 Chart of Accounts (CoA) Management

**REQ-COA-001:** System shall provide industry-specific CoA templates
- Priority: P0 (Must Have)
- Templates: Manufacturing, Service, Trading, Generic
- Compliance: Must align with 小企业会计准则 standard accounts

**REQ-COA-002:** Each account shall have the following attributes (bilingual Chinese-English):
- Priority: P0
- Fields:
  - `accountCode` (科目编码 / Account Code) - 4-6 digit code
  - `accountName` (科目名称 / Account Name) - Chinese name
  - `accountNameEn` (English Name) - English translation for bilingual support
  - `accountCategory` (科目类别 / Account Category) - Asset/Liability/Equity/Cost/Revenue-Expense (资产/负债/权益/成本/损益)
  - `parentCode` (父级科目编码 / Parent Code) - for hierarchical structure
  - `level` (科目级次 / Level) - 1-3 typically
  - `balanceDirection` (余额方向 / Balance Direction) - Debit/Credit/Neutral (借/贷/平)
  - `isLeaf` (明细科目标志 / Is Leaf) - boolean - can post directly
  - `isQuantityAmount` (数量金额核算 / Is Quantity-Amount) - boolean - requires qty tracking
  - `allowVoucherDirectPost` (允许凭证直接过账 / Allow Direct Post) - boolean
  - `auxDimensions` (辅助核算维度 / Auxiliary Dimensions) - customer/supplier/department/project/inventory flags
  - `isVATParent` (增值税父科目标志 / Is VAT Parent) - boolean - e.g., 2221 应交税费
  - `vatColumnType` (增值税栏目类型 / VAT Column Type) - Input/Output/Transfer-out/Export-refund/null (进项/销项/转出/出口退税/无)
  - `notes` (备注说明 / Notes) - regulatory references, industry notes

**Reference Document:** `/home/chris/repo/Badget/小企业科目表.xlsx` (Small Business Chart of Accounts - Standard Reference)

**REQ-COA-003:** CoA shall be importable from structured data (CSV/Excel)
- Priority: P0
- Format: See [Appendix B](#appendix-b-coa-template-structure)

**REQ-COA-004:** System shall prevent manual CoA modification in v1.0
- Priority: P1
- Rationale: Ensure compliance, simplify validation

**REQ-COA-005:** System shall support CoA versioning per legal-entity/company
- Priority: P1
- Allows industry-specific CoA selection during onboarding

### 5.2 Use Case Template Management

**REQ-UCT-001:** System shall maintain a library of business scenario templates
- Priority: P0
- Minimum 30 use cases covering:
  - Revenue (6 scenarios)
  - Purchasing & COGS (6 scenarios)
  - Expenses (6 scenarios)
  - Payroll & Tax (6 scenarios)
  - Fixed Assets (4 scenarios)
  - Other (4 scenarios)

**REQ-UCT-002:** Each use case template shall define (bilingual Chinese-English):
- Priority: P0
- Fields:
  - `useCaseId` (业务场景编码 / Use Case ID) - unique identifier
  - `useCaseName` (业务场景名称 / Use Case Name) - descriptive name in Chinese
  - `useCaseNameEn` (Use Case Name English) - descriptive name in English
  - `industry` (适用行业 / Applicable Industry) - applicable industries
  - `description` (业务说明 / Description) - natural language explanation
  - `triggerKeywords` (触发关键词 / Trigger Keywords) - comma-separated keywords for matching
  - `patternType` (分录模式 / Pattern Type) - single-single/multi-single/single-multi/complex
  - `journalPatternJSON` (凭证模板 / Journal Pattern) - template with placeholders
  - `vatHandling` (增值税处理 / VAT Handling) - description of VAT treatment
  - `auxRequirement` (辅助核算要求 / Auxiliary Requirement) - required auxiliary dimensions
  - `riskNote` (风险提示 / Risk Note) - warnings and edge cases

**REQ-UCT-003:** Templates shall be importable from structured data
- Priority: P0
- Format: See [Appendix C](#appendix-c-use-case-template-structure)

**REQ-UCT-004:** Journal pattern JSON shall support formula expressions
- Priority: P0
- Examples: `=input.total`, `=input.net`, `=input.vat`, `=input.amount`
- Enables dynamic calculation based on user input

### 5.3 AI Agent Core Functionality

**REQ-AGT-001:** Agent shall accept partial journal entry input
- Priority: P0
- Input format:
  - One side (debit OR credit) with:
    - Account (name or code)
    - Amount
    - Optional: Date, description, context
  - Natural language description of transaction

**REQ-AGT-002:** Agent shall infer business scenario through conversation
- Priority: P0
- Conversation flow:
  1. Parse initial input
  2. Identify ambiguities
  3. Ask clarifying questions (max 2-3 exchanges)
  4. Present top 1-3 matching scenarios
  5. Get user confirmation

**REQ-AGT-003:** Agent shall generate balanced journal entry recommendation
- Priority: P0
- Output includes:
  - All entry lines (debit and credit)
  - Account codes and names
  - Amounts
  - VAT columns (if applicable)
  - Required auxiliary dimensions
  - Natural language explanation

**REQ-AGT-004:** Agent shall validate entry before finalization
- Priority: P0
- Validations:
  - Debit-credit balance
  - Account code validity
  - Auxiliary dimension completeness
  - VAT column correctness
  - Leaf account posting rules

**REQ-AGT-005:** Agent shall provide explanations for all recommendations
- Priority: P1
- Includes:
  - Which use case template was applied
  - Why this template was selected
  - Regulatory basis (if applicable)
  - Warnings for edge cases

**REQ-AGT-006:** Agent shall handle errors gracefully
- Priority: P1
- Error scenarios:
  - No matching use case found → Ask user to describe differently
  - Multiple equally valid matches → Present options
  - Validation failures → Explain issue and request correction
  - Insufficient information → Ask specific questions

### 5.4 Tool/Function Requirements

**REQ-TOOL-001:** System shall implement `LookupAccount` tool
- Priority: P0
- Input: Company ID + query string
- Output: Matching accounts with metadata
- Features:
  - Exact match on code/name
  - Fuzzy match on name
  - Pinyin support (optional for v1.0)
  - Multi-match disambiguation

**REQ-TOOL-002:** System shall implement `GetUseCaseCandidates` tool
- Priority: P0
- Input: Company ID, industry, user description, known side info
- Output: Ranked list of matching use cases with confidence scores
- Algorithm: Keyword matching + account type matching + industry filtering

**REQ-TOOL-003:** System shall implement `GetJournalTemplateForUseCase` tool
- Priority: P0
- Input: Company ID, use case ID, known side info, extra parameters (VAT rate, etc.)
- Output: Populated journal entry lines with required auxiliary dimensions
- Features:
  - Template variable substitution
  - VAT calculation
  - Auxiliary dimension detection

**REQ-TOOL-004:** System shall implement `ValidateAndFinalizeEntry` tool
- Priority: P0
- Input: Company ID, complete journal draft
- Output: Validation result (pass/fail) + errors/warnings + normalized entry
- Validations:
  - Balance check (sum of debits = sum of credits)
  - Account existence and leaf status
  - Auxiliary dimension requirements met
  - VAT account rules (multi-column, not auxiliary)
  - Amount precision (2 decimal places)

### 5.5 User Interface Requirements

**REQ-UI-001:** Provide journal entry creation interface with AI assistance
- Priority: P0
- Components:
  - Manual entry form (traditional mode)
  - AI-assisted mode toggle
  - Chat interface for agent interaction
  - Preview pane for generated entries
  - Validation feedback display

**REQ-UI-002:** Support both manual and AI-assisted workflows
- Priority: P0
- User can switch between modes at any time
- AI suggestions can be manually edited before saving

**REQ-UI-003:** Display auxiliary dimension selectors as needed
- Priority: P0
- Dynamic forms based on account requirements
- Type-ahead search for customers, suppliers, etc.
- Must use shadcn dialog (not browser alert) per technical constraints

**REQ-UI-004:** Provide entry validation feedback in real-time
- Priority: P1
- Highlight errors/warnings inline
- Explain validation failures clearly
- Suggest corrections when possible

**REQ-UI-005:** Show audit trail and explanation for AI-generated entries
- Priority: P1
- Metadata includes:
  - Use case template applied
  - Confidence score
  - Timestamp and user
  - Edit history

---

## 6. Technical Architecture

### 6.1 Architecture Principles

**Principle 1: Separation of Concerns**
- Agent handles reasoning and orchestration
- Tools handle data access and business rules
- CoA and templates are configuration data, not code

**Principle 2: Agent Does Not Hold State**
- Agent is stateless (conversation context only)
- CoA is accessed via tools, not embedded in agent context
- Supports multi-tenancy naturally

**Principle 3: Structured Data via Tools**
- Avoid loading large datasets into LLM context
- Use function calling for all structured data access
- Reduces hallucination risk

**Principle 4: Validation at Every Stage**
- Input validation (user entry)
- Intermediate validation (template matching)
- Final validation (complete entry)

### 6.2 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  (Next.js Client Components + shadcn/ui)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   JournalEntryAgent                          │
│  (LLM-based reasoning + conversation management)            │
│  - Parses user input                                         │
│  - Manages conversation flow                                 │
│  - Calls tools via function calling                          │
│  - Generates natural language explanations                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Tool Layer                              │
│  (Next.js Server Actions + TypeScript)                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LookupAccount                                        │   │
│  │ - Query: account name/code                          │   │
│  │ - Returns: account metadata                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ GetUseCaseCandidates                                 │   │
│  │ - Input: description + known side                   │   │
│  │ - Returns: ranked use cases                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ GetJournalTemplateForUseCase                        │   │
│  │ - Input: use case + parameters                      │   │
│  │ - Returns: populated entry lines                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ValidateAndFinalizeEntry                            │   │
│  │ - Input: complete journal draft                     │   │
│  │ - Returns: validation result + normalized entry     │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  (PostgreSQL + Prisma ORM)                                  │
│                                                              │
│  - ChartOfAccount (CoA metadata)                            │
│  - UseCaseTemplate (scenario templates)                     │
│  - JournalEntry (posted entries)                            │
│  - AuxiliaryDimensions (customers, suppliers, etc.)         │
│  - VATConfiguration (tax rules)                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Agent Framework Selection

**Recommendation: Build custom agent using LangChain/LangGraph or Claude Agent SDK**

**Rationale:**
1. Microsoft Agent Framework may have limitations for our use case
2. Need full control over conversation flow and tool orchestration
3. Better integration with existing Next.js architecture
4. Flexibility to switch LLM providers (OpenAI GPT-4 ↔ Claude)

**Alternative:** If Microsoft ecosystem is preferred, use Azure AI Agents with custom tools

### 6.4 LLM Provider Strategy

**Primary:** OpenAI GPT-4 or Claude Sonnet 4.5
**Considerations:**
- Function calling support (required)
- Cost vs. accuracy tradeoff
- Chinese language proficiency
- Response latency

**Fallback Strategy:**
- Use smaller model (GPT-3.5 or Claude Haiku) for simple lookups
- Use larger model (GPT-4 or Claude Opus) for complex reasoning

### 6.5 Data Flow

**Typical Flow: User Creates Journal Entry with AI Assistance**

1. **User Input**
   ```
   User: "Debit: Bank 10,000. Customer paid invoice."
   ```

2. **Frontend → Agent**
   ```typescript
   POST /api/agent/journal-entry
   {
     "familyId": "fam_123",
     "userInput": "Debit: Bank 10,000. Customer paid invoice.",
     "conversationId": "conv_456" // optional, for multi-turn
   }
   ```

3. **Agent → LookupAccount Tool**
   ```typescript
   lookupAccount({
     companyId: "fam_123",
     query: "Bank"
   })
   // Returns: { accountCode: "1002", accountName: "银行存款", ... }
   ```

4. **Agent → GetUseCaseCandidates Tool**
   ```typescript
   getUseCaseCandidates({
     companyId: "fam_123",
     industry: "trading",
     text: "Customer paid invoice",
     knownSide: {
       side: "debit",
       accountCode: "1002",
       amount: 10000
     }
   })
   // Returns: [
   //   { useCaseId: "UC_AR_Receipt", confidence: 0.95, ... },
   //   { useCaseId: "UC_Advance_From_Customer", confidence: 0.15, ... }
   // ]
   ```

5. **Agent Reasoning**
   - Top match: UC_AR_Receipt (AR collection)
   - Confidence high enough to proceed
   - May ask user: "This is payment for a previous invoice, correct? Not advance payment?"

6. **User Confirmation**
   ```
   User: "Yes, invoice payment."
   ```

7. **Agent → GetJournalTemplateForUseCase Tool**
   ```typescript
   getJournalTemplateForUseCase({
     companyId: "fam_123",
     useCaseId: "UC_AR_Receipt",
     knownSide: {
       side: "debit",
       accountCode: "1002",
       amount: 10000
     }
   })
   // Returns: {
   //   lines: [
   //     { side: "debit", accountCode: "1002", amount: 10000, ... },
   //     { side: "credit", accountCode: "1122", amount: 10000,
   //       auxToFill: ["customer"] }
   //   ],
   //   explanation: "Based on AR Receipt template..."
   // }
   ```

8. **Agent → User**
   ```
   Agent: "Suggested entry:
   Debit: 1002 Bank Deposit 10,000
   Credit: 1122 Accounts Receivable 10,000

   Please select the customer for this payment."
   ```

9. **User Selects Customer**
   ```
   User: [Selects "Customer A" from dropdown]
   ```

10. **Agent → ValidateAndFinalizeEntry Tool**
    ```typescript
    validateAndFinalizeEntry({
      companyId: "fam_123",
      journalDraft: {
        date: "2026-01-11",
        description: "Customer A paid invoice",
        lines: [
          { side: "debit", accountCode: "1002", amount: 10000, aux: {} },
          { side: "credit", accountCode: "1122", amount: 10000,
            aux: { customerId: "cust_a" } }
        ]
      }
    })
    // Returns: {
    //   isValid: true,
    //   errors: [],
    //   warnings: [],
    //   normalizedJournal: { ... }
    // }
    ```

11. **Agent → User**
    ```
    Agent: "Entry validated successfully. Ready to post."
    ```

12. **Frontend Saves Entry**
    ```typescript
    POST /api/journal-entries
    { ...normalizedJournal }
    ```

---

## 7. Data Models & Schema

### 7.1 Core Entities

**LegalEntity** (Multi-tenant unit)
```prisma
model LegalEntity {
  id              String   @id @default(cuid())
  name            String
  industry        String   // "manufacturing" | "service" | "trading"
  taxpayerType    String   // "general" | "small-scale"
  accountingGAAP  String   @default("small-business-gaap-cn")

  coaTemplateId   String   // Links to specific CoA template

  chartOfAccounts ChartOfAccount[]
  useCaseTemplates UseCaseTemplate[]
  journalEntries  JournalEntry[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**ChartOfAccount** (Company-specific CoA / 企业会计科目表)
```prisma
model ChartOfAccount {
  id                      String   @id @default(cuid())
  familyId                String
  legal-entity                  LegalEntity   @relation(fields: [familyId], references: [id])

  // Bilingual Account Information (中英文双语科目信息)
  accountCode             String   // 科目编码 e.g., "1002", "222101"
  accountName             String   // 科目名称(中文) e.g., "银行存款", "应交增值税"
  accountNameEn           String?  // Account Name (English) e.g., "Bank Deposits", "VAT Payable"
  accountCategory         String   // 科目类别 "asset" | "liability" | "equity" | "cost" | "revenue-expense"
  parentCode              String?  // 父级科目编码 For hierarchical structure
  level                   Int      // 科目级次 1, 2, 3...
  balanceDirection        String   // 余额方向 "debit" | "credit" | "neutral"

  isLeaf                  Boolean  @default(true)   // 明细科目标志
  isQuantityAmount        Boolean  @default(false)  // 数量金额核算
  allowVoucherDirectPost  Boolean  @default(true)   // 允许凭证直接过账

  // Auxiliary Accounting Flags (辅助核算标志)
  auxCustomer             Boolean  @default(false)  // 客户辅助核算
  auxSupplier             Boolean  @default(false)  // 供应商辅助核算
  auxDepartment           Boolean  @default(false)  // 部门辅助核算
  auxProject              Boolean  @default(false)  // 项目辅助核算
  auxInventory            Boolean  @default(false)  // 存货辅助核算

  // VAT-specific (增值税专用字段)
  isVATParent             Boolean  @default(false)  // 增值税父科目标志
  vatColumnType           String?  // 增值税栏目类型 "input" | "output" | "transfer-out" | "export-refund" | null

  notes                   String?  // 备注说明 Regulatory references, usage notes

  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@unique([familyId, accountCode])
  @@index([familyId, accountName])
}
```

**Note:** The standard Chart of Accounts structure is based on the Small Business Accounting Standards (小企业会计准则) as defined in `/home/chris/repo/Badget/小企业科目表.xlsx`.

**UseCaseTemplate** (Business scenario templates / 业务场景模板)
```prisma
model UseCaseTemplate {
  id                String   @id @default(cuid())
  familyId          String?  // null = global template
  legal-entity            LegalEntity?  @relation(fields: [familyId], references: [id])

  // Bilingual Use Case Information (中英文双语业务场景信息)
  useCaseId         String   @unique // 业务场景编码 e.g., "UC_AR_Receipt"
  useCaseName       String   // 业务场景名称(中文) e.g., "应收账款收款"
  useCaseNameEn     String?  // Use Case Name (English) e.g., "AR Collection"
  industry          String[] // 适用行业 ["trading", "service", "manufacturing"] or ["all"]

  description       String   @db.Text // 业务说明
  triggerKeywords   String[] // 触发关键词 ["收款", "回款", "客户付款"]

  patternType       String   // 分录模式 "single-single" | "multi-single" | "single-multi" | "complex"
  journalPatternJSON Json    // 凭证模板 Template structure

  vatHandling       String   @db.Text // 增值税处理说明
  auxRequirement    Json     // 辅助核算要求 { "1122": ["customer"], "2202": ["supplier"] }
  riskNote          String?  @db.Text // 风险提示

  isActive          Boolean  @default(true)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([familyId])
}
```

**JournalEntry** (Posted accounting entries)
```prisma
model JournalEntry {
  id                String   @id @default(cuid())
  familyId          String
  legal-entity            LegalEntity   @relation(fields: [familyId], references: [id])

  entryNumber       String   // Auto-generated sequential number
  entryDate         DateTime
  description       String   @db.Text

  // AI metadata
  useCaseId         String?  // Which template was used
  aiGenerated       Boolean  @default(false)
  aiConfidence      Float?

  // Audit
  createdBy         String   // AppUser ID
  approvedBy        String?
  approvedAt        DateTime?

  status            String   @default("draft") // "draft" | "posted" | "voided"

  lines             JournalEntryLine[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([familyId, entryNumber])
  @@index([familyId, entryDate])
}
```

**JournalEntryLine** (Individual debit/credit lines)
```prisma
model JournalEntryLine {
  id              String        @id @default(cuid())
  journalEntryId  String
  journalEntry    JournalEntry  @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)

  lineNumber      Int           // Order within entry

  side            String        // "debit" | "credit"
  accountCode     String
  accountName     String        // Denormalized for performance
  amount          Decimal       @db.Decimal(15, 2)
  currency        String        @default("CNY")

  // VAT-specific
  vatColumn       String?       // "input" | "output" | "transfer-out" | etc.

  // Auxiliary dimensions (optional based on account requirements)
  customerId      String?
  supplierId      String?
  departmentId    String?
  projectId       String?
  inventoryItemId String?

  // Quantity tracking (if isQuantityAmount = true)
  quantity        Decimal?      @db.Decimal(15, 4)
  unit            String?
  unitPrice       Decimal?      @db.Decimal(15, 4)

  notes           String?       @db.Text

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([journalEntryId])
}
```

### 7.2 Additional Supporting Entities

**Customer**, **Supplier**, **Department**, **Project**, **InventoryItem** (for auxiliary accounting)

Refer to existing Loyalis schema for detailed definitions.

---

## 8. AI Agent Design

### 8.1 Agent Architecture

**Framework:** Custom implementation using LangChain or Claude Agent SDK

**Core Components:**
1. **Conversation Manager:** Handles multi-turn dialogue
2. **Intent Parser:** Extracts transaction details from natural language
3. **Tool Orchestrator:** Calls appropriate tools in sequence
4. **Response Generator:** Formats tool results into natural language
5. **Validation Engine:** Ensures all requirements met before finalization

### 8.2 System Prompt Design

```text
# Role and Context
You are a professional accounting assistant for small businesses in China.
You help users create accurate journal entries that comply with the
Small Business Accounting Standards (小企业会计准则) and VAT regulations.

# Your Capabilities
- You have access to the company's Chart of Accounts (CoA)
- You can look up accounts by name or code
- You know 30+ common business transaction scenarios (use cases)
- You can generate balanced journal entries with proper VAT treatment
- You validate entries for compliance and completeness

# Your Constraints
- You MUST use only accounts that exist in the company's CoA
- You CANNOT create or modify accounts
- You MUST ensure debit = credit for every entry
- You MUST follow VAT multi-column ledger rules
- You MUST collect required auxiliary information (customer, supplier, etc.)

# Workflow
When a user provides a partial journal entry:

1. **Parse Input**
   - Extract the known side (debit or credit), account, and amount
   - Extract any contextual description

2. **Clarify if Needed**
   - If the business scenario is ambiguous, ask 1-2 clarifying questions
   - Examples: "Is this a customer payment or advance payment?"
   - Keep questions simple and focused

3. **Identify Use Case**
   - Call GetUseCaseCandidates with the description and known info
   - If top match confidence > 0.8, proceed
   - If multiple good matches (confidence 0.5-0.8), present options to user

4. **Generate Entry**
   - Call GetJournalTemplateForUseCase with selected use case
   - Present the complete entry to the user
   - Explain which accounts will be debited/credited and why

5. **Collect Auxiliary Info**
   - If any account requires customer, supplier, department, etc., ask user to select
   - Explain why this information is needed

6. **Validate**
   - Call ValidateAndFinalizeEntry with the complete draft
   - If validation fails, explain the issue clearly and suggest correction
   - If validation passes, confirm entry is ready to post

# Tone and Style
- Professional but friendly
- Use accounting terminology correctly but explain when needed
- Be concise - avoid lengthy explanations unless asked
- Always explain your reasoning (which template, why)
- If uncertain, ask rather than guess

# Error Handling
- If you cannot find a matching account → Ask user to check account name/code
- If no use case matches → Ask user to describe the transaction differently
- If validation fails → Explain what's wrong and how to fix it
- Never make up account codes or amounts

# Important Reminders
- VAT accounts (222101 应交增值税) MUST use multi-column ledgers, NOT auxiliary accounting
- Always check if an account requires auxiliary dimensions (customer, supplier, etc.)
- Small Business GAAP does not allow impairment except for long-term investments
- Revenue recognition requires performance obligation to be fulfilled
```

### 8.3 Tool Definitions (Function Calling Schema)

**Tool 1: LookupAccount**

```typescript
{
  name: "lookupAccount",
  description: "Look up account information from the Chart of Accounts by name or code. Supports fuzzy matching.",
  parameters: {
    type: "object",
    properties: {
      companyId: {
        type: "string",
        description: "The legal-entity/company ID"
      },
      query: {
        type: "string",
        description: "Account name (Chinese) or account code to search for. E.g., '银行存款', '1002', 'bank'"
      }
    },
    required: ["companyId", "query"]
  }
}
```

**Tool 2: GetUseCaseCandidates**

```typescript
{
  name: "getUseCaseCandidates",
  description: "Find matching business scenario templates based on user description and known journal entry side.",
  parameters: {
    type: "object",
    properties: {
      companyId: {
        type: "string",
        description: "The legal-entity/company ID"
      },
      industry: {
        type: "string",
        description: "Company industry type",
        enum: ["manufacturing", "service", "trading", "all"]
      },
      text: {
        type: "string",
        description: "User's description of the transaction. E.g., '客户付货款', 'purchased inventory'"
      },
      knownSide: {
        type: "object",
        description: "The side of the entry that user has provided",
        properties: {
          side: {
            type: "string",
            enum: ["debit", "credit"],
            description: "Whether the known side is debit or credit"
          },
          accountCode: {
            type: "string",
            description: "Account code from CoA (use lookupAccount first)"
          },
          amount: {
            type: "number",
            description: "Transaction amount"
          }
        },
        required: ["side", "accountCode"]
      }
    },
    required: ["companyId", "text", "knownSide"]
  }
}
```

**Tool 3: GetJournalTemplateForUseCase**

```typescript
{
  name: "getJournalTemplateForUseCase",
  description: "Generate journal entry lines based on a use case template and user inputs.",
  parameters: {
    type: "object",
    properties: {
      companyId: {
        type: "string"
      },
      useCaseId: {
        type: "string",
        description: "The use case ID from getUseCaseCandidates result"
      },
      knownSide: {
        type: "object",
        description: "The known entry side with details",
        properties: {
          side: { type: "string", enum: ["debit", "credit"] },
          accountCode: { type: "string" },
          amount: { type: "number" }
        },
        required: ["side", "accountCode", "amount"]
      },
      extraInput: {
        type: "object",
        description: "Additional parameters like VAT rate, discount, etc.",
        properties: {
          vatRate: { type: "number", description: "VAT rate (e.g., 0.13 for 13%)" },
          total: { type: "number", description: "Total amount including VAT" },
          net: { type: "number", description: "Net amount excluding VAT" }
        }
      }
    },
    required: ["companyId", "useCaseId", "knownSide"]
  }
}
```

**Tool 4: ValidateAndFinalizeEntry**

```typescript
{
  name: "validateAndFinalizeEntry",
  description: "Validate a complete journal entry draft for compliance and correctness.",
  parameters: {
    type: "object",
    properties: {
      companyId: {
        type: "string"
      },
      journalDraft: {
        type: "object",
        description: "Complete journal entry to validate",
        properties: {
          date: {
            type: "string",
            format: "date",
            description: "Entry date in YYYY-MM-DD format"
          },
          description: {
            type: "string",
            description: "Entry description/memo"
          },
          lines: {
            type: "array",
            description: "All journal entry lines (debit and credit)",
            items: {
              type: "object",
              properties: {
                side: { type: "string", enum: ["debit", "credit"] },
                accountCode: { type: "string" },
                amount: { type: "number" },
                currency: { type: "string", default: "CNY" },
                vatColumn: { type: "string", description: "VAT column type if applicable" },
                aux: {
                  type: "object",
                  description: "Auxiliary dimensions",
                  properties: {
                    customerId: { type: "string" },
                    supplierId: { type: "string" },
                    departmentId: { type: "string" },
                    projectId: { type: "string" },
                    inventoryItemId: { type: "string" }
                  }
                }
              },
              required: ["side", "accountCode", "amount"]
            }
          }
        },
        required: ["date", "lines"]
      }
    },
    required: ["companyId", "journalDraft"]
  }
}
```

### 8.4 Conversation Flow Examples

**Example 1: Simple AR Receipt**

```
User: Debit Bank 10000, customer paid invoice

Agent: [Calls lookupAccount("Bank")]
       [Calls getUseCaseCandidates with "customer paid invoice"]

       I found this is most likely an Accounts Receivable collection.
       The entry would be:
       - Debit: 1002 Bank Deposit 10,000
       - Credit: 1122 Accounts Receivable 10,000

       Which customer made this payment?

User: [Selects "Customer A"]

Agent: [Calls validateAndFinalizeEntry]

       Entry validated! Summary:
       - Debit: 1002 Bank Deposit 10,000
       - Credit: 1122 Accounts Receivable 10,000 (Customer A)

       Ready to post this entry?

User: Yes

Agent: Entry posted successfully!
```

**Example 2: Purchase with VAT (requires clarification)**

```
User: Credit Accounts Payable 11300, purchased something

Agent: [Calls lookupAccount("Accounts Payable")]
       [Calls getUseCaseCandidates]

       I need to understand what you purchased. Is this:
       1. Inventory/goods for resale
       2. Fixed assets (equipment, property)
       3. Services or expenses (rent, utilities, etc.)

User: Inventory

Agent: [Calls getJournalTemplateForUseCase("UC_Purchase_Inventory")]

       Got it. Is the 11,300 the total including VAT, or just the net amount?

User: Total including VAT

Agent: What's the VAT rate? (Usually 13% for goods)

User: 13%

Agent: [Calculates: net = 11300/1.13 = 10000, VAT = 1300]
       [Calls getJournalTemplateForUseCase with vatRate=0.13]

       Here's the entry:
       - Debit: 1243 Inventory 10,000
       - Debit: 222101 VAT Input 1,300 (VAT column: Input Tax)
       - Credit: 2202 Accounts Payable 11,300

       Please select:
       1. Which supplier?
       2. Which inventory item(s)?

User: [Selects supplier and inventory item]

Agent: [Calls validateAndFinalizeEntry]

       Entry validated! Ready to post?
```

**Example 3: Ambiguous Scenario**

```
User: Debit Bank 5000

Agent: [Calls lookupAccount("Bank")]

       I need more context. What is this 5,000 for? Examples:
       - Customer payment
       - Loan received
       - Owner investment
       - Interest income
       - Other income

User: Customer payment but they haven't received goods yet

Agent: [Calls getUseCaseCandidates with "customer payment no goods"]

       This sounds like Advance Payment from Customer (预收账款).
       The entry would be:
       - Debit: 1002 Bank Deposit 5,000
       - Credit: 2203 Advance from Customers 5,000

       This is a liability because you haven't fulfilled your obligation yet.
       When you deliver the goods later, we'll:
       1. Debit Advance from Customers
       2. Credit Revenue + VAT Output

       Is this correct?

User: Yes

Agent: [Continues to collect customer info and validate...]
```

---

## 9. User Experience & Workflow

### 9.1 Primary Workflow: AI-Assisted Entry Creation

**Entry Point:** User navigates to "Create Journal Entry" page

**Step 1: Choose Mode**
- [ ] Manual Entry (traditional form)
- [x] AI-Assisted Entry (recommended)

**Step 2: Provide Initial Information**

Interface shows:
```
┌─────────────────────────────────────────────────────┐
│  Create Journal Entry with AI                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  I know one side of the entry:                     │
│                                                     │
│  ○ Debit  ● Credit                                 │
│                                                     │
│  Account: [________________] 🔍 (search/lookup)    │
│  Amount:  [________________] CNY                   │
│                                                     │
│  What happened? (optional but recommended)         │
│  ┌───────────────────────────────────────────────┐ │
│  │ Received payment from customer for invoice    │ │
│  │                                                │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│           [ Generate Entry with AI ]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 3: AI Conversation (if needed)**

If agent needs clarification:
```
┌─────────────────────────────────────────────────────┐
│  AI Assistant                                       │
├─────────────────────────────────────────────────────┤
│  🤖 Is this payment for a previous invoice         │
│     (confirmed revenue), or is it advance payment? │
│                                                     │
│  You: [ Previous invoice ▼ ]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 4: Review Generated Entry**

```
┌─────────────────────────────────────────────────────┐
│  Suggested Journal Entry                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Based on: AR Receipt (应收账款收款)                │
│  Confidence: 95%                                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Side   │ Account          │ Amount            │ │
│  ├────────┼──────────────────┼──────────────────┤ │
│  │ Debit  │ 1002 Bank        │ 10,000.00         │ │
│  │ Credit │ 1122 AR          │ 10,000.00         │ │
│  │        │  👤 Customer: ? │                   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ℹ️ This account requires customer selection       │
│                                                     │
│  Customer: [Select Customer ▼]                     │
│           [ + Add New Customer ]                   │
│                                                     │
│  [ ✏️ Edit Manually ]  [ ✓ Accept & Validate ]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 5: Auxiliary Dimension Selection**

(Dynamic form based on account requirements)

**Step 6: Final Validation**

```
┌─────────────────────────────────────────────────────┐
│  Validation Results                                 │
├─────────────────────────────────────────────────────┤
│  ✓ Debit-Credit Balance: OK                        │
│  ✓ Account Codes: Valid                            │
│  ✓ Auxiliary Dimensions: Complete                  │
│  ✓ VAT Treatment: Compliant                        │
│                                                     │
│  Entry Date: [ 2026-01-11 ] 📅                     │
│  Description: [ Customer A paid invoice ]          │
│                                                     │
│           [ Cancel ]  [ Post Entry ]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 7: Confirmation**

```
┌─────────────────────────────────────────────────────┐
│  ✓ Entry Posted Successfully                        │
├─────────────────────────────────────────────────────┤
│  Entry #: JE-2026-0015                              │
│  Date: 2026-01-11                                   │
│                                                     │
│  [ View Entry ]  [ Create Another ]  [ Close ]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 9.2 Alternative Workflow: Manual Override

At any step, user can click "Edit Manually" to switch to traditional form with all fields.

AI suggestions are preserved as defaults but fully editable.

### 9.3 Mobile Considerations

- Voice input for transaction description (future)
- Simplified conversation interface for small screens
- Quick actions for common transactions

---

## 10. Non-Functional Requirements

### 10.1 Performance

**REQ-PERF-001:** Agent response time < 3 seconds for simple queries
- P0
- Measured from user input submission to first agent response

**REQ-PERF-002:** Agent response time < 8 seconds for complex queries
- P0
- Includes multi-tool calls and calculations

**REQ-PERF-003:** Tool execution time < 500ms each
- P1
- LookupAccount, GetUseCaseCandidates should be near-instant
- Template generation and validation may take slightly longer

**REQ-PERF-004:** Support concurrent users
- P1
- Target: 100 concurrent agent conversations
- Stateless agent design enables horizontal scaling

### 10.2 Reliability

**REQ-REL-001:** Agent uptime > 99%
- P1
- Excludes planned maintenance

**REQ-REL-002:** Graceful degradation if LLM unavailable
- P0
- Fall back to manual entry mode with clear messaging

**REQ-REL-003:** Data consistency guarantees
- P0
- Posted journal entries must never violate debit-credit balance
- Use database constraints and application-level validation

**REQ-REL-004:** Audit trail for all AI-generated entries
- P0
- Store template used, confidence score, user modifications

### 10.3 Security

**REQ-SEC-001:** Agent cannot access data outside user's legal-entity
- P0
- Enforce legal-entity isolation at database and API level

**REQ-SEC-002:** Sensitive financial data encrypted at rest and in transit
- P0
- Use existing Loyalis encryption mechanisms

**REQ-SEC-003:** LLM API keys stored securely
- P0
- Use environment variables, not committed to code
- Rotate keys regularly

**REQ-SEC-004:** Rate limiting on agent API
- P1
- Prevent abuse and control costs
- Limit: 100 agent calls per user per hour (configurable)

### 10.4 Compliance

**REQ-COMP-001:** All generated entries must comply with Small Business GAAP
- P0
- Validation rules enforce compliance

**REQ-COMP-002:** VAT treatment must follow 财会〔2016〕22号
- P0
- Multi-column ledger for VAT accounts
- No auxiliary accounting on VAT sub-accounts

**REQ-COMP-003:** Audit trail retention
- P1
- Keep entry history for 10 years (configurable)
- Immutable once posted (can void, not edit)

**REQ-COMP-004:** Data export capability
- P1
- Users can export their data in standard formats
- Supports regulatory audits

### 10.5 Usability

**REQ-USA-001:** Agent conversation in Chinese (Simplified)
- P0
- System prompt, responses, error messages in Chinese
- Support Chinese accounting terminology

**REQ-USA-002:** Graceful error messages
- P0
- No technical jargon in user-facing errors
- Provide actionable guidance

**REQ-USA-003:** Keyboard shortcuts for power users
- P2
- Quick entry mode for experienced accountants

**REQ-USA-004:** Accessibility (WCAG 2.1 Level AA)
- P2
- Screen reader support
- Keyboard navigation

### 10.6 Maintainability

**REQ-MAINT-001:** CoA and use case templates managed as data, not code
- P0
- Admin UI for template management (future)
- Version control for templates

**REQ-MAINT-002:** Agent prompts configurable without code changes
- P1
- Store system prompt in database or config files
- A/B testing capability

**REQ-MAINT-003:** Comprehensive logging
- P0
- Log all agent conversations (anonymized for analysis)
- Log tool calls and results
- Performance metrics

**REQ-MAINT-004:** Monitoring and alerting
- P1
- Alert on high error rates
- Alert on slow response times
- Cost tracking for LLM API usage

---

## 11. Technical Constraints

### 11.1 From README2.md (Loyalis Platform)

**CONSTRAINT-001:** Must use Next.js 14 App Router architecture
- All API routes as Server Actions or Route Handlers
- Client-side components for UI only

**CONSTRAINT-002:** Must use Bun for package management
- Not npm or yarn
- Use `bun install`, `bun run`, etc.

**CONSTRAINT-003:** Must use UV for Python dependencies (if applicable)
- For any data processing or ML scripts

**CONSTRAINT-004:** Database operations via Prisma ORM only
- No raw SQL except for complex queries
- Schema changes via migrations

**CONSTRAINT-005:** Authentication via Better-auth
- Integrate with existing auth layer
- User context from session

**CONSTRAINT-006:** UI components from shadcn/ui
- Never use browser `alert()` - use shadcn Dialog
- Maintain consistent design system

**CONSTRAINT-007:** Always use system proxy in Docker images
- For deployment and containerization

### 11.2 LLM-Specific Constraints

**CONSTRAINT-008:** Function calling must be supported
- LLM must have reliable function/tool calling capability
- OpenAI GPT-4 or Claude Sonnet 4.5 recommended

**CONSTRAINT-009:** Token limits consideration
- System prompt + CoA context should fit within context window
- Use tools to avoid loading full CoA into context (see Architecture section)

**CONSTRAINT-010:** Cost management
- Monitor token usage per session
- Set budget alerts
- Consider caching for common queries

### 11.3 Compliance Constraints

**CONSTRAINT-011:** VAT accounts must use multi-column ledger
- Cannot use auxiliary accounting for VAT sub-accounts (per 财会〔2016〕22号)
- Hard validation rule in ValidateAndFinalizeEntry

**CONSTRAINT-012:** Small Business GAAP restrictions
- No impairment provision except long-term equity investments
- Specific revenue recognition rules
- Cost accounting requirements for manufacturing

**CONSTRAINT-013:** Chart of Accounts immutability (v1.0)
- Users cannot add/modify/delete accounts in initial version
- Must use provided templates

---

## 12. Success Metrics

### 12.1 Product Metrics

**User Engagement**
- **Daily Active Users (DAU):** Target 60% of total users
- **Agent Usage Rate:** Target 80% of entries created with AI assistance
- **Conversation Completion Rate:** Target >90% (user completes entry after starting agent conversation)

**Efficiency Gains**
- **Time to Complete Entry:** Target <2 minutes (vs. 5-7 minutes manual)
- **Entries per Hour:** Target 3x improvement over manual

**Accuracy**
- **First-Attempt Accuracy:** Target >95% (entry accepted without manual edits)
- **Validation Pass Rate:** Target >98% (entries pass final validation)
- **User Correction Rate:** Target <10% (user needs to manually correct AI suggestion)

**User Satisfaction**
- **Feature Rating:** Target >4.5/5 stars
- **NPS for AI Feature:** Target >50
- **Support Tickets Related to AI:** Target <5% of total tickets

### 12.2 Business Metrics

**Adoption**
- **Feature Activation:** >70% of families enable AI assistant within 30 days
- **Retention Impact:** +15% increase in user retention for AI users vs. non-AI users

**Compliance**
- **Compliance Error Rate:** 0% (no entries that violate accounting standards)
- **Audit Issues:** 0 audit findings related to AI-generated entries

### 12.3 Technical Metrics

**Performance**
- **P95 Response Time:** <5 seconds
- **API Error Rate:** <1%
- **LLM API Uptime:** >99.5%

**Cost**
- **LLM Cost per Entry:** Target <$0.05
- **Total AI Infrastructure Cost:** Target <10% of revenue

**Quality**
- **Use Case Match Accuracy:** >90% (correct template selected)
- **Account Lookup Accuracy:** >98% (correct account found)
- **VAT Calculation Accuracy:** >99.5%

### 12.4 Learning & Improvement Metrics

**Agent Learning**
- **Conversation Turns to Completion:** Target <3 turns average
- **Clarification Question Rate:** Target <30% (agent needs to ask clarifying questions)

**Template Effectiveness**
- **Template Coverage:** >80% of real-world transactions covered by templates
- **Template Usage Distribution:** No single template >30% (indicates good coverage)

---

## 13. Implementation Roadmap

### 13.1 Phase 1: Foundation (Weeks 1-3)

**Milestones:**
- [ ] Database schema implementation
  - ChartOfAccount model
  - UseCaseTemplate model
  - JournalEntry + JournalEntryLine models
- [ ] CoA template data import
  - Create Excel templates for 3 industries
  - Import script for CoA data
  - Seed database with templates
- [ ] Use case template data import
  - Document 30+ use cases
  - Create JSON templates
  - Import script

**Deliverables:**
- Database migrations
- Seed data for templates
- Admin API for template management (basic)

### 13.2 Phase 2: Tool Development (Weeks 4-6)

**Milestones:**
- [ ] Implement LookupAccount tool
  - Exact match on code/name
  - Fuzzy matching (basic)
  - Return account metadata
- [ ] Implement GetUseCaseCandidates tool
  - Keyword-based matching
  - Account type filtering
  - Industry filtering
  - Confidence scoring algorithm
- [ ] Implement GetJournalTemplateForUseCase tool
  - Template variable substitution
  - VAT calculation logic
  - Auxiliary dimension detection
- [ ] Implement ValidateAndFinalizeEntry tool
  - Debit-credit balance check
  - Account validity check
  - Auxiliary dimension completeness check
  - VAT column validation
  - Amount precision validation

**Deliverables:**
- Server Actions for each tool
- Unit tests for tool logic
- API documentation

### 13.3 Phase 3: Agent Integration (Weeks 7-9)

**Milestones:**
- [ ] Choose and integrate LLM framework
  - Evaluate: LangChain vs. Claude SDK vs. custom
  - Set up API keys and configuration
- [ ] Implement JournalEntryAgent
  - System prompt design
  - Function calling integration
  - Conversation state management
  - Response generation logic
- [ ] Build agent API endpoint
  - POST /api/agent/journal-entry
  - Support multi-turn conversations
  - Session/conversation ID management
- [ ] Error handling and edge cases
  - Graceful LLM failures
  - Timeout handling
  - Invalid input handling

**Deliverables:**
- Functional agent API
- Integration tests
- Sample conversation flows documented

### 13.4 Phase 4: User Interface (Weeks 10-12)

**Milestones:**
- [ ] Design UI mockups
  - Wireframes for entry creation flow
  - Agent conversation interface
  - Validation feedback display
- [ ] Implement frontend components
  - Entry form (manual mode)
  - AI-assisted mode toggle
  - Chat interface for agent
  - Account lookup/search widget
  - Auxiliary dimension selectors (customer, supplier, etc.)
  - Validation results display
- [ ] State management
  - Form state (React Hook Form or similar)
  - Conversation state
  - Entry draft persistence
- [ ] Integration with agent API
  - API calls from client components
  - Loading states and error handling
  - Optimistic updates

**Deliverables:**
- Complete UI for journal entry creation
- Responsive design (desktop + tablet)
- Accessibility audit

### 13.5 Phase 5: Testing & Refinement (Weeks 13-15)

**Milestones:**
- [ ] End-to-end testing
  - Test all 30+ use cases
  - Edge case testing
  - Cross-browser testing
- [ ] User acceptance testing (UAT)
  - Beta test with 5-10 real users
  - Collect feedback on agent accuracy
  - Collect feedback on UX
- [ ] Performance optimization
  - Optimize tool response times
  - Add caching where appropriate
  - LLM prompt optimization for speed
- [ ] Security audit
  - Penetration testing
  - Code review for security issues
  - Compliance review

**Deliverables:**
- Test results documentation
- UAT feedback summary
- Performance benchmarks
- Security audit report

### 13.6 Phase 6: Launch & Iteration (Week 16+)

**Milestones:**
- [ ] Soft launch (limited users)
- [ ] Monitoring and alerting setup
  - LLM usage tracking
  - Error rate monitoring
  - Performance dashboards
- [ ] Documentation
  - User guide
  - FAQ
  - Video tutorials
- [ ] Full launch
- [ ] Post-launch monitoring
- [ ] Iteration based on metrics

**Deliverables:**
- Production deployment
- Monitoring dashboards
- User documentation
- Support team training materials

### 13.7 Future Enhancements (Phase 7+)

**Potential Features:**
- Voice input for transaction descriptions
- Mobile app integration
- Batch entry processing (import from bank statements)
- Automated entry suggestions from Plaid transactions
- Multi-currency support
- Custom CoA creation and management
- Advanced analytics on entry patterns
- Integration with tax filing systems
- Collaborative features (multi-user approval workflows)

---

## 14. Appendix

### Appendix A: Complete Use Case Catalog

**Revenue Scenarios (6)**
1. UC_Sales_Cash - 现金销售 (Cash sale with VAT)
2. UC_Sales_Bank - 银行收款销售 (Bank transfer sale with VAT)
3. UC_AR_Receipt - 应收账款收款 (AR collection)
4. UC_Advance_From_Customer - 客户预收款 (Customer advance payment)
5. UC_Revenue_Recognition - 履约确认收入 (Revenue recognition from advance)
6. UC_Other_Income - 其他收益 (Other income, e.g., government subsidy)

**Purchasing & COGS Scenarios (6)**
7. UC_Purchase_Inventory - 商品采购入库 (Inventory purchase with VAT input)
8. UC_Purchase_Expense - 费用采购 (Expense purchase with VAT)
9. UC_Pay_AP - 支付应付账款 (AP payment)
10. UC_Prepay_Supplier - 预付供应商 (Supplier advance payment)
11. UC_Inventory_Cost_Adjust - 存货成本调整 (Inventory cost adjustment)
12. UC_COGS - 销售成本结转 (Cost of goods sold recognition)

**Expense Scenarios (6)**
13. UC_Expense_Payment - 费用支付 (General expense payment)
14. UC_Expense_Reimbursement - 员工报销 (Employee reimbursement)
15. UC_Rent_Expense - 租金费用 (Rent expense)
16. UC_Utilities - 水电费 (Utilities expense)
17. UC_Travel_Expense - 差旅费 (Travel expense)
18. UC_Office_Expense - 办公费用 (Office supplies expense)

**Payroll & Tax Scenarios (6)**
19. UC_Salary_Accrual - 计提工资 (Salary accrual)
20. UC_Salary_Payment - 发放工资 (Salary payment)
21. UC_Social_Security - 社保缴纳 (Social security payment)
22. UC_Tax_Payable - 计提税费 (Tax accrual)
23. UC_Tax_Payment - 缴纳税费 (Tax payment)
24. UC_VAT_Settlement - 增值税月末结转 (Monthly VAT settlement)

**Fixed Asset Scenarios (4)**
25. UC_FixedAsset_Purchase - 购买固定资产 (Fixed asset purchase)
26. UC_Depreciation - 计提折旧 (Depreciation accrual)
27. UC_Dispose_FixedAsset - 固定资产处置 (Fixed asset disposal)
28. UC_Asset_Impairment - 资产减值 (Asset impairment - limited scope)

**Other Scenarios (4)**
29. UC_Other_Payable - 其他应付款 (Other payables)
30. UC_Other_Receivable - 其他应收款 (Other receivables, e.g., employee advance)
31. UC_Interest_Income - 利息收入 (Interest income)
32. UC_Bank_Fee - 银行手续费 (Bank fees)

### Appendix B: CoA Template Structure

**Excel Column Definition (Bilingual / 中英文双语):**

**Source File:** `/home/chris/repo/Badget/小企业科目表.xlsx`

| Column Name | Chinese Name | Type | Description | Example |
|------------|-------------|------|-------------|---------|
| CompanyType | 企业类型 | String | Industry type | "通用", "制造", "服务", "贸易" |
| AccountCode | 科目编码 | String | 4-6 digit code | "1002", "222101" |
| AccountName | 科目名称(中文) | String | Chinese name | "银行存款", "应交增值税" |
| AccountNameEn | 科目名称(英文) | String | English name | "Bank Deposits", "VAT Payable" |
| AccountCategory | 科目类别 | String | Asset/Liability/Equity/Cost/Revenue-Expense | "资产/Asset", "负债/Liability", "权益/Equity", "成本/Cost", "损益/Revenue-Expense" |
| ParentCode | 父级科目编码 | String (nullable) | Parent account code | "2221" (for 222101) |
| Level | 科目级次 | Integer | Hierarchy level | 1, 2, 3 |
| BalanceDirection | 余额方向 | String | Normal balance | "借/Debit", "贷/Credit", "平/Neutral" |
| IsLeaf | 明细科目标志 | Boolean | Can post directly | Y, N |
| IsQuantityAmount | 数量金额核算 | Boolean | Quantity tracking required | Y, N |
| AllowVoucherDirectPost | 允许直接过账 | Boolean | Allow posting | Y, N |
| Aux_Customer | 客户辅助核算 | Boolean | Enable customer auxiliary | Y, N |
| Aux_Supplier | 供应商辅助核算 | Boolean | Enable supplier auxiliary | Y, N |
| Aux_Department | 部门辅助核算 | Boolean | Enable department auxiliary | Y, N |
| Aux_Project | 项目辅助核算 | Boolean | Enable project auxiliary | Y, N |
| Aux_Inventory | 存货辅助核算 | Boolean | Enable inventory auxiliary | Y, N |
| IsVATParent | 增值税父科目 | Boolean | Is VAT parent account | Y, N |
| VATColumnType | 增值税栏目类型 | String (nullable) | VAT column type | "进项税额/Input", "销项税额/Output", null |
| Notes | 备注说明 | String | Regulatory notes | "小企业会计准则标准科目/Small Business GAAP Standard Account" |

**Sample Data (Bilingual Format / 中英文双语格式):**

**Source:** `/home/chris/repo/Badget/小企业科目表.xlsx`

```csv
CompanyType,AccountCode,AccountName,AccountNameEn,AccountCategory,ParentCode,Level,BalanceDirection,IsLeaf,IsQuantityAmount,AllowVoucherDirectPost,Aux_Customer,Aux_Supplier,Aux_Department,Aux_Project,Aux_Inventory,IsVATParent,VATColumnType,Notes
通用,1001,库存现金,Cash on Hand,资产/Asset,,1,借/Debit,Y,N,Y,N,N,N,N,N,N,,小企业会计准则标准科目/Small Business GAAP Standard
通用,1002,银行存款,Bank Deposits,资产/Asset,,1,借/Debit,Y,N,Y,N,N,N,N,N,N,,小企业会计准则标准科目/Small Business GAAP Standard
通用,1122,应收账款,Accounts Receivable,资产/Asset,,1,借/Debit,Y,N,Y,Y,N,N,N,N,N,,建议启用客户辅助/Recommend customer auxiliary accounting
通用,1243,库存商品,Finished Goods,资产/Asset,,1,借/Debit,Y,Y,Y,N,N,N,N,Y,N,,贸易/制造建议启用数量金额/Recommend qty-amount for trading/manufacturing
通用,2202,应付账款,Accounts Payable,负债/Liability,,1,贷/Credit,Y,N,Y,N,Y,N,N,N,N,,建议启用供应商辅助/Recommend supplier auxiliary accounting
通用,2221,应交税费,Taxes Payable,负债/Liability,,1,贷/Credit,N,N,N,N,N,N,N,N,Y,,VAT父科目/VAT Parent Account
通用,222101,应交增值税,VAT Payable,负债/Liability,2221,2,贷/Credit,Y,N,Y,N,N,N,N,N,N,进项税额/Input;销项税额/Output,多栏账：进项/销项等/Multi-column ledger for Input/Output VAT
```

### Appendix C: Use Case Template Structure

**Excel Column Definition (Bilingual / 中英文双语):**

| Column Name | Chinese Name | Type | Description | Example |
|------------|-------------|------|-------------|---------|
| UseCaseId | 业务场景编码 | String | Unique ID | "UC_AR_Receipt" |
| UseCaseName | 业务场景名称(中文) | String | Descriptive name in Chinese | "应收账款收款" |
| UseCaseNameEn | 业务场景名称(英文) | String | Descriptive name in English | "AR Collection" |
| Industry | 适用行业 | String[] | Applicable industries | "通用/General", "贸易/Trading,服务/Service" |
| Description | 业务说明 | Text | Natural language description | "客户支付已确认收入的款项 / Customer payment for confirmed revenue" |
| TriggerKeywords | 触发关键词 | String[] | Comma-separated keywords | "收款,回款,客户付款,应收" |
| PatternType | 分录模式 | String | Entry pattern | "single-single", "multi-single", "single-multi", "complex" |
| JournalPatternJSON | 凭证模板 | JSON | Template structure | See below |
| VATHandling | 增值税处理 | Text | VAT treatment description | "不再处理VAT / No VAT handling" |
| AuxRequirement | 辅助核算要求 | JSON | Required auxiliary dimensions | {"1122": ["customer"]} |
| RiskNote | 风险提示 | Text | Warnings and edge cases | "注意区分预收款 / Distinguish from advance payment" |

**Sample Journal Pattern JSON:**

```json
{
  "lines": [
    {
      "role": "debit",
      "account": "1002",
      "amount": "=input.amount",
      "vatColumn": null
    },
    {
      "role": "credit",
      "account": "1122",
      "amount": "=input.amount",
      "vatColumn": null
    }
  ]
}
```

**Sample Data (Bilingual Format / 中英文双语格式):**

```csv
UseCaseId,UseCaseName,UseCaseNameEn,Industry,Description,TriggerKeywords,PatternType,JournalPatternJSON,VATHandling,AuxRequirement,RiskNote
UC_AR_Receipt,应收账款收款,AR Collection,通用/General,客户支付已确认收入的款项 / Customer payment for confirmed revenue,"收款,回款,客户付款,应收",single-single,"{""lines"":[{""role"":""debit"",""account"":""1002"",""amount"":""=input.amount""},{""role"":""credit"",""account"":""1122"",""amount"":""=input.amount""}]}",不再处理VAT / No VAT handling,"{""1122"":[""customer""]}",注意区分预收款场景 / Distinguish from advance payment scenario
UC_Purchase_Inventory,商品采购入库,Inventory Purchase,贸易/Trading,购买商品入库并确认应付账款 / Purchase inventory and record accounts payable,"采购,进货,入库,发票",multi-single,"{""lines"":[{""role"":""debit"",""account"":""1243"",""amount"":""=input.net""},{""role"":""debit"",""account"":""222101"",""vatColumn"":""进项税额"",""amount"":""=input.vat""},{""role"":""credit"",""account"":""2202"",""amount"":""=input.total""}]}",根据发票税率拆分价税 / Split price and tax based on invoice VAT rate,"{""2202"":[""supplier""],""1243"":[""inventory""]}",简易计税项目进项不得抵扣 / Input VAT not deductible for simplified tax items
```

### Appendix D: Tool Implementation Pseudocode

**LookupAccount Tool:**

```typescript
async function lookupAccount(companyId: string, query: string) {
  // 1. Check if query is an account code (numeric)
  if (/^\d{4,6}$/.test(query)) {
    const account = await db.chartOfAccount.findFirst({
      where: { familyId: companyId, accountCode: query }
    });
    if (account) return { matches: [account] };
  }

  // 2. Exact match on account name
  const exactMatch = await db.chartOfAccount.findFirst({
    where: { familyId: companyId, accountName: query }
  });
  if (exactMatch) return { matches: [exactMatch] };

  // 3. Fuzzy match on account name (contains)
  const fuzzyMatches = await db.chartOfAccount.findMany({
    where: {
      familyId: companyId,
      accountName: { contains: query }
    },
    take: 5
  });

  return { matches: fuzzyMatches };
}
```

**GetUseCaseCandidates Tool:**

```typescript
async function getUseCaseCandidates(params: {
  companyId: string;
  industry: string;
  text: string;
  knownSide: { side: string; accountCode: string; amount?: number };
}) {
  const { companyId, industry, text, knownSide } = params;

  // 1. Get all use cases for this industry
  const useCases = await db.useCaseTemplate.findMany({
    where: {
      OR: [
        { familyId: companyId },
        { familyId: null } // global templates
      ],
      industry: { has: industry } || { has: "all" }
    }
  });

  // 2. Score each use case based on keyword match
  const scored = useCases.map(uc => {
    let score = 0;

    // Keyword matching
    const keywords = uc.triggerKeywords;
    const textLower = text.toLowerCase();
    keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        score += 1;
      }
    });

    // Account type matching (check if known account appears in template)
    const templateJSON = uc.journalPatternJSON as any;
    const hasMatchingAccount = templateJSON.lines.some(
      (line: any) => line.account === knownSide.accountCode
    );
    if (hasMatchingAccount) score += 2;

    // Normalize score to 0-1
    const confidence = Math.min(score / 5, 1);

    return {
      useCaseId: uc.useCaseId,
      useCaseName: uc.useCaseName,
      confidence,
      reason: `Matched ${score} signals`
    };
  });

  // 3. Sort by confidence and return top candidates
  const sorted = scored
    .filter(s => s.confidence > 0.1)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  return { candidates: sorted };
}
```

**GetJournalTemplateForUseCase Tool:**

```typescript
async function getJournalTemplateForUseCase(params: {
  companyId: string;
  useCaseId: string;
  knownSide: { side: string; accountCode: string; amount: number };
  extraInput?: { vatRate?: number; total?: number; net?: number };
}) {
  const { companyId, useCaseId, knownSide, extraInput = {} } = params;

  // 1. Load use case template
  const template = await db.useCaseTemplate.findUnique({
    where: { useCaseId }
  });
  if (!template) throw new Error("Use case not found");

  const pattern = template.journalPatternJSON as any;

  // 2. Calculate amounts based on template formulas
  const input = {
    amount: knownSide.amount,
    total: extraInput.total || knownSide.amount,
    net: extraInput.net || (extraInput.total ? extraInput.total / (1 + (extraInput.vatRate || 0)) : knownSide.amount),
    vat: extraInput.total && extraInput.vatRate
      ? extraInput.total * extraInput.vatRate / (1 + extraInput.vatRate)
      : 0
  };

  // 3. Populate template lines
  const lines = pattern.lines.map((line: any) => {
    const amountFormula = line.amount; // e.g., "=input.total"
    const amount = eval(amountFormula.replace('=', '')); // Simple eval (use safer parser in production)

    // Load account metadata
    const account = await db.chartOfAccount.findFirst({
      where: { familyId: companyId, accountCode: line.account }
    });

    // Determine required auxiliary dimensions
    const auxToFill: string[] = [];
    if (account.auxCustomer) auxToFill.push('customer');
    if (account.auxSupplier) auxToFill.push('supplier');
    if (account.auxDepartment) auxToFill.push('department');
    if (account.auxProject) auxToFill.push('project');
    if (account.auxInventory) auxToFill.push('inventory');

    return {
      side: line.role,
      accountCode: line.account,
      accountName: account.accountName,
      amount,
      vatColumn: line.vatColumn || null,
      auxToFill
    };
  });

  return {
    lines,
    explanation: `Based on ${template.useCaseName} template. ${template.vatHandling}`
  };
}
```

**ValidateAndFinalizeEntry Tool:**

```typescript
async function validateAndFinalizeEntry(params: {
  companyId: string;
  journalDraft: {
    date: string;
    description: string;
    lines: Array<{
      side: 'debit' | 'credit';
      accountCode: string;
      amount: number;
      currency?: string;
      vatColumn?: string;
      aux?: Record<string, string>;
    }>;
  };
}) {
  const { companyId, journalDraft } = params;
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate debit-credit balance
  const totalDebit = journalDraft.lines
    .filter(l => l.side === 'debit')
    .reduce((sum, l) => sum + l.amount, 0);
  const totalCredit = journalDraft.lines
    .filter(l => l.side === 'credit')
    .reduce((sum, l) => sum + l.amount, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push(`Debit-credit imbalance: Debit ${totalDebit}, Credit ${totalCredit}`);
  }

  // 2. Validate account codes
  for (const line of journalDraft.lines) {
    const account = await db.chartOfAccount.findFirst({
      where: { familyId: companyId, accountCode: line.accountCode }
    });

    if (!account) {
      errors.push(`Invalid account code: ${line.accountCode}`);
      continue;
    }

    if (!account.isLeaf || !account.allowVoucherDirectPost) {
      errors.push(`Cannot post to account ${line.accountCode} - not a leaf account or posting disabled`);
    }

    // 3. Validate auxiliary dimensions
    if (account.auxCustomer && !line.aux?.customerId) {
      errors.push(`Account ${line.accountCode} requires customer selection`);
    }
    if (account.auxSupplier && !line.aux?.supplierId) {
      errors.push(`Account ${line.accountCode} requires supplier selection`);
    }
    // ... similar for other aux dimensions

    // 4. Validate VAT column usage
    if (line.vatColumn && !account.vatColumnType) {
      errors.push(`Account ${line.accountCode} does not support VAT columns`);
    }
    if (account.vatColumnType && !line.vatColumn) {
      warnings.push(`Account ${line.accountCode} typically uses VAT column "${account.vatColumnType}"`);
    }
  }

  // 5. Normalize amounts (round to 2 decimal places)
  const normalizedLines = journalDraft.lines.map(line => ({
    ...line,
    amount: Math.round(line.amount * 100) / 100
  }));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedJournal: {
      ...journalDraft,
      lines: normalizedLines
    }
  };
}
```

### Appendix E: Sample Conversation Transcripts

**(See Section 8.4 for detailed examples)**

### Appendix F: Glossary

- **CoA (Chart of Accounts):** 会计科目表 - The structured list of all accounts used in a company's general ledger
- **Auxiliary Accounting:** 辅助核算 - Additional dimensions for tracking (customer, supplier, department, project, inventory)
- **VAT (Value-Added Tax):** 增值税 - Sales tax in China
- **Multi-column Ledger:** 多栏账 - Ledger format required for VAT accounts to track input/output tax separately
- **Small Business GAAP:** 小企业会计准则 - Simplified accounting standards for small businesses in China
- **Debit-Credit Balance:** 借贷平衡 - Fundamental accounting principle that debits must equal credits
- **Use Case Template:** 业务场景模板 - Predefined patterns for common business transactions
- **Journal Entry:** 记账凭证 - A record of a financial transaction
- **Journal Entry Line:** 凭证分录 - Individual debit or credit line within a journal entry

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Claude Code | Initial PRD created from design document |

---

**Next Steps:**

1. **Review and Approval:** Share with stakeholders for feedback
2. **Technical Design:** Create detailed technical specification document
3. **Resource Planning:** Assign team members and allocate budget
4. **Kickoff:** Begin Phase 1 implementation

---

**End of Product Requirements Document**
