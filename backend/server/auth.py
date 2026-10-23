from flask import Blueprint, request, session
from marshmallow import ValidationError, fields
from sqlalchemy.exc import IntegrityError

from models import User, UserSchema, db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if not isinstance(username, str) or not username.strip():
        return {"error": "Username is required."}, 400

    if not isinstance(email, str) or not email.strip():
        return {"error": "Email is required."}, 400

    username = username.strip()
    email = email.strip().lower()

    if len(username) > 100:
        return {"error": "Username cannot exceed 100 characters."}, 400

    if len(email) > 100:
        return {"error": "Email cannot exceed 100 characters."}, 400

    try:
        UserSchema().load({"username": username, "email": email})
    except ValidationError as error:
        return {"errors": error.messages}, 400

    try:
        user = User(username=username, email=email)
        user.password_hash = password

        db.session.add(user)
        db.session.commit()

    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 400

    except IntegrityError:
        db.session.rollback()
        return {"error": "Username or email is already registered."}, 409

    session.clear()
    session["user_id"] = user.id

    return UserSchema().dump(user), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    identifier = username or email

    if not isinstance(password, str) or not password:
        return {"error": "Password is required."}, 400

    if not isinstance(identifier, str) or not identifier.strip():
        return {"error": "Username or Email is required"}, 400

    identifier = identifier.strip().lower()
    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

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


# ------------for accounts sessions ---------------------


@auth_bp.route("/account", methods=["PATCH"])
def update_account():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Not logged in"}, 401

    user = db.session.get(User, user_id)
    if not user:
        session.clear()
        return {"error": "Not logged in"}, 401

    data = request.get_json(silent=True) or {}

    username = data.get("username")
    email = data.get("email")

    # -----for username-------
    if not isinstance(username, str) or not username.strip():
        return {"error": "Username is required."}, 400

    username = username.strip()
    if len(username) > 100:
        return {"error": "Username must be under 100 characters."}, 400

    existing_users = User.query.filter(
        User.username == username, User.id != user.id
    ).first()

    if existing_users:
        return {"error": "Username is already taken."}, 409

    # -----email---------
    if not isinstance(email, str) or not email.strip():
        return {"error": "Email is required."}, 400

    email = email.strip().lower()
    if len(email) > 100:
        return {"error": "email must be 100 characters or fewer."}, 400

    try:
        fields.Email().deserialize(email)
    except ValidationError:
        return {"error": "Enter a valid email address."}, 400

    existing_users = User.query.filter(User.email == email, User.id != user.id).first()

    if existing_users:
        return {"error": "Email is already taken."}, 409

    user.username = username

    if email != user.email:
        user.email = email
        user.email_verified = False

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Username or email is already in use."}, 409

    return UserSchema().dump(user), 200


# -------------for passwords---------------


@auth_bp.route("/account/password", methods=["PATCH"])
def update_password():
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Not logged in."}, 401

    user = db.session.get(User, user_id)

    if not user:
        session.clear()
        return {"error": "Not logged in"}, 401

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {"error": "A JSON object is required."}, 400

    
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not isinstance(current_password, str) or not current_password:
        return {"error": "All password fields are required"}, 400
    if not isinstance(new_password, str) or not new_password:
        return {"error": "All password fields are required"}, 400
    if not isinstance(confirm_password, str) or not confirm_password:
        return {"error": "All password fields are required"}, 400

    if not user.authenticate(current_password):
        return {"error": "Current password is incorrect."}, 400

    if new_password != confirm_password:
        return {"error": "New passwords do not match"}, 400

    try:
        user.password_hash = new_password
        db.session.commit()
    except ValueError as err:
        db.session.rollback()
        return {"error": str(err)}, 400

    return {"message": "Password updated successfully!"}, 200
    