import { Transform } from 'ogl';
import { map } from 'lodash';
import GSAP from 'gsap';

import Media from './Media';

export default class Gallery {
  constructor({ element, index, geometry, gl, scene, sizes }) {
    this.element = element;
    this.index = index;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.elementWrapper = element.querySelector('.about__gallery__wrapper');

    this.group = new Transform();

    this.scroll = {
      start: 0,
      current: 0,
      target: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createMedias();

    this.group.setParent(this.scene);
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll('.about__gallery__media');

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
    map(this.medias, (media) => media.hide());
  }

  // EVENTS
  onResize({ sizes }) {
    this.sizes = sizes;
    this.bounds = this.elementWrapper.getBoundingClientRect();

    this.width = (this.bounds.width / window.innerWidth) * this.sizes.width;

    this.scroll.current = this.scroll.target = 0;

    map(this.medias, (media) => media.onResize(sizes, this.scroll.current));
  }

  onTouchDown({ x, y }) {
    this.scroll.start = this.scroll.current;
  }

  onTouchMove({ x, y }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.start - distance;
  }

  onTouchUp({ x, y }) {}

  onWheel() {}

  // UPDATES
  update(scroll) {
    if (!this.bounds) return;

    const y = scroll.current / window.innerHeight;
    const distance = (scroll.current - scroll.target) * 0.1;

    // infinite scroll
    if (this.scroll.current < this.scroll.target) {
      this.direction = 'right';
      this.scroll.velocity = -1;
    } else if (this.scroll.current > this.scroll.target) {
      this.direction = 'left';
      this.scroll.velocity = 1;
    }

    // scroll by it self with velocity
    this.scroll.target -= this.scroll.velocity;

    // scroll by user scroll with distance
    this.scroll.target += distance;

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    map(this.medias, (media) => {
      const scaleX = media.mesh.scale.x / 2 + 0.25;

      if (this.direction === 'left') {
        const x = media.mesh.position.x + scaleX;

        if (x < -this.sizes.width / 2) {
          media.extra += this.width;
        }
      } else if (this.direction === 'right') {
        const x = media.mesh.position.x - scaleX;

        if (x > this.sizes.width / 2) {
          media.extra -= this.width;
        }
      }

      media.update(this.scroll.current);
    });

    // fixed canvas
    this.group.position.y = y * this.sizes.height;
  }

  // DESTROY
  destroy() {
    this.scene.removeChild(this.group);
  }
}
