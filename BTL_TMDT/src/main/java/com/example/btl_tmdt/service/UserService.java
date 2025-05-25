package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.repository.CartRepo;
import com.example.btl_tmdt.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductInCartService productInCartService;

    @Autowired
    private ProductInOrderService productInOrderService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private MongoTemplate mongoTemplate;

    public void saveUser(User user) {
        userRepo.save(user);
        Cart cart = new Cart(user);
        cartRepo.save(cart);
    }

    public User getUserByEmail(String userEmail) {
        return userRepo.findUserByUserEmail(userEmail);
    }

    public void deleteUser(String id) {
        User userToDelete = userRepo.getUserByUserId(id);
        Cart cartToDelete = cartRepo.getCartByUser(userToDelete);
        List<Order> orderToDeleteList  = orderService.getOrderByUser(userToDelete);
        productInCartService.deleteProductInCartByUser(cartToDelete);
        productInOrderService.deleteProductInOrderByUser(orderToDeleteList);
        cartRepo.delete(cartToDelete);
        userRepo.deleteById(id);
    }

    public List<User> getUsers() {
        return userRepo.findAll();
    }

    public boolean checkExistedEmail(String userEmail) {
        return userRepo.existsByUserEmail(userEmail);
    }

    public User getUserByUserName(String username) {
        return userRepo.getUserByUserName(username);
    }

    public User getUserByUserId(String userId) {
        Optional<User> optionalUser = userRepo.findById(userId);
        return optionalUser.orElse(null);
    }

    public void createUser(User user) {
        userRepo.save(user);
    }

    public void updateUser(UserDao userDao) {
        User userOld = userRepo.getUserByUserName(userDao.getUserName());
        if (userOld != null) {
            updateUserInfo(userOld.getUserId(), userDao.getUserFullName(), userDao.getUserPhone(), userDao.getUserAddress());
        }
    }

    public void updateUserInfo(String userId, String fullName, String phone, String address) {
        Query query = new Query(Criteria.where("userId").is(userId));
        Update update = new Update()
                .set("userFullName", fullName)
                .set("userPhone", phone)
                .set("userAddress", address);
        mongoTemplate.updateFirst(query, update, User.class);
    }
}
