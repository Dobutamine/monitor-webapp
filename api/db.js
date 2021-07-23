const mongoose = require('mongoose')

// get the connection string from the environment variables
const dbUrl = process.env.DB_URL || "mongodb://localhost/monemu";

const connect = async () => {
  await mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("Connected to MongoDB: " + dbUrl);
};

const close = () => mongoose.connection.close();

module.exports = { connect, close, url: dbUrl };