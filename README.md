# Shilpo — A Space for Artists and Their Art

**Shilpo** is a full-stack art portfolio management platform designed for artists, art enthusiasts, and small collection managers to organize, showcase, and explore artwork.

The application provides a creative space where visitors can discover artworks, explore exhibitions, and learn about artists. Registered users can create and manage their personal portfolios, while administrators can curate and publish exhibitions through the Newsroom.

Built with React, Flask, and PostgreSQL, Shilpo combines secure authentication, role-based authorization, cloud-based image uploads, portfolio management, and an interactive user experience.

## Live Application

**Frontend — Vercel:**  
https://shilpo-one.vercel.app/

**Backend — Render:**  
https://shilpo-api.onrender.com/

**Note:** The backend is hosted on Render's free tier and may take a short time to respond after inactivity while the service starts.

## Technologies Used

**Frontend**
- React
- Vite
- React Router
- Tailwind CSS
- Tailgrids

**Animation**
- GSAP

**Backend**
- Python
- Flask
- Flask-CORS

**Database**
- PostgreSQL
- Flask-SQLAlchemy
- Flask-Migrate
- Psycopg

**Authentication and Security**
- Flask sessions
- Flask-Bcrypt
- Email verification
- Password validation and password management
- Role-based authorization
- User ownership validation

**Image Storage**
- Cloudinary

**Validation and Serialization**
- Marshmallow

**Package Management**
- npm
- Pipenv

**Deployment**
- Vercel
- Render
- PostgreSQL
- Cloudinary

## Core Features

### 1. Authentication and User Security

Shilpo provides account authentication and protected access to user resources.

Features include:

- User registration and login
- Logout functionality
- Session persistence across page refreshes
- Secure password hashing using Flask-Bcrypt
- Password validation
- Email verification for account security
- Password management through account settings
- Protected routes based on authentication state
- Backend authorization checks to prevent unauthorized modifications

### 2. Account Settings

Registered users can access account settings to manage their information and account security.

Features include:

- Viewing and updating account information
- Managing email-related account settings
- Changing account passwords
- Accessing account security features
- Managing personal profile information

Sensitive account modifications require appropriate authentication and backend validation.

### 3. Artwork Gallery

Visitors can browse a public gallery of artworks.

Features include:

- Interactive and draggable artwork gallery
- Artwork details panel
- Artwork images and descriptions
- Artist and collection information
- Search functionality
- Pagination with Previous and Next controls
- Responsive layouts across different devices

Users can search artwork by title, artist, collection, and medium.

### 4. Portfolio Management

Authenticated users can create and manage their personal art portfolios.

Users can:

- Create, view, edit, and delete artist profiles
- Create collections associated with their artists
- Add artworks to collections
- Edit artwork information
- Upload artwork images
- Delete their own artworks and collections
- View portfolio statistics on their personal dashboard

Backend ownership checks ensure users cannot modify resources belonging to another account.

### 5. Cloudinary Image Uploads

Shilpo integrates **Cloudinary** for cloud-based image storage and management.

Users can upload images directly when adding artworks to their portfolios.

Features include:

- Direct artwork image uploads
- Cloud-hosted image storage
- Image URLs associated with artwork records
- Displaying uploaded artwork images throughout the application

Cloudinary allows images to be stored separately from the PostgreSQL database while keeping their references available through the application.

### 6. Newsroom

The Newsroom is a dedicated space for discovering exhibitions and exploring art.

Features include:

- Public exhibition listings
- Exhibition cards with cover images
- Exhibition descriptions and locations
- Exhibition dates and visiting hours
- Associated artworks
- Responsive exhibition layouts
- GSAP-powered artwork animations

The Newsroom also features a continuously scrolling artwork train showcasing artworks from the platform.

Visitors can explore exhibitions without needing an account.

### 7. Exhibition Management

Exhibitions are managed exclusively by administrators.

Authorized administrators can:

- Create and publish exhibitions
- Edit exhibition information
- Delete exhibitions
- Add exhibition cover images
- Set exhibition start and end dates
- Specify exhibition locations and visiting hours
- Associate multiple existing artworks with an exhibition

Exhibition management uses role-based authorization to restrict modifications to administrator accounts.

### 8. Interactive Animations

Shilpo uses GSAP to enhance the user experience.

The application includes a horizontally scrolling artwork train that continuously showcases artwork images.

These animations complement the platform's minimalist design while keeping the artwork as the main focus.

## Data Relationships

Shilpo uses relational database models to organize user portfolios and exhibitions.

- A user can own multiple artist profiles.
- An artist can have multiple collections.
- A collection can contain multiple artworks.
- An artwork's owner is determined through its collection and artist.
- An exhibition can contain multiple artworks.
- An artwork can appear in multiple exhibitions.
- Exhibitions are associated with the user who created them.

Exhibitions and artworks are connected through a many-to-many relationship using the `exhibition_artworks` association table.

Deleting an artist also deletes its associated collections and artworks. Deleting a collection also deletes its artworks.

## Project Structure

```text
shilpo/
├── backend/
│   ├── Pipfile
│   ├── Pipfile.lock
│   └── server/
│       ├── migrations/
│       ├── app.py
│       ├── auth.py
│       ├── models.py
│       └── seed.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Git
- Node.js and npm
- Python 3.14, as specified in the backend Pipfile
- Pipenv
- PostgreSQL

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL> shilpo
cd shilpo
```

Replace `<YOUR_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
pipenv install
```

Make sure PostgreSQL is running, then create the database:

```bash
createdb shilpo
```

### 3. Configure Environment Variables

Create a `.env` file inside `backend/`:

```dotenv
DATABASE_URL=postgresql+psycopg://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/shilpo
SECRET_KEY=YOUR_RANDOM_SECRET_KEY
```

Cloudinary and email verification may require additional environment variables depending on your implementation.

For example, Cloudinary integrations commonly use:

```dotenv
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

Use the exact environment variable names expected by your application.

Generate a secure Flask secret key:

```bash
python -c 'import secrets; print(secrets.token_hex(32))'
```

Never commit passwords, API keys, or environment secrets to GitHub.

### 4. Apply Database Migrations

From `backend/`:

```bash
cd server
pipenv run flask --app app db upgrade
```

### 5. Start Flask

```bash
pipenv run flask --app app run --port 5555 --debug
```

The backend runs locally at:

```text
http://localhost:5555
```

### 6. Start React

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### 7. Frontend and Backend Communication

During local development, Vite uses a proxy to forward API requests to Flask.

Example `vite.config.js` configuration:

```javascript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5555",
      changeOrigin: true,
    },
  },
},
```

Frontend requests use `credentials: "include"` to support session-based authentication.

In production, the frontend and backend are hosted separately on Vercel and Render, requiring appropriate API URLs, CORS configuration, and secure session-cookie settings.

## Using Shilpo

1. Visit the homepage to explore the platform.
2. Browse the public artwork gallery.
3. Search for artwork by title, artist, collection, or medium.
4. Explore the Newsroom and published exhibitions.
5. Sign up or log in to access your account.
6. Complete email verification where required.
7. Open the personal dashboard.
8. Create an artist profile.
9. Create a collection associated with that artist.
10. Add artworks to the collection.
11. Upload artwork images using Cloudinary.
12. Edit or delete your portfolio content.
13. Access account settings to manage profile and password information.
14. Log out when finished.

Administrators have additional permissions to create, edit, and delete exhibitions.

## Artwork Images

Shilpo supports direct artwork image uploads using Cloudinary.

Users can select and upload artwork images when creating artwork records. Uploaded images are stored using Cloudinary, and their URLs are associated with the corresponding artwork records.

The application also supports image URLs where applicable.

For externally hosted artwork images, users should ensure they have permission to use the images and that the URLs are publicly accessible.

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/signup` | Register a new account |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/check_session` | Retrieve current session information |
| DELETE | `/api/logout` | End the current session |

### Portfolio Resources

The following RESTful operations are supported for artists, collections, and artworks.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/<resource>` | Public |
| GET | `/api/<resource>/<id>` | Public |
| POST | `/api/<resource>` | Authenticated users |
| PATCH | `/api/<resource>/<id>` | Resource owner |
| DELETE | `/api/<resource>/<id>` | Resource owner |

Supported resources:

- `artists`
- `collections`
- `artworks`

### Exhibition Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/exhibitions` | Public |
| POST | `/api/exhibitions` | Admin only |
| PATCH | `/api/exhibitions/<id>` | Admin only |
| DELETE | `/api/exhibitions/<id>` | Admin only |

Exhibition creation requires a title, start date, end date, and at least one associated artwork.

### Email Verification and Account Settings

Account security features include email verification and password management.

The exact API endpoint paths depend on the authentication and account-management implementation.

Sensitive account requests must verify the user's identity and enforce server-side authorization.

### API Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Resource deleted |
| 401 | Authentication required |
| 403 | Access denied |
| 404 | Resource not found |
| 422 | Validation error |

### Artwork Pagination

Example request:

```text
GET /api/artworks?page=1&per_page=12
```

Example response:

```json
{
  "items": [],
  "page": 1,
  "per_page": 12,
  "total": 0,
  "total_pages": 0,
  "has_next": false,
  "has_prev": false
}
```

Requests without pagination parameters return the full artwork array for gallery management and dashboard functionality.

## Authentication and Authorization

Shilpo uses Flask sessions to manage user authentication.

Passwords are hashed using Flask-Bcrypt before being stored in the database.

Users can manage their own portfolio resources, while administrators have additional permissions to manage exhibitions.

Authorization is enforced by the Flask backend rather than relying solely on frontend visibility.

The application distinguishes between:

- **Visitors:** Browse public artwork and exhibitions.
- **Registered users:** Manage their own art portfolios and account settings.
- **Administrators:** Manage exhibitions and access administrator-specific features.

## Verification and Testing

Before submission, verify the following functionality:

- Signup, login, and logout
- Session persistence after refreshing
- Email verification
- Password validation and password management
- Account settings
- Creating, editing, and deleting artists
- Creating, editing, and deleting collections
- Creating, editing, and deleting artworks
- Uploading artwork images through Cloudinary
- Creating, editing, and deleting exhibitions as an administrator
- Preventing regular users from accessing admin-only operations
- User ownership restrictions
- Search and pagination
- Exhibition artwork relationships
- Responsive layouts
- Image loading
- GSAP animations
- Form validation and error messages

## Screenshots

![Shilpo screenshot 1](./frontend/public/shilpo-ss.png)

![Shilpo screenshot 2](./frontend/public/shilpo-ss2.png)

## Deployment

Shilpo is deployed using the following services:

**Frontend — Vercel:**  
https://shilpo-one.vercel.app/

**Backend — Render:**  
https://shilpo-api.onrender.com/

**Database — PostgreSQL**

**Image Storage — Cloudinary**

The frontend is deployed on Vercel, while the Flask backend runs on Render.

PostgreSQL manages relational application data, and Cloudinary provides cloud-based image storage.

Because the backend uses Render's free hosting tier, the server may enter a sleep state during inactivity. The first request after inactivity may take longer than usual.

## Creator

Created by **Humaiara Diea**.