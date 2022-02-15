let users = require('./controller/users');
let auth = require('./controller/auth');
let todo = require('./controller/todo');

let nms2g = require('./controller/nms_2g_report');
let nms3g = require('./controller/nms_3g_report');
let nms4g = require('./controller/nms_4g_report');

let middleware = require('./helper/middleware-token');



async function routes (fastify, options) {

    //Route Ujicoba
   	fastify.get('/', function (request, reply) {
        	reply.send({message: 'OK Bray..', code: 200}); //Hello World
    	});
		
    fastify.post('/api/checkclientversion', users.checkclientversion);

		fastify.post('/api/users/login', users.login);
    fastify.post('/api/users/register', users.register);
		fastify.post('/api/token', auth.createToken);
		fastify.post('/api/token/check', auth.checkToken);
		

// ========== 4G		
// ========== 	
fastify.route({
  method: 'GET',
  url: '/api/cns4gregion',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' }
}
 },
  preHandler: async function (request, reply, done) {
      await nms4g.GetRegion4G(request, reply);
      done()
  },
  handler:  nms4g.GetRegion4G
});

fastify.route({
  method: 'GET',
  url: '/api/cns4gcluster',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' },
  region: { type: 'string' },
}
 },
  preHandler: async function (request, reply, done) {
      await nms4g.GetCluster4G(request, reply);
      done()
  },
  handler:  nms4g.GetCluster4G
});


fastify.route({
    method: 'GET',
    url: '/api/cnskpi4g',
     schema: {
   // request needs to have a querystring with a `name` parameter
   querystring: {
    region: { type: 'string' },
    cluster: { type: 'string' },
    startdate: { type: 'string' },
    durasi: { type: 'string' }
  }
   },
    preHandler: async function (request, reply, done) {
        await nms4g.GetKPI4G(request, reply);
        done()
    },
    handler:  nms4g.GetKPI4G
});
//

// ========== 3G		
// ========== 	
fastify.route({
  method: 'GET',
  url: '/api/cns3gregion',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' }
}
 },
  preHandler: async function (request, reply, done) {
      await nms3g.GetRegion3G(request, reply);
      done()
  },
  handler:  nms3g.GetRegion3G
});

fastify.route({
  method: 'GET',
  url: '/api/cns3gcluster',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' },
  region: { type: 'string' },
}
 },
  preHandler: async function (request, reply, done) {
      await nms3g.GetCluster3G(request, reply);
      done()
  },
  handler:  nms3g.GetCluster3G
});


fastify.route({
    method: 'GET',
    url: '/api/cnskpi3g',
     schema: {
   // request needs to have a querystring with a `name` parameter
   querystring: {
    region: { type: 'string' },
    cluster: { type: 'string' },
    startdate: { type: 'string' },
    durasi: { type: 'string' }
  }
   },
    preHandler: async function (request, reply, done) {
        await nms3g.GetKPI3G(request, reply);
        done()
    },
    handler:  nms3g.GetKPI3G
});

// ========== 2G		
// ========== 	
fastify.route({
  method: 'GET',
  url: '/api/cns2gregion',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' }
}
 },
  preHandler: async function (request, reply, done) {
      await nms2g.GetRegion2G(request, reply);
      done()
  },
  handler:  nms2g.GetRegion2G
});

fastify.route({
  method: 'GET',
  url: '/api/cns2gcluster',
   schema: {
 // request needs to have a querystring with a `name` parameter
 querystring: {
  startdate: { type: 'string' },
  region: { type: 'string' },
}
 },
  preHandler: async function (request, reply, done) {
      await nms2g.GetCluster2G(request, reply);
      done()
  },
  handler:  nms2g.GetCluster2G
});


fastify.route({
    method: 'GET',
    url: '/api/cnskpi2g',
     schema: {
   // request needs to have a querystring with a `name` parameter
   querystring: {
    region: { type: 'string' },
    cluster: { type: 'string' },
    startdate: { type: 'string' },
    durasi: { type: 'string' }
  }
   },
    preHandler: async function (request, reply, done) {
        await nms2g.GetKPI2G(request, reply);
        done()
    },
    handler:  nms2g.GetKPI2G
});


//
}

module.exports = routes;
