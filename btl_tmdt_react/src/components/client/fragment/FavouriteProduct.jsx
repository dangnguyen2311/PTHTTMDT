import React, { useState, useEffect } from "react";
import axios from "axios";

export const FavouriteProduct = ({ product }) => {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favouriteProductId, setFavouriteProductId] = useState(null);

    useEffect(() => {
        const fetchFavouriteProduct = async () => {
            try {
                const res = await axios.post(`/api/v1/favourite-products/check/${product.prodId}`, {
                    withCredentials: true,
                });

                const fav = res.data.favouriteProductId;
                if (fav) {
                    setLiked(true);
                    setFavouriteProductId(fav);
                    // window.location.reload();
                    console.log("Sản phẩm yêu thích:", fav);
                } else {
                    setLiked(false);
                    setFavouriteProductId(null);
                }
            } catch (error) {
                console.error("Error when fetching favourite products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavouriteProduct();
    }, [product.prodId]);

    const handleToggleLike = async () => {
        try {
            if (liked) {
                await axios.post(`/api/v1/favourite-products/remove/${favouriteProductId}`, {
                    // params: { favouriteProductId: favouriteProductId },
                    withCredentials: true,
                });
                setLiked(false);
                setFavouriteProductId(null);
            } else {
                await axios.post(`/api/v1/favourite-products/add/${product.prodId}`, {
                    withCredentials: true,
                });
                // window.location.reload();
                setLiked(true);
            }
        } catch (error) {
            console.error("Lỗi khi toggle yêu thích:", error);
        }
    };

    if (loading) return null;

    return (
        <div
            className={`favorit-items ${liked ? 'bg-danger text-white' : 'border'}`}
            onClick={handleToggleLike}
            style={{ cursor: 'pointer', padding: '8px', borderRadius: '6px' }}
        >
            <span className={`flaticon-heart ${liked ? 'text-white' : ''}`}>
            </span>
        </div>
    );
};
