//routers/dm.router.js

//import controllers
const controller = require('../controllers/dm.controller.js');

//create Router instance from express import
const router = require('express').Router();

//routes definitions//
console.log('router called...');
//login: check if logged in. If not, log user in
router.post('/login', controller.isNotLoggedIn, controller.login);
//register user: check if logged in. If not, register user
router.post('/register', controller.isNotLoggedIn, controller.registerUser);
//log out user if the user is logged in
router.get('/logout', controller.isLoggedIn, controller.logout);
//update profile: check if logged in. If yes, update profile
router.post('/update-profile', controller.isLoggedIn, controller.updateProfile);
//change password: send generate and send otp to user  
router.get('/reset-password', controller.sendOTP);
//change password: receive otp from user
router.post('/reset-password', controller.changePassword);
//add product category: only for admin
router.post('/add-category', controller.isLoggedIn, controller.isAdmin, controller.addCategory);
//add product: only for admin
router.post('/add-product', controller.isLoggedIn, controller.isAdmin, controller.addProduct);
//add new inventory: only for admin
router.post('/add-new-inventory', controller.isLoggedIn, controller.isSeller, controller.addNewInventory);
//get transaction history
router.post('/transaction-history', controller.isLoggedIn, controller.getTransactionHistory);
//get item details
router.get('/item-details', controller.getItemDetails);
//get user details
router.get('/user-details', controller.isLoggedIn, controller.getUserDetails);
//get all users' details
router.post('/all-users', controller.isLoggedIn, controller.getAllUsers);
//get user inventory
router.post('/user-inventory', controller.isLoggedIn, controller.getUserInventory);
//add to cart
router.post('/add-to-cart', controller.isLoggedIn, controller.addToCart);
//get shopping cart
router.get('/get-cart', controller.isLoggedIn, controller.getCart);
//checkout
router.post('/checkout', controller.isLoggedIn, controller.checkoutWithFlutterwave);
//verify payment
router.get('/verify-payment', controller.verifyPayment);
//delete inventory
router.post('/delete-inventory', controller.isLoggedIn, controller.deleteInventory);
//ban user
router.post('/ban-user', controller.isLoggedIn, controller.banUser);
//unban user
router.post('/unban-user', controller.isLoggedIn, controller.unbanUser);
//update inventory details
router.post('/edit-item-details', controller.isLoggedIn, controller.editInventoryDetails);
//increase Inventory qty
router.post('/increase-quantity', controller.isLoggedIn, controller.increaseInventoryQty);
//get front page data
router.get('/', controller.isNotAdmin, controller.getFrontPageItems);

//get transaction details

//rate seller

//delete pictures

//add pictures 

//export router instance
module.exports = router;