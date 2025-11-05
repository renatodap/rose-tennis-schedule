# Architecture Documentation

## Overview

Rose-Hulman Tennis Schedule is a Progressive Web Application (PWA) built for managing tennis team schedules, availability, events, and communications. The application follows a modern, mobile-first approach with server-side rendering and real-time data synchronization.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router with React Server Components)
- **Language**: TypeScript 5.x (strict mode)
- **UI Framework**: React 18.2
- **Styling**: Tailwind CSS 3.3 + shadcn/ui component library
- **State Management**: React Hooks + Context API
- **Forms**: react-hook-form with Zod validation
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Date/Time**: date-fns + date-fns-tz (America/Indiana/Indianapolis)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (avatars, attachments)
- **Email**: Resend API
- **Push Notifications**: Web Push API + Supabase Edge Functions

### Deployment
- **Hosting**: Vercel (Edge Network)
- **Database**: Supabase Cloud
- **CI/CD**: Vercel Git Integration
- **Environment**: Node.js 20.x

## Architecture Patterns

### 1. Feature-Based Organization

```
/app                      # Next.js App Router (routes)
├── (auth)/              # Public authentication pages
└── (dashboard)/         # Protected application pages

/lib                     # Shared business logic
├── services/           # Business logic layer (NEW)
├── hooks/              # React hooks for data & state
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants & enums (NEW)
└── contexts/           # React context providers (NEW)

/components             # React components
├── ui/                 # Base UI components (shadcn/ui)
├── shared/             # Shared composite components (NEW)
└── [feature]/          # Feature-specific components
```

### 2. Separation of Concerns

#### **Presentation Layer** (`/components`)
- Pure React components focused on UI rendering
- Minimal business logic
- Receives data and callbacks via props
- Uses hooks for local UI state only

#### **Business Logic Layer** (`/lib/services`)
- Pure TypeScript functions for business rules
- Schedule conflict detection
- Form validation logic
- Date/time calculations
- Data transformations

#### **Data Access Layer** (`/lib/hooks`)
- Custom React hooks for data fetching
- Supabase client integration
- Real-time subscriptions
- Optimistic updates
- Cache invalidation

#### **Application State** (`/lib/contexts`)
- Global state management via Context API
- User authentication state
- Current quarter selection
- Theme preferences
- Toast notifications

### 3. Mobile-First Responsive Design

#### **Breakpoint Strategy**
```tsx
// Tailwind breakpoints (mobile-first)
xs: 320px   // Small phones
sm: 640px   // Large phones
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

#### **Navigation Pattern**
- **Mobile**: Bottom tab navigation (5 primary routes) + hamburger menu
- **Tablet/Desktop**: Left sidebar navigation (persistent)
- **Responsive**: `lg:` prefix for desktop-only styles

#### **Touch Optimization**
- Minimum touch target: 44x44px (iOS guidelines)
- Active state feedback on all interactive elements
- No hover-dependent interactions
- Swipe gestures for common actions
- Pull-to-refresh on data lists

### 4. Data Flow

```
User Action
    ↓
React Component
    ↓
Custom Hook (useEventManagement, useClassSchedule, etc.)
    ↓
Service Layer (business logic validation)
    ↓
Supabase Client (data persistence)
    ↓
Database (PostgreSQL with RLS)
    ↓
Real-time Subscription Update
    ↓
Hook Re-fetch
    ↓
Component Re-render
```

### 5. Error Handling Strategy

#### **Levels of Error Handling**

1. **Component Level**: Try/catch in event handlers
2. **Hook Level**: Return error state + error message
3. **Boundary Level**: Error Boundary components for graceful degradation
4. **Global Level**: Toast notifications for user feedback

#### **Error Types**
- **Validation Errors**: Inline form feedback (react-hook-form + Zod)
- **Network Errors**: Toast notification with retry option
- **Authorization Errors**: Redirect to login
- **Server Errors**: Error boundary with contact support message

### 6. Security Model

#### **Authentication Flow**
1. User signs in → Supabase Auth creates JWT
2. JWT stored in httpOnly cookie
3. Middleware validates session on every request
4. Expired sessions redirect to login

#### **Authorization**
- **Row Level Security (RLS)**: Database-level permissions
- **Role-Based Access**: Coach, Captain, Member roles
- **Team-Level Isolation**: Users only see their team data
- **Gender-Based Filtering**: Forms/events filtered by gender

#### **Data Privacy**
- Profile visibility controls
- Phone number opt-in
- Email preferences
- FERPA compliance considerations

## Key Design Decisions

### ADR-001: App Router vs Pages Router
**Decision**: Use Next.js App Router
**Rationale**:
- Server Components reduce client bundle size
- Nested layouts improve code reuse
- Native TypeScript support
- Better data fetching patterns
- Future-proof (recommended by Next.js team)

### ADR-002: Supabase vs Custom Backend
**Decision**: Use Supabase
**Rationale**:
- Integrated auth + database + storage
- Row Level Security at database level
- Real-time subscriptions built-in
- Automatic API generation
- PostgreSQL reliability

### ADR-003: Tailwind CSS vs CSS-in-JS
**Decision**: Use Tailwind CSS + shadcn/ui
**Rationale**:
- Utility-first for rapid development
- Excellent mobile responsive utilities
- Smaller bundle size vs CSS-in-JS
- shadcn/ui provides accessible base components
- Easy to customize with Rose-Hulman branding

### ADR-004: Context API vs Redux/Zustand
**Decision**: Use Context API for global state
**Rationale**:
- Simple use cases (auth, theme, quarter)
- No need for complex state logic
- Avoid additional dependencies
- React Server Components compatible
- Most state is server-fetched via hooks

### ADR-005: Monolithic vs Micro-Frontend
**Decision**: Monolithic Next.js application
**Rationale**:
- Small team size
- Single deployment pipeline
- Shared component library
- No cross-app communication complexity

## Performance Optimization

### Server-Side Rendering
- Initial page load rendered on server
- Reduced Time to First Byte (TTFB)
- SEO-friendly (though app is authenticated)

### Code Splitting
- Automatic route-based splitting
- Dynamic imports for large components
- Lazy loading for modals/dialogs

### Database Optimization
- Indexed columns: user_id, team_id, timestamps
- Filtered queries at database level (RLS)
- Pagination for large lists
- Efficient joins (minimize N+1 queries)

### Client-Side Caching
- SWR pattern in custom hooks
- Optimistic updates for better UX
- Stale-while-revalidate strategy

### Asset Optimization
- Next.js Image component (automatic optimization)
- SVG icons for scalability
- Lazy loading images below fold

## Testing Strategy (To Be Implemented)

### Unit Tests
- Pure utility functions (`lib/utils/`)
- Business logic services (`lib/services/`)
- React hooks (React Testing Library)

### Integration Tests
- Component interactions
- Form submissions
- API route handlers

### E2E Tests
- Critical user flows (Playwright/Cypress)
- Mobile viewport testing
- Cross-browser testing

### Visual Regression Tests
- Component screenshot comparisons
- Mobile responsiveness validation

## Deployment Architecture

```
GitHub Repository (main branch)
    ↓
Vercel Build Pipeline
    ↓
Next.js Build + Type Check
    ↓
Deploy to Edge Network
    ↓
Production URL (rose-tennis-schedule.vercel.app)

Environment Variables (Vercel)
    ↓
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
```

## Database Schema

### Core Tables

#### `profiles`
- User profile information
- Links to auth.users (Supabase Auth)
- Stores: name, email, phone, avatar_url, role, team_level, gender

#### `class_schedule`
- User class schedules
- Recurring weekly patterns
- Used for availability detection

#### `blockers`
- Temporary unavailability (exams, conflicts)
- One-time or recurring patterns

#### `events`
- Team events (practices, meetings, socials)
- RSVP tracking
- Ride-share coordination

#### `matches`
- Tennis match schedule
- Imported from ITA schedule
- Result tracking

#### `challenges`
- Ladder challenge system
- Match scheduling
- Score reporting

#### `forms`
- Dynamic form builder
- Question templates
- Conditional display logic

#### `form_responses`
- User responses to forms
- JSON structure for flexibility

### Relationship Patterns
- **User → Profile**: 1:1 (profiles.id = auth.users.id)
- **User → Class Schedule**: 1:N (many classes per user)
- **User → Events**: N:M (many users RSVP to many events)
- **User → Challenges**: 1:N (user can issue multiple challenges)

## Coding Standards

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Avoid `any` type (use `unknown` if needed)
- Use type imports: `import type { User } from '@/lib/types'`

### React
- Functional components only (no class components)
- Custom hooks for reusable logic
- Props destructuring in function signature
- Explicit children type: `{ children: React.ReactNode }`

### Naming Conventions
- **Files**: kebab-case (`user-details-dialog.tsx`)
- **Components**: PascalCase (`UserDetailsDialog`)
- **Hooks**: camelCase with `use` prefix (`useEventManagement`)
- **Constants**: SCREAMING_SNAKE_CASE (`BRAND_COLORS`)
- **Variables**: camelCase (`userName`)

### Component Structure
```tsx
// 1. Imports
import { useState } from 'react';
import type { User } from '@/lib/types';

// 2. Types
interface Props {
  user: User;
  onSave: (user: User) => void;
}

// 3. Component
export function UserDetailsDialog({ user, onSave }: Props) {
  // 4. Hooks
  const [isEditing, setIsEditing] = useState(false);

  // 5. Event handlers
  const handleSave = () => {
    // ...
  };

  // 6. Render
  return (
    <div>{/* ... */}</div>
  );
}
```

## Accessibility Guidelines

- **Semantic HTML**: Use correct HTML elements
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Management**: Visible focus indicators
- **ARIA Labels**: Screen reader support
- **Color Contrast**: WCAG AA compliance (4.5:1 minimum)
- **Form Labels**: Explicit label associations
- **Error Messages**: Announced to screen readers

## Future Considerations

### Scalability
- Move to feature-based folder structure if app grows significantly
- Consider state management library (Zustand) if Context becomes complex
- Implement caching layer (Redis) for frequently accessed data

### Internationalization
- i18n support for multiple languages
- Timezone handling for non-Indiana users
- Date/time format preferences

### Analytics
- User behavior tracking
- Performance monitoring (Web Vitals)
- Error tracking (Sentry)

### Progressive Enhancement
- Offline support (Service Worker)
- Background sync for form submissions
- Install prompt for PWA

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
