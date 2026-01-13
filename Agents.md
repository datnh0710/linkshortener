# Link Shortener Project - Agent Instructions

## Project Overview

This is a Next.js 16 link shortener application using the App Router, TypeScript, Drizzle ORM with Neon PostgreSQL, Clerk authentication, and shadcn/ui components with Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **UI Components**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: Lucide React
- **Package Manager**: npm

## Project Structure

```
/app                  # Next.js App Router pages and layouts
/db                   # Database schema and configuration
  - schema.ts         # Drizzle schema definitions
  - index.ts          # Database connection
/lib                  # Utility functions
  - utils.ts          # cn() helper and shared utilities
/components           # React components
  /ui                 # shadcn/ui components
/public               # Static assets
/docs                 # Documentation
```

## Coding Standards

### TypeScript

1. **Strict Mode**: Always maintain strict TypeScript settings
   - Use explicit types for function parameters and return values
   - Avoid `any` type; use `unknown` if type is uncertain
   - Enable all strict compiler options

2. **Type Definitions**
   ```typescript
   // ✅ Good
   interface UserData {
     id: string;
     email: string;
     createdAt: Date;
   }
   
   function createUser(data: UserData): Promise<User> {
     // ...
   }
   
   // ❌ Bad
   function createUser(data: any) {
     // ...
   }
   ```

3. **Import Aliases**: Use `@/` alias for absolute imports
   ```typescript
   // ✅ Good
   import { cn } from "@/lib/utils";
   import { Button } from "@/components/ui/button";
   
   // ❌ Bad
   import { cn } from "../../lib/utils";
   ```

### React & Next.js

1. **Server Components by Default**: All components are Server Components unless 'use client' is specified
   ```typescript
   // Server Component (default)
   export default function Page() {
     return <div>...</div>;
   }
   
   // Client Component (when needed)
   'use client';
   export default function InteractiveComponent() {
     return <div>...</div>;
   }
   ```

2. **Async Server Components**: Leverage async/await in Server Components
   ```typescript
   export default async function Page() {
     const data = await fetchData();
     return <div>{data.title}</div>;
   }
   ```

3. **Component Naming**: Use PascalCase for component files and functions
   - Files: `UserProfile.tsx`, `LinkCard.tsx`
   - Functions: `function UserProfile()`, `function LinkCard()`

4. **Props Typing**: Always type component props
   ```typescript
   interface ButtonProps {
     variant?: 'default' | 'outline' | 'ghost';
     size?: 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   
   export function Button({ variant = 'default', size = 'md', children }: ButtonProps) {
     // ...
   }
   ```

5. **Metadata**: Define metadata for SEO in layouts and pages
   ```typescript
   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   ```

### Database (Drizzle ORM)

1. **Schema Definition**: Define all tables in `/db/schema.ts`
   ```typescript
   import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
   
   export const links = pgTable('links', {
     id: serial('id').primaryKey(),
     shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
     originalUrl: varchar('original_url', { length: 2048 }).notNull(),
     createdAt: timestamp('created_at').defaultNow().notNull(),
   });
   ```

2. **Database Connection**: Use connection pooling from `/db/index.ts`
   ```typescript
   import { drizzle } from 'drizzle-orm/neon-http';
   import { neon } from '@neondatabase/serverless';
   
   const sql = neon(process.env.DATABASE_URL!);
   export const db = drizzle(sql);
   ```

3. **Queries**: Use Drizzle's type-safe query builder
   ```typescript
   import { db } from '@/db';
   import { links } from '@/db/schema';
   import { eq } from 'drizzle-orm';
   
   // Select
   const link = await db.select().from(links).where(eq(links.shortCode, code));
   
   // Insert
   await db.insert(links).values({ shortCode: 'abc123', originalUrl: 'https://...' });
   
   // Update
   await db.update(links).set({ clicks: 10 }).where(eq(links.id, 1));
   ```

4. **Migrations**: Run migrations with Drizzle Kit
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

### Authentication (Clerk)

1. **Server-Side Auth**: Use `auth()` in Server Components and Server Actions
   ```typescript
   import { auth } from '@clerk/nextjs/server';
   
   export default async function Page() {
     const { userId } = await auth();
     if (!userId) {
       redirect('/sign-in');
     }
     // ...
   }
   ```

2. **Client-Side Auth**: Use Clerk hooks in Client Components
   ```typescript
   'use client';
   import { useUser } from '@clerk/nextjs';
   
   export default function Profile() {
     const { user, isLoaded } = useUser();
     // ...
   }
   ```

3. **Protected Routes**: Wrap protected pages with Clerk middleware in `middleware.ts`

### Styling (Tailwind CSS)

1. **Utility-First**: Use Tailwind utility classes directly in JSX
   ```typescript
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
   ```

2. **cn() Helper**: Use `cn()` from `lib/utils.ts` for conditional classes
   ```typescript
   import { cn } from '@/lib/utils';
   
   <button className={cn(
     "px-4 py-2 rounded-md",
     variant === 'primary' && "bg-blue-500 text-white",
     variant === 'secondary' && "bg-gray-200 text-gray-900"
   )}>
   ```

3. **CSS Variables**: Use CSS custom properties defined in `globals.css`
   ```css
   /* Reference theme colors */
   <div className="bg-background text-foreground">
   ```

4. **Dark Mode**: Support dark mode with `dark:` prefix
   ```typescript
   <div className="bg-white dark:bg-black text-black dark:text-white">
   ```

5. **Responsive Design**: Use responsive prefixes (`sm:`, `md:`, `lg:`)
   ```typescript
   <div className="flex flex-col sm:flex-row gap-4">
   ```

### shadcn/ui Components

1. **Installation**: Install components via CLI
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   ```

2. **Component Location**: All UI components go in `/components/ui/`

3. **Customization**: Modify components in place; they're your code
   ```typescript
   // components/ui/button.tsx
   import { cn } from "@/lib/utils"
   
   export function Button({ className, ...props }) {
     return <button className={cn("base-styles", className)} {...props} />
   }
   ```

4. **Variants**: Use `class-variance-authority` for component variants
   ```typescript
   import { cva } from "class-variance-authority";
   
   const buttonVariants = cva(
     "inline-flex items-center justify-center",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground",
           outline: "border border-input bg-background",
         },
       },
     }
   );
   ```

### Environment Variables

1. **Location**: Store in `.env.local` (not committed)
   ```bash
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

2. **Public Variables**: Prefix with `NEXT_PUBLIC_` for client-side access

3. **Type Safety**: Add to `next-env.d.ts` if needed

### Error Handling

1. **Try-Catch**: Wrap async operations in try-catch blocks
   ```typescript
   try {
     await db.insert(links).values(data);
   } catch (error) {
     console.error('Failed to create link:', error);
     throw new Error('Failed to create link');
   }
   ```

2. **Error Boundaries**: Use Next.js error.tsx for error handling
   ```typescript
   // app/error.tsx
   'use client';
   
   export default function Error({ error, reset }: {
     error: Error & { digest?: string };
     reset: () => void;
   }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={() => reset()}>Try again</button>
       </div>
     );
   }
   ```

3. **Loading States**: Use loading.tsx for suspense fallbacks

### Server Actions

1. **File Convention**: Create in separate files or inline with 'use server'
   ```typescript
   'use server';
   
   export async function createLink(formData: FormData) {
     const url = formData.get('url') as string;
     // ... validation and database operations
     revalidatePath('/dashboard');
     redirect('/dashboard');
   }
   ```

2. **Validation**: Always validate input data
   ```typescript
   'use server';
   
   import { z } from 'zod';
   
   const schema = z.object({
     url: z.string().url(),
   });
   
   export async function createLink(data: unknown) {
     const validated = schema.parse(data);
     // ... proceed with validated data
   }
   ```

3. **Revalidation**: Use `revalidatePath()` or `revalidateTag()` after mutations

### Code Organization

1. **Single Responsibility**: Each function/component should do one thing well

2. **File Size**: Keep files under 300 lines; split if larger

3. **Naming Conventions**:
   - Components: PascalCase (`UserProfile.tsx`)
   - Functions: camelCase (`getUserData()`)
   - Constants: UPPER_SNAKE_CASE (`MAX_URL_LENGTH`)
   - Types/Interfaces: PascalCase (`interface UserData`)

4. **Exports**: Prefer named exports for utilities, default for pages/components
   ```typescript
   // utils
   export function formatDate(date: Date) { }
   
   // components
   export default function Page() { }
   ```

### Performance

1. **Image Optimization**: Use Next.js Image component
   ```typescript
   import Image from 'next/image';
   
   <Image src="/logo.png" alt="Logo" width={200} height={50} />
   ```

2. **Font Optimization**: Use next/font
   ```typescript
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```

3. **Code Splitting**: Use dynamic imports for heavy components
   ```typescript
   import dynamic from 'next/dynamic';
   
   const Chart = dynamic(() => import('@/components/Chart'), {
     loading: () => <p>Loading...</p>,
   });
   ```

4. **Memoization**: Use React.memo, useMemo, useCallback appropriately

### Testing

1. **Write Tests**: Add tests for critical business logic

2. **Test Files**: Co-locate with `*.test.ts` or `*.spec.ts` suffix

### Git Workflow

1. **Commit Messages**: Use conventional commits
   ```
   feat: add link creation form
   fix: resolve database connection issue
   docs: update README
   ```

2. **Branch Naming**: Use descriptive names
   - `feature/short-link-generator`
   - `fix/auth-redirect`
   - `refactor/database-queries`

### Documentation

1. **JSDoc Comments**: Document complex functions
   ```typescript
   /**
    * Generates a unique short code for URL shortening
    * @param length - Length of the short code (default: 6)
    * @returns A unique alphanumeric code
    */
   export function generateShortCode(length: number = 6): string {
     // ...
   }
   ```

2. **README Updates**: Keep README.md current with setup instructions

3. **Code Comments**: Explain "why", not "what"

## Common Patterns

### Form Handling with Server Actions

```typescript
// app/create/page.tsx
export default function CreatePage() {
  return (
    <form action={createLinkAction}>
      <input name="url" type="url" required />
      <button type="submit">Create</button>
    </form>
  );
}

// actions/link.ts
'use server';

export async function createLinkAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  const url = formData.get('url') as string;
  const shortCode = generateShortCode();
  
  await db.insert(links).values({
    userId,
    shortCode,
    originalUrl: url,
  });
  
  redirect(`/links/${shortCode}`);
}
```

### Data Fetching in Server Components

```typescript
// app/dashboard/page.tsx
import { db } from '@/db';
import { links } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export default async function Dashboard() {
  const { userId } = await auth();
  
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));
  
  return (
    <div>
      {userLinks.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
```

### Responsive Layout with Tailwind

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {items.map(item => (
    <Card key={item.id} className="p-6">
      {/* Card content */}
    </Card>
  ))}
</div>
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Authentication**: Always verify user identity before mutations
3. **Input Validation**: Validate and sanitize all user inputs
4. **SQL Injection**: Use Drizzle's parameterized queries (automatic)
5. **XSS Prevention**: React escapes by default, but be cautious with `dangerouslySetInnerHTML`
6. **CSRF Protection**: Next.js Server Actions have built-in protection

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Database Changes**:
   - Update `db/schema.ts`
   - Generate migration: `npx drizzle-kit generate`
   - Apply migration: `npx drizzle-kit migrate`
3. **Adding UI Components**: `npx shadcn@latest add [component-name]`
4. **Linting**: `npm run lint`
5. **Build**: `npm run build`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: January 2026

When working on this project, always prioritize:
1. Type safety
2. Server Components first
3. Database query optimization
4. User authentication & authorization
5. Clean, maintainable code