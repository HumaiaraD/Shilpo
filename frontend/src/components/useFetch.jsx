import React, { useEffect, useState } from 'react'

const useFetch = (endpoint, page = null, perPage = 12) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  
    const [pagination, setPagination] = useState(null); 

    // useEffect(() => {
    //     fetch(endpoint, {credentials: "include"})
    //         .then((res) => {
    //             if(!res.ok) {throw new Error("Failed to fetch items")}
    //             return res.json();
    //         })
    //         .then((items) => {
    //             setItems(items);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             setError(error);
    //             setLoading(false);
    //         })
    // }, [endpoint])
    useEffect(() => {
        const controller = new AbortController();

        async function fetchItems(){
            setLoading(true);
            setError(null);

            try {
                const url = new URL(endpoint);

                if (page != null) {
                    url.searchParams.set("page", String(page));
                    url.searchParams.set("per_page", String(perPage));
                }
                const response = await fetch(url.toString(), {
                    credentials: "include",
                    signal: controller.signal,
                });
                if (!response.ok){
                    throw new Error("Failed to fecth items.")
                }
                const data = await response.json();

                if (controller.signal.aborted) return;

                if (Array.isArray(data)){
                    setItems(data);
                    setPagination(null);
                } else {
                    setItems(data.items);
                    setPagination({
                        page: data.page,
                        perPage: data.per_page,
                        total: data.total,
                        totalPages: data.total_pages,
                        hasNext: data.has_next,
                        hasPrev: data.has_prev,
                    })
                }

            } catch (err) {
                if (err.name != "AbortError"){
                    setError(err);
                }
            } finally {
                if (!controller.signal.aborted){
                    setLoading(false);
                }
            }
        }
        fetchItems();
        return () => controller.abort();
    }, [endpoint, page, perPage]);

    async function addItem(newItem) {
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newItem),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || JSON.stringify(data.errors) || "Failed to add item."
                );
            }

            setItems((currentItems) => [...currentItems, data]);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    }

    async function updateItem(id, updatedData) {
        setError(null);

        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    JSON.stringify(data.errors) ||
                    "Failed to update item."
                );
            }

            setItems((currentItems) =>
                currentItems.map((item) =>
                    item.id === data.id ? data : item
                )
            );

            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    }

    async function deleteItem(id) {
        setError(null);

        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete item.");
            }

            setItems((currentItems) =>
                currentItems.filter((item) => item.id !== id)
            );
        } catch (err) {
            setError(err);
            throw err;
        }
    }

    // async function refreshItems() {.  *******-   add later   -*****
    //     try {
    //         const response = await fetch(endpoint, {
    //             credentials: "include",
    //         })
    //         if (!response.ok) {
    //             throw new Error("Failed to refresh items.");
    //         }

    //         const data = await response.json();
    //         setItems(data)
    //         setError(null);
    //     } catch(err){
    //         setError(err);
    //         throw err;
    //     }
    // }

  return { items, loading, error, pagination, addItem, updateItem, deleteItem,}
    
}

export default useFetch