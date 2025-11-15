# Document Summary Assistant

An AI-powered web application that analyzes PDFs and images to provide intelligent summaries, key points, and improvement suggestions.

## Features

- **Multi-format Support**: Upload PDFs, JPG, PNG, and WEBP files
- **AI-Powered Analysis**: Get comprehensive document summaries in three lengths (short, medium, long)
- **Key Points Extraction**: Automatically identify and extract the most important points
- **Improvement Suggestions**: Receive actionable suggestions to enhance your documents
- **Beautiful Dark Interface**: Modern, responsive design optimized for all devices

## Technologies Used

This project is built with:

- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Supabase** - Backend and edge functions
- **Gemini AI** - Document analysis and summarization

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Git for version control

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingState.tsx
│   │   ├── SummaryDisplay.tsx
│   │   └── UploadZone.tsx
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External service integrations
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Application entry point
├── supabase/
│   └── functions/      # Serverless edge functions
├── public/             # Static assets
└── index.html          # HTML entry point
```

## Deployment

The application can be deployed to any static hosting service that supports single-page applications:

- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify
- GitHub Pages

Simply build the project and deploy the `dist` folder.

## Security

This application implements several security best practices:

- Server-side file validation
- Type-safe API calls
- Error boundaries for graceful error handling
- Secure environment variable management

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
