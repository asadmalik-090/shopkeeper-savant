
# MobileShop Management System

A comprehensive management system for mobile phone shops, built with React and shadcn/ui components.

## Features

- Dashboard with sales metrics and visualizations
- Inventory management
- Sales tracking and processing
- Purchase order management
- Customer management
- Repair service tracking
- Financial reporting
- User authentication with role-based access control

## Project Structure

```
src/
├── components/         # UI components
│   ├── dashboard/      # Dashboard-related components
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   ├── purchases/      # Purchase-related components
│   ├── sales/          # Sales-related components
│   ├── ui/             # Reusable UI components
│   └── user/           # User-related components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components for each route
```

## Authentication

Demo accounts for testing:
- Admin: admin/admin123
- Manager: manager/manager123
- Cashier: cashier/cashier123
- Technician: tech/tech123

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to: `http://localhost:5173`

## Development Guidelines

### Adding New Components

1. Create a new file in the appropriate folder under `src/components/`
2. Use JSX syntax and functional components
3. Follow the existing naming conventions
4. Import and use the component where needed

### Styling

- This project uses Tailwind CSS for styling
- Global styles are in `src/index.css`
- Component-specific styles use Tailwind classes directly in JSX

### State Management

- Global state is managed with Context API in `src/context/AppContext.jsx`
- Use the `useAppContext` hook to access global state
- For component-specific state, use React's `useState` hook

### Adding New Pages

1. Create a new file in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add a link in the sidebar (`src/components/layout/Sidebar.jsx`)

### Best Practices

- Keep components small and focused
- Follow the single responsibility principle
- Use composition over inheritance
- Implement responsive design using Tailwind's responsive classes
- Test on multiple viewport sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
