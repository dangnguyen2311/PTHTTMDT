import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from './components/admin/dashboard/Dashboard.jsx'
import Dashboard from "./components/admin/dashboard/Dashboard.jsx";
// import AdminProduct from './components/admin/ProductManagement.jsx'
// Import các layout, component, sidebar, v.v...

const AdminApp = () => {
    return (
        <Router>
            {/* Có thể bọc trong layout admin */}
            <Routes>
                <Route path="/admin" element={<Dashboard />} />
                {/*<Route path="/admin/products" element={<AdminProduct />} />*/}
                {/* ... các route admin khác */}
            </Routes>
        </Router>
    )
}

export default AdminApp
