import GSAP from 'gsap';

import Component from 'classes/Component';
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from 'utils/colors';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
      },
      element: '.navigation',
    });

    this.onChange(template);
  }

  onChange(template) {
    if (template === 'about') {
      // GSAP.set(this.element, {
      //   color: COLOR_BRIGHT_GRAY,
      // });

      GSAP.set(this.elements.items[0], { autoAlpha: 1 });
      GSAP.set(this.elements.items[1], { autoAlpha: 0 });
    } else {
      GSAP.set(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
      });

      GSAP.set(this.elements.items[0], { autoAlpha: 0 });
      GSAP.set(this.elements.items[1], { autoAlpha: 1 });
    }
  }
}
