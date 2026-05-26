const userRepository = require('../users/user.repository');

const createAuthUser = async (userData) => {
	return userRepository.createUser(userData);
};

const findAuthUserByEmail = async (email) => {
	return userRepository.findUserByEmail(email);
};

const findAuthUserByEmailWithPassword = async (email) => {
	return userRepository.findUserByEmailWithPassword(email);
};

const findAuthUserById = async (userId) => {
	return userRepository.findUserById(userId);
};

module.exports = {
	createAuthUser,
	findAuthUserByEmail,
	findAuthUserByEmailWithPassword,
	findAuthUserById
};
