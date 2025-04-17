package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<User, String> {

    User findUserByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);

    User getUserByUserName(String username);

    User getUserByUserEmail(String userEmail);

    User findUserByUserName(String username);

    User getUserByUserId(String userId);
}
