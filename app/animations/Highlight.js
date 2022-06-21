import GSAP from 'gsap';

import Animation from 'classes/Animation';

export default class Highlight extends Animation {
  constructor({ elements, element }) {
    super({
      elements,
      element,
    });
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({ delay: 0.5 });

    this.timelineIn.fromTo(
      this.element,
      { scale: 1.2, autoAlpha: 0 },
      {
        autoAlpha: 1,
        ease: 'expo.out',
        scale: '1',
        duration: 1.5,
      }
    );
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }
}
