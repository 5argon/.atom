(function() {
  var CompositeDisposable, RegexList, SymbolsListView;

  SymbolsListView = require('./symbols-list-view');

  RegexList = require('./symbols-list-regex');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      startUp: {
        type: 'boolean',
        "default": true,
        description: 'Set panel visibility at startup.'
      }
    },
    SymbolsListView: null,
    panel: null,
    subscriptions: null,
    editor: null,
    code: null,
    init: function(service) {},
    activate: function(state) {
      var SymbolsList;
      this.SymbolsListView = new SymbolsListView(state.SymbolsListViewState);
      this.SymbolsListView.callOnConfirm = this.moveToRange;
      SymbolsList = this;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'symbols-list:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.reloadSymbols();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.onDidSave(function() {
            return SymbolsList.reloadSymbols();
          });
        };
      })(this)));
      return this.panel = atom.workspace.addRightPanel({
        item: this.SymbolsListView.element,
        visible: atom.config.get('symbols-list.startUp'),
        priority: 0
      });
    },
    reloadSymbols: function() {
      var SymbolsList, parent, scopeArray, scopeName;
      console.log(this.editor, atom.workspace);
      this.editor = atom.workspace.getActiveTextEditor();
      parent = this.SymbolsListView;
      this.SymbolsListView.cleanItems();
      this.SymbolsListView.setError();
      if ((this.editor != null) && (this.editor.getGrammar() != null)) {
        scopeName = this.editor.getGrammar().scopeName;
        if (scopeName != null) {
          console.log('Scope:', scopeName);
          scopeArray = scopeName.split('.');
          SymbolsList = this;
          this.SymbolsListView.setLoading('Loading…');
          return setTimeout(function() {
            SymbolsList.SymbolsListView.cleanItems();
            SymbolsList.recursiveScanRegex(scopeArray, RegexList);
            SymbolsList.SymbolsListView.sortItems();
            return SymbolsList.SymbolsListView.loadingArea.hide();
          }, 0);
        }
      }
    },
    recursiveScanRegex: function(scopeArray, regexGroup) {
      var key, regex, type, val;
      for (key in regexGroup) {
        val = regexGroup[key];
        if (key === 'regex') {
          for (type in val) {
            regex = val[type];
            if (this.editor == null) {
              return;
            }
            this.editor.scan(regex, (function(_this) {
              return function(obj) {
                return _this.SymbolsListView.addItem({
                  type: type,
                  label: obj.match[1],
                  objet: obj.match,
                  range: obj.range
                });
              };
            })(this));
          }
        } else if (key === scopeArray[0]) {
          this.recursiveScanRegex(scopeArray.slice(1), val);
        }
      }
    },
    moveToRange: function(range) {
      this.editor = atom.workspace.getActiveTextEditor();
      this.editor.setCursorBufferPosition(range.start);
      return this.editor.scrollToCursorPosition({
        center: false
      });
    },
    deactivate: function() {
      this.panel.destroy();
      this.subscriptions.dispose();
      return this.SymbolsListView.destroy();
    },
    serialize: function() {
      return {
        SymbolsListViewState: this.SymbolsListView.serialize()
      };
    },
    toggle: function() {
      if (this.panel.isVisible()) {
        return this.panel.hide();
      } else {
        return this.panel.show();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtbGlzdC9saWIvc3ltYm9scy1saXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLHNCQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsTUFBQSxFQUNJO0FBQUEsTUFBQSxPQUFBLEVBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BREo7S0FESjtBQUFBLElBTUEsZUFBQSxFQUFpQixJQU5qQjtBQUFBLElBT0EsS0FBQSxFQUFPLElBUFA7QUFBQSxJQVFBLGFBQUEsRUFBZSxJQVJmO0FBQUEsSUFTQSxNQUFBLEVBQVEsSUFUUjtBQUFBLElBVUEsSUFBQSxFQUFNLElBVk47QUFBQSxJQVlBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQSxDQVpOO0FBQUEsSUFlQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDTixVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsZUFBQSxDQUFnQixLQUFLLENBQUMsb0JBQXRCLENBQXZCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsYUFBakIsR0FBaUMsSUFBQyxDQUFBLFdBRGxDLENBQUE7QUFBQSxNQUVBLFdBQUEsR0FBYyxJQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FB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

//# sourceURL=/home/sargon/.atom/packages/symbols-list/lib/symbols-list.coffee
