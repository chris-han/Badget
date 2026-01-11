# Technical Requirements Document: Journal Entry Agent

**Document Version:** 2.0
**Last Updated:** 2026-01-11
**Product:** Loyalis - AI-Powered Financial Management Platform
**Feature:** Journal Entry Agent for Automated Accounting
**Related Documents:** PRD-JOURNAL-ENTRY-AGENT.md

**🔄 v2.0 Update:** Migrated to **CopilotKit (Frontend) + Microsoft Agent Framework (Python Backend)** architecture

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [API Design](#5-api-design)
6. [AI Agent Implementation](#6-ai-agent-implementation)
7. [Frontend Implementation (CopilotKit)](#7-frontend-implementation-copilotkit)
8. [Security & Authentication](#8-security--authentication)
9. [Performance & Scalability](#9-performance--scalability)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment & DevOps](#11-deployment--devops)
12. [Monitoring & Observability](#12-monitoring--observability)
13. [Technical Risks & Mitigation](#13-technical-risks--mitigation)

---

## 1. Executive Summary

### 1.1 Purpose

This TRD provides detailed technical specifications for implementing the AI-powered Journal Entry Agent within the Loyalis platform using **CopilotKit for frontend chat UI** and **Microsoft Agent Framework for backend AI orchestration**.

### 1.2 Scope

This document covers:
- **Backend Implementation (Python):** Microsoft Agent Framework, FastAPI, tool functions
- **Frontend Implementation (Next.js):** CopilotKit integration, UI components, state management
- **Database:** Prisma schema, PostgreSQL
- **AI Integration:** Azure OpenAI / OpenAI, prompt engineering, function calling
- **Infrastructure:** Dual deployment (Vercel + Python service), monitoring

### 1.3 Technical Constraints

Based on `/home/chris/repo/Badget/README.md` and `/home/chris/repo/Badget/STYLING-GUIDE.md`:

- **Frontend Framework:** Next.js 15 with App Router
- **Frontend Package Manager:** Bun (not npm or yarn)
- **Backend Framework:** Python FastAPI with Microsoft Agent Framework
- **Backend Package Manager:** UV (per constraints)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better-auth (Next.js) + JWT validation (Python)
- **UI Library:** shadcn/ui + Tailwind CSS + **CopilotKit**
- **Deployment:** Vercel (Next.js) + Cloud Run/Azure Container Apps (Python)
- **Design System:** OKLCH color space, CVA for variants

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | React framework with App Router |
| **Runtime** | Bun | Latest | Package manager and runtime |
| **AI Chat UI** | **CopilotKit** | **Latest** | Pre-built copilot chat interface |
| **UI Components** | shadcn/ui | Latest | Component library |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Authentication** | Better-auth | Latest | User authentication |
| **State Management** | React Query + Zustand | Latest | Server state & client state |

### 2.2 Backend Stack (Python)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | FastAPI | 0.110+ | High-performance async API |
| **Agent Framework** | **Microsoft Agent Framework** | **Latest** | AI agent orchestration |
| **Package Manager** | **UV** | Latest | Python dependency management (per constraints) |
| **LLM Provider** | Azure OpenAI / OpenAI | Latest | GPT-4 / Claude via unified API |
| **Database Client** | Prisma Client Python / SQLAlchemy | Latest | ORM for Python |
| **Validation** | Pydantic | 2.x | Data validation |

### 2.3 Shared Infrastructure

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | PostgreSQL (Neon) | Primary data store |
| **ORM** | Prisma (schema source of truth) | Type-safe database access |
| **Cache** | Upstash Redis | Session cache, rate limiting |
| **Monitoring** | Sentry + Azure Application Insights | Error tracking & observability |

### 2.4 AI & ML Configuration

```typescript
// Next.js environment configuration
{
  "frontend": {
    "copilotkit_public_key": process.env.NEXT_PUBLIC_COPILOTKIT_KEY,
    "backend_agent_url": process.env.NEXT_PUBLIC_AGENT_API_URL
  },
  "backend": {
    "agent_framework": "microsoft-agent-framework",
    "primary_llm": "gpt-4-turbo", // or Azure OpenAI
    "fallback_llm": "gpt-3.5-turbo",
    "max_tokens": 4000,
    "temperature": 0.3
  }
}
```

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Client Layer (Browser)                         │
│  Next.js 15 Client Components + CopilotKit UI                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 15 App Router (Vercel)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CopilotKit Backend Integration                           │  │
│  │  - /api/copilotkit (proxy to Python agent)                │  │
│  │  - Client-side CopilotKit provider                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Server Actions (src/actions/*)                           │  │
│  │  - journal-entry-actions.ts                               │  │
│  │  - chart-of-account-actions.ts                            │  │
│  │  - use-case-template-actions.ts                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/gRPC
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         Python Backend (FastAPI + Microsoft Agent Framework)    │
│         Deployed on Azure Container Apps / Cloud Run            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  FastAPI Routes                                           │  │
│  │  - /api/agent/chat (CopilotKit endpoint)                  │  │
│  │  - /api/health (healthcheck)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Microsoft Agent Framework                                │  │
│  │  - JournalEntryAgent (orchestrator)                       │  │
│  │  - ConversationManager                                    │  │
│  │  - ToolRegistry                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Tools (Function Calling)                                 │  │
│  │  - lookup_account(query)                                  │  │
│  │  - get_use_case_candidates(description, known_side)       │  │
│  │  - get_journal_template(use_case_id, params)              │  │
│  │  - validate_and_finalize_entry(journal_draft)             │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                             │
│  PostgreSQL (Neon) + Prisma ORM                                 │
│  - ChartOfAccount                                                │
│  - UseCaseTemplate                                               │
│  - JournalEntry + JournalEntryLine                              │
│  - Customer, Supplier, Department, etc.                         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 CopilotKit Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  User Interface (Next.js Client)                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  <CopilotKit runtimeUrl="/api/copilotkit">               │  │
│  │    <CopilotSidebar>                                       │  │
│  │      <!-- Journal Entry Creation UI -->                   │  │
│  │      <InitialInputForm />                                 │  │
│  │      <EntryPreviewTable />                                │  │
│  │    </CopilotSidebar>                                      │  │
│  │  </CopilotKit>                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ User types: "收到客户张三的货款10000元"
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js API Route: /api/copilotkit                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Validate Better-auth session                          │  │
│  │  2. Extract familyId from session                         │  │
│  │  3. Proxy request to Python backend                       │  │
│  │  4. Add authentication headers (JWT)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ POST /api/agent/chat
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Python Backend: FastAPI                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Validate JWT token                                    │  │
│  │  2. Initialize JournalEntryAgent with familyId            │  │
│  │  3. Process message through Microsoft Agent Framework     │  │
│  │  4. Agent calls tools (lookup_account, etc.)              │  │
│  │  5. Return structured response                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Response: Suggested entry JSON
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  CopilotSidebar renders AI response                             │
│  - Shows suggested entry in preview table                       │
│  - Prompts for auxiliary selections (customer)                  │
│  - User confirms and posts entry                                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Directory Structure

```
loyalis/
├── src/                              # Next.js frontend
│   ├── actions/
│   │   ├── journal-entry-actions.ts
│   │   ├── chart-of-account-actions.ts
│   │   └── use-case-template-actions.ts
│   ├── app/
│   │   ├── api/
│   │   │   └── copilotkit/
│   │   │       └── route.ts          # CopilotKit proxy to Python backend
│   │   └── dashboard/
│   │       └── accounting/
│   │           └── journal-entries/
│   │               ├── page.tsx      # Entry list
│   │               └── create/
│   │                   └── page.tsx  # AI-assisted creation with CopilotKit
│   ├── components/
│   │   ├── accounting/
│   │   │   ├── journal-entry-form.tsx
│   │   │   ├── entry-preview.tsx
│   │   │   ├── auxiliary-selector.tsx
│   │   │   └── copilot-wrapper.tsx   # CopilotKit configuration
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   ├── auth.ts                   # Better-auth
│   │   └── utils.ts
│   └── types/
│       ├── journal-entry.ts
│       └── agent-responses.ts
│
├── agent-backend/                    # Python backend (NEW)
│   ├── pyproject.toml                # UV package config
│   ├── requirements.txt
│   ├── main.py                       # FastAPI app entry
│   ├── app/
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── journal_entry_agent.py  # Microsoft Agent Framework agent
│   │   │   └── prompts.py            # System prompts
│   │   ├── tools/
│   │   │   ├── __init__.py
│   │   │   ├── lookup_account.py
│   │   │   ├── get_use_case_candidates.py
│   │   │   ├── get_journal_template.py
│   │   │   └── validate_entry.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── agent.py              # /api/agent/chat endpoint
│   │   │   └── health.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── client.py             # Database connection
│   │   │   └── repositories.py       # Data access layer
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── jwt_validator.py      # Validate Next.js JWT
│   │   └── config.py                 # Environment config
│   └── tests/
│       ├── test_agents.py
│       └── test_tools.py
│
├── prisma/
│   ├── schema.prisma                 # Single source of truth
│   └── migrations/
│
└── docker/
    └── agent-backend/
        └── Dockerfile                # Python backend container
```

---

## 4. Database Design

### 4.1 Prisma Schema Extensions

*[Same as previous version - database schema remains unchanged]*

Add the following models to `prisma/schema.prisma`:

```prisma
// [IDENTICAL TO PREVIOUS VERSION]
// ChartOfAccount, UseCaseTemplate, JournalEntry, JournalEntryLine,
// Customer, Supplier, Department, Project, InventoryItem
// See previous TRD v1.0 for full schema
```

**Key Point:** Prisma schema is shared between:
- **Next.js:** Uses `@prisma/client` (TypeScript)
- **Python Backend:** Uses `prisma-client-py` or raw SQL queries

### 4.2 Python Database Access

```python
# agent-backend/app/database/client.py

from prisma import Prisma
from typing import Optional

class DatabaseClient:
    _instance: Optional[Prisma] = None

    @classmethod
    async def get_instance(cls) -> Prisma:
        if cls._instance is None:
            cls._instance = Prisma()
            await cls._instance.connect()
        return cls._instance

    @classmethod
    async def close(cls):
        if cls._instance:
            await cls._instance.disconnect()
            cls._instance = None
```

---

## 5. API Design

### 5.1 Frontend: CopilotKit Proxy API

**Route:** `/api/copilotkit` (Next.js)
**Method:** POST
**Purpose:** Proxy CopilotKit requests to Python backend

```typescript
// src/app/api/copilotkit/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sign } from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user with Better-auth
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Get familyId from user context
    // TODO: Implement family selection logic
    const familyId = req.headers.get("x-family-id") || "default"

    // 3. Create JWT for Python backend
    const token = sign(
      {
        userId: session.user.id,
        familyId: familyId,
        email: session.user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )

    // 4. Parse CopilotKit request
    const body = await req.json()

    // 5. Forward to Python backend
    const backendUrl = process.env.AGENT_BACKEND_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/api/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Family-Id": familyId,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("CopilotKit proxy error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 5.2 Backend: Python Agent API

**Route:** `/api/agent/chat` (Python FastAPI)
**Method:** POST
**Purpose:** Process CopilotKit chat requests with Microsoft Agent Framework

```python
# agent-backend/app/routers/agent.py

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.agents.journal_entry_agent import JournalEntryAgent
from app.auth.jwt_validator import verify_token

router = APIRouter()

class CopilotMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str

class CopilotChatRequest(BaseModel):
    messages: List[CopilotMessage]
    threadId: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class CopilotChatResponse(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None
    threadId: str

@router.post("/chat", response_model=CopilotChatResponse)
async def chat_with_agent(
    request: CopilotChatRequest,
    authorization: str = Header(...),
    x_family_id: str = Header(..., alias="X-Family-Id")
):
    """
    CopilotKit chat endpoint for Journal Entry Agent.

    This endpoint is called by the Next.js frontend via CopilotKit.
    """
    try:
        # 1. Verify JWT token
        token = authorization.replace("Bearer ", "")
        payload = verify_token(token)
        user_id = payload["userId"]

        # 2. Initialize agent
        agent = JournalEntryAgent(
            family_id=x_family_id,
            user_id=user_id
        )

        # 3. Get latest user message
        user_message = next(
            (msg.content for msg in reversed(request.messages) if msg.role == "user"),
            None
        )

        if not user_message:
            raise HTTPException(status_code=400, detail="No user message found")

        # 4. Process with Microsoft Agent Framework
        response = await agent.process_message(
            message=user_message,
            thread_id=request.threadId,
            context=request.context or {}
        )

        # 5. Return CopilotKit-compatible response
        return CopilotChatResponse(
            message=response["message"],
            data=response.get("data"),
            threadId=response["threadId"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 6. AI Agent Implementation

### 6.1 Microsoft Agent Framework Setup

```python
# agent-backend/app/agents/journal_entry_agent.py

from azure.ai.agents import Agent, ToolRegistry, ConversationManager
from azure.ai.openai import AzureOpenAI
from typing import Dict, Any, Optional
import uuid
from app.tools.lookup_account import LookupAccountTool
from app.tools.get_use_case_candidates import GetUseCaseCandidatesTool
from app.tools.get_journal_template import GetJournalTemplateTool
from app.tools.validate_entry import ValidateEntryTool
from app.agents.prompts import SYSTEM_PROMPT

class JournalEntryAgent:
    """
    Journal Entry Agent using Microsoft Agent Framework.

    Handles conversational AI for creating accounting journal entries.
    """

    def __init__(self, family_id: str, user_id: str):
        self.family_id = family_id
        self.user_id = user_id

        # Initialize Azure OpenAI client
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2024-02-01",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

        # Initialize tool registry
        self.tools = ToolRegistry()
        self._register_tools()

        # Initialize agent
        self.agent = Agent(
            name="JournalEntryAgent",
            instructions=SYSTEM_PROMPT,
            model="gpt-4-turbo",
            tools=self.tools,
            client=self.client
        )

        # Conversation manager
        self.conversation_manager = ConversationManager()

    def _register_tools(self):
        """Register all accounting tools with the agent."""
        self.tools.register(LookupAccountTool(self.family_id))
        self.tools.register(GetUseCaseCandidatesTool(self.family_id))
        self.tools.register(GetJournalTemplateTool(self.family_id))
        self.tools.register(ValidateEntryTool(self.family_id))

    async def process_message(
        self,
        message: str,
        thread_id: Optional[str] = None,
        context: Dict[str, Any] = {}
    ) -> Dict[str, Any]:
        """
        Process user message through Microsoft Agent Framework.

        Args:
            message: User's input message
            thread_id: Optional conversation thread ID
            context: Additional context (e.g., known entry side)

        Returns:
            Dict containing agent response and any structured data
        """
        # Create or retrieve conversation thread
        if thread_id:
            thread = self.conversation_manager.get_thread(thread_id)
        else:
            thread_id = f"thread_{uuid.uuid4().hex}"
            thread = self.conversation_manager.create_thread(thread_id)

        # Add user message to thread
        thread.add_message(role="user", content=message)

        # Inject context if provided
        if context:
            context_msg = f"Context: {json.dumps(context)}"
            thread.add_message(role="system", content=context_msg)

        # Run agent
        run = self.agent.create_run(thread=thread)
        result = await run.wait_for_completion()

        # Parse agent response
        agent_message = result.messages[-1].content

        # Extract structured data from tool calls
        structured_data = self._extract_tool_results(result)

        return {
            "message": agent_message,
            "data": structured_data,
            "threadId": thread_id
        }

    def _extract_tool_results(self, run_result) -> Optional[Dict[str, Any]]:
        """Extract structured data from tool call results."""
        # Check if agent called get_journal_template tool
        for step in run_result.steps:
            if step.type == "tool_calls":
                for tool_call in step.tool_calls:
                    if tool_call.function.name == "get_journal_template":
                        return json.loads(tool_call.function.output)
        return None
```

### 6.2 Tool Implementation Example

```python
# agent-backend/app/tools/lookup_account.py

from azure.ai.agents import Tool, ToolParameter
from app.database.repositories import ChartOfAccountRepository
from typing import List, Dict, Any

class LookupAccountTool(Tool):
    """Tool for looking up Chart of Accounts."""

    def __init__(self, family_id: str):
        self.family_id = family_id
        self.repo = ChartOfAccountRepository()

        super().__init__(
            name="lookup_account",
            description=(
                "Look up account information from the Chart of Accounts by name or code. "
                "Supports fuzzy matching on Chinese and English names."
            ),
            parameters=[
                ToolParameter(
                    name="query",
                    type="string",
                    description=(
                        "Account name (Chinese or English) or account code to search for. "
                        "Examples: '银行存款', '1002', 'Bank Deposits'"
                    ),
                    required=True
                )
            ]
        )

    async def execute(self, query: str) -> List[Dict[str, Any]]:
        """Execute account lookup."""
        # Check if query is numeric (account code)
        if query.isdigit() and len(query) >= 4:
            accounts = await self.repo.find_by_code(self.family_id, query)
            if accounts:
                return self._format_results(accounts)

        # Exact match on name
        accounts = await self.repo.find_by_name_exact(self.family_id, query)
        if accounts:
            return self._format_results(accounts)

        # Fuzzy match
        accounts = await self.repo.find_by_name_fuzzy(self.family_id, query)
        return self._format_results(accounts[:5])  # Top 5 matches

    def _format_results(self, accounts) -> List[Dict[str, Any]]:
        """Format account data for agent consumption."""
        return [
            {
                "accountCode": acc.account_code,
                "accountName": acc.account_name,
                "accountNameEn": acc.account_name_en,
                "balanceDirection": acc.balance_direction,
                "auxDimensions": {
                    "customer": acc.aux_customer,
                    "supplier": acc.aux_supplier,
                    "department": acc.aux_department,
                    "project": acc.aux_project,
                    "inventory": acc.aux_inventory,
                },
                "vatColumnType": acc.vat_column_type
            }
            for acc in accounts
        ]
```

### 6.3 System Prompt

```python
# agent-backend/app/agents/prompts.py

SYSTEM_PROMPT = """
# 角色和上下文 (Role and Context)

你是一名专业的会计助理,为中国的小企业提供服务。
你帮助用户创建符合《小企业会计准则》和增值税法规的准确会计凭证。

You are a professional accounting assistant for small businesses in China.
You help users create accurate journal entries that comply with the Small Business
Accounting Standards (小企业会计准则) and VAT regulations.

# 你的能力 (Your Capabilities)

You have access to the following tools:
- **lookup_account**: Find accounts in the Chart of Accounts by code or name
- **get_use_case_candidates**: Match user's transaction description to business scenarios
- **get_journal_template**: Generate journal entry lines based on matched scenario
- **validate_entry**: Validate complete journal entry for compliance

# 你的约束 (Your Constraints)

- You can ONLY use accounts that exist in the company's Chart of Accounts
- You CANNOT create or modify accounts
- You MUST ensure every entry is balanced (debits = credits)
- You MUST follow VAT multi-column ledger rules (财会〔2016〕22号)
- You MUST collect required auxiliary information (customer, supplier, etc.)

# 工作流程 (Workflow)

When a user describes a transaction:

1. **Parse Input**
   - Extract known side (debit/credit), account, amount
   - Extract transaction description

2. **Clarify if Needed**
   - If scenario is ambiguous, ask 1-2 focused questions
   - Example: "这是客户付款还是预收款?" (Is this customer payment or advance?)

3. **Identify Scenario**
   - Call `get_use_case_candidates` with description
   - If confidence > 0.8, proceed
   - If multiple matches (0.5-0.8), present options

4. **Generate Entry**
   - Call `get_journal_template` with selected scenario
   - Present complete entry to user
   - Explain which accounts and why

5. **Collect Auxiliary Info**
   - If account requires customer/supplier/etc., prompt user
   - Use structured format: "Please select the customer for this payment"

6. **Validate**
   - Call `validate_entry` with complete draft
   - If failed, explain issue clearly
   - If passed, confirm ready to post

# 输出格式 (Output Format)

Always return structured responses that CopilotKit can render:

For suggestions:
```json
{
  "type": "suggestion",
  "entry": {
    "lines": [...],
    "useCaseId": "...",
    "confidence": 0.95
  },
  "explanation": "..."
}
```

For questions:
```json
{
  "type": "question",
  "question": "...",
  "options": [...]
}
```

# 重要提醒 (Important)

- VAT account (222101) MUST use multi-column ledger, NOT auxiliary accounting
- Always check if account requires auxiliary dimensions
- Explain accounting logic in simple terms for non-expert users
- If uncertain, ask rather than guess
"""
```

---

## 7. Frontend Implementation (CopilotKit)

### 7.1 CopilotKit Setup

```tsx
// src/components/accounting/copilot-wrapper.tsx

"use client"

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotSidebar } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"

export function AccountingCopilotWrapper({
  children,
  familyId,
}: {
  children: React.ReactNode
  familyId: string
}) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      headers={{
        "x-family-id": familyId,
      }}
    >
      <CopilotSidebar
        labels={{
          title: "AI Accounting Assistant",
          initial: "How can I help with your journal entries today?",
        }}
        defaultOpen={true}
      >
        {children}
      </CopilotSidebar>
    </CopilotKit>
  )
}
```

### 7.2 Journal Entry Creation Page

```tsx
// src/app/dashboard/accounting/journal-entries/create/page.tsx

import { AccountingCopilotWrapper } from "@/components/accounting/copilot-wrapper"
import { JournalEntryForm } from "@/components/accounting/journal-entry-form"
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core"

export default function CreateJournalEntryPage() {
  const [entryDraft, setEntryDraft] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Make current state readable by AI
  useCopilotReadable({
    description: "Current journal entry draft",
    value: entryDraft,
  })

  // Define action for AI to update entry
  useCopilotAction({
    name: "updateEntryDraft",
    description: "Update the journal entry draft with AI suggestions",
    parameters: [
      {
        name: "entry",
        type: "object",
        description: "The suggested journal entry",
      },
    ],
    handler: async ({ entry }) => {
      setEntryDraft(entry)
      return "Entry draft updated"
    },
  })

  // Define action for collecting auxiliary info
  useCopilotAction({
    name: "requestCustomerSelection",
    description: "Prompt user to select a customer",
    parameters: [
      {
        name: "accountCode",
        type: "string",
        description: "The account code that requires customer",
      },
    ],
    handler: async ({ accountCode }) => {
      // Show customer selector dialog
      setShowCustomerSelector(true)
      return "Waiting for customer selection"
    },
  })

  return (
    <AccountingCopilotWrapper familyId="fam_123">
      <div className="flex flex-col gap-6 p-6">
        <h1>Create Journal Entry</h1>

        {entryDraft ? (
          <EntryPreviewTable entry={entryDraft} />
        ) : (
          <JournalEntryForm onSubmit={handleManualSubmit} />
        )}

        <AuxiliarySelectorDialog
          open={showCustomerSelector}
          onSelect={setSelectedCustomer}
        />
      </div>
    </AccountingCopilotWrapper>
  )
}
```

### 7.3 Custom CopilotKit Styling

```css
/* src/app/globals.css */

/* Override CopilotKit default styles to match Loyalis design */
.copilotKitSidebar {
  border-left: 1px solid var(--border);
  background: var(--card);
}

.copilotKitMessage {
  border-radius: calc(var(--radius) - 2px); /* 8px */
  padding: 0.75rem 1rem;
}

.copilotKitMessage[data-role="assistant"] {
  background: var(--muted);
  border: 1px solid var(--border);
}

.copilotKitMessage[data-role="user"] {
  background: var(--primary);
  color: var(--primary-foreground);
}

.copilotKitInput {
  border: 1px solid var(--input);
  border-radius: calc(var(--radius) - 2px);
  background: var(--background);
}

.copilotKitInput:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgb(var(--ring) / 0.5);
}
```

---

## 8. Security & Authentication

### 8.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User logs in via Better-auth (Next.js)                  │
│     - OAuth (Google, GitHub) or email/password              │
│     - Session stored in HTTP-only cookie                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. User accesses Journal Entry creation page               │
│     - Next.js validates session                             │
│     - Retrieves familyId from user context                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. CopilotKit sends chat request to /api/copilotkit        │
│     - Next.js API route validates Better-auth session       │
│     - Creates JWT token with userId + familyId              │
│     - Signs with shared secret                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Next.js proxies request to Python backend               │
│     - Adds Authorization: Bearer <JWT> header               │
│     - Adds X-Family-Id header                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Python backend validates JWT                            │
│     - Verifies signature with shared secret                 │
│     - Extracts userId and familyId                          │
│     - Checks token expiration                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Agent processes request with family isolation           │
│     - All database queries scoped to familyId               │
│     - Returns response to Next.js                           │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 JWT Validation (Python)

```python
# agent-backend/app/auth/jwt_validator.py

import jwt
from fastapi import HTTPException
from datetime import datetime
import os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

def verify_token(token: str) -> dict:
    """
    Verify JWT token from Next.js frontend.

    Args:
        token: JWT token string

    Returns:
        Decoded payload containing userId and familyId

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        # Check expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.now():
            raise HTTPException(status_code=401, detail="Token expired")

        # Validate required fields
        if "userId" not in payload or "familyId" not in payload:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return payload

    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
```

### 8.3 Environment Variables

```bash
# .env.local (Next.js)
NEXT_PUBLIC_COPILOTKIT_KEY=your_copilotkit_key
AGENT_BACKEND_URL=https://agent-backend.example.com
JWT_SECRET=your_shared_secret_key

# .env (Python backend)
JWT_SECRET=your_shared_secret_key  # MUST match Next.js
DATABASE_URL=postgresql://...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://...
```

---

## 9. Performance & Scalability

### 9.1 Caching Strategy

```python
# agent-backend/app/database/repositories.py

from functools import lru_cache
from typing import List
import redis

# Redis client for distributed cache
redis_client = redis.from_url(os.getenv("REDIS_URL"))

class ChartOfAccountRepository:
    @lru_cache(maxsize=1000)  # In-memory cache
    async def find_by_code(self, family_id: str, code: str):
        """Cache account lookups (rarely change)."""
        cache_key = f"coa:{family_id}:{code}"

        # Check Redis
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

        # Query database
        account = await self.db.chartofaccount.find_first(
            where={"familyId": family_id, "accountCode": code}
        )

        # Cache for 1 hour
        if account:
            redis_client.setex(cache_key, 3600, json.dumps(account))

        return account
```

### 9.2 Rate Limiting

```python
# agent-backend/app/routers/agent.py

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/chat")
@limiter.limit("100/hour")  # 100 requests per hour per IP
async def chat_with_agent(...):
    # ...
```

---

## 10. Testing Strategy

### 10.1 Python Backend Tests

```python
# agent-backend/tests/test_agents.py

import pytest
from app.agents.journal_entry_agent import JournalEntryAgent

@pytest.mark.asyncio
async def test_agent_ar_receipt():
    """Test agent handles AR receipt scenario correctly."""
    agent = JournalEntryAgent(family_id="test_family", user_id="test_user")

    response = await agent.process_message(
        message="收到客户张三的货款 10000元 通过银行转账",
        thread_id=None,
        context={}
    )

    assert "应收账款" in response["message"]
    assert response["data"] is not None
    assert len(response["data"]["lines"]) == 2
    assert response["data"]["lines"][0]["accountCode"] == "1002"
    assert response["data"]["lines"][1]["accountCode"] == "1122"
```

### 10.2 Integration Tests (Next.js + Python)

```typescript
// tests/integration/agent-flow.test.ts

import { test, expect } from "@playwright/test"

test("create journal entry with CopilotKit", async ({ page }) => {
  await page.goto("/dashboard/accounting/journal-entries/create")

  // Wait for CopilotKit to load
  await expect(page.locator(".copilotKitSidebar")).toBeVisible()

  // Type message in CopilotKit
  await page.fill(".copilotKitInput", "收到客户张三的货款10000元")
  await page.click("button[type='submit']")

  // Wait for AI response
  await expect(page.locator("text=应收账款收款")).toBeVisible({ timeout: 10000 })

  // Verify entry preview
  await expect(page.locator("text=1002 银行存款")).toBeVisible()
  await expect(page.locator("text=1122 应收账款")).toBeVisible()
})
```

---

## 11. Deployment & DevOps

### 11.1 Docker Configuration (Python Backend)

```dockerfile
# docker/agent-backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Use system proxy (per constraints)
ENV HTTP_PROXY=http://proxy.example.com:8080
ENV HTTPS_PROXY=http://proxy.example.com:8080

# Install UV (Python package manager - per constraints)
RUN pip install uv

# Copy dependencies
COPY pyproject.toml requirements.txt ./
RUN uv pip install -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY main.py ./

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 11.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│  Next.js Frontend + CopilotKit UI                           │
│  - Auto-scaling                                              │
│  - Edge functions                                            │
│  - /api/copilotkit route                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          Azure Container Apps / Cloud Run                    │
│  Python Backend (FastAPI + Microsoft Agent Framework)       │
│  - Auto-scaling (min: 1, max: 10)                           │
│  - CPU: 1 vCPU, Memory: 2GB                                 │
│  - Health checks enabled                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Neon PostgreSQL                           │
│  - Serverless                                                │
│  - Auto-scaling storage                                      │
└─────────────────────────────────────────────────────────────┘
```

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy-backend.yml

name: Deploy Python Backend

on:
  push:
    branches: [main]
    paths:
      - 'agent-backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install UV
        run: pip install uv

      - name: Install dependencies
        run: |
          cd agent-backend
          uv pip install -r requirements.txt

      - name: Run tests
        run: |
          cd agent-backend
          pytest tests/

      - name: Build Docker image
        run: |
          docker build -f docker/agent-backend/Dockerfile -t agent-backend .

      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          resourceGroup: loyalis-rg
          containerAppName: journal-agent-backend
          imageToDeploy: agent-backend:latest
```

---

## 12. Monitoring & Observability

### 12.1 Application Insights (Python)

```python
# agent-backend/main.py

from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Configure Azure Application Insights
configure_azure_monitor(
    connection_string=os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
)

app = FastAPI()

# Auto-instrument FastAPI
FastAPIInstrumentor.instrument_app(app)
```

### 12.2 Logging

```python
# agent-backend/app/agents/journal_entry_agent.py

import logging
import structlog

logger = structlog.get_logger(__name__)

class JournalEntryAgent:
    async def process_message(self, message: str, ...):
        logger.info(
            "agent_message_received",
            family_id=self.family_id,
            user_id=self.user_id,
            message_length=len(message)
        )

        # Process...

        logger.info(
            "agent_message_processed",
            thread_id=thread_id,
            tools_called=len(result.steps),
            tokens_used=result.usage.total_tokens
        )
```

---

## 13. Technical Risks & Mitigation

### 13.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **CopilotKit breaking changes** | Low | High | Pin version, test before upgrades |
| **Python-Next.js latency** | Medium | Medium | Deploy close regions, use caching |
| **Microsoft Agent Framework limitations** | Medium | High | Evaluate early, maintain escape hatch |
| **Cross-service authentication issues** | Low | High | Comprehensive E2E tests, shared JWT secret rotation |
| **Azure OpenAI rate limits** | Low | Medium | Implement exponential backoff, fallback to OpenAI |

### 13.2 Migration Path from Microsoft Agent Framework

If Microsoft Agent Framework proves insufficient, maintain abstraction:

```python
# agent-backend/app/agents/base_agent.py

from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """Abstract agent interface for easy framework switching."""

    @abstractmethod
    async def process_message(self, message: str, ...):
        pass

# Current implementation
class MSAgentFrameworkAgent(BaseAgent):
    # Uses Microsoft Agent Framework
    pass

# Fallback implementation
class LangChainAgent(BaseAgent):
    # Uses LangChain if needed
    pass
```

---

## Appendix A: Technology Comparison

### Why CopilotKit + Microsoft Agent Framework?

| Aspect | Custom LangChain | CopilotKit + MS Agent |
|--------|-----------------|----------------------|
| **Frontend UI** | Build from scratch | Pre-built, production-ready |
| **Conversation Management** | Manual state handling | Automatic thread management |
| **Tool Calling** | Manual parsing | Native function calling |
| **Streaming** | Complex implementation | Built-in support |
| **Chinese Support** | Requires custom prompts | Better with Azure OpenAI CN |
| **Maintenance** | High (custom code) | Low (managed service) |
| **Time to Market** | 4-6 weeks | 2-3 weeks |

---

## Appendix B: File Structure Checklist

```
✅ Next.js Frontend
- [ ] src/app/api/copilotkit/route.ts
- [ ] src/components/accounting/copilot-wrapper.tsx
- [ ] src/app/dashboard/accounting/journal-entries/create/page.tsx

✅ Python Backend
- [ ] agent-backend/pyproject.toml (UV config)
- [ ] agent-backend/main.py
- [ ] agent-backend/app/agents/journal_entry_agent.py
- [ ] agent-backend/app/tools/*.py (4 tools)
- [ ] agent-backend/app/routers/agent.py
- [ ] agent-backend/app/auth/jwt_validator.py

✅ Configuration
- [ ] .env.local (Next.js JWT secret, backend URL)
- [ ] agent-backend/.env (JWT secret, Azure OpenAI)
- [ ] docker/agent-backend/Dockerfile

✅ CI/CD
- [ ] .github/workflows/deploy-backend.yml
- [ ] .github/workflows/test-integration.yml
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Claude Code | Initial TRD |
| **2.0** | **2026-01-11** | **Claude Code** | **Migrated to CopilotKit + Microsoft Agent Framework** |

---

**End of Technical Requirements Document**
