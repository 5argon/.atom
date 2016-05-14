(function() {
  var ChromeColorPicker;

  ChromeColorPicker = require('../lib/chrome-color-picker');

  describe("ChromeColorPicker", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('chrome-color-picker');
    });
    return describe("when the chrome-color-picker:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('chrome-color-picker')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'chrome-color-picker:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var chromeColorPickerElement, chromeColorPickerPanel;
          expect(workspaceElement.querySelector('chrome-color-picker')).toExist();
          chromeColorPickerElement = workspaceElement.querySelector('chrome-color-picker');
          expect(chromeColorPickerElement).toExist();
          chromeColorPickerPanel = atom.workspace.panelForItem(chromeColorPickerElement);
          expect(chromeColorPickerPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'chrome-color-picker:toggle');
          return expect(chromeColorPickerPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('chrome-color-picker')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'chrome-color-picker:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var chromeColorPickerElement;
          chromeColorPickerElement = workspaceElement.querySelector('chrome-color-picker');
          expect(chromeColorPickerElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'chrome-color-picker:toggle');
          return expect(chromeColorPickerElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL3NwZWMvY2hyb21lLWNvbG9yLXBpY2tlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSw0QkFBUixDQUFwQixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyx3REFBVCxFQUFtRSxTQUFBLEdBQUE7QUFDakUsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLHFCQUEvQixDQUFQLENBQTZELENBQUMsR0FBRyxDQUFDLE9BQWxFLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDRCQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsZ0RBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSx3QkFBQSxHQUEyQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsQ0FGM0IsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLHdCQUFQLENBQWdDLENBQUMsT0FBakMsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLHNCQUFBLEdBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0Qix3QkFBNUIsQ0FMekIsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLHNCQUFzQixDQUFDLFNBQXZCLENBQUEsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELElBQWhELENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw0QkFBekMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxzQkFBc0IsQ0FBQyxTQUF2QixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxLQUFoRCxFQVRHO1FBQUEsQ0FBTCxFQVpvQztNQUFBLENBQXRDLENBQUEsQ0FBQTthQXVCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBTzdCLFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLHFCQUEvQixDQUFQLENBQTZELENBQUMsR0FBRyxDQUFDLE9BQWxFLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDRCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsd0JBQUE7QUFBQSxVQUFBLHdCQUFBLEdBQTJCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLHFCQUEvQixDQUEzQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sd0JBQVAsQ0FBZ0MsQ0FBQyxXQUFqQyxDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw0QkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyx3QkFBUCxDQUFnQyxDQUFDLEdBQUcsQ0FBQyxXQUFyQyxDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEJpRTtJQUFBLENBQW5FLEVBUDRCO0VBQUEsQ0FBOUIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/spec/chrome-color-picker-spec.coffee
