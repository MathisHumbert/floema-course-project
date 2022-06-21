import GSAP from 'gsap';
import { split, calculate } from 'utils/text';
import { each } from 'lodash';

import Animation from 'classes/Animation';

export default class Title extends Animation {
  constructor({ elements, element }) {
    super({
      elements,
      element,
    });

    split({
      element: this.element,
    });

    split({
      element: this.element,
    });

    this.elementLinesSpans = this.element.querySelectorAll('span span');
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({ delay: 0.5 });

    this.timelineIn.set(this.element, { autoAlpha: 1 });

    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          y: '100%',
        },
        {
          duration: 1.5,
          delay: index * 0.2,
          ease: 'expo.out',
          y: '0%',
        },
        0
      );
    });
  }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }

  onResize() {
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
