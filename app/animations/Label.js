import GSAP from 'gsap';

import Animation from 'classes/Animation';

export default class Label extends Animation {
  constructor({ elements, element }) {
    super({
      elements,
      element,
    });
  }

  animateIn() {
    GSAP.fromTo(
      this.element,
      { autoAlpha: 0, delay: 0.5 },
      { autoAlpha: 1, duration: 1 }
    );
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }
}
