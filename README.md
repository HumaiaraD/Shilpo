# Shilpo — A Space for Artists and Their Art

vercel deployed link: https://shilpo-one.vercel.app/  - wait a minute cause free render is sleeping
render deployment: https://shilpo-api.onrender.com/ - give it a minute before you judge

Shilpo is a full-stack art portfolio manager that helps artists and small collection managers organize and showcase artwork.

Visitors can browse and search the public artwork gallery. Registered users can manage their own artist profiles, collections, and artworks through a protected portfolio dashboard.

## Technologies Used

- **Frontend:** React, Vite, React Router, Tailwind CSS, Tailgrids
- **Animation:** GSAP
- **Backend:** Python, Flask, Flask-CORS
- **Database:** PostgreSQL, Flask-SQLAlchemy, Flask-Migrate, Psycopg
- **Authentication:** Flask sessions and Flask-Bcrypt
- **Validation and Serialization:** Marshmallow
- **Package Management:** npm and Pipenv

## Core Functionality

- Signup, login, logout, and session persistence across page refreshes.
- Public artwork gallery with a draggable layout and an artwork details panel.
- Full create, read, update, and delete functionality for artists, collections, and artworks.
- Backend ownership checks that restrict modifications to the record owner.
- Ownership checks when adding or moving collections and artworks.
- Personal dashboard displaying the user's artwork and portfolio counts.
- Search by artwork title, artist, collection, and medium.
- Paginated artwork requests with Previous and Next controls.
- Reusable forms with validation and error feedback.
- Responsive layouts and GSAP animations.

## Data Relationships

- A user can own multiple artist profiles.
- An artist can have multiple collections.
- A collection can have multiple artworks.
- An artwork's artist and owner are determined through its collection.
- Deleting an artist also deletes their collections and artworks.
- Deleting a collection also deletes its artworks.

Collections contain a title, description, and artist association. Artworks contain a title, image URL, medium, description, and collection association.

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
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Setup and Run Instructions

### Prerequisites

- Git
- Node.js and npm
- Python 3.14, as specified in the backend Pipfile
- Pipenv
- PostgreSQL

### 1. Clone the Repository

Replace the placeholder with this project's repository URL.

```bash
git clone <YOUR_REPOSITORY_URL> shilpo
cd shilpo
```

### 2. Install Backend Dependencies

```bash
cd backend
pipenv install
```

Make sure PostgreSQL is running, then create a local database:

```bash
createdb shilpo
```

### 3. Configure Environment Variables

Create a `.env` file inside `backend/`:

```dotenv
DATABASE_URL=postgresql+psycopg://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/shilpo
SECRET_KEY=YOUR_RANDOM_SECRET_KEY
```

Replace the placeholders with your local database credentials and a random secret key.

Generate a secret key with:

```bash
python -c 'import secrets; print(secrets.token_hex(32))'
```

Keep `.env` excluded from Git. Never commit database passwords or secret keys.

### 4. Apply Database Migrations

From `backend/`, enter the server folder and apply the existing migrations:

```bash
cd server
pipenv run flask --app app db upgrade
```

### 5. Start Flask

From `backend/server/`:

```bash
pipenv run flask --app app run --port 5555 --debug
```

The backend is available at:

```text
---http://localhost:5555
```

### 6. Start React

Open another terminal. From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the address shown in the terminal, usually:

```text
http://localhost:5173
```

Use `localhost` consistently for both servers. The backend CORS configuration must allow the frontend origin and credentials. Frontend API requests include `credentials: "include"` to send session cookies.

## Using Shilpo

1. Open the artwork gallery to browse, search, and view artwork details.
2. Open **My Account** and sign up or log in.
3. Select **Manage Portfolio**.
4. Create an artist profile.
5. Create a collection under that artist.
6. Add an artwork to the collection.
7. Edit or delete your own records.
8. View your artwork on your dashboard.
9. Log out when finished.

## Artwork Images

The application stores image addresses rather than uploaded files.

For an online image, right-click the actual image and choose **Copy Image Address**. Paste the direct image URL into the artwork form.

Pinterest pin pages, Google search pages, and document-sharing links are not direct image URLs. Some image hosts may block embedding or remove images later.

Images bundled in `frontend/public/` can also be referenced using paths such as:

```text
/artworks/painting.jpg
```

Direct file uploads are not currently implemented.

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/signup` | Create an account and start a session |
| POST | `/login` | Authenticate and start a session |
| GET | `/check_session` | Return the authenticated user |
| DELETE | `/logout` | Clear the session |

### Portfolio Resources

The following routes exist for each resource: `artists`, `collections`, and `artworks`.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/<resource>` | Public list |
| GET | `/<resource>/<id>` | Public record details |
| POST | `/<resource>` | Login required; parent ownership checked where applicable |
| PATCH | `/<resource>/<id>` | Record owner only; new parent ownership checked where applicable |
| DELETE | `/<resource>/<id>` | Record owner only |

Unauthenticated modification requests return **401**. Attempts to modify another user's records return **403**. Missing records return **404**.

### Artwork Pagination

```text
GET /artworks?page=1&per_page=12
```

Paginated responses include:

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

Requests without pagination parameters return the full artwork array for existing management and dashboard views.

## Verification

Before submission, verify:

- Signup, login, session persistence, and logout.
- Creating, editing, and deleting all three portfolio resources.
- Record persistence after refreshing the page.
- Ownership restrictions using two separate accounts.
- Restrictions on adding or moving records under another user's artist or collection.
- Artwork pagination and search behavior.
- Responsive layouts, image loading, and error feedback.

## Screenshots

![Shilpo screenshot 1](./frontend/public/shilpo-ss.png)

![Shilpo screenshot 2](./frontend/public/shilpo-ss2.png)

## Deployment

The application currently runs locally using the setup instructions above.

## Future Improvements

- Direct image uploads
- Improved image validation and unavailable-image handling
- Additional accessibility and gallery navigation improvements

## Creator

Created by Humaiara Diea.