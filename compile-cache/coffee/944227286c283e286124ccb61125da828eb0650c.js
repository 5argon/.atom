(function() {
  var KeyMapper, fs, path;

  path = require('path');

  fs = require('fs-plus');

  module.exports = KeyMapper = (function() {
    function KeyMapper() {}

    KeyMapper.prototype.pkg = 'keyboard-localization';

    KeyMapper.prototype.translationTable = null;

    KeyMapper.prototype.keymapName = '';

    KeyMapper.prototype.loaded = false;

    KeyMapper.prototype.destroy = function() {
      return this.translationTable = null;
    };

    KeyMapper.prototype.loadKeymap = function() {
      var customPath, pathToTransTable, tansTableContentJson, useKeyboardLayout, useKeyboardLayoutFromPath;
      this.loaded = false;
      this.keymapName = '';
      useKeyboardLayout = atom.config.get([this.pkg, 'useKeyboardLayout'].join('.'));
      if (useKeyboardLayout != null) {
        pathToTransTable = path.join(__dirname, 'keymaps', useKeyboardLayout + '.json');
      }
      useKeyboardLayoutFromPath = atom.config.get([this.pkg, 'useKeyboardLayoutFromPath'].join('.'));
      if (useKeyboardLayoutFromPath != null) {
        customPath = path.normalize(useKeyboardLayoutFromPath);
        if (fs.isFileSync(customPath)) {
          pathToTransTable = customPath;
        }
      }
      if (fs.isFileSync(pathToTransTable)) {
        tansTableContentJson = fs.readFileSync(pathToTransTable, 'utf8');
        this.translationTable = JSON.parse(tansTableContentJson);
        console.log(this.pkg, 'Keymap loaded "' + pathToTransTable + '"');
        this.keymapName = path.basename(pathToTransTable, '.json');
        return this.loaded = true;
      } else {
        return console.log(this.pkg, 'Error loading keymap "' + pathToTransTable + '"');
      }
    };

    KeyMapper.prototype.isLoaded = function() {
      return this.loaded;
    };

    KeyMapper.prototype.getKeymapName = function() {
      return this.keymapName;
    };

    KeyMapper.prototype.getKeymap = function() {
      return this.translationTable;
    };

    return KeyMapper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIva2V5bWFwLWxvYWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007MkJBQ0o7O0FBQUEsd0JBQUEsR0FBQSxHQUFLLHVCQUFMLENBQUE7O0FBQUEsd0JBQ0EsZ0JBQUEsR0FBa0IsSUFEbEIsQ0FBQTs7QUFBQSx3QkFFQSxVQUFBLEdBQVksRUFGWixDQUFBOztBQUFBLHdCQUdBLE1BQUEsR0FBUSxLQUhSLENBQUE7O0FBQUEsd0JBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixLQURiO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHdCQVFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLGdHQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQURkLENBQUE7QUFBQSxNQUdBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixDQUFDLElBQUMsQ0FBQSxHQUFGLEVBQU8sbUJBQVAsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxHQUFqQyxDQUFoQixDQUhwQixDQUFBO0FBSUEsTUFBQSxJQUFHLHlCQUFIO0FBQ0UsUUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsSUFBTCxDQUNqQixTQURpQixFQUVqQixTQUZpQixFQUdqQixpQkFBQSxHQUFvQixPQUhILENBQW5CLENBREY7T0FKQTtBQUFBLE1BV0EseUJBQUEsR0FBNEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLENBQUMsSUFBQyxDQUFBLEdBQUYsRUFBTywyQkFBUCxDQUFtQyxDQUFDLElBQXBDLENBQXlDLEdBQXpDLENBQWhCLENBWDVCLENBQUE7QUFZQSxNQUFBLElBQUcsaUNBQUg7QUFDRSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBTCxDQUFlLHlCQUFmLENBQWIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBSDtBQUNFLFVBQUEsZ0JBQUEsR0FBbUIsVUFBbkIsQ0FERjtTQUZGO09BWkE7QUFpQkEsTUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsZ0JBQWQsQ0FBSDtBQUNFLFFBQUEsb0JBQUEsR0FBdUIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsZ0JBQWhCLEVBQWtDLE1BQWxDLENBQXZCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLG9CQUFYLENBRHBCLENBQUE7QUFBQSxRQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBQyxDQUFBLEdBQWIsRUFBa0IsaUJBQUEsR0FBb0IsZ0JBQXBCLEdBQXVDLEdBQXpELENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsUUFBTCxDQUFjLGdCQUFkLEVBQWdDLE9BQWhDLENBSGQsQ0FBQTtlQUlBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FMWjtPQUFBLE1BQUE7ZUFPRSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUMsQ0FBQSxHQUFiLEVBQWtCLHdCQUFBLEdBQTJCLGdCQUEzQixHQUE4QyxHQUFoRSxFQVBGO09BbEJVO0lBQUEsQ0FSWixDQUFBOztBQUFBLHdCQW1DQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUEsTUFBUixDQURRO0lBQUEsQ0FuQ1YsQ0FBQTs7QUFBQSx3QkFzQ0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLGFBQU8sSUFBQyxDQUFBLFVBQVIsQ0FEYTtJQUFBLENBdENmLENBQUE7O0FBQUEsd0JBeUNBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxhQUFPLElBQUMsQ0FBQSxnQkFBUixDQURTO0lBQUEsQ0F6Q1gsQ0FBQTs7cUJBQUE7O01BTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/keymap-loader.coffee
