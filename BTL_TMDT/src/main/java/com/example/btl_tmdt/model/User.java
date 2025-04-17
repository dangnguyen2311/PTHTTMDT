package com.example.btl_tmdt.model;


import com.example.btl_tmdt.dao.UserDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String userId;
    private String userName;
    private String userEmail;
    private String userPass;
    private String userRole;
    private String userPhone;
    private String userFullName;
    private String userAddress;

    public UserDao toDao(){
        return new UserDao(userId, userName, userEmail, userPass, userRole, userPhone, userFullName, userAddress);
    }
}
