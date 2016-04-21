(function() {
  var KeyboardLocalization, fs, path;

  path = require('path');

  fs = require('fs');

  KeyboardLocalization = require('../lib/keyboard-localization.coffee');

  describe('KeyboardLocalization', function() {
    var pkg;
    pkg = [];
    beforeEach(function() {
      return pkg = new KeyboardLocalization();
    });
    return describe('when the package loads', function() {
      return it('should be an keymap-locale-file available for every config entry', function() {
        return pkg.config.useKeyboardLayout["enum"].forEach(function(localeString) {
          var pathToKeymapFile;
          pathToKeymapFile = path.join(__dirname, '..', 'lib', 'keymaps', localeString + '.json');
          return expect(fs.existsSync(pathToKeymapFile)).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9zcGVjL2tleWJvYXJkLWxvY2FsaXphdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLHFDQUFSLENBRnZCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULEdBQUEsR0FBVSxJQUFBLG9CQUFBLENBQUEsRUFERDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBS0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTthQUNqQyxFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBO2VBQ3JFLEdBQUcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBRCxDQUFLLENBQUMsT0FBbEMsQ0FBMEMsU0FBQyxZQUFELEdBQUE7QUFDeEMsY0FBQSxnQkFBQTtBQUFBLFVBQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLFNBQWxDLEVBQTZDLFlBQUEsR0FBZSxPQUE1RCxDQUFuQixDQUFBO2lCQUNBLE1BQUEsQ0FBTyxFQUFFLENBQUMsVUFBSCxDQUFjLGdCQUFkLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxJQUE3QyxFQUZ3QztRQUFBLENBQTFDLEVBRHFFO01BQUEsQ0FBdkUsRUFEaUM7SUFBQSxDQUFuQyxFQU4rQjtFQUFBLENBQWpDLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/spec/keyboard-localization-spec.coffee
