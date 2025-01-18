# Habit Tracker

A minimalist, mobile-first habit tracking application designed to help users build and maintain good habits with a focus on simplicity and daily consistency.

## Features

- 🎯 Track 12 predefined healthy habits daily
- 📱 Mobile-first, responsive design
- 📊 Weekly and monthly statistics
- 🔒 Secure passwordless authentication
- 🔄 Real-time data synchronization
- ⚡ Fast and intuitive interface
- 📅 Historical tracking and date navigation
- 📈 Progress visualization
- 🔄 Pull-to-refresh functionality
- 👆 Touch-optimized interactions

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: 
  - [shadcn/ui](https://ui.shadcn.com/) (Based on Radix UI)
  - [Radix UI](https://www.radix-ui.com/) for accessible primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Backend & Infrastructure
- **Database & Auth**: [Supabase](https://supabase.com/)
  - PostgreSQL database
  - Row Level Security
  - Magic Link Authentication
- **Hosting**: [Vercel](https://vercel.com)

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- A Supabase account

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Setup
1. Create a new Supabase project
2. Run the following SQL commands to create the necessary tables:

   ```sql
   -- Create habits table
   CREATE TABLE public.habits (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create habit_completion table
   CREATE TABLE public.habit_completion (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
     habit_id INTEGER REFERENCES habits (id) ON DELETE CASCADE,
     completion_date DATE NOT NULL
   );

   -- Insert default habits
   INSERT INTO public.habits (name) VALUES
     ('Lifting'),
     ('Meditate'),
     ('Journal'),
     ('Diet'),
     ('Read'),
     ('Jog'),
     ('Swim'),
     ('Tennis'),
     ('Cold Plunge'),
     ('Stretch'),
     ('Breathwork'),
     ('Surf');
   ```

3. Enable Row Level Security (RLS) and configure policies

### Running the Application

Development mode:
```bash
npm run dev
# or
yarn dev
```

Build for production:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

The application will be available at `http://localhost:3000`.

## Application Structure

```
src/
├── app/                 # Next.js App Directory
│   ├── (site)/         # Global layout and shared site components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Main application pages
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── skeletons/     # Loading skeletons
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── services/          # API and database services
└── types/             # TypeScript type definitions
```

## Features in Detail

### Authentication
- Passwordless authentication using Supabase Magic Links
- Secure session management
- Protected routes and API endpoints

### Habit Tracking
- Daily habit tracking with simple toggle interface
- Historical tracking with date navigation
- Prevention of future date tracking
- Real-time updates and optimistic UI

### Statistics
- Weekly view showing completion counts
- Monthly aggregated statistics
- Clean, minimalist data presentation

### Mobile Optimization
- Touch-friendly interface
- Swipe navigation
- Pull-to-refresh functionality
- Haptic feedback
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting and deployment

## Contact

Your Name - [@alexnordlinger_](https://x.com/alexnordlinger_)

Project Link: [https://github.com/materialize-labs/habit-tracker](https://github.com/materialize-labs/habit-tracker)
