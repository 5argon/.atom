(function() {
  var Point, addCustomMatchers, dispatchCommand, getEditor, _;

  _ = require('underscore-plus');

  Point = require('atom').Point;

  getEditor = function() {
    return atom.workspace.getActiveTextEditor();
  };

  dispatchCommand = function(element, command) {
    atom.commands.dispatch(element, command);
    return advanceClock(100);
  };

  addCustomMatchers = function(spec) {
    return spec.addMatchers({
      toBeEqualEntry: function(expected) {
        return (this.actual.URI === expected.URI) && (Point.fromObject(this.actual.point).isEqual(Point.fromObject(expected.point)));
      }
    });
  };

  describe("cursor-history", function() {
    var editor, editorElement, getEntries, main, pathSample1, pathSample2, workspaceElement, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], main = _ref[2], pathSample1 = _ref[3], pathSample2 = _ref[4], workspaceElement = _ref[5];
    getEntries = function(which) {
      var entries;
      if (which == null) {
        which = null;
      }
      entries = main.history.entries;
      switch (which) {
        case 'last':
          return _.last(entries);
        case 'first':
          return _.first(entries);
        default:
          return entries;
      }
    };
    beforeEach(function() {
      addCustomMatchers(this);
      spyOn(_._, "now").andCallFake(function() {
        return window.now;
      });
      atom.commands.add('atom-workspace', {
        'test:move-down-2': function() {
          return getEditor().moveDown(2);
        },
        'test:move-down-5': function() {
          return getEditor().moveDown(5);
        },
        'test:move-up-2': function() {
          return getEditor().moveUp(2);
        },
        'test:move-up-5': function() {
          return getEditor().moveUp(5);
        }
      });
      pathSample1 = atom.project.resolvePath("sample-1.coffee");
      pathSample2 = atom.project.resolvePath("sample-2.coffee");
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage('cursor-history').then(function(pack) {
          return main = pack.mainModule;
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open(pathSample1).then(function(e) {
          editor = e;
          return editorElement = atom.views.getView(e);
        });
      });
    });
    describe("initial state of history entries", function() {
      it("is empty", function() {
        return expect(getEntries()).toHaveLength(0);
      });
      return it("index is 0", function() {
        return expect(main.history.index).toBe(0);
      });
    });
    describe("history saving", function() {
      describe("cursor moved", function() {
        it("save history when cursor moved over 4 line by default", function() {
          editor.setCursorBufferPosition([0, 5]);
          dispatchCommand(editorElement, 'test:move-down-5');
          expect(getEntries()).toHaveLength(1);
          expect(getEntries('first')).toBeEqualEntry({
            point: [0, 5],
            URI: pathSample1
          });
          return expect(getEntries('first')).toBeEqualEntry({
            point: [0, 5],
            URI: pathSample1
          });
        });
        it("can save multiple entry", function() {
          var e1, e2, e3, entries;
          dispatchCommand(editorElement, 'test:move-down-5');
          dispatchCommand(editorElement, 'test:move-down-5');
          dispatchCommand(editorElement, 'test:move-down-5');
          entries = getEntries();
          expect(entries).toHaveLength(3);
          e1 = entries[0], e2 = entries[1], e3 = entries[2];
          expect(e1).toBeEqualEntry({
            point: [0, 0],
            URI: pathSample1
          });
          expect(e2).toBeEqualEntry({
            point: [5, 0],
            URI: pathSample1
          });
          return expect(e3).toBeEqualEntry({
            point: [10, 0],
            URI: pathSample1
          });
        });
        it("wont save history if line delta of move is less than 4 line", function() {
          dispatchCommand(editorElement, 'core:move-down');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(getEntries()).toHaveLength(0);
        });
        return it("remove older entry if its row is same as new entry", function() {
          var e1, e2, e3, entries;
          dispatchCommand(editorElement, 'test:move-down-5');
          dispatchCommand(editorElement, 'test:move-down-5');
          dispatchCommand(editorElement, 'test:move-up-5');
          entries = getEntries();
          expect(entries).toHaveLength(3);
          e1 = entries[0], e2 = entries[1], e3 = entries[2];
          expect(e1).toBeEqualEntry({
            point: [0, 0],
            URI: pathSample1
          });
          expect(e2).toBeEqualEntry({
            point: [5, 0],
            URI: pathSample1
          });
          expect(e3).toBeEqualEntry({
            point: [10, 0],
            URI: pathSample1
          });
          expect(editor.getCursorBufferPosition()).toEqual([5, 0]);
          editor.setCursorBufferPosition([5, 5]);
          expect(editor.getCursorBufferPosition()).toEqual([5, 5]);
          dispatchCommand(editorElement, 'test:move-up-5');
          entries = getEntries();
          expect(entries).toHaveLength(3);
          e1 = entries[0], e2 = entries[1], e3 = entries[2];
          expect(e1).toBeEqualEntry({
            point: [0, 0],
            URI: pathSample1
          });
          expect(e2).toBeEqualEntry({
            point: [10, 0],
            URI: pathSample1
          });
          return expect(e3).toBeEqualEntry({
            point: [5, 5],
            URI: pathSample1
          });
        });
      });
      xit("save history when mouseclick", function() {});
      return describe("rowDeltaToRemember settings", function() {
        beforeEach(function() {
          return atom.config.set('cursor-history.rowDeltaToRemember', 1);
        });
        return describe("when set to 1", function() {
          return it("save history when cursor move over 1 line", function() {
            editor.setCursorBufferPosition([0, 5]);
            dispatchCommand(editorElement, 'test:move-down-2');
            expect(editor.getCursorBufferPosition()).toEqual([2, 5]);
            expect(getEntries()).toHaveLength(1);
            expect(getEntries('first')).toBeEqualEntry({
              point: [0, 5],
              URI: pathSample1
            });
            dispatchCommand(editorElement, 'test:move-down-2');
            expect(editor.getCursorBufferPosition()).toEqual([4, 5]);
            expect(getEntries()).toHaveLength(2);
            return expect(getEntries('last')).toBeEqualEntry({
              point: [2, 5],
              URI: pathSample1
            });
          });
        });
      });
    });
    return describe("go/back history with next/prev commands", function() {
      var isInitialState;
      isInitialState = function() {
        expect(getEntries()).toHaveLength(0);
        return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
      };
      beforeEach(function() {
        return isInitialState();
      });
      describe("when history is empty", function() {
        it("do nothing with next", function() {
          dispatchCommand(editorElement, 'cursor-history:next');
          return isInitialState();
        });
        it("do nothing with prev", function() {
          dispatchCommand(editorElement, 'cursor-history:prev');
          return isInitialState();
        });
        it("do nothing with next-within-editor", function() {
          dispatchCommand(editorElement, 'cursor-history:next-within-editor');
          return isInitialState();
        });
        return it("do nothing with prev-within-editor", function() {
          dispatchCommand(editorElement, 'cursor-history:prev-within-editor');
          return isInitialState();
        });
      });
      describe("when history is not empty", function() {
        var e0, e1, e2, e3, editor2, editorElement2, isEntry, runCommand, _ref1;
        _ref1 = [], e0 = _ref1[0], e1 = _ref1[1], e2 = _ref1[2], e3 = _ref1[3], editor2 = _ref1[4], editorElement2 = _ref1[5];
        beforeEach(function() {
          runs(function() {
            dispatchCommand(editorElement, 'test:move-down-5');
            return dispatchCommand(editorElement, 'test:move-down-5');
          });
          waitsForPromise(function() {
            return atom.workspace.open(pathSample2).then(function(e) {
              editor2 = e;
              return editorElement2 = atom.views.getView(e);
            });
          });
          return runs(function() {
            var entries;
            dispatchCommand(editorElement2, 'test:move-down-5');
            dispatchCommand(editorElement2, 'test:move-down-5');
            entries = getEntries();
            expect(entries).toHaveLength(4);
            expect(main.history.index).toBe(4);
            e0 = entries[0], e1 = entries[1], e2 = entries[2], e3 = entries[3];
            expect(getEditor().getURI()).toBe(pathSample2);
            return expect(getEditor().getCursorBufferPosition()).toEqual([10, 0]);
          });
        });
        runCommand = function(command, fn) {
          runs(function() {
            spyOn(main, "land").andCallThrough();
            return atom.commands.dispatch(workspaceElement, command);
          });
          waitsFor(function() {
            return main.land.callCount === 1;
          });
          runs(function() {
            return fn();
          });
          return runs(function() {
            return jasmine.unspy(main, 'land');
          });
        };
        isEntry = function(index) {
          var entry;
          expect(main.history.index).toBe(index);
          entry = getEntries()[index];
          expect(getEditor().getCursorBufferPosition()).toEqual(entry.point);
          return expect(getEditor().getURI()).toBe(entry.URI);
        };
        describe("cursor-history:prev", function() {
          it("visit prev entry of cursor history", function() {
            runCommand('cursor-history:prev', function() {
              return isEntry(3);
            });
            runCommand('cursor-history:prev', function() {
              return isEntry(2);
            });
            runCommand('cursor-history:prev', function() {
              return isEntry(1);
            });
            return runCommand('cursor-history:prev', function() {
              return isEntry(0);
            });
          });
          return it("save last position if index is at head(=length of entries)", function() {
            expect(getEntries()).toHaveLength(4);
            runCommand('cursor-history:prev', function() {
              return isEntry(3);
            });
            return runs(function() {
              expect(getEntries()).toHaveLength(5);
              return expect(getEntries('last')).toBeEqualEntry({
                point: [10, 0],
                URI: pathSample2
              });
            });
          });
        });
        describe("cursor-history:next", function() {
          return it("visit next entry of cursor history", function() {
            main.history.index = 0;
            runCommand('cursor-history:next', function() {
              return isEntry(1);
            });
            runCommand('cursor-history:next', function() {
              return isEntry(2);
            });
            return runCommand('cursor-history:next', function() {
              return isEntry(3);
            });
          });
        });
        describe("cursor-history:prev-within-editor", function() {
          return it("visit prev entry of history within same editor", function() {
            runCommand('cursor-history:prev-within-editor', function() {
              return isEntry(3);
            });
            runCommand('cursor-history:prev-within-editor', function() {
              return isEntry(2);
            });
            return runs(function() {
              atom.commands.dispatch(workspaceElement, 'cursor-history:prev-within-editor');
              return isEntry(2);
            });
          });
        });
        describe("cursor-history:next-within-editor", function() {
          return it("visit next entry of history within same editor", function() {
            main.history.index = 0;
            waitsForPromise(function() {
              return atom.workspace.open(pathSample1);
            });
            runCommand('cursor-history:next-within-editor', function() {
              return isEntry(1);
            });
            return runs(function() {
              atom.commands.dispatch(workspaceElement, 'cursor-history:next-within-editor');
              return isEntry(1);
            });
          });
        });
        return describe("when editor is destroyed", function() {
          var getValidEntries;
          getValidEntries = function() {
            var e, _i, _len, _ref2, _results;
            _ref2 = getEntries();
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              e = _ref2[_i];
              if (e.isValid()) {
                _results.push(e);
              }
            }
            return _results;
          };
          beforeEach(function() {
            expect(getEditor().getURI()).toBe(pathSample2);
            runs(function() {
              return editor2.destroy();
            });
            return runs(function() {
              expect(editor2.isAlive()).toBe(false);
              expect(getEditor().getURI()).toBe(pathSample1);
              return expect(getValidEntries()).toHaveLength(4);
            });
          });
          it("still can reopen and visit entry for once destroyed editor", function() {
            runCommand('cursor-history:prev', function() {
              return isEntry(3);
            });
            runCommand('cursor-history:prev', function() {
              return isEntry(2);
            });
            runCommand('cursor-history:prev', function() {
              return isEntry(1);
            });
            runCommand('cursor-history:prev', function() {
              return isEntry(0);
            });
            runCommand('cursor-history:next', function() {
              return isEntry(1);
            });
            runCommand('cursor-history:next', function() {
              return isEntry(2);
            });
            return runCommand('cursor-history:next', function() {
              return isEntry(3);
            });
          });
          return describe("excludeClosedBuffer setting is true", function() {
            beforeEach(function() {
              return atom.config.set('cursor-history.excludeClosedBuffer', true);
            });
            it("skip entry for destroyed editor", function() {
              expect(getValidEntries()).toHaveLength(2);
              runCommand('cursor-history:prev', function() {
                return isEntry(1);
              });
              return runs(function() {
                expect(getEntries()).toHaveLength(5);
                return expect(getValidEntries()).toHaveLength(3);
              });
            });
            return it("remove dstroyed entry from history when new entry is added", function() {
              expect(getValidEntries()).toHaveLength(2);
              expect(getEntries()).toHaveLength(4);
              dispatchCommand(editorElement, 'test:move-down-5');
              expect(editor.getCursorBufferPosition()).toEqual([15, 0]);
              expect(getEntries('last')).toBeEqualEntry({
                point: [10, 0],
                URI: pathSample1
              });
              expect(getValidEntries()).toHaveLength(3);
              return expect(getEntries()).toHaveLength(3);
            });
          });
        });
      });
      return describe("ignoreCommands setting", function() {
        var editor2, editorElement2, _ref1;
        _ref1 = [], editor2 = _ref1[0], editorElement2 = _ref1[1];
        beforeEach(function() {
          editor.setCursorBufferPosition([1, 2]);
          expect(getEntries()).toHaveLength(0);
          expect(editorElement.hasFocus()).toBe(true);
          return atom.commands.add(editorElement, {
            'test:open-sample2': function() {
              return atom.workspace.open(pathSample2).then(function(e) {
                editor2 = e;
                return editorElement2 = atom.views.getView(e);
              });
            }
          });
        });
        describe("ignoreCommands is empty", function() {
          return it("save cursor position to history when editor lost focus", function() {
            atom.config.set('cursor-history.ignoreCommands', []);
            runs(function() {
              return atom.commands.dispatch(editorElement, 'test:open-sample2');
            });
            spyOn(main, "checkLocationChange").andCallThrough();
            waitsFor(function() {
              return main.checkLocationChange.callCount === 1;
            });
            jasmine.useRealClock();
            waitsFor(function() {
              return editorElement2.hasFocus() === true;
            });
            return runs(function() {
              expect(getEntries()).toHaveLength(1);
              return expect(getEntries('last')).toBeEqualEntry({
                point: [1, 2],
                URI: pathSample1
              });
            });
          });
        });
        return describe("ignoreCommands is set and match command name", function() {
          return it("won't save cursor position to history when editor lost focus", function() {
            atom.config.set('cursor-history.ignoreCommands', ["test:open-sample2"]);
            spyOn(main, "getLocation").andCallThrough();
            runs(function() {
              return atom.commands.dispatch(editorElement, 'test:open-sample2');
            });
            waitsFor(function() {
              return (editorElement2 != null ? editorElement2.hasFocus() : void 0) === true;
            });
            return runs(function() {
              return expect(main.getLocation.callCount).toBe(0);
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L3NwZWMvY3Vyc29yLWhpc3Rvcnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksU0FBQSxHQUFBO1dBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBRFU7RUFBQSxDQUhaLENBQUE7O0FBQUEsRUFNQSxlQUFBLEdBQWtCLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTtBQUNoQixJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixPQUF2QixFQUFnQyxPQUFoQyxDQUFBLENBQUE7V0FDQSxZQUFBLENBQWEsR0FBYixFQUZnQjtFQUFBLENBTmxCLENBQUE7O0FBQUEsRUFVQSxpQkFBQSxHQUFvQixTQUFDLElBQUQsR0FBQTtXQUNsQixJQUFJLENBQUMsV0FBTCxDQUNFO0FBQUEsTUFBQSxjQUFBLEVBQWdCLFNBQUMsUUFBRCxHQUFBO2VBQ2QsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsS0FBZSxRQUFRLENBQUMsR0FBekIsQ0FBQSxJQUFrQyxDQUFDLEtBQUssQ0FBQyxVQUFOLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBekIsQ0FBK0IsQ0FBQyxPQUFoQyxDQUF3QyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFRLENBQUMsS0FBMUIsQ0FBeEMsQ0FBRCxFQURwQjtNQUFBLENBQWhCO0tBREYsRUFEa0I7RUFBQSxDQVZwQixDQUFBOztBQUFBLEVBZUEsUUFBQSxDQUFTLGdC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

//# sourceURL=/home/sargon/.atom/packages/cursor-history/spec/cursor-history-spec.coffee
