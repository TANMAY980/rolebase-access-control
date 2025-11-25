const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const adminController = require('../../modules/admin/controller/admin.controller');
const productController=require("../../modules/product/controller/product.controller");
const auth=require('../../middleware/auth');
const namedRouter=routelabel(router);


/**
 * @swagger
 * /regsiter:
 *   post:
 *     summary: Register a new user
 *     description: This API creates a new user after checking if the email exists. Password is encrypted before saving.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - role
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tanmay Karmakar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tanmay@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Kolkata, West Bengal
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: Pass@1234
 *     responses:
 *       201:
 *         description: User register successfully
 *       403:
 *         description: Please fill all inputs field
 *       404:
 *         description: User need to register first
 *       400:
 *         description: Something went wrong / Failed to register user
 */
namedRouter.post('regsiter.user','/regsiter',adminController.register);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user based on role
 *     description: This API validates email & password, checks user role (admin, manager, employee), and returns a JWT token.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tanmay@gmail.com
 *               password:
 *                 type: string
 *                 example: Pass@1234
 *     responses:
 *       201:
 *         description: Login successful (admin/manager/employee)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: admin login successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Please fill all inputs field
 *       404:
 *         description: User not found / User need to register first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: User need to register first
 *       400:
 *         description: Password didn't match or failed to login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Password didn't matched
 *       500:
 *         description: Internal server error
 */
namedRouter.post("user.login","/login",adminController.login);

/**
 * @swagger
 * /create/product:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new product
 *     description: Creates a new product after validating that a product with the same name does not already exist.
 *     tags: [Product]
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 16"
 *               price:
 *                 type: number
 *                 example: 69999
 * 
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created Successfully"
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "675ab23fc9012b4d8873abc1"
 *                     name: "iPhone 16"
 *                     price: 69999
 * 
 *       400:
 *         description: Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Require all the input fields"
 * 
 *       409:
 *         description: Product with same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product with same name already exists"
 * 
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
namedRouter.post("create.product","/create/product",auth.authcheck,auth.checkPermission('create_record'),productController.create);

/**
 * @swagger
 * /update/product/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update product details
 *     description: Edit an existing product using its ID.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               price:
 *                 type: number
 *                 example: 999
 *     responses:
 *       201:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: Successfully updated Product Details
 *       400:
 *         description: Missing Product ID or update failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: Product Id not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: Something went wrong
 */

namedRouter.put("update.product","/update/product/:id",auth.authcheck,auth.checkPermission("update_record"),productController.update);

/**
 * @swagger
 * /product/details/{id}:
 *   get:
 *     summary: Get product details by ID
 *     description: Returns detailed information about a specific product.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []   # Only add this because route requires token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Product details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: Product fetched successfully
 *                 data:
 *                   _id: "64df2b548a2c3f0098f3e1d1"
 *                   name: "Laptop"
 *                   price: 55000
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: Product ID not found
 *       401:
 *         description: Unauthorized (No token provided)
 *       403:
 *         description: Forbidden (User doesn't have read_record permission)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */

namedRouter.get("get.product","/product/details/:id",auth.authcheck,auth.checkPermission("read_record"),productController.getDetails);

/**
 * @swagger
 * /products/list:
 *   get:
 *     summary: Get all products
 *     description: Fetch the list of all products. Requires authentication and read permission.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []     # Only add because this route requires token
 *     responses:
 *       200:
 *         description: List of all products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: Products fetched successfully
 *                 data:
 *                   - _id: "64df2b548a2c3f0098f3e1d1"
 *                     name: "Laptop"
 *                     price: 55000
 *                   - _id: "64df2b548a2c3f0098f3e1d2"
 *                     name: "Mobile"
 *                     price: 15000
 *
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *
 *       403:
 *         description: Forbidden - User does not have read_record permission
 *
 *       404:
 *         description: No products found
 *
 *       500:
 *         description: Internal Server Error
 */

namedRouter.get("get.allproducts","/products/list",auth.authcheck,auth.checkPermission("read_record"),productController.getalldetails);

/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Remove a specific product using its MongoDB ObjectId.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []     # Token required because delete is a protected action
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: product details deleted successfully
 *
 *       400:
 *         description: Product ID missing or delete failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: Product Id not found
 *
 *       401:
 *         description: Unauthorized - Token required
 *
 *       403:
 *         description: Forbidden - User does not have delete permission
 *
 *       500:
 *         description: Internal Server Error
 */

namedRouter.delete("product.delete","/product/delete/:id",auth.authcheck,auth.checkPermission("delete_record"),productController.delete);


module.exports=router;