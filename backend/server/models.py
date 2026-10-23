from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates

db = SQLAlchemy()
from flask_bcrypt import Bcrypt
from marshmallow import Schema, fields
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

bcrypt = Bcrypt()

# defining models here:


# adding user auth:
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)

    # adding email and verifications
    email = db.Column(db.String(100), nullable=True, unique=True)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)

    @validates("email")
    def validate_email(self, key, value):
        if not isinstance(value, str):
            raise TypeError("Email must be text.")
        return value.strip().lower()

    @validates("username")
    def validate_username(self, key, value):
        if not isinstance(value, str):
            raise TypeError("Username must be text.")
        return value.strip().lower()

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        if not isinstance(password, str) or len(password) < 8:
            raise ValueError("Password must have at least 8 characters.")

        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must not exceed 72 bytes.")

        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.String(required=True)

    email = fields.Email()
    email_verified = fields.Boolean(dump_only=True)


class Artists(db.Model):
    __tablename__ = "artists"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    info = db.Column(db.String(500), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    user = db.relationship("User", backref="artists")

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name cannot be empty.")
        if len(name) > 100:
            raise ValueError("Name cannot exceed 100 characters.")
        if name.strip() == "":
            raise ValueError("Name cannot be just whitespace.")
        return name

    @validates("info")
    def validate_info(self, key, info):
        if info and len(info) > 500:
            raise ValueError("Info cannot exceed 500 characters.")
        if info and info.strip() == "":
            raise ValueError("Info cannot be just whitespace.")
        return info

    def __repr__(self):
        return f"<Artist {self.id}, {self.name}, {self.info}>"


class ArtistSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.String(
        required=True,
    )
    info = fields.String(allow_none=True)

    collections = fields.Nested(
        lambda: CollectionSchema(exclude=("artist",)), many=True, dump_only=True
    )


class Collection(db.Model):
    __tablename__ = "collections"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    # relationships
    artist_id = db.Column(db.Integer, db.ForeignKey("artists.id"), nullable=False)
    artist = db.relationship(
        "Artists",
        backref=db.backref("collections", cascade="all, delete-orphan"),
        lazy=True,
    )

    # validations
    @validates("title")
    def validate_title(self, key, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError("Title cannot be empty.")

        value = value.strip()

        if len(value) > 100:
            raise ValueError("Title cannot exceed 100 characters.")

        return value

    @validates("description")
    def validate_description(self, key, value):
        if value is None:
            return None
        value = value.strip()
        if len(value) > 500:
            raise ValueError("Description cannot be that long.")
        return value

    def __repr__(self):
        return f"<Collection {self.id}, {self.title}, {self.image_url}, {self.description}>"


class CollectionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String(required=True)
    # image_url = fields.String()
    description = fields.String(allow_none=True)

    artist_id = fields.Int(required=True)
    artist = fields.Nested(
        lambda: ArtistSchema(exclude=("collections",)), dump_only=True
    )
    artworks = fields.Nested(
        lambda: ArtworkSchema(exclude=("collection",)), many=True, dump_only=True
    )


class Artworks(db.Model):
    __tablename__ = "artworks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    medium = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    # relationships
    collection_id = db.Column(
        db.Integer, db.ForeignKey("collections.id"), nullable=False
    )
    collection = db.relationship(
        "Collection",
        backref=db.backref("artworks", cascade="all, delete-orphan"),
        lazy=True,
    )

    # association proxy
    artist = association_proxy("collection", "artist")

    # validations
    @validates("title")
    def validate_title(self, key, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError("Title cannot be empty.")

        value = value.strip()

        if len(value) > 100:
            raise ValueError("Title cannot exceed 100 characters.")
        return value

    @validates("medium")
    def validate_medium(self, key, value):
        if value is None:
            return None

        if not isinstance(value, str):
            raise TypeError("Medium must be text.")

        value = value.strip()
        if not value:
            return None

        if len(value) > 100:
            raise ValueError("Medium cannot exceed 100 characters.")

        return value

    @validates("description")
    def validate_description(self, key, value):
        if value is None:
            return None
        value = value.strip()
        if len(value) > 500:
            raise ValueError("Description cannot be that long.")
        return value

    def __repr__(self):
        return f"<Artwork {self.id}, {self.title}, {self.image_url}, {self.medium}, {self.description}>"


class ArtworkSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String(required=True)
    image_url = fields.String(required=True, allow_none=True)
    medium = fields.String(allow_none=True)
    description = fields.String(allow_none=True)
    collection_id = fields.Int(required=True)

    collection = fields.Nested(
        lambda: CollectionSchema(exclude=("artworks",)), dump_only=True
    )
