# FOBOH Frontend

A Next.js 16 frontend application for managing pricing profiles, built with React 19, TypeScript, Tailwind CSS, and TanStack Query.

**Frontend runs on port 4000**  
**Backend runs on port 4001**

## Table of Contents

- [Getting Started](#getting-started)
- [Application Flow](#application-flow)
- [Architecture](#architecture)
- [Component Structure](#component-structure)
- [Pricing Calculation Logic](#pricing-calculation-logic)
- [State Management](#state-management)
- [Testing](#testing)
- [Deployment](#deployment)
- [Production Improvements](#production-improvements)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env.local` file):
```env
# Backend API base URL (dev)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4001
```

For **production on Vercel (frontend project env)** set:

```env
NEXT_PUBLIC_API_BASE_URL=https://foboh-backend-api.vercel.app
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4000`

### Available Scripts

- `npm run dev` - Start development server on port 4000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Application Flow

### First Screen: Pricing Profiles List

When you load the application, you land on the **Pricing Profiles** page (`/pricing`).

**What you see:**
- List of all existing pricing profiles
- Each profile shows:
  - Profile name
  - Adjustment type (Fixed $ or Dynamic %)
  - Adjustment value
  - Increment type (Increase + or Decrease -)
  - Created date

**Available Actions:**
- **"Setup a Profile"** button (top right) - Navigate to create new profile
- **"Edit"** button - Navigate to edit existing profile
- **"Delete"** button (red) - Delete a profile (with confirmation)

### Creating a Pricing Profile

Click **"Setup a Profile"** to navigate to `/pricing/setup`.

**Step 1: Basic Pricing Profile**
1. Enter profile name
2. Select pricing scope:
   - **One Product** - Select a single product
   - **Multiple Products** - Select multiple products
   - **All Products** - Apply to all products

**Step 2: Product Selection**
- Use search bar to find products
- Filter by SKU, Category, Segment, or Brand
- Select/deselect products using checkboxes
- Use "Select All" / "Deselect All" buttons

**Step 3: Pricing Controls**
- **Based on:** Global Wholesale Price (fixed)
- **Adjustment Mode:**
  - **Fixed ($)** - Add/subtract exact dollar amount
  - **Dynamic (%)** - Add/subtract percentage
- **Adjustment Value:** Enter the amount or percentage
- **Increment Mode:**
  - **Increase (+)** - Add to base price
  - **Decrease (-)** - Subtract from base price

**Real-time Preview:**
- As you adjust settings, the pricing table updates automatically
- Shows: Product name, SKU, Category, Base Price, Adjustment, New Price

**Step 4: Save Profile**
- Click **"Next"** button to save the profile
- Button is enabled when:
  - Profile name is entered
  - At least one product is selected
  - Valid adjustment value is entered

**What happens when you save:**
1. Frontend validates the form
2. Frontend sends request to backend
3. **Backend recalculates all prices** (authoritative)
4. Backend saves profile and pricing table
5. Frontend receives response with calculated prices
6. User is redirected to pricing profiles list

### Editing a Pricing Profile

Click **"Edit"** on any profile to navigate to `/pricing/profiles/[id]`.

**What you see:**
- Same interface as setup page
- Form pre-filled with existing profile data
- Products pre-selected based on profile
- Pricing table shows current calculated prices

**Editing:**
- Modify any field (name, products, adjustment settings)
- Preview updates in real-time
- Click **"Save"** to update profile
- Backend recalculates and saves new prices

### Which Button Saves the Pricing Profile?

- **Setup Page:** "Next" button (green, bottom right)
- **Edit Page:** "Save" button (green, bottom right)
- **Cancel/Back:** Returns to pricing profiles list

## Architecture

### Design Principles

This frontend follows **component-based architecture** with clear separation of concerns:

```
Page Component → Custom Hooks → Services → API Client
```

**Why this architecture?**

1. **Reusability** - Components can be reused across pages
2. **Testability** - Business logic is in hooks/services, easy to test
3. **Maintainability** - Clear separation makes code easy to understand
4. **Performance** - React optimizations work better with smaller components

### Folder Structure

```
app/
├── api/                    # API client layer
│   ├── client.ts          # Axios instance
│   ├── endpoints.ts        # Centralized endpoint definitions
│   ├── interfaces.ts       # TypeScript interfaces
│   ├── products.ts         # Product API functions
│   └── pricing-profiles.ts # Pricing profile API functions
├── pricing/               # Pricing feature pages
│   ├── page.tsx           # Pricing profiles list
│   ├── setup/
│   │   └── page.tsx       # Create pricing profile
│   ├── profiles/
│   │   └── [id]/
│   │       └── page.tsx   # Edit pricing profile
│   └── component-functions/ # Custom hooks for pricing pages
│       ├── usePricingForm.ts
│       ├── useProductFilters.ts
│       ├── useProductSelectionLogic.ts
│       ├── usePricingPreview.ts
│       ├── usePricingProfileSubmission.ts
│       └── useModalState.ts
├── components/            # Reusable UI components
│   ├── pricing/          # Pricing-specific components
│   │   ├── PricingTable.tsx
│   │   ├── ProductSearchFilters.tsx
│   │   ├── SearchResultsHeader.tsx
│   │   ├── ProductList.tsx
│   │   └── PricingControls.tsx
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── RadioGroup.tsx
│   │   └── Modal.tsx
│   └── layout/           # Layout components
│       ├── SidebarNav.tsx
│       ├── TopBar.tsx
│       └── SectionCard.tsx
├── hooks/                # Global custom hooks
│   ├── useProducts.ts
│   ├── usePricingProfile.ts
│   └── useReferenceData.ts
├── services/             # Business logic services
│   ├── pricingPreviewService.ts
│   └── pricingProfileService.ts
├── store/                # Zustand state management
│   ├── productStore.ts
│   └── ui-store.ts
└── utils/                # Utility functions
    ├── calculatePricePreview.ts  # Frontend calculation logic
    ├── pricingHelpers.ts
    └── cn.ts

```

## Component Structure

### Component Library Overview

This application uses a component-based architecture with reusable UI components. Each component is designed to be self-contained and reusable across different pages.

### Reusable Components

#### 1. **ProductSearchFilters** (`components/pricing/ProductSearchFilters.tsx`)

**Purpose:** Provides a unified search and filtering interface for products.

**Features:**
- Search input with icon for text-based product search
- Filter dropdowns for SKU, Category, Segment, and Brand
- Clear buttons (X icon) for each dropdown when a value is selected
- Loading spinner states for dropdowns during data fetching
- Responsive grid layout (5 columns on medium+ screens)

**Props:**
- Search input state and handlers
- Filter dropdown states and handlers
- Reference data (SKUs, categories, segments, brands)
- Loading state

**Used in:** Setup page (`/pricing/setup`), Edit page (`/pricing/profiles/[id]`)

**Why it exists:** Eliminates code duplication between setup and edit pages, provides consistent filtering UX.

---

#### 2. **SearchResultsHeader** (`components/pricing/SearchResultsHeader.tsx`)

**Purpose:** Displays search results summary and provides bulk selection controls.

**Features:**
- Shows total product count with proper pluralization
- Displays active filter badges (search query, SKU, category, segment, brand)
- "Select All" / "Deselect All" radio buttons for bulk operations
- Visual feedback for active filters

**Props:**
- Product count
- Active filter values
- Selection state (all/none/partial)
- Selection handlers

**Used in:** Setup page, Edit page

**Why it exists:** Provides consistent results display and bulk selection across pages.

---

#### 3. **ProductList** (`components/pricing/ProductList.tsx`)

**Purpose:** Renders a scrollable, selectable list of products.

**Features:**
- Scrollable container (max-height: 96)
- Product cards with checkbox selection
- Product image placeholder (amber gradient)
- Product name, SKU, and quantity display
- Loading state (spinner with message)
- Empty state (no products found)
- Selected count display with profile name

**Props:**
- Products array
- Loading state
- Selection handlers
- Selected count
- Profile name (for display)

**Used in:** Setup page, Edit page

**Why it exists:** Centralizes product list rendering logic, ensures consistent UI and behavior.

---

#### 4. **PricingControls** (`components/pricing/PricingControls.tsx`)

**Purpose:** Manages pricing adjustment configuration inputs.

**Features:**
- "Based on" dropdown (currently fixed to "Global Wholesale Price")
- Adjustment mode selection (Fixed $ / Dynamic %)
- Adjustment value input with:
  - Dynamic prefix ($ or % based on mode)
  - Number input with validation
  - Error message display
  - Visual error state (red border)
- Increment mode selection (Increase + / Decrease -)

**Props:**
- Adjustment mode state and handler
- Adjustment value state and handler
- Error message (for validation)
- Increment mode state and handler

**Used in:** Setup page, Edit page

**Why it exists:** Encapsulates all pricing control logic in one reusable component.

---

#### 5. **PricingTable** (`components/pricing/PricingTable.tsx`)

**Purpose:** Displays calculated pricing data in a table format.

**Features:**
- Responsive table layout
- Columns: Product, SKU, Category, Wholesale Price, Adjustment, New Price
- Formatted currency values
- Color-coded adjustments (green for increase, red for decrease)
- Empty state handling

**Props:**
- Pricing table data array

**Used in:** Setup page (preview), Edit page (preview), Profile list (after creation)

**Why it exists:** Provides consistent pricing table display across the application.

---

### Base UI Components

#### **Button** (`components/ui/Button.tsx`)
- Reusable button with variants (primary, secondary, ghost)
- Sizes (sm, md, lg)
- Proper cursor pointer styling
- Disabled states
- FOBOH brand green styling

#### **Input** (`components/ui/Input.tsx`)
- Text input with consistent styling
- Focus states
- Error states

#### **Select** (`components/ui/Select.tsx`)
- Dropdown select with custom arrow icon
- Styled options (white background, padding)
- Focus states
- Disabled states

#### **Checkbox** (`components/ui/Checkbox.tsx`)
- Custom checkbox styling
- Checked/unchecked states

#### **RadioGroup** (`components/ui/RadioGroup.tsx`)
- Radio button group component
- Consistent styling

#### **Modal** (`components/ui/Modal.tsx`)
- Reusable modal/dialog component
- Overlay and close functionality

---

### Layout Components

#### **SidebarNav** (`components/layout/SidebarNav.tsx`)
- Application sidebar navigation
- Active route highlighting
- Navigation links

#### **TopBar** (`components/layout/TopBar.tsx`)
- Top navigation bar
- User profile section
- Application branding

#### **SectionCard** (`components/layout/SectionCard.tsx`)
- Reusable card container for sections
- Consistent spacing and styling

### Custom Hooks

Business logic is extracted into custom hooks:

- **usePricingForm** - Manages form state (name, adjustment settings)
- **useProductFilters** - Manages search and filter state
- **useProductSelectionLogic** - Manages product selection
- **usePricingPreview** - Generates pricing table preview
- **usePricingProfileSubmission** - Handles form submission
- **useModalState** - Manages modal visibility

**Why hooks?** Keeps components clean, logic reusable, and easy to test.

## Pricing Calculation Logic

### Why Calculate on Both Frontend & Backend?

This is a **very normal real-world pattern** with clearly separated responsibilities:

#### Frontend Calculation = UX Preview

**Purpose:** Provide instant feedback to users

**When it runs:**
- User changes adjustment mode (Fixed ↔ Dynamic)
- User changes increment mode (Increase ↔ Decrease)
- User types adjustment value
- User selects/deselects products

**Benefits:**
- ✅ **Instant feedback** - No network delay
- ✅ **Better UX** - Users see results immediately
- ✅ **Reduced server load** - Preview calculations don't hit API
- ✅ **Offline capability** - Works even if API is slow

**Implementation:**
- Located in `utils/calculatePricePreview.ts`
- Pure functions (no side effects)
- Matches backend logic exactly

#### Backend Calculation = Source of Truth

**Purpose:** Authoritative validation and persistence

**When it runs:**
- When user clicks "Save" / "Next"
- When updating an existing profile
- When fetching a saved profile

**Benefits:**
- ✅ **Final validation** - Prevents invalid data
- ✅ **Security** - Prevents tampered requests
- ✅ **Data integrity** - Ensures consistency
- ✅ **Reusability** - Can be used by other UIs, reports, exports

**Implementation:**
- Located in backend `services/pricing-profile/calculateAdjustment.ts`
- Validates all edge cases
- Returns authoritative results

### The ONE Rule You Must Not Break

**The backend calculation must be authoritative.**

This means:
- Frontend result is **advisory** (for UX only)
- Backend result is **final** (what gets saved)
- If there's ever a mismatch: **Backend wins**
- UI updates to backend response after save

### How to Share Calculation Logic (Future Improvement)

Currently, calculation logic is duplicated in frontend and backend. For better maintainability, consider:

**Option 1: Shared Package**
- Create a `shared` package with calculation functions
- Import in both frontend and backend
- Ensures logic stays in sync

**Option 2: TypeScript Path Mapping**
- Use TypeScript path aliases to share code
- Both projects import from shared location

**Option 3: Monorepo**
- Use a monorepo (Turborepo, Nx)
- Share calculation logic as internal package

**Current approach (duplication) is fine for:**
- Small to medium projects
- When logic is simple
- When you want frontend/backend independence

## State Management

### Global State (Zustand)

**Product Store** (`store/productStore.ts`):
- Stores all products fetched from API
- Updated when filters change
- Used by components to display products

**Why Zustand?**
- Lightweight (smaller than Redux)
- Simple API
- Good TypeScript support
- No boilerplate

### Server State (TanStack Query)

**Used for:**
- Fetching pricing profiles
- Fetching reference data (brands, categories, etc.)
- Mutations (create, update, delete)

**Why TanStack Query?**
- Automatic caching
- Background refetching
- Optimistic updates
- Built-in loading/error states

### Local State (React useState)

**Used for:**
- Form inputs
- UI state (modals, dropdowns)
- Component-specific state

## Testing

### Running Tests

```bash
npm test
```

### What We Test

#### 1. **Calculation Logic** (`utils/calculatePricePreview.test.ts`)

**Edge Cases Tested:**
- ✅ Fixed increase with valid values
- ✅ Fixed decrease with valid values
- ✅ Dynamic increase with valid percentages
- ✅ Dynamic decrease with valid percentages
- ✅ Negative base price (should error)
- ✅ Negative adjustment value (should error)
- ✅ Percentage > 100% (should error)
- ✅ Fixed decrease > base price (should error)
- ✅ Percentage decrease > 100% (should error)
- ✅ Final price clamped to 0 (never negative)
- ✅ Prices rounded to 2 decimal places

**Why test these?**
- Calculations are critical business logic
- Edge cases can cause data corruption
- Users might enter invalid values
- Prevents negative prices in database

#### 2. **Component Tests**

- Form validation
- User interactions
- State updates
- API calls

#### 3. **Integration Tests**

- Full user flows
- API integration
- State synchronization

### Example Test

```typescript
describe('calculatePricePreview', () => {
  it('should prevent negative prices', () => {
    const result = calculatePricePreview({
      basePrice: 10,
      adjustmentType: 'fixed',
      adjustmentValue: 20,
      incrementType: 'decrease'
    });
    expect(result.newPrice).toBe(0); // Clamped, not -10
  });
});
```

## Deployment

### Vercel Deployment

This frontend is designed to deploy on Vercel:

1. **Connect GitHub repository** to Vercel
2. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL` - Backend API URL

3. **Build settings:**
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

4. **Deploy:**
   - Vercel automatically deploys on push to main
   - Preview deployments for pull requests

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

## Production Improvements

### 1. Reduce Prop Drilling with Global State

**Current Issue:**
- Components receive many props from parent pages (10+ props in some cases)
- State is managed in page-level hooks
- Props are passed down multiple component levels
- Makes components less reusable

**Improvement:**
- Move shared state to global Zustand store
- Components access state directly from store using hooks
- Reduces prop passing by 70-80%

**Benefits:**
- ✅ Cleaner component usage
- ✅ Less prop passing
- ✅ Easier to maintain
- ✅ Better performance (fewer re-renders)
- ✅ More reusable components

**Trade-off:**
- Need to manage store structure carefully
- Slightly more complex state management
- Need to ensure store is properly initialized

---

### 2. CDN for Image and Asset Management

**Current Issue:**
- Product images are placeholders (gradient backgrounds)
- No image optimization
- Assets served from Next.js server
- No lazy loading

**Improvement:**
- Use CDN (Cloudflare, AWS CloudFront, or Vercel Blob)
- Store product images on CDN
- Implement image optimization and lazy loading
- Use Next.js Image component with CDN URLs

**Benefits:**
- ✅ Faster image loading (CDN edge locations)
- ✅ Reduced server load
- ✅ Better caching
- ✅ Global CDN distribution
- ✅ Automatic image optimization

**Trade-off:**
- Additional infrastructure cost
- Need to sync images to CDN
- Slightly more complex deployment

---

### 3. Error Monitoring

Add error tracking:
- Sentry for frontend errors
- Log user actions for debugging
- Track API errors
- Monitor component errors
- Track performance metrics

---

### 4. Performance Optimization

- Add React.memo for expensive components
- Implement code splitting (route-based and component-based)
- Add image optimization (with CDN)
- Implement virtual scrolling for long product lists
- Use React.useMemo for expensive calculations
- Debounce search inputs (already implemented)
- Lazy load components

---

### 5. Accessibility

- Add ARIA labels to all interactive elements
- Keyboard navigation support
- Screen reader support
- Focus management
- Color contrast improvements
- Skip to content links

---

### 6. Testing

- Add E2E tests (Playwright, Cypress)
- Component unit tests
- Visual regression testing
- Performance testing
- Accessibility testing (axe-core)

---

### 7. SEO

- Add meta tags
- Implement Open Graph tags
- Add structured data (JSON-LD)
- Optimize page titles
- Add sitemap

---

### 8. Analytics

- Track user interactions
- Monitor API performance
- Track conversion rates
- A/B testing
- User flow analysis

---

### 9. Security

- Add CSRF protection
- Implement Content Security Policy
- Sanitize user inputs
- Rate limit API calls
- XSS protection

---

### 10. Internationalization

- Add i18n support (next-intl)
- Multi-language support
- Currency formatting
- Date/time localization
- RTL support

---

### 11. Offline Support

- Service worker for offline access
- Cache API responses
- Queue actions when offline
- Offline indicator

---

### 12. Shared Calculation Package

As mentioned in [Pricing Calculation Logic](#pricing-calculation-logic), consider:
- Creating shared package for calculations
- Using monorepo structure (Turborepo, Nx)
- Ensuring frontend/backend logic stays in sync
- Single source of truth for business logic

---

### 13. Component Architecture Improvements

**Current Component Issues:**
- Some components still receive many props
- State management could be more centralized

**Recommended Improvements:**

1. **Zudstand for Shared State**
   - Reduces prop drilling significantly

2. **Component Composition**
   - Break down large components further
   - Use compound component pattern where appropriate

3. **Performance Optimizations**
   - Memoize expensive components
   - Use React.useCallback for handlers
   - Implement virtual scrolling for ProductList

4. **Type Safety**
   - Stricter TypeScript types
   - Shared types between frontend/backend
   - Runtime type validation with Zod

## License

ISC

## Author

Godwin Obi
