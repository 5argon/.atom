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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9vbmUtZGFyay1taW5pLXVpL3NwZWMvdGhlbWUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixrQkFBOUIsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBSUEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxNQUFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUF0QyxDQUErQyxDQUFDLElBQWhELENBQXFELEVBQXJELENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxJQUE3QyxDQUZBLENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUF0QyxDQUErQyxDQUFDLElBQWhELENBQXFELE1BQXJELENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxNQUE3QyxDQUxBLENBQUE7YUFNQSxNQUFBLENBQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBdEMsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxFQUFyRCxFQVA4QztJQUFBLENBQWhELENBSkEsQ0FBQTtBQUFBLElBYUEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxNQUFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQXpCLENBQXNDLG1DQUF0QyxDQUFQLENBQWtGLENBQUMsSUFBbkYsQ0FBd0YsTUFBeEYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLFVBQS9DLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQXpCLENBQXNDLG1DQUF0QyxDQUFQLENBQWtGLENBQUMsSUFBbkYsQ0FBd0YsVUFBeEYsRUFKZ0Q7SUFBQSxDQUFsRCxDQWJBLENBQUE7V0FtQkEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxNQUFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQXpCLENBQXNDLGtDQUF0QyxDQUFQLENBQWlGLENBQUMsSUFBbEYsQ0FBdUYsTUFBdkYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLFNBQTlDLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQXpCLENBQXNDLGtDQUF0QyxDQUFQLENBQWlGLENBQUMsSUFBbEYsQ0FBdUYsU0FBdkYsRUFKK0M7SUFBQSxDQUFqRCxFQXBCaUM7RUFBQSxDQUFuQyxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Sargon/.atom/packages/one-dark-mini-ui/spec/theme-spec.coffee
