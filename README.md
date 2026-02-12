# ClipMarket - UGC & Clipping Marketplace

A modern SaaS platform connecting Brands and Creators for UGC (User-Generated Content) campaigns with performance-based earnings.

## Features

### For Brands
- Create and manage UGC campaigns
- Set CPM rates and budgets
- Review and approve creator submissions
- Track campaign performance and spend
- Automatic budget management

### For Creators
- Browse available campaigns with advanced filters
- Submit UGC content (video links or uploads)
- Track earnings based on views (CPM model)
- Wallet system for earnings management
- Withdraw funds

### For Admins
- User management
- Campaign monitoring
- View tracking (manual MVP)
- Platform analytics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Email + Google)
- **Payments**: Stripe (escrow + payouts)
- **File Uploads**: Uploadthing
- **Charts**: Recharts

## 🚀 Déploiement

### Option 1: Coolify + Hetzner (Recommandé - ~5€/mois)

Voir [COOLIFY_DEPLOY.md](./COOLIFY_DEPLOY.md) pour le guide complet.

**Avantages** :
- Coût très économique (~5€/mois)
- Contrôle total sur votre infrastructure
- Base de données incluse
- SSL automatique

### Option 2: Vercel (Rapide mais payant)

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet.

**Avantages** :
- Déploiement en 2 clics
- CDN global
- SSL automatique

## 🚀 Déploiement Rapide sur Vercel

### Méthode la plus simple (5 minutes)

1. **Push sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE-USERNAME/clipmarket.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Add New Project"
   - Importez votre repo GitHub
   - Vercel détectera automatiquement Next.js
   - Configurez les variables d'environnement (voir ci-dessous)
   - Cliquez "Deploy"

3. **Configurer la base de données**
   - Dans Vercel → Storage → Créez une Postgres DB
   - Ou utilisez Supabase/Neon (gratuit)
   - Copiez la `DATABASE_URL`

4. **Variables d'environnement minimales**
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://votre-projet.vercel.app
   NEXTAUTH_SECRET=générez-avec-openssl-rand-base64-32
   ```

5. **Exécuter les migrations**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

📖 **Guide détaillé**: Voir [VERCEL_SETUP.md](./VERCEL_SETUP.md)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)
- Uploadthing account (optional, for video uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clips
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
   - Stripe keys (get from Stripe Dashboard)
   - Uploadthing keys (if using video uploads)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── brand/             # Brand dashboard pages
│   ├── creator/           # Creator dashboard pages
│   ├── admin/             # Admin panel pages
│   └── dashboard/         # Main dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe client
│   └── types.ts          # TypeScript types
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── types/                 # TypeScript type definitions
```

## Database Schema

The platform uses the following main models:

- **User**: Authentication and user accounts
- **Profile**: Extended user profile information
- **Campaign**: Brand campaigns with CPM rates and budgets
- **Submission**: Creator content submissions
- **ViewTracking**: View counts for submissions
- **Wallet**: User wallet balances
- **Transaction**: Payment and earnings transactions

## API Routes

### Campaigns
- `GET /api/campaigns` - List campaigns (filtered by role)
- `POST /api/campaigns` - Create campaign (Brand only)
- `GET /api/campaigns/[id]` - Get campaign details

### Submissions
- `GET /api/submissions` - List submissions
- `POST /api/submissions` - Create submission (Creator only)
- `PATCH /api/submissions/[id]` - Update submission status (Brand only)

### Wallet
- `POST /api/wallet/withdraw` - Initiate withdrawal (Creator only)

### View Tracking
- `POST /api/view-tracking` - Track views (Admin only, MVP manual tracking)

## Authentication

The platform supports:
- Email/Password authentication
- Google OAuth (configure in `.env`)
- Email magic links (configure SMTP in `.env`)

## User Roles

- **ADMIN**: Full platform access, user management, view tracking
- **BRAND**: Create campaigns, review submissions, manage budgets
- **CREATOR**: Browse campaigns, submit content, track earnings

## Earnings Calculation

Creators earn based on the CPM (Cost Per Mille) model:
```
Earnings = (Views / 1000) × CPM Rate
```

Example: 50,000 views at $5 CPM = $250

## Future Enhancements

The codebase is structured to support:
- Automated view tracking via platform APIs
- Creator ranking and performance scores
- Gamification features
- Dark mode
- Mobile app (API-first architecture ready)

## Development

### Database Migrations
```bash
npx prisma migrate dev
```

### Generate Prisma Client
```bash
npx prisma generate
```

### View Database (Prisma Studio)
```bash
npx prisma studio
```

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
