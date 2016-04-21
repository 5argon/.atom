(function() {
  var Flasher, Range, settings;

  settings = require('./settings');

  Range = require('atom').Range;

  module.exports = Flasher = (function() {
    function Flasher() {}

    Flasher.flash = function() {
      var editor, marker, point, spec;
      Flasher.clear();
      editor = atom.workspace.getActiveTextEditor();
      spec = (function() {
        switch (settings.get('flashType')) {
          case 'line':
            return {
              type: 'line',
              range: editor.getLastCursor().getCurrentLineBufferRange()
            };
          case 'word':
            return {
              type: 'highlight',
              range: editor.getLastCursor().getCurrentWordBufferRange()
            };
          case 'point':
            point = editor.getCursorBufferPosition();
            return {
              type: 'highlight',
              range: new Range(point, point.translate([0, 1]))
            };
        }
      })();
      marker = editor.markBufferRange(spec.range, {
        invalidate: 'never',
        persistent: false
      });
      Flasher.decoration = editor.decorateMarker(marker, {
        type: spec.type,
        "class": "cursor-history-" + (settings.get('flashColor'))
      });
      return Flasher.timeoutID = setTimeout(function() {
        return Flasher.decoration.getMarker().destroy();
      }, settings.get('flashDurationMilliSeconds'));
    };

    Flasher.clear = function() {
      var _ref;
      if ((_ref = Flasher.decoration) != null) {
        _ref.getMarker().destroy();
      }
      return clearTimeout(Flasher.timeoutID);
    };

    return Flasher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L2xpYi9mbGFzaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQUFaLENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTt5QkFDSjs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxLQUFELEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSwyQkFBQTtBQUFBLE1BQUEsT0FBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsTUFFQSxJQUFBO0FBQ0UsZ0JBQU8sUUFBUSxDQUFDLEdBQVQsQ0FBYSxXQUFiLENBQVA7QUFBQSxlQUNPLE1BRFA7bUJBRUk7QUFBQSxjQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsY0FDQSxLQUFBLEVBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLHlCQUF2QixDQUFBLENBRFA7Y0FGSjtBQUFBLGVBSU8sTUFKUDttQkFLSTtBQUFBLGNBQUEsSUFBQSxFQUFNLFdBQU47QUFBQSxjQUNBLEtBQUEsRUFBTyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQXNCLENBQUMseUJBQXZCLENBQUEsQ0FEUDtjQUxKO0FBQUEsZUFPTyxPQVBQO0FBUUksWUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUixDQUFBO21CQUNBO0FBQUEsY0FBQSxJQUFBLEVBQU0sV0FBTjtBQUFBLGNBQ0EsS0FBQSxFQUFXLElBQUEsS0FBQSxDQUFNLEtBQU4sRUFBYSxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWhCLENBQWIsQ0FEWDtjQVRKO0FBQUE7VUFIRixDQUFBO0FBQUEsTUFlQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsSUFBSSxDQUFDLEtBQTVCLEVBQ1A7QUFBQSxRQUFBLFVBQUEsRUFBWSxPQUFaO0FBQUEsUUFDQSxVQUFBLEVBQVksS0FEWjtPQURPLENBZlQsQ0FBQTtBQUFBLE1BbUJBLE9BQUMsQ0FBQSxVQUFELEdBQWMsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFDWjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUksQ0FBQyxJQUFYO0FBQUEsUUFDQSxPQUFBLEVBQVEsaUJBQUEsR0FBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBVCxDQUFhLFlBQWIsQ0FBRCxDQUR4QjtPQURZLENBbkJkLENBQUE7YUF1QkEsT0FBQyxDQUFBLFNBQUQsR0FBYSxVQUFBLENBQVksU0FBQSxHQUFBO2VBQ3ZCLE9BQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQXVCLENBQUMsT0FBeEIsQ0FBQSxFQUR1QjtNQUFBLENBQVosRUFFWCxRQUFRLENBQUMsR0FBVCxDQUFhLDJCQUFiLENBRlcsRUF4QlA7SUFBQSxDQUFSLENBQUE7O0FBQUEsSUE0QkEsT0FBQyxDQUFBLEtBQUQsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQUE7O1lBQVcsQ0FBRSxTQUFiLENBQUEsQ0FBd0IsQ0FBQyxPQUF6QixDQUFBO09BQUE7YUFDQSxZQUFBLENBQWEsT0FBQyxDQUFBLFNBQWQsRUFGTTtJQUFBLENBNUJSLENBQUE7O21CQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/sargon/.atom/packages/cursor-history/lib/flasher.coffee
