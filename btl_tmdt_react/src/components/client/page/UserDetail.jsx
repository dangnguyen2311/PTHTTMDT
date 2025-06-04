import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {Link} from "react-router-dom";

const UserDetail = () => {
    const [favourites, setFavourites] = useState([]);

    const [user, setUser] = useState({
        userFullName: "",
        userName: "",
        userEmail: "",
        userPhone: "",
        userAddress: "",
    });
    const [currUser, setCurrUser] = useState({
        userFullName: "",
        userName: "",
        userAddress: "",
    });

    useEffect(() => {
        fetchUserDetail();
        fetchFavourites();
    }, []);

    const fetchUserDetail = async () => {
        try {
            const response = await axios.get("/api/v1/users/profile");
            setUser(response.data.userDao);
            setCurrUser({
                userFullName: response.data.userDao.userFullName,
                userName: response.data.userDao.userName,
                userAddress: response.data.userDao.userAddress,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };
    const fetchFavourites = async () => {
        try {
            const response = await axios.get("/api/v1/favourite-products/list", {
                withCredentials: true,
            });
            setFavourites(response.data.favouriteProducts || []);
        } catch (error) {
            console.error("Error fetching favourites:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                fullName: user.userFullName,
                phone: user.userPhone,
                address: user.userAddress
            };

            await axios.put("/api/v1/users/profile", payload);
            window.location.reload();
            alert("Save user Info successfully!");
        } catch (error) {
            console.error("Error saving user:", error);
            alert("LError saving user info!");
        }
    };


    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")}/>
            <main>
                <div className="whole-wrap">
                    <div className="container-fluid">
                        <div className="main-body">
                            <div className="row">
                                {/* Left Profile Section */}
                                <div className="col-md-4 mb-3">
                                    <div className="card">
                                        <div className="card-body d-flex flex-column align-items-center text-center">
                                            <img
                                                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                                alt="Admin"
                                                className="rounded-circle"
                                                width="150"
                                            />
                                            <div className="mt-3">
                                                <h4>{currUser.userFullName}</h4>
                                                <p className="text-secondary mb-1">Username: {currUser.userName}</p>
                                                <p className="text-muted font-size-sm">Address: {currUser.userAddress}</p>
                                                <Link to={"/logout"}>
                                                    <button className="btn btn-outline-primary">Logout</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Detail Section */}
                                <div className="col-md-8">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                {/* Full Name */}
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Full Name</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="userFullName"
                                                            value={user.userFullName}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <hr/>

                                                {/* Email */}
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Email</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="userFullName"
                                                            value={user.userEmail}
                                                            onChange={handleChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <hr/>

                                                {/* Phone */}
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Phone</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="userPhone"
                                                            value={user.userPhone}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <hr/>

                                                {/* Address */}
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Address</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="userAddress"
                                                            value={user.userAddress}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <hr/>

                                                {/* Submit */}
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <button type="submit" className="btn btn-info">
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                                <div className={"row-12"}>
                                    <hr/>
                                    <h2>Favourite Products</h2>
                                    <div className="row pt-3">
                                        {favourites.length === 0 ? (
                                            <div className="col-sm-12 text-muted">No favourite products
                                                yet.</div>
                                        ) : (
                                            favourites.map((fav) => (
                                                <div className="col-md-6 mb-3" key={fav.id}>
                                                    <div className="card h-100 p-2 p-md-3">
                                                        <div className="card-body d-flex align-items-center">
                                                            <img
                                                                src={fav.productDao?.prodImg || "https://via.placeholder.com/60"}
                                                                alt="product"
                                                                width="150"
                                                                height="auto"
                                                                className="me-3 rounded"
                                                            />
                                                            <div>
                                                                <h6 className="mb-1">{fav.productDao?.prodName}</h6>
                                                                <p className="text-muted mb-0">
                                                                    Price: {fav.productDao?.prodPrice} $
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>

    );
};

export default UserDetail;
