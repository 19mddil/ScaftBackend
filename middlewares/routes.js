const userRouter = require('../routers/userRouter');
// const mongoose = require('mongoose');

module.exports = (app) => {
    app.get('/', (req, res) => res.send("hello"));

    // app.get('/connected', (req, res) => {
    //     mongoose.connect(process.env.MONGODB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD), {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     })
    //         .then((result) => { res.send('connected') })
    //         .catch((err) => res.send(err))

    // });

    app.use('/api/user', userRouter);
}