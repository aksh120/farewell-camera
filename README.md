# 📸 Farewell | Vintage Camera Web App

A nostalgic, vintage-style camera application built for the web. Capture moments with authentic film aesthetics, including grain, light leaks, and film borders, organized in a beautiful gallery.

## ✨ Features

- **Vintage Camera Experience**: Real-time camera feed with baked-in vintage filters.
- **Authentic Aesthetics**:
  - Dynamic film grain and dust effects.
  - Random light leaks.
  - Decorative "film strip" borders.
- **Gallery**:
  - Infinite scroll optimization for large collections.
  - Beautifully animated grid layout.
  - Detailed photo viewer.
- **Admin Controls**: Password-protected photo deletion.
- **Performance**:
  - Optimized for Vercel's free tier (Static Export).
  - Aggressive caching for assets.
  - Memoized components and lazy loading.
- **PWA Ready**: Installable on mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: Canvas API & Browser Image Compression

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Supabase account.

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/farewell-camera.git
cd farewell-camera
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration

1.  **Create a table** named `photos`:
    ```sql
    create table photos (
      id uuid default gen_random_uuid() primary key,
      url text not null,
      orientation text,
      width integer,
      height integer,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    ```
2.  **Create a Storage Bucket** named `photos`.
3.  **Set Policies**: Ensure read/insert access is enabled for the public (or authenticated users depending on your preference).

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📦 Deployment

This project is optimized for **Vercel** with static export settings.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add your Supabase environment variables in the Vercel dashboard.
4.  Deploy!

**Note**: The project uses `output: 'export'` in `next.config.ts` to output static HTML, ensuring 0 serverless function usage for cost optimization.

## 🔐 Admin Access

To delete photos from the gallery, click the trash icon. You will be prompted for a password.

## 📄 License

This project is licensed under the MIT License.
