import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx"; // Added for navigation

function RegisterForm() {
    const [formData, setFormData] = useState({
        userName: "",
        userFullName: "",
        userEmail: "",
        userAddress: "",
        userPass: "",
        confirmPassword: "",
        userPhone: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Added for navigation

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic input validation
        if (!formData.userName || !formData.userEmail || !formData.userPass) {
            setError("Please fill in all required fields");
            return;
        }

        if (formData.userPass !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("/api/v1/home/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    userEmail: formData.userEmail,
                    userPass: formData.userPass,
                    userPhone: formData.userPhone,
                    userFullName: formData.userFullName,
                    userAddress: formData.userAddress,
                }),
            });
            // console.log(response.json());
            if (response.ok) {
                navigate("/login", {replace: true});
            }
            else {
                const result = await response.json();
                setError(result.message + "fgds");
            }
        }
        catch (error) {
            console.log(error);
            setError("Error when connects to Server" + error);
        }
    };

    return (
        <main>
            <Header userName="" categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")} />
            <section className="login_part" style={{ margin: "20px auto" }}>
                <div className="container">
                    <div className="col-lg-6 col-md-6" style={{ margin: "auto" }}>
                        <div className="login_part_form">
                            <div className="login_part_form_iner">
                                <h3>
                                    Welcome to our shop! <br /> Please register to continue
                                </h3>

                                {error && (
                                    <p style={{ color: "red", margin: "20px auto", textAlign: "center" }}>
                                        {error}
                                    </p>
                                )}

                                <form className="row contact_form" onSubmit={handleSubmit}>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="userFullName"
                                            value={formData.userFullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="userEmail"
                                            value={formData.userEmail}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="userPhone"
                                            value={formData.userPhone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="userAddress"
                                            value={formData.userAddress}
                                            onChange={handleChange}
                                            placeholder="Address"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="userPass"
                                            value={formData.userPass}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Password Confirmation"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <button type="submit" className="btn_3">
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}

export default RegisterForm;