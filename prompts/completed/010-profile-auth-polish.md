<objective>
Polish the Profile page and authentication screens to be beautiful and trustworthy.
Auth screens are the first impression. Profile is personal and should feel premium.
</objective>

<context>
Tennis team app with Bold Athletic design direction.
Auth: Sign in, Sign up, Forgot password (Microsoft SSO primary).
Profile: User info, settings, team level, preferences.

@app/(auth)/sign-in/page.tsx - Sign in page
@app/(auth)/sign-up/page.tsx - Sign up page
@app/(auth)/forgot-password/page.tsx - Password reset
@app/(auth)/layout.tsx - Auth layout
@app/(dashboard)/profile/page.tsx - Profile page
@components/auth/MicrosoftSignInButton.tsx - SSO button
@components/auth/CompleteProfileDialog.tsx - Profile completion
@lib/design-tokens.ts - Design tokens
</context>

<design_principles>
Premium auth/profile experience:
1. TRUSTWORTHY - Professional, secure feeling
2. SIMPLE - Minimal fields, clear flow
3. BRANDED - Rose-Hulman identity present
4. PERSONAL - Profile feels like "your space"
5. ACCESSIBLE - Works for everyone
</design_principles>

<requirements>
1. AUTH LAYOUT:
   - Centered card on brand-colored or gradient background
   - Logo prominently displayed
   - Minimal, focused design
   - Mobile: Full-width card, no background distractions

2. SIGN IN PAGE:
   - Microsoft SSO button (primary, prominent)
   - Divider "or"
   - Email/password form (secondary option)
   - Forgot password link
   - Sign up link
   - Loading states during auth

3. MICROSOFT SSO BUTTON:
   - Official Microsoft styling
   - Clear label "Sign in with Microsoft"
   - Loading state
   - Error handling

4. PROFILE PAGE:
   - Hero section: Large avatar, name, role badge
   - Edit profile action
   - Info cards: Team info, contact, preferences
   - Stats section: Events attended, response rate
   - Danger zone: Sign out, account actions
   - Mobile-first stacked layout

5. PROFILE EDITING:
   - Inline editing or modal
   - Avatar upload (optional)
   - First/last name
   - Team level selection
   - Notification preferences

6. COMPLETE PROFILE DIALOG:
   - Welcoming message
   - Required fields highlighted
   - Progress indicator
   - Skip option if non-essential fields
</requirements>

<implementation>
Redesign auth and profile components:
- Use new atomic components
- Consistent spacing and typography
- Framer Motion for transitions
- Form validation with react-hook-form
- Error handling UI
</implementation>

<output>
Modify:
- `./app/(auth)/sign-in/page.tsx`
- `./app/(auth)/sign-up/page.tsx`
- `./app/(auth)/forgot-password/page.tsx`
- `./app/(auth)/layout.tsx`
- `./app/(dashboard)/profile/page.tsx`
- `./components/auth/MicrosoftSignInButton.tsx`
- `./components/auth/CompleteProfileDialog.tsx`
</output>

<examples>
```tsx
// Auth layout with gradient
<div className="min-h-screen bg-gradient-to-br from-maroon-600 to-maroon-900 flex items-center justify-center p-4">
  <Card className="w-full max-w-md">
    <CardHeader className="text-center">
      <Logo className="mx-auto mb-4" />
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Sign in to Rose-Hulman Tennis</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
</div>

// Profile hero
<div className="bg-gradient-to-r from-maroon-600 to-maroon-800 text-white p-6 rounded-xl">
  <div className="flex items-center gap-4">
    <Avatar size="2xl">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
    <div>
      <h1 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h1>
      <Badge variant="primary" style="soft">{profile.role}</Badge>
    </div>
  </div>
</div>
```
</examples>

<verification>
Before declaring complete:
- Auth pages load fast and look professional
- Forms have proper validation feedback
- SSO button matches Microsoft guidelines
- Profile page is personalized and warm
- Mobile layout works perfectly
- Logout flow is clear
</verification>
