# Expense Tracker - Setup Guide

## ✅ Đã hoàn thành

### Core Features
- ✅ Authentication (Register/Login/Logout)
- ✅ Category Management (CRUD)
- ✅ Transaction Management (CRUD)
- ✅ Dashboard với line charts (daily/weekly/monthly)
- ✅ CSV Export
- ✅ Pagination (50 records/page)
- ✅ Responsive design
- ✅ Row-Level Security (RLS)

### Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- Recharts
- Vitest + fast-check

## 🚀 Setup Instructions

### 1. Supabase Setup

1. Tạo project tại [supabase.com](https://supabase.com)

2. Chạy migrations trong SQL Editor:

**Migration 1: Initial Schema**
```sql
-- Copy nội dung từ supabase/migrations/20240101000000_initial_schema.sql
```

**Migration 2: RLS Policies**
```sql
-- Copy nội dung từ supabase/migrations/20240101000001_rls_policies.sql
```

3. Lấy credentials:
   - Project URL: Settings → API → Project URL
   - Anon key: Settings → API → anon/public key
   - Service role key: Settings → API → service_role key

### 2. Environment Variables

Tạo file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install & Run

```bash
cd expense-tracker
npm install
npm run dev
```

Mở http://localhost:3000

## 📋 Testing Flow

### 1. Authentication
- Truy cập http://localhost:3000
- Click "Get Started" → Register
- Email: test@example.com
- Password: password123 (min 8 chars)
- Sau khi register, tự động redirect đến /dashboard

### 2. Categories
- Từ dashboard, click "Categories"
- Tạo categories: Food, Transport, Entertainment, Salary
- Test edit/delete

### 3. Transactions
- Click "Transactions"
- Tạo transaction:
  - Amount: 1000
  - Date: hôm nay
  - Category: Salary
  - Type: Income
  - Description: Monthly salary
- Tạo thêm expenses
- Test edit/delete
- Test pagination (nếu > 50 records)

### 4. Dashboard
- Quay lại Dashboard
- Xem stats: Total Income, Total Expense, Balance, Transaction Count
- Xem line chart
- Test period filters: Daily, Weekly, Monthly

### 5. CSV Export
- Vào Transactions page
- Click "Export CSV"
- File sẽ download với format: transactions-YYYY-MM-DD.csv

## 🔧 MCP Server (Context7)

Đã setup trong `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "uvx",
      "args": ["context7"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Cài đặt uv (nếu chưa có):**
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# hoặc với pip
pip install uv
```

## 📝 Còn thiếu (Optional)

### Tasks chưa làm:
- Task 13: Filtering & search UI (API đã có, chỉ thiếu UI component)
- Task 16: Navigation component
- Task 18: Error handling improvements
- Task 19: Responsive design refinements
- Task 20-22: Deployment configuration

### Để hoàn thiện:

**1. Add Filtering UI (Task 13):**
Tạo `components/transactions/TransactionFilters.tsx` với:
- Category dropdown filter
- Type filter (income/expense)
- Date range pickers
- Search input

**2. Add Navigation (Task 16):**
Tạo `components/common/Navigation.tsx` với:
- Logo
- Links: Dashboard, Transactions, Categories
- User email display
- Logout button

**3. Deploy to Cloudflare Workers:**
```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## 🎯 Manual Testing Checklist

- [ ] Register new user
- [ ] Login with existing user
- [ ] Logout
- [ ] Create category
- [ ] Edit category
- [ ] Delete category (without transactions)
- [ ] Try delete category with transactions (should fail)
- [ ] Create income transaction
- [ ] Create expense transaction
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] View dashboard stats
- [ ] Switch chart periods (daily/weekly/monthly)
- [ ] Export CSV
- [ ] Test pagination (create 51+ transactions)
- [ ] Test on mobile viewport
- [ ] Test authentication redirect (access /dashboard without login)

## 🐛 Common Issues

**1. Supabase connection error:**
- Check `.env.local` có đúng credentials
- Restart dev server sau khi update env

**2. RLS policy errors:**
- Verify migrations đã chạy đúng
- Check user đã authenticated

**3. Chart không hiển thị:**
- Cần có ít nhất 1 transaction
- Check console for errors

## 📚 Documentation

- Requirements: `.kiro/specs/expense-tracker/requirements.md`
- Design: `.kiro/specs/expense-tracker/design.md`
- Tasks: `.kiro/specs/expense-tracker/tasks.md`
- README: `README.md`

## 🎉 Next Steps

1. Setup Supabase và chạy migrations
2. Update `.env.local`
3. Run `npm run dev`
4. Test authentication flow
5. Create categories và transactions
6. View dashboard
7. Export CSV
8. (Optional) Add filtering UI
9. (Optional) Deploy to Cloudflare/Vercel

Chúc bạn thành công! 🚀
