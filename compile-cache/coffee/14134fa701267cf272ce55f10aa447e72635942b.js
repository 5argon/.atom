(function() {
  var $, Disposable, KeyEventView, KeyMapper, KeymapGeneratorView, KeymapTableView, ModifierStateHandler, ModifierView, ScrollView, TextEditorView, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), ScrollView = _ref.ScrollView, TextEditorView = _ref.TextEditorView, $ = _ref.$;

  util = require('util');

  KeyMapper = require('../key-mapper');

  ModifierStateHandler = require('../modifier-state-handler');

  ModifierView = require('./modifier-view');

  KeyEventView = require('./key-event-view');

  KeymapTableView = require('./keymap-table-view');

  module.exports = KeymapGeneratorView = (function(_super) {
    __extends(KeymapGeneratorView, _super);

    function KeymapGeneratorView() {
      return KeymapGeneratorView.__super__.constructor.apply(this, arguments);
    }

    KeymapGeneratorView.prototype.previousMapping = null;

    KeymapGeneratorView.prototype.modifierStateHandler = null;

    KeymapGeneratorView.prototype.keyMapper = null;

    KeymapGeneratorView.content = function() {
      return this.div({
        "class": 'keymap-generator'
      }, (function(_this) {
        return function() {
          _this.header({
            "class": 'header'
          }, function() {
            return _this.h1({
              "class": 'title'
            }, 'Build a Keymap for your foreign keyboard layout');
          });
          _this.section({
            "class": 'keys-events-panel'
          }, function() {
            _this.subview('keyDownView', new KeyEventView({
              title: 'KeyDown Event'
            }));
            return _this.subview('keyPressView', new KeyEventView({
              title: 'KeyPress Event'
            }));
          });
          _this.section({
            "class": 'modifier-bar-panel'
          }, function() {
            _this.subview('ctrlView', new ModifierView({
              label: 'Ctrl'
            }));
            _this.subview('altView', new ModifierView({
              label: 'Alt'
            }));
            _this.subview('shiftView', new ModifierView({
              label: 'Shift'
            }));
            return _this.subview('altgrView', new ModifierView({
              label: 'AltGr'
            }));
          });
          _this.section({
            "class": 'key-input-panel'
          }, function() {
            _this.div({
              "class": 'key-label'
            }, 'Capture Key-Events from input and create Key-Mappings');
            return _this.input({
              "class": 'key-input',
              type: 'text',
              focus: 'clearInput',
              keydown: 'onKeyDown',
              keypress: 'onKeyPress',
              keyup: 'onKeyUp',
              outlet: 'keyInput'
            });
          });
          _this.section({
            "class": 'test-key-panel'
          }, function() {
            _this.div({
              "class": 'test-key-label'
            }, 'Test your generated Key-Mappings');
            return _this.subview('testKeyInput', new TextEditorView({
              mini: true
            }));
          });
          return _this.subview('keymapTableView', new KeymapTableView());
        };
      })(this));
    };

    KeymapGeneratorView.prototype.attached = function() {
      this.keyMapper = KeyMapper.getInstance();
      this.modifierStateHandler = new ModifierStateHandler();
      this.previousMapping = this.keyMapper.getKeymap();
      this.keymapTableView.onKeymapChange((function(_this) {
        return function(keymap) {
          return _this.keyMapper.setKeymap(keymap);
        };
      })(this));
      this.keymapTableView.clear();
      return this.keymapTableView.render();
    };

    KeymapGeneratorView.prototype.detached = function() {
      if (this.previousMapping !== null) {
        this.keyMapper.setKeymap(this.previousMapping);
      }
      this.keyMapper = null;
      return this.modifierStateHandler = null;
    };

    KeymapGeneratorView.prototype.updateModifiers = function(modifierState) {
      this.ctrlView.setActive(modifierState.ctrl);
      this.altView.setActive(modifierState.alt);
      this.shiftView.setActive(modifierState.shift);
      return this.altgrView.setActive(modifierState.altgr);
    };

    KeymapGeneratorView.prototype.addMapping = function() {
      var down, modifier, press;
      down = this.keyDownView.getKey();
      modifier = this.keyDownView.getModifiers();
      press = this.keyPressView.getKey();
      if (press !== null && down.char !== press.char) {
        this.keymapTableView.addKeyMapping(down, modifier, press, this.keyInput.val().length > 1);
        return this.keyMapper.setKeymap(this.keymapTableView.getKeymap());
      }
    };

    KeymapGeneratorView.prototype.clearInput = function() {
      return this.keyInput.val('');
    };

    KeymapGeneratorView.prototype.onKeyDown = function(event) {
      var modifierState, originalEvent;
      this.clearInput();
      this.keyDownView.clear();
      this.keyPressView.clear();
      originalEvent = $.extend({}, event.originalEvent);
      this.modifierStateHandler.handleKeyEvent(originalEvent);
      modifierState = this.modifierStateHandler.getState();
      this.updateModifiers(modifierState);
      return this.keyDownView.setKey(originalEvent, modifierState);
    };

    KeymapGeneratorView.prototype.onKeyPress = function(event) {
      var originalEvent;
      originalEvent = $.extend({}, event.originalEvent);
      return this.keyPressView.setKey(originalEvent, this.modifierStateHandler.getState());
    };

    KeymapGeneratorView.prototype.onKeyUp = function(event) {
      var originalEvent;
      originalEvent = $.extend({}, event.originalEvent);
      this.modifierStateHandler.handleKeyEvent(originalEvent);
      this.addMapping();
      return setTimeout((function(_this) {
        return function() {
          var modifierState;
          modifierState = _this.modifierStateHandler.getState();
          return _this.updateModifiers(modifierState);
        };
      })(this), 50);
    };

    KeymapGeneratorView.deserialize = function(options) {
      if (options == null) {
        options = {};
      }
      return new KeymapGeneratorView(options);
    };

    KeymapGeneratorView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    KeymapGeneratorView.prototype.getURI = function() {
      return this.uri;
    };

    KeymapGeneratorView.prototype.getTitle = function() {
      return "Keymap-Generator";
    };

    KeymapGeneratorView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    KeymapGeneratorView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    KeymapGeneratorView.prototype.isEqual = function(other) {
      return other instanceof KeymapGeneratorView;
    };

    return KeymapGeneratorView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvdmlld3Mva2V5bWFwLWdlbmVyYXRvci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3SkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtDLE9BQUEsQ0FBUSxzQkFBUixDQUFsQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSxzQkFBQSxjQUFiLEVBQTZCLFNBQUEsQ0FEN0IsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLGVBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDJCQUFSLENBTHZCLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBUGYsQ0FBQTs7QUFBQSxFQVFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FSZixDQUFBOztBQUFBLEVBU0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FUbEIsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsa0NBQUEsZUFBQSxHQUFpQixJQUFqQixDQUFBOztBQUFBLGtDQUNBLG9CQUFBLEdBQXNCLElBRHRCLENBQUE7O0FBQUEsa0NBRUEsU0FBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSxJQUlBLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQkFB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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/views/keymap-generator-view.coffee
