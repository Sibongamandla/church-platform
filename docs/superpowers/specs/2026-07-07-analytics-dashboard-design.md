# Analytics Dashboard — Design Spec
Date: 2026-07-07

## Goal
Add website traffic tracking via Vercel Analytics and a dedicated `/admin/analytics` page showing database-driven insights, with a printable PDF audit report.

## Scope

### 1. Vercel Analytics (website traffic)
- Install `@vercel/analytics`
- Add `<Analytics />` component to `src/app/layout.tsx`
- No config needed — Vercel auto-detects on deployment

### 2. `/admin/analytics` Page
New page linked from the admin sidebar under a new "Analytics" nav item.

**Sections (top to bottom):**

| Section | Chart | Data query |
|---|---|---|
| Summary stat cards | — | Total members, sessions, link clicks, audit events (last 30 days) |
| Member Growth | Line chart | `Member.createdAt` grouped by month, last 6 months |
| Attendance Trends | Bar chart | `ServiceSession` headcount, last 12 sessions by date |
| Short Link Clicks | Horizontal bar | All `ShortLink` records ranked by `clicks` desc |
| Audit Activity | Bar chart | `AuditLog.action` counts grouped by action type, last 30 days |

**Charting library:** Recharts (installed as new dependency)

All data fetched server-side in the page component via Prisma. Charts rendered client-side in a `"use client"` wrapper component that receives serialised data as props.

### 3. Printable Audit PDF
- "Print Audit Report" button on the analytics page
- Triggers `window.print()`
- A dedicated `AuditTable` component renders the full audit log (all records, not just 30 days) in a clean table
- `@media print` CSS hides all non-audit UI (charts, sidebar, navbar) and shows only the audit table with a header (church name, date generated)
- No extra dependency — native browser print-to-PDF

## Architecture

```
src/
  app/
    admin/
      analytics/
        page.tsx              ← server component, fetches all data
        AuditPrintTable.tsx   ← client component, print-only audit table
        AnalyticsCharts.tsx   ← client component, all Recharts charts
  components/
    admin/
      AdminSidebar.tsx        ← add Analytics nav item
```

## Data Contracts
Page fetches and passes typed props to client components — no client-side data fetching.

## Print Styles
Applied via a `<style>` tag in `AuditPrintTable.tsx` using `@media print`:
- Hide `.no-print` (charts, sidebar, topbar)
- Show `.print-only` (audit table, report header)
- Set page margins and font size for readability

## Out of Scope
- Date range filtering (future)
- CSV export of analytics (future — data-export already handles member export)
- Caching/ISR (Vercel default caching is fine for admin)
