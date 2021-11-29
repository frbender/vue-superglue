import getId from './helpers';

const stickyObjects = {};

class Sticky {
  constructor(id, stickyElement) {
    this.id = id;
    this.el = stickyElement;
    this.parent = this.getContainer();

    this.scrollHandler = this.handleScroll.bind(this);
    document.addEventListener('scroll', this.scrollHandler);
    this.resizeHandler = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
  }

  // get closest 'sticky-container' parent
  getContainer() {
    let parent = this.el.parentNode;
    while (parent) {
      if (parent.hasAttribute('sticky-container')) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return parent;
  }

  destroy() {
    document.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  detectPositioning() {
    this.el.style.position = 'static';
    const elementRect = this.el.getBoundingClientRect();
    this.elX = window.scrollX + elementRect.left;
    this.elY = window.scrollY + elementRect.top;
  }

  update() {
    this.parent = this.getContainer();
    const parentRect = this.parent.getBoundingClientRect();
    const parentTop = parentRect.top;
    const parentHeight = this.parent.clientHeight;
    const elementHeight = this.el.clientHeight;

    if (elementHeight < parentHeight) {
      const sizeDiff = parentHeight - elementHeight;
      const negParentTop = -parentTop;

      if (negParentTop < 0) {
        // too far up
        this.el.style.position = 'absolute';
        this.el.style.top = `${this.elY}px`;
        this.el.style.left = `${this.elX}px`;
      } else if (negParentTop >= 0 && negParentTop <= sizeDiff) {
        // stick to it
        this.el.style.position = 'fixed';
        this.el.style.top = `${0}px`;
        this.el.style.left = `${this.elX}px`;
      } else if (negParentTop > sizeDiff) {
        // stick at the bottom
        this.el.style.position = 'absolute';
        this.el.style.top = `${this.elY + sizeDiff}px`;
        this.el.style.left = `${this.elX}px`;
      }
    }
  }

  inserted() {
    this.detectPositioning();
    this.update();
  }

  updated() {
    this.detectPositioning();
    this.update();
  }

  handleScroll() {
    this.update();
  }

  handleResize() {
    this.detectPositioning();
    this.update();
  }
}

/**
 * A directive that makes elements sticky for top and bottom.
 *
 * Usage:
 * - add 'sticky-container' attribute to the container which determines the top & bottom boundaries
 * - add 'v-sticky' to the element that should be sticky
 * - make sure the layout doesn't break if the sticky element becomes position-fixed
 *   (e.g. by setting a fixed width and height on the container of the parent element)
 */
const sticky = {
  bind(el, binding) {
    const stickyId = `sticky${getId()}`;
    el.dataset.stickyId = stickyId;
    stickyObjects[stickyId] = new Sticky(stickyId, el, binding);
  },
  inserted(el) {
    const { stickyId } = el.dataset;
    const stickyInstance = stickyObjects[stickyId];
    stickyInstance.inserted();
  },
  componentUpdated(el) {
    const { stickyId } = el.dataset;
    const stickyInstance = stickyObjects[stickyId];
    stickyInstance.updated();
  },
  unbind(el) {
    const { stickyId } = el.dataset;
    const stickyInstance = stickyObjects[stickyId];
    stickyInstance.destroy();
    delete stickyObjects[stickyId];
    delete el.dataset.stickyId;
  },
};
export default sticky;
