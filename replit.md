# Overview

This is a luxury car marketplace application built for the Yemeni market. The application serves as a comprehensive platform for browsing, searching, and managing luxury car listings. It features a bilingual interface with Arabic as the primary language and includes both customer-facing features and administrative capabilities.

The system is designed as a full-stack web application with a React frontend, Express.js backend, and PostgreSQL database integration using Drizzle ORM. The application emphasizes luxury design aesthetics with a gold and black color scheme, premium typography, and smooth animations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Client-side routing implemented with Wouter library for lightweight navigation
- **State Management**: TanStack React Query for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **UI Components**: Radix UI primitives with custom styling using shadcn/ui components
- **Styling**: Tailwind CSS with custom Arabic fonts (Cairo, Amiri) and luxury-themed color palette

**Design System**:
- RTL (Right-to-Left) layout support for Arabic language
- Custom color scheme with gold (#FFC107) as primary and black/gray luxury tones
- Consistent spacing and typography scales
- Responsive design with mobile-first approach

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API architecture with clear resource-based endpoints
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **File Uploads**: Multer middleware for handling car image uploads with validation
- **Development Setup**: Vite integration for hot module reloading in development

**Data Layer**:
- In-memory storage implementation for development/demo purposes
- Abstracted storage interface (IStorage) allowing easy migration to database
- Seeded sample data for luxury cars in the Yemeni market

## Database Design

**ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Definition**: Type-safe schema definitions with validation
- **Tables**: 
  - `cars`: Complete car listings with specifications, pricing, and media
  - `contacts`: Customer inquiries and communication tracking
- **Data Types**: Proper PostgreSQL types including arrays for features and images
- **Timestamps**: Automatic created/updated timestamp tracking

## API Structure

**Car Management**:
- `GET /api/cars` - List cars with filtering support
- `GET /api/cars/featured` - Retrieve featured car listings
- `GET /api/cars/:id` - Individual car details
- `POST /api/cars` - Create new car listing (admin)
- `PUT /api/cars/:id` - Update car information (admin)
- `DELETE /api/cars/:id` - Remove car listing (admin)

**Contact Management**:
- `GET /api/contacts` - List all customer inquiries
- `GET /api/contacts/unread` - Retrieve unread messages
- `POST /api/contacts` - Submit customer inquiry
- `PUT /api/contacts/:id/read` - Mark message as read

**Filtering & Search**:
- Multi-parameter filtering (make, model, price range, year, body type)
- Search functionality across car titles and descriptions
- Featured car highlighting system

## External Dependencies

**Core Framework Dependencies**:
- **Neon Database**: Serverless PostgreSQL database service (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with schema migrations
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form validation with @hookform/resolvers for Zod integration

**UI & Styling**:
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component

**Development Tools**:
- **Vite**: Fast build tool with TypeScript support
- **ESBuild**: JavaScript bundler for production builds
- **Multer**: File upload middleware for Express.js
- **Wouter**: Minimalist client-side routing

**Validation & Type Safety**:
- **Zod**: Schema validation library
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod validation
- **TypeScript**: Static type checking throughout the application

**Additional Libraries**:
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Utility for managing CSS class variants
- **clsx**: Conditional className utility
- **connect-pg-simple**: PostgreSQL session store for Express sessions