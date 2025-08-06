# Form UI with Drag & Drop

A modern, accessible form interface built with Next.js, TypeScript, and shadcn/ui components featuring interactive drag and drop field reordering.

## 🚀 Features

- **Interactive Drag & Drop**: Reorder form fields by dragging the ☰ handle
- **Accessible Design**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Built with TypeScript for better development experience
- **Error Handling**: Graceful error handling with user feedback
- **Performance Optimized**: Memoized components and efficient re-renders

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-form-ui-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── tabs.tsx
│   └── FormUI.tsx           # Main form component
└── lib/
    └── utils.ts             # Utility functions
```

## 🎯 Usage

### Basic Form Interaction

1. **View the form**: The application displays a tabbed interface with a "General" tab
2. **Drag fields**: Click and drag the ☰ handle on any field to reorder
3. **Keyboard navigation**: Use Tab to navigate and Enter/Space to interact
4. **Error recovery**: If reordering fails, use the "Reset" button

### Accessibility Features

- **Screen reader support**: Full ARIA labels and announcements
- **Keyboard navigation**: Complete keyboard accessibility
- **Focus management**: Proper focus indicators and management
- **Semantic HTML**: Proper heading structure and landmarks

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Consistent code formatting
- **Accessibility**: WCAG 2.1 AA compliance

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: Import your repository in Vercel
3. **Auto-deploy**: Vercel will automatically deploy on main branch updates

### Environment Variables

No environment variables required for basic functionality.

## 🧪 Testing

The application includes comprehensive error handling and user feedback mechanisms:

- **Drag operation errors**: Graceful fallback with reset functionality
- **Accessibility testing**: Full keyboard and screen reader support
- **Performance monitoring**: Optimized re-renders and memoization

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**
