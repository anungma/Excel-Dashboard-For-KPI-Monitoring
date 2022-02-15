require('dotenv').config();

// Inisialisasi awal fastify.
const fastify = require('fastify')({
    logger: true //aktifkan ini untuk menerima log setiap request dari fastify.
});


//Fungsi ini untuk membuat kita bisa melakuakn post melalui www-url-encoded.
fastify.register(require('fastify-formbody'));

// Enable the fastify CORS plugin
fastify.register(require('fastify-cors'), {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: false,
    exposedHeaders: null,
    allowedHeaders: null,
    maxAge: null,
    preflight: true
})

//Route yang dipisah dari root file.
fastify.register(require('./routes'));

//Fungsi file root secara async.
const start = async () => {
    try {
        //Gunakan Port dari ENV APP_PORT, kalo ngga ada variable tersebut maka akan menggunakan port 3000
        await fastify.listen(process.env.APP_PORT || 3000, '0.0.0.0');

        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
};

//Jalankan server!
start();
