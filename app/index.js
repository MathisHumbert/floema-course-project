import { each } from 'lodash';

import About from 'pages/About';
import Collections from 'pages/Collections';
import Detail from 'pages/Detail';
import Home from 'pages/Home';
import Preloader from './components/preloader';

class App {
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();

    this.addEventListeners();
    this.addLinkListener();

    this.update();
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

  async onPreloaded() {
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  async onChange(url) {
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');

      div.innerHTML = html;
      const divContent = div.querySelector('.content');
      this.template = divContent.getAttribute('data-template');
      this.content.innerHTML = divContent.innerHTML;
      this.content.setAttribute('data-template', this.template);

      this.page = this.pages[this.template];
      this.page.create();

      this.onResize();
      this.page.show();

      this.addLinkListener();
    } else {
      console.log('error');
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  addLinkListener() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();

        this.onChange(event.target.href);
      };
    });
  }
}

new App();
