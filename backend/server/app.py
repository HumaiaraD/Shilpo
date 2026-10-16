import os
from flask import Flask, make_response, request, session
from flask_cors import CORS
from flask_migrate import Migrate
from marshmallow import ValidationError
from dotenv import load_dotenv
from pathlib import Path
from auth import auth_bp

from models import *

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]

app.register_blueprint(auth_bp)

migrate = Migrate(app, db)

db.init_app(app)
bcrypt.init_app(app)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Define Routes here
@app.route("/", methods=["GET"])
def index():
    return "<h1>Welcome to my Art app.</h1>"


#--------------------------------------------------------------------------------------------------------------

@app.route("/artists", methods=["GET"])
def get_all_artists():
    artists = Artists.query.all()
    body = ArtistSchema(many=True).dump(artists)

    return make_response(body, 200)

@app.route("/artists/<int:id>", methods=["GET"])
def get_artist(id):
    artist = Artists.query.filter(Artists.id == id).first()
    if artist is None:
        return make_response({"error": "Artist not found"}, 404)

    body = ArtistSchema().dump(artist)
    return make_response(body, 200)

@app.route("/artists", methods=["POST"])
def create_artist():
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    try :
        data = ArtistSchema().load(request.get_json()) or {}
        
        artist = Artists(**data, user_id=user_id)
        db.session.add(artist)
        db.session.commit()
        
        return make_response(ArtistSchema().dump(artist), 201)
    
    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
    
    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 422

@app.route("/artists/<int:id>", methods=["PATCH"])
def update_artist(id):
    # validating user id
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    artist = Artists.query.filter(Artists.id == id).first()
    if artist is None:
        return {"error": "Artist not found"}, 404
    if artist.user_id != user_id:
        return {"error": "You can only modify your own artists."}, 403
    try:
        data = ArtistSchema().load(request.get_json(), partial=True)
        for key, value in data.items():
            setattr(artist, key, value)

        db.session.commit()
        return make_response(ArtistSchema().dump(artist), 200)
    
    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
    
    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 422  

@app.route("/artists/<int:id>", methods=["DELETE"])
def delete_artist(id):
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401

    artist = db.session.get(Artists, id)

    if artist is None:
        return {"error": "Artist not found"}, 404

    if artist.user_id != user_id:
        return {"error": "You can only delete your own artists."}, 403

    db.session.delete(artist)
    db.session.commit()

    return "", 204
#--------------------------------------------------------------------------------------------------------------


@app.route("/collections", methods=["GET"])
def get_collections():
    collections = Collection.query.all()
    body = CollectionSchema(many=True).dump(collections)

    return make_response(body, 200)

@app.route("/collections/<int:id>", methods=["GET"])
def get_collection(id):
    collection = Collection.query.filter(Collection.id == id).first()
    if collection is None:
        return make_response({"error": "Collection not found"}, 404)
    body = CollectionSchema().dump(collection)
    return make_response(body, 200)

@app.route("/collections", methods=["POST"])
def create_collection():
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    try:
        data = CollectionSchema().load(request.get_json()) or {}

        artist = db.session.get(Artists, data["artist_id"])
        if artist is None:
            return {"error": "Artist not found"}, 404
        
        if artist.user_id != user_id:
            return {"error": "You can only add collections to your own artists."}, 403

        collection = Collection(**data)
        db.session.add(collection)
        db.session.commit()
        return make_response(CollectionSchema().dump(collection), 201)
    
    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
    
    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 422

@app.route("/collections/<int:id>", methods=["PATCH"])
def update_collection(id):
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401

    collection = Collection.query.filter(Collection.id == id).first()
    if collection is None:
        return {"error": "Collection not found"}, 404
    
    if collection.artist.user_id != user_id:
        return {"error": "You can only modify your own collections."}, 403

    try:
        data = CollectionSchema().load(request.get_json(), partial=True)
        if "artist_id" in data:
            artist = db.session.get(Artists, data["artist_id"])

            if artist is None:
                return {"error": "Artist not found"}, 404

            if artist.user_id != user_id:
                return {"error": "You can only move collections to your own artists."}, 403

        for key, value in data.items():
            setattr(collection, key, value)

        db.session.commit()
        return make_response(CollectionSchema().dump(collection), 200)

    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
    
    except ValueError as error:
        db.session.rollback()
        return {"error": str(error)}, 422

@app.route("/collections/<int:id>", methods=["DELETE"])
def delete_collection(id):
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401

    collection = db.session.get(Collection, id)
    if collection is None:
        return {"error": "Collection not found"}, 404

    if collection.artist.user_id != user_id:
        return {"error": "You can only delete your own collections."}, 403

    db.session.delete(collection)
    db.session.commit()

    return "", 204


#--------------------------------------------------------------------------------------------------------------
@app.route("/artworks", methods=["GET"])
def get_all_artworks():
    # artworks = Artworks.query.all()
    # body = ArtworkSchema(many=True).dump(artworks)

    # return make_response(body, 200)
    query = Artworks.query.order_by(Artworks.id.desc())
    
    if "page" not in request.args and "per_page" not in request.args:
        return ArtworkSchema(many=True).dump(query.all()), 200
    
    try:
        page = int(request.args.get("page", "1"))
        per_page = int(request.args.get("per_page", "12"))
    except ValueError:
        return {"error": "page and per_page must be integers. "}, 400
    
    if page < 1 or not 1 <=  per_page <= 100:
        return {
            "error": "page must be positive; per_page must be between 1 and 100."
        }, 400
    
    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return {
        "items": ArtworkSchema(many=True).dump(pagination.items),
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "total_pages": pagination.pages,
        "has_next": pagination.has_next,
        "has_prev":pagination.has_prev,
    }, 200
    

@app.route("/artworks/<int:id>", methods=["GET"])
def get_artwork(id):
    artwork = Artworks.query.filter(Artworks.id == id).first()
    if artwork is None:
        return make_response({"error": "Artwork not found"}, 404)
    body = ArtworkSchema().dump(artwork)
    return make_response(body, 200)


@app.route("/artworks", methods=["POST"])
def create_artwork():
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    try:
        data = ArtworkSchema().load(request.get_json()) or {}

        collection =db.session.get(Collection, data["collection_id"])
        if collection is None:
            return {"error": "Collection not found"}, 404

        if collection.artist.user_id != user_id:
            return {
                "error": "You can only add artworks to your own collections."
            }, 403

        artwork = Artworks(**data)
        db.session.add(artwork)
        db.session.commit()

        return make_response(ArtworkSchema().dump(artwork)), 201

    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
        
    except ValueError as error:
        db.session.rollback()    
        return {"error": str(error)}, 422  

@app.route("/artworks/<int:id>", methods=["PATCH"])
def update_artwork(id):
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    artwork = Artworks.query.filter(Artworks.id == id).first()

    if artwork is None:
        return {"error": "Artwork not found"}, 404

    if artwork.collection.artist.user_id != user_id:
        return {"error": "You can only modify your own artworks."}, 403


    try:
        data = ArtworkSchema().load(request.get_json(), partial=True)
        if "collection_id" in data:
            collection = db.session.get(Collection, data["collection_id"])

            if collection is None:
                return {"error": "Collection not found"}, 404

            if collection.artist.user_id != user_id:
                return {
                    "error": "You can only move artworks to your own collections."
                }, 403

        for key, value in data.items():
            setattr(artwork, key, value)

        db.session.commit()
        return make_response(ArtworkSchema().dump(artwork)), 200
    
    except ValidationError as error:
        db.session.rollback()
        return {"errors": error.messages}, 422
        
    except ValueError as error:
        db.session.rollback()    
        return {"error": str(error)}, 422  

@app.route("/artworks/<int:id>", methods=["DELETE"])
def delete_artwork(id):
    user_id = session.get("user_id")

    if user_id is None:
        return {"error": "Login required."}, 401
    
    artwork = db.session.get(Artworks, id)
    if artwork is None:
        return {"error": "Artwork not found"}, 404
    
    if artwork.collection.artist.user_id != user_id:
        return {"error": "You can only modify your own artworks."}, 403

    db.session.delete(artwork)
    db.session.commit()

    return "", 204


if __name__ == '__main__':
    app.run(port=5555, debug=True)
