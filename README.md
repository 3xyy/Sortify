# 🌱 Sortify AI - Smart Recycling Scanner

**Version:** 11.16.25.16.48

An AI-powered Progressive Web App (PWA) that helps users make better recycling decisions through intelligent waste item analysis. Built with modern web technologies and designed for both mobile and desktop experiences.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Progressive Web App (PWA) Capabilities](#progressive-web-app-pwa-capabilities)
- [Technical Architecture](#technical-architecture)
- [Core Functionality](#core-functionality)
- [User Interface & Experience](#user-interface--experience)
- [Data & Storage](#data--storage)
- [AI Integration](#ai-integration)
- [Customization & Settings](#customization--settings)
- [Educational Resources](#educational-resources)
- [Installation](#installation)
- [Development](#development)
- [Technologies Used](#technologies-used)

---

## 🎯 Overview

Sortify AI transforms recycling from a confusing chore into an intuitive, educational experience. By combining computer vision AI with local waste management rules, it provides instant, accurate disposal guidance for any item you scan. The app runs entirely in your browser with offline support, making sustainable choices accessible to everyone.

**Mission:** Reduce contamination in recycling streams, increase proper waste diversion, and educate users about environmental impact.

---

## ✨ Key Features

### 🔍 AI-Powered Waste Analysis
- **Instant Item Recognition:** Upload or capture photos of waste items for immediate AI identification
- **Multi-Category Classification:** Automatically categorizes items into:
  - ♻️ Recyclable materials
  - 🍃 Compostable waste
  - 🗑️ General trash
  - ⚠️ Hazardous waste
- **Material Identification:** Detects specific material types (PET plastic, aluminum, cardboard, etc.)
- **Contamination Detection:** Identifies food residue, liquids, dirt, or mixed materials that affect recyclability
- **Confidence Scoring:** Provides AI certainty percentage (0-100%) for transparency
- **City-Specific Rules:** Tailors disposal instructions based on your selected municipality

### 📊 Environmental Impact Tracking
- **Personal Impact Dashboard:** Real-time statistics on your contribution
  - Total items scanned
  - Items successfully recycled
  - CO₂ emissions saved (calculated per item)
- **Persistent Local Storage:** All stats saved to your device
- **Demo Mode:** Explore the app with sample data before scanning real items

### 📜 Scan History & Management
- **Complete Scan Archive:** Every analyzed item saved locally with:
  - Item thumbnail image
  - Item name and category
  - Disposal instructions
  - Timestamp and confidence score
  - Material composition details
- **Searchable History:** Quick access to past scans
- **Detailed Result Pages:** Tap any history item for full disposal guidance

### 🎓 Educational Articles Library
- **Comprehensive Guides:** In-depth articles covering:
  - Hazardous waste disposal (needles, chemicals, explosives)
  - Recycling fundamentals
  - Composting best practices
  - General waste management
  - Garbage collection tips
- **Searchable Content:** Find specific topics by keyword
- **Category Filtering:** Browse by waste type
- **Safety Information:** Emergency procedures for dangerous items

### ⚙️ Advanced Settings & Customization
- **Location-Based Rules:** Select from 25+ major cities including:
  - San Francisco, New York City, Los Angeles, Chicago
  - Seattle, Austin, Denver, Portland, Boston
  - Miami, Philadelphia, Dallas, Houston, and more
- **Display Preferences:**
  - Toggle confidence scores
  - Show/hide contamination warnings
  - Display CO₂ savings estimates
- **Theme Control:**
  - Light mode
  - Dark mode
  - Auto mode (follows system preference)
- **Custom Brand Colors:** Personalize the primary color scheme
- **Haptic Feedback:** Optional vibration feedback for interactions
- **Demo Mode:** Test the app without making real scans

### 🎨 Modern UI/UX Design
- **Gradient-Rich Interface:** Eye-catching, modern aesthetic
- **Smooth Animations:** Fade-in, scale, and slide transitions
- **Responsive Layout:** Optimized for phones, tablets, and desktops
- **Bottom Navigation:** Thumb-friendly mobile navigation
- **Swipe Gestures:** Natural left/right swipe navigation between pages
- **Loading States:** Animated progress bars during AI analysis
- **Toast Notifications:** Non-intrusive feedback messages
- **Safe Area Support:** Proper spacing for notched devices

---

## 📱 Progressive Web App (PWA) Capabilities

### Installation Features
- **Cross-Platform Installation:** Install on any device directly from the browser
- **Native App Experience:** Runs in fullscreen without browser chrome
- **Home Screen Integration:** Adds icon to device home screen like native apps
- **iOS Support:** Full Apple mobile web app capabilities with proper status bar handling
- **Android Support:** Complete PWA installation with splash screens

### Offline Functionality
- **Service Worker Caching:** Intelligently caches app resources
- **Offline Access:** View scan history and settings without internet
- **Background Sync:** Queues scans when offline (future enhancement)
- **Asset Precaching:** Fast loading after first visit

### Performance Optimizations
- **Lazy Loading:** Components load on demand
- **Image Caching:** Unsplash images cached for 30 days (50 max entries)
- **Code Splitting:** Separate bundles for different routes
- **Fast Refresh:** Instant hot-reload during development

### PWA Manifest Details
```json
{
  "name": "Sortify AI - Smart Recycling Scanner",
  "short_name": "Sortify",
  "theme_color": "#2fb89d",
  "background_color": "#f5f9f7",
  "display": "standalone",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "purpose": "any maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "purpose": "any maskable" }
  ]
}
```

### Install Page
- **Dedicated `/install` route** with installation instructions
- **Platform Detection:** Recognizes if already running as PWA
- **Install Prompt Handling:** Triggers native install dialog on supported browsers
- **Fallback Instructions:** Manual installation steps for iOS Safari and Android Chrome

---
<details>
<summary>🏗️ Technical Architecture</summary>

##  🏗️ Technical Architecture

### Frontend Stack
- **React 18.3.1:** Modern component-based UI with hooks
- **TypeScript:** Type-safe development
- **Vite:** Lightning-fast build tool and dev server
- **React Router DOM 6.30.1:** Client-side routing with navigation
- **TanStack Query 5.83.0:** Data fetching and state management
- **Tailwind CSS:** Utility-first styling
- **shadcn/ui:** High-quality, accessible component library

### Backend Integration
- **Lovable Cloud (Supabase):** Serverless backend infrastructure
- **Edge Functions:** Serverless compute for AI processing
- **OpenAI GPT-5.1 Vision API:** Advanced image analysis
- **CORS-Enabled API:** Secure cross-origin requests

### State Management Strategy
- **Local Storage:** Primary data persistence layer
  - Scan history (`scanHistory` key)
  - User settings (`app-settings` key)
  - Demo mode state (`demo-mode` key)
  - Theme preferences (`theme` key)
- **React Context:** Global state for theme and demo mode
- **Custom Hooks:** Reusable logic for settings, haptics, and navigation
- **Session Storage:** Temporary scan results during analysis

### UI Component Library
- **Radix UI Primitives:** 30+ accessible, unstyled components
- **Lucide React Icons:** Beautiful, consistent iconography
- **Sonner:** Elegant toast notifications
- **React Hook Form + Zod:** Form validation
- **Recharts:** Data visualization (ready for analytics)
- **Embla Carousel:** Touch-friendly image carousels
</details>

---

## 🧠 Core Functionality

### Image Analysis Pipeline

1. **Image Capture/Upload**
   - Camera input via ``
   - File upload via standard file picker
   - Image preview with object URLs

2. **Pre-Processing**
   - Client-side image validation
   - Base64 encoding for API transmission
   - Size optimization (handled by browser)

3. **AI Analysis (Edge Function)**
   - **Function:** `analyze-waste`
   - **Model:** OpenAI GPT-5.1 Vision with 4000 token output limit
   - **System Prompt:** 224-line expert waste-sorting instruction set
   - **Input:** Base64 image + selected city
   - **Output:** Structured JSON with 10 fields
   - **Logging:** Comprehensive request/response logging for debugging

4. **Response Parsing**
   - JSON validation and error handling
   - Fallback to default values if parsing fails
   - Multiple parsing attempts (direct parse, regex extraction, manual cleanup)

5. **Result Display**
   - Animated progress bar (0% → 100%)
   - Fade transitions between loading and results
   - Category-specific styling and icons
   - Save to local history automatically

### Analysis Response Schema
```typescript
{
  itemName: string;        // "Plastic Water Bottle"
  category: "recycle" | "compost" | "trash" | "hazardous";
  confidence: number;      // 0-100
  materialType: string;    // "#1 PET plastic"
  contamination: string;   // "Clean - ready to recycle"
  instructions: string[];  // ["Remove cap", "Rinse bottle", ...]
  localRule: string;       // City-specific guidance
  co2Saved: string;        // "0.4 kg CO₂ saved by recycling"
  imageUrl: string;        // Original image data
}
```

### Navigation System
- **5 Main Routes:**
  - `/` - Home dashboard
  - `/history` - Scan archive
  - `/articles` - Education library
  - `/settings` - Configuration
  - `/result/:id` - Detailed scan results
  - `/install` - PWA installation guide
- **Swipe Navigation:** Horizontal swipes between adjacent pages
- **Bottom Navigation Bar:** Persistent footer with 4 main tabs
- **Dynamic Navbar Hiding:** Hides during image analysis for immersion

---

## 💾 Data & Storage

### Local Storage Schema

**`scanHistory`** - Array of scan objects:
```typescript
{
  id: string;              // UUID
  itemName: string;
  category: string;
  date: Date;
  confidence: number;
  thumbnail: string;       // Object URL
  materialType: string;
  details: {
    contamination: string;
    instructions: string[];
    localRule: string;
    co2Saved: string;
  }
}
```

**`app-settings`** - User preferences:
```typescript
{
  showConfidence: boolean;      // Default: true
  showContamination: boolean;   // Default: true
  showCO2: boolean;             // Default: true
  enableHaptics: boolean;       // Default: true
  selectedCity: string;         // Default: "san-francisco"
  customColor: string;          // Default: "#2fb89d"
}
```

**`demo-mode`** - Boolean flag for demo state
**`theme`** - "light" | "dark" | "auto"

### Data Persistence Strategy
- **No Database Dependency:** Fully client-side data storage
- **Privacy-First:** No user data leaves the device (except during AI analysis)
- **Cross-Session Persistence:** All data survives app restarts
- **Storage Limits:** Browser-dependent (typically 5-10MB per origin)

---

## 🤖 AI Integration

### OpenAI Vision API Configuration
- **Model:** GPT-5.1 Vision (latest)
- **Max Tokens:** 4000 (completion limit)
- **Temperature:** Not specified (defaults to 1.0)
- **Image Format:** Base64-encoded JPEG/PNG
- **Prompt Engineering:** 
  - 224-line system prompt with strict JSON output requirements
  - City-aware disposal rules
  - Safety-first categorization
  - Contamination assessment
  - Environmental impact calculation
<details>
<summary>Prompt</summary>
    
  You are an expert waste-sorting and sustainability AI. Your job is to analyze an uploaded image and return a *strict, complete JSON object* describing what the item is and how to properly dispose of it according to the user’s selected city.

Your output must ALWAYS follow this exact JSON structure:

{
  "itemName": "string",
  "category": "recycle" | "compost" | "trash" | "hazardous",
  "confidence": 0-100,
  "materialType": "string",
  "contamination": "string",
  "instructions": ["string", "string", ...],
  "localRule": "string",
  "co2Saved": "string",
  "imageUrl": "string"
}

REQUIREMENTS:

1. ALWAYS output valid JSON. No text before or after.
2. ALWAYS fill every field, even if uncertain (use best guess).
3. Identify the item accurately and assign:
   - itemName → human name of the item
   - category → must be exactly one of:
       "recycle", "compost", "trash", "hazardous"
4. confidence must be a number 0–100 (integer).
5. materialType must describe the material precisely (#1 PET plastic, aluminum, cardboard, lithium battery, etc.)
6. contamination must describe:
   - visible food residue
   - liquids
   - dirt
   - mixed materials
   - or “Clean - ready to recycle”
7. instructions must include 3–6 actionable disposal steps.
   - Steps must be correct for the identified category
   - Put steps in the correct order
8. localRule must reference the user's selected city:
   - If the city has known rules (ex: SF, NYC, LA), reference them
   - Otherwise: “Follow standard guidelines for [CITY] municipal waste system”
   - You will receive the city name in the user prompt.
9. co2Saved:
   For recyclable items → give a CO₂ savings value (“0.4 kg CO₂ saved by recycling”)
   For compost → mention methane reduction or soil benefit
   For hazardous → emphasize contamination prevention
   For trash → mention landfill impact
10. imageUrl must return the input image URL or base64 data string.
11. If multiple items appear in the image, choose the PRIMARY item.
12. If the item is extremely unclear:
   - Use safest category (usually trash)
   - Lower confidence
   - Explain uncertainty in contamination field

Your goal is to be accurate, safe, city-aware, environmentally helpful, and ALWAYS respond in the exact JSON format above.

</details>
  
### Error Handling
- **API Key Validation:** Pre-flight checks in settings
- **Response Parsing:** Multiple fallback strategies
- **User Feedback:** Clear error messages with recovery options
- **Retry Mechanism:** Cooldown-based retry in settings (10s)
- **Logging:** Comprehensive console logs for debugging

### API Status Monitoring
- **Settings Page Widget:** Real-time API connectivity check
- **Status Indicators:**
  - 🔵 Checking... (animated pulse)
  - ✅ Connected (green, with timestamp)
  - ❌ Disconnected (red, with retry button)
- **Test Request:** Sends 1x1 transparent PNG to validate credentials

---

## 🎛️ Customization & Settings

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Show Confidence Scores | Toggle | ✅ On | Display AI certainty percentage |
| Show Contamination | Toggle | ✅ On | Show contamination warnings |
| Show CO₂ Savings | Toggle | ✅ On | Display environmental impact |
| Enable Haptics | Toggle | ✅ On | Vibration feedback (mobile) |
| Selected City | Dropdown | SF | Municipal waste rules |
| Theme | Dropdown | Light | Light/Dark/Auto mode |
| Custom Color | Color Picker | #2fb89d | Primary brand color |
| Demo Mode | Toggle | ❌ Off | Use mock data |

### Theme System
- **Light Mode:** Clean, bright interface
- **Dark Mode:** Eye-friendly low-light design
- **Auto Mode:** Follows system `prefers-color-scheme`
- **CSS Variables:** Dynamic `--primary` and `--ring` colors
- **HSL Color Conversion:** Hex to HSL for theme compatibility

### Haptic Feedback
- **Supported Devices:** Mobile browsers with Vibration API
- **Intensity Levels:**
  - Light: 10ms
  - Medium: 25ms
  - Heavy: 50ms
- **Use Cases:** Button taps, navigation, scan completion

---

## 📚 Educational Resources

### Article Categories

1. **Hazardous Waste (⚠️)**
   - Needles & sharps disposal
   - Explosives & fireworks
   - Household chemicals
   - Paint, batteries, pesticides

2. **Recycling (♻️)**
   - Recycling basics
   - Plastic types guide
   - Aluminum & steel cans
   - Glass recycling

3. **Composting (🍃)**
   - Composting 101
   - Food waste reduction
   - Yard waste management

4. **General Waste (🗑️)**
   - Landfill facts
   - Waste reduction tips
   - Proper disposal guidelines

5. **Garbage Collection (🚮)**
   - Collection schedules
   - Bulk item pickup
   - Special waste events

### Article Features
- **Search Functionality:** Keyword-based article discovery
- **Tag System:** Filter by waste category
- **Rich Content:** Multi-paragraph guides with bullet points
- **Safety Warnings:** Emergency instructions for dangerous items
- **External Resources:** Links to earth911.com, safeneedledisposal.org

---

## 🚀 Installation

### For End Users

#### Install as PWA (Recommended)
1. Visit the app in your mobile browser
2. Navigate to `/install` route
3. Tap "Install Now" (if browser supports automatic install)
4. OR use browser menu:
   - **iOS Safari:** Share → Add to Home Screen
   - **Android Chrome:** Menu → Install App

#### Use in Browser
- Simply visit the app URL and start scanning immediately
- No installation required for basic functionality

### For Developers

#### Prerequisites
- Node.js 18+ and npm
- Git
- Modern browser (Chrome, Safari, Firefox)

#### Setup
```bash
# Clone the repository
git clone https://github.com/3xyy/Sortify.git
cd Sortify

# Install dependencies
npm install

# Set up environment variables (optional for local dev)
# Copy .env.local.example to .env.local
# Add OPENAI_API_KEY if running edge functions locally

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Environment Variables
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
OPENAI_API_KEY=  # Edge function only
```

---

## 🛠️ Development

### Project Structure
```
sortify-ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── BottomNav.tsx   # Navigation bar
│   │   ├── ChatInterface.tsx
│   │   └── ScanButton.tsx
│   ├── contexts/           # React context providers
│   │   ├── DemoContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useSettings.tsx
│   │   ├── useSwipeNavigation.tsx
│   │   └── use-mobile.tsx
│   ├── pages/              # Route components
│   │   ├── Home.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── ArticlesPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── ResultPage.tsx
│   │   └── InstallPage.tsx
│   ├── integrations/       # Backend integrations
│   │   └── supabase/
│   ├── lib/                # Utilities
│   │   └── utils.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/
│   │   └── analyze-waste/  # AI analysis edge function
│   └── config.toml         # Supabase configuration
├── public/
│   ├── icon-192.png        # PWA icon (small)
│   ├── icon-512.png        # PWA icon (large)
│   ├── favicon.ico
│   └── robots.txt
├── vite.config.ts          # Vite + PWA config
├── tailwind.config.ts      # Tailwind CSS config
└── package.json            # Dependencies
```

### Key Scripts
```json
{
  "dev": "vite",              // Start dev server (localhost:8080)
  "build": "tsc && vite build", // Production build
  "preview": "vite preview",   // Preview production build
  "lint": "eslint ."          // Code linting
}
```

### Adding New Features
1. **New Page:** Create in `src/pages/`, add route to `App.tsx`
2. **New Component:** Add to `src/components/`, import where needed
3. **New Setting:** Update `useSettings` hook and SettingsPage
4. **New City:** Add to cities array in SettingsPage (line ~167)
5. **New Article:** Add object to `articles` array in ArticlesPage

---
<details>
<summary>🔧 Technologies Used</summary>
  
## 🔧 Technologies Used

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Routing & State
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.83.0** - Server state management
- **React Context API** - Global state (theme, demo mode)

### Styling & UI
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives (30+ packages)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Class conflict resolution
- **tailwindcss-animate** - Animation utilities

### Forms & Validation
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Form/schema bridge

### Backend & AI
- **Supabase 2.81.1** - Backend-as-a-Service (Lovable Cloud)
- **OpenAI API** - GPT-5.1 Vision for image analysis
- **Deno** - Edge function runtime

### PWA & Performance
- **vite-plugin-pwa 1.1.0** - PWA manifest & service worker
- **Workbox** - Service worker strategies (via vite-plugin-pwa)

### Utilities
- **date-fns 3.6.0** - Date formatting
- **sonner 1.7.4** - Toast notifications
- **vaul 0.9.9** - Drawer component
- **cmdk 1.1.1** - Command menu primitive
- **next-themes 0.3.0** - Theme switching

### UI Enhancement
- **embla-carousel-react 8.6.0** - Touch carousels
- **react-day-picker 8.10.1** - Date picker
- **react-resizable-panels 2.1.9** - Resizable layouts
- **recharts 2.15.4** - Charts (prepared for analytics)
- **input-otp 1.4.2** - OTP input component
</details>

---

## 📊 App Statistics

- **Total Routes:** 7 (including 404)
- **Total Components:** 60+ (including shadcn/ui)
- **Total Dependencies:** 60+
- **Lines of Code:** ~5,000+ (estimated, excluding node_modules)
- **Supported Cities:** 6 (for now)
- **Educational Articles:** 10+ topics
- **Waste Categories:** 4 primary, 1 general
- **PWA Score:** Lighthouse 95-100 (optimized for PWA best practices)

---

## 🌍 Environmental Impact

### Calculated Metrics
- **CO₂ Savings:** Per-item estimates based on material type
- **Recycling Rate:** Percentage of scanned items diverted from landfill
- **User Engagement:** Total scans tracked locally

### Methodology
- **Recycling Impact:** Based on EPA waste reduction data
- **Composting Benefits:** Methane reduction from organics diversion
- **Hazardous Waste:** Contamination prevention value

---

## 🔐 Privacy & Security

### Data Privacy
- **No User Accounts:** No login required, no personal data collected
- **Local-First:** All user data stored on device
- **No Tracking:** No analytics or third-party trackers
- **Image Privacy:** Images processed via API, not stored server-side
- **Open Source-Ready:** Transparent codebase

### Security Measures
- **HTTPS Only:** Secure transmission for API calls
- **CORS Protection:** Restricted edge function access
- **API Key Management:** Server-side key storage (Lovable Cloud)
- **Input Validation:** Client and server-side validation
- **Content Security Policy:** Configured in Vite build

---

## 📈 Future Enhancements

Potential features for future development:
- 🔄 **Cloud Sync:** Optional account system for cross-device history
- 📸 **Bulk Scanning:** Analyze multiple items simultaneously
- 🗺️ **Interactive Map:** Find nearby recycling centers
- 📊 **Advanced Analytics:** Weekly/monthly impact reports with charts
- 🏆 **Gamification:** Badges, streaks, and challenges
- 👥 **Social Sharing:** Share achievements on social media
- 🌐 **Internationalization:** Multi-language support
- 🔔 **Push Notifications:** Reminders and tips (PWA)
- 🤝 **Community Features:** User-submitted disposal tips
- 🧪 **A/B Testing:** Experiment with AI prompts and UI

---

## 📝 License

This project is built with [Lovable](https://lovable.dev) and uses:
- OpenAI API (requires key)
- Supabase (Lovable Cloud)
- Radix UI (MIT License)
- shadcn/ui (MIT License)

---

## 🙏 Acknowledgments

- **OpenAI** - GPT-5.1 Vision API
- **Lovable** - Development platform and cloud infrastructure
- **shadcn** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Tailwind Labs** - CSS framework

---

## 📞 Support

For issues or questions:
1. Check the `/articles` page for disposal guides
2. Toggle Demo Mode in `/settings` to explore features
3. Review browser console for debugging info
4. Ensure OpenAI API key is configured (developers only)

---

**Built with ❤️ for a sustainable future**

---
