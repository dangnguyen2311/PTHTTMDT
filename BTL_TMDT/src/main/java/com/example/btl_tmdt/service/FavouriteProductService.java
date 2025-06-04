package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.FavouriteProductDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.FavouriteProduct;
import com.example.btl_tmdt.repository.FavouriteProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavouriteProductService {
    @Autowired
    private FavouriteProductRepo favouriteProductRepo;

    public void addFavouriteProduct(FavouriteProduct favouriteProduct) {
        favouriteProductRepo.save(favouriteProduct);
    }
    public void removeFavouriteProduct(FavouriteProduct favouriteProduct) {
        favouriteProductRepo.delete(favouriteProduct);
    }
    public void updateFavouriteProduct(FavouriteProduct favouriteProduct) {
        favouriteProductRepo.save(favouriteProduct);
    }

    public List<FavouriteProductDao> getFavouriteProductsByUserName(String userName) {
        List<FavouriteProduct> favouriteProducts = favouriteProductRepo.findAllByUser_UserName(userName);
        return favouriteProducts.stream()
                .map(FavouriteProduct::toDao)
                .toList();
    }

    public FavouriteProductDao getFavouriteProductByUserAndProduct(UserDao userDao, ProductDao productDao) {
        return favouriteProductRepo.findByUserAndProduct(userDao.toModel(), productDao.toModel());
    }

    public FavouriteProductDao getFavouriteProductById(String favouriteProductId) {
        return favouriteProductRepo.findById(favouriteProductId).isPresent() ?
                favouriteProductRepo.findById(favouriteProductId).get().toDao() : null;
    }


}
