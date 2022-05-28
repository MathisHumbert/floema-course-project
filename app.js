require('dotenv').config();

const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorHandler());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

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
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }
  if (doc.type === 'about') {
    return `/about`;
  }
  if (doc.type === 'collections') {
    return '/collections';
  }

  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: HandleLinkResolver,
  // };

  res.locals.Link = HandleLinkResolver;
  res.locals.PrismicH = PrismicH;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const handleRequest = async (api) => {
  const preloader = await api.getSingle('preloader');
  const navigation = await api.getSingle('navigation');
  const meta = await api.getSingle('meta');

  return {
    meta,
    navigation,
    preloader,
  };
};

app.get('/', async (req, res) => {
  const api = await initApi(req);
  const home = await api.getSingle('home');
  const defaults = await handleRequest(api);

  const collections = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    {
      fetchLinks: 'product.image',
    }
  );

  res.render('pages/home', {
    home,
    collections: collections.results,
    ...defaults,
  });
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const about = await api.getSingle('about');
  const defaults = await handleRequest(api);

  res.render('pages/about', {
    about,
    ...defaults,
  });
});

app.get('/collections', async (req, res) => {
  const api = await initApi(req);
  const home = await api.getSingle('home');
  const defaults = await handleRequest(api);

  const collections = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    {
      fetchLinks: 'product.image',
    }
  );

  res.render('pages/collections', {
    home,
    collections: collections.results,
    ...defaults,
  });
});

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });

  console.log(product.data.informations);

  res.render('pages/detail', {
    product,
    ...defaults,
  });
});

app.listen(port, () => {
  console.log(`Port is listening at port ${port}`);
});
