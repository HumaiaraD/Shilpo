import { useEffect, useRef } from "react";
import gsap from "gsap";
import useFetch from "../components/useFetch";


const Train = () => {
    const { items: artworks } = useFetch("/api/artworks");
    const trainRef = useRef(null);

    useEffect(() => {
        if (!artworks.length || !trainRef.current) return;

        const animation = gsap.to(trainRef.current, {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1,
        });

        return () => animation.kill();
    }, [artworks.length]);

  return (
    <>
        <section className="overflow-hidden w-full py-8">
            <div ref={trainRef} className="flex w-max">
                {[...artworks, ...artworks].map((artwork, index) => (
                <img
                    key={`${artwork.id}-${index}`}
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="h-50 w-auto mx-2 object-cover shrink-0"
                />
                ))}
            </div>
        </section>
    </>
  )
}

export default Train