require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

global.__basedir = __dirname;



mongoose.connect(process.env.MONGODB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((result) => { console.log('connected') })
    .catch((err) => console.log(err))

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'development') {
    app.listen(port, () => {
        console.log(`App running on port ${port}`);
    })
}
else {
    app.listen();
}
