const User = require('./user.model');

const createUser = async (userData) => {
	return User.create(userData);
};

const findUserByEmail = async (email) => {
	return User.findOne({ email }).lean();
};

const findUserByEmailWithPassword = async (email) => {
	return User.findOne({ email }).select('+password').lean();
};

const findUserById = async (userId) => {
	return User.findById(userId).lean();
};

module.exports = {
	createUser,
	findUserByEmail,
	findUserByEmailWithPassword,
	findUserById
};
