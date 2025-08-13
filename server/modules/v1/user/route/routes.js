const express = require("express");
const userController = require("../controller/user");
const router = express.Router();

router.get("/users",userController.getUsers)
router.post('/login',userController.login)
router.get('/profile',userController.getprofile)

router.get('/getchats',userController.getchats)
router.post('/getmessages',userController.getMessages)


module.exports = router;  