# Arav Gupta - Professional Portfolio

A modern, interactive portfolio website with admin functionality built with HTML, CSS, JavaScript, and Vercel serverless functions.

## Features

- 🎵 **Spotify-inspired Design** - Modern, clean interface with music player
- 🔍 **Enhanced Search** - Smart search with highlighting and auto-scroll
- 🎠 **Interactive Skills Carousel** - Horizontal scrollable tech stack with animations
- 🎯 **Admin Mode** - Secure content management with backend authentication
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Optimized performance with smooth animations

## Admin System

The portfolio includes a comprehensive admin system for content management:

### Features:
- 🔐 **Secure Authentication** - Backend-verified password protection
- ✏️ **Inline Editing** - Click any text to edit directly
- 💾 **Auto-save** - Changes are saved both locally and to the server
- 🗑️ **Section Management** - Delete sections with confirmation
- 📊 **Real-time Updates** - See changes immediately

### Admin Access:
1. Click the gear icon (⚙️) in the top-right corner
2. Enter the admin password
3. Start editing content directly
4. Use the "Save Changes" button to persist modifications

## Deployment on Vercel

### Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed
- [Git](https://git-scm.com/) installed
- Vercel account

### Quick Deploy
1. **Clone & Setup:**
   ```bash
   git clone <your-repo-url>
   cd myPortfolio
   ```

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set Environment Variables:**
   ```bash
   vercel env add ADMIN_PASSWORD
   ```
   Enter your secure admin password when prompted.

6. **Redeploy with Environment Variables:**
   ```bash
   vercel --prod
   ```

### Environment Variables

Set these in your Vercel dashboard or via CLI:

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Secure password for admin access | `mySecurePassword123!` |

### Manual Deployment via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables:
   - `ADMIN_PASSWORD`: Your secure admin password
5. Deploy!

## API Endpoints

### `POST /api/verify-admin`
Authenticates admin users and returns a session token.

**Request:**
```json
{
  "password": "your-admin-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "base64-encoded-session-token",
  "message": "Authentication successful"
}
```

### `POST /api/save-portfolio`
Saves portfolio changes securely.

**Headers:**
```
Authorization: Bearer <session-token>
Content-Type: application/json
```

**Request:**
```json
{
  "portfolioData": {
    "timestamp": 1640995200000,
    "content": {
      "element_0": {
        "text": "Updated content",
        "html": "<h1>Updated content</h1>",
        "selector": "h1.hero-title"
      }
    }
  }
}
```

## Local Development

1. **Start a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. **For API testing with Vercel:**
   ```bash
   vercel dev
   ```

## Security Features

- 🔐 **Environment Variable Protection** - Admin password stored securely
- 🛡️ **Token-based Authentication** - Secure session management
- 🚫 **CORS Protection** - Controlled cross-origin requests
- 🔍 **Input Validation** - Server-side request validation
- 📝 **Local Fallback** - Data saved locally if server unavailable

## Tech Stack

### Frontend:
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons and symbols

### Backend:
- **Vercel Serverless Functions** - Node.js runtime
- **JSON Web Tokens** - Session management
- **Environment Variables** - Secure configuration

### Deployment:
- **Vercel** - Hosting and serverless functions
- **Git** - Version control
- **Custom Domain** - Professional URL (optional)

## File Structure

```
myPortfolio/
├── api/
│   ├── verify-admin.js      # Admin authentication endpoint
│   └── save-portfolio.js    # Portfolio data saving endpoint
├── index.html               # Main portfolio page
├── styles.css               # All styling and animations
├── script.js                # Frontend functionality
├── vercel.json              # Vercel configuration
└── README.md                # This file
```

## Performance Optimizations

- ⚡ **Lazy Loading** - Images and content loaded on demand
- 🎨 **CSS Animations** - Hardware-accelerated transitions
- 📦 **Minified Assets** - Compressed for faster loading
- 🚀 **CDN Delivery** - Fast global content delivery via Vercel
- 💾 **Local Caching** - Smart browser caching strategies

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email**: aravgupta2604@gmail.com
- **LinkedIn**: [aravgupta26](https://linkedin.com/in/aravgupta26)
- **GitHub**: [aravvv](https://github.com/aravvv)

---

**Note**: Remember to keep your admin password secure and never commit it to version control!
