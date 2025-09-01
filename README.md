# Wedding Website - JK & JH

A beautiful wedding invitation website built with React, TypeScript, and Vite. Features interactive maps with multi-platform navigation integration, background music, and modern UI components.

## ✨ Features

### 🗺️ Interactive Map & Navigation

- **Naver Maps Integration**: Interactive map with custom marker showing wedding venue
- **Multi-Platform Navigation**: Deep linking support for Kakao Map, T Map, and Naver Map
  - Smart mobile device detection with app/web fallback
  - Error handling for platform restrictions (T Map mobile-only)
- **Address Copy**: One-click address copying to clipboard

### 🎵 User Experience

- **Background Music Player**: Auto-play wedding music with volume controls
- **Toast Notifications**: Real-time feedback using Sonner
- **Modern UI**: Built with shadcn/ui components and TailwindCSS
- **Responsive Design**: Optimized for desktop and mobile devices

### 🚀 Technical Features

- **PWA Support**: Installable with offline capabilities and auto-updates
- **SEO Optimized**: Meta tags for social media sharing
- **TypeScript**: Full type safety throughout the application

## 👨‍💻 Author

**finn.kim**

- Email: [thefinnkim@gmail.com](mailto:thefinnkim@gmail.com)
- GitHub: [@finnkm](https://github.com/finnkm)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/finnkm/jk-jh.git
   cd jk-jh
   npm install
   ```

2. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values (see [Environment Variables](#-environment-variables) below)

3. **Get Naver Map API Key**
   - Visit [Naver Cloud Platform](https://www.ncloud.com/)
   - Create account and enable Maps API
   - Generate Client ID for Web Dynamic Map
   - Add to `VITE_NAVER_MAP_CLIENT_ID` in `.env`

### Development

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to GitHub Pages
```

## 🔧 Environment Variables

All variables must be prefixed with `VITE_`:

| Variable                   | Required | Description                                        |
| -------------------------- | -------- | -------------------------------------------------- |
| `VITE_NAVER_MAP_CLIENT_ID` | ✅       | Naver Maps API Client ID for map rendering         |
| `VITE_ADDRESS`             | ✅       | Full address for clipboard copy feature            |
| `VITE_LATITUDE`            | ✅       | Latitude coordinate for map center and navigation  |
| `VITE_LONGITUDE`           | ✅       | Longitude coordinate for map center and navigation |
| `VITE_LOCATION_NAME`       | ✅       | Location name displayed in navigation apps         |
| `VITE_SITE_TITLE`          | ✅       | Website title (HTML title and meta tags)           |
| `VITE_SITE_DESCRIPTION`    | ✅       | Website description (SEO meta tags)                |
| `VITE_SITE_URL`            | ✅       | Full website URL (Open Graph tags)                 |

## 📱 Navigation Integration

### Supported Apps

| Platform         | Mobile | Desktop | Notes                               |
| ---------------- | ------ | ------- | ----------------------------------- |
| **Kakao Map** 🚗 | ✅     | ✅      | Car navigation                      |
| **T Map** 🚙     | ✅     | ❌      | Mobile only, shows error on desktop |
| **Naver Map** 🗺️ | ✅     | ✅      | Public transport navigation         |

### How It Works

1. **Mobile Detection**: Automatically detects device type
2. **App Launch**: Attempts to open native app via URL scheme
3. **Web Fallback**: Falls back to web version after 2s timeout
4. **Error Handling**: Shows appropriate messages for unsupported scenarios

## 📁 Project Structure

```
src/
├── components/
│   ├── MusicPlayer.tsx         # Background music with controls
│   ├── NaverMap.tsx           # Map with navigation drawer
│   ├── sections/
│   │   └── LocationSection.tsx # Location information
│   └── ui/                    # shadcn/ui components
├── hooks/
│   ├── useAutoPlay.ts         # Music auto-play logic
│   ├── useAutoVersionCheck.ts # PWA auto-update
│   └── useNavigation.ts       # Navigation integration
├── assets/                    # Icons and media files
├── lib/
│   └── utils.ts              # Utility functions
└── App.tsx                   # Main application
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 7
- **Styling**: TailwindCSS 3.4 + shadcn/ui + Radix UI
- **Map**: Naver Maps API
- **Audio**: React Audio Player
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PWA**: Workbox
- **Utils**: date-fns

## 🧩 Key Hooks

### `useNavigation`

Handles multi-platform navigation integration:

```typescript
const { openKakaoNavi, openTMapNavi, openNaverMap } = useNavigation({
  latitude: 37.515287,
  longitude: 127.102981,
  name: "결혼식 장소",
});
```

**Features**: Mobile detection, URL scheme generation, web fallback, error handling

### `useAutoPlay` & `useAutoVersionCheck`

- **useAutoPlay**: Background music with user interaction detection
- **useAutoVersionCheck**: PWA auto-update with version checking

## 📦 Deployment

Configured for GitHub Pages:

1. Update `base` path in `vite.config.ts`
2. Set `VITE_SITE_URL` in `.env`
3. Run `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All environment variables must be prefixed with `VITE_` to be accessible in the frontend:

**Required Variables:**

- `VITE_NAVER_MAP_CLIENT_ID`: Naver Maps API Client ID (required for map rendering)
- `VITE_ADDRESS`: Full address that will be copied to clipboard when using address copy feature
- `VITE_LATITUDE`: Latitude coordinate for map center and navigation destination
- `VITE_LONGITUDE`: Longitude coordinate for map center and navigation destination
- `VITE_LOCATION_NAME`: Location name that will be displayed in navigation apps

**Optional Variables:**

- `VITE_SITE_TITLE`: Website title (used in HTML title tag and meta tags)
- `VITE_SITE_DESCRIPTION`: Website description (used in SEO meta tags)
- `VITE_SITE_URL`: Full website URL (used in Open Graph tags for social media sharing)

### PWA Features

The app includes Progressive Web App capabilities:

- Service Worker for caching
- Auto-update functionality
- Offline support
- Installable on mobile devices

## 🎵 Features

- **Interactive Map**: Location with marker using Naver Maps
- **Background Music**: Automatic music playback with controls
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Support**: Installable and works offline
- **Auto-Updates**: Automatically updates when new versions are deployed
- **SEO Optimized**: Meta tags for social media sharing

## 🛠️ Technologies Used

- **React 19** - Latest UI framework with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite 7** - Fast build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library built on Radix UI
- **Radix UI** - Accessible and customizable UI primitives
- **Naver Maps API** - Interactive maps for South Korea
- **Sonner** - Beautiful toast notifications
- **Lucide React** - Beautiful and customizable icons
- **React Audio Player** - Music functionality
- **Workbox** - PWA and caching strategies
- **date-fns** - Modern date utility library

## � Navigation Features

### Supported Navigation Apps

1. **Kakao Map** 🚗
   - App scheme: `kakaomap://route?ep=lat,lng&by=CAR`
   - Web fallback: `https://map.kakao.com/link/to/name,lat,lng`
   - Available on: Mobile and Desktop

2. **T Map** 🚙
   - App scheme: `tmap://route?goalx=lng&goaly=lat&goalname=name`
   - Web fallback: `https://tmap.life/route?goalx=lng&goaly=lat&goalname=name`
   - **Mobile Only**: Shows error message on desktop

3. **Naver Map** 🗺️
   - App scheme: `nmap://route/public?dlat=lat&dlng=lng&dname=name`
   - Web fallback: `http://map.naver.com/index.nhn?menu=route&elat=lat&elng=lng&eText=name`
   - Available on: Mobile and Desktop

### How It Works

1. **Mobile Detection**: Automatically detects mobile devices
2. **App Launch**: Tries to open the native app first
3. **Fallback System**: Falls back to web version after 2 seconds if app doesn't open
4. **Error Handling**: Shows appropriate error messages for unsupported scenarios

## 📦 Deployment

The project is configured for GitHub Pages deployment:

1. Update the `base` path in `vite.config.ts` to match your repository name
2. Set the `VITE_SITE_URL` in your `.env` file
3. Run `npm run deploy` to build and deploy to GitHub Pages

## 🧩 Custom Hooks

### `useNavigation`

Custom hook for handling navigation app integrations:

```typescript
const { openKakaoNavi, openTMapNavi, openNaverMap } = useNavigation({
  latitude: 37.515287,
  longitude: 127.102981,
  name: "결혼식 장소",
});
```

Features:

- Mobile device detection
- App scheme URL generation
- Web fallback handling
- Error handling for unsupported scenarios

### `useAutoPlay`

Handles background music auto-play functionality with user interaction detection.

### `useAutoVersionCheck`

PWA auto-update functionality that checks for new versions and prompts users to update.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
