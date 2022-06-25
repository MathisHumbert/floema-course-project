import GSAP from 'gsap';

import Animation from 'classes/Animation';

export default class Paragraph extends Animation {
  constructor({ elements, element }) {
    super({
      elements,
      element,
    });

    // old animation
    // split({
    //   element: this.element,
    // });

    // this.elementsLinesSpans = split({
    //   append: true,
    //   element: this.element,
    // });
  }

  animateIn() {
    GSAP.fromTo(
      this.element,
      { autoAlpha: 0, delay: 0.5 },
      { autoAlpha: 1, duration: 1 }
    );
  }

  // old animation
  // animateIn() {
  //   this.timelineIn = GSAP.timeline({ delay: 0.5 });

  //   this.timelineIn.set(this.element, { autoAlpha: 1 });

  //   each(this.elementLines, (line, index) => {
  //     this.timelineIn.fromTo(
  //       line,
  //       {
  //         autoAlpha: 0,
  //         y: '100%',
  //       },
  //       {
  //         autoAlpha: 1,
  //         duration: 1.5,
  //         delay: index * 0.2,
  //         ease: 'expo.out',
  //         y: '0%',
  //       },
  //       0
  //     );
  //   });
  // }

  animateOut() {
    GSAP.set(this.element, { autoAlpha: 0 });
  }

  // old animation
  // onResize() {
  //   this.elementLines = calculate(this.elementsLinesSpans);
  // }
}
