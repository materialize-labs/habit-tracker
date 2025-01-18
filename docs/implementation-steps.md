# Comprehensive Implementation Plan: Step-by-Step

## 1. Install and Configure Required Dependencies

### Tasks:
- [x] **Install Supabase Client for Authentication and Database**  
  The Supabase client is needed to handle communication with the database and authentication.  
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```

- [x] **Install Radix UI Primitives for Accessible UI Components**  
  Radix provides building-block components for accessible and interactive elements:  
  ```bash
  npm install @radix-ui/react-toast @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-slot
  ```

- [x] **Set Up TailwindCSS and Related Plugins**  
  TailwindCSS will provide minimal, efficient, and responsive styles:
  ```bash
  npm install tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```
  ✅ Note: TailwindCSS was already installed in the project.

- [x] **Install Zod for Input Validation**  
  Zod will enforce structured data validation (e.g., email formats) throughout the app as specified in the PRD:  
  ```bash
  npm install zod
  ```

- [x] **Install React Query (TanStack) for Data Caching and Fetching**  
  Ensures better performance by managing server-state caching:  
  ```bash
  npm install @tanstack/react-query
  ```

- [x] **Verify Installations**  
  All dependencies have been installed successfully with no vulnerabilities.

- [x] **Update Development Environment**  
  Project structure has been set up with all necessary directories:
  ```
  src/
    ├── app/                # Next.js app directory for routing
    ├── components/         # Reusable UI components
    │   ├── ui/            # ShadCN and Radix-based UI primitives
    │   ├── forms/         # Form implementations
    │   └── charts/        # Charts for statistics
    ├── contexts/          # Global state using React Context
    ├── hooks/             # Custom React hooks
    ├── lib/               # Utility functions and libraries
    ├── services/          # Backend interaction functions
    ├── types/             # TypeScript interfaces and types
    └── styles/            # Tailwind global and modular CSS
  ```

### Completion Checklist:
- [x] Supabase installed and configured
- [x] Radix UI dependencies installed for accessible UI components
- [x] TailwindCSS already installed and configured
- [x] Validation library (Zod) installed
- [x] React Query installed for optimized fetching and caching
- [x] Project directory structure created
- [x] Supabase client configuration file created at `src/lib/supabaseClient.ts`

### Next Steps Required:
1. Create a Supabase project at https://app.supabase.com/
2. Update the `.env` file with actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Setup Project Structure and Environment Configuration

### Tasks:

- [x] **Organize Project Folder Structure**  
  Create the following directories in the `src/` folder to implement a modular and scalable structure:
  ```
  src/
    ├── app/                # Next.js app directory for routing
    ├── components/         # Reusable UI and logical components
    │   ├── ui/             # Radix-based UI primitives
    ├── contexts/           # React Context for global state management
    ├── hooks/              # Custom React hooks
    ├── lib/                # Supabase client and utility functions
    ├── services/           # Backend interaction functions (e.g., Supabase calls and API logic)
    ├── styles/             # Global Tailwind CSS and custom styles
    ├── types/              # TypeScript interfaces and types
  ```

- [x] **Add `.env` Configuration**
  - Create a `.env` file in the root directory if it doesn't already exist.
  - Add the following Supabase environment variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
    ```

- [x] **Set Up a Global Supabase Client**
  - Create a file at `src/lib/supabaseClient.ts` to initialize the Supabase client.
  - Verify the client by testing the connection in the development console.

- [x] **Set Up `layout.tsx` and `page.tsx`**
  - Inside the `src/app/` directory, create the `layout.tsx` file to define the root layout
  - Create the `src/app/page.tsx` for a basic landing page
  - Updated with proper metadata and styling for our habit tracker app

- [x] **Add TypeScript Configurations**
  - TypeScript is properly configured with the correct settings in `tsconfig.json`
  - All necessary type definitions are installed

- [x] **Debug Environment Configuration**
  - If any errors occur during the above setup, confirm that:
    - ✅ `.env` variables are correctly loaded.
    - ✅ `process.env.NEXT_PUBLIC_*` variables are correctly prefixed with "NEXT_PUBLIC_".
    - ✅ Supabase client connects successfully (verified with test page at /test).

### Completion Checklist:
- [x] Project folder structure organized.
- [x] `.env` file created and filled with Supabase credentials.
- [x] `src/lib/supabaseClient.ts` file added, verifying Supabase client connectivity.
- [x] `layout.tsx` and `page.tsx` files created with a working layout.
- [x] TypeScript properly set up and running.
- [x] Local server running without errors.

## 3. Configure TailwindCSS and ShadCN UI

### Tasks:

- [x] **Initialize TailwindCSS Configuration**
  - TailwindCSS was already initialized with proper configuration
  - Configuration includes custom colors, dark mode support, and animations

- [x] **Update `tailwind.config.js`**
  - Configuration already includes all necessary content paths
  - Custom theme extends default Tailwind with our color scheme and design tokens

- [x] **Add Global TailwindCSS Styles**
  - Global styles are set up in `src/app/globals.css`
  - Includes base styles, components, and utilities
  - Custom CSS variables for theming and dark mode

- [x] **Build Core UI Components**
  - Created reusable components using Radix UI primitives:
    - Button (`src/components/ui/button.tsx`)
    - Input (`src/components/ui/input.tsx`)
    - Checkbox (`src/components/ui/checkbox.tsx`)
    - Dialog (`src/components/ui/dialog.tsx`)
  - All components are fully typed with TypeScript
  - Components use consistent styling with Tailwind classes

- [x] **Add Required Dependencies**
  - Installed additional utilities:
    - `clsx` and `tailwind-merge` for class name management
    - `lucide-react` for icons

- [x] **Organize and Document Components**
  - Components are organized in the `src/components/ui` directory
  - Each component is properly typed and documented
  - Components follow consistent patterns and naming conventions

### Completion Checklist:
- [x] Directory for UI components (`src/components/ui/`) created
- [x] Core UI components implemented (Button, Input, Checkbox, Dialog)
- [x] TailwindCSS configured with custom theme
- [x] Global styles set up with proper dark mode support
- [x] All components properly typed and documented

## 4. Set Up Supabase Authentication

### Tasks:

- [x] **Create a Supabase Project**
  - Log in to the [Supabase Dashboard](https://app.supabase.com/).
  - Create a new project by clicking **New Project** and provide:
    - **Project name**: Habit Tracker
    - **Database password**: Set a secure password.
    - **Region**: Choose the closest region for low latency.
  - Once the project is created, navigate to the **Project Settings > API** section to retrieve the `Supabase URL` and `public anon key`.

- [x] **Configure Supabase Environment Variables**
  - Open the `.env` file in the root directory and add the following (replace placeholders with actual values from the dashboard):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

- [x] **Set Up Supabase Client**
  - Create a new file `src/lib/supabaseClient.ts` to manage the Supabase client

- [x] **Enable Magic Link Authentication**
  - Go to the **Authentication > Settings** section in the Supabase dashboard.
  - Under the **Email** section, enable **Magic Link** authentication (enabled by default).
  - Set the `Site URL` under **Settings > Site URL** to match your app's development URL (e.g., `http://localhost:3000`).
  - Updated email template to use correct token_hash format.

- [x] **Test Supabase Client**
  - Add a test call in `src/app/page.tsx` to confirm the connection
  - Start the development server and check the console for a valid session response.

- [x] **Set Up Supabase Authentication Flow**
  - Create a directory `src/app/auth/` and add the following files to manage the authentication workflow:
    - `page.tsx`: Authentication page (email input + magic link).
    - `layout.tsx`: Layout for the auth page.
    - `confirm/route.ts`: Magic link verification endpoint.
  - Define the **Authentication Page** in `src/app/auth/page.tsx`

- [x] **Redirect Users on Successful Login**
  - After logging in, users will be redirected to the `dashboard` page.
  - Created basic dashboard page at `/dashboard` to display welcome message and user email.

- [x] **Listen for Authentication Events**
  - Ensure proper session handling by listening for changes in authentication state. Add this logic to a global `AuthContext`:
    - Create `src/contexts/AuthContext.tsx`
    - Wrap the app with `AuthProvider` in `layout.tsx` for global authentication

### Completion Checklist:
- [x] Supabase project created and environment variables configured.
- [x] Magic Link authentication enabled in Supabase dashboard.
- [x] Supabase client set up and verified.
- [x] Authentication page (`src/app/auth/page.tsx`) created with email input.
- [x] Authentication state handled globally using middleware.
- [x] Application tested login flow successfully with Magic Link.
- [x] Basic dashboard page created for authenticated users.

## 5. Design and Populate Database Tables in Supabase

### Tasks:

- [x] **Create Database Tables in Supabase**
  - Navigate to the **SQL Editor** in the Supabase dashboard and create the necessary tables based on the database schema.

  - **Create `Habits` Table**  
    Run the following SQL to create the static habit list table:
    ```sql
    CREATE TABLE public.habits (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    ```

  - **Create `Habit_Completion` Table**  
    Run the following SQL to track habit completions by users:
    ```sql
    CREATE TABLE public.habit_completion (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
      habit_id INTEGER REFERENCES habits (id) ON DELETE CASCADE,
      completion_date DATE NOT NULL
    );
    ```

- [x] **Insert Static Habit Data into `Habits` Table**
  - Use the SQL Editor or the Table Editor to populate the `Habits` table with the static predefined list of 12 habits:
    ```sql
    INSERT INTO public.habits (name)
    VALUES
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

- [x] **Verify Table Relationships**
  - Ensure that the relationships between the `auth.users`, `habits`, and `habit_completion` tables function correctly:
    - **`auth.users → habit_completion`**: Every habit completion should reference a valid `user_id` from the Supabase authentication table.
    - **`habits → habit_completion`**: Every habit completion must reference a valid `habit_id` from the `habits` table.

- [x] **Test the Table Setup with Dummy Data**
  - Insert test rows into the `habit_completion` table to ensure foreign keys, relationships, and constraints are functioning as expected.
  - Query all tables to confirm data integrity.

- [x] **Apply Row-Level Security (RLS) Policies**
  - Enable Row-Level Security on the `habit_completion` table to ensure users can only access their own data.
  - Created policies for SELECT, INSERT, and DELETE operations.
  - Added policy for authenticated users to view the static habits table.

- [x] **Generate TypeScript Types**
  - Generated TypeScript types to mirror the database schema.
  - Created `src/types/database.types.ts` with proper interfaces.
  - Created `src/services/habitService.ts` with typed database operations.

### Completion Checklist:
- [x] `Habits` table created and populated with the predefined static list.
- [x] `Habit_Completion` table created with proper relationships to `auth.users` and `habits`.
- [x] Row-Level Security (RLS) enabled and tested to restrict user access to their own records.
- [x] Test entries for habits and habit completions added and verified for correctness.
- [x] TypeScript types generated from the Supabase schema.

## 6. Mobile-First Layout Implementation

### Tasks:

- [x] **Install Required Dependencies**
  ```bash
  npm install framer-motion lucide-react date-fns
  ```

- [x] **Create Bottom Navigation Component**
  - Created `src/components/ui/bottom-nav.tsx` with:
    - Mobile-optimized tab bar
    - Active state indicators
    - Touch-friendly targets
    - Smooth transitions

- [x] **Update Dashboard Layout**
  - Modified `src/app/dashboard/layout.tsx` to:
    - Remove header navigation
    - Integrate bottom navigation
    - Optimize for mobile viewing

- [x] **Create Mobile-Friendly Pages**
  - [x] **Dashboard Overview Page**
    - Welcome section with user email
    - Today's progress card
    - Today's habits list
    - Touch-friendly layout
  
  - [x] **Habit Tracker Page**
    - Date navigation with touch controls
    - Habit list with toggle functionality
    - Optimistic UI updates
    - Loading states
    - Error handling
  
  - [x] **Profile Page**
    - Display user email
    - Sign out functionality
    - Mobile-optimized layout

### Completion Checklist:
- [x] Required dependencies installed (framer-motion, lucide-react, date-fns)
- [x] Bottom navigation component created and implemented
- [x] Dashboard layout updated for mobile-first design
- [x] Dashboard overview page optimized for mobile
- [x] Habit tracker page created with mobile interactions
- [x] Profile page implemented with basic functionality
- [x] All pages tested for mobile responsiveness

### Next Steps:
1. Implement statistics page with mobile-friendly charts
2. Add loading skeletons for better UX
3. Implement pull-to-refresh functionality
4. Add haptic feedback for interactions

## 7. Create Core Reusable UI Components

### Tasks:

- [x] **Set Up Directory for UI Components**
  - Create a directory for reusable UI components:
    ```
    src/components/ui/
    ```

- [x] **Add Mobile-Optimized UI Components**
  - Created essential UI components with mobile-first principles:
    - Button component with proper touch targets
    - Checkbox with touch feedback
    - Dialog with mobile-friendly animations

- [x] **Build Mobile-Friendly Button Component**
  - Minimum touch target size of 48px
  - Clear active/pressed states
  - Loading state support
  - Multiple variants and sizes
  ```tsx
  export const Button = ({ className, variant = 'primary', size = 'default', isLoading, children, ...props }) => (
    <button
      className={cn(
        "min-h-[48px] min-w-[48px]",
        "active:scale-95 transition-transform",
        className
      )}
      {...props}
    />
  );
  ```

- [x] **Build Touch-Optimized Checkbox Component**
  - Larger hit area for better touch interaction
  - Visual feedback on touch
  - Accessible tap targets
  - Label support

- [x] **Create Mobile Dialog Component**
  - Full-screen on mobile devices
  - Slide-up animation using Framer Motion
  - Touch-friendly close button
  - Backdrop blur effect

- [x] **Add Loading States and Skeletons**
  - Implemented mobile-friendly loading indicators
  - Added loading state to Button component
  - Added transitions and animations

### Completion Checklist:
- [x] All UI components optimized for touch interaction
- [x] Components follow consistent mobile design patterns
- [x] Loading states and animations implemented
- [x] Touch feedback and gestures working
- [x] Components ready for use in mobile views

### Next Steps:
1. Create additional components as needed (Toast, DropdownMenu)
2. Add haptic feedback for interactions
3. Implement skeleton screens for content loading
4. Test components across different mobile devices

## 8. Build Authentication Flow

### Tasks:

- [ ] **Set Up an Authentication Page**
  - Create a new directory `src/app/auth/` for the authentication page.
  - Add a file `page.tsx` to serve as the main entry point for the authentication flow

- [ ] **Redirect After Successful Login**
  - Users will be redirected to the `/dashboard` after logging in. Ensure that the `/dashboard` route is set up in `src/app/dashboard/` in future steps.

- [ ] **Protect the Authenticated Routes**
  - Only allow authenticated users to access dashboard routes like `/dashboard/tracker` or `/dashboard/stats`. Add middleware for authentication:
    - Create a file `src/middleware.ts` with the code

- [ ] **Style the Authentication Page**
  - Use Tailwind to add basic responsive styling

- [ ] **Handle Authentication State Globally**
  - Refactor the `AuthContext` created in Step 4 to handle global user authentication state.
  - Use conditional logic to check whether the user is logged in and redirect appropriately

- [ ] **Display Conditional Content Based on Auth State**
  - On the authentication page or throughout the app, modify behavior based on whether the user is logged in

- [ ] **Verify the Magic Link Process**
  - Log out of the app to verify the Magic Link functionality:
    - On `/auth`, enter an email address to generate a Magic Link.
    - Follow the Magic Link to confirm redirection to `/dashboard`.
    - Ensure session persistence on reload.

- [ ] **Mobile-Optimized Auth Pages**
  - Full-screen mobile layout
  - Touch-friendly input fields
  - Clear loading states
  - Keyboard handling for mobile

- [ ] **Add Auth Loading States**
  - Implement skeleton screens
  - Add loading spinners
  - Show progress indicators

### Completion Checklist:
- [ ] Authentication page (`src/app/auth/page.tsx`) implemented with email input and styled.
- [ ] Magic Link sign-in procedure integrated with Supabase.
- [ ] Middleware created to protect authenticated dashboard routes.
- [ ] Auth state management implemented globally using `AuthContext`.
- [ ] Authentication logic verified with test users.
- [ ] Application tested login flow successfully with Magic Link.
- [ ] Basic dashboard page created for authenticated users.
- [ ] Auth flow optimized for mobile devices
- [ ] Touch-friendly input and interactions
- [ ] Loading states visible and smooth

## 9. Implement Habit Tracker Page

### Tasks:

- [ ] **Create Mobile-First Tracker Layout**
  - Full-width design
  - Large touch targets for habits
  - Swipeable date navigation
  - Pull-to-refresh support

- [ ] **Add Mobile Interactions**
  - Swipe between dates
  - Haptic feedback on completion
  - Smooth animations
  - Loading states

## 10. Integrate Supabase Client and Database Logic

### Tasks:

- [ ] **Set Up Service Layer for Database Interactions**
  - Create a directory to manage reusable service functions for database operations:
    ```
    src/services/
    ```
  - Add the following file for habit-related operations: `src/services/habitService.ts`.

  - **Implement `habitService.ts`**:
    Write reusable functions to abstract and handle database calls for habits and habit completions

- [ ] **Update Habit Tracker to Use Service Functions**
  - Modify `src/app/dashboard/tracker/page.tsx` to use the new service functions rather than direct Supabase queries

- [ ] **Verify Database Integration**
  - Confirm that:
    - Habits are fetched correctly from the `habits` table.
    - Habit completions are fetched, added, and removed in the `habit_completion` table for the current user.
    - Clicking checkboxes updates the database and reflects in the UI immediately.

- [ ] **Add Error Handling Feedback**
  - Update the UI to provide user-friendly messages for errors during data fetching or updates

### Completion Checklist:
- [ ] Service layer (`habitService.ts`) created with reusable functions for fetching and updating data.
- [ ] Habit tracker updated to use the service functions for database operations.
- [ ] UI correctly reflects updates made to habit completions in the database.
- [ ] Error handling tested for failed database operations.
- [ ] Workflow for data fetching and habit updating verified end-to-end.

## 11. Create Statistics Page

### Tasks:

- [ ] **Set Up Statistics Page Route**
  - Create a directory for the statistics page

- [ ] **Update Service Layer to Support Date Ranges**
  - Update `src/services/habitService.ts` to include fetching habit completions for a date range

- [ ] **Style the Statistics Page**
  - Use TailwindCSS to ensure the statistics are visually appealing.
  - Add subtle background colors, section headers, and spacing for better readability

- [ ] **Test the Statistics Workflow**
  - Log in as a test user and:
    1. Mark habits as completed for various days in the current week and month.
    2. Navigate to `/dashboard/stats` and verify:
       - Weekly stats show the correct number of completions.
       - Monthly stats reflect accurate totals for the month.

- [ ] **Error Feedback for Failing Data Fetches**
  - Ensure any Supabase errors are displayed on the page

### Completion Checklist:
- [ ] Statistics page created at `/dashboard/stats/`.
- [ ] Weekly stats show habit completions for the last 7 days.
- [ ] Monthly stats show habit completions for the current month.
- [ ] UI styled and responsive for better readability.
- [ ] Database integration tested and confirmed with real test data.
- [ ] Error handling verified for failing data fetch scenarios.

## 13. Set Up React Context for Global State Management

### Tasks:

- [ ] **Create Global Context Directory**
  - Create a directory for React Context in the project:
    ```
    src/contexts/
    ```

- [ ] **Set Up AuthContext**
  - Define an `AuthContext` to manage global authentication state so that user information is available across the app.
  - Implement the `AuthProvider` that wraps the entire app in the layout, providing the logged-in user's state to all child components.

- [ ] **Set Up DateContext (Optional)**
  - Create a `DateContext` to manage the selected date for the Habit Tracker and ensure consistency when navigating between pages (e.g., Habit Tracker and Statistics pages).

- [ ] **Wrap the App with Context Providers**
  - Modify the root `layout.tsx` file to wrap the app inside the context providers (`AuthProvider` and `DateContext`).

- [ ] **Use Context in Components**
  - Use the AuthContext in any component (e.g., the navigation bar, tracker page) to determine if the user is logged in and retrieve their user info.

- [ ] **Handle Authentication State**
  - Add logic in `AuthContext` to listen to Supabase auth state changes and update the global state if the user logs in or out.

- [ ] **Test React Context**
  - Confirm that:
    - User data is accessible via `AuthContext` on any page.
    - The selected date in `DateContext` persists when navigating between the tracker and statistics pages.

### Checklist:
- [ ] `AuthContext` created and globally available.
- [ ] Optional `DateContext` created for selected date state.
- [ ] Root layout wrapped with context providers.
- [ ] Components tested to ensure they can access context values.

## 14. Implement Progressive Web App (PWA) Support

### Tasks:

- [ ] **Add Next.js PWA Plugin**
  - Install the `next-pwa` package to add PWA functionality:
    ```bash
    npm install next-pwa
    ```

- [ ] **Update `next.config.js`**
  - Configure the PWA in the Next.js project by enabling the plugin:
    ```js
    const withPWA = require("next-pwa")({
      dest: "public",
      disable: process.env.NODE_ENV === "development", // Only enable PWA in production
    });

    module.exports = withPWA({
      reactStrictMode: true,
    });
    ```

- [ ] **Add a `manifest.json` File**
  - Create a `public/manifest.json` file to define the PWA metadata (icons, name, theme color, etc.):
    ```json
    {
      "name": "Habit Tracker",
      "short_name": "HabitTracker",
      "description": "A minimalist app for tracking daily habits",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#ffffff",
      "theme_color": "#4f46e5",
      "icons": [
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    }
    ```

- [ ] **Add App Icons**
  - Create a directory `public/icons` and add the necessary app icons with the following sizes:
    - `icon-192x192.png`
    - `icon-512x512.png`
  - Use a tool like [Favicon Generator](https://favicon.io/) to generate high-quality icons.

- [ ] **Add Service Worker**
  - The `next-pwa` plugin automatically generates a service worker for caching assets. No additional setup is required for basic offline functionality.

- [ ] **Test PWA Functionality**
  - Build the app for production:
    ```bash
    npm run build
    npm start
    ```
  - Open the app in a browser and test the PWA functionality:
    - Add the app to the home screen using the "Install" option in the browser.
    - Verify offline functionality by disabling your network connection and accessing the app.

- [ ] **Optional: Customize Caching Strategies**
  - Modify the caching behavior by creating a `next-pwa.config.js` file:
    ```js
    module.exports = {
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "document",
          handler: "NetworkFirst", // Prioritize network requests for pages
          options: {
            cacheName: "html-cache",
          },
        },
      ],
    };
    ```
    
### Checklist:
- [ ] PWA support added with `next-pwa` plugin.
- [ ] `manifest.json` file created with app metadata and icons.
- [ ] App icons added in the `public/icons` folder.
- [ ] PWA functionality tested (e.g., installable, offline capability).
- [ ] Optional caching strategies customized as needed.

## 15. Optimize for Mobile-First Design

### Tasks:

- [ ] **Configure TailwindCSS to Prioritize Mobile Design**
  - Tailwind works with a mobile-first philosophy by default. However, ensure all components use responsiveness effectively by relying on Tailwind's breakpoint utilities (`sm`, `md`, `lg`, etc.) for progressive enhancement.

- [ ] **Ensure Responsive Layouts Across All Pages**
  - Verify and adjust the following core pages to work seamlessly on small devices:
    - **Auth Page**: Center form elements with proper spacing.
    - **Habit Tracker**: Ensure checkboxes, habit names, and date navigation are touch-friendly.
    - **Statistics Page**: Use a stacked card design for weekly and monthly stats to avoid crowded text on smaller screens.

- [ ] **Increase Touch Target Sizes**
  - Add padding to clickable elements to improve touch accuracy on mobile.
  - Example adjustments:
    - Increase button height to at least 48px.
    - Ensure checkboxes and input fields have sufficient padding:
      ```css
      .checkbox {
        @apply h-6 w-6;
      }

      .button-large {
        @apply py-3 px-6; /* Larger tap spaces */
      }
      ```

- [ ] **Use Flexbox and Grid for Layout Improvements**
  - Update layouts for:
    - Centering elements using `flex` and `grid` utilities.
    - Adapting to screen sizes using `grid-cols-1`, `grid-cols-2` for wider screens.
    - Nesting responsive sections effectively: 
      ```tsx
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100">Weekly Stats</div>
        <div className="p-4 bg-gray-100">Monthly Stats</div>
      </div>
      ```

- [ ] **Test Components on Mobile Devices**
  - Open the app using Developer Tools in Chrome (or another browser) and test responsiveness:
    - Adjust viewports to test common device dimensions (e.g., 375px for iPhone).
    - Verify flex and grid layouts across the pages adapt to smaller screens.
    - Ensure buttons, inputs, and checkboxes remain large enough for touch use.

- [ ] **Optimize Typography for Readability**
  - Use TailwindCSS's `text-lg` or `text-sm` classes to scale text sizes appropriately for smaller screens.
  - Example:
    - Use `text-base` on small screens, scale up using breakpoints:
      ```tsx
      <h1 className="text-xl sm:text-2xl font-bold">
        Daily Habit Tracker
      </h1>
      ```

- [ ] **Enable Horizontal Overflow Prevention**
  - Use utilities like `w-full` and `overflow-hidden` to prevent unintended horizontal scrolling:
    ```scss
    .container {
      @apply max-w-full overflow-hidden;
    }
    ```

- [ ] **Add Fixed Navigation for Better Mobile UX**
  - Add a bottom navigation bar for easier access to tracker and stats on mobile views:
    - Example for bottom navigation:
      ```tsx
      <nav className="fixed bottom-0 w-full bg-white shadow-md flex justify-around py-2">
        <a href="/dashboard/tracker" className="text-blue-600 font-medium">Tracker</a>
        <a href="/dashboard/stats" className="text-blue-600 font-medium">Stats</a>
      </nav>
      ```

- [ ] **Test Horizontal and Vertical Orientation**
  - Simulate horizontal/vertical orientations in Developer Tools and confirm:
    - Navigation is accessible.
    - Buttons and text remain legible.
    - Critical content is not clipped or misplaced.

### Checklist:
- [ ] Tailwind styles leverage responsiveness effectively across breakpoints.
- [ ] Buttons, checkboxes, and inputs are touch-friendly with sufficient size and padding.
- [ ] Flexbox and grid layouts adapt dynamically to small screens.
- [ ] Typography adjusted and verified for readability across device sizes.
- [ ] Bottom navigation added for better mobile usability.
- [ ] All components fully tested in multiple screen sizes and orientations.

## 16. Build Error Handling and Edge Case Logic

### Tasks:

- [ ] **Implement Global Error Handling**
  - Set up a mechanism to catch unexpected errors and display a fallback UI across the application.
  - Ensure errors that crash specific components do not cascade to break the entire app.
  - Integrate global error logging for better debugging in production environments.

- [ ] **Display User-Friendly Error Feedback**
  - Add visible error messages in the UI for users when:
    - Network errors occur (e.g., failed database queries).
    - Form submissions are invalid.
    - Unknown issues prevent proper function (e.g., login failures).

- [ ] **Handle Supabase Database Errors**
  - Implement consistent error handling for all database failures when fetching or updating data.
  - Ensure that any Supabase-related errors (e.g., invalid queries, permission issues) are properly logged and surfaced for debugging.

- [ ] **Validate User Inputs**
  - Use validation tools to verify any user input, such as email formats or form fields.
  - Prevent invalid inputs from being sent to the server and show helpful feedback for corrections.

- [ ] **Check Empty or Missing Data Scenarios**
  - Ensure the app gracefully handles and displays empty states:
    - No habits available.
    - No statistical data for selected dates.
  - Avoid blank or broken UIs caused by missing or incomplete data.

- [ ] **Restrict Future Date Selections**
  - Ensure users can only interact with habits from past or current dates.
  - Provide feedback if users attempt to select unsupported dates (e.g., future dates).

- [ ] **Centralize Logging for All Errors**
  - Establish a consistent logging mechanism for capturing errors.
  - Log critical errors for development and production using a centralized service or debugging strategy (e.g., browser console in development, error monitoring tools in production).

- [ ] **Test for Edge Cases**
  - Simulate failure scenarios such as:
    - Invalid database credentials.
    - Empty form submissions.
    - Users attempting restricted actions (e.g., accessing protected routes while logged out).
  - Verify the behavior and proper error messages for each scenario.

### Checklist:
- [ ] Global error handling implemented to catch unexpected failures.
- [ ] Proper error feedback provided to users for failed operations.
- [ ] Database errors properly handled and easily debugged.
- [ ] User inputs validated with clear correction instructions for invalid data.
- [ ] Empty or missing data scenarios accounted for with clean fallback UIs.
- [ ] Future dates restricted in all applicable functionalities.
- [ ] Edge cases tested thoroughly to ensure app resilience.

## 17. Unit Testing and QA

### Tasks:

- [ ] **Set Up Testing Framework**
  - Install required packages for unit testing:
    - Install Jest:
      ```
      npm install jest @testing-library/react @testing-library/jest-dom
      ```
    - If not already installed, include `jest-environment-jsdom` for DOM testing.

- [ ] **Write Unit Tests for Core Components**
  - Verify core components like buttons, checkboxes, and inputs to ensure their behavior meets expectations.
  - Focus on components from `src/components/ui/`, testing for:
    - Proper rendering.
    - Correct interaction behaviors (e.g., click, input change).
    - Accessibility compliance.

- [ ] **Write Tests for Significant Features**
  - Test habit-tracking functionality:
    - Ensure habits can be completed or unchecked.
    - Verify database updates on habit completions.
  - Test statistics generation:
    - Ensure weekly and monthly stats calculate correctly.
    - Verify that no errors occur when data is missing.

- [ ] **Test Authentication Workflow**
  - Validate the authentication process:
    - Test Magic Link sign-in by simulating API responses.
    - Ensure users are redirected correctly after login.
    - Test behavior for logged-out users trying to access protected routes.

- [ ] **Simulate Failure Scenarios**
  - Test error states for:
    - Network failures.
    - Supabase database errors.
    - Invalid or missing data.
  - Confirm user feedback (e.g., error messages) is displayed.

- [ ] **Run Cross-Browser Testing**
  - Ensure the app works correctly on major browsers, including:
    - Chrome
    - Edge
    - Firefox
    - Safari
  - Test both desktop and mobile views.

- [ ] **Test Responsiveness Across Devices**
  - Verify proper layouts and functionality at common breakpoints:
    - 320px (small phones like iPhone SE).
    - 375px (phones like iPhone 12/13).
    - 768px (tablets like iPad).
    - 1280px+ (desktops).

- [ ] **Test PWA Functionality**
  - Check that the app:
    - Is installable on mobile devices and desktops.
    - Functions offline where applicable.
  - Verify app icons and manifest metadata.

- [ ] **Perform Manual QA**
  - Use plan scripts to test the app's core flows manually:
    - Habit tracking across different dates.
    - Viewing weekly and monthly statistics.
    - User login/logout and navigation.

- [ ] **Enable Continuous Integration (CI) for Testing**
  - Add automated test scripts in the CI pipeline (e.g., GitHub Actions, Vercel CI).
  - Ensure tests run on all pull requests before merging them.

### Checklist:
- [ ] Testing framework installed and configured.
- [ ] Core components tested for proper rendering and interactivity.
- [ ] Habit-tracking and statistics features thoroughly tested.
- [ ] Authentication workflow validated.
- [ ] Failure scenarios and error messages tested.
- [ ] App responsiveness verified across multiple browsers and devices.
- [ ] PWA functionality tested, including offline usage.
- [ ] Manual QA performed to ensure all features meet expectations.
- [ ] Automated testing integrated into CI pipeline.

## Mobile App Transformation Plan

### Overview
Transform the current web app into a mobile-first application with bottom tab navigation and mobile app-like interactions.

### Tasks:

1. **Update Global Layout Structure**
   - [ ] Modify `src/app/dashboard/layout.tsx` to use a mobile-first layout:
     ```tsx
     <div className="min-h-screen bg-background">
       <main className="pb-16"> {/* Add padding for bottom nav */}
         {children}
       </main>
       <BottomNav />
     </div>
     ```
   - [ ] Remove the current top navigation header

2. **Create Bottom Navigation Component**
   - [ ] Create new file `src/components/ui/bottom-nav.tsx`:
     ```tsx
     interface NavItem {
       icon: IconComponent;
       label: string;
       href: string;
     }
     
     const navItems: NavItem[] = [
       { icon: HomeIcon, label: 'Home', href: '/dashboard' },
       { icon: CheckSquareIcon, label: 'Habits', href: '/dashboard/tracker' },
       { icon: BarChartIcon, label: 'Stats', href: '/dashboard/stats' },
       { icon: UserIcon, label: 'Profile', href: '/dashboard/profile' }
     ];
     ```
   - [ ] Style with fixed positioning and proper touch targets
   - [ ] Add active state indicators
   - [ ] Include smooth transitions

3. **Update Page Layouts**
   - [ ] Modify Dashboard Overview Page:
     - Remove current card-based layout
     - Add mobile-optimized header with user info
     - Show quick stats and today's habits
   - [ ] Update Habit Tracker Page:
     - Full-width design
     - Larger touch targets for checkboxes
     - Floating action button for date picker
   - [ ] Revise Statistics Page:
     - Stack charts vertically
     - Add swipe gestures for time period changes
   - [ ] Create new Profile Page:
     - User settings
     - App preferences
     - Sign out option

4. **Add Mobile Interactions**
   - [ ] Install and configure `framer-motion` for animations
   - [ ] Add page transitions
   - [ ] Implement pull-to-refresh functionality
   - [ ] Add haptic feedback for interactions

5. **Update Component Styling**
   - [ ] Increase touch target sizes:
     ```css
     .touch-target {
       @apply min-h-[48px] min-w-[48px];
     }
     ```
   - [ ] Add mobile-friendly spacing:
     ```css
     .mobile-container {
       @apply px-4 py-6 space-y-4;
     }
     ```
   - [ ] Update typography scale for better mobile readability

6. **Implement Mobile Gestures**
   - [ ] Add swipe navigation between main sections
   - [ ] Add pull-to-refresh on list views
   - [ ] Implement smooth scrolling and momentum

7. **Update Theme and Visual Design**
   - [ ] Adjust color scheme for better mobile contrast
   - [ ] Update spacing and padding for touch interfaces
   - [ ] Add mobile-optimized loading states
   - [ ] Implement skeleton screens for loading states

8. **Add Progressive Enhancement**
   - [ ] Keep desktop layout as fallback for larger screens
   - [ ] Add responsive breakpoints for hybrid usage
   - [ ] Ensure keyboard navigation still works

### Implementation Order:

1. **Phase 1: Core Layout Updates**
   - [ ] Create `BottomNav` component
   - [ ] Update dashboard layout
   - [ ] Remove top navigation
   - [ ] Basic mobile styling

2. **Phase 2: Page Restructuring**
   - [ ] Update dashboard overview
   - [ ] Modify habit tracker
   - [ ] Revise statistics view
   - [ ] Add profile page

3. **Phase 3: Mobile Interactions**
   - [ ] Add animations
   - [ ] Implement gestures
   - [ ] Update touch targets
   - [ ] Add loading states

4. **Phase 4: Progressive Enhancement**
   - [ ] Desktop fallbacks
   - [ ] Responsive testing
   - [ ] Cross-browser verification

### Files to Modify:

1. **Layout Files**
   - `src/app/dashboard/layout.tsx`
   - `src/app/dashboard/page.tsx`
   - `src/app/dashboard/tracker/page.tsx`
   - `src/app/dashboard/stats/page.tsx`

2. **Component Files**
   - `src/components/ui/nav.tsx` → `bottom-nav.tsx`
   - `src/components/ui/button.tsx`
   - `src/components/ui/checkbox.tsx`

3. **Style Files**
   - `src/app/globals.css`
   - `tailwind.config.js`

4. **New Files to Create**
   - `src/components/ui/bottom-nav.tsx`
   - `src/app/dashboard/profile/page.tsx`
   - `src/hooks/use-mobile-gestures.ts`

### Success Criteria:
- App feels native on mobile devices
- Smooth transitions between pages
- Proper touch targets (minimum 48x48px)
- No horizontal scrolling
- Fast loading and response times
- Intuitive mobile navigation
- Proper handling of gestures
- Fallback support for desktop users

### Dependencies to Add:
```bash
npm install framer-motion lucide-react date-fns
```

Would you like me to proceed with implementing Phase 1 of this transformation plan?
