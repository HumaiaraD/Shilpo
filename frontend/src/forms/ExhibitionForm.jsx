import { useState} from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../components/useFetch";

const ExhibitionForm = ({ user }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const inputStyle = "w-full border-b border-neutral-300 bg-transparent py-3 px-2 outline-none focus:border-black";
    
    const location = useLocation();
    const exhibitionToEdit = location.state?.exhibition;
    const isEditing = Boolean(exhibitionToEdit);

    const { items: artworks } = useFetch("/api/artworks");
    const { addItem, updateItem } = useFetch("/api/exhibitions");

    const [formData, setFormData] = useState({
        title: exhibitionToEdit?.title || "",
        description: exhibitionToEdit?.description || "",
        location: exhibitionToEdit?.location || "",
        start_date: exhibitionToEdit?.start_date || "",
        end_date: exhibitionToEdit?.end_date || "",
        visiting_hours: exhibitionToEdit?.visiting_hours || "",
        cover_image_url: exhibitionToEdit?.cover_image_url || "",
        artwork_ids: exhibitionToEdit?.artworks?.map((artwork) => artwork.id) || [],
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            if (isEditing) {
                await updateItem(exhibitionToEdit.id, formData);
            } else {
                await addItem(formData);
            }

            navigate("/newsroom");
        } catch (error) {
            setSubmitError(error.message);
        } finally {
       
    };
    }
    if (!user?.is_admin) {
        return <p>Admin access required.</p>;
    }

  return (
    <>
          <section>
                <form
                  onSubmit={handleSubmit}
                  id="artistForm"
                  className="flex flex-col sm:gap-2 md:gap-4 sm:m-2 md:m-20"
                >
                  <h1 className="text-3xl m-auto">Create and Submit an Exhibition</h1>
        
                  <label htmlFor="title" className="text-sm">
                    Exhibition Title *
                    </label>
                    <input
                    id="title"
                    name="title"
                    placeholder="Enter exhibition title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    />

                <div>
                    <label htmlFor="description" className="text-sm">
                    Description
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about the exhibition..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={inputStyle}
                    />
                </div>

                <div>
                    <label htmlFor="cover_image_url" className="text-sm">
                    Cover Image URL
                    </label>
                    <input
                    id="cover_image_url"
                    name="cover_image_url"
                    type="url"
                    placeholder="Paste your image URL here"
                    value={formData.cover_image_url}
                    onChange={handleChange}
                    className={inputStyle}
                    />
                </div>

                <div>
                    <label htmlFor="location" className="text-sm">
                    Location
                    </label>
                    <input
                    id="location"
                    name="location"
                    placeholder="Gallery or museum"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputStyle}
                    />
                </div>

                <div>
                    <label htmlFor="start_date" className="text-sm">
                    Start Date
                    </label>
                    <input
                    id="start_date"
                    name="start_date"
                    type='date'
                    placeholder="add a date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={inputStyle}
                    />
                </div>

                <div>
                    <label htmlFor="end_date" className="text-sm">
                    End Date
                    </label>
                    <input
                    id="end_date"
                    name="end_date"
                    placeholder="end date"
                    type='date'
                    value={formData.end_date}
                    onChange={handleChange}
                    className={inputStyle}
                    />
                </div>

                <div>
                    <label htmlFor="visiting_hours" className="text-sm">
                    Visiting Hours
                    </label>
                    <input
                    id="visiting_hours"
                    name="visiting_hours"
                    placeholder="Visit duing..."
                    value={formData.visiting_hours}
                    onChange={handleChange}
                    className={inputStyle}
                    />
                </div>

                <div>
    <label htmlFor="artwork_ids">Select Artworks</label>
    <select
        id="artwork_ids"
        multiple
        value={formData.artwork_ids.map(String)}
        onChange={(e) => {
            const selectedIds = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
            );

            setFormData((prev) => ({
                ...prev,
                artwork_ids: selectedIds,
            }));
        }}
        className={inputStyle}
        required
    >
        {artworks?.map((artwork) => (
            <option key={artwork.id} value={artwork.id}>
                {artwork.title}
            </option>
        ))}
    </select>
</div>

                {submitError && (
                    <p role="alert" className="text-sm text-red-600">
                    {submitError}
                    </p>
                )}

                <div className="flex items-center justify-between pt-6">
                    <button
                    type="button"
                    onClick={() => navigate("/newsroom")}
                    className="text-sm text-neutral-500 hover:text-black"
                    >
                    ← Cancel
                    </button>

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-neutral-900 px-8 py-4 text-sm
                                text-white transition hover:bg-neutral-700
                                disabled:opacity-50"
                    >
                    {isSubmitting ? "Publishing..." : "Publish Exhibition →"}
                    </button>      
                </div>
                </form>
            </section>
    </>
  )
}

export default ExhibitionForm