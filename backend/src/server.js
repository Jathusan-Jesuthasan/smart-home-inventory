const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDatabase = require('./config/database.config');

connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
