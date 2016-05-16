(function() {
  var root, setFontSize, setTabSizing, unsetFontSize, unsetTabSizing;

  root = document.documentElement;

  module.exports = {
    activate: function(state) {
      atom.config.observe('one-dark-mini-ui.fontSize', function(value) {
        return setFontSize(value);
      });
      return atom.config.observe('one-dark-mini-ui.tabSizing', function(value) {
        return setTabSizing(value);
      });
    },
    deactivate: function() {
      unsetFontSize();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi9Eb2N1bWVudHMvNWFyZ29uIFdvcmsvb25lLWRhcmstbWluaS11aS9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGVBQWhCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwyQkFBcEIsRUFBaUQsU0FBQyxLQUFELEdBQUE7ZUFDL0MsV0FBQSxDQUFZLEtBQVosRUFEK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBCLEVBQWtELFNBQUMsS0FBRCxHQUFBO2VBQ2hELFlBQUEsQ0FBYSxLQUFiLEVBRGdEO01BQUEsQ0FBbEQsRUFKUTtJQUFBLENBQVY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxjQUFBLENBQUEsRUFGVTtJQUFBLENBUFo7R0FIRixDQUFBOztBQUFBLEVBZUEsV0FBQSxHQUFjLFNBQUMsZUFBRCxHQUFBO0FBQ1osSUFBQSxJQUFHLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGVBQWpCLENBQUg7YUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0IsRUFBQSxHQUFHLGVBQUgsR0FBbUIsS0FEM0M7S0FBQSxNQUVLLElBQUcsZUFBQSxLQUFtQixNQUF0QjthQUNILGFBQUEsQ0FBQSxFQURHO0tBSE87RUFBQSxDQWZkLENBQUE7O0FBQUEsRUFxQkEsYUFBQSxHQUFnQixTQUFBLEdBQUE7V0FDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0IsR0FEUjtFQUFBLENBckJoQixDQUFBOztBQUFBLEVBeUJBLFlBQUEsR0FBZSxTQUFDLFNBQUQsR0FBQTtXQUNiLElBQUksQ0FBQyxZQUFMLENBQWtCLGtDQUFsQixFQUFzRCxTQUFTLENBQUMsV0FBVixDQUFBLENBQXRELEVBRGE7RUFBQSxDQXpCZixDQUFBOztBQUFBLEVBNEJBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO1dBQ2YsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsa0NBQXJCLEVBRGU7RUFBQSxDQTVCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Sargon/Documents/5argon%20Work/one-dark-mini-ui/lib/main.coffee
