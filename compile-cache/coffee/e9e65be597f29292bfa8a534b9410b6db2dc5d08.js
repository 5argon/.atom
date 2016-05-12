(function() {
  var CompositeDisposable, DiffViewEditor, Directory, File, LoadingView, SplitDiff, SyncScroll, configSchema, path, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Directory = _ref.Directory, File = _ref.File;

  DiffViewEditor = require('./build-lines');

  LoadingView = require('./loading-view');

  SyncScroll = require('./sync-scroll');

  configSchema = require("./config-schema");

  path = require('path');

  module.exports = SplitDiff = {
    config: configSchema,
    subscriptions: null,
    diffViewEditor1: null,
    diffViewEditor2: null,
    editorSubscriptions: null,
    isWhitespaceIgnored: false,
    isWordDiffEnabled: true,
    linkedDiffChunks: null,
    diffChunkPointer: 0,
    isFirstChunkSelect: true,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    isEnabled: false,
    wasEditor1Created: false,
    wasEditor2Created: false,
    hasGitRepo: false,
    process: null,
    loadingView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'split-diff:enable': (function(_this) {
          return function() {
            return _this.diffPanes();
          };
        })(this),
        'split-diff:next-diff': (function(_this) {
          return function() {
            return _this.nextDiff();
          };
        })(this),
        'split-diff:prev-diff': (function(_this) {
          return function() {
            return _this.prevDiff();
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:ignore-whitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this),
        'split-diff:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable(false);
      return this.subscriptions.dispose();
    },
    toggle: function() {
      if (this.isEnabled) {
        return this.disable(true);
      } else {
        return this.diffPanes();
      }
    },
    disable: function(displayMsg) {
      this.isEnabled = false;
      if (this.editorSubscriptions != null) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (this.diffViewEditor1 != null) {
        if (this.wasEditor1SoftWrapped) {
          this.diffViewEditor1.enableSoftWrap();
        }
        if (this.wasEditor1Created) {
          this.diffViewEditor1.cleanUp();
        }
      }
      if (this.diffViewEditor2 != null) {
        if (this.wasEditor2SoftWrapped) {
          this.diffViewEditor2.enableSoftWrap();
        }
        if (this.wasEditor2Created) {
          this.diffViewEditor2.cleanUp();
        }
      }
      this._clearDiff();
      this.diffChunkPointer = 0;
      this.isFirstChunkSelect = true;
      this.wasEditor1SoftWrapped = false;
      this.wasEditor1Created = false;
      this.wasEditor2SoftWrapped = false;
      this.wasEditor2Created = false;
      this.hasGitRepo = false;
      if (displayMsg) {
        return atom.notifications.addInfo('Split Diff Disabled', {
          dismissable: false
        });
      }
    },
    toggleIgnoreWhitespace: function() {
      this._setConfig('ignoreWhitespace', !this.isWhitespaceIgnored);
      return this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
    },
    nextDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer++;
        if (this.diffChunkPointer >= this.linkedDiffChunks.length) {
          this.diffChunkPointer = 0;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    prevDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer--;
        if (this.diffChunkPointer < 0) {
          this.diffChunkPointer = this.linkedDiffChunks.length - 1;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    diffPanes: function() {
      var detailMsg, editors;
      this.disable(false);
      editors = this._getVisibleEditors();
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff', (function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      if (!this.hasGitRepo) {
        this.updateDiff(editors);
      }
      this.editorSubscriptions.add(atom.menu.add([
        {
          'label': 'Packages',
          'submenu': [
            {
              'label': 'Split Diff',
              'submenu': [
                {
                  'label': 'Ignore Whitespace',
                  'command': 'split-diff:ignore-whitespace'
                }, {
                  'label': 'Move to Next Diff',
                  'command': 'split-diff:next-diff'
                }, {
                  'label': 'Move to Previous Diff',
                  'command': 'split-diff:prev-diff'
                }
              ]
            }
          ]
        }
      ]));
      this.editorSubscriptions.add(atom.contextMenu.add({
        'atom-text-editor': [
          {
            'label': 'Split Diff',
            'submenu': [
              {
                'label': 'Ignore Whitespace',
                'command': 'split-diff:ignore-whitespace'
              }, {
                'label': 'Move to Next Diff',
                'command': 'split-diff:next-diff'
              }, {
                'label': 'Move to Previous Diff',
                'command': 'split-diff:prev-diff'
              }
            ]
          }
        ]
      }));
      detailMsg = 'Ignore Whitespace: ' + this.isWhitespaceIgnored;
      detailMsg += '\nShow Word Diff: ' + this.isWordDiffEnabled;
      detailMsg += '\nSync Horizontal Scroll: ' + this._getConfig('syncHorizontalScroll');
      return atom.notifications.addInfo('Split Diff Enabled', {
        detail: detailMsg,
        dismissable: false
      });
    },
    updateDiff: function(editors) {
      var BufferedNodeProcess, args, command, computedDiff, editorPaths, exit, loadingView, stderr, stdout, theOutput;
      this.isEnabled = true;
      if (this.process != null) {
        this.process.kill();
        this.process = null;
      }
      loadingView = new LoadingView();
      loadingView.createModal();
      this.loadingView = loadingView;
      setTimeout(function() {
        if (loadingView != null) {
          return loadingView.show();
        }
      }, 1000);
      this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      editorPaths = this._createTempFiles(editors);
      BufferedNodeProcess = require('atom').BufferedNodeProcess;
      command = path.resolve(__dirname, "./compute-diff.js");
      args = [editorPaths.editor1Path, editorPaths.editor2Path, this.isWhitespaceIgnored];
      computedDiff = '';
      theOutput = '';
      stdout = (function(_this) {
        return function(output) {
          theOutput = output;
          return computedDiff = JSON.parse(output);
        };
      })(this);
      stderr = (function(_this) {
        return function(err) {
          return theOutput = err;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          if (loadingView != null) {
            loadingView.destroy();
          }
          if (code === 0) {
            return _this._resumeUpdateDiff(editors, computedDiff);
          } else {
            console.log('BufferedNodeProcess code was ' + code);
            return console.log(theOutput);
          }
        };
      })(this);
      return this.process = new BufferedNodeProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    _resumeUpdateDiff: function(editors, computedDiff) {
      var syncHorizontalScroll;
      this.linkedDiffChunks = this._evaluateDiffOrder(computedDiff.chunks);
      this._clearDiff();
      this._displayDiff(editors, computedDiff);
      this.isWordDiffEnabled = this._getConfig('diffWords');
      if (this.isWordDiffEnabled) {
        this._highlightWordDiff(this.linkedDiffChunks);
      }
      syncHorizontalScroll = this._getConfig('syncHorizontalScroll');
      this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, syncHorizontalScroll);
      return this.syncScroll.syncPositions();
    },
    _getVisibleEditors: function() {
      var activeItem, editor1, editor2, editors, leftPane, p, panes, rightPane, _i, _len;
      editor1 = null;
      editor2 = null;
      panes = atom.workspace.getPanes();
      for (_i = 0, _len = panes.length; _i < _len; _i++) {
        p = panes[_i];
        activeItem = p.getActiveItem();
        if (atom.workspace.isTextEditor(activeItem)) {
          if (editor1 === null) {
            editor1 = activeItem;
          } else if (editor2 === null) {
            editor2 = activeItem;
            break;
          }
        }
      }
      if (editor1 === null) {
        editor1 = atom.workspace.buildTextEditor();
        this.wasEditor1Created = true;
        leftPane = atom.workspace.getActivePane();
        leftPane.addItem(editor1);
      }
      if (editor2 === null) {
        editor2 = atom.workspace.buildTextEditor();
        this.wasEditor2Created = true;
        editor2.setGrammar(editor1.getGrammar());
        rightPane = atom.workspace.getActivePane().splitRight();
        rightPane.addItem(editor2);
      }
      this._setupGitRepo(editor1, editor2);
      editor1.unfoldAll();
      editor2.unfoldAll();
      if (editor1.isSoftWrapped()) {
        this.wasEditor1SoftWrapped = true;
        editor1.setSoftWrapped(false);
      }
      if (editor2.isSoftWrapped()) {
        this.wasEditor2SoftWrapped = true;
        editor2.setSoftWrapped(false);
      }
      if (this.wasEditor2Created) {
        atom.views.getView(editor1).focus();
      }
      editors = {
        editor1: editor1,
        editor2: editor2
      };
      return editors;
    },
    _setupGitRepo: function(editor1, editor2) {
      var directory, editor1Path, gitHeadText, i, projectRepo, relativeEditor1Path, _i, _len, _ref1, _results;
      editor1Path = editor1.getPath();
      if ((editor1Path != null) && (editor2.getLineCount() === 1 && editor2.lineTextForBufferRow(0) === '')) {
        _ref1 = atom.project.getDirectories();
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          directory = _ref1[i];
          if (editor1Path === directory.getPath() || directory.contains(editor1Path)) {
            projectRepo = atom.project.getRepositories()[i];
            if (projectRepo != null) {
              relativeEditor1Path = projectRepo.relativize(editor1Path);
              gitHeadText = projectRepo.repo.getHeadBlob(relativeEditor1Path);
              if (gitHeadText != null) {
                editor2.setText(gitHeadText);
                this.hasGitRepo = true;
                break;
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    _createTempFiles: function(editors) {
      var editor1Path, editor1TempFile, editor2Path, editor2TempFile, editorPaths, tempFolderPath;
      editor1Path = '';
      editor2Path = '';
      tempFolderPath = atom.getConfigDirPath() + '/split-diff';
      editor1Path = tempFolderPath + '/split-diff 1';
      editor1TempFile = new File(editor1Path);
      editor1TempFile.writeSync(editors.editor1.getText());
      editor2Path = tempFolderPath + '/split-diff 2';
      editor2TempFile = new File(editor2Path);
      editor2TempFile.writeSync(editors.editor2.getText());
      editorPaths = {
        editor1Path: editor1Path,
        editor2Path: editor2Path
      };
      return editorPaths;
    },
    _selectDiffs: function(diffChunk) {
      if ((diffChunk != null) && (this.diffViewEditor1 != null) && (this.diffViewEditor2 != null)) {
        this.diffViewEditor1.deselectAllLines();
        this.diffViewEditor2.deselectAllLines();
        if (diffChunk.oldLineStart != null) {
          this.diffViewEditor1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
          this.diffViewEditor2.scrollToLine(diffChunk.oldLineStart);
        }
        if (diffChunk.newLineStart != null) {
          this.diffViewEditor2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
          return this.diffViewEditor2.scrollToLine(diffChunk.newLineStart);
        }
      }
    },
    _clearDiff: function() {
      if (this.loadingView != null) {
        this.loadingView.destroy();
        this.loadingView = null;
      }
      if (this.diffViewEditor1 != null) {
        this.diffViewEditor1.destroyMarkers();
        this.diffViewEditor1 = null;
      }
      if (this.diffViewEditor2 != null) {
        this.diffViewEditor2.destroyMarkers();
        this.diffViewEditor2 = null;
      }
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        return this.syncScroll = null;
      }
    },
    _displayDiff: function(editors, computedDiff) {
      var leftColor, rightColor;
      this.diffViewEditor1 = new DiffViewEditor(editors.editor1);
      this.diffViewEditor2 = new DiffViewEditor(editors.editor2);
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      if (leftColor === 'green') {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'added');
      } else {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'removed');
      }
      if (rightColor === 'green') {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'added');
      } else {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'removed');
      }
      this.diffViewEditor1.setLineOffsets(computedDiff.oldLineOffsets);
      return this.diffViewEditor2.setLineOffsets(computedDiff.newLineOffsets);
    },
    _evaluateDiffOrder: function(chunks) {
      var c, diffChunk, diffChunks, newLineNumber, oldLineNumber, prevChunk, _i, _len;
      oldLineNumber = 0;
      newLineNumber = 0;
      prevChunk = null;
      diffChunks = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if (c.added != null) {
          if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber + c.count,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          newLineNumber += c.count;
        } else if (c.removed != null) {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber + c.count
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          oldLineNumber += c.count;
        } else {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber
            };
            diffChunks.push(diffChunk);
          } else if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          }
          prevChunk = null;
          oldLineNumber += c.count;
          newLineNumber += c.count;
        }
      }
      if ((prevChunk != null) && (prevChunk.added != null)) {
        diffChunk = {
          newLineStart: newLineNumber - prevChunk.count,
          newLineEnd: newLineNumber
        };
        diffChunks.push(diffChunk);
      } else if ((prevChunk != null) && (prevChunk.removed != null)) {
        diffChunk = {
          oldLineStart: oldLineNumber - prevChunk.count,
          oldLineEnd: oldLineNumber
        };
        diffChunks.push(diffChunk);
      }
      return diffChunks;
    },
    _highlightWordDiff: function(chunks) {
      var ComputeWordDiff, c, excessLines, i, j, leftColor, lineRange, rightColor, wordDiff, _i, _j, _len, _results;
      ComputeWordDiff = require('./compute-word-diff');
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      _results = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if ((c.newLineStart != null) && (c.oldLineStart != null)) {
          lineRange = 0;
          excessLines = 0;
          if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
            lineRange = c.newLineEnd - c.newLineStart;
            excessLines = (c.oldLineEnd - c.oldLineStart) - lineRange;
          } else {
            lineRange = c.oldLineEnd - c.oldLineStart;
            excessLines = (c.newLineEnd - c.newLineStart) - lineRange;
          }
          for (i = _j = 0; _j < lineRange; i = _j += 1) {
            wordDiff = ComputeWordDiff.computeWordDiff(this.diffViewEditor1.getLineText(c.oldLineStart + i), this.diffViewEditor2.getLineText(c.newLineStart + i), this.isWhitespaceIgnored);
            if (leftColor === 'green') {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'removed', this.isWhitespaceIgnored);
            }
            if (rightColor === 'green') {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'removed', this.isWhitespaceIgnored);
            }
          }
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (j = _k = 0; _k < excessLines; j = _k += 1) {
              if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
                if (leftColor === 'green') {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getLineText(c.oldLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getLineText(c.oldLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else if ((c.newLineEnd - c.newLineStart) > (c.oldLineEnd - c.oldLineStart)) {
                if (rightColor === 'green') {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getLineText(c.newLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getLineText(c.newLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else if (c.newLineStart != null) {
          lineRange = c.newLineEnd - c.newLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (rightColor === 'green') {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getLineText(c.newLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getLineText(c.newLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else if (c.oldLineStart != null) {
          lineRange = c.oldLineEnd - c.oldLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (leftColor === 'green') {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getLineText(c.oldLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getLineText(c.oldLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    _setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL3NwbGl0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixpQkFBQSxTQUF0QixFQUFpQyxZQUFBLElBQWpDLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxlQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUxQLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFBUSxZQUFSO0FBQUEsSUFDQSxhQUFBLEVBQWUsSUFEZjtBQUFBLElBRUEsZUFBQSxFQUFpQixJQUZqQjtBQUFBLElBR0EsZUFBQSxFQUFpQixJQUhqQjtBQUFBLElBSUEsbUJBQUEsRUFBcUIsSUFKckI7QUFBQSxJQUtBLG1CQUFBLEVBQXFCLEtBTHJCO0FBQUEsSUFNQSxpQkFBQSxFQUFtQixJQU5uQjtBQUFBLElBT0EsZ0JBQUEsRUFBa0IsSUFQbEI7QUFBQSxJQVFBLGdCQUFBLEVBQWtCLENBUmxCO0FBQUEsSUFTQSxrQkFBQSxFQUFvQixJQVRwQjtBQUFBLElBVUEscUJBQUEsRUFBdUIsS0FWdkI7QUFBQSxJQVdB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

//# sourceURL=/home/sargon/.atom/packages/git-time-machine/node_modules/split-diff/lib/split-diff.coffee
