# 1. Introduction

## 1.1 Product Vision  
The purpose of the minimalist habit-tracking progressive web application (PWA) is to deliver a simple, mobile-first solution for tracking daily habits with minimal friction and distraction. By focusing exclusively on the core functionalities—habit tracking and statistics—the app removes unnecessary complexities regularly found in habit-tracking tools. This ensures the experience is highly intuitive, lightweight, and approachable for users who value simplicity.

The app is designed as a Progressive Web App (PWA), making it installable directly on the user’s mobile home screen while working seamlessly across all devices and browsers. The PWA design prioritizes fast load times, smooth interactions, and offline-readiness (without complex service workers), while maintaining a consistent and distraction-free user interface on mobile and desktop devices.

Fundamentally, this app embraces a "less is more" philosophy—providing ease of use, efficiency, and a visually minimal interface to help users focus solely on building daily habits that improve their physical and mental well-being.

## 1.2 Goals  
### Core Goals:  
1. Minimalism and Frictionless Interaction  
Deliver a lightweight and elegant interface that allows users to check or review habits in seconds without unnecessary setup or options. No unnecessary customizations: a predefined list of curated habits fosters simplicity and clarity.  

2. Mobile-First Experience  
Optimized for mobile devices, offering responsive touch-first controls and interactions with a visual hierarchy designed for quick navigation and ease of use.  

3. Tracking with Focus on Current and Past Days  
Allow users to mark completed habits for the current day as well as navigate backward to edit past days. Forward-dated tracking is disabled to keep the user focused on their present or historical habits.  

4. Clear, Motivating Statistics  
Show users their progress over defined timeframes (weekly, monthly, annual) with simple visual metrics such as charts or bars, fostering motivation to maintain streaks and trends without overwhelming them with too much detail.  

5. Secure and Seamless Access  
Simplify account management and access through Supabase magic link authentication, entirely eliminating the need for usernames or passwords.  

6. Real-Time Data Syncing  
Enable secure, real-time synchronization of habit data across devices by leveraging Supabase’s backend, ensuring users can track habits consistently whether they are on mobile or desktop.  

7. Reliable Deployment and Performance  
Ensure reliability, fast load times, and smooth deployment with modern web frameworks like Next.js hosted on Vercel.  

## 1.3 Core Philosophy  
The application is powered by the following guiding principles, ensuring strong adherence to its minimalist and user-friendly foundation:  

1. Simplicity First  
Simpler tools are easier to use, less prone to cognitive overloading, and foster regular engagement. By capping the functionality at tracking, reviewing, and viewing metrics, the app avoids unnecessary bloat.  

2. Seamless User Access  
The app aims to remove all barriers to adoption by offering password-less authentication through Supabase magic links, eliminating the need to remember or manage account credentials.  

3. Distraction-Free Design  
Focus on a clean, uncluttered interface paired with a static color palette and sensible typography to ensure that the experience is calming and unobtrusive during everyday use.  

## 1.4 Scope  
The scope defines the specific boundaries of the app’s functionality and deliverables:  

### In-Scope:  
- Core Habit Tracking Workflow  
Users can track and mark pre-defined habits as completed for the current day.  
Users can navigate and edit completion data for past days only but not forward-dated days.  
All interactions will be touch-first and designed for mobile screens (fully responsive).  

- Predefined Habit List  
The app provides a static list of 12 habits, initialized globally for all users: Lifting, Meditate, Journal, Diet, Read, Jog, Swim, Tennis, Cold Plunge, Stretch, Breathwork, Surf.  

- Statistics and Metrics  
Users will get visual habit analytics showing completion rates across defined timeframes: weekly, monthly, and annual.  

- Authentication and Data Management  
All habit-tracking data will be securely stored in Supabase.  
Authentication will be carried out using Supabase Magic Links, allowing a minimal onboarding process.  

- Mobile-First PWA Implementation  
The app will work seamlessly on mobile devices while maintaining compatibility with desktop.  
Installability will mimic native apps via the PWA (Progressive Web App) specification.  

## 1.5 Differentiators  
The app distinguishes itself from existing solutions through its unique combination of features and design philosophy:  

1. Curated, Predefined Habits  
Unlike competitor habit-tracking apps, which often allow unlimited habit customization, this app simplifies the process with a thoughtfully curated list of habits aimed at covering physical and mental well-being.  

2. Mobile-First Simplicity  
By prioritizing mobile interactions and limiting unnecessary features, the app appeals to users who want a fast, no-fuss experience directly integrated into their mobile routine.  

3. No Overcomplication or Feature Bloat  
The app avoids complexity by adhering to a minimalist UI design and omitting features commonly found in other apps (e.g., reminders, gamification, or social tools).  

4. Effortless Authentication Process  
Password-free logins (via Supabase’s Magic Links) save time and reduce user frustration, ensuring that signing in is quick and easy across devices.  

5. Real-Time Syncing with Security  
Leveraging Supabase ensures both minimal latency and compliance with modern security standards for user data.  

6. Adoption Through Simplicity  
By avoiding noisy designs or frequent interruptions, the app gently integrates into the user’s daily life without feeling intrusive or demanding.  

## 2. Key Features  

## 2.1 Authentication  

### **Description**:  
Users will be able to sign up and log in to the app using **Supabase magic links**. This eliminates the need for passwords, providing a frictionless and secure onboarding experience.  

### **Key Requirements**:  
  1. Users enter their email on the authentication screen.  
  2. A unique one-time magic link is sent to the provided email.  
  3. Once the user clicks the magic link, they are authenticated and redirected to the main habit tracking screen.  
  4. Authentication should sync seamlessly across devices, allowing users to log in from their mobile or desktop browser.  

### **Notes on UX**:  
  - Email input should be simple and user-friendly (e.g., a single, central input box and submission button).  
  - If the email entered is invalid, provide a clear and simple error message.  
  - Add a confirmation message once the user has successfully submitted their email (e.g., “Check your email for a magic link to log in!”).  

## 2.2 Predefined Habit List  

### **Description**:  
The app will offer users a **static, predefined list of 12 habits** that cannot be customized or modified. This ensures simplicity and reduces decision fatigue. The focus is on habits promoting physical and mental health.  

### **Habit List**:  
  1. Lifting  
  2. Meditate  
  3. Journal  
  4. Diet  
  5. Read  
  6. Jog  
  7. Swim  
  8. Tennis  
  9. Cold Plunge  
  10. Stretch  
  11. Breathwork  
  12. Surf  

### **Key Requirements**:  
  1. Habits are displayed in a list as checkboxes that users can toggle for completion.  
  2. The list is static and consistent across all users; no additional habits can be added or removed.  
  3. Each habit represents potential daily activities that users can check off once completed.  

### **Notes on UX**:  
  - Each habit should clearly display its name with a corresponding checkbox for users to mark as complete.  
  - Completed habits must be visually distinct (e.g., a checked box with a strike-through or color change).  

## 2.3 Daily Habit Tracking Workflow  

### **Description**:  
Users can interact with their daily habits to mark them as completed or review/modify habits for previous days.  
Forward-dated tracking is disabled, reinforcing the philosophy of "focus on today and your historical consistency."  

### **Key Requirements**:  
  1. Users can mark habits as complete for the current day by tapping checkboxes.  
  2. Users can navigate to past dates to review and update their tracking.  
  3. Forward-dated dates are disabled, and users cannot mark habits for the future.  
  4. Data syncs automatically across devices after interactions, ensuring habits are saved in real-time.  

### **Notes on UX**:  
  - By default, the current date's habit list should be shown when the user opens the app.  
  - Navigation to past dates should be intuitive (e.g., a back arrow or date picker to select previous days).  
  - If the user attempts to interact with future dates, show a subtle message, such as “You can only track habits for today or past dates.”  

## 2.4 Statistics and Metrics

### **Description**:  
The app will provide users with a simple way to review how many times each specific habit was completed within a selected **week** or **month**. By offering clear counts for individual habits (e.g., “Meditated 5 times this week”), users can easily see their consistency over time without unnecessary visual comparisons or progress indicators.

### **Key Requirements**:  
  1. **Weekly View**:  
     - Users can select or toggle a week to see how many times each habit was completed during that specific week.  
     - Display the counts in a simple list format:  
       - Example:  
         - Meditate: 4  
         - Journal: 6  
         - Jog: 3  

  2. **Monthly View**:  
     - Users can select or toggle a month to see how many times each habit was completed during that specific month.  
     - Display the counts in a similar simple list format:  
       - Example:  
         - Meditate: 15  
         - Journal: 21  
         - Jog: 12  

  3. **Navigation Options**:  
     - Provide navigation options for users to toggle between different weeks (e.g., "Last Week," "Current Week") or months (e.g., “January 2025”).  

  4. **Real-Time Updates**:  
     - If users make changes to habits for past dates, the counts in the week or month views are updated immediately.  

### **Notes on UX**:  
  - The statistics screen should feature clear headers for “Weekly View” and “Monthly View.”  
  - The counts for individual habits should be displayed in a clean list format, similar to the habit tracking interface (e.g., one habit name per row). 

## 2.5 Mobile-First Design and Progressive Web App  

### **Description**:  
The app will be optimized for mobile-first usage, ensuring an intuitive design for small screens while maintaining compatibility across desktop browsers. Additionally, as a PWA, the app will be installable directly from the browser as a shortcut on the user’s mobile home screen.  

### **Key Requirements**:  
  1. Layout, touch gestures, and design components will be optimized for mobile screens first but scale appropriately for desktops.  
  2. Include a PWA install option to mimic the behavior of a native mobile app.  
  3. Ensure fast loading times with lightweight assets and minimal dependencies.  

### **Notes on UX**:  
  - App controls (e.g., checkboxes, navigation buttons) must be thumb-friendly, adhering to mobile-first design guidelines.  
  - Provide a consistent look and feel across devices to ensure familiarity for users switching between platforms.  

# 3. User Flows  

## 3.1 Authentication Flow  

### **1. Entry Point**:  
- User opens the app for the first time or after being logged out.  

### **2. Step-by-Step Flow**:  
1. The app displays the authentication screen with a single email input field and the text prompt: "Enter your email to log in or create an account."  
2. User enters their email and taps the "Send Magic Link" button.  
3. Upon submission:  
   - The button is disabled temporarily, and a confirmation message is displayed: "A magic link has been sent to your email. Click it to log in."  
   - If the email address is invalid, display an error: "Please enter a valid email address."  
4. User checks their email and clicks the provided magic link.  
5. Clicking the link redirects the user to the app, instantly logging them in and landing them on their **Daily Habit Tracker** screen.  

### **Error Flows**:  
- If the magic link has expired or is invalid, display an error message: "This link is no longer valid. Please request a new one."  

### **Post-Condition**:  
- Upon successful login, the user’s authentication session will persist until they explicitly log out.  

## 3.2 Habit Tracking Flow  

### **1. Entry Point**:  
- User lands on the Daily Habit Tracker screen after logging in.  

### **2. Step-by-Step Flow**:  
1. The app displays the **current day’s date** (e.g., “Thursday, January 16”) at the top of the screen.  
2. The screen shows all 12 predefined habits in a vertical list, each with an unchecked checkbox beside it.  
   - Habit names are legible, and unchecked habits are visually distinct (e.g., grayed out).  
3. User taps a habit checkbox to mark it as complete.  
   - Checkbox immediately fills (e.g., checkmark and color change).  
   - Habit completion data syncs to the Supabase backend in real-time.  
4. User optionally toggles completed habits back to incomplete by untapping the checkbox.  

### **Navigating to Past Days**:  
1. At the top of the screen, user sees a simple navigation interface (e.g., back arrow or date picker).  
2. User selects a previous date to view that day’s habits.  
   - Completed habits remain marked as they were on that date.  
   - User can edit or update habit statuses (e.g., check or uncheck a habit).  
3. Whenever a past date is edited, habit data syncs to Supabase and updates relevant statistics.  

### **Interaction with Future Days**:  
- If the user attempts to navigate to a future date, show a clear but friendly message: “You can’t track future habits. Check back tomorrow!”  
- Disable interactivity for all future-dated navigation or checkboxes.  

**Post-Condition**:  
- Habit tracking data is saved securely and synced across devices in real-time.  

## 3.3 Statistics View Flow

### **1. Entry Point**:  
- User taps the "Stats" button or menu item to access the statistics screen.

### **2. Step-by-Step Flow**:  
1. The Statistics screen opens to the **current week’s data** by default.  
   - At the top, it displays the week date range (e.g., “Jan 13 - Jan 19”).  
   - Below, it lists each habit with a count of how many times it was completed in that week.  
     - Format:  
       - Meditate: 3  
       - Journal: 6  
       - Jog: 2  
2. The user can toggle to a different week using navigation controls (e.g., back and forward buttons or a dropdown).  
   - Example UI:  
     - “This Week” (default)  
     - “Last Week”  

3. The user can switch to the **Monthly View** via a tab or button.  
   - Upon switching to Monthly View, the screen’s header updates to display the current month (e.g., “January 2025”).  
   - Similar to the Weekly View, the Monthly View lists habit counts for the entire month:  
     - Meditate: 14  
     - Journal: 25  
     - Jog: 11  

4. Navigation for months (e.g., forward/back buttons or a dropdown) allows users to view data for different months (e.g., “December 2024”).

## 3.4 PWA Installation Flow  

### **1. Entry Point**:  
- User accesses the app via their browser and notices a prompt encouraging them to install the app on their phone.  

### **2. Step-by-Step Flow**:  
1. The app displays an install prompt (e.g., “Add Habit Tracker to your Home Screen for quick access!”).  
2. User taps the "Install" button in the prompt, beginning the PWA installation process.  
3. The app is installed on the user’s device as a shortcut that looks and behaves like a native app.  

### **Post-Condition**:  
- The app is now available on the user’s home screen for easy re-access without requiring the browser.  

# 4. Screens  

## 4.1 Authentication Screen  

### **UI Elements**:  
- **Header**:  
  - Simple, centered text: “Welcome!” or “Sign In to Get Started.”  
  - Subtext: “Enter your email to log in or sign up.”  

- **Input Field**:  
  - Single email input box titled “Email Address.”  
  - Clearly labeled with placeholder text: “example@email.com.”  
  - Inline error message below the input field to handle invalid email entry (e.g., “Please enter a valid email address.”).  

- **Button**:  
  - A prominent button labeled “Send Magic Link.”  
  - Default state: Active and styled using Tailwind with a prominent color (e.g., light blue).  
  - Disabled state: Grayed out with a loading spinner when the link is being sent.  

- **Confirmation Text**:  
  - Once the link is sent, display: “Check your email for the magic link to log in.”  

### **UX Interactions**:  
- After user submits the email, prevent further input by disabling the input field and button until an error occurs or confirmation expires.  
- If an invalid email is entered and submitted, show the error instantly without requiring page reload.  

## 4.2 Daily Habit Tracker Screen  

### **UI Elements**:  
- **Header**:  
  - Today’s date prominently displayed at the top of the screen.  
  - Format: "Thursday, January 16.”  

- **Habit List**:  
  - A vertical list containing 12 habits, each rendered with:  
    - A checkbox for marking habit completion.  
    - Habit name beside the checkbox (e.g., “Meditate,” “Lifting”).  

- **Checkbox States**:  
  - Default: Empty with a neutral background.  
  - Completed: A filled checkbox with distinct styling (e.g., checkmark icon with a green highlight).  

- **Navigation Controls**:  
  - Back arrow or calendar icon for navigating to past dates.  
  - Disabled forward navigation button (if any).  

### **UX Interactions**:  
- Tapping a checkbox toggles its status instantly (completed or incomplete).  
- Navigation to past days re-renders the same habit list with the stored completion data for the relevant date.  
- Attempting to navigate to future dates should trigger a brief message displayed inline: "You can’t track habits for future days.”  

## 4.3 Statistics Screen

### **UI Elements**:  
- **Header**:  
  - Display selected timeframe (Week or Month).  
    - Example formats:  
      - **Week View**: “Jan 13 - Jan 19”  
      - **Month View**: “January 2025”  

- **List Format**:  
  - Column-like list with each habit and its respective completion count for the selected time period:
    - **Example (Weekly View)**:  
      Meditate: 4  
      Journal: 6  
      Jog: 2  

    - **Example (Monthly View)**:  
      Meditate: 14  
      Journal: 25  
      Jog: 11  

- **Navigation Controls**:  
  - Buttons or dropdowns for switching weeks or months to view historical data:  
    - Back and forward buttons for navigation (e.g., “Previous Week,” “Next Week”).  
    - A dropdown or calendar icon to allow manual selection of a specific week or month.

### **UX Interactions**:  
- **Default View**:  
  - The screen opens to **Weekly View** by default, showing the current week's habit counts.  
- **Smooth Navigation**:  
  - Switching between weeks or months updates the displayed data immediately.  
- **Live Updates**:  
  - If the user makes changes to habits for past dates (navigated via the main habit tracker), the stats view reflects those edits in real-time.

## 4.4 PWA Installation Prompt  

### **UI Elements**:  
- **Prompt Message**:  
  - “Add Habit Tracker to your Home Screen for faster access!”  
  - Text displayed in a small card fixed near the top or bottom of the app interface.  

- **Install Button**:  
  - A button labeled “Install” with a neutral secondary dismiss option (“Not Now”).  

### **UX Interactions**:  
- If the user taps “Install,” proceed with the PWA installation process, transitioning away from the app screen momentarily to allow the browser/system workflow to handle the action.  
- After successful installation, hide the install prompt completely.  
- If the user dismisses the prompt, delay re-showing the prompt for several subsequent uses of the app.  

# 5. Tech Stack  

## 5.1 Overview  

1. **Frontend Framework**:  
   - **Next.js**:  
     - A React-based web development framework to handle server-side rendering (SSR), static site generation (SSG), and seamless routing.  
     - Ensures fast performance with optimized page loads and a robust developer experience.  
     - Perfect for building a Progressive Web App (PWA) with mobile-first design in mind.  

2. **Design Libraries**:  
   - **ShadCN**:  
     - Provides preconfigured components with built-in support for Radix primitives and Tailwind CSS.  
     - Encourages consistent, accessible, and modern design that aligns with the app’s minimalist philosophy.
   - **Radix UI**:  
     - A library of React components with a focus on accessibility and low-level primitives, ensuring seamless integration with other design systems.  
   - **Tailwind CSS**:  
     - A utility-first, customizable CSS framework for rapid, responsive styling.  
     - Enables consistent design and layouts while maintaining low CSS bundle sizes.  

3. **Database and Authentication**:  
   - **Supabase**:  
     - Serves as the backend for both authentication and data management.  
     - Features include:  
       1. **Magic Link Authentication**: Passwordless login to simplify and secure user access.  
       2. **Real-Time Syncing**: Database-driven syncing of user habit data across devices.  
       3. **Postgres Database**: Fully managed relational database for secure and scalable storage of user habits and historical records.  

4. **Hosting and Deployment**:  
   - **Vercel**:  
     - Optimized hosting for Next.js projects, offering effortless deployment and global CDN for fast load times.  
     - PWA-specific optimizations and support for dynamic content delivery.  

5. **Version Control and Collaboration**:  
   - **GitHub**:  
     - Repository hosting and version control for managing the app’s codebase.  
     - Enable efficient collaboration among developers and support continuous integration workflows.  
