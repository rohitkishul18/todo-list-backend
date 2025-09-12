const bcrypt = require("bcrypt");

const plainPassword = "rohit@123"; 
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(plainPassword, salt);

console.log("Hashed password", hash);
