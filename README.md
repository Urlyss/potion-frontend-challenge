This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Design Decisions

### Search Functionality
It's possible to search a trader by its name, its address and its Twitter/X handle. 

### Filter Implementation & URL State Management
- **URL-based Filter State**:
  - Filter parameters are synchronized with URL query parameters
  - Enables shareable filtered views
  - Preserves filter state on page refresh
  - Allows for browser back/forward navigation through filter history
  

### Responsive Filter UI Design
- **Adaptive Layout Strategy**:
  - Desktop: Modal-based filter interface
    - Better for larger screens where space isn't a constraint
    - Keeps all filter options visible at once
    - Overlay design maintains context of the main table view
  - Mobile: Full-screen drawer implementation
    - Optimized for touch interactions
    - Utilizes full screen width for better mobile UX
    - Easier to interact with small form controls
  - Smooth transitions between states using CSS transforms
  - Maintains consistent filter functionality across all devices

This approach combines the benefits of persistent state management through URLs with an optimized user interface for different device sizes, creating a seamless and intuitive filtering experience.

### Dual-View Trader Profile Implementation
- **Modal View**:
  - Quick access from the leaderboard table
  - Provides essential trader information without leaving the context
  - Ideal for quick lookups and comparisons
  - Triggered by clicking the action icon in the table row
  - Maintains user's position in the leaderboard page

- **Dedicated Page View**:
  - Full-screen experience at `/traders/[address]`
  - Enhanced navigation and interaction capabilities
  - Better suited for in-depth analysis
  - Shareable direct URL for specific trader profiles
  - Allows for future expandability (e.g., adding comments, following)

This hybrid approach offers:
- Flexibility in user navigation
- Context-appropriate information density
- Optimized user experience for different use cases
- Progressive disclosure of information
- Seamless transition between quick views and detailed analysis
