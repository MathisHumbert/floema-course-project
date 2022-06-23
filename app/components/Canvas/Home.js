import { Plane, Transform } from 'ogl';
import { map } from 'lodash';

import Media from './Media';

export default class Home {
  constructor({ gl, scene }) {
    this.group = new Transform();
    this.gl = gl;
    this.medias = document.querySelectorAll('.home__gallery__image');

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.group,
      });
    });
  }
}
