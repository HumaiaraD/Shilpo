### Shilpo — A Space for Artists and Their Art
Shilpo is a full-stack art portfolio manager that helps artists, curators, and studios organize and showcase their work. Users can explore artists, browse their collections, and view individual artworks, while an admin interface supports managing all three resources.
# Technologies Used
- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Python, Flask, Flask-CORS
- Database: PostgreSQL, Flask-SQLAlchemy, Flask-Migrate
- Validation and Serialization: Marshmallow
- Package Management: npm, Pipenv
# Core Functionality
- Browse artists, collections, and artworks through a responsive interface.
- Create, view, edit, and delete artist profiles.
- Organize collections under individual artists.
- Add artworks to collections with titles, descriptions, and image URLs.
- Manage records through an admin dashboard with reusable forms.
- Validate submitted data on the backend.
# Data Relationships
- An artist can have multiple collections.
- A collection can have multiple artworks.
- Each artwork belongs to an artist through its collection.
- Deleting an artist removes their collections and artworks.
- Deleting a collection removes its artworks.
# Setup and Run Instructions
Prerequisites
Install the following before getting started:
- Node.js and npm
- Python compatible with the project's Pipfile
- Pipenv
- PostgreSQL
- Git
These instructions assume the project has separate frontend and backend folders.
1. Clone the Repository
Replace the placeholder with your repository URL:
git clone <YOUR_REPOSITORY_URL> shilpo
cd shilpo

2. Set Up the Backend
cd backend
pipenv install

Make sure PostgreSQL is running, then create the database:
createdb shilpo

Configure your backend's SQLALCHEMY_DATABASE_URI to connect to this database. If your application reads a DATABASE_URL environment variable, its value should follow this format:
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/shilpo

Create a .env file in the backend folder and add your PostgreSQL connection URL. Replace the placeholders with your own credentials. Ensure .env is listed in .gitignore.
Apply the existing database migrations:
pipenv run flask --app app db upgrade

Start the Flask server:
pipenv run flask --app app run --port 5555 --debug

The backend runs at:
http://127.0.0.1:5555

3. Set Up the Frontend
Open another terminal and navigate to the project's frontend folder:
cd frontend
npm install
npm run dev

Open the URL displayed in the terminal, usually:
http://localhost:5173

Ensure the frontend API requests point to the Flask backend and that the backend's CORS configuration allows the frontend's origin.
# Using the Application
1. Open the application to explore artists, collections, and artworks.
2. Navigate to /admin to manage portfolio records.
3. Create an artist.
4. Add a collection associated with that artist.
5. Add artworks associated with the collection.
6. Use the management view to edit or delete records.
# Deployment
Live Site: link here.
Future Improvements
- Admin authentication and authorization
- Search and filtering
- Pagination for larger portfolios