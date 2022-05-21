require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

// Link Resolver
const HandleLinkResolver = (doc) => {
  // Define the url depending on the document type
  //   if (doc.type === 'page') {
  //     return '/page/' + doc.uid;
  //   } else if (doc.type === 'blog_post') {
  //     return '/blog/' + doc.uid;
  //   }

  // Default to homepage
  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: HandleLinkResolver,
  };
  res.locals.PrismicH = PrismicH;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const about = await api.getSingle('about');
  const meta = await api.getSingle('meta');
  console.log(meta);

  res.render('pages/about', {
    about,
    meta,
  });
});

app.get('/collections', (req, res) => {
  res.render('pages/collections');
});

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detal');
});

app.listen(port, () => {
  console.log(`Port is listening at port ${port}`);
});
