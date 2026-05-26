const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const healthRoutes = require('../modules/health/health.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

module.exports = router;
