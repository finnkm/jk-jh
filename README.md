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
