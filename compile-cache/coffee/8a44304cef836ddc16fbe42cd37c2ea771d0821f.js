(function() {
  var KeyMapper, ModifierStateHandler, charCodeFromKeyIdentifier, charCodeToKeyIdentifier, getInstance, keyMapper, _ref;

  ModifierStateHandler = require('./modifier-state-handler');

  _ref = require('./helpers'), charCodeFromKeyIdentifier = _ref.charCodeFromKeyIdentifier, charCodeToKeyIdentifier = _ref.charCodeToKeyIdentifier;

  KeyMapper = (function() {
    function KeyMapper() {}

    KeyMapper.prototype.translationTable = null;

    KeyMapper.prototype.modifierStateHandler = null;

    KeyMapper.prototype.destroy = function() {
      this.translationTable = null;
      return this.modifierStateHandler = null;
    };

    KeyMapper.prototype.setModifierStateHandler = function(modifierStateHandler) {
      return this.modifierStateHandler = modifierStateHandler;
    };

    KeyMapper.prototype.setKeymap = function(keymap) {
      return this.translationTable = keymap;
    };

    KeyMapper.prototype.getKeymap = function() {
      return this.translationTable;
    };

    KeyMapper.prototype.translateKeyBinding = function(event) {
      var charCode, identifier, translation;
      identifier = charCodeFromKeyIdentifier(event.keyIdentifier);
      charCode = null;
      if ((this.translationTable != null) && (identifier != null) && (this.translationTable[identifier] != null) && (this.modifierStateHandler != null)) {
        if (translation = this.translationTable[identifier]) {
          if ((translation.altshifted != null) && this.modifierStateHandler.isShift() && this.modifierStateHandler.isAltGr()) {
            charCode = translation.altshifted;
          } else if ((translation.shifted != null) && this.modifierStateHandler.isShift()) {
            charCode = translation.shifted;
          } else if ((translation.alted != null) && this.modifierStateHandler.isAltGr()) {
            charCode = translation.alted;
          } else if (translation.unshifted != null) {
            charCode = translation.unshifted;
          }
        }
      }
      if (charCode != null) {
        Object.defineProperty(event, 'keyIdentifier', {
          get: function() {
            return charCodeToKeyIdentifier(charCode);
          }
        });
        Object.defineProperty(event, 'keyCode', {
          get: function() {
            return charCode;
          }
        });
        Object.defineProperty(event, 'which', {
          get: function() {
            return charCode;
          }
        });
        Object.defineProperty(event, 'translated', {
          get: function() {
            return true;
          }
        });
        Object.defineProperty(event, 'altKey', {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(event, 'ctrlKey', {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(event, 'shiftKey', {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(event, 'metaKey', {
          get: function() {
            return false;
          }
        });
        if (this.modifierStateHandler.isAltGr() && !translation.accent) {
          return event.preventDefault();
        }
      }
    };

    KeyMapper.prototype.remap = function(event) {
      var translated;
      this.translateKeyBinding(event);
      translated = event.translated === true;
      delete event.translated;
      return translated;
    };

    return KeyMapper;

  })();

  keyMapper = null;

  getInstance = function() {
    if (keyMapper === null) {
      keyMapper = new KeyMapper();
    }
    return keyMapper;
  };

  module.exports = {
    getInstance: getInstance
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIva2V5LW1hcHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUhBQUE7O0FBQUEsRUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsMEJBQVIsQ0FBdkIsQ0FBQTs7QUFBQSxFQUNBLE9BQXVELE9BQUEsQ0FBUSxXQUFSLENBQXZELEVBQUMsaUNBQUEseUJBQUQsRUFBNEIsK0JBQUEsdUJBRDVCLENBQUE7O0FBQUEsRUFHTTsyQkFDSjs7QUFBQSx3QkFBQSxnQkFBQSxHQUFrQixJQUFsQixDQUFBOztBQUFBLHdCQUNBLG9CQUFBLEdBQXNCLElBRHRCLENBQUE7O0FBQUEsd0JBR0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQXBCLENBQUE7YUFDQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsS0FGakI7SUFBQSxDQUhULENBQUE7O0FBQUEsd0JBT0EsdUJBQUEsR0FBeUIsU0FBQyxvQkFBRCxHQUFBO2FBQ3ZCLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixxQkFERDtJQUFBLENBUHpCLENBQUE7O0FBQUEsd0JBVUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLGdCQUFELEdBQW9CLE9BRFg7SUFBQSxDQVZYLENBQUE7O0FBQUEsd0JBYUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULGFBQU8sSUFBQyxDQUFBLGdCQUFSLENBRFM7SUFBQSxDQWJYLENBQUE7O0FBQUEsd0JBZ0JBLG1CQUFBLEdBQXFCLFNBQUMsS0FBRCxHQUFBO0FBQ25CLFVBQUEsaUNBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSx5QkFBQSxDQUEwQixLQUFLLENBQUMsYUFBaEMsQ0FB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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/key-mapper.coffee
