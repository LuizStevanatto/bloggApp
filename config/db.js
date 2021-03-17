const DB = process.env.mongoURI;

const moongose = require('mongoose');

moongose.Promise = global.Promise;

moongose
  .connect(" /* MongoURI */ ", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((e) => console.log(e));