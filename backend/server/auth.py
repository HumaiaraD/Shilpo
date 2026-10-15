from flask import Blueprint, request, session
from sqlalchemy.exc import IntegrityError
from models import db, User, UserSchema

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    password = data.get("password")

    if not isinstance(username, str) or not username.strip():
        return {"error": "Username is required."}, 400

    username = username.strip()

    if len(username) > 100:
        return {"error": "Username cannot exceed 100 characters."}, 400

    try:
        user = User(username=username)
        user.password_hash = password

        db.session.add(user)
        db.session.commit()

    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 400

    except IntegrityError:
        db.session.rollback()
        return {"error": "Username is already taken."}, 409

    session.clear()
    session["user_id"] = user.id

    return UserSchema().dump(user), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    password= data.get("password")

    if not isinstance(username, str) or not isinstance(password, str):
        return {"error": "Username and password is required."}, 400

    user = User.query.filter_by(username=username.strip()).first()

    if user is None or not user.authenticate(password):
        return {"error": "Invalid username or password."}, 401

    session.clear()
    session["user_id"] = user.id

    return UserSchema().dump(user), 200


@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    session.clear()
    return "", 204

@auth_bp.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Not logged in."}, 401

    user = db.session.get(User, user_id)

    if user is None:
        session.clear()
        return {"error": "Not logged in."}, 401

    return UserSchema().dump(user), 200
