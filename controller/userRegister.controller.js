const {
  userRegiserServices,
  userLoginService,
  checkUsernameAvailabalityService,
  findLogUserService,
  getUserForSidebar,
  profileUpdateService,
} = require("../services/userRigister.services");

exports.userRegisterController = async (req, res) => {
  try {
    const user = await userRegiserServices(req.body);

    res.status(201).json({
      message: "User registered successfully",
      data,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

exports.userLoginController = async (req, res) => {
  try {
    const data = await userLoginService(req.body);

    res.status(200).json({
      message: "User login successfully",
      data: data,
      // token : data?.jwtToken,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

exports.checkUsernameAvailablityController = async (req, res) => {
  try {
    const result = await checkUsernameAvailabalityService(req.body);

    res.status(200).json({
      success: true,
      available: result.available,
      data: result.suggestion || [],
      error: false,
      message: result.available
        ? "Username is available"
        : "Username is already taken",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};


exports.loginUserFindController = async (req, res) => {
  try {
    const logUser = await findLogUserService(req.userId)

    res.status(200).json({
      data: logUser,
      error: false,
      success: true,
      message: "user details"
    })

  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false

    })
  }
}

// get user for sidebar list
exports.getUserForSidebarController = async (req, res) => {

  try {
    
    const findUserForSidebar = await getUserForSidebar()

    res.status(200).json({
      data: findUserForSidebar,
      error: false,
      success: true,
      message: "users"
    })
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false

    })
  }
}



exports.updateProfileController = async (req, res) => {
  try {
    const data = await profileUpdateService(req.body , req.userId);

    res.status(200).json({
      message: "Profile Updated successfully",
      data: data,
      // token : data?.jwtToken,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};