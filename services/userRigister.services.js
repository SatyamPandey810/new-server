const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { nanoid } = require("nanoid");

exports.userRegiserServices = async ({
  fullName,
  dob,
  username,
  contact,
  password,
  profile_image,
  role,
}) => {
  if (!fullName || !username || !contact || !password) {
    throw new Error('Please provide fullName, username, contact, and password');
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^\d{10}$/.test(contact);

  if (!isEmail && !isPhone) {
    throw new Error('Please provide a valid email or 10-digit phone number');
  }

  const query = isEmail ? { email: contact } : { phone: contact };
  const existUser = await userModel.findOne(query);


  if (existUser) {
    throw new Error('User already registered with this email or phone');
  }

  const salt = await bcrypt.genSalt(10);
  // console.log("salt",salt);

  const haspassword = await bcrypt.hash(password, salt);
  // console.log("hash",haspassword);

  if (!haspassword) {
    throw new error("Somthing went wrong");
  }

  const userData = new userModel({
    fullName,
    username,
    email: isEmail ? contact : null,
    phone: isPhone ? contact : null,
    dob,
    profile_image,
    password: haspassword,
    role,
  });
  const user = await userData.save();
  return user;
};

exports.userLoginService = async ({ contact, password }) => {

  if (!password || !contact) {
    throw new Error('Contact and password are required');
  }


  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^\d{10}$/.test(contact);

  if (!isEmail && !isPhone) {
    throw new Error('Please provide a valid email or 10-digit phone number');
  }

  const query = isEmail ? { email: { $regex: new RegExp(`^${contact}$`, 'i') } } : { phone: contact };
  const user = await userModel.findOne(query).select('+password');



  if (!user) {
    throw new Error("User not found");
  }

  isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const jwtToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const data = {
    token: jwtToken,
    user: {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      dob: user.dob,
      profile_image: user.profile_image,
    }
  };

  return data;
};

exports.checkUsernameAvailabalityService = async ({ username }) => {
  if (!username) {
    throw new Error("Username is required");
  }

  const user = await userModel.findOne({ username });

  let suggestion;

  if (user) {
    suggestion = Array.from({ length: 3 }).map(() => {
      return `${username}_${nanoid(5)}`;
    });

    return {
      available: false,
      suggestion,
    };
  }

  return {
    available: true,
    suggestions: [],
  };
};


exports.findLogUserService = async (logUser) => {
  const user = await userModel.findById(logUser)
  return user
}

// get user for sidebar list
exports.getUserForSidebar = async () => {
  return userModel.find(
    { _id: { $ne: new mongoose.Types.ObjectId() } },
    "username contact profile_image "
  );
}

exports.profileUpdateService = async (updatedData , id )=>{
  console.log(updatedData , "updated data")
 if (!id) {
    throw new Error("Id is required");
  }

  const profileUpdate = await userModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!profileUpdate) {
    throw new Error("User is not found");
  }

  return profileUpdate;
  
}


