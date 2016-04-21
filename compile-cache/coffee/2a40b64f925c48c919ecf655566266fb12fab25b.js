(function() {
  var padZero,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  padZero = function(strToPad, size) {
    while (strToPad.length < size) {
      strToPad = '0' + strToPad;
    }
    return strToPad;
  };

  exports.charCodeFromKeyIdentifier = function(keyIdentifier) {
    if (keyIdentifier.indexOf('U+') === 0) {
      return parseInt(keyIdentifier.slice(2), 16);
    }
  };

  exports.charCodeToKeyIdentifier = function(charCode) {
    return 'U+' + padZero(charCode.toString(16).toUpperCase(), 4);
  };

  exports.vimModeActive = function(editor) {
    if ((editor != null) && (__indexOf.call(editor.classList, 'vim-mode') >= 0 || __indexOf.call(editor.classList, 'vim-mode-plus') >= 0)) {
      if (__indexOf.call(editor.classList, 'operator-pending-mode') >= 0) {
        return true;
      }
      if (__indexOf.call(editor.classList, 'normal-mode') >= 0) {
        return true;
      }
      if (__indexOf.call(editor.classList, 'visual-mode') >= 0) {
        return true;
      }
    }
    return false;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLFNBQUMsUUFBRCxFQUFXLElBQVgsR0FBQTtBQUNSLFdBQU0sUUFBUSxDQUFDLE1BQVQsR0FBa0IsSUFBeEIsR0FBQTtBQUNFLE1BQUEsUUFBQSxHQUFXLEdBQUEsR0FBTSxRQUFqQixDQURGO0lBQUEsQ0FBQTtBQUVBLFdBQU8sUUFBUCxDQUhRO0VBQUEsQ0FBVixDQUFBOztBQUFBLEVBTUEsT0FBTyxDQUFDLHlCQUFSLEdBQW9DLFNBQUMsYUFBRCxHQUFBO0FBQ2xDLElBQUEsSUFBb0MsYUFBYSxDQUFDLE9BQWQsQ0FBc0IsSUFBdEIsQ0FBQSxLQUErQixDQUFuRTthQUFBLFFBQUEsQ0FBUyxhQUFjLFNBQXZCLEVBQTZCLEVBQTdCLEVBQUE7S0FEa0M7RUFBQSxDQU5wQyxDQUFBOztBQUFBLEVBU0EsT0FBTyxDQUFDLHVCQUFSLEdBQWtDLFNBQUMsUUFBRCxHQUFBO0FBQ2hDLFdBQU8sSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFRLENBQUMsUUFBVCxDQUFrQixFQUFsQixDQUFxQixDQUFDLFdBQXRCLENBQUEsQ0FBUixFQUE2QyxDQUE3QyxDQUFkLENBRGdDO0VBQUEsQ0FUbEMsQ0FBQTs7QUFBQSxFQVlBLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLFNBQUMsTUFBRCxHQUFBO0FBQ3RCLElBQUEsSUFBRyxnQkFBQSxJQUFZLENBQUMsZUFBYyxNQUFNLENBQUMsU0FBckIsRUFBQSxVQUFBLE1BQUEsSUFBa0MsZUFBbUIsTUFBTSxDQUFDLFNBQTFCLEVBQUEsZUFBQSxNQUFuQyxDQUFmO0FBQ0UsTUFBQSxJQUFlLGVBQTJCLE1BQU0sQ0FBQyxTQUFsQyxFQUFBLHVCQUFBLE1BQWY7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFlLGVBQWlCLE1BQU0sQ0FBQyxTQUF4QixFQUFBLGFBQUEsTUFBZjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BREE7QUFFQSxNQUFBLElBQWUsZUFBaUIsTUFBTSxDQUFDLFNBQXhCLEVBQUEsYUFBQSxNQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIRjtLQUFBO0FBSUEsV0FBTyxLQUFQLENBTHNCO0VBQUEsQ0FaeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/helpers.coffee
