import { Plane, Transform } from 'ogl';
import { map } from 'lodash';
import GSAP from 'gsap';
import Prefix from 'prefix';

import Media from './Media';

export default class Collections {
  constructor({ gl, scene, sizes, transition }) {
    this.id = 'collections';

    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    this.transformPrefix = Prefix('transform');

    this.group = new Transform();

    this.galleryWrapperElement = document.querySelector(
      '.collections__gallery__wrapper'
    );
    this.galleryElement = document.querySelector('.collections__gallery');
    this.mediasElements = document.querySelectorAll(
      '.collections__gallery__media'
    );
    this.collectionsElements = document.querySelectorAll(
      '.collections__article'
    );
    this.titlesElements = document.querySelector('.collections__titles');
    this.buttonElement = document.querySelector('.collections__button');

    this.scroll = {
      start: 0,
      current: 0,
      target: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createGeometry();
    this.createGallery();

    this.group.setParent(this.scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  // ANIMATIONS
  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    if (this.transition) {
      this.transition.animate(this.medias[0], () => {});
    }

    map(this.medias, (media) => media.hide());
  }

  // EVENTS
  onResize({ sizes }) {
    this.sizes = sizes;

    this.bounds = this.galleryWrapperElement.getBoundingClientRect();

    this.scroll.last = this.scroll.target = 0;
    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

    map(this.medias, (media) => media.onResize(sizes, this.scroll));
  }

  onTouchDown({ x, y }) {
    this.scroll.last = this.scroll.current;
  }

  onTouchMove({ x, y }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.last - distance;
  }

  onTouchUp({ x, y }) {}

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  onChange(index) {
    this.index = index;
    const selectedCollection = parseInt(
      this.mediasElements[this.index].getAttribute('data-index')
    );

    map(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add('collections__article--active');
      } else {
        element.classList.remove('collections__article--active');
      }
    });

    this.titlesElements.style[this.transformPrefix] = `translateY(-${
      25 * selectedCollection
    }%) translate(-50%, -50%) rotate(-90deg) `;
  }

  // UPDATES
  update() {
    if (!this.bounds) return;

    this.scroll.target = GSAP.utils.clamp(
      -this.scroll.limit,
      0,
      this.scroll.target
    );
    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    this.galleryElement.style[
      this.transformPrefix
    ] = `translateX(${this.scroll.current}px)`;

    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = 'right';
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = 'left';
    }

    this.scroll.last = this.scroll.current;

    const index = Math.floor(
      Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length
    );
    if (this.index !== index) {
      this.onChange(index);
    }

    map(this.medias, (media) => {
      media.update(this.scroll.current, this.index);
    });
  }

  // DESTROY
  destroy() {
    this.scene.removeChild(this.group);
  }
}
