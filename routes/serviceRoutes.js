// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/authMiddleware');
// const { createService, listServices, updateService, deleteService } = require('../controllers/serviceController');

// router.get('/', listServices);
// router.post('/', protect, admin, createService);
// router.put('/:id', protect, admin, updateService);
// router.delete('/:id', protect, admin, deleteService);

// module.exports = router;

// // create category for api
// // get category
// // create service
// // it include image title , description, how it works and pricing 

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getServices);
router.post('/', createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
