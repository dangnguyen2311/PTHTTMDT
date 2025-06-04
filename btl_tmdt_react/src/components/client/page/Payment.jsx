import Header from "../fragment/Header.jsx";
import { useLocation, useNavigate} from "react-router-dom";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";
import React, {useEffect} from "react";

export const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const returnUrl = `${window.location.origin}/payment`;

        fetch('/api/v1/payment/vn-pay-callback?' + queryParams.toString(), {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log('Kết quả callback:', data);
                alert("Thanh toán thành công!");
                // navigate('/payment');
            })
            .catch(err => {
                console.error('Lỗi xử lý thanh toán:', err);
                alert("Thanh toán thất bại");
            });
    }, []);


    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")} />
            <main>
                <section className="popular-items">
                    {/*{error && <div className="alert alert-danger">{error}</div>}*/}
                    <div className="hero-cap text-center">
                        <h2 style={{ margin: '40px auto' }}>
                            {/*{userName ? `WELCOME BACK ${userName}` : 'WELCOME TO OUR SHOP'}*/}
                            Checkout Successfully
                        </h2>
                    </div>

                </section>
            </main>
            <Footer />
            {/*<SearchBox />*/}
        </>
    )
}
