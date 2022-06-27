import { Mesh, Program, Plane } from 'ogl';
import GSAP from 'gsap';

import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';

export default class Transition {
  constructor({ collections, url, gl, scene, sizes }) {
    this.collections = collections;
    this.url = url;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.geometry = new Plane(this.gl);
  }

  createProgram(texture) {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uAlpha: { value: 1 },
      },
    });
  }

  createMesh(mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.scale.x = mesh.scale.x;
    this.mesh.scale.y = mesh.scale.y;
    this.mesh.scale.z = mesh.scale.z;

    this.mesh.position.x = mesh.position.x;
    this.mesh.position.y = mesh.position.y;
    this.mesh.position.z = mesh.position.z + 0.01;

    this.mesh.setParent(this.scene);
  }

  // ELEMENT
  setElement(element) {
    if (element.id === 'collections') {
      const { index, medias } = element;
      const media = medias[index];

      this.createProgram(media.texture);
      this.createMesh(media.mesh);
    } else {
      this.createProgram(element.texture);
      this.createMesh(element.mesh);
    }
  }

  // ANIMATIONS
  animate(element, onComplete) {
    const timeline = GSAP.timeline({ onComplete });

    timeline.to(
      this.mesh.scale,
      {
        duration: 1.5,
        ease: 'expo.inOut',
        x: element.scale.x,
        y: element.scale.y,
        z: element.scale.z,
      },
      0
    );

    timeline.to(
      this.mesh.position,
      {
        duration: 1.5,
        ease: 'expo.inOut',
        x: element.position.x,
        y: element.position.y,
        z: element.position.z,
      },
      0
    );

    timeline.call(() => {
      this.scene.removeChild(this.mesh);
    });
  }
}
