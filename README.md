# Wedding Website - JK & JH

A beautiful wedding invitation website built with React, TypeScript, and Vite. Features include interactive maps, background music, and PWA capabilities with auto-update functionality.

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

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/finnkm/jk-jh.git
   cd jk-jh
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your actual values:

   ```env
   # Naver Map API Key (Required)
   VITE_NAVER_MAP_CLIENT_ID=your_actual_naver_map_client_id

   # Website Information (Optional - modify as needed)
   VITE_SITE_TITLE=Your Wedding Title
   VITE_SITE_DESCRIPTION=Your Wedding Description
   VITE_SITE_URL=https://your-username.github.io/your-repo-name/
   ```

4. **Get Naver Map API Key**
   - Visit [Naver Cloud Platform](https://www.ncloud.com/)
   - Create an account and enable Maps API
   - Generate a Client ID for Web Dynamic Map
   - Replace `your_actual_naver_map_client_id` with your key

### 🏃‍♂️ Running the Project

**Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Build for Production**

```bash
npm run build
```

**Preview Production Build**

```bash
npm run preview
```

**Deploy to GitHub Pages**

```bash
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/
│   ├── MusicPlayer.tsx     # Background music player
│   └── NaverMap.tsx        # Interactive map component
├── hooks/
│   └── useAutoVersionCheck.ts  # PWA auto-update logic
└── App.tsx                 # Main application component
```

## 🔧 Configuration

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the frontend:

- `VITE_NAVER_MAP_CLIENT_ID`: Required for map functionality
- `VITE_SITE_TITLE`: Website title (used in HTML title and meta tags)
- `VITE_SITE_DESCRIPTION`: Website description (used for SEO)
- `VITE_SITE_URL`: Full website URL (used for Open Graph tags)

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

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Naver Maps API** - Interactive maps
- **Workbox** - PWA and caching
- **React Audio Player** - Music functionality

## 📦 Deployment

The project is configured for GitHub Pages deployment:

1. Update the `base` path in `vite.config.ts` to match your repository name
2. Set the `VITE_SITE_URL` in your `.env` file
3. Run `npm run deploy` to build and deploy to GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
