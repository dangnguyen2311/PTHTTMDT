import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";
//
// const adminCssLinks = [
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css',
//     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
// ];
//
// // Danh sách tài nguyên JS của admin
// const adminJsLinks = [
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js',
// ];
//
// // Hàm thêm CSS
// const addCssLink = (href) => {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = href;
//     link.crossOrigin = 'anonymous';
//     if (href.includes('bootstrap')) {
//         link.integrity = 'sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7';
//     }
//     document.head.appendChild(link);
// };
//
// // Hàm thêm JS
// const addJsScript = (src) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.async = true;
//     script.crossOrigin = 'anonymous';
//     if (src.includes('bootstrap')) {
//         script.integrity = 'sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq';
//     }
//     document.body.appendChild(script);
// };
//
// // Hàm cập nhật tài nguyên admin
// const updateAdminResources = () => {
//     // Xóa các thẻ <link> và <script> hiện có (trừ file React)
//     document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
//         // if (!link.href.includes('vite'))
//             link.remove();
//     });
//     document.querySelectorAll('script').forEach((script) => {
//         // if (!script.src.includes('main.jsx'))
//             script.remove();
//     });
//
//     // Thêm CSS của admin
//     adminCssLinks.forEach(addCssLink);
//
//     // Thêm JS của admin
//     adminJsLinks.forEach(addJsScript);
// };
//
//
//


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let userName = "";
    // eslint-disable-next-line no-unused-vars
    let categoryDaos = [];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset lỗi

        try {
            const response = await fetch('/api/v1/home/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userLogin: email,    // có thể là email hoặc username
                    userPass: password
                }),
            });

            // const data = await response.json();

            if (response.ok) {
                const data = await response.json();
                if (data.userRole === '2') {
                    navigate('/admin', { replace: true });
                } else {
                    userName = data.userName;
                    categoryDaos = JSON.stringify(data.categoryDaos);
                    localStorage.setItem("userName", userName);
                    localStorage.setItem('categoryDaos', JSON.stringify(data.categoryDaos));
                    console.log(JSON.stringify(data.categoryDaos));
                    navigate(data.redirect, { replace: true });
                    // navigate('/', { replace: true });
                }
            }
            else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setError(data.message || "Login failed");
                } else {
                    const text = await response.text();
                    setError(text || "Login failed");
                }
            }
        } catch (error) {
            setError("Something went wrong: " + error.message);
        }
    };


    return (
        <>
            <Header userName={''} categoryDaos={[]}/>
            <main>
                <h1 className="py-5">Hello</h1>
                <section className="login_part" style={{margin: '40px auto'}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6">
                                <div className="login_part_text text-center">
                                    <div className="login_part_text_iner">
                                        <h2>New to our Shop?</h2>
                                        <p>There are advances being made in science and technology everyday, and a good
                                            example of this is the</p>
                                        <Link to="/register" className="btn_3">Create an Account</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="login_part_form">
                                    <div className="login_part_form_iner py-5">
                                        <h3 style={{margin: '20px auto'}}>Welcome Back! <br/>Please Sign in now</h3>
                                        {error && <p style={{margin: '20px auto', color: 'red'}}>{error}</p>}
                                        <form className="row contact_form" onSubmit={handleLogin}>
                                            <div className="col-md-12 form-group p_star">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Email or Username"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group p_star">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group">
                                                {/*<div className="creat_account d-flex align-items-center">*/}
                                                {/*    <input type="checkbox" id="f-option" name="selector"/>*/}
                                                {/*    <label htmlFor="f-option">Remember me</label>*/}
                                                {/*</div>*/}
                                                <button type="submit" className="btn_3">log in</button>
                                                {/*<a className="lost_pass" href="#">forget password?</a>*/}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bạn có thể chèn thêm component Footer và Header nếu có */}
            </main>
            <Footer/>
            {/*<SearchBox/>*/}

        </>
    );
};

export default Login;
