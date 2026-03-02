# Frontend Design Document: RetailMind AI

## Overview

The RetailMind AI frontend is a modern, responsive web application that provides retail managers, executives, and operations teams with real-time access to AI-powered business intelligence, recommendations, and automated action controls. Built using AWS Amplify with React, the frontend delivers an intuitive user experience for complex retail decision-making.

**Technology Stack:**
- **Framework**: React 18+ with TypeScript
- **Hosting**: AWS Amplify Hosting with CI/CD
- **State Management**: React Query + Zustand
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Data Visualization**: Recharts + D3.js
- **API Integration**: AWS Amplify API (REST + GraphQL)
- **Authentication**: Amazon Cognito via Amplify Auth
- **Real-time Updates**: AWS AppSync subscriptions

**Design Principles:**
- Mobile-first responsive design
- Accessibility compliant (WCAG 2.1 AA)
- Real-time data updates without page refresh
- Progressive disclosure of complex information
- Action-oriented interface with clear CTAs

## User Personas and Use Cases

### Persona 1: Store Manager (Primary User)
**Goals**: Monitor store performance, act on recommendations, manage inventory
**Key Features**: Dashboard, recommendations feed, inventory alerts, quick actions

### Persona 2: Business Executive (Secondary User)
**Goals**: Track KPIs, analyze trends, review automated actions
**Key Features**: Executive dashboard, analytics reports, performance metrics

### Persona 3: Operations Analyst (Power User)
**Goals**: Deep-dive analysis, configure automation rules, review AI decisions
**Key Features**: Advanced analytics, automation settings, audit logs, AI explainability


## Application Architecture

### Component Hierarchy

```
App
├── AuthProvider (Cognito)
├── ThemeProvider
├── QueryClientProvider (React Query)
└── Router
    ├── Layout
    │   ├── Header (Navigation, User Menu, Notifications)
    │   ├── Sidebar (Main Navigation)
    │   └── Main Content Area
    └── Routes
        ├── Dashboard (/)
        ├── Recommendations (/recommendations)
        ├── Inventory (/inventory)
        ├── Analytics (/analytics)
        ├── Automation (/automation)
        └── Settings (/settings)
```

### State Management Strategy

**Server State (React Query)**
- API data fetching and caching
- Real-time data synchronization
- Optimistic updates for user actions
- Background refetching

**Client State (Zustand)**
- UI state (sidebar open/closed, filters, preferences)
- User session data
- Notification queue
- Selected items and bulk actions

**Real-time State (AppSync Subscriptions)**
- New recommendations
- Inventory alerts
- Automated action status updates
- System notifications


## Page Designs and Features

### 1. Dashboard Page (/)

**Purpose**: Provide at-a-glance view of key metrics, recent recommendations, and critical alerts

**Layout Sections:**

**Top KPI Cards (4 cards in responsive grid)**
- Total Revenue (today/week comparison)
- Inventory Health Score (0-100 with color coding)
- Active Recommendations (count with urgency breakdown)
- Automation Success Rate (percentage with trend)

**Recommendations Feed (Center column)**
- Card-based layout showing latest AI recommendations
- Each card displays:
  - Recommendation title and description
  - Confidence score (visual progress bar)
  - Priority badge (Critical/High/Medium/Low)
  - Estimated impact (revenue/cost savings)
  - Quick action buttons (Accept/Dismiss/Details)
  - Timestamp and category icon
- Real-time updates via AppSync subscription
- Infinite scroll with pagination

**Alerts Panel (Right sidebar)**
- Low inventory warnings
- Price anomalies
- Failed automated actions
- System notifications
- Grouped by severity with color coding

**Quick Actions Bar (Bottom)**
- Manual inventory check
- Generate custom report
- View automation queue
- Chat with AI assistant


### 2. Recommendations Page (/recommendations)

**Purpose**: Comprehensive view and management of all AI-generated recommendations

**Features:**

**Filter and Search Bar**
- Filter by: Priority, Category, Date Range, Status, Confidence Score
- Search by keywords in recommendation text
- Saved filter presets
- Export filtered results

**Recommendations Table/Grid View Toggle**
- Table columns: Title, Category, Priority, Confidence, Impact, Created, Status, Actions
- Grid view: Card-based layout similar to dashboard
- Sortable columns
- Bulk actions (Accept multiple, Dismiss multiple)

**Recommendation Detail Modal**
- Full recommendation description
- AI reasoning explanation (why this recommendation was made)
- Supporting data visualization (charts showing trends)
- Historical context (similar past recommendations)
- Action buttons with confirmation dialogs
- Comments/notes section for team collaboration

**Recommendation Analytics Panel**
- Acceptance rate over time
- Impact tracking (actual vs. predicted)
- Category breakdown (pie chart)
- Confidence score distribution


### 3. Inventory Page (/inventory)

**Purpose**: Real-time inventory monitoring and management with AI-powered insights

**Features:**

**Inventory Overview Dashboard**
- Total SKUs tracked
- Items below reorder point (with drill-down)
- Overstock items (with cost impact)
- Stock turnover rate
- Predicted stockouts (next 7/30 days)

**Product Inventory Table**
- Columns: Product, SKU, Current Stock, Reserved, Available, Reorder Point, Status, Actions
- Color-coded status indicators (Critical/Low/Optimal/Overstock)
- Real-time stock updates
- Search and filter by category, brand, store
- Export to CSV/Excel

**Inventory Trends Chart**
- Time-series visualization of stock levels
- Overlay demand forecast
- Highlight reorder events
- Zoom and pan controls

**Reorder Queue Panel**
- Pending automated reorders
- Approval required items (high-value)
- Reorder history
- Supplier information
- One-click approve/reject

**AI Insights Sidebar**
- Demand forecast for selected product
- Optimal reorder quantity recommendation
- Seasonal trend analysis
- Competitor stock status (if available)


### 4. Analytics Page (/analytics)

**Purpose**: Deep-dive business intelligence with interactive visualizations

**Features:**

**Time Period Selector**
- Quick presets (Today, Week, Month, Quarter, Year, Custom)
- Date range picker
- Compare to previous period toggle

**Sales Analytics Section**
- Revenue trend line chart
- Sales by category (bar chart)
- Top performing products (table)
- Sales by store/region (map visualization)
- Average transaction value
- Conversion rate metrics

**Inventory Analytics Section**
- Stock turnover by category
- Stockout frequency analysis
- Overstock cost impact
- Reorder efficiency metrics
- Supplier performance scorecard

**AI Performance Metrics**
- Recommendation acceptance rate
- Prediction accuracy (demand forecast vs. actual)
- Automation success rate
- Cost savings from automated actions
- Time saved by automation

**Custom Report Builder**
- Drag-and-drop metric selection
- Custom date ranges and filters
- Save and schedule reports
- Export to PDF/Excel
- Share with team members

**Interactive Dashboards**
- Drill-down from summary to detail
- Click-through to related data
- Hover tooltips with additional context
- Responsive charts that adapt to screen size


### 5. Automation Page (/automation)

**Purpose**: Configure, monitor, and control automated business actions

**Features:**

**Automation Rules Manager**
- List of active automation rules
- Enable/disable toggle for each rule
- Edit rule parameters (thresholds, approval requirements)
- Create new automation rules
- Rule templates (inventory reorder, price adjustment, alert triggers)

**Automation Queue**
- Pending actions awaiting approval
- In-progress actions with status
- Completed actions (last 24 hours)
- Failed actions with error details
- Bulk approve/reject functionality

**Action History and Audit Log**
- Searchable table of all automated actions
- Columns: Action Type, Product/SKU, Timestamp, Status, Impact, User/System
- Filter by action type, status, date range
- Export audit log for compliance
- Detailed action view with full context

**Approval Workflows**
- Configure approval thresholds (e.g., orders >$10k require approval)
- Assign approvers by role
- Multi-level approval chains
- Approval notifications and reminders
- Mobile-friendly approval interface

**Automation Performance Dashboard**
- Actions executed (by type, over time)
- Success rate metrics
- Average execution time
- Cost savings calculation
- Error rate and common failure reasons

**AI Assistant Chat Interface**
- Natural language queries about automation
- "Why was this action taken?" explanations
- "What if" scenario testing
- Automation rule suggestions


### 6. Settings Page (/settings)

**Purpose**: User preferences, system configuration, and account management

**Sections:**

**User Profile**
- Personal information
- Role and permissions
- Notification preferences
- Language and timezone

**Notification Settings**
- Email notifications (on/off by category)
- SMS alerts configuration
- In-app notification preferences
- Notification frequency (real-time, digest, off)

**Integration Settings**
- Connected external tools status
- API key management
- Webhook configurations
- Data sync settings

**System Preferences**
- Default dashboard view
- Default time range for analytics
- Currency and units
- Theme (light/dark mode)

**Team Management** (Admin only)
- User list with roles
- Invite new users
- Manage permissions
- Activity logs


## UI Components Library

### Core Components

**RecommendationCard**
```typescript
interface RecommendationCardProps {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  category: string;
  estimatedImpact: {
    type: 'revenue' | 'cost_savings';
    amount: number;
  };
  timestamp: Date;
  onAccept: () => void;
  onDismiss: () => void;
  onViewDetails: () => void;
}
```

**KPICard**
```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  icon: ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow';
  onClick?: () => void;
}
```

**InventoryStatusBadge**
```typescript
interface InventoryStatusBadgeProps {
  status: 'critical' | 'low' | 'optimal' | 'overstock';
  currentStock: number;
  reorderPoint: number;
}
```

**ConfidenceScore**
```typescript
interface ConfidenceScoreProps {
  score: number; // 0-100
  size: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**ActionButton**
```typescript
interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
}
```


## API Integration

### REST API Endpoints (via API Gateway)

**Recommendations API**
```
GET    /api/recommendations              - List recommendations
GET    /api/recommendations/:id          - Get recommendation details
POST   /api/recommendations/:id/accept   - Accept recommendation
POST   /api/recommendations/:id/dismiss  - Dismiss recommendation
GET    /api/recommendations/stats        - Get recommendation statistics
```

**Inventory API**
```
GET    /api/inventory                    - List inventory items
GET    /api/inventory/:productId         - Get product inventory
GET    /api/inventory/alerts             - Get low stock alerts
POST   /api/inventory/reorder            - Trigger manual reorder
GET    /api/inventory/forecast/:productId - Get demand forecast
```

**Analytics API**
```
GET    /api/analytics/sales              - Get sales analytics
GET    /api/analytics/inventory          - Get inventory analytics
GET    /api/analytics/ai-performance     - Get AI metrics
POST   /api/analytics/reports            - Generate custom report
```

**Automation API**
```
GET    /api/automation/rules             - List automation rules
POST   /api/automation/rules             - Create automation rule
PUT    /api/automation/rules/:id         - Update automation rule
GET    /api/automation/queue             - Get pending actions
POST   /api/automation/approve/:id       - Approve action
GET    /api/automation/history           - Get action history
```

### GraphQL Schema (via AppSync)

```graphql
type Recommendation {
  id: ID!
  title: String!
  description: String!
  priority: Priority!
  confidence: Float!
  category: String!
  estimatedImpact: Impact!
  supportingData: AWSJSON
  status: RecommendationStatus!
  createdAt: AWSDateTime!
  expiresAt: AWSDateTime
}

type Subscription {
  onNewRecommendation: Recommendation
    @aws_subscribe(mutations: ["createRecommendation"])
  
  onInventoryAlert: InventoryAlert
    @aws_subscribe(mutations: ["createInventoryAlert"])
  
  onAutomationStatusUpdate(actionId: ID!): AutomationAction
    @aws_subscribe(mutations: ["updateAutomationAction"])
}
```


## Authentication and Authorization

### Amazon Cognito Integration

**User Pools Configuration**
- Email-based authentication
- Password requirements (min 8 chars, uppercase, lowercase, number, special char)
- MFA optional (SMS or TOTP)
- Password reset flow
- Email verification

**User Roles and Permissions**
```typescript
enum UserRole {
  STORE_MANAGER = 'store_manager',
  EXECUTIVE = 'executive',
  OPERATIONS_ANALYST = 'operations_analyst',
  ADMIN = 'admin'
}

interface Permissions {
  canViewDashboard: boolean;
  canViewRecommendations: boolean;
  canAcceptRecommendations: boolean;
  canViewInventory: boolean;
  canTriggerReorders: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageAutomation: boolean;
  canApproveActions: boolean;
  canManageUsers: boolean;
  canConfigureSystem: boolean;
}
```

**Role-Based Access Control**
- Store Manager: View all, accept recommendations, trigger reorders
- Executive: View all, export data, read-only automation
- Operations Analyst: Full access except user management
- Admin: Full access to all features

### Protected Routes

```typescript
<ProtectedRoute 
  path="/automation" 
  requiredPermission="canManageAutomation"
  fallback="/dashboard"
/>
```


## Real-time Features

### WebSocket Connections (AppSync)

**Subscription Management**
```typescript
// Subscribe to new recommendations
const { data, loading } = useSubscription(
  ON_NEW_RECOMMENDATION,
  {
    onSubscriptionData: ({ subscriptionData }) => {
      // Show toast notification
      // Update recommendations list
      // Play notification sound (if enabled)
    }
  }
);

// Subscribe to inventory alerts
const { data: alerts } = useSubscription(
  ON_INVENTORY_ALERT,
  {
    variables: { storeId: currentStore.id }
  }
);
```

**Real-time Updates Strategy**
- Optimistic UI updates for user actions
- Background refetch on window focus
- Automatic reconnection on connection loss
- Offline queue for actions (with sync on reconnect)

### Notification System

**Toast Notifications**
- New recommendation available
- Inventory alert triggered
- Automated action completed/failed
- User action confirmation
- Error messages

**Notification Center**
- Persistent notification history
- Mark as read/unread
- Filter by type
- Clear all functionality
- Badge count on header icon


## Responsive Design

### Breakpoints

```css
/* Mobile: 0-640px */
/* Tablet: 641-1024px */
/* Desktop: 1025px+ */
```

### Mobile Adaptations

**Dashboard (Mobile)**
- Stack KPI cards vertically
- Collapse sidebar to hamburger menu
- Recommendations as full-width cards
- Bottom navigation bar for quick actions
- Swipe gestures for card actions

**Tables (Mobile)**
- Convert to card-based layout
- Show essential columns only
- Expandable rows for details
- Horizontal scroll for wide tables
- Sticky headers

**Charts (Mobile)**
- Simplified visualizations
- Touch-friendly zoom/pan
- Rotate device prompt for complex charts
- Collapsible chart legends

### Tablet Adaptations
- Two-column layouts
- Collapsible sidebar
- Optimized touch targets (min 44x44px)
- Landscape-optimized dashboards


## Performance Optimization

### Code Splitting
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Analytics = lazy(() => import('./pages/Analytics'));
```

### Data Fetching Optimization
- React Query caching (5-minute stale time for analytics)
- Prefetch on hover for detail pages
- Infinite scroll with virtual scrolling for large lists
- Debounced search inputs (300ms)
- Request deduplication

### Image and Asset Optimization
- WebP format with fallbacks
- Lazy loading for images below fold
- CDN delivery via CloudFront
- Responsive images with srcset

### Bundle Optimization
- Tree shaking for unused code
- Dynamic imports for heavy libraries (D3.js, chart libraries)
- Compression (gzip/brotli)
- Target bundle size: <200KB initial, <500KB total

### Performance Metrics Targets
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1


## Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation**
- All interactive elements accessible via keyboard
- Visible focus indicators
- Skip to main content link
- Logical tab order
- Keyboard shortcuts for common actions

**Screen Reader Support**
- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content updates
- Alt text for all images
- Descriptive link text

**Visual Accessibility**
- Minimum contrast ratio 4.5:1 for text
- Resizable text up to 200%
- No information conveyed by color alone
- Focus indicators with 3:1 contrast
- Reduced motion support

**Form Accessibility**
- Associated labels for all inputs
- Error messages linked to fields
- Required field indicators
- Clear validation feedback
- Autocomplete attributes

### Accessibility Testing
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast validation


## Error Handling and Loading States

### Error Boundaries
```typescript
<ErrorBoundary 
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    // Log to CloudWatch
    logError(error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

### Loading States
- Skeleton screens for initial page loads
- Spinner for button actions
- Progress bars for long operations
- Shimmer effect for loading cards
- Optimistic UI updates

### Error States
- Inline error messages for form validation
- Toast notifications for action failures
- Full-page error for critical failures
- Retry buttons for failed requests
- Offline mode indicator

### Empty States
- Friendly illustrations
- Clear messaging
- Call-to-action buttons
- Helpful tips for new users


## Deployment and CI/CD

### AWS Amplify Hosting

**Build Configuration**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Environment Variables**
- VITE_API_ENDPOINT
- VITE_APPSYNC_ENDPOINT
- VITE_COGNITO_USER_POOL_ID
- VITE_COGNITO_CLIENT_ID
- VITE_REGION

**Branch Deployments**
- main → Production (retailmind.example.com)
- develop → Staging (staging.retailmind.example.com)
- feature/* → Preview URLs

### CI/CD Pipeline

**Pre-deployment Checks**
1. Lint (ESLint)
2. Type check (TypeScript)
3. Unit tests (Vitest)
4. Build verification
5. Accessibility tests (axe)

**Post-deployment**
1. Smoke tests
2. Performance monitoring
3. Error tracking (Sentry/CloudWatch)


## Design System and Branding

### Color Palette

**Primary Colors**
```css
--primary-50: #eff6ff;
--primary-500: #3b82f6;  /* Main brand color */
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;
```

**Semantic Colors**
```css
--success: #10b981;  /* Green for positive actions */
--warning: #f59e0b;  /* Amber for warnings */
--danger: #ef4444;   /* Red for critical/errors */
--info: #3b82f6;     /* Blue for information */
```

**Status Colors**
```css
--status-critical: #dc2626;
--status-high: #f97316;
--status-medium: #eab308;
--status-low: #22c55e;
```

### Typography

**Font Family**
- Primary: Inter (sans-serif)
- Monospace: JetBrains Mono (for code/data)

**Font Scales**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Component Styling Guidelines
- Border radius: 0.5rem (8px) for cards, 0.25rem (4px) for buttons
- Shadow: Subtle elevation for cards and modals
- Transitions: 150ms ease-in-out for interactive elements
- Focus rings: 2px solid primary color with offset


## Testing Strategy

### Unit Testing (Vitest + React Testing Library)

**Component Tests**
```typescript
describe('RecommendationCard', () => {
  it('displays recommendation details correctly', () => {
    render(<RecommendationCard {...mockRecommendation} />);
    expect(screen.getByText(mockRecommendation.title)).toBeInTheDocument();
  });

  it('calls onAccept when accept button is clicked', () => {
    const onAccept = vi.fn();
    render(<RecommendationCard {...mockRecommendation} onAccept={onAccept} />);
    fireEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalled();
  });
});
```

**Hook Tests**
```typescript
describe('useRecommendations', () => {
  it('fetches recommendations on mount', async () => {
    const { result } = renderHook(() => useRecommendations());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(5);
  });
});
```

### Integration Testing

**User Flow Tests**
- Login → View Dashboard → Accept Recommendation
- View Inventory → Trigger Reorder → Approve Action
- Create Automation Rule → Test Rule → View Results

### E2E Testing (Playwright)

**Critical Paths**
```typescript
test('user can accept a recommendation', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="recommendation-card-1"]');
  await page.click('button:has-text("Accept")');
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

### Visual Regression Testing
- Chromatic for component visual testing
- Screenshot comparison for critical pages
- Cross-browser testing (Chrome, Firefox, Safari)

### Performance Testing
- Lighthouse CI in pipeline
- Bundle size monitoring
- Core Web Vitals tracking


## Future Enhancements

### Phase 2 Features

**Mobile Native App**
- React Native app for iOS and Android
- Push notifications for critical alerts
- Offline mode with sync
- Biometric authentication

**Advanced AI Features**
- Natural language query interface ("Show me products with declining sales")
- Voice commands for hands-free operation
- Predictive search and autocomplete
- AI-powered data exploration

**Collaboration Features**
- Team comments on recommendations
- Shared dashboards and reports
- Activity feed showing team actions
- @mentions and notifications

**Advanced Analytics**
- Custom dashboard builder (drag-and-drop widgets)
- Cohort analysis
- Funnel visualization
- A/B test results tracking

**Internationalization**
- Multi-language support (i18n)
- Currency and date format localization
- RTL language support
- Regional compliance features

### Technical Improvements

**Progressive Web App (PWA)**
- Service worker for offline functionality
- Install prompt for desktop/mobile
- Background sync for actions
- Push notifications

**Advanced Caching**
- IndexedDB for offline data
- Service worker caching strategies
- Optimistic updates with rollback

**Enhanced Security**
- Content Security Policy (CSP)
- Subresource Integrity (SRI)
- Rate limiting on client side
- Session timeout warnings


## Project Structure

```
retailmind-frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── recommendations/
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── RecommendationList.tsx
│   │   │   └── RecommendationDetail.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── InventoryChart.tsx
│   │   │   └── ReorderQueue.tsx
│   │   ├── analytics/
│   │   │   ├── SalesChart.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── ReportBuilder.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Recommendations.tsx
│   │   ├── Inventory.tsx
│   │   ├── Analytics.tsx
│   │   ├── Automation.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useRecommendations.ts
│   │   ├── useInventory.ts
│   │   ├── useAuth.ts
│   │   └── useRealtime.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── websocket.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   ├── types/
│   │   ├── recommendation.ts
│   │   ├── inventory.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── amplify-config.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── amplify.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Implementation Checklist

- [ ] Set up React + TypeScript + Vite project
- [ ] Configure AWS Amplify (Auth, API, Hosting)
- [ ] Implement authentication with Cognito
- [ ] Create design system and component library
- [ ] Build Dashboard page with KPI cards
- [ ] Implement Recommendations page with real-time updates
- [ ] Build Inventory page with table and charts
- [ ] Create Analytics page with interactive visualizations
- [ ] Implement Automation page with rules and queue
- [ ] Add Settings page with user preferences
- [ ] Set up AppSync subscriptions for real-time data
- [ ] Implement responsive design for mobile/tablet
- [ ] Add accessibility features (ARIA, keyboard nav)
- [ ] Configure error handling and loading states
- [ ] Set up CI/CD pipeline with Amplify
- [ ] Write unit and integration tests
- [ ] Perform accessibility audit
- [ ] Optimize performance (code splitting, caching)
- [ ] Deploy to staging environment
- [ ] User acceptance testing
- [ ] Deploy to production

