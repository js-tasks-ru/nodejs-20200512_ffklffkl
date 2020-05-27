const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const connections = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.response.body = await new Promise((res, rej) => connections.push(res));
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;
  if (msg) {
    for (const send of connections) send(msg);
  }

  ctx.response.body = 'Published';
});

app.use(router.routes());

module.exports = app;
