# Technical Requirements Document: Journal Entry Agent

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Product:** Loyalis - AI-Powered Financial Management Platform
**Feature:** Journal Entry Agent for Automated Accounting
**Related Documents:** PRD-JOURNAL-ENTRY-AGENT.md

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [API Design](#5-api-design)
6. [AI Agent Implementation](#6-ai-agent-implementation)
7. [Security & Authentication](#7-security--authentication)
8. [Performance & Scalability](#8-performance--scalability)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment & DevOps](#10-deployment--devops)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Technical Risks & Mitigation](#12-technical-risks--mitigation)

---

## 1. Executive Summary

### 1.1 Purpose

This TRD provides detailed technical specifications for implementing the AI-powered Journal Entry Agent within the Loyalis platform, ensuring alignment with existing architecture, coding standards, and design patterns.

### 1.2 Scope

This document covers:
- **Backend Implementation:** Database schema, server actions, API routes
- **Frontend Implementation:** UI components, state management, user interactions
- **AI Integration:** LLM agent framework, tool orchestration, prompt engineering
- **Infrastructure:** Deployment, monitoring, security considerations

### 1.3 Technical Constraints

Based on `/home/chris/repo/Badget/README.md` and `/home/chris/repo/Badget/STYLING-GUIDE.md`:

- **Framework:** Next.js 15 with App Router
- **Package Manager:** Bun (not npm or yarn)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better-auth
- **UI Library:** shadcn/ui + Tailwind CSS
- **Deployment:** Vercel
- **Design System:** OKLCH color space, CVA for variants

---

## 2. Technology Stack

### 2.1 Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 15.x | React framework with App Router |
| **Runtime** | Bun | Latest | Package manager and runtime |
| **Database** | PostgreSQL | 14+ | Primary data store via Neon |
| **ORM** | Prisma | 5.x | Type-safe database access |
| **Authentication** | Better-auth | Latest | User authentication |
| **UI Components** | shadcn/ui | Latest | Component library |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **AI Framework** | LangChain / Claude SDK | Latest | Agent orchestration |
| **LLM Provider** | OpenAI GPT-4 / Claude Sonnet 4.5 | Latest | AI reasoning engine |

### 2.2 AI & ML Stack

```typescript
// Recommended AI stack configuration
{
  "primary_llm": "claude-sonnet-4-5", // Better Chinese support
  "fallback_llm": "gpt-4-turbo",
  "agent_framework": "langchain", // Or custom with Claude SDK
  "embeddings": "text-embedding-3-small", // For future semantic search
  "vector_store": null // Not required for v1.0
}
```

### 2.3 External Services

- **Vercel:** Hosting and edge functions
- **Neon:** Serverless PostgreSQL
- **OpenAI / Anthropic:** LLM API providers
- **Resend:** Email notifications (existing)

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  Next.js 15 Client Components + shadcn/ui                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 15 App Router                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Handlers (/api/*)                             │   │
│  │  - /api/agent/journal-entry (Agent endpoint)         │   │
│  │  - /api/journal-entries (CRUD operations)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Server Actions (src/actions/*)                      │   │
│  │  - journal-entry-actions.ts                          │   │
│  │  - chart-of-account-actions.ts                       │   │
│  │  - use-case-template-actions.ts                      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  JournalEntryAgent (LangChain/Claude SDK)            │   │
│  │  - Conversation Management                           │   │
│  │  - Intent Parsing                                    │   │
│  │  - Tool Orchestration                                │   │
│  │  - Response Generation                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tools (Function Calling)                            │   │
│  │  - lookupAccount(query)                              │   │
│  │  - getUseCaseCandidates(description, knownSide)      │   │
│  │  - getJournalTemplate(useCaseId, params)             │   │
│  │  - validateAndFinalizeEntry(journalDraft)            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Access Layer                           │
│  Prisma ORM + PostgreSQL (Neon)                             │
│  - ChartOfAccount                                            │
│  - UseCaseTemplate                                           │
│  - JournalEntry + JournalEntryLine                          │
│  - Customer, Supplier, Department, etc.                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Directory Structure

```
src/
├── actions/
│   ├── journal-entry-actions.ts      # CRUD for journal entries
│   ├── chart-of-account-actions.ts   # CoA lookups
│   └── use-case-template-actions.ts  # Template management
├── app/
│   ├── api/
│   │   └── agent/
│   │       └── journal-entry/
│   │           └── route.ts          # Agent API endpoint
│   └── dashboard/
│       ├── accounting/
│       │   ├── journal-entries/
│       │   │   ├── page.tsx          # Entry list page
│       │   │   └── create/
│       │   │       └── page.tsx      # AI-assisted entry creation
│       │   └── chart-of-accounts/
│       │       └── page.tsx          # CoA management
│       └── layout.tsx
├── components/
│   ├── accounting/
│   │   ├── journal-entry-form.tsx    # Manual entry form
│   │   ├── ai-assistant-chat.tsx     # Agent conversation UI
│   │   ├── entry-preview.tsx         # Entry preview/validation
│   │   ├── auxiliary-selector.tsx    # Customer/supplier selection
│   │   └── account-search.tsx        # Account lookup widget
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── ai/
│   │   ├── journal-entry-agent.ts    # Agent implementation
│   │   ├── tools/
│   │   │   ├── lookup-account.ts
│   │   │   ├── get-use-case-candidates.ts
│   │   │   ├── get-journal-template.ts
│   │   │   └── validate-entry.ts
│   │   └── prompts/
│   │       └── system-prompt.ts      # Agent system prompt
│   ├── db.ts                         # Prisma client singleton
│   └── utils.ts
├── types/
│   ├── journal-entry.ts
│   ├── chart-of-account.ts
│   └── use-case-template.ts
└── generated/
    └── prisma/                       # Generated Prisma client

prisma/
├── schema.prisma                     # Database schema
├── migrations/                       # Migration history
└── seed/
    ├── chart-of-accounts.ts          # CoA seed data
    └── use-case-templates.ts         # Template seed data
```

---

## 4. Database Design

### 4.1 Prisma Schema Extensions

Add the following models to `prisma/schema.prisma`:

```prisma
// Existing models (Family, AppUser, etc.) remain unchanged

// ============================================================================
// Accounting Module - Chart of Accounts
// ============================================================================

model ChartOfAccount {
  id                      String   @id @default(cuid())
  familyId                String
  family                  Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  // Bilingual Account Information (中英文双语科目信息)
  accountCode             String   // e.g., "1002", "222101"
  accountName             String   // Chinese name
  accountNameEn           String?  // English name
  accountCategory         String   // "asset" | "liability" | "equity" | "cost" | "revenue-expense"
  parentCode              String?  // Hierarchical structure
  level                   Int      // 1, 2, 3...
  balanceDirection        String   // "debit" | "credit" | "neutral"

  isLeaf                  Boolean  @default(true)
  isQuantityAmount        Boolean  @default(false)
  allowVoucherDirectPost  Boolean  @default(true)

  // Auxiliary Accounting Flags (辅助核算标志)
  auxCustomer             Boolean  @default(false)
  auxSupplier             Boolean  @default(false)
  auxDepartment           Boolean  @default(false)
  auxProject              Boolean  @default(false)
  auxInventory            Boolean  @default(false)

  // VAT-specific (增值税专用字段)
  isVATParent             Boolean  @default(false)
  vatColumnType           String?  // "input" | "output" | "transfer-out" | "export-refund" | null

  notes                   String?  @db.Text

  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@unique([familyId, accountCode])
  @@index([familyId, accountName])
  @@map("chart_of_accounts")
}

// ============================================================================
// Accounting Module - Use Case Templates
// ============================================================================

model UseCaseTemplate {
  id                String   @id @default(cuid())
  familyId          String?  // null = global template
  family            Family?  @relation(fields: [familyId], references: [id], onDelete: Cascade)

  // Bilingual Use Case Information
  useCaseId         String   @unique
  useCaseName       String   // Chinese name
  useCaseNameEn     String?  // English name
  industry          String[] // ["trading", "service", "manufacturing", "all"]

  description       String   @db.Text
  triggerKeywords   String[] // For matching algorithm

  patternType       String   // "single-single" | "multi-single" | "single-multi" | "complex"
  journalPatternJSON Json    // Template structure

  vatHandling       String   @db.Text
  auxRequirement    Json     // Required auxiliary dimensions
  riskNote          String?  @db.Text

  isActive          Boolean  @default(true)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([familyId])
  @@index([useCaseId])
  @@map("use_case_templates")
}

// ============================================================================
// Accounting Module - Journal Entries
// ============================================================================

model JournalEntry {
  id                String   @id @default(cuid())
  familyId          String
  family            Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  entryNumber       String   // Auto-generated sequential number
  entryDate         DateTime
  description       String   @db.Text

  // AI metadata
  useCaseId         String?  // Which template was used
  aiGenerated       Boolean  @default(false)
  aiConfidence      Float?
  conversationLog   Json?    // Store agent conversation for audit

  // Audit
  createdBy         String   // AppUser ID
  createdByUser     AppUser  @relation("CreatedJournalEntries", fields: [createdBy], references: [id])
  approvedBy        String?
  approvedByUser    AppUser? @relation("ApprovedJournalEntries", fields: [approvedBy], references: [id])
  approvedAt        DateTime?

  status            String   @default("draft") // "draft" | "posted" | "voided"

  lines             JournalEntryLine[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([familyId, entryNumber])
  @@index([familyId, entryDate])
  @@index([familyId, status])
  @@map("journal_entries")
}

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
  @@map("journal_entry_lines")
}

// ============================================================================
// Auxiliary Accounting Entities
// ============================================================================

model Customer {
  id          String   @id @default(cuid())
  familyId    String
  family      Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  customerCode String
  customerName String
  contactName  String?
  phone        String?
  email        String?
  address      String?

  isActive     Boolean  @default(true)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([familyId, customerCode])
  @@index([familyId, customerName])
  @@map("customers")
}

model Supplier {
  id           String   @id @default(cuid())
  familyId     String
  family       Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  supplierCode String
  supplierName String
  contactName  String?
  phone        String?
  email        String?
  address      String?

  isActive     Boolean  @default(true)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([familyId, supplierCode])
  @@index([familyId, supplierName])
  @@map("suppliers")
}

model Department {
  id             String   @id @default(cuid())
  familyId       String
  family         Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  departmentCode String
  departmentName String
  parentId       String?
  managerId      String?

  isActive       Boolean  @default(true)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([familyId, departmentCode])
  @@index([familyId])
  @@map("departments")
}

model Project {
  id          String   @id @default(cuid())
  familyId    String
  family      Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  projectCode String
  projectName String
  description String?  @db.Text
  startDate   DateTime?
  endDate     DateTime?
  managerId   String?

  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([familyId, projectCode])
  @@index([familyId])
  @@map("projects")
}

model InventoryItem {
  id           String   @id @default(cuid())
  familyId     String
  family       Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)

  itemCode     String
  itemName     String
  category     String?
  unit         String   @default("件")
  unitPrice    Decimal? @db.Decimal(15, 2)

  isActive     Boolean  @default(true)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([familyId, itemCode])
  @@index([familyId, itemName])
  @@map("inventory_items")
}

// ============================================================================
// Update existing Family model to add relations
// ============================================================================

// Add to existing Family model:
// chartOfAccounts  ChartOfAccount[]
// useCaseTemplates UseCaseTemplate[]
// journalEntries   JournalEntry[]
// customers        Customer[]
// suppliers        Supplier[]
// departments      Department[]
// projects         Project[]
// inventoryItems   InventoryItem[]

// ============================================================================
// Update existing AppUser model to add relations
// ============================================================================

// Add to existing AppUser model:
// createdJournalEntries  JournalEntry[] @relation("CreatedJournalEntries")
// approvedJournalEntries JournalEntry[] @relation("ApprovedJournalEntries")
```

### 4.2 Migration Strategy

```bash
# Generate migration
bunx prisma migrate dev --name add_accounting_module

# Generate Prisma client with custom output
bunx prisma generate --output ../src/generated/prisma

# Seed database with CoA and templates
bun run prisma/seed/chart-of-accounts.ts
bun run prisma/seed/use-case-templates.ts
```

### 4.3 Seed Data Scripts

Create seed scripts to populate initial data from Excel files:

**`prisma/seed/chart-of-accounts.ts`:**
```typescript
import { PrismaClient } from "@/generated/prisma"
import { readFile, utils } from "xlsx"

const prisma = new PrismaClient()

async function seedChartOfAccounts() {
  // Read from /home/chris/repo/Badget/小企业科目表.xlsx
  const workbook = readFile("/home/chris/repo/Badget/小企业科目表.xlsx")
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = utils.sheet_to_json(sheet)

  // Get a demo family or create one
  const family = await prisma.family.findFirst()
  if (!family) throw new Error("No family found - create one first")

  for (const row of data) {
    await prisma.chartOfAccount.upsert({
      where: {
        familyId_accountCode: {
          familyId: family.id,
          accountCode: row["AccountCode"],
        },
      },
      update: {},
      create: {
        familyId: family.id,
        accountCode: row["AccountCode"],
        accountName: row["AccountName"],
        accountNameEn: row["AccountNameEn"],
        accountCategory: row["AccountCategory"],
        parentCode: row["ParentCode"] || null,
        level: parseInt(row["Level"]),
        balanceDirection: row["BalanceDirection"],
        isLeaf: row["IsLeaf"] === "Y",
        isQuantityAmount: row["IsQuantityAmount"] === "Y",
        allowVoucherDirectPost: row["AllowVoucherDirectPost"] === "Y",
        auxCustomer: row["Aux_Customer"] === "Y",
        auxSupplier: row["Aux_Supplier"] === "Y",
        auxDepartment: row["Aux_Department"] === "Y",
        auxProject: row["Aux_Project"] === "Y",
        auxInventory: row["Aux_Inventory"] === "Y",
        isVATParent: row["IsVATParent"] === "Y",
        vatColumnType: row["VATColumnType"] || null,
        notes: row["Notes"],
      },
    })
  }

  console.log("Chart of Accounts seeded successfully")
}

seedChartOfAccounts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 5. API Design

### 5.1 Agent API Endpoint

**Route:** `/api/agent/journal-entry`
**Method:** POST
**Authentication:** Required (Better-auth session)

**Request:**
```typescript
{
  "familyId": string,
  "userInput": string,
  "conversationId"?: string, // For multi-turn conversations
  "context"?: {
    "knownSide"?: {
      "side": "debit" | "credit",
      "accountCode": string,
      "amount": number
    }
  }
}
```

**Response:**
```typescript
{
  "conversationId": string,
  "agentMessage": string,
  "messageType": "question" | "suggestion" | "validation" | "error",
  "data"?: {
    "suggestedEntry"?: {
      "lines": Array<{
        "side": "debit" | "credit",
        "accountCode": string,
        "accountName": string,
        "amount": number,
        "vatColumn"?: string,
        "auxToFill"?: string[] // ["customer", "supplier", etc.]
      }>,
      "useCaseId": string,
      "useCaseName": string,
      "confidence": number,
      "explanation": string
    },
    "validationResult"?: {
      "isValid": boolean,
      "errors": string[],
      "warnings": string[]
    },
    "options"?: Array<{
      "label": string,
      "value": string
    }>
  }
}
```

**Implementation:** `/src/app/api/agent/journal-entry/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { JournalEntryAgent } from "@/lib/ai/journal-entry-agent"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Rate limiting
    const rateLimitResult = await rateLimit(session.user.id, 100) // 100 calls/hour
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      )
    }

    // 3. Parse request
    const body = await req.json()
    const { familyId, userInput, conversationId, context } = body

    // 4. Verify family access
    // TODO: Check if user has access to this family

    // 5. Initialize agent
    const agent = new JournalEntryAgent(familyId)

    // 6. Process message
    const response = await agent.processMessage({
      userInput,
      conversationId,
      context,
    })

    // 7. Return response
    return NextResponse.json(response)
  } catch (error) {
    console.error("Agent API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 5.2 Server Actions

**`src/actions/journal-entry-actions.ts`:**
```typescript
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createJournalEntry(data: {
  familyId: string
  entryDate: Date
  description: string
  lines: Array<{
    side: "debit" | "credit"
    accountCode: string
    amount: number
    vatColumn?: string
    aux?: {
      customerId?: string
      supplierId?: string
      departmentId?: string
      projectId?: string
      inventoryItemId?: string
    }
  }>
  useCaseId?: string
  aiGenerated?: boolean
  aiConfidence?: number
  conversationLog?: any
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Validate access to family
  // TODO: Check family membership

  // Generate entry number
  const lastEntry = await db.journalEntry.findFirst({
    where: { familyId: data.familyId },
    orderBy: { entryNumber: "desc" },
  })
  const nextNumber = generateNextEntryNumber(lastEntry?.entryNumber)

  // Create entry with lines
  const entry = await db.journalEntry.create({
    data: {
      familyId: data.familyId,
      entryNumber: nextNumber,
      entryDate: data.entryDate,
      description: data.description,
      useCaseId: data.useCaseId,
      aiGenerated: data.aiGenerated || false,
      aiConfidence: data.aiConfidence,
      conversationLog: data.conversationLog,
      createdBy: session.user.id,
      status: "draft",
      lines: {
        create: data.lines.map((line, idx) => ({
          lineNumber: idx + 1,
          side: line.side,
          accountCode: line.accountCode,
          accountName: "", // TODO: Lookup from CoA
          amount: line.amount,
          vatColumn: line.vatColumn,
          customerId: line.aux?.customerId,
          supplierId: line.aux?.supplierId,
          departmentId: line.aux?.departmentId,
          projectId: line.aux?.projectId,
          inventoryItemId: line.aux?.inventoryItemId,
        })),
      },
    },
    include: {
      lines: true,
    },
  })

  revalidatePath("/dashboard/accounting/journal-entries")
  return entry
}

export async function postJournalEntry(entryId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Update status to posted
  const entry = await db.journalEntry.update({
    where: { id: entryId },
    data: {
      status: "posted",
      approvedBy: session.user.id,
      approvedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/accounting/journal-entries")
  return entry
}

function generateNextEntryNumber(lastNumber?: string): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const prefix = `JE-${year}${month}-`

  if (!lastNumber || !lastNumber.startsWith(prefix)) {
    return `${prefix}0001`
  }

  const lastSeq = parseInt(lastNumber.split("-")[2])
  const nextSeq = String(lastSeq + 1).padStart(4, "0")
  return `${prefix}${nextSeq}`
}
```

**`src/actions/chart-of-account-actions.ts`:**
```typescript
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function lookupAccount(familyId: string, query: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Exact match on code
  if (/^\d{4,6}$/.test(query)) {
    const account = await db.chartOfAccount.findFirst({
      where: { familyId, accountCode: query },
    })
    if (account) return { matches: [account] }
  }

  // Exact match on name
  const exactMatch = await db.chartOfAccount.findFirst({
    where: { familyId, accountName: query },
  })
  if (exactMatch) return { matches: [exactMatch] }

  // Fuzzy match
  const fuzzyMatches = await db.chartOfAccount.findMany({
    where: {
      familyId,
      OR: [
        { accountName: { contains: query } },
        { accountNameEn: { contains: query } },
      ],
    },
    take: 5,
  })

  return { matches: fuzzyMatches }
}

export async function getChartOfAccounts(familyId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const accounts = await db.chartOfAccount.findMany({
    where: { familyId },
    orderBy: { accountCode: "asc" },
  })

  return accounts
}
```

---

## 6. AI Agent Implementation

### 6.1 Agent Architecture

Use **LangChain** for structured agent development:

```typescript
// src/lib/ai/journal-entry-agent.ts

import { ChatOpenAI } from "@langchain/openai"
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

import { SYSTEM_PROMPT } from "./prompts/system-prompt"
import { lookupAccountTool } from "./tools/lookup-account"
import { getUseCaseCandidatesTool } from "./tools/get-use-case-candidates"
import { getJournalTemplateTool } from "./tools/get-journal-template"
import { validateEntryTool } from "./tools/validate-entry"

export class JournalEntryAgent {
  private familyId: string
  private llm: ChatOpenAI
  private agent: AgentExecutor
  private conversations: Map<string, any[]> = new Map()

  constructor(familyId: string) {
    this.familyId = familyId

    // Initialize LLM
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo", // or "claude-sonnet-4-5"
      temperature: 0.3, // Lower for deterministic accounting logic
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Initialize tools
    const tools = [
      lookupAccountTool(familyId),
      getUseCaseCandidatesTool(familyId),
      getJournalTemplateTool(familyId),
      validateEntryTool(familyId),
    ]

    // Create agent
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ])

    this.agent = createOpenAIFunctionsAgent({
      llm: this.llm,
      tools,
      prompt,
    })
  }

  async processMessage(params: {
    userInput: string
    conversationId?: string
    context?: any
  }) {
    const { userInput, conversationId, context } = params

    // Get or create conversation history
    const convId = conversationId || this.generateConversationId()
    const history = this.conversations.get(convId) || []

    // Execute agent
    const result = await this.agent.invoke({
      input: userInput,
      chat_history: history,
      familyId: this.familyId,
      context: JSON.stringify(context || {}),
    })

    // Update conversation history
    history.push({ human: userInput, ai: result.output })
    this.conversations.set(convId, history)

    // Parse result and format response
    return this.formatResponse(result, convId)
  }

  private formatResponse(result: any, conversationId: string) {
    // TODO: Parse agent output and structure response
    return {
      conversationId,
      agentMessage: result.output,
      messageType: "suggestion",
      data: {},
    }
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}
```

### 6.2 Tool Implementations

**`src/lib/ai/tools/lookup-account.ts`:**
```typescript
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { lookupAccount } from "@/actions/chart-of-account-actions"

export function lookupAccountTool(familyId: string) {
  return new DynamicStructuredTool({
    name: "lookup_account",
    description:
      "Look up account information from the Chart of Accounts by name or code. Supports fuzzy matching.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "Account name (Chinese) or account code to search for. E.g., '银行存款', '1002', 'bank'"
        ),
    }),
    func: async ({ query }) => {
      const result = await lookupAccount(familyId, query)
      return JSON.stringify(result)
    },
  })
}
```

**`src/lib/ai/tools/get-use-case-candidates.ts`:**
```typescript
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { db } from "@/lib/db"

export function getUseCaseCandidatesTool(familyId: string) {
  return new DynamicStructuredTool({
    name: "get_use_case_candidates",
    description:
      "Find matching business scenario templates based on user description and known journal entry side.",
    schema: z.object({
      text: z
        .string()
        .describe(
          "User's description of the transaction. E.g., '客户付货款', 'purchased inventory'"
        ),
      knownSide: z.object({
        side: z.enum(["debit", "credit"]),
        accountCode: z.string(),
        amount: z.number().optional(),
      }),
    }),
    func: async ({ text, knownSide }) => {
      // Get use cases for this family's industry
      const family = await db.family.findUnique({
        where: { id: familyId },
        select: { industry: true },
      })

      const useCases = await db.useCaseTemplate.findMany({
        where: {
          OR: [
            { familyId: familyId },
            { familyId: null }, // Global templates
          ],
          industry: {
            hasSome: [family?.industry || "all", "all"],
          },
        },
      })

      // Score use cases based on keyword match
      const scored = useCases.map((uc) => {
        let score = 0

        // Keyword matching
        const textLower = text.toLowerCase()
        uc.triggerKeywords.forEach((kw) => {
          if (textLower.includes(kw.toLowerCase())) {
            score += 1
          }
        })

        // Account type matching
        const templateJSON = uc.journalPatternJSON as any
        const hasMatchingAccount = templateJSON.lines?.some(
          (line: any) => line.account === knownSide.accountCode
        )
        if (hasMatchingAccount) score += 2

        const confidence = Math.min(score / 5, 1)

        return {
          useCaseId: uc.useCaseId,
          useCaseName: uc.useCaseName,
          confidence,
          reason: `Matched ${score} signals`,
        }
      })

      // Sort and return top candidates
      const sorted = scored
        .filter((s) => s.confidence > 0.1)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)

      return JSON.stringify({ candidates: sorted })
    },
  })
}
```

### 6.3 System Prompt

**`src/lib/ai/prompts/system-prompt.ts`:**
```typescript
export const SYSTEM_PROMPT = `
# 角色和上下文 (Role and Context)

你是一名专业的会计助理,为中国的小企业提供服务。
你帮助用户创建符合《小企业会计准则》和增值税法规的准确会计凭证。

You are a professional accounting assistant for small businesses in China.
You help users create accurate journal entries that comply with the Small Business
Accounting Standards (小企业会计准则) and VAT regulations.

# 你的能力 (Your Capabilities)

- 你可以访问公司的会计科目表 (Chart of Accounts)
- 你可以通过名称或编码查找科目
- 你了解30多种常见业务场景 (use cases)
- 你可以生成平衡的会计分录,并正确处理增值税
- 你可以验证分录的合规性和完整性

# 你的约束 (Your Constraints)

- 你只能使用公司会计科目表中存在的科目
- 你不能创建或修改科目
- 你必须确保每笔分录借贷平衡
- 你必须遵守增值税多栏账规则
- 你必须收集必要的辅助核算信息(客户、供应商等)

# 工作流程 (Workflow)

当用户提供部分凭证信息时:

1. **解析输入**
   - 提取已知方(借或贷)、科目、金额
   - 提取业务描述

2. **需要时澄清**
   - 如果业务场景不明确,提出1-2个澄清问题
   - 示例: "这是客户付款还是预收款?"
   - 保持问题简单明了

3. **识别业务场景**
   - 调用 get_use_case_candidates 工具
   - 如果最佳匹配置信度 > 0.8,继续
   - 如果有多个候选(置信度0.5-0.8),向用户展示选项

4. **生成分录**
   - 调用 get_journal_template 工具
   - 向用户展示完整分录
   - 解释将借记/贷记哪些科目及原因

5. **收集辅助信息**
   - 如果科目需要客户、供应商、部门等信息,要求用户选择
   - 解释为什么需要这些信息

6. **验证**
   - 调用 validate_entry 工具
   - 如果验证失败,清楚解释问题并建议修正
   - 如果验证通过,确认分录可以过账

# 语气和风格 (Tone and Style)

- 专业但友好
- 正确使用会计术语,必要时解释
- 简洁明了 - 除非被要求,否则避免冗长解释
- 始终解释你的推理(使用了哪个模板,为什么)
- 如果不确定,询问而不是猜测

# 错误处理 (Error Handling)

- 如果找不到匹配的科目 → 要求用户检查科目名称/编码
- 如果没有匹配的业务场景 → 要求用户换种方式描述交易
- 如果验证失败 → 解释错误并说明如何修正
- 永远不要编造科目编码或金额

# 重要提醒 (Important Reminders)

- 增值税科目(222101 应交增值税)必须使用多栏账,不使用辅助核算
- 始终检查科目是否需要辅助核算维度(客户、供应商等)
- 小企业会计准则不允许计提减值(长期股权投资除外)
- 收入确认需要履行履约义务
`
```

---

## 7. Security & Authentication

### 7.1 Authentication Flow

```typescript
// All API routes and server actions must verify authentication

import { auth } from "@/lib/auth"

export async function protectedAction() {
  const session = await auth.api.getSession()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // Verify family access
  const membership = await db.familyMember.findFirst({
    where: {
      userId: session.user.id,
      familyId: requestedFamilyId,
    },
  })

  if (!membership) {
    throw new Error("Access denied")
  }

  // Proceed with action
}
```

### 7.2 API Key Management

```bash
# .env.local (never commit!)

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

### 7.3 Rate Limiting

```typescript
// src/lib/rate-limit.ts

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour
})

export async function rateLimit(identifier: string, limit: number = 100) {
  const { success, remaining } = await ratelimit.limit(identifier)
  return { success, remaining }
}
```

---

## 8. Performance & Scalability

### 8.1 Caching Strategy

```typescript
// Cache CoA lookups in memory (CoA rarely changes)

import NodeCache from "node-cache"

const coaCache = new NodeCache({ stdTTL: 3600 }) // 1 hour

export async function lookupAccountCached(familyId: string, query: string) {
  const cacheKey = `${familyId}:${query}`

  const cached = coaCache.get(cacheKey)
  if (cached) return cached

  const result = await lookupAccount(familyId, query)
  coaCache.set(cacheKey, result)

  return result
}
```

### 8.2 Database Optimization

```prisma
// Essential indexes for performance

@@index([familyId, accountCode])      // Fast CoA lookups
@@index([familyId, accountName])      // Fast name searches
@@index([familyId, entryDate])        // Fast date range queries
@@index([journalEntryId])             // Fast line lookups
```

### 8.3 LLM Cost Optimization

```typescript
// Use cheaper models for simple tasks

function selectModel(taskComplexity: "simple" | "complex") {
  if (taskComplexity === "simple") {
    return "gpt-3.5-turbo" // Cheap for lookups
  } else {
    return "gpt-4-turbo" // Powerful for reasoning
  }
}

// Implement prompt caching (Claude)
const systemPrompt = {
  type: "text",
  text: SYSTEM_PROMPT,
  cache_control: { type: "ephemeral" }, // Cache system prompt
}
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
// src/lib/ai/tools/__tests__/lookup-account.test.ts

import { describe, it, expect, beforeAll } from "bun:test"
import { lookupAccount } from "@/actions/chart-of-account-actions"

describe("lookupAccount", () => {
  it("should find account by exact code", async () => {
    const result = await lookupAccount("family123", "1002")
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].accountName).toBe("银行存款")
  })

  it("should find account by name", async () => {
    const result = await lookupAccount("family123", "银行存款")
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].accountCode).toBe("1002")
  })

  it("should return fuzzy matches", async () => {
    const result = await lookupAccount("family123", "银行")
    expect(result.matches.length).toBeGreaterThan(0)
  })
})
```

### 9.2 Integration Tests

```typescript
// src/app/api/agent/__tests__/journal-entry.test.ts

import { describe, it, expect } from "bun:test"

describe("Journal Entry Agent API", () => {
  it("should handle AR receipt scenario", async () => {
    const response = await fetch("/api/agent/journal-entry", {
      method: "POST",
      body: JSON.stringify({
        familyId: "family123",
        userInput: "Debit: Bank 10000, customer paid invoice",
      }),
    })

    const data = await response.json()
    expect(data.data.suggestedEntry).toBeDefined()
    expect(data.data.suggestedEntry.lines).toHaveLength(2)
  })
})
```

### 9.3 E2E Tests (Playwright)

```typescript
// e2e/journal-entry-creation.spec.ts

import { test, expect } from "@playwright/test"

test("create journal entry with AI assistance", async ({ page }) => {
  await page.goto("/dashboard/accounting/journal-entries/create")

  // Switch to AI mode
  await page.click("text=AI-Assisted Entry")

  // Enter partial entry
  await page.fill("[placeholder='Search transactions...']", "银行")
  await page.click("text=1002 银行存款")
  await page.fill("[name='amount']", "10000")
  await page.fill(
    "[placeholder='What happened?']",
    "客户支付上月发票货款"
  )

  // Submit to agent
  await page.click("text=Generate Entry with AI")

  // Wait for suggestion
  await expect(page.locator("text=建议的会计分录")).toBeVisible()

  // Verify suggested entry
  await expect(page.locator("text=借: 1002 银行存款")).toBeVisible()
  await expect(page.locator("text=贷: 1122 应收账款")).toBeVisible()
})
```

---

## 10. Deployment & DevOps

### 10.1 Environment Setup

```bash
# Local development
bun install
bunx prisma generate --output ../src/generated/prisma
bunx prisma migrate dev
bun dev

# Production build
bun run build

# Docker (optional - using system proxy per constraints)
# Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Use system proxy
ENV HTTP_PROXY=http://proxy.example.com:8080
ENV HTTPS_PROXY=http://proxy.example.com:8080

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bunx prisma generate --output ./src/generated/prisma
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
```

### 10.2 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "bun run build",
  "devCommand": "bun dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "OPENAI_API_KEY": "@openai-api-key",
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  },
  "regions": ["hkg1"] // Hong Kong for China proximity
}
```

### 10.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Generate Prisma Client
        run: bunx prisma generate --output ./src/generated/prisma

      - name: Run tests
        run: bun test

      - name: Build
        run: bun run build
```

---

## 11. Monitoring & Observability

### 11.1 Logging

```typescript
// src/lib/logger.ts

import pino from "pino"

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty" }
      : undefined,
})

// Usage in agent
logger.info(
  {
    conversationId,
    userId: session.user.id,
    familyId,
    toolsCalled: ["lookup_account", "get_use_case_candidates"],
    tokensUsed: 1234,
  },
  "Agent conversation completed"
)
```

### 11.2 Metrics

```typescript
// src/lib/metrics.ts

import { Counter, Histogram } from "prom-client"

export const agentCallsCounter = new Counter({
  name: "agent_calls_total",
  help: "Total number of agent API calls",
  labelNames: ["familyId", "status"],
})

export const agentLatencyHistogram = new Histogram({
  name: "agent_latency_seconds",
  help: "Agent response latency in seconds",
  buckets: [0.5, 1, 2, 5, 10],
})

// Usage
agentCallsCounter.inc({ familyId, status: "success" })
agentLatencyHistogram.observe(duration)
```

### 11.3 Error Tracking

```typescript
// Sentry integration (optional)

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})

// Capture agent errors
try {
  await agent.processMessage(params)
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      familyId,
      conversationId,
    },
  })
  throw error
}
```

---

## 12. Technical Risks & Mitigation

### 12.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **LLM hallucination** | Medium | High | Structured tool calls, validation layer, human review |
| **API rate limits** | Low | Medium | Rate limiting, caching, fallback models |
| **Database performance** | Low | Medium | Proper indexing, query optimization, connection pooling |
| **Security vulnerabilities** | Low | High | Regular audits, dependency updates, input validation |
| **Cost overruns (LLM)** | Medium | Medium | Usage monitoring, model selection, prompt optimization |
| **Data inconsistency** | Low | High | Database constraints, transaction management, validation |

### 12.2 Mitigation Strategies

**LLM Hallucination:**
```typescript
// Always validate LLM outputs with structured tools
const suggestion = await agent.getSuggestion(input)

// Never trust LLM blindly - validate with actual data
const validationResult = await validateAndFinalizeEntry(suggestion)

if (!validationResult.isValid) {
  // Reject and ask agent to retry
  logger.warn("LLM generated invalid entry", validationResult.errors)
}
```

**Cost Control:**
```typescript
// Track token usage per family
const usage = await db.llmUsage.aggregate({
  where: {
    familyId,
    createdAt: { gte: startOfMonth },
  },
  _sum: { tokens: true },
})

if (usage._sum.tokens > MONTHLY_LIMIT) {
  throw new Error("Monthly LLM usage limit exceeded")
}
```

**Data Consistency:**
```typescript
// Use database transactions for entry creation
await db.$transaction(async (tx) => {
  const entry = await tx.journalEntry.create({ data: entryData })
  await tx.journalEntryLine.createMany({ data: lines })

  // Verify balance
  const balance = await verifyBalance(entry.id)
  if (!balance) throw new Error("Debit-credit imbalance")
})
```

---

## Appendix A: File Structure Checklist

```
✅ Database
- [ ] prisma/schema.prisma (add accounting models)
- [ ] prisma/migrations/
- [ ] prisma/seed/chart-of-accounts.ts
- [ ] prisma/seed/use-case-templates.ts

✅ Backend
- [ ] src/actions/journal-entry-actions.ts
- [ ] src/actions/chart-of-account-actions.ts
- [ ] src/actions/use-case-template-actions.ts
- [ ] src/app/api/agent/journal-entry/route.ts

✅ AI Agent
- [ ] src/lib/ai/journal-entry-agent.ts
- [ ] src/lib/ai/prompts/system-prompt.ts
- [ ] src/lib/ai/tools/lookup-account.ts
- [ ] src/lib/ai/tools/get-use-case-candidates.ts
- [ ] src/lib/ai/tools/get-journal-template.ts
- [ ] src/lib/ai/tools/validate-entry.ts

✅ Frontend
- [ ] src/app/dashboard/accounting/journal-entries/page.tsx
- [ ] src/app/dashboard/accounting/journal-entries/create/page.tsx
- [ ] src/components/accounting/journal-entry-form.tsx
- [ ] src/components/accounting/ai-assistant-chat.tsx
- [ ] src/components/accounting/entry-preview.tsx
- [ ] src/components/accounting/auxiliary-selector.tsx
- [ ] src/components/accounting/account-search.tsx

✅ Types
- [ ] src/types/journal-entry.ts
- [ ] src/types/chart-of-account.ts
- [ ] src/types/use-case-template.ts

✅ Testing
- [ ] src/lib/ai/tools/__tests__/
- [ ] src/app/api/agent/__tests__/
- [ ] e2e/journal-entry-creation.spec.ts

✅ Configuration
- [ ] .env.local (API keys)
- [ ] vercel.json (deployment config)
- [ ] .github/workflows/ci.yml (CI/CD)
```

---

## Appendix B: API Reference

### Server Actions

```typescript
// Chart of Accounts
lookupAccount(familyId: string, query: string)
getChartOfAccounts(familyId: string)

// Journal Entries
createJournalEntry(data: CreateJournalEntryInput)
postJournalEntry(entryId: string)
voidJournalEntry(entryId: string)
getJournalEntries(familyId: string, filters: Filters)

// Auxiliary Entities
getCustomers(familyId: string)
getSuppliers(familyId: string)
getDepartments(familyId: string)
getProjects(familyId: string)
getInventoryItems(familyId: string)
```

### API Routes

```typescript
POST /api/agent/journal-entry
GET  /api/journal-entries
POST /api/journal-entries
PUT  /api/journal-entries/:id
DELETE /api/journal-entries/:id
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Claude Code | Initial TRD created from PRD |

---

**End of Technical Requirements Document**
