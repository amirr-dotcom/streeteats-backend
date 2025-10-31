# StreetEats Backend

A modular, clean API-based backend built with Next.js (App Router), Prisma ORM, and Supabase PostgreSQL for StreetEats - a platform where small food vendors can create digital menus and share them via QR codes.

## 🎯 Project Overview

StreetEats Backend provides a RESTful API with full CRUD operations for:
- **Users** - Vendor and admin user management
- **Shops** - Food vendor shop profiles
- **Menu Items** - Individual menu items for each shop

## 🏗️ Tech Stack

- **Next.js 14** (App Router) - API routes and server-side functionality
- **TypeScript** - Type-safe development
- **Prisma** - Modern ORM for database management
- **Supabase PostgreSQL** - Database storage
- **Zod** - Input validation and schema definitions
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variable management

## 📁 Project Structure

```
streetfood-backend/
├── app/
│   └── api/
│       ├── users/
│       │   ├── route.ts              # GET all, POST create
│       │   └── [id]/
│       │       └── route.ts          # GET one, PUT update, DELETE
│       ├── auth/
│       │   └── login/
│       │       └── route.ts          # POST login
│       ├── shops/
│       │   ├── route.ts              # GET all, POST create
│       │   └── [id]/
│       │       └── route.ts          # GET one, PUT update, DELETE
│       └── menu-items/
│           ├── route.ts             # GET all (with filters), POST create
│           └── [id]/
│               └── route.ts         # GET one, PUT update, DELETE
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── auth.ts                      # Authentication & authorization
│   ├── errors.ts                    # Common error handling
│   ├── factory.ts                   # Generic CRUD factory
│   ├── validations.ts               # Zod validation schemas
│   ├── userFactory.ts               # User-specific factory methods
│   ├── shopFactory.ts               # Shop-specific factory methods
│   └── menuItemFactory.ts           # Menu item-specific factory methods
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Database migrations
├── .env                              # Environment variables
├── .env.example                     # Example environment file
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase or local)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd streetfood-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   NODE_ENV="development"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   ```
   
   For Supabase, you can find your connection string in the Supabase dashboard under Settings > Database > Connection String.
   
   **Important**: Change `JWT_SECRET` to a strong, random string in production!

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000/api`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication, and some require specific ownership permissions.

### How Authentication Works

1. **Signup** - Register a new user account via `POST /api/auth/signup`
2. **Login** - Authenticate via `POST /api/auth/login` to receive a JWT token
3. **Use Token** - Include the token in the `Authorization` header for protected endpoints:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account (Signup).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "vendor"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "vendor",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

**Note**: After signup, use the login endpoint to get a JWT token.

#### POST `/api/auth/login`
Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "vendor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Protected Endpoints

The following endpoints require authentication (JWT token):

| Endpoint | Method | Requires |
|----------|--------|----------|
| `/api/shops` | POST | Authentication + ownerId must match authenticated user |
| `/api/shops/[id]` | PUT, DELETE | Authentication + Shop ownership |
| `/api/menu-items` | POST | Authentication + Shop ownership |
| `/api/menu-items/[id]` | PUT, DELETE | Authentication + Shop ownership |

### Public Endpoints

These endpoints are publicly accessible (no authentication required):

- `GET /api/users` - View all users
- `GET /api/users/[id]` - View single user
- `GET /api/shops` - View all shops
- `GET /api/shops/[id]` - View single shop
- `GET /api/menu-items` - View all menu items (with filters)
- `GET /api/menu-items/[id]` - View single menu item
- `POST /api/auth/signup` - Register new user (Signup)
- `POST /api/auth/login` - Login
- `POST /api/users` - Create user (alternative to signup)
- `POST /api/upload` - Upload image file (optional - alternative to base64)

## 📚 API Endpoints

### Users

#### GET `/api/users`
Get all users (passwords excluded).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "vendor",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "vendor"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "vendor",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### GET `/api/users/[id]`
Get a single user by ID.

#### PUT `/api/users/[id]`
Update a user by ID.

**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

#### DELETE `/api/users/[id]`
Delete a user by ID.

### Shops

#### GET `/api/shops`
Get all shops with owner and menu items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Taco Stand",
      "description": "Authentic Mexican tacos",
      "location": "Downtown",
      "imageUrl": "https://...",
      "qrCodeUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "vendor"
      },
      "menuItems": [...]
    }
  ],
  "count": 1
}
```

#### POST `/api/shops`
Create a new shop. **Requires Authentication** - You can only create shops for yourself (ownerId must match your user ID).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "Taco Stand",
  "description": "Authentic Mexican tacos",
  "location": "Downtown",
  "ownerId": "your-user-uuid",
  "imageUrl": "data:image/png;base64,iVBORw0KGgo...",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Image Support:**
- `imageUrl` and `qrCodeUrl` accept:
  - Base64 data URLs: `data:image/png;base64,...`
  - HTTP/HTTPS URLs: `https://example.com/image.png`
  - Empty string or null

**Note**: The `ownerId` must match the authenticated user's ID, otherwise you'll receive a 403 Forbidden error.

#### GET `/api/shops/[id]`
Get a single shop by ID with owner and menu items.

#### PUT `/api/shops/[id]`
Update a shop by ID. **Requires Authentication + Shop Ownership**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

#### DELETE `/api/shops/[id]`
Delete a shop by ID. **Requires Authentication + Shop Ownership**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

### Menu Items

#### GET `/api/menu-items`
Get all menu items with optional filters.

**Query Parameters:**
- `shopId` (optional): Filter by shop ID
- `isVeg` (optional): Filter by vegetarian status (true/false)

**Example:**
```
GET /api/menu-items?shopId=uuid&isVeg=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Beef Taco",
      "description": "Delicious beef taco",
      "price": 5.99,
      "isVeg": false,
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "shop": {
        "id": "uuid",
        "name": "Taco Stand",
        "location": "Downtown"
      }
    }
  ],
  "count": 1
}
```

#### POST `/api/menu-items`
Create a new menu item. **Requires Authentication + Shop Ownership** - You can only add menu items to shops you own.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "Beef Taco",
  "description": "Delicious beef taco",
  "price": 5.99,
  "shopId": "shop-uuid",
  "isVeg": false,
  "imageUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Image Support:**
- `imageUrl` accepts:
  - Base64 data URLs: `data:image/png;base64,...`
  - HTTP/HTTPS URLs: `https://example.com/image.png`
  - Empty string or null

**Note**: The `shopId` must belong to a shop you own, otherwise you'll receive a 403 Forbidden error.

#### GET `/api/menu-items/[id]`
Get a single menu item by ID with shop relation. **Public endpoint** - No authentication required.

#### PUT `/api/menu-items/[id]`
Update a menu item by ID. **Requires Authentication + Shop Ownership**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

#### DELETE `/api/menu-items/[id]`
Delete a menu item by ID. **Requires Authentication + Shop Ownership**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

## 🔧 Architecture

### Common Factory Pattern

The `CRUDFactory` class (`lib/factory.ts`) provides a reusable pattern for all CRUD operations:

- **getAll()** - Fetch all records with optional filtering, pagination, and relations
- **getById()** - Fetch a single record by ID with optional relations
- **create()** - Create a new record with automatic field exclusion
- **update()** - Update an existing record with validation
- **delete()** - Delete a record with existence checking

### Error Handling

The `lib/errors.ts` module provides centralized error handling:

- **AppError** - Custom error class with error codes and status codes
- **handleError()** - Centralized error handler that converts errors to API responses
- **Error Codes:**
  - `VALIDATION_ERROR` (400) - Input validation failures
  - `NOT_FOUND` (404) - Resource not found
  - `UNAUTHORIZED` (401) - Authentication required
  - `FORBIDDEN` (403) - Insufficient permissions
  - `CONFLICT` (409) - Resource conflict (e.g., duplicate email)
  - `INTERNAL_ERROR` (500) - Unexpected server errors

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": "Email is required"
  }
}
```

### Validation

All input validation uses Zod schemas (`lib/validations.ts`):

- Request bodies are validated before processing
- Query parameters are validated for filter endpoints
- Type-safe TypeScript types generated from schemas

### Authentication & Authorization

The `lib/auth.ts` module provides:

- **JWT Token Generation**: Tokens are generated upon login with user ID, email, and role
- **Token Verification**: All protected endpoints verify the JWT token
- **Authorization Checks**: 
  - Shop owners can only manage their own shops
  - Shop owners can only add/update/delete menu items for their own shops
  - Users can only create shops for themselves
- **Authentication Middleware**: `requireAuth()` - Validates JWT tokens
- **Authorization Middleware**: 
  - `requireShopOwner()` - Ensures user owns the shop
  - `requireMenuItemOwner()` - Ensures user owns the menu item's shop

### Security

- **JWT Authentication**: All protected endpoints require valid JWT tokens
- **Password Hashing**: All passwords are hashed using bcrypt (10 rounds) before storage
- **Password Exclusion**: Passwords are automatically excluded from API responses
- **Input Validation**: All user inputs are validated using Zod schemas
- **UUID Validation**: All ID parameters are validated as UUIDs
- **Ownership Verification**: Users can only modify resources they own
- **Token Expiration**: JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)

## 🧪 Testing

### Sample Requests

#### 1. Signup (Register a User)
```bash
curl -X POST http://localhost:3003/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "vendor"
  }'
```

**Alternative**: You can also use `POST /api/users` for the same functionality.

#### 2. Login and Get JWT Token
```bash
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response for authenticated requests.

#### 3. Create a Shop with Base64 Image (Requires Authentication)
```bash
curl -X POST http://localhost:3003/api/shops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Taco Stand",
    "description": "Authentic Mexican tacos",
    "location": "Downtown",
    "ownerId": "your-user-uuid",
    "imageUrl": "data:image/png;base64,iVBORw0KGgo...",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo..."
  }'
```

#### 4. Upload Image File (Optional Alternative)
```bash
curl -X POST http://localhost:3003/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -F "file=@/path/to/image.png"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "http://localhost:3003/uploads/uuid.png",
    "localUrl": "/uploads/uuid.png"
  },
  "message": "File uploaded successfully"
}
```

#### 5. Create a Menu Item with Base64 Image (Requires Authentication + Shop Ownership)
```bash
curl -X POST http://localhost:3003/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Beef Taco",
    "description": "Delicious beef taco",
    "price": 5.99,
    "shopId": "your-shop-uuid",
    "isVeg": false,
    "imageUrl": "data:image/png;base64,iVBORw0KGgo..."
  }'
```

#### 6. Get Public Endpoints (No Authentication Required)
```bash
# Get all users
curl http://localhost:3003/api/users

# Get all shops
curl http://localhost:3003/api/shops

# Get menu items with filters
curl "http://localhost:3003/api/menu-items?shopId=shop-uuid&isVeg=true"
```

#### 7. Update Shop (Requires Authentication + Ownership)
```bash
curl -X PUT http://localhost:3003/api/shops/shop-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Updated Shop Name",
    "location": "New Location"
  }'
```

#### 7. Error Examples

**Missing Authentication:**
```bash
curl -X POST http://localhost:3000/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{"name": "Taco", "price": 5.99, "shopId": "uuid"}'
# Returns: 401 Unauthorized
```

**Trying to Add Menu Item to Someone Else's Shop:**
```bash
curl -X POST http://localhost:3000/api/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"name": "Taco", "price": 5.99, "shopId": "someone-elses-shop-uuid"}'
# Returns: 403 Forbidden - "You can only add menu items to your own shops"
```

## 📝 Database Schema

### User Model
- `id` - UUID (Primary Key)
- `name` - String
- `email` - String (Unique)
- `password` - String (Hashed)
- `role` - String (default: "vendor")
- `createdAt` - DateTime
- `shops` - Relation to Shop[]

### Shop Model
- `id` - UUID (Primary Key)
- `name` - String
- `description` - String (Optional)
- `location` - String (Optional)
- `ownerId` - String (Foreign Key to User)
- `imageUrl` - String (Optional)
- `qrCodeUrl` - String (Optional)
- `createdAt` - DateTime
- `owner` - Relation to User
- `menuItems` - Relation to MenuItem[]

### MenuItem Model
- `id` - UUID (Primary Key)
- `shopId` - String (Foreign Key to Shop)
- `name` - String
- `description` - String (Optional)
- `price` - Float
- `isVeg` - Boolean (default: true)
- `imageUrl` - String (Optional)
- `createdAt` - DateTime
- `shop` - Relation to Shop

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## 🖼️ Image & QR Code Support

The backend fully supports image uploads and QR codes:

### Base64 Images (Recommended for Development)
- **Shops**: `imageUrl` and `qrCodeUrl` accept base64 data URLs
- **Menu Items**: `imageUrl` accepts base64 data URLs
- **Format**: `data:image/png;base64,iVBORw0KGgo...`
- **Supported formats**: PNG, JPG, JPEG, GIF, WEBP, SVG
- **Stored directly in database** - No file system required

### File Upload Endpoint (Optional)
- **POST `/api/upload`** - Upload image files (max 5MB)
- Stores files in `public/uploads/` directory
- Returns URL for use in shop/menu item creation
- Better performance than base64 for production
- **Requires Authentication** (JWT token)

**Example:**
```bash
curl -X POST http://localhost:3003/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.png"
```

### QR Code Generation
- QR codes are generated on the frontend
- Stored as base64 data URLs in `qrCodeUrl` field
- No backend changes needed - works immediately

### Image Validation
The backend validates:
- Base64 data URLs: `data:image/[type];base64,[data]`
- HTTP/HTTPS URLs: `https://example.com/image.png`
- Empty strings or null values

## 🔄 Future Enhancements

- [x] Authentication middleware (JWT) ✅
- [x] File upload for images ✅
- [x] QR code support (base64) ✅
- [ ] Role-based access control (RBAC) - Currently supports vendor/admin roles, needs enforcement
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Image optimization/resizing
- [ ] Pagination for list endpoints
- [ ] Rate limiting
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📄 License

ISC

## 👤 Author

StreetEats Development Team

---

**Note**: This is a backend-only project. For frontend integration, refer to the Next.js frontend documentation or use the API endpoints described above.
# streeteats-backend
# streeteats-backend
# streeteats-backend
# streeteats-backend
# streeteats-backend
# streeteats-backend
