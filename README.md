<div align="center">
  <table border="1">
    <tr>
      <td align="center" style="padding: 20px;">
        <h3>📢 Domain & Email Migration Notice</h3>
        <p>From <b>May 14 th, 2026</b>, Obscuron will transition to new domains as <code>obscuron.chat</code> will not be renewed:</p>
        <p>🌐 <b>Website:</b> <a href="https://obscuron.faizath.com">obscuron.faizath.com</a> (formerly <i>obscuron.chat</i>)<br>
        ⚙️ <b>API:</b> <a href="https://obscuron-api.faizath.com">obscuron-api.faizath.com</a> (formerly <i>api.obscuron.chat</i>)<br>
        📧 <b>Email:</b> <a href="mailto:contact@obscuron.faizath.com">contact@obscuron.faizath.com</a> (formerly <i>contact@obscuron.chat</i>)<br>
        🛰️ <b>CDN:</b> <a>obscuron-cdn.faizath.com</a> (formerly <i>cdn.obscuron.chat</i>)<br>
        📈 <b>Status Pages:</b> <a href="https://status.faizath.com/status/obscuron">https://status.faizath.com/status/obscuron</a> (formerly <i>status.obscuron.chat</i>)
        </p>
      </td>
    </tr>
  </table>
</div>

# Obscuron Client

A secure messaging application built with React, TypeScript, and Vite.

## 📦 Installation

### Prerequisites
- Node.js 18.x
- Docker 24.x
- .env configuration

### Steps
1. Clone the repository:
```bash
git clone https://github.com/obscuron/obscuron-client.git
cd obscuron-client
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Build Docker image:
```bash
docker build -t obscuron-client .
```

## 🚀 Usage

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Docker Execution
```bash
docker run -p 3000:3000 obscuron-client
```

## 🧩 Project Structure
- `src/App.tsx` - Main application component
- `src/pages/` - Page components (e.g., MainPage.tsx)
- `src/components/` - Reusable UI components
- `src/types.ts` - Shared type definitions
- `public/` - Static assets

## 🛠️ Technologies
- React 18 with hooks and context API
- TypeScript for type safety
- Vite for fast bundling
- Docker for containerization
- ESLint with TypeScript and React plugins
