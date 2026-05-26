const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const healthRoutes = require('../modules/health/health.routes');
const inventoryRoutes = require('../modules/inventory/inventory.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const productScannerRoutes = require('../modules/product-scanner/product-scanner.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/dashboard', analyticsRoutes);
router.use('/scanner', productScannerRoutes);

module.exports = router;
