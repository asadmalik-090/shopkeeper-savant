
# MobileShop Management System

A comprehensive management system for mobile phone retail shops, built with React and optimized for both desktop and mobile use.

## 📱 Overview

MobileShop Management System is a complete retail management solution designed specifically for mobile phone shops. It handles inventory, sales, customer management, repairs, and reporting in a single, user-friendly interface.

## 🚀 Features

- **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile devices
- **Authentication System**: Secure role-based login with different user permissions
- **Dashboard**: Visual overview of key business metrics and store performance
- **Inventory Management**: Track products, stock levels, and pricing
- **Sales Management**: Process transactions, generate receipts, and track sales history
- **Purchase Order Management**: Manage vendor orders and stock replenishment
- **Customer Management**: Store and manage customer information and purchase history
- **Repair Management**: Track repair jobs, status, and service tickets
- **Reports**: Generate dynamic business performance reports and analytics

## 💻 Technologies Used

- **React**: For building the user interface
- **React Router**: For navigation and routing
- **Context API**: For global state management
- **Tailwind CSS**: For responsive styling
- **shadcn/ui**: UI component library for consistent design
- **Lucide Icons**: SVG icon set for visual elements
- **React Hook Form**: For form handling and validation
- **Zod**: For schema validation
- **Recharts**: For data visualization
- **Sonner**: For toast notifications

## 🔧 Project Structure

```
src/
├── components/         # UI components organized by feature
│   ├── dashboard/      # Dashboard-related components
│   ├── inventory/      # Inventory-related components
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   ├── purchases/      # Purchase-related components
│   ├── sales/          # Sales-related components
│   ├── ui/             # Reusable UI components
│   └── user/           # User-related components
├── context/            # React Context providers for global state
├── data/               # Mock data and API simulation
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Page components for each route
└── types/              # Type definitions (in JS Doc format)
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/mobileshop-management.git
   ```

2. Navigate to the project directory
   ```
   cd mobileshop-management
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8080`

## 🔐 User Roles and Access

The system supports four types of users with different access levels:

1. **Admin**: Full access to all features
   - Username: `admin`
   - Password: `admin123`
   - Permissions: Can access all modules and features

2. **Manager**: Access to inventory, sales, purchases, customers, and reports
   - Username: `manager`
   - Password: `manager123`
   - Permissions: Can manage products, sales, purchases, customers, repairs, and view reports

3. **Cashier**: Access to sales and customer management
   - Username: `cashier`
   - Password: `cashier123`
   - Permissions: Can process sales and manage customers

4. **Technician**: Access to repair management
   - Username: `tech`
   - Password: `tech123`
   - Permissions: Can manage repair tickets and service jobs

## 📱 Mobile Responsiveness

The application is optimized for various screen sizes with:
- Adaptive layouts that reorganize for smaller screens
- Touch-friendly UI elements with appropriate sizing
- Collapsible sidebar for mobile views
- Responsive tables and data displays
- Mobile-optimized forms and inputs

## 🛠️ Development Guide

### Adding New Pages

1. Create a new file in `src/pages/` with your page component
2. Add the route in `src/App.jsx`
3. Add a navigation link in `src/components/layout/Sidebar.jsx`

Example:
```jsx
// src/pages/NewPage.jsx
import React from 'react';

const NewPage = () => {
  return (
    <div>
      <h1>New Page</h1>
      {/* Page content */}
    </div>
  );
};

export default NewPage;

// Add to routes in App.jsx
<Route path="/new-page" element={<NewPage />} />

// Add to sidebar in Sidebar.jsx
<SidebarItem icon={<Icon />} href="/new-page" label="New Page" />
```

### Adding New Components

1. Create a component file in the appropriate feature folder
2. Use the component where needed

Example:
```jsx
// src/components/sales/SalesFilter.jsx
import React from 'react';

const SalesFilter = ({ onFilter }) => {
  // Component implementation
  return (
    <div>
      {/* Filter UI */}
    </div>
  );
};

export default SalesFilter;
```

### Using the Global Context

The application uses a central AppContext for global state management:

```jsx
import { useAppContext } from '@/context/AppContext';

const MyComponent = () => {
  const { products, customers, currentUser, hasPermission } = useAppContext();
  
  // Check permission before rendering
  if (!hasPermission('canManageProducts')) {
    return <p>Access denied</p>;
  }
  
  return (
    // Component implementation
  );
};
```

### Form Handling

The application uses React Hook Form with Zod validation:

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  price: z.number().min(0, 'Price cannot be negative'),
});

// Use in component
const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });
  
  const onSubmit = (data) => {
    // Handle form submission
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### Styling Components

The application uses Tailwind CSS for styling:

```jsx
// Example of responsive styling
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-lg shadow">
    {/* Card content */}
  </div>
</div>
```

## 📊 Data Flow

1. **User Authentication**:
   - User credentials are validated in the `AppContext`
   - User permissions are determined by their role
   - Protected routes check for authentication

2. **Data Management**:
   - Global state is managed in the `AppContext`
   - Components access data through the `useAppContext` hook
   - Updates are made through context methods

3. **Form Submission**:
   - Forms are validated with Zod schemas
   - Submissions update the global state
   - Success/error messages are shown with toast notifications

## 🎛️ Configuration

Key configuration files:

- `vite.config.js`: Vite bundler configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `index.css`: CSS variables for theming

## 🧪 Best Practices

1. **Component Design**:
   - Keep components small and focused on a single responsibility
   - Use composition to build complex UIs from simple components
   - Follow consistent naming conventions

2. **State Management**:
   - Use local state for component-specific data
   - Use context for shared state across components
   - Keep state updates predictable and traceable

3. **Performance**:
   - Use memoization for expensive calculations
   - Implement proper dependency arrays in hooks
   - Optimize renders with React.memo where appropriate

4. **Accessibility**:
   - Use semantic HTML elements
   - Ensure proper keyboard navigation
   - Maintain sufficient color contrast
   - Include appropriate ARIA attributes

5. **Code Organization**:
   - Group related files together
   - Keep file sizes manageable
   - Document complex logic with comments

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- UI design inspired by modern dashboard templates
- Icons by Lucide Icons
- UI components from shadcn/ui
