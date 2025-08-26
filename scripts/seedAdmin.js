require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

async function main() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('MONGODB_URL is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const email = process.argv[2] || 'admin123@gmail.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

  let user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    user.isAdmin = true;
    await user.save();
    console.log('Existing user promoted to admin:', email);
  } else {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phoneNumber: '9999999999',
      isAdmin: true,
    });
    console.log('Admin user created:', email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


