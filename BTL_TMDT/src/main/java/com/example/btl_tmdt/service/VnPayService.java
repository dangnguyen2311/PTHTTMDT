//package com.example.btl_tmdt.service;
//
//import com.example.btl_tmdt.model.VNPayUtil;
//import org.springframework.stereotype.Service;
//
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//@Service
//public class VnPayService {
//
//    private final String vnp_TmnCode = "1FO325BY"; // sandbox
//    private final String vnp_HashSecret = "X5O7RBSH1JUDVBFMOSQ4EJ7UEGZQ9CBA"; // sandbox
//    private final String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
//    private final String vnp_ReturnUrl = "http://localhost:8081/payment/vnpay-success";
//
//    public String createPaymentUrl(int amount) {
//        try {
//            Map<String, String> vnp_Params = new HashMap<>();
//            vnp_Params.put("vnp_Version", "2.1.0");
//            vnp_Params.put("vnp_Command", "pay");
//            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//            vnp_Params.put("vnp_Locale", "vn");
//            vnp_Params.put("vnp_CurrCode", "VND");
//            vnp_Params.put("vnp_TxnRef", String.valueOf(System.currentTimeMillis()));
//            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang");
//            vnp_Params.put("vnp_OrderType", "other");
//            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
//            vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
//            vnp_Params.put("vnp_IpAddr", "127.0.0.1");
//
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//            String vnp_CreateDate = sdf.format(new Date());
//            Calendar cal = Calendar.getInstance();
//            cal.add(Calendar.MINUTE, 15);
//            String vnp_ExpireDate = sdf.format(cal.getTime());
//
//            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
//            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
//
//            // Build query + secure hash
//            String queryUrl = buildQueryAndSecureHash(vnp_Params, vnp_HashSecret);
//
//            return vnp_Url + "?" + queryUrl;
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Có lỗi khi tạo URL thanh toán VNPay";
//        }
//    }
//
//
//    public String buildQueryAndSecureHash(Map<String, String> vnp_Params, String vnp_HashSecret) {
//        // B1: Sắp xếp key theo thứ tự tăng dần
//        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
//        Collections.sort(fieldNames);
//
//        // B2: Tạo chuỗi hashData và query
//        StringBuilder hashData = new StringBuilder();
//        StringBuilder query = new StringBuilder();
//
//        for (int i = 0; i < fieldNames.size(); i++) {
//            String fieldName = fieldNames.get(i);
//            String fieldValue = vnp_Params.get(fieldName);
//            if (fieldValue != null && !fieldValue.isEmpty()) {
//                hashData.append(fieldName).append("=").append(fieldValue);
//                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
//                query.append("=");
//                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
//
//                if (i != fieldNames.size() - 1) {
//                    hashData.append("&");
//                    query.append("&");
//                }
//            }
//        }
//
//        // B3: Tạo secure hash
//        String vnp_SecureHash = VNPayUtil.hmacSHA512(vnp_HashSecret, hashData.toString());
//
//        // B4: Trả về toàn bộ URL có query + secure hash
//        return query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;
//    }
//
//
//    public String handlePaymentResponse(Map<String, String> params) {
//        String receivedHash = params.remove("vnp_SecureHash");
//        params.remove("vnp_SecureHashType");
//
//        List<String> sortedKeys = new ArrayList<>(params.keySet());
//        Collections.sort(sortedKeys);
//
//        StringBuilder hashData = new StringBuilder();
//        for (String key : sortedKeys) {
//            hashData.append(key).append("=").append(params.get(key)).append("&");
//        }
//        hashData.setLength(hashData.length() - 1);
//
//        String computedHash = VNPayUtil.hmacSHA512(vnp_HashSecret, hashData.toString());
//        return computedHash.equals(receivedHash) ? "Payment verified!" : "Invalid payment signature!";
//    }
//}
