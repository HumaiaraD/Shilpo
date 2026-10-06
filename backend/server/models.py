from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
db = SQLAlchemy()
from sqlalchemy.ext.associationproxy import association_proxy
from marshmallow import Schema, fields

#defining models here:

class Artists(db.Model):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    info = db.Column(db.String(500), nullable=True)

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
    name = fields.String(required=True)
    info = fields.String(allow_none=True)

    collections = fields.Nested(lambda: CollectionSchema(exclude=("artist",)), many=True, dump_only=True)


class Collection(db.Model):
    __tablename__ = 'collections'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    #relationships
    artist_id = db.Column(db.Integer, db.ForeignKey("artists.id"), nullable=False)
    artist = db.relationship('Artists', backref=db.backref('collections', cascade="all, delete-orphan"), lazy=True)

    #validations
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
        if len(value) > 500 :
            raise ValueError("Description cannot be that long.")
        return value

    def __repr__(self):
        return f"<Collection {self.id}, {self.title}, {self.image_url}, {self.description}>"

class CollectionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String(required=True)
    image_url = fields.String()
    description = fields.String(allow_none=True)

    artist_id = fields.Int(required=True)
    artist = fields.Nested(lambda: ArtistSchema(exclude=("collections",)), dump_only=True)
    artworks = fields.Nested(lambda: ArtworkSchema(exclude=("collection",)), many=True, dump_only=True)


class Artworks(db.Model):
    __tablename__ = 'artworks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    medium = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(500), nullable=True)

    #relationships
    collection_id = db.Column(db.Integer, db.ForeignKey("collections.id"), nullable=False)
    collection = db.relationship('Collection', backref=db.backref('artworks', cascade="all, delete-orphan"), lazy=True)

    #association proxy
    artist = association_proxy('collection', 'artist')

    #validations
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
            raise ValueError("Medium must be text.")

        value = value.strip()

        if len(value) > 100:
            raise ValueError("Medium cannot exceed 100 characters.")

        return value

    @validates("description")
    def validate_description(self, key, value):
        if value is None:
            return None
        value = value.strip()
        if len(value) > 500 :
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
    collection_id = fields.Int()

    collection = fields.Nested(lambda: CollectionSchema(exclude=("artworks",)), dump_only=True)

    