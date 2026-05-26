const bcrypt = require('bcryptjs');

const comparePassword = async (plainPassword, hashedPassword) => {
	return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = comparePassword;
