const express = require('express');
const {createUser, authUser,  } = require('../controller/users');
const router = express.Router();

router.route('/').post(createUser)

router.route('/login').post(authUser)


module.exports = router;