(function() {
  describe("One Dark Mini UI theme", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('one-dark-mini-ui');
      });
    });
    it("allows the font size to be set via config", function() {
      expect(document.documentElement.style.fontSize).toBe('');
      atom.config.set('one-dark-mini-ui.fontSize', '10');
      expect(document.documentElement.style.fontSize).toBe('10px');
      atom.config.set('one-dark-mini-ui.fontSize', 'Auto');
      return expect(document.documentElement.style.fontSize).toBe('');
    });
    it("allows the layout mode to be set via config", function() {
      expect(document.documentElement.getAttribute('theme-one-dark-mini-ui-layoutmode')).toBe('auto');
      atom.config.set('one-dark-mini-ui.layoutMode', 'Spacious');
      return expect(document.documentElement.getAttribute('theme-one-dark-mini-ui-layoutmode')).toBe('spacious');
    });
    return it("allows the tab sizing to be set via config", function() {
      expect(document.documentElement.getAttribute('theme-one-dark-mini-ui-tabsizing')).toBe('auto');
      atom.config.set('one-dark-mini-ui.tabSizing', 'Minimum');
      return expect(document.documentElement.getAttribute('theme-one-dark-mini-ui-tabsizing')).toBe('minimum');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL29uZS1kYXJrLW1pbmktdWkvc3BlYy90aGVtZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGtCQUE5QixFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFJQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLE1BQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQXRDLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsRUFBckQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLElBQTdDLENBRkEsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQXRDLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsTUFBckQsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLE1BQTdDLENBTEEsQ0FBQTthQU1BLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUF0QyxDQUErQyxDQUFDLElBQWhELENBQXFELEVBQXJELEVBUDhDO0lBQUEsQ0FBaEQsQ0FKQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELE1BQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBekIsQ0FBc0MsbUNBQXRDLENBQVAsQ0FBa0YsQ0FBQyxJQUFuRixDQUF3RixNQUF4RixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsRUFBK0MsVUFBL0MsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBekIsQ0FBc0MsbUNBQXRDLENBQVAsQ0FBa0YsQ0FBQyxJQUFuRixDQUF3RixVQUF4RixFQUpnRDtJQUFBLENBQWxELENBYkEsQ0FBQTtXQW1CQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLE1BQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBekIsQ0FBc0Msa0NBQXRDLENBQVAsQ0FBaUYsQ0FBQyxJQUFsRixDQUF1RixNQUF2RixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEMsU0FBOUMsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBekIsQ0FBc0Msa0NBQXRDLENBQVAsQ0FBaUYsQ0FBQyxJQUFsRixDQUF1RixTQUF2RixFQUorQztJQUFBLENBQWpELEVBcEJpQztFQUFBLENBQW5DLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/one-dark-mini-ui/spec/theme-spec.coffee
