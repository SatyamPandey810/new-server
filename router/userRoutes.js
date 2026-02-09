const express = require('express');
const { userRegisterController, userLoginController, checkUsernameAvailablityController, loginUserFindController, getUserForSidebarController, updateProfileController } = require('../controller/userRegister.controller');
const authToken = require('../middleware/authToken');
const router = express.Router()


router.post('/register', userRegisterController)
router.post('/login', userLoginController)
router.post('/checkUsername', checkUsernameAvailablityController)
router.patch('/profileUpdate',  authToken, updateProfileController)
router.get("/log-user", authToken, loginUserFindController)
router.get('/sidbaruser', authToken, getUserForSidebarController)

module.exports = {
    userRouter: router
}