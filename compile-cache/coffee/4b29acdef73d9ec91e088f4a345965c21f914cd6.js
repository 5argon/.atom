
/*
 * Modifierhandling shamelessly stolen and customized from brackets:
 * https://github.com/adobe/brackets/blob/master/src/command/KeyBindingManager.js
 */

(function() {
  var KeyEvent, ModifierStateHandler;

  KeyEvent = require('./key-event');

  module.exports = ModifierStateHandler = (function() {

    /**
     * States of Ctrl key down detection
     * @enum {number}
     */
    var LINUX_ALTGR_IDENTIFIER;

    ModifierStateHandler.prototype.CtrlDownStates = {
      'NOT_YET_DETECTED': 0,
      'DETECTED': 1,
      'DETECTED_AND_IGNORED': 2
    };


    /**
     * Flags used to determine whether right Alt key is pressed. When it is pressed,
     * the following two keydown events are triggered in that specific order.
     *
     *    1. ctrlDown - flag used to record { ctrlKey: true, keyIdentifier: "Control", ... } keydown event
     *    2. altGrDown - flag used to record { ctrlKey: true, altKey: true, keyIdentifier: "Alt", ... } keydown event
     *
     * @type {CtrlDownStates|boolean}
     */

    ModifierStateHandler.prototype.ctrlDown = 0;

    ModifierStateHandler.prototype.altGrDown = false;

    ModifierStateHandler.prototype.hasShift = false;

    ModifierStateHandler.prototype.hasCtrl = false;

    ModifierStateHandler.prototype.hasAltGr = false;

    ModifierStateHandler.prototype.hasAlt = false;

    ModifierStateHandler.prototype.hasCmd = false;


    /**
     * Constant used for checking the interval between Control keydown event and Alt keydown event.
     * If the right Alt key is down we get Control keydown followed by Alt keydown within 30 ms. if
     * the user is pressing Control key and then Alt key, the interval will be larger than 30 ms.
     * @type {number}
     */

    ModifierStateHandler.prototype.MAX_INTERVAL_FOR_CTRL_ALT_KEYS = 30;


    /**
     * Constant used for identifying AltGr on Linux
     * @type {String}
     */

    LINUX_ALTGR_IDENTIFIER = 'U+00E1';


    /**
     * Used to record the timeStamp property of the last keydown event.
     * @type {number}
     */

    ModifierStateHandler.prototype.lastTimeStamp = null;


    /**
     * Used to record the keyIdentifier property of the last keydown event.
     * @type {string}
     */

    ModifierStateHandler.prototype.lastKeyIdentifier = null;


    /**
     * clear modifiers listener on editor blur and focus
     * @type {event}
     */

    ModifierStateHandler.prototype.clearModifierStateListener = null;

    function ModifierStateHandler() {
      this.clearModifierStateListener = (function(_this) {
        return function() {
          return _this.clearModifierState();
        };
      })(this);
      window.addEventListener('blur', this.clearModifierStateListener);
      window.addEventListener('focus', this.clearModifierStateListener);
    }

    ModifierStateHandler.prototype.destroy = function() {
      window.removeEventListener('blur', this.clearModifierStateListener);
      return window.removeEventListener('focus', this.clearModifierStateListener);
    };

    ModifierStateHandler.prototype.clearModifierState = function() {
      if (process.platform === 'win32') {
        this.quitAltGrMode();
      }
      this.hasShift = false;
      this.hasCtrl = false;
      this.hasAltGr = false;
      this.hasAlt = false;
      return this.hasCmd = false;
    };


    /**
     * Resets all the flags.
     */

    ModifierStateHandler.prototype.quitAltGrMode = function() {
      this.ctrlDown = this.CtrlDownStates.NOT_YET_DETECTED;
      this.altGrDown = false;
      this.hasAltGr = false;
      this.lastTimeStamp = null;
      return this.lastKeyIdentifier = null;
    };


    /**
     * Detects the release of AltGr key by checking all keyup events
     * until we receive one with ctrl key code. Once detected, reset
     * all the flags.
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.detectAltGrKeyUp = function(e) {
      var key;
      if (process.platform === 'win32') {
        key = e.keyCode || e.which;
        if (this.altGrDown && key === KeyEvent.DOM_VK_CONTROL) {
          this.quitAltGrMode();
        }
      }
      if (process.platform === 'linux') {
        if (e.keyIdentifier === LINUX_ALTGR_IDENTIFIER) {
          return this.quitAltGrMode();
        }
      }
    };


    /**
     * Detects whether AltGr key is pressed. When it is pressed, the first keydown event has
     * ctrlKey === true with keyIdentifier === "Control". The next keydown event with
     * altKey === true, ctrlKey === true and keyIdentifier === "Alt" is sent within 30 ms. Then
     * the next keydown event with altKey === true, ctrlKey === true and keyIdentifier === "Control"
     * is sent. If the user keep holding AltGr key down, then the second and third
     * keydown events are repeatedly sent out alternately. If the user is also holding down Ctrl
     * key, then either keyIdentifier === "Control" or keyIdentifier === "Alt" is repeatedly sent
     * but not alternately.
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.detectAltGrKeyDown = function(e) {
      if (process.platform === 'win32') {
        if (!this.altGrDown) {
          if (this.ctrlDown !== this.CtrlDownStates.DETECTED_AND_IGNORED && e.ctrlKey && e.keyIdentifier === 'Control') {
            this.ctrlDown = this.CtrlDownStates.DETECTED;
          } else if (e.repeat && e.ctrlKey && e.keyIdentifier === 'Control') {
            this.ctrlDown = this.CtrlDownStates.DETECTED_AND_IGNORED;
          } else if (this.ctrlDown === this.CtrlDownStates.DETECTED && e.altKey && e.ctrlKey && e.keyIdentifier === 'Alt' && e.timeStamp - this.lastTimeStamp < this.MAX_INTERVAL_FOR_CTRL_ALT_KEYS && (e.location === 2 || e.keyLocation === 2)) {
            this.altGrDown = true;
            this.lastKeyIdentifier = 'Alt';
          } else {
            this.ctrlDown = this.CtrlDownStates.NOT_YET_DETECTED;
          }
          this.lastTimeStamp = e.timeStamp;
        } else if (e.keyIdentifier === 'Control' || e.keyIdentifier === 'Alt') {
          if (e.altKey && e.ctrlKey && e.keyIdentifier === this.lastKeyIdentifier) {
            this.quitAltGrMode();
          } else {
            this.lastKeyIdentifier = e.keyIdentifier;
          }
        }
      }
      if (process.platform === 'linux') {
        if (!this.altGrDown) {
          if (e.keyIdentifier === LINUX_ALTGR_IDENTIFIER) {
            return this.altGrDown = true;
          }
        }
      } else {

      }
    };


    /**
     * Handle key event
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.handleKeyEvent = function(e) {
      if (e.type === 'keydown') {
        this.detectAltGrKeyDown(e);
      }
      if (e.type === 'keyup') {
        this.detectAltGrKeyUp(e);
      }
      if (process.platform === 'win32') {
        this.hasCtrl = !this.altGrDown && e.ctrlKey;
        this.hasAltGr = this.altGrDown;
        this.hasAlt = !this.altGrDown && e.altKey;
      } else if (process.platform === 'linux') {
        this.hasCtrl = e.ctrlKey;
        this.hasAltGr = this.altGrDown;
        this.hasAlt = e.altKey;
      } else {
        this.hasCtrl = (e.ctrlKey != null) && e.ctrlKey === true;
        this.hasAltGr = e.altKey;
        this.hasAlt = e.altKey;
      }
      this.hasShift = e.shiftKey;
      return this.hasCmd = (e.metaKey != null) && e.metaKey === true;
    };


    /**
     * determine if shift key is pressed
     */

    ModifierStateHandler.prototype.isShift = function() {
      return this.hasShift;
    };


    /**
     * determine if altgr key is pressed
     */

    ModifierStateHandler.prototype.isAltGr = function() {
      return this.hasAltGr;
    };


    /**
     * determine if alt key is pressed
     */

    ModifierStateHandler.prototype.isAlt = function() {
      return this.hasAlt;
    };


    /**
     * determine if ctrl key is pressed
     */

    ModifierStateHandler.prototype.isCtrl = function() {
      return this.hasCtrl;
    };


    /**
     * determine if cmd key is pressed
     */

    ModifierStateHandler.prototype.isCmd = function() {
      return this.hasCmd;
    };


    /**
     * get the state of all modifiers
     * @return {object}
     */

    ModifierStateHandler.prototype.getState = function() {
      return {
        shift: this.isShift(),
        altgr: this.isAltGr(),
        alt: this.isAlt(),
        ctrl: this.isCtrl(),
        cmd: this.isCmd()
      };
    };


    /**
     * get the modifier sequence string.
     * Additionally with a character
     * @param {String} character
     * @return {String}
     */

    ModifierStateHandler.prototype.getStrokeSequence = function(character) {
      var sequence;
      sequence = [];
      if (this.isCtrl()) {
        sequence.push('ctrl');
      }
      if (this.isAlt()) {
        sequence.push('alt');
      }
      if (this.isAltGr()) {
        sequence.push('altgr');
      }
      if (this.isShift()) {
        sequence.push('shift');
      }
      if (this.isCmd()) {
        sequence.push('cmd');
      }
      if (character) {
        sequence.push(character);
      }
      return sequence.join('-');
    };

    return ModifierStateHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvbW9kaWZpZXItc3RhdGUtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSjtBQUFBOzs7T0FBQTtBQUFBLFFBQUEsc0JBQUE7O0FBQUEsbUNBSUEsY0FBQSxHQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUFvQixDQUFwQjtBQUFBLE1BQ0EsVUFBQSxFQUFZLENBRFo7QUFBQSxNQUVBLHNCQUFBLEVBQXdCLENBRnhCO0tBTEYsQ0FBQTs7QUFTQTtBQUFBOzs7Ozs7OztPQVRBOztBQUFBLG1DQWtCQSxRQUFBLEdBQVUsQ0FsQlYsQ0FBQTs7QUFBQSxtQ0FtQkEsU0FBQSxHQUFXLEtBbkJYLENBQUE7O0FBQUEsbUNBcUJBLFFBQUEsR0FBVSxLQXJCVixDQUFBOztBQUFBLG1DQXNCQSxPQUFBLEdBQVMsS0F0QlQsQ0FBQTs7QUFBQSxtQ0F1QkEsUUFBQSxHQUFVLEtBdkJWLENBQUE7O0FBQUEsbUNBd0JBLE1BQUEsR0FBUSxLQXhCUixDQUFBOztBQUFBLG1DQXlCQSxNQUFBLEdBQVEsS0F6QlIsQ0FBQTs7QUEyQkE7QUFBQTs7Ozs7T0EzQkE7O0FBQUEsbUNBaUNBLDhCQUFBLEdBQWdDLEVBakNoQyxDQUFBOztBQW1DQTtBQUFBOzs7T0FuQ0E7O0FBQUEsSUF1Q0Esc0JBQUEsR0FBeUIsUUF2Q3pCLENBQUE7O0FBeUNBO0FBQUE7OztPQXpDQTs7QUFBQSxtQ0E2Q0EsYUFBQSxHQUFlLElBN0NmLENBQUE7O0FBK0NBO0FBQUE7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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/modifier-state-handler.coffee
