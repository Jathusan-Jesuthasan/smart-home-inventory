const { Router } = require('express');

const authController = require('./auth.controller');
const { authenticateUser } = require('./auth.middleware');
const { loginSchema, registerSchema } = require('./auth.validation');
const validateRequest = require('../../middlewares/validate-request.middleware');

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/me', authenticateUser, authController.getMe);

module.exports = router;
