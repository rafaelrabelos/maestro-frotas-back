const mongooseConnection = require("mongoose");

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASS;
const banco = process.env.MONGODB_DATABASE;

mongooseConnection.connect(
  `mongodb+srv://${user}:${pass}@cluster0.miauz.mongodb.net/${banco}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
mongooseConnection.Promise = global.Promise;

module.exports = mongooseConnection;
