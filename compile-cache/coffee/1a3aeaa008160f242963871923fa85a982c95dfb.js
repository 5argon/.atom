(function() {
  var root, setFontSize, setLayoutMode, setTabSizing, unsetFontSize, unsetLayoutMode, unsetTabSizing;

  root = document.documentElement;

  module.exports = {
    activate: function(state) {
      atom.config.observe('one-dark-ui.fontSize', function(value) {
        return setFontSize(value);
      });
      atom.config.observe('one-dark-ui.layoutMode', function(value) {
        return setLayoutMode(value);
      });
      return atom.config.observe('one-dark-ui.tabSizing', function(value) {
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
    return root.setAttribute('theme-one-dark-ui-layoutmode', layoutMode.toLowerCase());
  };

  unsetLayoutMode = function() {
    return root.removeAttribute('theme-one-dark-ui-layoutmode');
  };

  setTabSizing = function(tabSizing) {
    return root.setAttribute('theme-one-dark-ui-tabsizing', tabSizing.toLowerCase());
  };

  unsetTabSizing = function() {
    return root.removeAttribute('theme-one-dark-ui-tabsizing');
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi9Eb2N1bWVudHMvNWFyZ29uIFdvcmsvb25lLWRhcmstdWkvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxlQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXBCLEVBQTRDLFNBQUMsS0FBRCxHQUFBO2VBQzFDLFdBQUEsQ0FBWSxLQUFaLEVBRDBDO01BQUEsQ0FBNUMsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0JBQXBCLEVBQThDLFNBQUMsS0FBRCxHQUFBO2VBQzVDLGFBQUEsQ0FBYyxLQUFkLEVBRDRDO01BQUEsQ0FBOUMsQ0FIQSxDQUFBO2FBTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHVCQUFwQixFQUE2QyxTQUFDLEtBQUQsR0FBQTtlQUMzQyxZQUFBLENBQWEsS0FBYixFQUQyQztNQUFBLENBQTdDLEVBUFE7SUFBQSxDQUFWO0FBQUEsSUFVQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxhQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLENBQUEsQ0FEQSxDQUFBO2FBRUEsY0FBQSxDQUFBLEVBSFU7SUFBQSxDQVZaO0dBSEYsQ0FBQTs7QUFBQSxFQW1CQSxXQUFBLEdBQWMsU0FBQyxlQUFELEdBQUE7QUFDWixJQUFBLElBQUcsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsZUFBakIsQ0FBSDthQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQixFQUFBLEdBQUcsZUFBSCxHQUFtQixLQUQzQztLQUFBLE1BRUssSUFBRyxlQUFBLEtBQW1CLE1BQXRCO2FBQ0gsYUFBQSxDQUFBLEVBREc7S0FITztFQUFBLENBbkJkLENBQUE7O0FBQUEsRUF5QkEsYUFBQSxHQUFnQixTQUFBLEdBQUE7V0FDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0IsR0FEUjtFQUFBLENBekJoQixDQUFBOztBQUFBLEVBNkJBLGFBQUEsR0FBZ0IsU0FBQyxVQUFELEdBQUE7V0FDZCxJQUFJLENBQUMsWUFBTCxDQUFrQiw4QkFBbEIsRUFBa0QsVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUFsRCxFQURjO0VBQUEsQ0E3QmhCLENBQUE7O0FBQUEsRUFnQ0EsZUFBQSxHQUFrQixTQUFBLEdBQUE7V0FDaEIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsOEJBQXJCLEVBRGdCO0VBQUEsQ0FoQ2xCLENBQUE7O0FBQUEsRUFvQ0EsWUFBQSxHQUFlLFNBQUMsU0FBRCxHQUFBO1dBQ2IsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsNkJBQWxCLEVBQWlELFNBQVMsQ0FBQyxXQUFWLENBQUEsQ0FBakQsRUFEYTtFQUFBLENBcENmLENBQUE7O0FBQUEsRUF1Q0EsY0FBQSxHQUFpQixTQUFBLEdBQUE7V0FDZixJQUFJLENBQUMsZUFBTCxDQUFxQiw2QkFBckIsRUFEZTtFQUFBLENBdkNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/Documents/5argon%20Work/one-dark-ui/lib/main.coffee
