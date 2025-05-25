import React, { useState, useEffect } from "react";

const ProductReview = ({ productId, userName }) => {
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [starpoint, setStarpoint] = useState(5);
    const [error, setError] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/v1/review-product/${productId}`);
            const data = await res.json();
            if(res.ok){
                setReviews(data);
            }
            else {
                console.error("Lỗi khi tải đánh giá:", data.message);
            }

        } catch (err) {
            console.error("Lỗi khi tải đánh giá:", err);
        }
    };

    useEffect(() => {
        fetchReviews();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("Vui lòng nhập nội dung đánh giá!");
            return;
        }
        const newReview = {
            userName: userName || "Khách",
            productId: productId,
            createdDate: new Date().toISOString(),
            content: content,
            rating: starpoint,
            status: 'active',
        };

        try {
            const res = await fetch("/api/v1/review-product/add-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview),
            });

            if (!res.ok) throw new Error("Gửi đánh giá thất bại");
            const savedReview = await res.json();
            setReviews((prev) => [...prev, savedReview]);
            setContent("");
            setStarpoint(5);
            fetchReviews();
        } catch (err) {
            alert("Lỗi khi gửi đánh giá. Vui lòng thử lại!" + err);
        }
    };

    return (
        <div className="review-box mt-4 text-left p-3 border rounded">
            <h5 className="mb-3">Đánh giá sản phẩm</h5>

            {/* Form nhập review */}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    {error && <p style={{margin: '20px auto', color: 'red'}}>{error}</p>}
                <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Viết đánh giá tại đây..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required>

                </textarea>
                </div>
                <div className="form-group mb-2">
                    <label className="mr-2">Chấm điểm:</label>
                    <select
                        value={starpoint}
                        onChange={(e) => setStarpoint(parseInt(e.target.value))}
                        className="form-control w-auto d-inline-block"
                    >
                        {[5, 4, 3, 2, 1].map((s) => (
                            <option key={s} value={s}>
                                {s} ⭐
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Gửi đánh giá
                </button>
            </form>

            {/* Review List*/}
            <div className="review-list mt-4">
                <h6>Đánh giá gần đây:</h6>
                {reviews.map((review) => (
                    <div key={review.id} className="border-bottom py-2">
                        <strong>{review.userName}</strong> -{" "}
                        <span className="text-muted" style={{fontSize: "0.9em"}}>
                            {review.createdDate
                                ? new Date(review.createdDate).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "Chưa xác định"}
                        </span>
                        <div>
                            {"⭐".repeat(review.rating)}{" "}
                            <span className="text-muted">({review.rating}/5)</span>
                        </div>
                        <p className="mb-1">{review.content}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ProductReview;
