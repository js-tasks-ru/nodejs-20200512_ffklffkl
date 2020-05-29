const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = new Set();

router.get('/subscribe', async (ctx, next) => {
  ctx.response.body = await new Promise((resolve) => {
    clients.add(resolve);

    ctx.res.on('close', () => {
      clients.delete(resolve);
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;

  if (!msg) {
    ctx.throw(400, 'required field `message` is missing');
  }

  for (const resolve of clients) resolve(msg);
  clients.clear();

  ctx.response.body = 'Published';
});

app.use(router.routes());

module.exports = app;
