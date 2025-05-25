// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// // Danh sách tài nguyên CSS cho admin
// const adminCssLinks = [
//     '/admin/plugins/fontawesome-free/css/all.min.css',
//     '/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
//     '/admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
//     'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
//     '/admin/plugins/fontawesome-free/css/all.min.css',
//     'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
//     '/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
//     '/admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
//     '/admin/plugins/jqvmap/jqvmap.min.css',
//     '/admin/dist/css/adminlte.min.css',
//     '/admin/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
//     '/admin/plugins/daterangepicker/daterangepicker.css',
//     '/admin/plugins/summernote/summernote-bs4.min.css',
// ];
//
// // Danh sách tài nguyên JS cho admin
// const adminJsLinks = [
//     '/admin/plugins/jquery/jquery.min.js',
//     '/admin/plugins/jquery-ui/jquery-ui.min.js',
//     '/admin/plugins/bootstrap/js/bootstrap.bundle.min.js',
//     '/admin/plugins/chart.js/Chart.min.js',
//     '/admin/plugins/sparklines/sparkline.js',
//     '/admin/plugins/jqvmap/jquery.vmap.min.js',
//     '/admin/plugins/jqvmap/maps/jquery.vmap.usa.js',
//     '/admin/plugins/jquery-knob/jquery.knob.min.js',
//     '/admin/plugins/moment/moment.min.js',
//     '/admin/plugins/daterangepicker/daterangepicker.js',
//     '/admin/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
//     '/admin/plugins/summernote/summernote-bs4.min.js',
//     '/admin/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
//     '/admin/dist/js/adminlte.js',
//     '/admin/dist/js/pages/dashboard.js',
// ];
//
// // Danh sách tài nguyên CSS cho user
// const userCssLinks = [
//     '/assets/css/bootstrap.min.css',
//     '/assets/css/owl.carousel.min.css',
//     '/assets/css/flaticon.css',
//     '/assets/css/slicknav.css',
//     '/assets/css/animate.min.css',
//     '/assets/css/magnific-popup.css',
//     '/assets/css/fontawesome-all.min.css',
//     '/assets/css/themify-icons.css',
//     '/assets/css/slick.css',
//     '/assets/css/nice-select.css',
//     '/assets/css/style.css',
// ];
//
// // Danh sách tài nguyên JS cho user
// const userJsLinks = [
//     '/assets/js/vendor/modernizr-3.5.0.min.js',
//     '/assets/js/vendor/jquery-1.12.4.min.js',
//     '/assets/js/popper.min.js',
//     '/assets/js/bootstrap.min.js',
//     '/assets/js/jquery.slicknav.min.js',
//     '/assets/js/owl.carousel.min.js',
//     '/assets/js/slick.min.js',
//     '/assets/js/wow.min.js',
//     '/assets/js/animated.headline.js',
//     '/assets/js/jquery.magnific-popup.js',
//     '/assets/js/jquery.scrollUp.min.js',
//     '/assets/js/jquery.nice-select.min.js',
//     '/assets/js/jquery.sticky.js',
//     '/assets/js/contact.js',
//     '/assets/js/jquery.form.js',
//     '/assets/js/jquery.validate.min.js',
//     '/assets/js/mail-script.js',
//     '/assets/js/jquery.ajaxchimp.min.js',
//     '/assets/js/plugins.js',
//     '/assets/js/main.js',
// ];
//
// // Danh sách tài nguyên CSS mặc định (cho trang login, dựa trên user)
// const defaultCssLinks = [
//     '/assets/css/bootstrap.min.css',
//     '/assets/css/fontawesome-all.min.css',
//     '/assets/css/animate.min.css',
//     '/assets/css/style.css', // Style chính của user
// ];
//
// // Danh sách tài nguyên JS mặc định (cho trang login, dựa trên user)
// const defaultJsLinks = [
//     '/assets/js/vendor/modernizr-3.5.0.min.js',
//     '/assets/js/vendor/jquery-1.12.4.min.js',
//     '/assets/js/popper.min.js',
//     '/assets/js/bootstrap.min.js',
//     '/assets/js/jquery.validate.min.js', // Dùng cho form login
//     '/assets/js/main.js',
// ];
//
// // Hàm thêm CSS vào <head>
// const addCssLink = (href) => {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = href;
//     link.dataset.role = 'dynamic';
//     document.head.appendChild(link);
//     return link;
// };
//
// // Hàm thêm JS vào <body>
// const addJsScript = (src) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.async = true;
//     script.dataset.role = 'dynamic';
//     document.body.appendChild(script);
//     return script;
// };
//
// // Hàm xóa tài nguyên cũ
// const removeDynamicResources = () => {
//     document.querySelectorAll('[data-role="dynamic"]').forEach((el) => el.remove());
// };
//
// const AppWrapper = ({ children }) => {
//     const navigate = useNavigate();
//     const userRole = localStorage.getItem('userRole');
//
//     useEffect(() => {
//         // Xóa tài nguyên cũ trước khi thêm mới
//         removeDynamicResources();
//
//         // Kiểm tra xem đang ở trang login hay không
//         const isLoginPage = window.location.pathname === '/login';
//
//         if (!userRole && !isLoginPage) {
//             // Nếu chưa đăng nhập và không ở trang login, chuyển hướng
//             navigate('/login');
//             return;
//         }
//
//         // Thêm tài nguyên dựa trên vai trò hoặc trạng thái
//         if (userRole === 'admin') {
//             // Thêm CSS và JS cho admin
//             adminCssLinks.forEach(addCssLink);
//             adminJsLinks.forEach(addJsScript);
//
//             // Thêm đoạn JS để xử lý xung đột jQuery UI và Bootstrap
//             const conflictScript = document.createElement('script');
//             conflictScript.text = "$.widget.bridge('uibutton', $.ui.button);";
//             conflictScript.dataset.role = 'dynamic';
//             document.body.appendChild(conflictScript);
//         } else if (userRole === 'user' || !userRole) {
//             // Dùng tài nguyên mặc định (dành cho login hoặc user)
//             const cssLinks = userRole === 'user' ? userCssLinks : defaultCssLinks;
//             const jsLinks = userRole === 'user' ? userJsLinks : defaultJsLinks;
//
//             cssLinks.forEach(addCssLink);
//             jsLinks.forEach(addJsScript);
//         }
//
//         // Cleanup khi component unmount hoặc userRole thay đổi
//         return () => {
//             removeDynamicResources();
//         };
//     }, [userRole, navigate]);
//
//     return <>{children}</>;
// };
//
// export default AppWrapper;