package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.FavouriteProductDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.FavouriteProductService;
import com.example.btl_tmdt.service.ProductService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/favourite-products")
public class FavouriteProductController {
    @Autowired
    private FavouriteProductService favouriteProductService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public ResponseEntity<?> getFavouriteProducts(HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        List<FavouriteProductDao> favouriteProductsByUserName = new ArrayList<>(favouriteProductService.getFavouriteProductsByUserName(userName)) ;
        System.out.println("Favourite Products by UserName: " + favouriteProductsByUserName.size());
        favouriteProductsByUserName.sort(
                Comparator.comparing(FavouriteProductDao::getCreatedDate, Comparator.nullsLast(Comparator.reverseOrder()))
        );
//        favouriteProductsByUserName.sort((fp1, fp2) -> fp2.getCreatedDate().compareTo(fp1.getCreatedDate()));
        return ResponseEntity.ok(Map.of("favouriteProducts", favouriteProductsByUserName));
    }

    @PostMapping("/check/{productId}")
    public ResponseEntity<?> checkFavouriteProduct(@PathVariable("productId") String productId, HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        Product product = productService.getProductById(productId);
        User user = userService.getUserByUserName(userName);
        if (user == null || product == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user or product"));
        }
        FavouriteProductDao favouriteProductDaoToCheck = favouriteProductService.getFavouriteProductByUserAndProduct(user.toDao(), product.toDao());

        if( favouriteProductDaoToCheck == null) {
            System.out.println("Favorite to check: is null");
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user or product"));
        }
        System.out.println("Favorite to check: "+favouriteProductDaoToCheck.getId());
        return ResponseEntity.ok(Map.of(
                "favouriteProductId", favouriteProductDaoToCheck.getId()

        ));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addFavouriteProduct(@PathVariable("productId") String productId, HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        FavouriteProductDao favouriteProductDao = new FavouriteProductDao();
        UserDao userDao = userService.getUserByUserName(userName).toDao();
        ProductDao productDao = productService.getProductById(productId).toDao();

        if(userDao == null || productDao == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user or product"));
        }

        favouriteProductDao.setUserDao(userDao);
        favouriteProductDao.setProductDao(productDao);
        favouriteProductDao.setCreatedDate(LocalDateTime.now());
        favouriteProductService.addFavouriteProduct(favouriteProductDao.toModel());

//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Failed to add product to favourites"));
        return ResponseEntity.ok(Map.of("favouriteProduct", favouriteProductDao));
    }

    @PostMapping("/remove/{favouriteProductId}")
    public ResponseEntity<?> removeFavouriteProduct(@PathVariable("favouriteProductId") String favouriteProductId, HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        System.out.println("Favourite Product to be Deleted: "+favouriteProductId);
        FavouriteProductDao favouriteProductDaotoDelete = favouriteProductService.getFavouriteProductById(favouriteProductId);
        favouriteProductService.removeFavouriteProduct(favouriteProductDaotoDelete.toModel());
        return ResponseEntity.ok(Map.of("message", "Product removed from favourites"));
    }

}
