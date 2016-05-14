(function() {
  var root, setFontSize, setLayoutMode, setTabSizing, unsetFontSize, unsetLayoutMode, unsetTabSizing;

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

  setLayoutMode = function(layoutMode) {
    return root.setAttribute('theme-one-dark-mini-ui-layoutmode', layoutMode.toLowerCase());
  };

  unsetLayoutMode = function() {
    return root.removeAttribute('theme-one-dark-mini-ui-layoutmode');
  };

  setTabSizing = function(tabSizing) {
    return root.setAttribute('theme-one-dark-mini-ui-tabsizing', tabSizing.toLowerCase());
  };

  unsetTabSizing = function() {
    return root.removeAttribute('theme-one-dark-mini-ui-tabsizing');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi9Eb2N1bWVudHMvNWFyZ29uIFdvcmsvb25lLWRhcmstdWkvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxlQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELFNBQUMsS0FBRCxHQUFBO2VBQy9DLFdBQUEsQ0FBWSxLQUFaLEVBRCtDO01BQUEsQ0FBakQsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNkJBQXBCLEVBQW1ELFNBQUMsS0FBRCxHQUFBO2VBQ2pELGFBQUEsQ0FBYyxLQUFkLEVBRGlEO01BQUEsQ0FBbkQsQ0FIQSxDQUFBO2FBTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDRCQUFwQixFQUFrRCxTQUFDLEtBQUQsR0FBQTtlQUNoRCxZQUFBLENBQWEsS0FBYixFQURnRDtNQUFBLENBQWxELEVBUFE7SUFBQSxDQUFWO0FBQUEsSUFVQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxhQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLENBQUEsQ0FEQSxDQUFBO2FBRUEsY0FBQSxDQUFBLEVBSFU7SUFBQSxDQVZaO0dBSEYsQ0FBQTs7QUFBQSxFQW1CQSxXQUFBLEdBQWMsU0FBQyxlQUFELEdBQUE7QUFDWixJQUFBLElBQUcsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsZUFBakIsQ0FBSDthQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQixFQUFBLEdBQUcsZUFBSCxHQUFtQixLQUQzQztLQUFBLE1BRUssSUFBRyxlQUFBLEtBQW1CLE1BQXRCO2FBQ0gsYUFBQSxDQUFBLEVBREc7S0FITztFQUFBLENBbkJkLENBQUE7O0FBQUEsRUF5QkEsYUFBQSxHQUFnQixTQUFBLEdBQUE7V0FDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0IsR0FEUjtFQUFBLENBekJoQixDQUFBOztBQUFBLEVBNkJBLGFBQUEsR0FBZ0IsU0FBQyxVQUFELEdBQUE7V0FDZCxJQUFJLENBQUMsWUFBTCxDQUFrQixtQ0FBbEIsRUFBdUQsVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUF2RCxFQURjO0VBQUEsQ0E3QmhCLENBQUE7O0FBQUEsRUFnQ0EsZUFBQSxHQUFrQixTQUFBLEdBQUE7V0FDaEIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsbUNBQXJCLEVBRGdCO0VBQUEsQ0FoQ2xCLENBQUE7O0FBQUEsRUFvQ0EsWUFBQSxHQUFlLFNBQUMsU0FBRCxHQUFBO1dBQ2IsSUFBSSxDQUFDLFlBQUwsQ0FBa0Isa0NBQWxCLEVBQXNELFNBQVMsQ0FBQyxXQUFWLENBQUEsQ0FBdEQsRUFEYTtFQUFBLENBcENmLENBQUE7O0FBQUEsRUF1Q0EsY0FBQSxHQUFpQixTQUFBLEdBQUE7V0FDZixJQUFJLENBQUMsZUFBTCxDQUFxQixrQ0FBckIsRUFEZTtFQUFBLENBdkNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/Documents/5argon%20Work/one-dark-ui/lib/main.coffee
