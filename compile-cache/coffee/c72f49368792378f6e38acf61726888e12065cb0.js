
/*
  html2canvas 0.4.1 <http://html2canvas.hertzen.com>
  Copyright (c) 2013 Niklas von Hertzen

  Released under MIT License
 */

(function() {
  (function(window, document) {
    var asInt, backgroundBoundsFactory, computedCSS, h2cRenderContext, h2czContext, html2canvas, parseBackgroundSizePosition, previousElement, toPX, _html2canvas;
    toPX = function(element, attribute, value) {
      var left, rsLeft, style;
      rsLeft = element.runtimeStyle && element.runtimeStyle[attribute];
      left = void 0;
      style = element.style;
      if (!/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(value) && /^-?\d/.test(value)) {
        left = style.left;
        if (rsLeft) {
          element.runtimeStyle.left = element.currentStyle.left;
        }
        style.left = attribute === 'fontSize' ? '1em' : value || 0;
        value = style.pixelLeft + 'px';
        style.left = left;
        if (rsLeft) {
          element.runtimeStyle.left = rsLeft;
        }
      }
      if (!/^(thin|medium|thick)$/i.test(value)) {
        return Math.round(parseFloat(value)) + 'px';
      }
      return value;
    };
    asInt = function(val) {
      return parseInt(val, 10);
    };
    parseBackgroundSizePosition = function(value, element, attribute, index) {
      value = (value || '').split(',');
      value = value[index || 0] || value[0] || 'auto';
      value = _html2canvas.Util.trimText(value).split(' ');
      if (attribute === 'backgroundSize' && (!value[0] || value[0].match(/cover|contain|auto/))) {

      } else {
        value[0] = value[0].indexOf('%') === -1 ? toPX(element, attribute + 'X', value[0]) : value[0];
        if (value[1] === void 0) {
          if (attribute === 'backgroundSize') {
            value[1] = 'auto';
            return value;
          } else {
            value[1] = value[0];
          }
        }
        value[1] = value[1].indexOf('%') === -1 ? toPX(element, attribute + 'Y', value[1]) : value[1];
      }
      return value;
    };
    backgroundBoundsFactory = function(prop, el, bounds, image, imageIndex, backgroundSize) {
      var bgposition, left, percentage, resized, topPos, val;
      bgposition = _html2canvas.Util.getCSS(el, prop, imageIndex);
      topPos = void 0;
      left = void 0;
      percentage = void 0;
      val = void 0;
      if (bgposition.length === 1) {
        val = bgposition[0];
        bgposition = [];
        bgposition[0] = val;
        bgposition[1] = val;
      }
      if (bgposition[0].toString().indexOf('%') !== -1) {
        percentage = parseFloat(bgposition[0]) / 100;
        left = bounds.width * percentage;
        if (prop !== 'backgroundSize') {
          left -= (backgroundSize || image).width * percentage;
        }
      } else {
        if (prop === 'backgroundSize') {
          if (bgposition[0] === 'auto') {
            left = image.width;
          } else {
            if (/contain|cover/.test(bgposition[0])) {
              resized = _html2canvas.Util.resizeBounds(image.width, image.height, bounds.width, bounds.height, bgposition[0]);
              left = resized.width;
              topPos = resized.height;
            } else {
              left = parseInt(bgposition[0], 10);
            }
          }
        } else {
          left = parseInt(bgposition[0], 10);
        }
      }
      if (bgposition[1] === 'auto') {
        topPos = left / image.width * image.height;
      } else if (bgposition[1].toString().indexOf('%') !== -1) {
        percentage = parseFloat(bgposition[1]) / 100;
        topPos = bounds.height * percentage;
        if (prop !== 'backgroundSize') {
          topPos -= (backgroundSize || image).height * percentage;
        }
      } else {
        topPos = parseInt(bgposition[1], 10);
      }
      return [left, topPos];
    };
    h2cRenderContext = function(width, height) {
      var storage;
      storage = [];
      return {
        storage: storage,
        width: width,
        height: height,
        clip: function() {
          storage.push({
            type: 'function',
            name: 'clip',
            'arguments': arguments
          });
        },
        translate: function() {
          storage.push({
            type: 'function',
            name: 'translate',
            'arguments': arguments
          });
        },
        fill: function() {
          storage.push({
            type: 'function',
            name: 'fill',
            'arguments': arguments
          });
        },
        save: function() {
          storage.push({
            type: 'function',
            name: 'save',
            'arguments': arguments
          });
        },
        restore: function() {
          storage.push({
            type: 'function',
            name: 'restore',
            'arguments': arguments
          });
        },
        fillRect: function() {
          storage.push({
            type: 'function',
            name: 'fillRect',
            'arguments': arguments
          });
        },
        createPattern: function() {
          storage.push({
            type: 'function',
            name: 'createPattern',
            'arguments': arguments
          });
        },
        drawShape: function() {
          var shape;
          shape = [];
          storage.push({
            type: 'function',
            name: 'drawShape',
            'arguments': shape
          });
          return {
            moveTo: function() {
              shape.push({
                name: 'moveTo',
                'arguments': arguments
              });
            },
            lineTo: function() {
              shape.push({
                name: 'lineTo',
                'arguments': arguments
              });
            },
            arcTo: function() {
              shape.push({
                name: 'arcTo',
                'arguments': arguments
              });
            },
            bezierCurveTo: function() {
              shape.push({
                name: 'bezierCurveTo',
                'arguments': arguments
              });
            },
            quadraticCurveTo: function() {
              shape.push({
                name: 'quadraticCurveTo',
                'arguments': arguments
              });
            }
          };
        },
        drawImage: function() {
          storage.push({
            type: 'function',
            name: 'drawImage',
            'arguments': arguments
          });
        },
        fillText: function() {
          storage.push({
            type: 'function',
            name: 'fillText',
            'arguments': arguments
          });
        },
        setVariable: function(variable, value) {
          storage.push({
            type: 'variable',
            name: variable,
            'arguments': value
          });
          return value;
        }
      };
    };
    h2czContext = function(zindex) {
      return {
        zindex: zindex,
        children: []
      };
    };
    'use strict';
    _html2canvas = {};
    previousElement = void 0;
    computedCSS = void 0;
    html2canvas = void 0;
    _html2canvas.Util = {};
    _html2canvas.Util.log = function(a) {
      if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
      }
    };
    _html2canvas.Util.trimText = (function(isNative) {
      return function(input) {
        if (isNative) {
          return isNative.apply(input);
        } else {
          return ((input || '') + '').replace(/^\s+|\s+$/g, '');
        }
      };
    })(String.prototype.trim);
    _html2canvas.Util.asFloat = function(v) {
      return parseFloat(v);
    };
    (function() {
      var TEXT_SHADOW_PROPERTY, TEXT_SHADOW_VALUES;
      TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
      TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
      _html2canvas.Util.parseTextShadows = function(value) {
        var i, results, s, shadows;
        if (!value || value === 'none') {
          return [];
        }
        shadows = value.match(TEXT_SHADOW_PROPERTY);
        results = [];
        i = 0;
        while (shadows && i < shadows.length) {
          s = shadows[i].match(TEXT_SHADOW_VALUES);
          results.push({
            color: s[0],
            offsetX: s[1] ? s[1].replace('px', '') : 0,
            offsetY: s[2] ? s[2].replace('px', '') : 0,
            blur: s[3] ? s[3].replace('px', '') : 0
          });
          i++;
        }
        return results;
      };
    })();
    _html2canvas.Util.parseBackgroundImage = function(value) {
      var appendResult, args, block, c, definition, i, ii, method, mode, numParen, prefix, prefix_i, quote, results, whitespace;
      whitespace = ' \u000d\n\u0009';
      method = void 0;
      definition = void 0;
      prefix = void 0;
      prefix_i = void 0;
      block = void 0;
      results = [];
      c = void 0;
      mode = 0;
      numParen = 0;
      quote = void 0;
      args = void 0;
      appendResult = function() {
        if (method) {
          if (definition.substr(0, 1) === '"') {
            definition = definition.substr(1, definition.length - 2);
          }
          if (definition) {
            args.push(definition);
          }
          if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1) + 1) > 0) {
            prefix = method.substr(0, prefix_i);
            method = method.substr(prefix_i);
          }
          results.push({
            prefix: prefix,
            method: method.toLowerCase(),
            value: block,
            args: args
          });
        }
        args = [];
        method = prefix = definition = block = '';
      };
      appendResult();
      i = 0;
      ii = value.length;
      while (i < ii) {
        c = value[i];
        if (mode === 0 && whitespace.indexOf(c) > -1) {
          i++;
          continue;
        }
        switch (c) {
          case '"':
            if (!quote) {
              quote = c;
            } else if (quote === c) {
              quote = null;
            }
            break;
          case '(':
            if (quote) {
              break;
            } else if (mode === 0) {
              mode = 1;
              block += c;
              i++;
              continue;
            } else {
              numParen++;
            }
            break;
          case ')':
            if (quote) {
              break;
            } else if (mode === 1) {
              if (numParen === 0) {
                mode = 0;
                block += c;
                appendResult();
                i++;
                continue;
              } else {
                numParen--;
              }
            }
            break;
          case ',':
            if (quote) {
              break;
            } else if (mode === 0) {
              appendResult();
              i++;
              continue;
            } else if (mode === 1) {
              if (numParen === 0 && !method.match(/^url$/i)) {
                args.push(definition);
                definition = '';
                block += c;
                i++;
                continue;
              }
            }
        }
        block += c;
        if (mode === 0) {
          method += c;
        } else {
          definition += c;
        }
        i++;
      }
      appendResult();
      return results;
    };
    _html2canvas.Util.Bounds = function(element) {
      var bounds, clientRect;
      clientRect = void 0;
      bounds = {};
      if (element.getBoundingClientRect) {
        clientRect = element.getBoundingClientRect();
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || clientRect.top + clientRect.height;
        bounds.left = clientRect.left;
        bounds.width = element.offsetWidth;
        bounds.height = element.offsetHeight;
      }
      return bounds;
    };
    _html2canvas.Util.OffsetBounds = function(element) {
      var parent;
      parent = element.offsetParent ? _html2canvas.Util.OffsetBounds(element.offsetParent) : {
        top: 0,
        left: 0
      };
      return {
        top: element.offsetTop + parent.top,
        bottom: element.offsetTop + element.offsetHeight + parent.top,
        left: element.offsetLeft + parent.left,
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    };
    _html2canvas.Util.getCSS = function(element, attribute, index) {
      var arr, value;
      if (previousElement !== element) {
        computedCSS = document.defaultView.getComputedStyle(element, null);
      }
      value = computedCSS[attribute];
      if (/^background(Size|Position)$/.test(attribute)) {
        return parseBackgroundSizePosition(value, element, attribute, index);
      } else if (/border(Top|Bottom)(Left|Right)Radius/.test(attribute)) {
        arr = value.split(' ');
        if (arr.length <= 1) {
          arr[1] = arr[0];
        }
        return arr.map(asInt);
      }
      return value;
    };
    _html2canvas.Util.resizeBounds = function(current_width, current_height, target_width, target_height, stretch_mode) {
      var current_ratio, output_height, output_width, target_ratio;
      target_ratio = target_width / target_height;
      current_ratio = current_width / current_height;
      output_width = void 0;
      output_height = void 0;
      if (!stretch_mode || stretch_mode === 'auto') {
        output_width = target_width;
        output_height = target_height;
      } else if (target_ratio < current_ratio ^ stretch_mode === 'contain') {
        output_height = target_height;
        output_width = target_height * current_ratio;
      } else {
        output_width = target_width;
        output_height = target_width / current_ratio;
      }
      return {
        width: output_width,
        height: output_height
      };
    };
    _html2canvas.Util.BackgroundPosition = function(el, bounds, image, imageIndex, backgroundSize) {
      var result;
      result = backgroundBoundsFactory('backgroundPosition', el, bounds, image, imageIndex, backgroundSize);
      return {
        left: result[0],
        top: result[1]
      };
    };
    _html2canvas.Util.BackgroundSize = function(el, bounds, image, imageIndex) {
      var result;
      result = backgroundBoundsFactory('backgroundSize', el, bounds, image, imageIndex);
      return {
        width: result[0],
        height: result[1]
      };
    };
    _html2canvas.Util.Extend = function(options, defaults) {
      var key;
      for (key in options) {
        if (options.hasOwnProperty(key)) {
          defaults[key] = options[key];
        }
      }
      return defaults;
    };

    /*
     * Derived from jQuery.contents()
     * Copyright 2010, John Resig
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     */
    _html2canvas.Util.Children = function(elem) {
      var children, ex;
      children = void 0;
      try {
        children = elem.nodeName && elem.nodeName.toUpperCase() === 'IFRAME' ? elem.contentDocument || elem.contentWindow.document : (function(array) {
          var ret;
          ret = [];
          if (array !== null) {
            (function(first, second) {
              var i, j, l;
              i = first.length;
              j = 0;
              if (typeof second.length === 'number') {
                l = second.length;
                while (j < l) {
                  first[i++] = second[j];
                  j++;
                }
              } else {
                while (second[j] !== void 0) {
                  first[i++] = second[j++];
                }
              }
              first.length = i;
              return first;
            })(ret, array);
          }
          return ret;
        })(elem.childNodes);
      } catch (_error) {
        ex = _error;
        _html2canvas.Util.log('html2canvas.Util.Children failed with exception: ' + ex.message);
        children = [];
      }
      return children;
    };
    _html2canvas.Util.isTransparent = function(backgroundColor) {
      return backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)';
    };
    _html2canvas.Util.Font = (function() {
      var fontData;
      fontData = {};
      return function(font, fontSize, doc) {
        var baseline, container, img, metricsObj, middle, sampleText, span;
        if (fontData[font + '-' + fontSize] !== void 0) {
          return fontData[font + '-' + fontSize];
        }
        container = doc.createElement('div');
        img = doc.createElement('img');
        span = doc.createElement('span');
        sampleText = 'Hidden Text';
        baseline = void 0;
        middle = void 0;
        metricsObj = void 0;
        container.style.visibility = 'hidden';
        container.style.fontFamily = font;
        container.style.fontSize = fontSize;
        container.style.margin = 0;
        container.style.padding = 0;
        doc.body.appendChild(container);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=';
        img.width = 1;
        img.height = 1;
        img.style.margin = 0;
        img.style.padding = 0;
        img.style.verticalAlign = 'baseline';
        span.style.fontFamily = font;
        span.style.fontSize = fontSize;
        span.style.margin = 0;
        span.style.padding = 0;
        span.appendChild(doc.createTextNode(sampleText));
        container.appendChild(span);
        container.appendChild(img);
        baseline = img.offsetTop - span.offsetTop + 1;
        container.removeChild(span);
        container.appendChild(doc.createTextNode(sampleText));
        container.style.lineHeight = 'normal';
        img.style.verticalAlign = 'super';
        middle = img.offsetTop - container.offsetTop + 1;
        metricsObj = {
          baseline: baseline,
          lineWidth: 1,
          middle: middle
        };
        fontData[font + '-' + fontSize] = metricsObj;
        doc.body.removeChild(container);
        return metricsObj;
      };
    })();
    (function() {
      var Generate, Util, addScrollStops, reGradients;
      Util = _html2canvas.Util;
      Generate = {};
      addScrollStops = function(grad) {
        return function(colorStop) {
          var e;
          try {
            grad.addColorStop(colorStop.stop, colorStop.color);
          } catch (_error) {
            e = _error;
            Util.log(['failed to add color stop: ', e, '; tried to add: ', colorStop]);
          }
        };
      };
      _html2canvas.Generate = Generate;
      reGradients = [/^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/, /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/];

      /*
       * TODO: Add IE10 vendor prefix (-ms) support
       * TODO: Add W3C gradient (linear-gradient) support
       * TODO: Add old Webkit -webkit-gradient(radial, ...) support
       * TODO: Maybe some RegExp optimizations are possible ;o)
       */
      Generate.parseGradient = function(css, bounds) {
        var bl, br, gradient, i, len, m1, m2, m2Len, m3, step, stop, tl, tr;
        gradient = void 0;
        i = void 0;
        len = reGradients.length;
        m1 = void 0;
        stop = void 0;
        m2 = void 0;
        m2Len = void 0;
        step = void 0;
        m3 = void 0;
        tl = void 0;
        tr = void 0;
        br = void 0;
        bl = void 0;
        i = 0;
        while (i < len) {
          m1 = css.match(reGradients[i]);
          if (m1) {
            break;
          }
          i += 1;
        }
        if (m1) {
          switch (m1[1]) {
            case '-webkit-linear-gradient':
            case '-o-linear-gradient':
              gradient = {
                type: 'linear',
                x0: null,
                y0: null,
                x1: null,
                y1: null,
                colorStops: []
              };
              m2 = m1[2].match(/\w+/g);
              if (m2) {
                m2Len = m2.length;
                i = 0;
                while (i < m2Len) {
                  switch (m2[i]) {
                    case 'top':
                      gradient.y0 = 0;
                      gradient.y1 = bounds.height;
                      break;
                    case 'right':
                      gradient.x0 = bounds.width;
                      gradient.x1 = 0;
                      break;
                    case 'bottom':
                      gradient.y0 = bounds.height;
                      gradient.y1 = 0;
                      break;
                    case 'left':
                      gradient.x0 = 0;
                      gradient.x1 = bounds.width;
                  }
                  i += 1;
                }
              }
              if (gradient.x0 === null && gradient.x1 === null) {
                gradient.x0 = gradient.x1 = bounds.width / 2;
              }
              if (gradient.y0 === null && gradient.y1 === null) {
                gradient.y0 = gradient.y1 = bounds.height / 2;
              }
              m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
              if (m2) {
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                i = 0;
                while (i < m2Len) {
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                  if (m3[2]) {
                    stop = parseFloat(m3[2]);
                    if (m3[3] === '%') {
                      stop /= 100;
                    } else {
                      stop /= bounds.width;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                  i += 1;
                }
              }
              break;
            case '-webkit-gradient':
              gradient = {
                type: m1[2] === 'radial' ? 'circle' : m1[2],
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                colorStops: []
              };
              m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
              if (m2) {
                gradient.x0 = m2[1] * bounds.width / 100;
                gradient.y0 = m2[2] * bounds.height / 100;
                gradient.x1 = m2[3] * bounds.width / 100;
                gradient.y1 = m2[4] * bounds.height / 100;
              }
              m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
              if (m2) {
                m2Len = m2.length;
                i = 0;
                while (i < m2Len) {
                  m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                  stop = parseFloat(m3[2]);
                  if (m3[1] === 'from') {
                    stop = 0.0;
                  }
                  if (m3[1] === 'to') {
                    stop = 1.0;
                  }
                  gradient.colorStops.push({
                    color: m3[3],
                    stop: stop
                  });
                  i += 1;
                }
              }
              break;
            case '-moz-linear-gradient':
              gradient = {
                type: 'linear',
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                colorStops: []
              };
              m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
              if (m2) {
                gradient.x0 = m2[1] * bounds.width / 100;
                gradient.y0 = m2[2] * bounds.height / 100;
                gradient.x1 = bounds.width - gradient.x0;
                gradient.y1 = bounds.height - gradient.y0;
              }
              m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
              if (m2) {
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                i = 0;
                while (i < m2Len) {
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                  if (m3[2]) {
                    stop = parseFloat(m3[2]);
                    if (m3[3]) {
                      stop /= 100;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                  i += 1;
                }
              }
              break;
            case '-webkit-radial-gradient':
            case '-moz-radial-gradient':
            case '-o-radial-gradient':
              gradient = {
                type: 'circle',
                x0: 0,
                y0: 0,
                x1: bounds.width,
                y1: bounds.height,
                cx: 0,
                cy: 0,
                rx: 0,
                ry: 0,
                colorStops: []
              };
              m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
              if (m2) {
                gradient.cx = m2[1] * bounds.width / 100;
                gradient.cy = m2[2] * bounds.height / 100;
              }
              m2 = m1[3].match(/\w+/);
              m3 = m1[4].match(/[a-z\-]*/);
              if (m2 && m3) {
                switch (m3[0]) {
                  case 'farthest-corner':
                  case 'cover':
                  case '':
                    tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                    break;
                  case 'closest-corner':
                    tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                    bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                    gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                    break;
                  case 'farthest-side':
                    if (m2[0] === 'circle') {
                      gradient.rx = gradient.ry = Math.max(gradient.cx, gradient.cy, gradient.x1 - gradient.cx, gradient.y1 - gradient.cy);
                    } else {
                      gradient.type = m2[0];
                      gradient.rx = Math.max(gradient.cx, gradient.x1 - gradient.cx);
                      gradient.ry = Math.max(gradient.cy, gradient.y1 - gradient.cy);
                    }
                    break;
                  case 'closest-side':
                  case 'contain':
                    if (m2[0] === 'circle') {
                      gradient.rx = gradient.ry = Math.min(gradient.cx, gradient.cy, gradient.x1 - gradient.cx, gradient.y1 - gradient.cy);
                    } else {
                      gradient.type = m2[0];
                      gradient.rx = Math.min(gradient.cx, gradient.x1 - gradient.cx);
                      gradient.ry = Math.min(gradient.cy, gradient.y1 - gradient.cy);
                    }
                }
              }
              m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
              if (m2) {
                m2Len = m2.length;
                step = 1 / Math.max(m2Len - 1, 1);
                i = 0;
                while (i < m2Len) {
                  m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                  if (m3[2]) {
                    stop = parseFloat(m3[2]);
                    if (m3[3] === '%') {
                      stop /= 100;
                    } else {
                      stop /= bounds.width;
                    }
                  } else {
                    stop = i * step;
                  }
                  gradient.colorStops.push({
                    color: m3[1],
                    stop: stop
                  });
                  i += 1;
                }
              }
          }
        }
        return gradient;
      };
      Generate.Gradient = function(src, bounds) {
        var canvas, canvasRadial, ctx, ctxRadial, di, grad, gradient, ri;
        if (bounds.width === 0 || bounds.height === 0) {
          return;
        }
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        gradient = void 0;
        grad = void 0;
        canvas.width = bounds.width;
        canvas.height = bounds.height;
        gradient = _html2canvas.Generate.parseGradient(src, bounds);
        if (gradient) {
          switch (gradient.type) {
            case 'linear':
              grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
              gradient.colorStops.forEach(addScrollStops(grad));
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, bounds.width, bounds.height);
              break;
            case 'circle':
              grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);
              gradient.colorStops.forEach(addScrollStops(grad));
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, bounds.width, bounds.height);
              break;
            case 'ellipse':
              canvasRadial = document.createElement('canvas');
              ctxRadial = canvasRadial.getContext('2d');
              ri = Math.max(gradient.rx, gradient.ry);
              di = ri * 2;
              canvasRadial.width = canvasRadial.height = di;
              grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);
              gradient.colorStops.forEach(addScrollStops(grad));
              ctxRadial.fillStyle = grad;
              ctxRadial.fillRect(0, 0, di, di);
              ctx.fillStyle = gradient.colorStops[gradient.colorStops.length - 1].color;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(canvasRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);
          }
        }
        return canvas;
      };
      Generate.ListAlpha = function(number) {
        var modulus, tmp;
        tmp = '';
        modulus = void 0;
        while (true) {
          modulus = number % 26;
          tmp = String.fromCharCode(modulus + 64) + tmp;
          number = number / 26;
          if (!(number * 26 > 26)) {
            break;
          }
        }
        return tmp;
      };
      Generate.ListRoman = function(number) {
        var decimal, len, roman, romanArray, v;
        romanArray = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        roman = '';
        v = void 0;
        len = romanArray.length;
        if (number <= 0 || number >= 4000) {
          return number;
        }
        v = 0;
        while (v < len) {
          while (number >= decimal[v]) {
            number -= decimal[v];
            roman += romanArray[v];
          }
          v += 1;
        }
        return roman;
      };
    })();
    _html2canvas.Parse = function(images, options) {
      var Util, backgroundRepeatShape, bezierCurve, body, calculateCurvePoints, capitalize, clipBounds, createShape, createStack, doc, documentHeight, documentWidth, drawImage, drawSide, drawText, element, elementIndex, getBackgroundBounds, getBorderClip, getBorderData, getBorderRadiusData, getBounds, getCSS, getCSSInt, getCurvePoints, getPseudoElement, getTextBounds, getTransform, hidePseudoElements, ignoreElementsRegExp, indexedProperty, init, injectPseudoElements, isElementVisible, listItemText, listPosition, loadImage, noLetterSpacing, numDraws, parseBorders, parseChildren, parseCorner, parseElement, pseudoHide, removePx, renderBackgroundColor, renderBackgroundImage, renderBackgroundRepeat, renderBackgroundRepeating, renderBorders, renderElement, renderFormValue, renderImage, renderListItem, renderRect, renderText, renderTextDecoration, resizeImage, setOpacity, setTextVariables, setZ, support, textRangeBounds, textTransform, textWrapperBounds, transformRegExp;
      documentWidth = function() {
        return Math.max(Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth), Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth), Math.max(doc.body.clientWidth, doc.documentElement.clientWidth));
      };
      documentHeight = function() {
        return Math.max(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight), Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight), Math.max(doc.body.clientHeight, doc.documentElement.clientHeight));
      };
      getCSSInt = function(element, attribute) {
        var val;
        val = parseInt(getCSS(element, attribute), 10);
        if (isNaN(val)) {
          return 0;
        } else {
          return val;
        }
      };
      renderRect = function(ctx, x, y, w, h, bgcolor) {
        if (bgcolor !== 'transparent') {
          ctx.setVariable('fillStyle', bgcolor);
          ctx.fillRect(x, y, w, h);
          numDraws += 1;
        }
      };
      capitalize = function(m, p1, p2) {
        if (m.length > 0) {
          return p1 + p2.toUpperCase();
        }
      };
      textTransform = function(text, transform) {
        switch (transform) {
          case 'lowercase':
            return text.toLowerCase();
          case 'capitalize':
            return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
          case 'uppercase':
            return text.toUpperCase();
          default:
            return text;
        }
      };
      noLetterSpacing = function(letter_spacing) {
        return /^(normal|none|0px)$/.test(letter_spacing);
      };
      drawText = function(currentText, x, y, ctx) {
        if (currentText !== null && Util.trimText(currentText).length > 0) {
          ctx.fillText(currentText, x, y);
          numDraws += 1;
        }
      };
      setTextVariables = function(ctx, el, text_decoration, color) {
        var align, bold, family, shadows, size;
        align = false;
        bold = getCSS(el, 'fontWeight');
        family = getCSS(el, 'fontFamily');
        size = getCSS(el, 'fontSize');
        shadows = Util.parseTextShadows(getCSS(el, 'textShadow'));
        switch (parseInt(bold, 10)) {
          case 401:
            bold = 'bold';
            break;
          case 400:
            bold = 'normal';
        }
        ctx.setVariable('fillStyle', color);
        ctx.setVariable('font', [getCSS(el, 'fontStyle'), getCSS(el, 'fontVariant'), bold, size, family].join(' '));
        ctx.setVariable('textAlign', align ? 'right' : 'left');
        if (shadows.length) {
          ctx.setVariable('shadowColor', shadows[0].color);
          ctx.setVariable('shadowOffsetX', shadows[0].offsetX);
          ctx.setVariable('shadowOffsetY', shadows[0].offsetY);
          ctx.setVariable('shadowBlur', shadows[0].blur);
        }
        if (text_decoration !== 'none') {
          return Util.Font(family, size, doc);
        }
      };
      renderTextDecoration = function(ctx, text_decoration, bounds, metrics, color) {
        switch (text_decoration) {
          case 'underline':
            renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
            break;
          case 'overline':
            renderRect(ctx, bounds.left, Math.round(bounds.top), bounds.width, 1, color);
            break;
          case 'line-through':
            renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
        }
      };
      getTextBounds = function(state, text, textDecoration, isLast, transform) {
        var bounds, newTextNode;
        bounds = void 0;
        if (support.rangeBounds && !transform) {
          if (textDecoration !== 'none' || Util.trimText(text).length !== 0) {
            bounds = textRangeBounds(text, state.node, state.textOffset);
          }
          state.textOffset += text.length;
        } else if (state.node && typeof state.node.nodeValue === 'string') {
          newTextNode = isLast ? state.node.splitText(text.length) : null;
          bounds = textWrapperBounds(state.node, transform);
          state.node = newTextNode;
        }
        return bounds;
      };
      textRangeBounds = function(text, textNode, textOffset) {
        var range;
        range = doc.createRange();
        range.setStart(textNode, textOffset);
        range.setEnd(textNode, textOffset + text.length);
        return range.getBoundingClientRect();
      };
      textWrapperBounds = function(oldTextNode, transform) {
        var backupText, bounds, parent, wrapElement;
        parent = oldTextNode.parentNode;
        wrapElement = doc.createElement('wrapper');
        backupText = oldTextNode.cloneNode(true);
        wrapElement.appendChild(oldTextNode.cloneNode(true));
        parent.replaceChild(wrapElement, oldTextNode);
        bounds = transform ? Util.OffsetBounds(wrapElement) : Util.Bounds(wrapElement);
        parent.replaceChild(backupText, wrapElement);
        return bounds;
      };
      renderText = function(el, textNode, stack) {
        var color, ctx, metrics, state, textAlign, textDecoration, textList;
        ctx = stack.ctx;
        color = getCSS(el, 'color');
        textDecoration = getCSS(el, 'textDecoration');
        textAlign = getCSS(el, 'textAlign');
        metrics = void 0;
        textList = void 0;
        state = {
          node: textNode,
          textOffset: 0
        };
        if (Util.trimText(textNode.nodeValue).length > 0) {
          textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, 'textTransform'));
          textAlign = textAlign.replace(['-webkit-auto'], ['auto']);
          textList = !options.letterRendering && /^(left|right|justify|auto)$/.test(textAlign) && noLetterSpacing(getCSS(el, 'letterSpacing')) ? textNode.nodeValue.split(/(\b| )/) : textNode.nodeValue.split('');
          metrics = setTextVariables(ctx, el, textDecoration, color);
          if (options.chinese) {
            textList.forEach(function(word, index) {
              if (/.*[\u4E00-\u9FA5].*$/.test(word)) {
                word = word.split('');
                word.unshift(index, 1);
                textList.splice.apply(textList, word);
              }
            });
          }
          textList.forEach(function(text, index) {
            var bounds;
            bounds = getTextBounds(state, text, textDecoration, index < textList.length - 1, stack.transform.matrix);
            if (bounds) {
              drawText(text, bounds.left, bounds.bottom, ctx);
              renderTextDecoration(ctx, textDecoration, bounds, metrics, color);
            }
          });
        }
      };
      listPosition = function(element, val) {
        var boundElement, bounds, originalType;
        boundElement = doc.createElement('boundelement');
        originalType = void 0;
        bounds = void 0;
        boundElement.style.display = 'inline';
        originalType = element.style.listStyleType;
        element.style.listStyleType = 'none';
        boundElement.appendChild(doc.createTextNode(val));
        element.insertBefore(boundElement, element.firstChild);
        bounds = Util.Bounds(boundElement);
        element.removeChild(boundElement);
        element.style.listStyleType = originalType;
        return bounds;
      };
      elementIndex = function(el) {
        var childs, count, i;
        i = -1;
        count = 1;
        childs = el.parentNode.childNodes;
        if (el.parentNode) {
          while (childs[++i] !== el) {
            if (childs[i].nodeType === 1) {
              count++;
            }
          }
          return count;
        } else {
          return -1;
        }
      };
      listItemText = function(element, type) {
        var currentIndex, text;
        currentIndex = elementIndex(element);
        text = void 0;
        switch (type) {
          case 'decimal':
            text = currentIndex;
            break;
          case 'decimal-leading-zero':
            text = currentIndex.toString().length === 1 ? (currentIndex = '0' + currentIndex.toString()) : currentIndex.toString();
            break;
          case 'upper-roman':
            text = _html2canvas.Generate.ListRoman(currentIndex);
            break;
          case 'lower-roman':
            text = _html2canvas.Generate.ListRoman(currentIndex).toLowerCase();
            break;
          case 'lower-alpha':
            text = _html2canvas.Generate.ListAlpha(currentIndex).toLowerCase();
            break;
          case 'upper-alpha':
            text = _html2canvas.Generate.ListAlpha(currentIndex);
        }
        return text + '. ';
      };
      renderListItem = function(element, stack, elBounds) {
        var ctx, listBounds, text, type, x;
        x = void 0;
        text = void 0;
        ctx = stack.ctx;
        type = getCSS(element, 'listStyleType');
        listBounds = void 0;
        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
          text = listItemText(element, type);
          listBounds = listPosition(element, text);
          setTextVariables(ctx, element, 'none', getCSS(element, 'color'));
          if (getCSS(element, 'listStylePosition') === 'inside') {
            ctx.setVariable('textAlign', 'left');
            x = elBounds.left;
          } else {
            return;
          }
          drawText(text, x, listBounds.bottom, ctx);
        }
      };
      loadImage = function(src) {
        var img;
        img = images[src];
        if (img && img.succeeded === true) {
          return img.img;
        } else {
          return false;
        }
      };
      clipBounds = function(src, dst) {
        var x, x2, y, y2;
        x = Math.max(src.left, dst.left);
        y = Math.max(src.top, dst.top);
        x2 = Math.min(src.left + src.width, dst.left + dst.width);
        y2 = Math.min(src.top + src.height, dst.top + dst.height);
        return {
          left: x,
          top: y,
          width: x2 - x,
          height: y2 - y
        };
      };
      setZ = function(element, stack, parentStack) {
        var isFloated, isPositioned, newContext, opacity, zIndex;
        newContext = void 0;
        isPositioned = stack.cssPosition !== 'static';
        zIndex = isPositioned ? getCSS(element, 'zIndex') : 'auto';
        opacity = getCSS(element, 'opacity');
        isFloated = getCSS(element, 'cssFloat') !== 'none';
        stack.zIndex = newContext = h2czContext(zIndex);
        newContext.isPositioned = isPositioned;
        newContext.isFloated = isFloated;
        newContext.opacity = opacity;
        newContext.ownStacking = zIndex !== 'auto' || opacity < 1;
        if (parentStack) {
          parentStack.zIndex.children.push(stack);
        }
      };
      renderImage = function(ctx, element, image, bounds, borders) {
        var d1, d2, d3, d4, paddingBottom, paddingLeft, paddingRight, paddingTop;
        paddingLeft = getCSSInt(element, 'paddingLeft');
        paddingTop = getCSSInt(element, 'paddingTop');
        paddingRight = getCSSInt(element, 'paddingRight');
        paddingBottom = getCSSInt(element, 'paddingBottom');
        d1 = bounds.left + paddingLeft + borders[3].width;
        d2 = bounds.top + paddingTop + borders[0].width;
        d3 = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
        d4 = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
        drawImage(ctx, image, 0, 0, image.width, image.height, d1, d2, d3, d4);
      };
      getBorderData = function(element) {
        return ['Top', 'Right', 'Bottom', 'Left'].map(function(side) {
          return {
            width: getCSSInt(element, 'border' + side + 'Width'),
            color: getCSS(element, 'border' + side + 'Color')
          };
        });
      };
      getBorderRadiusData = function(element) {
        return ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(function(side) {
          return getCSS(element, 'border' + side + 'Radius');
        });
      };
      bezierCurve = function(start, startControl, endControl, end) {
        var lerp;
        lerp = function(a, b, t) {
          return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
          };
        };
        return {
          start: start,
          startControl: startControl,
          endControl: endControl,
          end: end,
          subdivide: function(t) {
            var ab, abbc, bc, bccd, cd, dest;
            ab = lerp(start, startControl, t);
            bc = lerp(startControl, endControl, t);
            cd = lerp(endControl, end, t);
            abbc = lerp(ab, bc, t);
            bccd = lerp(bc, cd, t);
            dest = lerp(abbc, bccd, t);
            return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
          },
          curveTo: function(borderArgs) {
            borderArgs.push(['bezierCurve', startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
          },
          curveToReversed: function(borderArgs) {
            borderArgs.push(['bezierCurve', endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
          }
        };
      };
      parseCorner = function(borderArgs, radius1, radius2, corner1, corner2, x, y) {
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(['line', corner1[0].start.x, corner1[0].start.y]);
          corner1[0].curveTo(borderArgs);
          corner1[1].curveTo(borderArgs);
        } else {
          borderArgs.push(['line', x, y]);
        }
        if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(['line', corner2[0].start.x, corner2[0].start.y]);
        }
      };
      drawSide = function(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
        var borderArgs;
        borderArgs = [];
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(['line', outer1[1].start.x, outer1[1].start.y]);
          outer1[1].curveTo(borderArgs);
        } else {
          borderArgs.push(['line', borderData.c1[0], borderData.c1[1]]);
        }
        if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(['line', outer2[0].start.x, outer2[0].start.y]);
          outer2[0].curveTo(borderArgs);
          borderArgs.push(['line', inner2[0].end.x, inner2[0].end.y]);
          inner2[0].curveToReversed(borderArgs);
        } else {
          borderArgs.push(['line', borderData.c2[0], borderData.c2[1]]);
          borderArgs.push(['line', borderData.c3[0], borderData.c3[1]]);
        }
        if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(['line', inner1[1].end.x, inner1[1].end.y]);
          inner1[1].curveToReversed(borderArgs);
        } else {
          borderArgs.push(['line', borderData.c4[0], borderData.c4[1]]);
        }
        return borderArgs;
      };
      calculateCurvePoints = function(bounds, borderRadius, borders) {
        var blh, blv, bottomWidth, brh, brv, height, innerCurve, leftHeight, rightHeight, tlh, tlv, topWidth, trh, trv, width, x, y;
        x = bounds.left;
        y = bounds.top;
        width = bounds.width;
        height = bounds.height;
        tlh = borderRadius[0][0];
        tlv = borderRadius[0][1];
        trh = borderRadius[1][0];
        trv = borderRadius[1][1];
        brh = borderRadius[2][0];
        brv = borderRadius[2][1];
        blh = borderRadius[3][0];
        blv = borderRadius[3][1];
        topWidth = width - trh;
        rightHeight = height - brv;
        bottomWidth = width - brh;
        leftHeight = height - blv;
        innerCurve = getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width ? 0 : trh - borders[3].width), trv - borders[0].width);
        return {
          topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
          topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
          topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
          topRightInner: innerCurve.topRight.subdivide(0.5),
          bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
          bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width + borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width), Math.max(0, brv - borders[2].width)).bottomRight.subdivide(0.5),
          bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
          bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), Math.max(0, blv - borders[2].width)).bottomLeft.subdivide(0.5)
        };
      };
      getBorderClip = function(element, borderPoints, borders, radius, bounds) {
        var backgroundClip, borderArgs;
        backgroundClip = getCSS(element, 'backgroundClip');
        borderArgs = [];
        switch (backgroundClip) {
          case 'content-box':
          case 'padding-box':
            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
            break;
          default:
            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
            break;
        }
        return borderArgs;
      };
      parseBorders = function(element, bounds, borders) {
        var bh, borderArgs, borderData, borderPoints, borderRadius, borderSide, borderY, bw, bx, height, width, x, y;
        x = bounds.left;
        y = bounds.top;
        width = bounds.width;
        height = bounds.height;
        borderSide = void 0;
        bx = void 0;
        borderY = void 0;
        bw = void 0;
        bh = void 0;
        borderArgs = void 0;
        borderRadius = getBorderRadiusData(element);
        borderPoints = calculateCurvePoints(bounds, borderRadius, borders);
        borderData = {
          clip: getBorderClip(element, borderPoints, borders, borderRadius, bounds),
          borders: []
        };
        borderSide = 0;
        while (borderSide < 4) {
          if (borders[borderSide].width > 0) {
            bx = x;
            borderY = y;
            bw = width;
            bh = height - borders[2].width;
            switch (borderSide) {
              case 0:
                bh = borders[0].width;
                borderArgs = drawSide({
                  c1: [bx, borderY],
                  c2: [bx + bw, borderY],
                  c3: [bx + bw - borders[1].width, borderY + bh],
                  c4: [bx + borders[3].width, borderY + bh]
                }, borderRadius[0], borderRadius[1], borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                break;
              case 1:
                bx = x + width - borders[1].width;
                bw = borders[1].width;
                borderArgs = drawSide({
                  c1: [bx + bw, borderY],
                  c2: [bx + bw, borderY + bh + borders[2].width],
                  c3: [bx, borderY + bh],
                  c4: [bx, borderY + borders[0].width]
                }, borderRadius[1], borderRadius[2], borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                break;
              case 2:
                borderY = borderY + height - borders[2].width;
                bh = borders[2].width;
                borderArgs = drawSide({
                  c1: [bx + bw, borderY + bh],
                  c2: [bx, borderY + bh],
                  c3: [bx + borders[3].width, borderY],
                  c4: [bx + bw - borders[3].width, borderY]
                }, borderRadius[2], borderRadius[3], borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                break;
              case 3:
                bw = borders[3].width;
                borderArgs = drawSide({
                  c1: [bx, borderY + bh + borders[2].width],
                  c2: [bx, borderY],
                  c3: [bx + bw, borderY + borders[0].width],
                  c4: [bx + bw, borderY + bh]
                }, borderRadius[3], borderRadius[0], borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
            }
            borderData.borders.push({
              args: borderArgs,
              color: borders[borderSide].color
            });
          }
          borderSide++;
        }
        return borderData;
      };
      createShape = function(ctx, args) {
        var shape;
        shape = ctx.drawShape();
        args.forEach(function(border, index) {
          shape[index === 0 ? 'moveTo' : border[0] + 'To'].apply(null, border.slice(1));
        });
        return shape;
      };
      renderBorders = function(ctx, borderArgs, color) {
        if (color !== 'transparent') {
          ctx.setVariable('fillStyle', color);
          createShape(ctx, borderArgs);
          ctx.fill();
          numDraws += 1;
        }
      };
      renderFormValue = function(el, bounds, stack) {
        var cssPropertyArray, textNode, textValue, valueWrap;
        valueWrap = doc.createElement('valuewrap');
        cssPropertyArray = ['lineHeight', 'textAlign', 'fontFamily', 'color', 'fontSize', 'paddingLeft', 'paddingTop', 'width', 'height', 'border', 'borderLeftWidth', 'borderTopWidth'];
        textValue = void 0;
        textNode = void 0;
        cssPropertyArray.forEach(function(property) {
          var e;
          try {
            valueWrap.style[property] = getCSS(el, property);
          } catch (_error) {
            e = _error;
            Util.log('html2canvas: Parse: Exception caught in renderFormValue: ' + e.message);
          }
        });
        valueWrap.style.borderColor = 'black';
        valueWrap.style.borderStyle = 'solid';
        valueWrap.style.display = 'block';
        valueWrap.style.position = 'absolute';
        if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === 'SELECT') {
          valueWrap.style.lineHeight = getCSS(el, 'height');
        }
        valueWrap.style.top = bounds.top + 'px';
        valueWrap.style.left = bounds.left + 'px';
        textValue = el.nodeName === 'SELECT' ? (el.options[el.selectedIndex] || 0).text : el.value;
        if (!textValue) {
          textValue = el.placeholder;
        }
        textNode = doc.createTextNode(textValue);
        valueWrap.appendChild(textNode);
        body.appendChild(valueWrap);
        renderText(el, textNode, stack);
        body.removeChild(valueWrap);
      };
      drawImage = function(ctx) {
        ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
        numDraws += 1;
      };
      getPseudoElement = function(el, which) {
        var content, elStyle, elps, first, isImage;
        elStyle = window.getComputedStyle(el, which);
        if (!elStyle || !elStyle.content || elStyle.content === 'none' || elStyle.content === '-moz-alt-content' || elStyle.display === 'none') {
          return;
        }
        content = elStyle.content + '';
        first = content.substr(0, 1);
        if (first === content.substr(content.length - 1) && first.match(/'|"/)) {
          content = content.substr(1, content.length - 2);
        }
        isImage = content.substr(0, 3) === 'url';
        elps = document.createElement(isImage ? 'img' : 'span');
        elps.className = pseudoHide + '-before ' + pseudoHide + '-after';
        Object.keys(elStyle).filter(indexedProperty).forEach(function(prop) {
          var e;
          try {
            elps.style[prop] = elStyle[prop];
          } catch (_error) {
            e = _error;
            Util.log(['Tried to assign readonly property ', prop, 'Error:', e]);
          }
        });
        if (isImage) {
          elps.src = Util.parseBackgroundImage(content)[0].args[0];
        } else {
          elps.innerHTML = content;
        }
        return elps;
      };
      indexedProperty = function(property) {
        return isNaN(window.parseInt(property, 10));
      };
      injectPseudoElements = function(el, stack) {
        var after, before;
        before = getPseudoElement(el, ':before');
        after = getPseudoElement(el, ':after');
        if (!before && !after) {
          return;
        }
        if (before) {
          el.className += ' ' + pseudoHide + '-before';
          el.parentNode.insertBefore(before, el);
          parseElement(before, stack, true);
          el.parentNode.removeChild(before);
          el.className = el.className.replace(pseudoHide + '-before', '').trim();
        }
        if (after) {
          el.className += ' ' + pseudoHide + '-after';
          el.appendChild(after);
          parseElement(after, stack, true);
          el.removeChild(after);
          el.className = el.className.replace(pseudoHide + '-after', '').trim();
        }
      };
      renderBackgroundRepeat = function(ctx, image, backgroundPosition, bounds) {
        var offsetX, offsetY;
        offsetX = Math.round(bounds.left + backgroundPosition.left);
        offsetY = Math.round(bounds.top + backgroundPosition.top);
        ctx.createPattern(image);
        ctx.translate(offsetX, offsetY);
        ctx.fill();
        ctx.translate(-offsetX, -offsetY);
      };
      backgroundRepeatShape = function(ctx, image, backgroundPosition, bounds, left, top, width, height) {
        var args;
        args = [];
        args.push(['line', Math.round(left), Math.round(top)]);
        args.push(['line', Math.round(left + width), Math.round(top)]);
        args.push(['line', Math.round(left + width), Math.round(height + top)]);
        args.push(['line', Math.round(left), Math.round(height + top)]);
        createShape(ctx, args);
        ctx.save();
        ctx.clip();
        renderBackgroundRepeat(ctx, image, backgroundPosition, bounds);
        ctx.restore();
      };
      renderBackgroundColor = function(ctx, backgroundBounds, bgcolor) {
        renderRect(ctx, backgroundBounds.left, backgroundBounds.top, backgroundBounds.width, backgroundBounds.height, bgcolor);
      };
      renderBackgroundRepeating = function(el, bounds, ctx, image, imageIndex) {
        var backgroundPosition, backgroundRepeat, backgroundSize;
        backgroundSize = Util.BackgroundSize(el, bounds, image, imageIndex);
        backgroundPosition = Util.BackgroundPosition(el, bounds, image, imageIndex, backgroundSize);
        backgroundRepeat = getCSS(el, 'backgroundRepeat').split(',').map(Util.trimText);
        image = resizeImage(image, backgroundSize);
        backgroundRepeat = backgroundRepeat[imageIndex] || backgroundRepeat[0];
        switch (backgroundRepeat) {
          case 'repeat-x':
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds, bounds.left, bounds.top + backgroundPosition.top, 99999, image.height);
            break;
          case 'repeat-y':
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds, bounds.left + backgroundPosition.left, bounds.top, image.width, 99999);
            break;
          case 'no-repeat':
            backgroundRepeatShape(ctx, image, backgroundPosition, bounds, bounds.left + backgroundPosition.left, bounds.top + backgroundPosition.top, image.width, image.height);
            break;
          default:
            renderBackgroundRepeat(ctx, image, backgroundPosition, {
              top: bounds.top,
              left: bounds.left,
              width: image.width,
              height: image.height
            });
            break;
        }
      };
      renderBackgroundImage = function(element, bounds, ctx) {
        var backgroundImage, backgroundImages, image, imageIndex, key;
        backgroundImage = getCSS(element, 'backgroundImage');
        backgroundImages = Util.parseBackgroundImage(backgroundImage);
        image = void 0;
        imageIndex = backgroundImages.length;
        while (imageIndex--) {
          backgroundImage = backgroundImages[imageIndex];
          if (!backgroundImage.args || backgroundImage.args.length === 0) {
            borderSide++;
            continue;
          }
          key = backgroundImage.method === 'url' ? backgroundImage.args[0] : backgroundImage.value;
          image = loadImage(key);
          if (image) {
            renderBackgroundRepeating(element, bounds, ctx, image, imageIndex);
          } else {
            Util.log('html2canvas: Error loading background:', backgroundImage);
          }
        }
      };
      resizeImage = function(image, bounds) {
        var canvas, ctx;
        if (image.width === bounds.width && image.height === bounds.height) {
          return image;
        }
        ctx = void 0;
        canvas = doc.createElement('canvas');
        canvas.width = bounds.width;
        canvas.height = bounds.height;
        ctx = canvas.getContext('2d');
        drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, bounds.width, bounds.height);
        return canvas;
      };
      setOpacity = function(ctx, element, parentStack) {
        return ctx.setVariable('globalAlpha', getCSS(element, 'opacity') * (parentStack ? parentStack.opacity : 1));
      };
      removePx = function(str) {
        return str.replace('px', '');
      };
      getTransform = function(element, parentStack) {
        var match, matrix, transform, transformOrigin;
        transform = getCSS(element, 'transform') || getCSS(element, '-webkit-transform') || getCSS(element, '-moz-transform') || getCSS(element, '-ms-transform') || getCSS(element, '-o-transform');
        transformOrigin = getCSS(element, 'transform-origin') || getCSS(element, '-webkit-transform-origin') || getCSS(element, '-moz-transform-origin') || getCSS(element, '-ms-transform-origin') || getCSS(element, '-o-transform-origin') || '0px 0px';
        transformOrigin = transformOrigin.split(' ').map(removePx).map(Util.asFloat);
        matrix = void 0;
        if (transform && transform !== 'none') {
          match = transform.match(transformRegExp);
          if (match) {
            switch (match[1]) {
              case 'matrix':
                matrix = match[2].split(',').map(Util.trimText).map(Util.asFloat);
            }
          }
        }
        return {
          origin: transformOrigin,
          matrix: matrix
        };
      };
      createStack = function(element, parentStack, bounds, transform) {
        var ctx, stack;
        ctx = h2cRenderContext((!parentStack ? documentWidth() : bounds.width), (!parentStack ? documentHeight() : bounds.height));
        stack = {
          ctx: ctx,
          opacity: setOpacity(ctx, element, parentStack),
          cssPosition: getCSS(element, 'position'),
          borders: getBorderData(element),
          transform: transform,
          clip: parentStack && parentStack.clip ? Util.Extend({}, parentStack.clip) : null
        };
        setZ(element, stack, parentStack);
        if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(element, 'overflow')) === true && /(BODY)/i.test(element.nodeName) === false) {
          stack.clip = stack.clip ? clipBounds(stack.clip, bounds) : bounds;
        }
        return stack;
      };
      getBackgroundBounds = function(borders, bounds, clip) {
        var backgroundBounds;
        backgroundBounds = {
          left: bounds.left + borders[3].width,
          top: bounds.top + borders[0].width,
          width: bounds.width - (borders[1].width + borders[3].width),
          height: bounds.height - (borders[0].width + borders[2].width)
        };
        if (clip) {
          backgroundBounds = clipBounds(backgroundBounds, clip);
        }
        return backgroundBounds;
      };
      getBounds = function(element, transform) {
        var bounds;
        bounds = transform.matrix ? Util.OffsetBounds(element) : Util.Bounds(element);
        transform.origin[0] += bounds.left;
        transform.origin[1] += bounds.top;
        return bounds;
      };
      renderElement = function(element, parentStack, pseudoElement, ignoreBackground) {
        var backgroundBounds, backgroundColor, borderData, borders, bounds, ctx, image, stack, transform;
        transform = getTransform(element, parentStack);
        bounds = getBounds(element, transform);
        image = void 0;
        stack = createStack(element, parentStack, bounds, transform);
        borders = stack.borders;
        ctx = stack.ctx;
        backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip);
        borderData = parseBorders(element, bounds, borders);
        backgroundColor = ignoreElementsRegExp.test(element.nodeName) ? '#efefef' : getCSS(element, 'backgroundColor');
        createShape(ctx, borderData.clip);
        ctx.save();
        ctx.clip();
        if (backgroundBounds.height > 0 && backgroundBounds.width > 0 && !ignoreBackground) {
          renderBackgroundColor(ctx, bounds, backgroundColor);
          renderBackgroundImage(element, backgroundBounds, ctx);
        } else if (ignoreBackground) {
          stack.backgroundColor = backgroundColor;
        }
        ctx.restore();
        borderData.borders.forEach(function(border) {
          renderBorders(ctx, border.args, border.color);
        });
        if (!pseudoElement) {
          injectPseudoElements(element, stack);
        }
        switch (element.nodeName) {
          case 'IMG':
            if (image = loadImage(element.getAttribute('src'))) {
              renderImage(ctx, element, image, bounds, borders);
            } else {
              Util.log('html2canvas: Error loading <img>:' + element.getAttribute('src'));
            }
            break;
          case 'INPUT':
            if (/^(text|url|email|submit|button|reset)$/.test(element.type) && (element.value || element.placeholder || '').length > 0) {
              renderFormValue(element, bounds, stack);
            }
            break;
          case 'TEXTAREA':
            if ((element.value || element.placeholder || '').length > 0) {
              renderFormValue(element, bounds, stack);
            }
            break;
          case 'SELECT':
            if ((element.options || element.placeholder || '').length > 0) {
              renderFormValue(element, bounds, stack);
            }
            break;
          case 'LI':
            renderListItem(element, stack, backgroundBounds);
            break;
          case 'CANVAS':
            renderImage(ctx, element, element, bounds, borders);
        }
        return stack;
      };
      isElementVisible = function(element) {
        return getCSS(element, 'display') !== 'none' && getCSS(element, 'visibility') !== 'hidden' && !element.hasAttribute('data-html2canvas-ignore');
      };
      parseElement = function(element, stack, pseudoElement) {
        if (isElementVisible(element)) {
          stack = renderElement(element, stack, pseudoElement, false) || stack;
          if (!ignoreElementsRegExp.test(element.nodeName)) {
            parseChildren(element, stack, pseudoElement);
          }
        }
      };
      parseChildren = function(element, stack, pseudoElement) {
        Util.Children(element).forEach(function(node) {
          if (node.nodeType === node.ELEMENT_NODE) {
            parseElement(node, stack, pseudoElement);
          } else if (node.nodeType === node.TEXT_NODE) {
            renderText(element, node, stack);
          }
        });
      };
      init = function() {
        var background, stack, transparentBackground;
        background = getCSS(document.documentElement, 'backgroundColor');
        transparentBackground = Util.isTransparent(background) && element === document.body;
        stack = renderElement(element, null, false, transparentBackground);
        parseChildren(element, stack);
        if (transparentBackground) {
          background = stack.backgroundColor;
        }
        body.removeChild(hidePseudoElements);
        return {
          backgroundColor: background,
          stack: stack
        };
      };
      window.scroll(0, 0);
      element = options.elements === void 0 ? document.body : options.elements[0];
      numDraws = 0;
      doc = element.ownerDocument;
      Util = _html2canvas.Util;
      support = Util.Support(options, doc);
      ignoreElementsRegExp = new RegExp('(' + options.ignoreElements + ')');
      body = doc.body;
      getCSS = Util.getCSS;
      pseudoHide = '___html2canvas___pseudoelement';
      hidePseudoElements = doc.createElement('style');
      hidePseudoElements.innerHTML = '.' + pseudoHide + '-before:before { content: "" !important; display: none !important; }' + '.' + pseudoHide + '-after:after { content: "" !important; display: none !important; }';
      body.appendChild(hidePseudoElements);
      images = images || {};
      getCurvePoints = (function(kappa) {
        return function(x, y, r1, r2) {
          var ox, oy, xm, ym;
          ox = r1 * kappa;
          oy = r2 * kappa;
          xm = x + r1;
          ym = y + r2;
          return {
            topLeft: bezierCurve({
              x: x,
              y: ym
            }, {
              x: x,
              y: ym - oy
            }, {
              x: xm - ox,
              y: y
            }, {
              x: xm,
              y: y
            }),
            topRight: bezierCurve({
              x: x,
              y: y
            }, {
              x: x + ox,
              y: y
            }, {
              x: xm,
              y: ym - oy
            }, {
              x: xm,
              y: ym
            }),
            bottomRight: bezierCurve({
              x: xm,
              y: y
            }, {
              x: xm,
              y: y + oy
            }, {
              x: x + ox,
              y: ym
            }, {
              x: x,
              y: ym
            }),
            bottomLeft: bezierCurve({
              x: xm,
              y: ym
            }, {
              x: xm - ox,
              y: ym
            }, {
              x: x,
              y: y + oy
            }, {
              x: x,
              y: y
            })
          };
        };
      })(4 * (Math.sqrt(2) - 1) / 3);
      transformRegExp = /(matrix)\((.+)\)/;
      return init();
    };
    _html2canvas.Preload = function(options) {
      var Util, count, doc, domImages, element, getImages, i, images, imgLen, invalidBackgrounds, isSameOrigin, link, loadBackgroundImages, loadGradientImage, loadPseudoElement, loadPseudoElementImages, methods, pageOrigin, proxyGetImage, setImageLoadHandlers, start, supportCORS, timeoutTimer;
      images = {
        numLoaded: 0,
        numFailed: 0,
        numTotal: 0,
        cleanupDone: false
      };
      pageOrigin = void 0;
      Util = _html2canvas.Util;
      methods = void 0;
      i = void 0;
      count = 0;
      element = options.elements[0] || document.body;
      doc = element.ownerDocument;
      domImages = element.getElementsByTagName('img');
      imgLen = domImages.length;
      link = doc.createElement('a');
      supportCORS = (function(img) {
        return img.crossOrigin !== void 0;
      })(new Image);
      timeoutTimer = void 0;
      isSameOrigin = function(url) {
        var origin;
        link.href = url;
        link.href = link.href;
        origin = link.protocol + link.host;
        return origin === pageOrigin;
      };
      start = function() {
        Util.log('html2canvas: start: images: ' + images.numLoaded + ' / ' + images.numTotal + ' (failed: ' + images.numFailed + ')');
        if (!images.firstRun && images.numLoaded >= images.numTotal) {
          Util.log('Finished loading images: # ' + images.numTotal + ' (failed: ' + images.numFailed + ')');
          if (typeof options.complete === 'function') {
            options.complete(images);
          }
        }
      };
      proxyGetImage = function(url, img, imageObj) {
        var callback_name, script, scriptUrl;
        callback_name = void 0;
        scriptUrl = options.proxy;
        script = void 0;
        link.href = url;
        url = link.href;
        callback_name = 'html2canvas_' + count++;
        imageObj.callbackname = callback_name;
        if (scriptUrl.indexOf('?') > -1) {
          scriptUrl += '&';
        } else {
          scriptUrl += '?';
        }
        scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
        script = doc.createElement('script');
        window[callback_name] = function(a) {
          var ex;
          if (a.substring(0, 6) === 'error:') {
            imageObj.succeeded = false;
            images.numLoaded++;
            images.numFailed++;
            start();
          } else {
            setImageLoadHandlers(img, imageObj);
            img.src = a;
          }
          window[callback_name] = void 0;
          try {
            delete window[callback_name];
          } catch (_error) {
            ex = _error;
          }
          script.parentNode.removeChild(script);
          script = null;
          delete imageObj.script;
          delete imageObj.callbackname;
        };
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', scriptUrl);
        imageObj.script = script;
        window.document.body.appendChild(script);
      };
      loadPseudoElement = function(element, type) {
        var content, style;
        style = window.getComputedStyle(element, type);
        content = style.content;
        if (content.substr(0, 3) === 'url') {
          methods.loadImage(_html2canvas.Util.parseBackgroundImage(content)[0].args[0]);
        }
        loadBackgroundImages(style.backgroundImage, element);
      };
      loadPseudoElementImages = function(element) {
        loadPseudoElement(element, ':before');
        loadPseudoElement(element, ':after');
      };
      loadGradientImage = function(backgroundImage, bounds) {
        var img;
        img = _html2canvas.Generate.Gradient(backgroundImage, bounds);
        if (img !== void 0) {
          images[backgroundImage] = {
            img: img,
            succeeded: true
          };
          images.numTotal++;
          images.numLoaded++;
          start();
        }
      };
      invalidBackgrounds = function(background_image) {
        return background_image && background_image.method && background_image.args && background_image.args.length > 0;
      };
      loadBackgroundImages = function(background_image, el) {
        var bounds;
        bounds = void 0;
        _html2canvas.Util.parseBackgroundImage(background_image).filter(invalidBackgrounds).forEach(function(background_image) {
          if (background_image.method === 'url') {
            methods.loadImage(background_image.args[0]);
          } else if (background_image.method.match(/\-?gradient$/)) {
            if (bounds === void 0) {
              bounds = _html2canvas.Util.Bounds(el);
            }
            loadGradientImage(background_image.value, bounds);
          }
        });
      };
      getImages = function(el) {
        var e, elNodeType, ex;
        elNodeType = false;
        try {
          Util.Children(el).forEach(getImages);
        } catch (_error) {
          e = _error;
        }
        try {
          elNodeType = el.nodeType;
        } catch (_error) {
          ex = _error;
          elNodeType = false;
          Util.log('html2canvas: failed to access some element\'s nodeType - Exception: ' + ex.message);
        }
        if (elNodeType === 1 || elNodeType === void 0) {
          loadPseudoElementImages(el);
          try {
            loadBackgroundImages(Util.getCSS(el, 'backgroundImage'), el);
          } catch (_error) {
            e = _error;
            Util.log('html2canvas: failed to get background-image - Exception: ' + e.message);
          }
          loadBackgroundImages(el);
        }
      };
      setImageLoadHandlers = function(img, imageObj) {
        img.onload = function() {
          if (imageObj.timer !== void 0) {
            window.clearTimeout(imageObj.timer);
          }
          images.numLoaded++;
          imageObj.succeeded = true;
          img.onerror = img.onload = null;
          start();
        };
        img.onerror = function() {
          var src;
          if (img.crossOrigin === 'anonymous') {
            window.clearTimeout(imageObj.timer);
            if (options.proxy) {
              src = img.src;
              img = new Image;
              imageObj.img = img;
              img.src = src;
              proxyGetImage(img.src, img, imageObj);
              return;
            }
          }
          images.numLoaded++;
          images.numFailed++;
          imageObj.succeeded = false;
          img.onerror = img.onload = null;
          start();
        };
      };
      link.href = window.location.href;
      pageOrigin = link.protocol + link.host;
      methods = {
        loadImage: function(src) {
          var imageObj, img;
          img = void 0;
          imageObj = void 0;
          if (src && images[src] === void 0) {
            img = new Image;
            if (src.match(/data:image\/.*;base64,/i)) {
              img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
            } else if (isSameOrigin(src) || options.allowTaint === true) {
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
              img.src = src;
            } else if (supportCORS && !options.allowTaint && options.useCORS) {
              img.crossOrigin = 'anonymous';
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              setImageLoadHandlers(img, imageObj);
              img.src = src;
            } else if (options.proxy) {
              imageObj = images[src] = {
                img: img
              };
              images.numTotal++;
              proxyGetImage(src, img, imageObj);
            }
          }
        },
        cleanupDOM: function(cause) {
          var ex, img, src, _i, _len;
          img = void 0;
          src = void 0;
          if (!images.cleanupDone) {
            if (cause && typeof cause === 'string') {
              Util.log('html2canvas: Cleanup because: ' + cause);
            } else {
              Util.log('html2canvas: Cleanup after timeout: ' + options.timeout + ' ms.');
            }
            for (_i = 0, _len = images.length; _i < _len; _i++) {
              src = images[_i];
              if (images.hasOwnProperty(src)) {
                img = images[src];
                if (typeof img === 'object' && img.callbackname && img.succeeded === void 0) {
                  window[img.callbackname] = void 0;
                  try {
                    delete window[img.callbackname];
                  } catch (_error) {
                    ex = _error;
                  }
                  if (img.script && img.script.parentNode) {
                    img.script.setAttribute('src', 'about:blank');
                    img.script.parentNode.removeChild(img.script);
                  }
                  images.numLoaded++;
                  images.numFailed++;
                  Util.log('html2canvas: Cleaned up failed img: \'' + src + '\' Steps: ' + images.numLoaded + ' / ' + images.numTotal);
                }
              }
            }
            if (window.stop !== void 0) {
              window.stop();
            } else if (document.execCommand !== void 0) {
              document.execCommand('Stop', false);
            }
            if (document.close !== void 0) {
              document.close();
            }
            images.cleanupDone = true;
            if (!(cause && typeof cause === 'string')) {
              start();
            }
          }
        },
        renderingDone: function() {
          if (timeoutTimer) {
            window.clearTimeout(timeoutTimer);
          }
        }
      };
      if (options.timeout > 0) {
        timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
      }
      Util.log('html2canvas: Preload starts: finding background-images');
      images.firstRun = true;
      getImages(element);
      Util.log('html2canvas: Preload: Finding images');
      i = 0;
      while (i < imgLen) {
        methods.loadImage(domImages[i].getAttribute('src'));
        i += 1;
      }
      images.firstRun = false;
      Util.log('html2canvas: Preload: Done.');
      if (images.numTotal === images.numLoaded) {
        start();
      }
      return methods;
    };
    _html2canvas.Renderer = function(parseQueue, options) {
      var createRenderQueue, getRenderer;
      createRenderQueue = function(parseQueue) {
        var queue, rootContext, sortZ;
        queue = [];
        rootContext = void 0;
        sortZ = function(context) {
          Object.keys(context).sort().forEach(function(zi) {
            var floated, list, nonPositioned, positioned;
            nonPositioned = [];
            floated = [];
            positioned = [];
            list = [];
            context[zi].forEach(function(v) {
              if (v.node.zIndex.isPositioned || v.node.zIndex.opacity < 1) {
                positioned.push(v);
              } else if (v.node.zIndex.isFloated) {
                floated.push(v);
              } else {
                nonPositioned.push(v);
              }
            });
            (function(arr) {
              arr.forEach(function(v) {
                list.push(v);
                if (v.children) {
                  walk(v.children);
                }
              });
            })(nonPositioned.concat(floated, positioned));
            list.forEach(function(v) {
              if (v.context) {
                sortZ(v.context);
              } else {
                queue.push(v.node);
              }
            });
          });
        };
        rootContext = (function(rootNode) {
          var insert;
          rootContext = {};
          insert = function(context, node, specialParent) {
            var childrenDest, contextForChildren, isFloated, isPositioned, stub, zi;
            zi = node.zIndex.zindex === 'auto' ? 0 : Number(node.zIndex.zindex);
            contextForChildren = context;
            isPositioned = node.zIndex.isPositioned;
            isFloated = node.zIndex.isFloated;
            stub = {
              node: node
            };
            childrenDest = specialParent;
            if (node.zIndex.ownStacking) {
              contextForChildren = stub.context = {
                '!': [
                  {
                    node: node,
                    children: []
                  }
                ]
              };
              childrenDest = void 0;
            } else if (isPositioned || isFloated) {
              childrenDest = stub.children = [];
            }
            if (zi === 0 && specialParent) {
              specialParent.push(stub);
            } else {
              if (!context[zi]) {
                context[zi] = [];
              }
              context[zi].push(stub);
            }
            node.zIndex.children.forEach(function(childNode) {
              insert(contextForChildren, childNode, childrenDest);
            });
          };
          insert(rootContext, rootNode);
          return rootContext;
        })(parseQueue);
        sortZ(rootContext);
        return queue;
      };
      getRenderer = function(rendererName) {
        var renderer;
        renderer = void 0;
        if (typeof options.renderer === 'string' && _html2canvas.Renderer[rendererName] !== void 0) {
          renderer = _html2canvas.Renderer[rendererName](options);
        } else if (typeof rendererName === 'function') {
          renderer = rendererName(options);
        } else {
          throw new Error('Unknown renderer');
        }
        if (typeof renderer !== 'function') {
          throw new Error('Invalid renderer defined');
        }
        return renderer;
      };
      return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue.stack), _html2canvas);
    };
    _html2canvas.Util.Support = function(options, doc) {
      var supportRangeBounds, supportSVGRendering;
      supportSVGRendering = function() {
        var canvas, ctx, e, img;
        img = new Image;
        canvas = doc.createElement('canvas');
        ctx = canvas.getContext === void 0 ? false : canvas.getContext('2d');
        if (ctx === false) {
          return false;
        }
        canvas.width = canvas.height = 10;
        img.src = ['data:image/svg+xml,', '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>', '<foreignObject width=\'10\' height=\'10\'>', '<div xmlns=\'http://www.w3.org/1999/xhtml\' style=\'width:10;height:10;\'>', 'sup', '</div>', '</foreignObject>', '</svg>'].join('');
        try {
          ctx.drawImage(img, 0, 0);
          canvas.toDataURL();
        } catch (_error) {
          e = _error;
          return false;
        }
        _html2canvas.Util.log('html2canvas: Parse: SVG powered rendering available');
        return true;
      };
      supportRangeBounds = function() {
        var r, rangeBounds, rangeHeight, support, testElement;
        r = void 0;
        testElement = void 0;
        rangeBounds = void 0;
        rangeHeight = void 0;
        support = false;
        if (doc.createRange) {
          r = doc.createRange();
          if (r.getBoundingClientRect) {
            testElement = doc.createElement('boundtest');
            testElement.style.height = '123px';
            testElement.style.display = 'block';
            doc.body.appendChild(testElement);
            r.selectNode(testElement);
            rangeBounds = r.getBoundingClientRect();
            rangeHeight = rangeBounds.height;
            if (rangeHeight === 123) {
              support = true;
            }
            doc.body.removeChild(testElement);
          }
        }
        return support;
      };
      return {
        rangeBounds: supportRangeBounds(),
        svgRendering: options.svgRendering && supportSVGRendering()
      };
    };
    window.html2canvas = function(elements, opts) {
      var canvas, options, queue;
      elements = elements.length ? elements : [elements];
      queue = void 0;
      canvas = void 0;
      options = {
        logging: false,
        elements: elements,
        background: '#fff',
        proxy: null,
        timeout: 0,
        useCORS: false,
        allowTaint: false,
        svgRendering: false,
        ignoreElements: 'IFRAME|OBJECT|PARAM',
        useOverflow: true,
        letterRendering: false,
        chinese: false,
        width: null,
        height: null,
        taintTest: true,
        renderer: 'Canvas'
      };
      options = _html2canvas.Util.Extend(opts, options);
      _html2canvas.logging = options.logging;
      options.complete = function(images) {
        if (typeof options.onpreloaded === 'function') {
          if (options.onpreloaded(images) === false) {
            return;
          }
        }
        queue = _html2canvas.Parse(images, options);
        if (typeof options.onparsed === 'function') {
          if (options.onparsed(queue) === false) {
            return;
          }
        }
        canvas = _html2canvas.Renderer(queue, options);
        if (typeof options.onrendered === 'function') {
          options.onrendered(canvas);
        }
      };
      window.setTimeout((function() {
        _html2canvas.Preload(options);
      }), 0);
      return {
        render: function(queue, opts) {
          return _html2canvas.Renderer(queue, _html2canvas.Util.Extend(opts, options));
        },
        parse: function(images, opts) {
          return _html2canvas.Parse(images, _html2canvas.Util.Extend(opts, options));
        },
        preload: function(opts) {
          return _html2canvas.Preload(_html2canvas.Util.Extend(opts, options));
        },
        log: _html2canvas.Util.log
      };
    };
    window.html2canvas.log = _html2canvas.Util.log;
    window.html2canvas.Renderer = {
      Canvas: void 0
    };
    _html2canvas.Renderer.Canvas = function(options) {
      var Util, canvas, createShape, doc, renderItem, safeImage, safeImages, testCanvas, testctx;
      createShape = function(ctx, args) {
        ctx.beginPath();
        args.forEach(function(arg) {
          ctx[arg.name].apply(ctx, arg['arguments']);
        });
        ctx.closePath();
      };
      safeImage = function(item) {
        var e, testCanvas, testctx;
        if (safeImages.indexOf(item['arguments'][0].src) === -1) {
          testctx.drawImage(item['arguments'][0], 0, 0);
          try {
            testctx.getImageData(0, 0, 1, 1);
          } catch (_error) {
            e = _error;
            testCanvas = doc.createElement('canvas');
            testctx = testCanvas.getContext('2d');
            return false;
          }
          safeImages.push(item['arguments'][0].src);
        }
        return true;
      };
      renderItem = function(ctx, item) {
        var e;
        switch (item.type) {
          case 'variable':
            ctx[item.name] = item['arguments'];
            break;
          case 'function':
            switch (item.name) {
              case 'createPattern':
                if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
                  try {
                    ctx.fillStyle = ctx.createPattern(item['arguments'][0], 'repeat');
                  } catch (_error) {
                    e = _error;
                    Util.log('html2canvas: Renderer: Error creating pattern', e.message);
                  }
                }
                break;
              case 'drawShape':
                createShape(ctx, item['arguments']);
                break;
              case 'drawImage':
                if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
                  if (!options.taintTest || options.taintTest && safeImage(item)) {
                    ctx.drawImage.apply(ctx, item['arguments']);
                  }
                }
                break;
              default:
                ctx[item.name].apply(ctx, item['arguments']);
            }
        }
      };
      options = options || {};
      doc = document;
      safeImages = [];
      testCanvas = document.createElement('canvas');
      testctx = testCanvas.getContext('2d');
      Util = _html2canvas.Util;
      canvas = options.canvas || doc.createElement('canvas');
      return function(parsedData, options, document, queue, _html2canvas) {
        var bounds, ctx, fstyle, newCanvas, zStack;
        ctx = canvas.getContext('2d');
        newCanvas = void 0;
        bounds = void 0;
        fstyle = void 0;
        zStack = parsedData.stack;
        canvas.width = canvas.style.width = options.width || zStack.ctx.width;
        canvas.height = canvas.style.height = options.height || zStack.ctx.height;
        fstyle = ctx.fillStyle;
        ctx.fillStyle = Util.isTransparent(zStack.backgroundColor) && options.background !== void 0 ? options.background : parsedData.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fstyle;
        queue.forEach(function(storageContext) {
          ctx.textBaseline = 'bottom';
          ctx.save();
          if (storageContext.transform.matrix) {
            ctx.translate(storageContext.transform.origin[0], storageContext.transform.origin[1]);
            ctx.transform.apply(ctx, storageContext.transform.matrix);
            ctx.translate(-storageContext.transform.origin[0], -storageContext.transform.origin[1]);
          }
          if (storageContext.clip) {
            ctx.beginPath();
            ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
            ctx.clip();
          }
          if (storageContext.ctx.storage) {
            storageContext.ctx.storage.forEach(function(item) {
              renderItem(ctx, item);
            });
          }
          ctx.restore();
        });
        Util.log('html2canvas: Renderer: Canvas renderer done - returning canvas obj');
        if (options.elements.length === 1) {
          if (typeof options.elements[0] === 'object' && options.elements[0].nodeName !== 'BODY') {
            bounds = _html2canvas.Util.Bounds(options.elements[0]);
            newCanvas = document.createElement('canvas');
            newCanvas.width = Math.ceil(bounds.width);
            newCanvas.height = Math.ceil(bounds.height);
            ctx = newCanvas.getContext('2d');
            ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
            canvas = null;
            return newCanvas;
          }
        }
        return canvas;
      };
    };
  })(window, document);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9odG1sMmNhbnZhcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsQ0FBQyxTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFFQyxRQUFBLHlKQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sU0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixLQUFyQixHQUFBO0FBQ0wsVUFBQSxtQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxZQUFSLElBQXlCLE9BQU8sQ0FBQyxZQUFhLENBQUEsU0FBQSxDQUF2RCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sTUFEUCxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsT0FBTyxDQUFDLEtBRmhCLENBQUE7QUFTQSxNQUFBLElBQUcsQ0FBQSw2QkFBaUMsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQUFKLElBQWtELE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBYixDQUFyRDtBQUVFLFFBQUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxJQUFiLENBQUE7QUFFQSxRQUFBLElBQUcsTUFBSDtBQUNFLFVBQUEsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFyQixHQUE0QixPQUFPLENBQUMsWUFBWSxDQUFDLElBQWpELENBREY7U0FGQTtBQUFBLFFBSUEsS0FBSyxDQUFDLElBQU4sR0FBZ0IsU0FBQSxLQUFhLFVBQWhCLEdBQWdDLEtBQWhDLEdBQTJDLEtBQUEsSUFBUyxDQUpqRSxDQUFBO0FBQUEsUUFLQSxLQUFBLEdBQVEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsSUFMMUIsQ0FBQTtBQUFBLFFBT0EsS0FBSyxDQUFDLElBQU4sR0FBYSxJ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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/html2canvas.coffee
