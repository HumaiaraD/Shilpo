import { useEffect, useRef } from "react";
import gsap from "gsap";

function Display({ artwork, collection, artist, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.from(panelRef.current, {
        xPercent: 100,
        duration: 0.65,
        ease: "power3.out",
      });

      gsap.from(backdropRef.current, {
        opacity: 0,
        duration: 0.4,
      });

      gsap.from(".detail-content", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.25,
      });
    }, panelRef);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }

      // The close button is the panel's only interactive element.
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-500">
      <div
        ref={backdropRef}
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/35"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-detail-title"
        className="absolute inset-y-0 right-0 w-full overflow-y-auto bg-white p-6 text-stone-800 shadow-2xl sm:w-[55vw] sm:max-w-2xl sm:p-10"
      >
        <div className="mb-6 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-5 py-2 text-sm hover:bg-stone-100"
          >
            Close ✕
          </button>
        </div>

        {artwork.image_url && (
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="detail-content max-h-[50vh] w-full rounded-xl object-contain"
          />
        )}

        <h2
          id="artwork-detail-title"
          className="detail-content mt-8 text-4xl"
        >
          {artwork.title}
        </h2>

        <dl className="mt-6 space-y-5 text-base">
          <div className="detail-content">
            <dt className="text-xs uppercase tracking-widest text-stone-500">
              Artist
            </dt>
            <dd className="mt-1">{artist?.name ?? "Unknown artist"}</dd>
          </div>

          <div className="detail-content">
            <dt className="text-xs uppercase tracking-widest text-stone-500">
              Collection
            </dt>
            <dd className="mt-1">
              {collection?.title ?? "Unknown collection"}
            </dd>
          </div>

          <div className="detail-content">
            <dt className="text-xs uppercase tracking-widest text-stone-500">
              Medium
            </dt>
            <dd className="mt-1">{artwork.medium || "Not specified"}</dd>
          </div>

          <div className="detail-content">
            <dt className="text-xs uppercase tracking-widest text-stone-500">
              Description
            </dt>
            <dd className="mt-2 whitespace-pre-wrap leading-relaxed">
              {artwork.description || "No description provided."}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

export default Display;