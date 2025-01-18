# Comprehensive Implementation Plan: Step-by-Step

## 1. Install and Configure Required Dependencies

### Tasks:
- [ ] **Install Supabase Client for Authentication and Database**  
  The Supabase client is needed to handle communication with the database and authentication.  
  ```bash
  npm install @supabase/supabase-js
  ```

- [ ] **Install Radix UI Primitives for Accessible UI Components**  
  Radix provides building-block components for accessible and interactive elements:  
  ```bash
  npm install @radix-ui/react-toast @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  ```

- [ ] **Install ShadCN for Predefined Tailwind-Compatible Components**  
  Enables creating reusable components such as buttons, inputs, and modals with accessibility baked in:  
  ```bash
  npx shadcn add button checkbox dialog dropdown-menu
  ```

- [ ] **Set Up TailwindCSS and Related Plugins**  
  TailwindCSS will provide minimal, efficient, and responsive styles:
  ```bash
  npm install tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

- [ ] **Install Zod for Input Validation**  
  Zod will enforce structured data validation (e.g., email formats) throughout the app as specified in the PRD:  
  ```bash
  npm install zod
  ```

- [ ] **Install React Query (TanStack) for Data Caching and Fetching**  
  Ensures better performance by managing server-state caching:  
  ```bash
  npm install @tanstack/react-query
  ```

- [ ] **Verify Installations**  
  Confirm all dependencies are properly installed with the following commands:
  ```bash
  npm ls @supabase/supabase-js
  npm ls @radix-ui/react-toast
  npm ls tailwindcss
  ```

- [ ] **Update Development Environment**  
  Start the development server to ensure no errors occur from missing dependencies:  
  ```bash
  npm run dev
  ```
  Verify that the project runs successfully by opening **http://localhost:3000** in your browser. 

### Completion Checklist:
- [ ] Supabase installed and configured.
- [ ] Radix UI dependencies installed for accessible UI components.
- [ ] ShadCN components set up and ready.
- [ ] TailwindCSS installed and configured.
- [ ] Validation library (Zod) installed.
- [ ] React Query installed for optimized fetching and caching.
- [ ] Local server running successfully without any dependency issues.

## 2. Setup Project Structure and Environment Configuration

### Tasks:

- [ ] **Organize Project Folder Structure**  
  Create the following directories in the `src/` folder to implement a modular and scalable structure:
  ```
  src/
    ├── app/                # Next.js app directory for routing
    ├── components/         # Reusable UI and logical components
    │   ├── ui/             # ShadCN and Radix-based UI primitives
    ├── contexts/           # React Context for global state management
    ├── hooks/              # Custom React hooks
    ├── lib/                # Supabase client and utility functions
    ├── services/           # Backend interaction functions (e.g., Supabase calls and API logic)
    ├── styles/             # Global Tailwind CSS and custom styles
    ├── types/              # TypeScript interfaces and types
  ```

- [ ] **Add `.env` Configuration**
  - Create a `.env` file in the root directory if it doesn’t already exist.
  - Add the following Supabase environment variables, replacing `<your-project-url>` and `<your-anon-key>` with actual values from the Supabase dashboard:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
    ```

- [ ] **Set Up a Global Supabase Client**
  - Create a file at `src/lib/supabaseClient.ts` to initialize the Supabase client.
  - Verify the client by testing the connection in the development console.

- [ ] **Set Up `layout.tsx` and `page.tsx`**
  - Inside the `src/app/` directory, create the `layout.tsx` file to define the root layout
  - Create the `src/app/page.tsx` for a basic landing page:
    ```tsx
    export default function Page() {
      return <h1>Welcome to Habit Tracker</h1>;
    }
    ```
  - Start the development server and check that the layout works.

- [ ] **Add TypeScript Configurations (Optional, if not already set up)**
  - Ensure TypeScript is configured in the project. If not, run:
    ```bash
    touch tsconfig.json
    npm run dev
    ```
  - Next.js will prompt to install `typescript` and `@types/react`. Accept the prompt and verify that `tsconfig.json` is automatically updated.

- [ ] **Debug Environment Configuration**
  - If any errors occur during the above setup, confirm that:
    - `.env` variables are correctly loaded.
    - `process.env.NEXT_PUBLIC_*` variables are correctly prefixed with "NEXT_PUBLIC_".
    - Supabase client connects successfully (test with a dummy call to fetch user data).

### Completion Checklist:
- [ ] Project folder structure organized.
- [ ] `.env` file created and filled with Supabase credentials.
- [ ] `src/lib/supabaseClient.ts` file added, verifying Supabase client connectivity.
- [ ] `layout.tsx` and `page.tsx` files created with a working layout.
- [ ] TypeScript properly set up and running.
- [ ] Local server running without errors.

## 3. Configure TailwindCSS and ShadCN UI

### Tasks:

- [ ] **Initialize TailwindCSS Configuration**
  - If TailwindCSS was not initialized earlier during dependency installation, run:
    ```bash
    npx tailwindcss init
    ```
  - This will create a `tailwind.config.js` file in the root directory.

- [ ] **Update `tailwind.config.js`**
  - Open `tailwind.config.js` and configure the content paths to include all relevant files

- [ ] **Add Global TailwindCSS Styles**
  - Create a `src/styles/globals.css` file and import the default TailwindCSS styles

  - Make sure it's imported in `layout.tsx`:
    ```tsx
    import "@/styles/globals.css"; // Import global styles
    ```

- [ ] **Verify Tailwind Functionality**
  - Add the following to `src/app/page.tsx` to confirm TailwindCSS is functioning correctly
  - Start the development server to confirm styles are applied correctly.

- [ ] **Install & Configure ShadCN UI**
  - Use ShadCN CLI to set up reusable TailwindCSS-compatible components. Install required packages for buttons and UI controls:
    ```bash
    npx shadcn add button checkbox dialog dropdown-menu
    ```
  
  - This will automatically generate `src/components/ui/` directory with needed components (e.g., `button.tsx`, `checkbox.tsx`).

- [ ] **Verify ShadCN Components**
  - Add a sample button using the ShadCN button component to verify
  - Restart the development server and confirm that the button renders correctly.

- [ ] **Optional: Add Custom Tailwind Configurations**
  - If additional customizations are required (e.g., colors, fonts, spacing), add them to `tailwind.config.js` under the `extend` property

### Completion Checklist:
- [ ] TailwindCSS configured with accurate content paths.
- [ ] Global TailwindCSS styles added to `src/styles/globals.css`.
- [ ] ShadCN components (e.g., buttons, modals, checkboxes) installed and verified.
- [ ] TailwindCSS properly renders styles in the browser.
- [ ] Optional custom theme configurations added as needed.

## 4. Set Up Supabase Authentication

### Tasks:

- [ ] **Create a Supabase Project**
  - Log in to the [Supabase Dashboard](https://app.supabase.com/).
  - Create a new project by clicking **New Project** and provide:
    - **Project name**: Habit Tracker
    - **Database password**: Set a secure password.
    - **Region**: Choose the closest region for low latency.
  - Once the project is created, navigate to the **Project Settings > API** section to retrieve the `Supabase URL` and `public anon key`.

- [ ] **Configure Supabase Environment Variables**
  - Open the `.env` file in the root directory and add the following (replace placeholders with actual values from the dashboard):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

- [ ] **Set Up Supabase Client**
  - Create a new file `src/lib/supabaseClient.ts` to manage the Supabase client

- [ ] **Enable Magic Link Authentication**
  - Go to the **Authentication > Settings** section in the Supabase dashboard.
  - Under the **Email** section, enable **Magic Link** authentication (enabled by default).
  - Set the `Site URL` under **Settings > Site URL** to match your app’s development URL (e.g., `http://localhost:3000`).

- [ ] **Test Supabase Client**
  - Add a test call in `src/app/page.tsx` to confirm the connection
  - Start the development server and check the console for a valid session response.

- [ ] **Set Up Supabase Authentication Flow**
  - Create a directory `src/app/auth/` and add the following files to manage the authentication workflow:
    - `page.tsx`: Authentication page (email input + magic link).
    - `layout.tsx`: Layout for the auth page.
  - Define the **Authentication Page** in `src/app/auth/page.tsx`

- [ ] **Redirect Users on Successful Login**
  - After logging in, users will be redirected to the `dashboard` page. Make sure the `/dashboard` route is set up later (covered in future steps).

- [ ] **Listen for Authentication Events**
  - Ensure proper session handling by listening for changes in authentication state. Add this logic to a global `AuthContext`:
    - Create `src/contexts/AuthContext.tsx`
    - Wrap the app with `AuthProvider` in `layout.tsx` for global authentication

### Completion Checklist:
- [ ] Supabase project created and environment variables configured.
- [ ] Magic Link authentication enabled in Supabase dashboard.
- [ ] Supabase client set up and verified.
- [ ] Authentication page (`src/app/auth/page.tsx`) created with email input.
- [ ] Authentication state handled globally using `AuthContext`.
- [ ] Application tests login flow successfully with Magic Link.

## 5. Design and Populate Database Tables in Supabase

### Tasks:

- [ ] **Create Database Tables in Supabase**
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

- [ ] **Insert Static Habit Data into `Habits` Table**
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

- [ ] **Verify Table Relationships**
  - Ensure that the relationships between the `auth.users`, `habits`, and `habit_completion` tables function correctly:
    - **`auth.users → habit_completion`**: Every habit completion should reference a valid `user_id` from the Supabase authentication table.
    - **`habits → habit_completion`**: Every habit completion must reference a valid `habit_id` from the `habits` table.

- [ ] **Test the Table Setup with Dummy Data**
  - Insert test rows into the `habit_completion` table to ensure foreign keys, relationships, and constraints are functioning as expected:
    ```sql
    INSERT INTO public.habit_completion (user_id, habit_id, completion_date)
    VALUES
      ('<user-uuid>', 1, '2025-01-01'),
      ('<user-uuid>', 2, '2025-01-01'),
      ('<user-uuid>', 3, '2025-01-02');
    ```

  Replace `<user-uuid>` with a valid `id` from the `auth.users` table.

  - Query all tables to confirm data integrity:
    ```sql
    SELECT * FROM public.habits;
    SELECT * FROM public.habit_completion;
    ```

- [ ] **Apply Row-Level Security (RLS) Policies**
  - Enable Row-Level Security on the `habit_completion` table to ensure users can only access their own data. This prevents unauthorized access to other users' data.

  - Go to **Table Editor > habit_completion > Policies** and add the following security policy:
    ```sql
    CREATE POLICY "Users can manage their habit completions"
    ON public.habit_completion
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    ```

  - Test RLS:
    - Log in as a specific user and confirm they can only access their own `habit_completion` entries.
    - Attempt to access or insert records with a different `user_id` and verify RLS prevents the operation.

- [ ] **Optionally Generate TypeScript Types**
  - Supabase allows automatic generation of TypeScript types to mirror the database schema. Use the Supabase CLI to generate and save these types for code completion and type safety:
    ```bash
    supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
    ```

  - Import the generated types into the project:
    ```ts
    import { Database } from "@/types/database.types";

    // Example usage
    type HabitCompletion = Database["public"]["Tables"]["habit_completion"]["Row"];
    ```

### Completion Checklist:
- [ ] `Habits` table created and populated with the predefined static list.
- [ ] `Habit_Completion` table created with proper relationships to `auth.users` and `habits`.
- [ ] Row-Level Security (RLS) enabled and tested to restrict user access to their own records.
- [ ] Test entries for habits and habit completions added and verified for correctness.
- [ ] Optional: TypeScript types generated from the Supabase schema.

## 6. Implement Global Styles and Layout

### Tasks:

- [ ] **Set Up Global Layout for the App**
  - Create a file `layout.tsx` in the `src/app/` directory to define the main layout of the app

- [ ] **Configure Layout for Authenticated vs. Unauthenticated Users**
  - Create two separate layouts:
    - `/auth/layout.tsx`: For pages like login or signup.
    - `/dashboard/layout.tsx`: For logged-in user views like tracker and statistics.

  - **Add the Auth Layout**:

  - **Add the Dashboard Layout**

  - **Wrap Authenticated Routes with the Dashboard Layout**:
    - For instance, in `src/app/dashboard/layout.tsx`, wrap all child routes (like `/tracker` and `/stats`) with this layout.

- [ ] **Add Navigation to Shared Layout**
  - Update the dashboard layout to include navigation links

- [ ] **Implement Shared Styling Across Pages**
  - Add global reusable styles to `src/styles/globals.css` for elements such as body, headers, inputs, and buttons

- [ ] **Test the Layout and Styling**
  - Start the development server and navigate across pages to verify layouts and global styles.
  - Ensure navigation links in the dashboard layout work as expected.

### Completion Checklist:
- [ ] Root layout configured with basic metadata and structured layout.
- [ ] Auth layout set up for login/signup pages and styled.
- [ ] Dashboard layout implemented with navigation and user authentication check.
- [ ] Navigation links added to the dashboard layout.
- [ ] Global styles completed in `globals.css` for consistent design elements.
- [ ] All layouts and global styles verified in the browser.

## 7. Create Core Reusable UI Components

### Tasks:

- [ ] **Set Up Directory for UI Components**
  - Create a directory for reusable UI components:
    ```
    src/components/ui/
    ```
  - Store individual component files (e.g., `button.tsx`, `checkbox.tsx`, etc.) within this directory.

- [ ] **Add ShadCN Components**
  - Use ShadCN to generate essential UI components that integrate with TailwindCSS:
    ```bash
    npx shadcn add button checkbox dialog dropdown-menu
    ```
  - Verify that the generated components are added to the `src/components/ui/` directory.

- [ ] **Build and Verify Reusable Button Component**
  - Open the automatically generated `src/components/ui/button.tsx` file and confirm functionality.
  - Use the button in a sample page for verification

- [ ] **Build and Verify Checkbox Component**
  - Open `src/components/ui/checkbox.tsx` and confirm it is correctly implemented.
  - Use the checkbox in a sample form for testing

- [ ] **Build Text Input Component**
  - Create a new text input component at `src/components/ui/input.tsx`

  - Test the component in a sign-in form

- [ ] **Build Modal/Dialog Component**
  - Open the ShadCN-generated `src/components/ui/dialog.tsx` file and verify the implementation.
  - Test the dialog/modal in a sample page

- [ ] **Customize Component Styles**
  - Update custom classes in TailwindCSS or modify ShadCN-generated components as needed:
    - Example: Add hover effects to buttons or other elements.
    ```tsx
    export const Button = ({ className, ...props }: ButtonProps) => (
      <button
        className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded ${className}`}
        {...props}
      />
    );
    ```

- [ ] **Organize and Document Components**
  - Document the purpose and props of each component directly in the file using JSDoc

- [ ] **Write Unit Tests for Core Components**
  - Install libraries for unit testing

### Completion Checklist:
- [ ] Directory for UI components (`src/components/ui/`) created.
- [ ] ShadCN-generated components verified (e.g., button, checkbox, dialog).
- [ ] Text input component implemented and tested.
- [ ] Modal/dialog component verified with ShadCN.
- [ ] Basic tests for core components written (e.g., button test).
- [ ] Components organized and documented for ease of use.

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

### Completion Checklist:
- [ ] Authentication page (`src/app/auth/page.tsx`) implemented with email input and styled.
- [ ] Magic Link sign-in procedure integrated with Supabase.
- [ ] Middleware created to protect authenticated dashboard routes.
- [ ] Auth state management implemented globally using AuthContext.
- [ ] Authentication logic verified with test users.

## 9. Implement Habit Tracker Page

### Tasks:

- [ ] **Set Up Tracker Page Route**
  - Create a directory for the habit tracker page at:
    ```
    src/app/dashboard/tracker/
    ```
  - Add a `page.tsx` file to serve as the habit tracker interface

- [ ] **Style the Habit Tracker**
  - Add basic TailwindCSS styles to improve the UX:
    - Ensure each habit is displayed in a clean, easy-to-read list.
    - Style the checkbox to appear prominent for toggling completions.
    - Center the date picker prominently above the tracker list.

  - Modify the habit tracker list CSS

- [ ] **Add Date Picker for Navigation**
  - Ensure users can choose and view habits for specific dates.
  - Add navigation buttons for switching between days

- [ ] **Restrict Future Dates**
  - Only allow users to select past or current dates

- [ ] **Test Habit Completion Workflow**
  - Log in as a test user and:
    - Check a habit for a specific date.
    - Confirm the habit is marked as complete in the `habit_completion` table.
    - Uncheck the habit and confirm the data is removed from the database.

### Completion Checklist:
- [ ] Habit tracker page (`src/app/dashboard/tracker/page.tsx`) built.
- [ ] Date picker added to view and modify habits for specific dates.
- [ ] Restriction on future dates implemented.
- [ ] Habit list displays with checkboxes for completion toggling.
- [ ] Habit completions correctly logged in or removed from the database.
- [ ] Styling of the tracker page verified and refined.
- [ ] Workflow tested for marking, unmarking, and navigating dates.

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
  - Implement the `AuthProvider` that wraps the entire app in the layout, providing the logged-in user’s state to all child components.

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
  - Tailwind works with a mobile-first philosophy by default. However, ensure all components use responsiveness effectively by relying on Tailwind’s breakpoint utilities (`sm`, `md`, `lg`, etc.) for progressive enhancement.

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
  - Use TailwindCSS’s `text-lg` or `text-sm` classes to scale text sizes appropriately for smaller screens.
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
