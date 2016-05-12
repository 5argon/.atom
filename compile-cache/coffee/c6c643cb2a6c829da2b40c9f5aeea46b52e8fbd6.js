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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL29uZS1kYXJrLW1pbmktdWkvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxlQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELFNBQUMsS0FBRCxHQUFBO2VBQy9DLFdBQUEsQ0FBWSxLQUFaLEVBRCtDO01BQUEsQ0FBakQsQ0FBQSxDQUFBO2FBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDRCQUFwQixFQUFrRCxTQUFDLEtBQUQsR0FBQTtlQUNoRCxZQUFBLENBQWEsS0FBYixFQURnRDtNQUFBLENBQWxELEVBSlE7SUFBQSxDQUFWO0FBQUEsSUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxhQUFBLENBQUEsQ0FBQSxDQUFBO2FBQ0EsY0FBQSxDQUFBLEVBRlU7SUFBQSxDQVBaO0dBSEYsQ0FBQTs7QUFBQSxFQWVBLFdBQUEsR0FBYyxTQUFDLGVBQUQsR0FBQTtBQUNaLElBQUEsSUFBRyxNQUFNLENBQUMsU0FBUCxDQUFpQixlQUFqQixDQUFIO2FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCLEVBQUEsR0FBRyxlQUFILEdBQW1CLEtBRDNDO0tBQUEsTUFFSyxJQUFHLGVBQUEsS0FBbUIsTUFBdEI7YUFDSCxhQUFBLENBQUEsRUFERztLQUhPO0VBQUEsQ0FmZCxDQUFBOztBQUFBLEVBcUJBLGFBQUEsR0FBZ0IsU0FBQSxHQUFBO1dBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCLEdBRFI7RUFBQSxDQXJCaEIsQ0FBQTs7QUFBQSxFQXlCQSxZQUFBLEdBQWUsU0FBQyxTQUFELEdBQUE7V0FDYixJQUFJLENBQUMsWUFBTCxDQUFrQixrQ0FBbEIsRUFBc0QsU0FBUyxDQUFDLFdBQVYsQ0FBQSxDQUF0RCxFQURhO0VBQUEsQ0F6QmYsQ0FBQTs7QUFBQSxFQTRCQSxjQUFBLEdBQWlCLFNBQUEsR0FBQTtXQUNmLElBQUksQ0FBQyxlQUFMLENBQXFCLGtDQUFyQixFQURlO0VBQUEsQ0E1QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/sargon/.atom/packages/one-dark-mini-ui/lib/main.coffee
