import { Texture } from 'ogl';
import GSAP from 'gsap';

import { split } from 'utils/text';
import Component from 'classes/Component';

export default class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img'),
      },
    });

    this.canvas = canvas;

    window.TEXTURES = {};

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    split({
      element: this.elements.title,
      expression: '<br>',
    });

    this.length = 0;
    this.elements.titleSpans =
      this.elements.title.querySelectorAll('span span');

    this.createLoader();
  }

  createLoader() {
    // old way to load
    // each(this.elements.images, (element) => {
    //   element.onload = () => this.onAssetLoaded(element);
    //   element.src = element.getAttribute('data-src');
    // });

    window.ASSETS.forEach((image) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const media = new window.Image();
      media.crossOrigin = 'anonymous';
      media.src = image;
      media.onload = () => {
        texture.image = media;
        this.onAssetLoaded();
      };

      window.TEXTURES[image] = texture;
    });
  }

  onAssetLoaded(image) {
    this.length += 1;
    // old way to looad
    // const percent = this.length / this.elements.images.length;
    const percent = this.length / window.ASSETS.length;
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;
    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.emit('completed');

      this.animateOut = GSAP.timeline({ delay: 1 });

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: 'expo.out',
        y: '100%',
        stagger: 0.1,
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: 'expo.out',
          y: '100%',
          stagger: 0.1,
        },
        '-=1.4'
      );

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1,
      });

      this.animateOut.call(() => this.destroy());
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
