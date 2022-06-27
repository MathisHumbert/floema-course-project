import GSAP from 'gsap';

import Page from 'classes/Page';
import Button from 'classes/Button';

export default class Detail extends Page {
  constructor() {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        wrapper: '.detail__wrapper',
        button: '.detail__button',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({ element: this.elements.button });
  }

  show() {
    this.timeline = GSAP.timeline({ delay: 2 });

    this.timeline.fromTo(this.element, { autoAlpha: 0 }, { autoAlpha: 1 });

    super.show(this.timeline);
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
