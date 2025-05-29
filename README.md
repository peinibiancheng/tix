# Tix - Ticket Management System

A modern, desktop-based ticket management system built with Tauri, React, TypeScript, and SQLite. Inspired by Taiga's clean design and user experience.

## Features

### 🔐 User Authentication
- Secure login system with password hashing (bcrypt)
- "Remember me" functionality for persistent sessions
- Session management with local/session storage

### 🎫 Ticket Management
- **Create Tickets**: Add new tickets with category, title, description, assignee, and reporter
- **View Tickets**: Comprehensive list view with all essential information
- **Update Tickets**: Edit ticket details and status
- **Filter & Search**: Advanced filtering by category, status, assignee, and text search
- **Sort**: Sort tickets by any column (ascending/descending)

### 📊 Ticket Information
- **Categories**: Bug, Feature, Enhancement, Task, Support
- **Statuses**: Open, In Progress, Closed, Resolved
- **Metadata**: Created date, updated date, assignee, reporter
- **Detailed Descriptions**: Full text descriptions with proper formatting

### 🎨 Modern UI/UX
- Clean, modern interface inspired by Taiga
- Responsive design that works on different screen sizes
- Intuitive navigation and user interactions
- Color-coded categories and status badges
- Smooth animations and transitions

### 💾 Data Storage
- SQLite database for reliable local data storage
- Automatic database initialization with sample data
- Efficient data queries and updates

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Rust (Tauri)
- **Database**: SQLite with rusqlite
- **Authentication**: bcrypt for password hashing
- **Styling**: Custom CSS with modern design principles
- **Build Tool**: Tauri for cross-platform desktop application

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Rust (latest stable version)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tix
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run tauri dev
```

### Default Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

```
tix/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Login.tsx      # Login form component
│   │   ├── TicketList.tsx # Ticket list with filters
│   │   ├── TicketDetail.tsx # Ticket detail modal
│   │   └── CreateTicket.tsx # Create ticket modal
│   ├── services/          # API service layer
│   │   └── api.ts         # Tauri API calls and storage
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # All type definitions
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   └── main.tsx           # React entry point
├── src-tauri/             # Rust backend source
│   ├── src/
│   │   ├── lib.rs         # Main Rust library with API commands
│   │   └── main.rs        # Tauri main entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── package.json           # Node.js dependencies and scripts
```

## API Commands

The application exposes the following Tauri commands:

- `login(request: LoginRequest)` - Authenticate user
- `get_tickets()` - Retrieve all tickets
- `get_ticket_by_id(ticket_id: string)` - Get specific ticket
- `create_ticket(request: CreateTicketRequest)` - Create new ticket
- `update_ticket(request: UpdateTicketRequest)` - Update existing ticket

## Database Schema

### Users Table
- `id` (TEXT PRIMARY KEY)
- `username` (TEXT UNIQUE NOT NULL)
- `password_hash` (TEXT NOT NULL)
- `created_at` (TEXT NOT NULL)

### Tickets Table
- `id` (TEXT PRIMARY KEY)
- `category` (TEXT NOT NULL)
- `title` (TEXT NOT NULL)
- `description` (TEXT NOT NULL)
- `created_date` (TEXT NOT NULL)
- `assignee` (TEXT NOT NULL)
- `reporter` (TEXT NOT NULL)
- `status` (TEXT NOT NULL)
- `updated_at` (TEXT NOT NULL)

## Building for Production

To build the application for production:

```bash
npm run tauri build
```

This will create platform-specific installers in the `src-tauri/target/release/bundle/` directory.

## Development

### Running Tests
```bash
npm test
```

### Code Structure
- Follow React best practices with functional components and hooks
- Use TypeScript for type safety
- Implement proper error handling
- Follow Rust best practices for the backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
