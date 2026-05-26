const mongoose = require('mongoose');

const DEFAULT_TEST_MONGO_URI = 'mongodb://127.0.0.1:27017/smart_home_inventory_test';

const getTestMongoUri = () => process.env.TEST_MONGO_URI || DEFAULT_TEST_MONGO_URI;

const assertSafeTestDatabase = (mongoUri) => {
	const databaseName = new URL(mongoUri).pathname.replace('/', '');

	if (process.env.NODE_ENV !== 'test' || !databaseName.includes('test')) {
		throw new Error('Refusing to run tests against a non-test database');
	}
};

const connectTestDatabase = async () => {
	process.env.NODE_ENV = 'test';
	process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
	process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
	process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '4';

	const mongoUri = getTestMongoUri();
	assertSafeTestDatabase(mongoUri);

	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(mongoUri);
	}
};

const clearTestDatabase = async () => {
	const collections = mongoose.connection.collections;

	for (const collection of Object.values(collections)) {
		await collection.deleteMany({});
	}
};

const disconnectTestDatabase = async () => {
	await mongoose.connection.close();
};

module.exports = {
	connectTestDatabase,
	clearTestDatabase,
	disconnectTestDatabase
};
