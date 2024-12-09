const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');

//@desc     create user
//@route    POST    /api/users
//@access   private
exports.createUser = asyncHandler(async (req, res, next) => {

    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
        return next(new ErrorResponse('User Already Exist', 400))
    }
    const user = await User.create(req.body);
    if (user) {
        return res.status(201).json({
            success: true,
            data: user,
            token: user.getSignedJwtToken()
        });
    }
    else {
        return next(new ErrorResponse('Invalid Data', 400));
    }
});


//@desc     get profile
//@route    GET     /api/users/profile
//@access   private
exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }
    return res.status(200).json({
        success: true,
        data: user
    });
});




//@desc     get auth user
//@route    POST     /api/users/login
//@access   public
exports.authUser = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (user && (await user.matchPassword(req.body.password.toString()))) {
        return res.status(200).json({
            success: true,
            data: user,
            token: user.getSignedJwtToken()
        });
    }
    else {

        return next(new ErrorResponse(`Invalid email or password`, 401));
    }
});

