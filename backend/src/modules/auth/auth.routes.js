const { Router } = require('express');

const authController = require('./auth.controller');
const { authenticateUser } = require('./auth.middleware');
const { loginSchema, registerSchema } = require('./auth.validation');
const validateRequest = require('../../middlewares/validate-request.middleware');

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a JWT authentication token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Test User
 *                         email:
 *                           type: string
 *                           example: test@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *       400:
 *         description: Validation failed or email already exists.
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User Login
 *     description: Log in with email and password to retrieve a JWT authentication token.
 *     tags:
 *       - Authentication
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
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get Current Profile
 *     description: Returns the profile details of the currently logged-in authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 */
router.get('/me', authenticateUser, authController.getMe);

module.exports = router;
