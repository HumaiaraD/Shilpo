import os
from flask import Flask, make_response, request
from flask_cors import CORS
from flask_migrate import Migrate
from marshmallow import ValidationError
from dotenv import load_dotenv
from pathlib import Path

from models import *

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Define Routes here
@app.route("/", methods=["GET"])
def index():
    return "<h1>Welcome to my Art app.</h1>"


if __name__ == '__main__':
    app.run(port=5555, debug=True)
