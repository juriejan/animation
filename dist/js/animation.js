(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.animation = factory());
}(this, function () { 'use strict';

  function getOriginal(el, name) {
    var current = el.css(name);
    el.css(name, '');
    var original = el.css(name);
    el.css(name, current);
    return original;
  }

  function determineSize(el, side) {
    if (side === 'top' || side === 'bottom') {
      return parseInt(el.css('height'), 10);
    } else if (side === 'left' || side === 'right') {
      return parseInt(el.css('width'), 10);
    }
  }

  function show(el, done) {
    el.velocity({ opacity: 1 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      complete: done,
      visibility: 'visible',
      queue: false
    });
  }

  function hide(el, done) {
    el.velocity({ opacity: 0 }, {
      easing: 'easeInOutCubic',
      duration: 'fast',
      complete: done,
      visibility: 'hidden',
      queue: false
    });
  }

  function slideOut(el, side, done, progress) {
    var margin = 'margin-' + side;
    var properties = { opacity: 1 };
    var size = determineSize(el, side);
    // Set the initial css properties
    el.css(margin, '-' + size + 'px');
    el.css('display', '');
    // Animate to the new properties
    properties[margin] = 0;
    el.velocity(properties, {
      easing: 'easeInOutCubic',
      progress: progress,
      complete: done
    });
  }

  function slideIn(el, side, done, progress) {
    var margin = 'margin-' + side;
    var properties = { opacity: 0 };
    var size = determineSize(el, side);
    // Animate to the new properties
    properties[margin] = '-' + size + 'px';
    el.velocity(properties, {
      easing: 'easeInOutCubic',
      progress: progress,
      complete: done
    });
  }

  function flexGrow(el, basis, show, done) {
    var final = { 'flex-grow': '1' };
    if (show) {
      final.opacity = 1;
    }
    if (basis) {
      final['flex-basis'] = basis + 'px';
    }
    el.velocity(final, { easing: 'easeInOutCubic', complete: done });
  }

  function flexShrink(el, basis, hide, done) {
    var final = { 'flex-grow': '.0001' };
    if (hide) {
      final.opacity = 0;
    }
    if (basis) {
      final['flex-basis'] = basis + 'px';
    }
    el.velocity(final, { easing: 'easeInOutCubic', complete: done });
  }

  function grow(el, dimension, size, done) {
    // Set the initial styles
    var initial = { opacity: 0 };
    initial[dimension] = 0;
    el.css(initial);
    // Animate the grow
    var final = { opacity: 1 };
    // Determine the size to grow to
    if (size) {
      final[dimension] = size;
    } else {
      final[dimension] = getOriginal(el, dimension);
    }
    // Detemrine the original margins
    if (dimension === 'width') {
      final['margin-left'] = getOriginal(el, 'margin-left');
      final['margin-right'] = getOriginal(el, 'margin-right');
      final['padding-right'] = getOriginal(el, 'padding-right');
      final['padding-left'] = getOriginal(el, 'padding-left');
    } else {
      final['margin-top'] = getOriginal(el, 'margin-top');
      final['margin-bottom'] = getOriginal(el, 'margin-bottom');
      final['padding-top'] = getOriginal(el, 'padding-top');
      final['padding-bottom'] = getOriginal(el, 'padding-bottom');
    }
    // Initiate animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function shrink(el, dimension, done) {
    var final = { opacity: 0 };
    final[dimension] = 0;
    // Set the appropriate margins to zero
    if (dimension === 'width') {
      final['margin-left'] = 0;
      final['margin-right'] = 0;
      final['padding-left'] = 0;
      final['padding-right'] = 0;
    } else {
      final['margin-top'] = 0;
      final['margin-bottom'] = 0;
      final['padding-top'] = 0;
      final['padding-bottom'] = 0;
    }
    // Initiate animation
    el.velocity(final, {
      easing: 'easeInOutCubic',
      display: '',
      queue: false,
      complete: done
    });
  }

  function toggleIcon(onIcon, offIcon, status, animate) {
    if (animate) {
      if (status) {
        onIcon.velocity({ opacity: 0 }, { easing: 'easeInOutCubic' });
        offIcon.velocity({ opacity: 1 }, { easing: 'easeInOutCubic' });
      } else {
        onIcon.velocity({ opacity: 1 }, { easing: 'easeInOutCubic' });
        offIcon.velocity({ opacity: 0 }, { easing: 'easeInOutCubic' });
      }
    } else {
      if (status) {
        onIcon.css({ opacity: 0 });
        offIcon.css({ opacity: 1 });
      } else {
        onIcon.css({ opacity: 1 });
        offIcon.css({ opacity: 0 });
      }
    }
  }

  function showRegion(region, view, done) {
    region.show(view);
    this.show(region.$el, done);
  }

  function hideRegion(region, done) {
    if (region.hasView()) {
      this.hide(region.$el, function () {
        region.reset();
        if (done) {
          done();
        }
      });
    } else {
      if (done) {
        done();
      }
    }
  }

  function scroll(el, container) {
    el.velocity('scroll', {
      axis: 'y',
      duration: 'fast',
      easing: 'easeInOutCubic',
      container: container
    });
  }

  function thin(el) {
    el.css({
      opacity: 0,
      width: 0,
      'margin-left': 0,
      'margin-right': 0,
      'padding-left': 0,
      'padding-right': 0
    });
  }

  function flat(el) {
    el.css({
      opacity: 0,
      height: 0,
      'margin-top': 0,
      'margin-bottom': 0,
      'padding-top': 0,
      'padding-bottom': 0
    });
  }

  function original(el) {
    el.css({
      opacity: '',
      visibility: '',
      height: '',
      width: '',
      'margin-top': '',
      'margin-bottom': '',
      'margin-left': '',
      'margin-right': '',
      'padding-top': '',
      'padding-bottom': '',
      'padding-left': '',
      'padding-right': ''
    });
  }

  function setIn(el, side) {
    var margin = 'margin-' + side;
    var properties = { opacity: 0 };
    var size = determineSize(el, side);
    // Set the element css
    properties[margin] = '-' + size + 'px';
    el.css(properties);
  }

  function visible(el, state) {
    if (state) {
      el.css({ opacity: 1, visibility: 'visible' });
    } else {
      el.css({ opacity: 0, visibility: 'hidden' });
    }
  }

  var index = {
    flat,
    flexGrow,
    flexShrink,
    grow,
    hide,
    hideRegion,
    original,
    scroll,
    setIn,
    show,
    showRegion,
    shrink,
    slideIn,
    slideOut,
    thin,
    toggleIcon,
    visible
  };

  return index;

}));
//# sourceMappingURL=animation.js.map