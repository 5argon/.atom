function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libSymbolsList = require('../lib/symbols-list');

var _libSymbolsList2 = _interopRequireDefault(_libSymbolsList);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

'use babel';

describe('SymbolsList', function () {
  var workspaceElement = undefined,
      activationPromise = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('symbols-list');
  });

  describe('when the symbols-list:toggle event is triggered', function () {
    it('hides and shows the modal panel', function () {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.symbols-list')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'symbols-list:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        expect(workspaceElement.querySelector('.symbols-list')).toExist();

        var SymbolsListElement = workspaceElement.querySelector('.symbols-list');
        expect(SymbolsListElement).toExist();

        var SymbolsListPanel = atom.workspace.panelForItem(SymbolsListElement);
        expect(SymbolsListPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'symbols-list:toggle');
        expect(SymbolsListPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', function () {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.symbols-list')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'symbols-list:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        // Now we can test for view visibility
        var SymbolsListElement = workspaceElement.querySelector('.symbols-list');
        expect(SymbolsListElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'symbols-list:toggle');
        expect(SymbolsListElement).not.toBeVisible();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9zeW1ib2xzLWxpc3Qvc3BlYy9zeW1ib2xzLWxpc3Qtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs4QkFFd0IscUJBQXFCOzs7Ozs7Ozs7QUFGN0MsV0FBVyxDQUFDOztBQVNaLFFBQVEsQ0FBQyxhQUFhLEVBQUUsWUFBTTtBQUM1QixNQUFJLGdCQUFnQixZQUFBO01BQUUsaUJBQWlCLFlBQUEsQ0FBQzs7QUFFeEMsWUFBVSxDQUFDLFlBQU07QUFDZixvQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQscUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7R0FDbkUsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxpREFBaUQsRUFBRSxZQUFNO0FBQ2hFLE1BQUUsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNOzs7QUFHMUMsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7OztBQUl0RSxVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUVoRSxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxpQkFBaUIsQ0FBQztPQUMxQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQU07QUFDVCxjQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWxFLFlBQUksa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pFLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVyQyxZQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDdkUsY0FBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDaEUsY0FBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2xELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMEJBQTBCLEVBQUUsWUFBTTs7Ozs7OztBQU9uQyxhQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Ozs7QUFJdEUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLENBQUMsQ0FBQzs7QUFFaEUscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8saUJBQWlCLENBQUM7T0FDMUIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFNOztBQUVULFlBQUksa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pFLGNBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDaEUsY0FBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO09BQzlDLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9zYXJnb24vLmF0b20vcGFja2FnZXMvc3ltYm9scy1saXN0L3NwZWMvc3ltYm9scy1saXN0LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFN5bWJvbHNMaXN0IGZyb20gJy4uL2xpYi9zeW1ib2xzLWxpc3QnO1xuXG4vLyBVc2UgdGhlIGNvbW1hbmQgYHdpbmRvdzpydW4tcGFja2FnZS1zcGVjc2AgKGNtZC1hbHQtY3RybC1wKSB0byBydW4gc3BlY3MuXG4vL1xuLy8gVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4vLyBvciBgZmRlc2NyaWJlYCkuIFJlbW92ZSB0aGUgYGZgIHRvIHVuZm9jdXMgdGhlIGJsb2NrLlxuXG5kZXNjcmliZSgnU3ltYm9sc0xpc3QnLCAoKSA9PiB7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdzeW1ib2xzLWxpc3QnKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlIHN5bWJvbHMtbGlzdDp0b2dnbGUgZXZlbnQgaXMgdHJpZ2dlcmVkJywgKCkgPT4ge1xuICAgIGl0KCdoaWRlcyBhbmQgc2hvd3MgdGhlIG1vZGFsIHBhbmVsJywgKCkgPT4ge1xuICAgICAgLy8gQmVmb3JlIHRoZSBhY3RpdmF0aW9uIGV2ZW50IHRoZSB2aWV3IGlzIG5vdCBvbiB0aGUgRE9NLCBhbmQgbm8gcGFuZWxcbiAgICAgIC8vIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zeW1ib2xzLWxpc3QnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBhY3RpdmF0aW9uIGV2ZW50LCB0cmlnZ2VyaW5nIGl0IHdpbGwgY2F1c2UgdGhlIHBhY2thZ2UgdG8gYmVcbiAgICAgIC8vIGFjdGl2YXRlZC5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3N5bWJvbHMtbGlzdDp0b2dnbGUnKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3ltYm9scy1saXN0JykpLnRvRXhpc3QoKTtcblxuICAgICAgICBsZXQgU3ltYm9sc0xpc3RFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3ltYm9scy1saXN0Jyk7XG4gICAgICAgIGV4cGVjdChTeW1ib2xzTGlzdEVsZW1lbnQpLnRvRXhpc3QoKTtcblxuICAgICAgICBsZXQgU3ltYm9sc0xpc3RQYW5lbCA9IGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShTeW1ib2xzTGlzdEVsZW1lbnQpO1xuICAgICAgICBleHBlY3QoU3ltYm9sc0xpc3RQYW5lbC5pc1Zpc2libGUoKSkudG9CZSh0cnVlKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ltYm9scy1saXN0OnRvZ2dsZScpO1xuICAgICAgICBleHBlY3QoU3ltYm9sc0xpc3RQYW5lbC5pc1Zpc2libGUoKSkudG9CZShmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdoaWRlcyBhbmQgc2hvd3MgdGhlIHZpZXcnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3Qgc2hvd3MgeW91IGFuIGludGVncmF0aW9uIHRlc3QgdGVzdGluZyBhdCB0aGUgdmlldyBsZXZlbC5cblxuICAgICAgLy8gQXR0YWNoaW5nIHRoZSB3b3Jrc3BhY2VFbGVtZW50IHRvIHRoZSBET00gaXMgcmVxdWlyZWQgdG8gYWxsb3cgdGhlXG4gICAgICAvLyBgdG9CZVZpc2libGUoKWAgbWF0Y2hlcnMgdG8gd29yay4gQW55dGhpbmcgdGVzdGluZyB2aXNpYmlsaXR5IG9yIGZvY3VzXG4gICAgICAvLyByZXF1aXJlcyB0aGF0IHRoZSB3b3Jrc3BhY2VFbGVtZW50IGlzIG9uIHRoZSBET00uIFRlc3RzIHRoYXQgYXR0YWNoIHRoZVxuICAgICAgLy8gd29ya3NwYWNlRWxlbWVudCB0byB0aGUgRE9NIGFyZSBnZW5lcmFsbHkgc2xvd2VyIHRoYW4gdGhvc2Ugb2ZmIERPTS5cbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zeW1ib2xzLWxpc3QnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBhY3RpdmF0aW9uIGV2ZW50LCB0cmlnZ2VyaW5nIGl0IGNhdXNlcyB0aGUgcGFja2FnZSB0byBiZVxuICAgICAgLy8gYWN0aXZhdGVkLlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ltYm9scy1saXN0OnRvZ2dsZScpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2U7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gdGVzdCBmb3IgdmlldyB2aXNpYmlsaXR5XG4gICAgICAgIGxldCBTeW1ib2xzTGlzdEVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zeW1ib2xzLWxpc3QnKTtcbiAgICAgICAgZXhwZWN0KFN5bWJvbHNMaXN0RWxlbWVudCkudG9CZVZpc2libGUoKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ltYm9scy1saXN0OnRvZ2dsZScpO1xuICAgICAgICBleHBlY3QoU3ltYm9sc0xpc3RFbGVtZW50KS5ub3QudG9CZVZpc2libGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/sargon/.atom/packages/symbols-list/spec/symbols-list-spec.js
