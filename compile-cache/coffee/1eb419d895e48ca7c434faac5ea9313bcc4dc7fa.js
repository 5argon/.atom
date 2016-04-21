(function() {
  var KeyEventView, View, charCodeFromKeyIdentifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  charCodeFromKeyIdentifier = require('../helpers').charCodeFromKeyIdentifier;

  module.exports = KeyEventView = (function(_super) {
    __extends(KeyEventView, _super);

    function KeyEventView() {
      return KeyEventView.__super__.constructor.apply(this, arguments);
    }

    KeyEventView.prototype.event = null;

    KeyEventView.prototype.modifiers = null;

    KeyEventView.content = function(params) {
      return this.div({
        "class": 'key-box'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'section-heading icon icon-keyboard'
          }, params.title);
          _this.div({
            "class": 'key-attribute-row'
          }, function() {
            _this.span('Identifier: ');
            return _this.span({
              outlet: 'identifier'
            });
          });
          _this.div({
            "class": 'key-attribute-row'
          }, function() {
            _this.span('Code: ');
            return _this.span({
              outlet: 'code'
            });
          });
          _this.div({
            "class": 'key-attribute-row'
          }, function() {
            _this.span('Char: ');
            return _this.span({
              outlet: 'char'
            });
          });
          return _this.div({
            "class": 'key-attribute-row'
          }, function() {
            _this.span('Modifier: ');
            return _this.span({
              outlet: 'modifier'
            });
          });
        };
      })(this));
    };

    KeyEventView.prototype.setKey = function(keyEvent, modifiers) {
      var k, modifierStack, v, _ref;
      this.event = keyEvent;
      this.modifiers = modifiers;
      this.event.code = charCodeFromKeyIdentifier(this.event.keyIdentifier) || this.event.keyCode || this.event.which;
      this.event.char = String.fromCharCode(this.event.code).toLowerCase();
      this.identifier.text(this.event.keyIdentifier);
      this.code.text(this.event.code);
      this.char.text(this.event.char);
      modifierStack = [];
      _ref = this.modifiers;
      for (k in _ref) {
        v = _ref[k];
        if (v === true) {
          modifierStack.push(k);
        }
      }
      return this.modifier.text(modifierStack.join(' '));
    };

    KeyEventView.prototype.getKey = function() {
      return this.event;
    };

    KeyEventView.prototype.getModifiers = function() {
      return this.modifiers;
    };

    KeyEventView.prototype.clear = function() {
      this.event = null;
      this.modifiers = null;
      this.identifier.text('');
      this.code.text('');
      this.char.text('');
      return this.modifier.text('');
    };

    return KeyEventView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvdmlld3Mva2V5LWV2ZW50LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLDRCQUE2QixPQUFBLENBQVEsWUFBUixFQUE3Qix5QkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwyQkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBQUEsSUFHQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFNBQVA7T0FBTCxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG9DQUFQO1dBQUwsRUFBa0QsTUFBTSxDQUFDLEtBQXpELENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1CQUFQO1dBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxjQUFOLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxNQUFBLEVBQVEsWUFBUjthQUFOLEVBRitCO1VBQUEsQ0FBakMsQ0FEQSxDQUFBO0FBQUEsVUFJQSxLQUFDLENBQUEs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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/views/key-event-view.coffee
