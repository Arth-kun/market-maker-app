# Market Maker App

A platform for managing markets and their makers/vendors.

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Setup

The project uses Supabase as the backend. Database migrations can be found in the `supabase/migrations` directory.

### Running Migrations

1. Connect to your Supabase instance
2. Execute the migrations in numerical order
3. (Optional) Run the seed data script for development

### Directory Structure

```
├── src/                  # Source code
├── supabase/
│   ├── migrations/      # Database migrations
│   └── seed-data/      # Development seed data
└── public/              # Public assets
```

## Development

- React + TypeScript for frontend
- Supabase for backend
- React Query for data fetching
- React Router for routing
```