(function() {
  var CompositeDisposable, Disposable, Emitter, Flasher, History, ignoreCommands, path, settings, _, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  History = null;

  Flasher = null;

  settings = require('./settings');

  ignoreCommands = ['cursor-history:next', 'cursor-history:prev', 'cursor-history:next-within-editor', 'cursor-history:prev-within-editor', 'cursor-history:clear'];

  module.exports = {
    config: settings.config,
    history: null,
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      History = require('./history');
      Flasher = require('./flasher');
      this.history = new History;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cursor-history:next': (function(_this) {
          return function() {
            return _this.jump('next');
          };
        })(this),
        'cursor-history:prev': (function(_this) {
          return function() {
            return _this.jump('prev');
          };
        })(this),
        'cursor-history:next-within-editor': (function(_this) {
          return function() {
            return _this.jump('next', {
              withinEditor: true
            });
          };
        })(this),
        'cursor-history:prev-within-editor': (function(_this) {
          return function() {
            return _this.jump('prev', {
              withinEditor: true
            });
          };
        })(this),
        'cursor-history:clear': (function(_this) {
          return function() {
            return _this.history.clear();
          };
        })(this),
        'cursor-history:toggle-debug': function() {
          return settings.toggle('debug', {
            log: true
          });
        }
      }));
      this.observeMouse();
      this.observeCommands();
      return this.onDidChangeLocation((function(_this) {
        return function(_arg) {
          var newLocation, oldLocation;
          oldLocation = _arg.oldLocation, newLocation = _arg.newLocation;
          if (_this.needRemember(oldLocation.point, newLocation.point)) {
            return _this.saveHistory(oldLocation, {
              subject: "Cursor moved"
            });
          }
        };
      })(this));
    },
    onDidChangeLocation: function(fn) {
      return this.emitter.on('did-change-location', fn);
    },
    deactivate: function() {
      var _ref1;
      this.subscriptions.dispose();
      this.subscriptions = null;
      if ((_ref1 = this.history) != null) {
        _ref1.destroy();
      }
      return this.history = null;
    },
    needRemember: function(oldPoint, newPoint) {
      return Math.abs(oldPoint.row - newPoint.row) > settings.get('rowDeltaToRemember');
    },
    saveHistory: function(location, _arg) {
      var setIndexToHead, subject, _ref1;
      _ref1 = _arg != null ? _arg : {}, subject = _ref1.subject, setIndexToHead = _ref1.setIndexToHead;
      this.history.add(location, {
        setIndexToHead: setIndexToHead
      });
      if (settings.get('debug')) {
        return this.logHistory("" + subject + " [" + location.type + "]");
      }
    },
    observeMouse: function() {
      var handleBubble, handleCapture, locationStack, workspaceElement;
      locationStack = [];
      handleCapture = (function(_this) {
        return function(_arg) {
          var editor, target, _ref1;
          target = _arg.target;
          if ((typeof target.getModel === "function" ? (_ref1 = target.getModel()) != null ? typeof _ref1.getURI === "function" ? _ref1.getURI() : void 0 : void 0 : void 0) == null) {
            return;
          }
          if (!(editor = atom.workspace.getActiveTextEditor())) {
            return;
          }
          return locationStack.push(_this.getLocation('mousedown', editor));
        };
      })(this);
      handleBubble = (function(_this) {
        return function(_arg) {
          var target, _ref1;
          target = _arg.target;
          if ((typeof target.getModel === "function" ? (_ref1 = target.getModel()) != null ? typeof _ref1.getURI === "function" ? _ref1.getURI() : void 0 : void 0 : void 0) == null) {
            return;
          }
          return setTimeout(function() {
            if (locationStack.length) {
              return _this.checkLocationChange(locationStack.pop());
            }
          }, 100);
        };
      })(this);
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.addEventListener('mousedown', handleCapture, true);
      workspaceElement.addEventListener('mousedown', handleBubble, false);
      return this.subscriptions.add(new Disposable(function() {
        workspaceElement.removeEventListener('mousedown', handleCapture, true);
        return workspaceElement.removeEventListener('mousedown', handleBubble, false);
      }));
    },
    isIgnoreCommands: function(command) {
      return (__indexOf.call(ignoreCommands, command) >= 0) || (__indexOf.call(settings.get('ignoreCommands'), command) >= 0);
    },
    observeCommands: function() {
      var locationStack, saveLocation, shouldSaveLocation;
      shouldSaveLocation = function(type, target) {
        var _ref1;
        return (__indexOf.call(type, ':') >= 0) && ((typeof target.getModel === "function" ? (_ref1 = target.getModel()) != null ? typeof _ref1.getURI === "function" ? _ref1.getURI() : void 0 : void 0 : void 0) != null);
      };
      locationStack = [];
      saveLocation = _.debounce((function(_this) {
        return function(type, target) {
          if (!shouldSaveLocation(type, target)) {
            return;
          }
          return locationStack.push(_this.getLocation(type, target.getModel()));
        };
      })(this), 100, true);
      this.subscriptions.add(atom.commands.onWillDispatch((function(_this) {
        return function(_arg) {
          var target, type;
          type = _arg.type, target = _arg.target;
          if (_this.isIgnoreCommands(type)) {
            return;
          }
          return saveLocation(type, target);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.onDidDispatch((function(_this) {
        return function(_arg) {
          var target, type;
          type = _arg.type, target = _arg.target;
          if (_this.isIgnoreCommands(type)) {
            return;
          }
          if (locationStack.length === 0) {
            return;
          }
          if (!shouldSaveLocation(type, target)) {
            return;
          }
          return setTimeout(function() {
            if (locationStack.length) {
              return _this.checkLocationChange(locationStack.pop());
            }
          }, 100);
        };
      })(this)));
    },
    checkLocationChange: function(oldLocation) {
      var editor, editorElement, newLocation;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      editorElement = atom.views.getView(editor);
      if (editorElement.hasFocus() && (editor.getURI() === oldLocation.URI)) {
        newLocation = this.getLocation(oldLocation.type, editor);
        return this.emitter.emit('did-change-location', {
          oldLocation: oldLocation,
          newLocation: newLocation
        });
      } else {
        return this.saveHistory(oldLocation, {
          subject: "Save on focus lost"
        });
      }
    },
    jump: function(direction, _arg) {
      var URI, editor, entry, forURI, needToSave, options, point, searchAllPanes, withinEditor;
      withinEditor = (_arg != null ? _arg : {}).withinEditor;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      needToSave = (direction === 'prev') && this.history.isIndexAtHead();
      forURI = withinEditor ? editor.getURI() : null;
      if (!(entry = this.history.get(direction, {
        URI: forURI
      }))) {
        return;
      }
      point = entry.point, URI = entry.URI;
      if (needToSave) {
        this.saveHistory(this.getLocation('prev', editor), {
          setIndexToHead: false,
          subject: "Save head position"
        });
      }
      options = {
        point: point,
        direction: direction,
        log: !needToSave
      };
      if (editor.getURI() === URI) {
        return this.land(editor, options);
      } else {
        searchAllPanes = settings.get('searchAllPanes');
        return atom.workspace.open(URI, {
          searchAllPanes: searchAllPanes
        }).then((function(_this) {
          return function(editor) {
            return _this.land(editor, options);
          };
        })(this));
      }
    },
    land: function(editor, _arg) {
      var direction, log, point;
      point = _arg.point, direction = _arg.direction, log = _arg.log;
      editor.setCursorBufferPosition(point);
      editor.scrollToCursorPosition({
        center: true
      });
      if (settings.get('flashOnLand')) {
        Flasher.flash();
      }
      if (settings.get('debug') && log) {
        return this.logHistory(direction);
      }
    },
    getLocation: function(type, editor) {
      return {
        type: type,
        editor: editor,
        point: editor.getCursorBufferPosition(),
        URI: editor.getURI()
      };
    },
    logHistory: function(msg) {
      var s;
      s = "# cursor-history: " + msg + "\n" + (this.history.inspect());
      return console.log(s, "\n\n");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxtR0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBNkMsT0FBQSxDQUFRLE1BQVIsQ0FBN0MsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUF0QixFQUFrQyxlQUFBLE9BQWxDLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVcsSUFKWCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFXLElBTFgsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQU5YLENBQUE7O0FBQUEsRUFRQSxjQUFBLEdBQWlCLENBQ2YscUJBRGUsRUFFZixxQkFGZSxFQUdmLG1DQUhlLEVBSWYsbUNBSmUsRUFLZixzQkFMZSxDQVJqQixDQUFBOztBQUFBLEVBZ0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxRQUFRLENBQUMsTUFBakI7QUFBQSxJQUNBLE9BQUEsRUFBUyxJQURUO0FBQUEsSUFFQSxhQUFBLEVBQWUsSUFGZjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVIsQ0FEWCxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVIsQ0FGWCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxH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

//# sourceURL=/home/sargon/.atom/packages/cursor-history/lib/main.coffee
