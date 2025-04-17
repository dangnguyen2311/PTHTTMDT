// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Gửi yêu cầu POST đến backend để logout
        fetch("/api/v1/logout", {
            method: "POST",
            credentials: "include" // để gửi cookie JSESSIONID
        })
            .then((res) => {
                if (!res.ok) throw new Error("Logout thất bại ở server");
                return res.json();
            })
            .then((data) => {
                console.log(data.message); // In ra "Đăng xuất thành công"
            })
            .catch((error) => {
                console.error("Lỗi khi gọi logout:", error);
            })
            .finally(() => {
                // Dù thành công hay không vẫn xóa localStorage và chuyển hướng
                localStorage.removeItem("userName");
                localStorage.removeItem("categoryDaos");
                // có thể thêm key khác tùy bạn
                navigate("/", { replace: true }); // điều hướng về trang login
            });
    }, [navigate]);

    return null; // không render gì hết
};

export default Logout;

