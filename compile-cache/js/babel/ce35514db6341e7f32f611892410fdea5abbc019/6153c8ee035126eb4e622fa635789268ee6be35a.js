Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

var TargetManager = (function (_EventEmitter) {
  _inherits(TargetManager, _EventEmitter);

  function TargetManager() {
    var _this = this;

    _classCallCheck(this, TargetManager);

    _get(Object.getPrototypeOf(TargetManager.prototype), 'constructor', this).call(this);

    var projectPaths = atom.project.getPaths();

    this.pathTargets = projectPaths.map(function (path) {
      return _this._defaultPathTarget(path);
    });

    atom.project.onDidChangePaths(function (newProjectPaths) {
      var addedPaths = newProjectPaths.filter(function (el) {
        return projectPaths.indexOf(el) === -1;
      });
      var removedPaths = projectPaths.filter(function (el) {
        return newProjectPaths.indexOf(el) === -1;
      });
      addedPaths.forEach(function (path) {
        return _this.pathTargets.push(_this._defaultPathTarget(path));
      });
      _this.pathTargets = _this.pathTargets.filter(function (pt) {
        return -1 === removedPaths.indexOf(pt.path);
      });
      _this.refreshTargets(addedPaths);
      projectPaths = newProjectPaths;
    });

    atom.commands.add('atom-workspace', 'build:refresh-targets', function () {
      return _this.refreshTargets();
    });
    atom.commands.add('atom-workspace', 'build:select-active-target', function () {
      return _this.selectActiveTarget();
    });
  }

  _createClass(TargetManager, [{
    key: '_defaultPathTarget',
    value: function _defaultPathTarget(path) {
      var CompositeDisposable = require('atom').CompositeDisposable;
      return {
        path: path,
        loading: false,
        targets: [],
        instancedTools: [],
        activeTarget: null,
        tools: [],
        subscriptions: new CompositeDisposable()
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.pathTargets.forEach(function (pathTarget) {
        return pathTarget.tools.map(function (tool) {
          tool.removeAllListeners && tool.removeAllListeners('refresh');
          tool.destructor && tool.destructor();
        });
      });
    }
  }, {
    key: 'setTools',
    value: function setTools(tools) {
      this.tools = tools || [];
    }
  }, {
    key: 'refreshTargets',
    value: function refreshTargets(refreshPaths) {
      var _this2 = this;

      refreshPaths = refreshPaths || atom.project.getPaths();

      var pathPromises = refreshPaths.map(function (path) {
        var pathTarget = _this2.pathTargets.find(function (pt) {
          return pt.path === path;
        });
        pathTarget.loading = true;

        pathTarget.instancedTools = pathTarget.instancedTools.map(function (t) {
          return t.removeAllListeners && t.removeAllListeners('refresh');
        }).filter(function () {
          return false;
        }); // Just empty the array

        var settingsPromise = _this2.tools.map(function (Tool) {
          return new Tool(path);
        }).filter(function (tool) {
          return tool.isEligible();
        }).map(function (tool) {
          pathTarget.instancedTools.push(tool);
          require('./google-analytics').sendEvent('build', 'tool eligible', tool.getNiceName());

          tool.on && tool.on('refresh', _this2.refreshTargets.bind(_this2, [path]));
          return Promise.resolve().then(function () {
            return tool.settings();
          })['catch'](function (err) {
            if (err instanceof SyntaxError) {
              atom.notifications.addError('Invalid build file.', {
                detail: 'You have a syntax error in your build file: ' + err.message,
                dismissable: true
              });
            } else {
              atom.notifications.addError('Ooops. Something went wrong.', {
                detail: err.message + (err.stack ? '\n' + err.stack : ''),
                dismissable: true
              });
            }
          });
        });

        var CompositeDisposable = require('atom').CompositeDisposable;
        return Promise.all(settingsPromise).then(function (settings) {
          settings = require('./utils').uniquifySettings([].concat.apply([], settings).filter(Boolean).map(function (setting) {
            return require('./utils').getDefaultSettings(path, setting);
          }));

          if (null === pathTarget.activeTarget || !settings.find(function (s) {
            return s.name === pathTarget.activeTarget;
          })) {
            /* Active target has been removed or not set. Set it to the highest prio target */
            pathTarget.activeTarget = settings[0] ? settings[0].name : undefined;
          }

          // CompositeDisposable cannot be reused, so we must create a new instance on every refresh
          pathTarget.subscriptions.dispose();
          pathTarget.subscriptions = new CompositeDisposable();

          settings.forEach(function (setting, index) {
            if (setting.keymap && !setting.atomCommandName) {
              setting.atomCommandName = 'build:trigger:' + setting.name;
            }

            pathTarget.subscriptions.add(atom.commands.add('atom-workspace', setting.atomCommandName, function (atomCommandName) {
              return _this2.emit('trigger', atomCommandName);
            }));

            if (setting.keymap) {
              require('./google-analytics').sendEvent('keymap', 'registered', setting.keymap);
              var keymapSpec = { 'atom-workspace, atom-text-editor': {} };
              keymapSpec['atom-workspace, atom-text-editor'][setting.keymap] = setting.atomCommandName;
              pathTarget.subscriptions.add(atom.keymaps.add(setting.name, keymapSpec));
            }
          });

          pathTarget.targets = settings;
          pathTarget.loading = false;
        })['catch'](function (err) {
          atom.notifications.addError('Ooops. Something went wrong.', {
            detail: err.message + (err.stack ? '\n' + err.stack : ''),
            dismissable: true
          });
        });
      });

      return Promise.all(pathPromises).then(function (entries) {
        _this2.fillTargets(require('./utils').activePath());
        _this2.emit('refresh-complete');

        if (entries.length === 0) {
          return;
        }

        if (atom.config.get('build.notificationOnRefresh')) {
          var rows = refreshPaths.map(function (path) {
            var pathTarget = _this2.pathTargets.find(function (pt) {
              return pt.path === path;
            });
            if (!pathTarget) {
              return 'Targets ' + path + ' no longer exists. Is build deactivated?';
            }
            return pathTarget.targets.length + ' targets at: ' + path;
          });
          atom.notifications.addInfo('Build targets parsed.', {
            detail: rows.join('\n')
          });
        }
      })['catch'](function (err) {
        atom.notifications.addError('Ooops. Something went wrong.', {
          detail: err.message + (err.stack ? '\n' + err.stack : ''),
          dismissable: true
        });
      });
    }
  }, {
    key: 'fillTargets',
    value: function fillTargets(path) {
      if (!this.targetsView) {
        return;
      }

      var activeTarget = this.getActiveTarget(path);
      activeTarget && this.targetsView.setActiveTarget(activeTarget.name);

      var targetNames = this.getTargets(path).map(function (t) {
        return t.name;
      });
      this.targetsView && this.targetsView.setItems(targetNames);
    }
  }, {
    key: 'selectActiveTarget',
    value: function selectActiveTarget() {
      var _this3 = this;

      if (atom.config.get('build.refreshOnShowTargetList')) {
        this.refreshTargets();
      }

      var path = require('./utils').activePath();
      if (!path) {
        atom.notifications.addWarning('Unable to build.', {
          detail: 'Open file is not part of any open project in Atom'
        });
        return;
      }

      var TargetsView = require('./targets-view');
      this.targetsView = new TargetsView();

      if (this.isLoading(path)) {
        this.targetsView.setLoading('Loading project build targets…');
      } else {
        this.fillTargets(path);
      }

      this.targetsView.awaitSelection().then(function (newTarget) {
        _this3.setActiveTarget(path, newTarget);

        _this3.targetsView = null;
      })['catch'](function (err) {
        _this3.targetsView.setError(err.message);
        _this3.targetsView = null;
      });
    }
  }, {
    key: 'getTargets',
    value: function getTargets(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return [];
      }

      if (pathTarget.targets.length === 0) {
        return this.refreshTargets([pathTarget.path]).then(function () {
          return pathTarget.targets;
        });
      }
      return pathTarget.targets;
    }
  }, {
    key: 'getActiveTarget',
    value: function getActiveTarget(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return null;
      }
      return pathTarget.targets.find(function (target) {
        return target.name === pathTarget.activeTarget;
      });
    }
  }, {
    key: 'setActiveTarget',
    value: function setActiveTarget(path, targetName) {
      this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).activeTarget = targetName;
      this.emit('new-active-target', path, this.getActiveTarget(path));
    }
  }, {
    key: 'isLoading',
    value: function isLoading(path) {
      return this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).loading;
    }
  }]);

  return TargetManager;
})(_events2['default']);

exports['default'] = TargetManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdGFyZ2V0LW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRXlCLFFBQVE7Ozs7QUFGakMsV0FBVyxDQUFDOztJQUlOLGFBQWE7WUFBYixhQUFhOztBQUNOLFdBRFAsYUFBYSxHQUNIOzs7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVQOztBQUVSLFFBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRTNDLFFBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7YUFBSSxNQUFLLGtCQUFrQixDQUFDLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQzs7QUFFM0UsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFBLGVBQWUsRUFBSTtBQUMvQyxVQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTtlQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ2pGLFVBQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFO2VBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDbkYsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2VBQUksTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQUssa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDakYsWUFBSyxXQUFXLEdBQUcsTUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRTtlQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUks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QyxJQUFJLENBQUMsVUFBQSxFQUFFO2VBQUksRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJO09BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztLQUM5RDs7O1NBNU5HLGFBQWE7OztxQkErTkosYUFBYSIsImZpbGUiOiIvaG9tZS9zYXJnb24vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3RhcmdldC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcblxuY2xhc3MgVGFyZ2V0TWFuYWdlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG5cbiAgICB0aGlzLnBhdGhUYXJnZXRzID0gcHJvamVjdFBhdGhzLm1hcChwYXRoID0+IHRoaXMuX2RlZmF1bHRQYXRoVGFyZ2V0KHBhdGgpKTtcblxuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKG5ld1Byb2plY3RQYXRocyA9PiB7XG4gICAgICBjb25zdCBhZGRlZFBhdGhzID0gbmV3UHJvamVjdFBhdGhzLmZpbHRlcihlbCA9PiBwcm9qZWN0UGF0aHMuaW5kZXhPZihlbCkgPT09IC0xKTtcbiAgICAgIGNvbnN0IHJlbW92ZWRQYXRocyA9IHByb2plY3RQYXRocy5maWx0ZXIoZWwgPT4gbmV3UHJvamVjdFBhdGhzLmluZGV4T2YoZWwpID09PSAtMSk7XG4gICAgICBhZGRlZFBhdGhzLmZvckVhY2gocGF0aCA9PiB0aGlzLnBhdGhUYXJnZXRzLnB1c2godGhpcy5fZGVmYXVsdFBhdGhUYXJnZXQocGF0aCkpKTtcbiAgICAgIHRoaXMucGF0aFRhcmdldHMgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbHRlcihwdCA9PiAtMSA9PT0gcmVtb3ZlZFBhdGhzLmluZGV4T2YocHQucGF0aCkpO1xuICAgICAgdGhpcy5yZWZyZXNoVGFyZ2V0cyhhZGRlZFBhdGhzKTtcbiAgICAgIHByb2plY3RQYXRocyA9IG5ld1Byb2plY3RQYXRocztcbiAgICB9KTtcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpyZWZyZXNoLXRhcmdldHMnLCAoKSA9PiB0aGlzLnJlZnJlc2hUYXJnZXRzKCkpO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpzZWxlY3QtYWN0aXZlLXRhcmdldCcsICgpID0+IHRoaXMuc2VsZWN0QWN0aXZlVGFyZ2V0KCkpO1xuICB9XG5cbiAgX2RlZmF1bHRQYXRoVGFyZ2V0KHBhdGgpIHtcbiAgICBjb25zdCBDb21wb3NpdGVEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIHRhcmdldHM6IFtdLFxuICAgICAgaW5zdGFuY2VkVG9vbHM6IFtdLFxuICAgICAgYWN0aXZlVGFyZ2V0OiBudWxsLFxuICAgICAgdG9vbHM6IFtdLFxuICAgICAgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIH07XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMucGF0aFRhcmdldHMuZm9yRWFjaChwYXRoVGFyZ2V0ID0+IHBhdGhUYXJnZXQudG9vbHMubWFwKHRvb2wgPT4ge1xuICAgICAgdG9vbC5yZW1vdmVBbGxMaXN0ZW5lcnMgJiYgdG9vbC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlZnJlc2gnKTtcbiAgICAgIHRvb2wuZGVzdHJ1Y3RvciAmJiB0b29sLmRlc3RydWN0b3IoKTtcbiAgICB9KSk7XG4gIH1cblxuICBzZXRUb29scyh0b29scykge1xuICAgIHRoaXMudG9vbHMgPSB0b29scyB8fCBbXTtcbiAgfVxuXG4gIHJlZnJlc2hUYXJnZXRzKHJlZnJlc2hQYXRocykge1xuICAgIHJlZnJlc2hQYXRocyA9IHJlZnJlc2hQYXRocyB8fCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcblxuICAgIGNvbnN0IHBhdGhQcm9taXNlcyA9IHJlZnJlc2hQYXRocy5tYXAoKHBhdGgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGhUYXJnZXQgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCk7XG4gICAgICBwYXRoVGFyZ2V0LmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICBwYXRoVGFyZ2V0Lmluc3RhbmNlZFRvb2xzID0gcGF0aFRhcmdldC5pbnN0YW5jZWRUb29sc1xuICAgICAgICAubWFwKHQgPT4gdC5yZW1vdmVBbGxMaXN0ZW5lcnMgJiYgdC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlZnJlc2gnKSlcbiAgICAgICAgLmZpbHRlcigoKSA9PiBmYWxzZSk7IC8vIEp1c3QgZW1wdHkgdGhlIGFycmF5XG5cbiAgICAgIGNvbnN0IHNldHRpbmdzUHJvbWlzZSA9IHRoaXMudG9vbHNcbiAgICAgICAgLm1hcChUb29sID0+IG5ldyBUb29sKHBhdGgpKVxuICAgICAgICAuZmlsdGVyKHRvb2wgPT4gdG9vbC5pc0VsaWdpYmxlKCkpXG4gICAgICAgIC5tYXAodG9vbCA9PiB7XG4gICAgICAgICAgcGF0aFRhcmdldC5pbnN0YW5jZWRUb29scy5wdXNoKHRvb2wpO1xuICAgICAgICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgnYnVpbGQnLCAndG9vbCBlbGlnaWJsZScsIHRvb2wuZ2V0TmljZU5hbWUoKSk7XG5cbiAgICAgICAgICB0b29sLm9uICYmIHRvb2wub24oJ3JlZnJlc2gnLCB0aGlzLnJlZnJlc2hUYXJnZXRzLmJpbmQodGhpcywgWyBwYXRoIF0pKTtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRvb2wuc2V0dGluZ3MoKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0ludmFsaWQgYnVpbGQgZmlsZS4nLCB7XG4gICAgICAgICAgICAgICAgICBkZXRhaWw6ICdZb3UgaGF2ZSBhIHN5bnRheCBlcnJvciBpbiB5b3VyIGJ1aWxkIGZpbGU6ICcgKyBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICAgICAgICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZSArIChlcnIuc3RhY2sgPyAnXFxuJyArIGVyci5zdGFjayA6ICcnKSxcbiAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgQ29tcG9zaXRlRGlzcG9zYWJsZSA9IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHNldHRpbmdzUHJvbWlzZSkudGhlbigoc2V0dGluZ3MpID0+IHtcbiAgICAgICAgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3V0aWxzJykudW5pcXVpZnlTZXR0aW5ncyhbXS5jb25jYXQuYXBwbHkoW10sIHNldHRpbmdzKVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAubWFwKHNldHRpbmcgPT4gcmVxdWlyZSgnLi91dGlscycpLmdldERlZmF1bHRTZXR0aW5ncyhwYXRoLCBzZXR0aW5nKSkpO1xuXG4gICAgICAgIGlmIChudWxsID09PSBwYXRoVGFyZ2V0LmFjdGl2ZVRhcmdldCB8fCAhc2V0dGluZ3MuZmluZChzID0+IHMubmFtZSA9PT0gcGF0aFRhcmdldC5hY3RpdmVUYXJnZXQpKSB7XG4gICAgICAgICAgLyogQWN0aXZlIHRhcmdldCBoYXMgYmVlbiByZW1vdmVkIG9yIG5vdCBzZXQuIFNldCBpdCB0byB0aGUgaGlnaGVzdCBwcmlvIHRhcmdldCAqL1xuICAgICAgICAgIHBhdGhUYXJnZXQuYWN0aXZlVGFyZ2V0ID0gc2V0dGluZ3NbMF0gPyBzZXR0aW5nc1swXS5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcG9zaXRlRGlzcG9zYWJsZSBjYW5ub3QgYmUgcmV1c2VkLCBzbyB3ZSBtdXN0IGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvbiBldmVyeSByZWZyZXNoXG4gICAgICAgIHBhdGhUYXJnZXQuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICAgIHBhdGhUYXJnZXQuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAgICAgc2V0dGluZ3MuZm9yRWFjaCgoc2V0dGluZywgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoc2V0dGluZy5rZXltYXAgJiYgIXNldHRpbmcuYXRvbUNvbW1hbmROYW1lKSB7XG4gICAgICAgICAgICBzZXR0aW5nLmF0b21Db21tYW5kTmFtZSA9IGBidWlsZDp0cmlnZ2VyOiR7c2V0dGluZy5uYW1lfWA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCBzZXR0aW5nLmF0b21Db21tYW5kTmFtZSwgYXRvbUNvbW1hbmROYW1lID0+IHRoaXMuZW1pdCgndHJpZ2dlcicsIGF0b21Db21tYW5kTmFtZSkpKTtcblxuICAgICAgICAgIGlmIChzZXR0aW5nLmtleW1hcCkge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdrZXltYXAnLCAncmVnaXN0ZXJlZCcsIHNldHRpbmcua2V5bWFwKTtcbiAgICAgICAgICAgIGNvbnN0IGtleW1hcFNwZWMgPSB7ICdhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvcic6IHt9IH07XG4gICAgICAgICAgICBrZXltYXBTcGVjWydhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvciddW3NldHRpbmcua2V5bWFwXSA9IHNldHRpbmcuYXRvbUNvbW1hbmROYW1lO1xuICAgICAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmtleW1hcHMuYWRkKHNldHRpbmcubmFtZSwga2V5bWFwU3BlYykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGF0aFRhcmdldC50YXJnZXRzID0gc2V0dGluZ3M7XG4gICAgICAgIHBhdGhUYXJnZXQubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2UgKyAoZXJyLnN0YWNrID8gJ1xcbicgKyBlcnIuc3RhY2sgOiAnJyksXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwYXRoUHJvbWlzZXMpLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICB0aGlzLmZpbGxUYXJnZXRzKHJlcXVpcmUoJy4vdXRpbHMnKS5hY3RpdmVQYXRoKCkpO1xuICAgICAgdGhpcy5lbWl0KCdyZWZyZXNoLWNvbXBsZXRlJyk7XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLm5vdGlmaWNhdGlvbk9uUmVmcmVzaCcpKSB7XG4gICAgICAgIGNvbnN0IHJvd3MgPSByZWZyZXNoUGF0aHMubWFwKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGhUYXJnZXQgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCk7XG4gICAgICAgICAgaWYgKCFwYXRoVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFRhcmdldHMgJHtwYXRofSBubyBsb25nZXIgZXhpc3RzLiBJcyBidWlsZCBkZWFjdGl2YXRlZD9gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYCR7cGF0aFRhcmdldC50YXJnZXRzLmxlbmd0aH0gdGFyZ2V0cyBhdDogJHtwYXRofWA7XG4gICAgICAgIH0pO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQnVpbGQgdGFyZ2V0cyBwYXJzZWQuJywge1xuICAgICAgICAgIGRldGFpbDogcm93cy5qb2luKCdcXG4nKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlICsgKGVyci5zdGFjayA/ICdcXG4nICsgZXJyLnN0YWNrIDogJycpLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmaWxsVGFyZ2V0cyhwYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRhcmdldHNWaWV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlVGFyZ2V0ID0gdGhpcy5nZXRBY3RpdmVUYXJnZXQocGF0aCk7XG4gICAgYWN0aXZlVGFyZ2V0ICYmIHRoaXMudGFyZ2V0c1ZpZXcuc2V0QWN0aXZlVGFyZ2V0KGFjdGl2ZVRhcmdldC5uYW1lKTtcblxuICAgIGNvbnN0IHRhcmdldE5hbWVzID0gdGhpcy5nZXRUYXJnZXRzKHBhdGgpLm1hcCh0ID0+IHQubmFtZSk7XG4gICAgdGhpcy50YXJnZXRzVmlldyAmJiB0aGlzLnRhcmdldHNWaWV3LnNldEl0ZW1zKHRhcmdldE5hbWVzKTtcbiAgfVxuXG4gIHNlbGVjdEFjdGl2ZVRhcmdldCgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5yZWZyZXNoT25TaG93VGFyZ2V0TGlzdCcpKSB7XG4gICAgICB0aGlzLnJlZnJlc2hUYXJnZXRzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hY3RpdmVQYXRoKCk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnVW5hYmxlIHRvIGJ1aWxkLicsIHtcbiAgICAgICAgZGV0YWlsOiAnT3BlbiBmaWxlIGlzIG5vdCBwYXJ0IG9mIGFueSBvcGVuIHByb2plY3QgaW4gQXRvbSdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFRhcmdldHNWaWV3ID0gcmVxdWlyZSgnLi90YXJnZXRzLXZpZXcnKTtcbiAgICB0aGlzLnRhcmdldHNWaWV3ID0gbmV3IFRhcmdldHNWaWV3KCk7XG5cbiAgICBpZiAodGhpcy5pc0xvYWRpbmcocGF0aCkpIHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0TG9hZGluZygnTG9hZGluZyBwcm9qZWN0IGJ1aWxkIHRhcmdldHNcXHUyMDI2Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXRzVmlldy5hd2FpdFNlbGVjdGlvbigpLnRoZW4obmV3VGFyZ2V0ID0+IHtcbiAgICAgIHRoaXMuc2V0QWN0aXZlVGFyZ2V0KHBhdGgsIG5ld1RhcmdldCk7XG5cbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcgPSBudWxsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgdGhpcy50YXJnZXRzVmlldyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUYXJnZXRzKHBhdGgpIHtcbiAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgIGlmICghcGF0aFRhcmdldCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChwYXRoVGFyZ2V0LnRhcmdldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVGFyZ2V0cyhbIHBhdGhUYXJnZXQucGF0aCBdKS50aGVuKCgpID0+IHBhdGhUYXJnZXQudGFyZ2V0cyk7XG4gICAgfVxuICAgIHJldHVybiBwYXRoVGFyZ2V0LnRhcmdldHM7XG4gIH1cblxuICBnZXRBY3RpdmVUYXJnZXQocGF0aCkge1xuICAgIGNvbnN0IHBhdGhUYXJnZXQgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCk7XG4gICAgaWYgKCFwYXRoVGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGhUYXJnZXQudGFyZ2V0cy5maW5kKHRhcmdldCA9PiB0YXJnZXQubmFtZSA9PT0gcGF0aFRhcmdldC5hY3RpdmVUYXJnZXQpO1xuICB9XG5cbiAgc2V0QWN0aXZlVGFyZ2V0KHBhdGgsIHRhcmdldE5hbWUpIHtcbiAgICB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCkuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0TmFtZTtcbiAgICB0aGlzLmVtaXQoJ25ldy1hY3RpdmUtdGFyZ2V0JywgcGF0aCwgdGhpcy5nZXRBY3RpdmVUYXJnZXQocGF0aCkpO1xuICB9XG5cbiAgaXNMb2FkaW5nKHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpLmxvYWRpbmc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFyZ2V0TWFuYWdlcjtcbiJdfQ==
//# sourceURL=/home/sargon/.atom/packages/build/lib/target-manager.js
