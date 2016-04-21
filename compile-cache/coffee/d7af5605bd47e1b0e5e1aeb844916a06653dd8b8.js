(function() {
  var KeyMapper, KeyboardLocalization, KeymapGeneratorUri, KeymapGeneratorView, KeymapLoader, ModifierStateHandler, createKeymapGeneratorView, util, vimModeActive;

  util = require('util');

  KeymapLoader = require('./keymap-loader');

  KeyMapper = require('./key-mapper');

  ModifierStateHandler = require('./modifier-state-handler');

  vimModeActive = require('./helpers').vimModeActive;

  KeymapGeneratorView = null;

  KeymapGeneratorUri = 'atom://keyboard-localization/keymap-manager';

  createKeymapGeneratorView = function(state) {
    if (KeymapGeneratorView == null) {
      KeymapGeneratorView = require('./views/keymap-generator-view');
    }
    return new KeymapGeneratorView(state);
  };

  atom.deserializers.add({
    name: 'KeymapGeneratorView',
    deserialize: function(state) {
      return createKeymapGeneratorView(state);
    }
  });

  KeyboardLocalization = {
    pkg: 'keyboard-localization',
    keystrokeForKeyboardEventCb: null,
    keymapLoader: null,
    keyMapper: null,
    modifierStateHandler: null,
    keymapGeneratorView: null,
    config: {
      useKeyboardLayout: {
        type: 'string',
        "default": 'de_DE',
        "enum": ['cs_CZ-qwerty', 'cs_CZ', 'da_DK', 'de_CH', 'de_DE-neo', 'de_DE', 'en_GB', 'es_ES', 'es_LA', 'et_EE', 'fr_BE', 'fr_CH', 'fr_FR', 'fr_FR-bepo', 'fr_CA', 'fi_FI', 'fi_FI-mac', 'hu_HU', 'it_IT', 'ja_JP', 'lv_LV', 'nb_NO', 'pl_PL', 'pt_BR', 'pt_PT', 'ro_RO', 'ru_RU', 'sl_SL', 'sr_RS', 'sv_SE', 'tr_TR', 'uk_UA'],
        description: 'Pick your locale'
      },
      useKeyboardLayoutFromPath: {
        type: 'string',
        "default": '',
        description: 'Provide an absolute path to your keymap-json file'
      }
    },
    activate: function(state) {
      atom.workspace.addOpener(function(filePath) {
        if (filePath === KeymapGeneratorUri) {
          return createKeymapGeneratorView({
            uri: KeymapGeneratorUri
          });
        }
      });
      atom.commands.add('atom-workspace', {
        'keyboard-localization:keymap-generator': function() {
          return atom.workspace.open(KeymapGeneratorUri);
        }
      });
      this.keymapLoader = new KeymapLoader();
      this.keymapLoader.loadKeymap();
      this.keyMapper = KeyMapper.getInstance();
      this.modifierStateHandler = new ModifierStateHandler();
      this.changeUseKeyboardLayout = atom.config.onDidChange([this.pkg, 'useKeyboardLayout'].join('.'), (function(_this) {
        return function() {
          _this.keymapLoader.loadKeymap();
          if (_this.keymapLoader.isLoaded()) {
            return _this.keyMapper.setKeymap(_this.keymapLoader.getKeymap());
          }
        };
      })(this));
      this.changeUseKeyboardLayoutFromPath = atom.config.onDidChange([this.pkg, 'useKeyboardLayoutFromPath'].join('.'), (function(_this) {
        return function() {
          _this.keymapLoader.loadKeymap();
          if (_this.keymapLoader.isLoaded()) {
            return _this.keyMapper.setKeymap(_this.keymapLoader.getKeymap());
          }
        };
      })(this));
      if (this.keymapLoader.isLoaded()) {
        this.keyMapper.setKeymap(this.keymapLoader.getKeymap());
        this.keyMapper.setModifierStateHandler(this.modifierStateHandler);
        this.orginalKeyEvent = atom.keymaps.keystrokeForKeyboardEvent;
        return atom.keymaps.keystrokeForKeyboardEvent = (function(_this) {
          return function(event) {
            return _this.onKeyEvent(event);
          };
        })(this);
      }
    },
    deactivate: function() {
      var _ref;
      if (this.keymapLoader.isLoaded()) {
        atom.keymaps.keystrokeForKeyboardEvent = this.orginalKeyEvent;
        this.orginalKeyEvent = null;
      }
      this.changeUseKeyboardLayout.dispose();
      this.changeUseKeyboardLayoutFromPath.dispose();
      if ((_ref = this.keymapGeneratorView) != null) {
        _ref.destroy();
      }
      this.modifierStateHandler = null;
      this.keymapLoader = null;
      this.keyMapper = null;
      return this.keymapGeneratorView = null;
    },
    onKeyEvent: function(event) {
      var character;
      if (!event) {
        return '';
      }
      this.modifierStateHandler.handleKeyEvent(event);
      if (event.type === 'keydown' && (event.translated || this.keyMapper.remap(event))) {
        character = String.fromCharCode(event.keyCode);
        if (vimModeActive(event.target)) {
          if (this.modifierStateHandler.isAltGr() || this.modifierStateHandler.isShift()) {
            return character;
          }
        }
        return this.modifierStateHandler.getStrokeSequence(character);
      } else {
        return this.orginalKeyEvent(event);
      }
    }
  };

  module.exports = KeyboardLocalization;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIva2V5Ym9hcmQtbG9jYWxpemF0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0SkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsMEJBQVIsQ0FIdkIsQ0FBQTs7QUFBQSxFQUlDLGdCQUFpQixPQUFBLENBQVEsV0FBUixFQUFqQixhQUpELENBQUE7O0FBQUEsRUFNQSxtQkFBQSxHQUFzQixJQU50QixDQUFBOztBQUFBLEVBT0Esa0JBQUEsR0FBcUIsNkNBUHJCLENBQUE7O0FBQUEsRUFTQSx5QkFBQSxHQUE0QixTQUFDLEtBQUQsR0FBQTs7TUFDMUIsc0JBQXVCLE9BQUEsQ0FBUSwrQkFBUjtLQUF2QjtXQUNJLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEIsRUFGc0I7RUFBQSxDQVQ1QixDQUFBOztBQUFBLEVBYUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0scUJBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxTQUFDLEtBQUQsR0FBQTthQUFXLHlCQUFBLENBQTBCLEtBQTFCLEVBQVg7SUFBQSxDQURiO0dBREYsQ0FiQSxDQUFBOztBQUFBLEVBaUJBLG9CQUFBLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyx1QkFBTDtBQUFBLElBQ0EsMkJBQUEsRUFBNkIsSUFEN0I7QUFBQSxJQUVBLFlBQUEsRUFBYyxJQUZk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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/keyboard-localization.coffee
