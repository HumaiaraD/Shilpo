from app import app
from models import db, Artists, Collection, Artworks

with app.app_context():
    artist = Artists.query.filter_by(name="Humaiara Diea").first()

    if artist is None:
        artist = Artists(
            name="Humaiara Diea",
            info="An artist exploring acrylics and visual design."
        )

        collection = Collection(
            title="Acrylic Mastering",
            description="Landscapes inspired by nature.",
            artist=artist
        )

        artwork = Artworks(
            title="Sunset Lake",
            description="An acrylic painting of a lake at sunset.",
            image_url="https://placehold.co/600x400?text=Sunset+Lake",
            collection=collection
        )

        db.session.add_all([artist, collection, artwork])
        db.session.commit()

        print("Sample data added!")
    else:
        print("Sample artist already exists; no data added.")