
# MobileShop Management System

A comprehensive management system for mobile phone shops with inventory management, sales tracking, purchase management, and more.

## Features

- Dashboard with sales analytics and key metrics
- Inventory management with stock tracking
- Sales processing and history
- Purchase order management
- Customer relationship management
- Repair tracking system
- Comprehensive reporting tools
- User management with role-based access control

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mobileshop-management.git
```

2. Install dependencies:
```bash
cd mobileshop-management
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

### Demo Credentials

- Admin: admin/admin123
- Manager: manager/manager123
- Cashier: cashier/cashier123
- Technician: tech/tech123

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
└── types/              # Type definitions
```

## Technologies Used

- React
- React Router
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- React Query for data fetching

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
