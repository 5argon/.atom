(function() {
  var root, setFontSize, setTabSizing, unsetFontSize, unsetTabSizing;

  root = document.documentElement;

  module.exports = {
    activate: function(state) {
      atom.config.observe('one-dark-mini-ui.fontSize', function(value) {
        return setFontSize(value);
      });
      atom.config.observe('one-dark-mini-ui.layoutMode', function(value) {
        return setLayoutMode(value);
      });
      return atom.config.observe('one-dark-mini-ui.tabSizing', function(value) {
        return setTabSizing(value);
      });
    },
    deactivate: function() {
      unsetFontSize();
      unsetLayoutMode();
      return unsetTabSizing();
    }
  };

  setFontSize = function(currentFontSize) {
    if (Number.isInteger(currentFontSize)) {
      return root.style.fontSize = "" + currentFontSize + "px";
    } else if (currentFontSize === 'Auto') {
      return unsetFontSize();
    }
  };

  unsetFontSize = function() {
    return root.style.fontSize = '';
  };

  setTabSizing = function(tabSizing) {
    return root.setAttribute('theme-one-dark-mini-ui-tabsizing', tabSizing.toLowerCase());
  };

  unsetTabSizing = function() {
    return root.removeAttribute('theme-one-dark-mini-ui-tabsizing');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi9Eb2N1bWVudHMvNWFyZ29uIFdvcmsvb25lLWRhcmstbWluaS11aS9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGVBQWhCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwyQkFBcEIsRUFBaUQsU0FBQyxLQUFELEdBQUE7ZUFDL0MsV0FBQSxDQUFZLEtBQVosRUFEK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw2QkFBcEIsRUFBbUQsU0FBQyxLQUFELEdBQUE7ZUFDakQsYUFBQSxDQUFjLEtBQWQsRUFEaUQ7TUFBQSxDQUFuRCxDQUhBLENBQUE7YUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBCLEVBQWtELFNBQUMsS0FBRCxHQUFBO2VBQ2hELFlBQUEsQ0FBYSxLQUFiLEVBRGdEO01BQUEsQ0FBbEQsRUFQUTtJQUFBLENBQVY7QUFBQSxJQVVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBQSxDQURBLENBQUE7YUFFQSxjQUFBLENBQUEsRUFIVTtJQUFBLENBVlo7R0FIRixDQUFBOztBQUFBLEVBbUJBLFdBQUEsR0FBYyxTQUFDLGVBQUQsR0FBQTtBQUNaLElBQUEsSUFBRyxNQUFNLENBQUMsU0FBUCxDQUFpQixlQUFqQixDQUFIO2FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCLEVBQUEsR0FBRyxlQUFILEdBQW1CLEtBRDNDO0tBQUEsTUFFSyxJQUFHLGVBQUEsS0FBbUIsTUFBdEI7YUFDSCxhQUFBLENBQUEsRUFERztLQUhPO0VBQUEsQ0FuQmQsQ0FBQTs7QUFBQSxFQXlCQSxhQUFBLEdBQWdCLFNBQUEsR0FBQTtXQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQixHQURSO0VBQUEsQ0F6QmhCLENBQUE7O0FBQUEsRUE2QkEsWUFBQSxHQUFlLFNBQUMsU0FBRCxHQUFBO1dBQ2IsSUFBSSxDQUFDLFlBQUwsQ0FBa0Isa0NBQWxCLEVBQXNELFNBQVMsQ0FBQyxXQUFWLENBQUEsQ0FBdEQsRUFEYTtFQUFBLENBN0JmLENBQUE7O0FBQUEsRUFnQ0EsY0FBQSxHQUFpQixTQUFBLEdBQUE7V0FDZixJQUFJLENBQUMsZUFBTCxDQUFxQixrQ0FBckIsRUFEZTtFQUFBLENBaENqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/Documents/5argon%20Work/one-dark-mini-ui/lib/main.coffee
