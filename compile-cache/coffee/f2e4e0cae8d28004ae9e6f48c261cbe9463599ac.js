(function() {
  var CompositeDisposable, cachedTags,
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  cachedTags = null;

  module.exports = {
    activate: function() {
      cachedTags = {};
      this.subscriptions = new CompositeDisposable;
      return this.subscribe(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscribe(editor.onDidSave(function() {
            return delete cachedTags[editor.getPath()];
          }));
        };
      })(this)));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.subscriptions = {};
      return cachedTags = null;
    },
    subscribe: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.subscriptions).add.apply(_ref, args);
    },
    consumeVim: function(_arg) {
      var Base, MoveToNextSymbol, MoveToPreviousSymbol, state, _ref;
      Base = _arg.Base;
      _ref = require("./move-to-symbols"), state = _ref.state, MoveToNextSymbol = _ref.MoveToNextSymbol, MoveToPreviousSymbol = _ref.MoveToPreviousSymbol;
      this.subscribe(MoveToNextSymbol.registerCommand());
      this.subscribe(MoveToPreviousSymbol.registerCommand());
      return state.cachedTags = cachedTags;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtbW92ZS10by1zeW1ib2xzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsSUFGYixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLFNBQUQsQ0FBVyxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFBLEdBQUE7bUJBQzFCLE1BQUEsQ0FBQSxVQUFrQixDQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxFQURRO1VBQUEsQ0FBakIsQ0FBWCxFQUQyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQVgsRUFIUTtJQUFBLENBQVY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFEakIsQ0FBQTthQUVBLFVBQUEsR0FBYSxLQUhIO0lBQUEsQ0FQWjtBQUFBLElBWUEsU0FBQSxFQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsVUFBQTtBQUFBLE1BRFUsOERBQ1YsQ0FBQTthQUFBLFFBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBYyxDQUFDLEdBQWYsYUFBbUIsSUFBbkIsRUFEUztJQUFBLENBWlg7QUFBQSxJQWVBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFVBQUEseURBQUE7QUFBQSxNQURZLE9BQUQsS0FBQyxJQUNaLENBQUE7QUFBQSxNQUFBLE9BQWtELE9BQUEsQ0FBUSxtQkFBUixDQUFsRCxFQUFDLGFBQUEsS0FBRCxFQUFRLHdCQUFBLGdCQUFSLEVBQTBCLDRCQUFBLG9CQUExQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLGdCQUFnQixDQUFDLGVBQWpCLENBQUEsQ0FBWCxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELENBQVcsb0JBQW9CLENBQUMsZUFBckIsQ0FBQSxDQUFYLENBRkEsQ0FBQTthQUdBLEtBQUssQ0FBQyxVQUFOLEdBQW1CLFdBSlQ7SUFBQSxDQWZaO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/vim-mode-plus-move-to-symbols/lib/main.coffee
