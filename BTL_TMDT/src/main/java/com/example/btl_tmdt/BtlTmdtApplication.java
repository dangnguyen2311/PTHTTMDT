package com.example.btl_tmdt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv; // Đảm bảo import này tồn tại
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class BtlTmdtApplication {

	public static void main(String[] args) {
		try {
			Dotenv dotenv = Dotenv.load(); // Đảm bảo file tên là .env và ở thư mục gốc dự án
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
		} catch (io.github.cdimascio.dotenv.DotenvException e) {
			System.err.println("Cảnh báo: Không tìm thấy file .env hoặc có lỗi khi đọc: " + e.getMessage());
			System.err.println("Ứng dụng sẽ cố gắng chạy mà không có các biến môi trường từ .env.");
			// Bạn có thể thêm System.exit(1); ở đây nếu các biến là bắt buộc
		}
		// ----------------------------------------
		SpringApplication.run(BtlTmdtApplication.class, args);
	}

}
