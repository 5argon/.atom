(function() {
  var HexView, createView, fs, openURI;

  fs = require('fs-plus');

  HexView = null;

  module.exports = {
    config: {
      bytesPerLine: {
        type: 'integer',
        "default": 16,
        minimum: 1
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', 'hex:view', (function(_this) {
        return function() {
          return createView();
        };
      })(this));
      return this.openerDisposable = atom.workspace.addOpener(openURI);
    },
    deactivate: function() {
      return this.openerDisposable.dispose();
    }
  };

  openURI = function(uriToOpen) {
    var pathname;
    pathname = uriToOpen.replace('hex://', '');
    if (uriToOpen.substr(0, 4) !== 'hex:') {
      return;
    }
    if (HexView == null) {
      HexView = require('./hex-view');
    }
    return new HexView({
      filePath: pathname
    });
  };

  createView = function() {
    var filePath, paneItem;
    paneItem = atom.workspace.getActivePaneItem();
    filePath = paneItem.getPath();
    if (paneItem && fs.isFileSync(filePath)) {
      return atom.workspace.open("hex://" + filePath);
    } else {
      return console.warn("File (" + filePath + ") does not exists");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9oZXgvbGliL2hleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLElBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO09BREY7S0FERjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxVQUFwQyxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLFVBQUEsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixPQUF6QixFQUZaO0lBQUEsQ0FOVjtBQUFBLElBVUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLEVBRFU7SUFBQSxDQVZaO0dBSkYsQ0FBQTs7QUFBQSxFQWlCQSxPQUFBLEdBQVUsU0FBQyxTQUFELEdBQUE7QUFDUixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxTQUFTLENBQUMsT0FBVixDQUFrQixRQUFsQixFQUE0QixFQUE1QixDQUFYLENBQUE7QUFDQSxJQUFBLElBQWMsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBQSxLQUEwQixNQUF4QztBQUFBLFlBQUEsQ0FBQTtLQURBOztNQUdBLFVBQVcsT0FBQSxDQUFRLFlBQVI7S0FIWDtXQUlJLElBQUEsT0FBQSxDQUFRO0FBQUEsTUFBQSxRQUFBLEVBQVUsUUFBVjtLQUFSLEVBTEk7RUFBQSxDQWpCVixDQUFBOztBQUFBLEVBd0JBLFVBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxRQUFBLGtCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVgsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxPQUFULENBQUEsQ0FEWCxDQUFBO0FBRUEsSUFBQSxJQUFHLFFBQUEsSUFBYSxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBaEI7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBcUIsUUFBQSxHQUFRLFFBQTdCLEVBREY7S0FBQSxNQUFBO2FBR0UsT0FBTyxDQUFDLElBQVIsQ0FBYyxRQUFBLEdBQVEsUUFBUixHQUFpQixtQkFBL0IsRUFIRjtLQUhXO0VBQUEsQ0F4QmIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Sargon/.atom/packages/hex/lib/hex.coffee
