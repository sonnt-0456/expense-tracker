# Expense Tracker

A personal finance management application built with Next.js, TypeScript, and Supabase.

## Features

- User authentication (register/login)
- Transaction management (income/expense tracking)
- Category management
- Dashboard with line chart visualization
- Filter and search transactions
- Export to CSV
- Responsive design

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Vitest + fast-check

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Run the database migrations in your Supabase SQL editor:
   - Execute `supabase/migrations/20240101000000_initial_schema.sql`
   - Execute `supabase/migrations/20240101000001_rls_policies.sql`

5. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```

6. Update `.env.local` with your Supabase URL and keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
expense-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── dashboard/         # Dashboard (protected)
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── transactions/     # Transaction components
│   ├── categories/       # Category components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities and services
│   ├── services/         # Business logic
│   ├── supabase/         # Supabase clients
│   └── validation/       # Zod schemas
├── types/                 # TypeScript types
└── supabase/             # Database migrations
```

## Database Schema

- **categories**: User-defined transaction categories
- **transactions**: Income and expense records

Both tables have Row-Level Security (RLS) enabled for data isolation.

## License

MIT
