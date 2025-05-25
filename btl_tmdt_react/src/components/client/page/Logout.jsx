// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/v1/home/logout", {
            method: "POST",
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) throw new Error("Logout thất bại ở server");
                return res.json();
            })
            .then((data) => {
                console.log(data.message);
            })
            .catch((error) => {
                console.error("Lỗi khi gọi logout:", error);
            })
            .finally(() => {
                localStorage.removeItem("userName");
                localStorage.removeItem("categoryDaos");
                navigate("/login", { replace: true });
            });
    }, [navigate]);

    return null; // không render gì hết
};

export default Logout;

