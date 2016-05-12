Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

function getConfig(file) {
  var fs = require('fs');
  var realFile = fs.realpathSync(file);
  delete require.cache[realFile];
  switch (require('path').extname(file)) {
    case '.json':
    case '.js':
      return require(realFile);

    case '.cson':
      return require('cson-parser').parse(fs.readFileSync(realFile));

    case '.yml':
      return require('js-yaml').safeLoad(fs.readFileSync(realFile));
  }

  return {};
}

function createBuildConfig(build, name) {
  var conf = {
    name: 'Custom: ' + name,
    exec: build.cmd,
    env: build.env,
    args: build.args,
    cwd: build.cwd,
    sh: build.sh,
    errorMatch: build.errorMatch,
    atomCommandName: build.atomCommandName,
    keymap: build.keymap
  };

  if (typeof build.postBuild === 'function') {
    conf.postBuild = build.postBuild;
  }

  if (typeof build.preBuild === 'function') {
    conf.preBuild = build.preBuild;
  }

  return conf;
}

var CustomFile = (function (_EventEmitter) {
  _inherits(CustomFile, _EventEmitter);

  function CustomFile(cwd) {
    _classCallCheck(this, CustomFile);

    _get(Object.getPrototypeOf(CustomFile.prototype), 'constructor', this).call(this);
    this.cwd = cwd;
    this.fileWatchers = [];
  }

  _createClass(CustomFile, [{
    key: 'destructor',
    value: function destructor() {
      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
    }
  }, {
    key: 'getNiceName',
    value: function getNiceName() {
      return 'Custom file';
    }
  }, {
    key: 'isEligible',
    value: function isEligible() {
      var _this = this;

      var os = require('os');
      var fs = require('fs');
      var path = require('path');
      this.files = [].concat.apply([], ['json', 'cson', 'yml', 'js'].map(function (ext) {
        return [path.join(_this.cwd, '.atom-build.' + ext), path.join(os.homedir(), '.atom-build.' + ext)];
      })).filter(fs.existsSync);
      return 0 < this.files.length;
    }
  }, {
    key: 'settings',
    value: function settings() {
      var _this2 = this;

      var fs = require('fs');
      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
      // On Linux, closing a watcher triggers a new callback, which causes an infinite loop
      // fallback to `watchFile` here which polls instead.
      this.fileWatchers = this.files.map(function (file) {
        return (require('os').platform() === 'linux' ? fs.watchFile : fs.watch)(file, function () {
          return _this2.emit('refresh');
        });
      });

      var config = [];
      this.files.map(getConfig).forEach(function (build) {
        config.push.apply(config, [createBuildConfig(build, build.name || 'default')].concat(_toConsumableArray(Object.keys(build.targets || {}).map(function (name) {
          return createBuildConfig(build.targets[name], name);
        }))));
      });

      return config;
    }
  }]);

  return CustomFile;
})(_events2['default']);

exports['default'] = CustomFile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYXRvbS1idWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUV5QixRQUFROzs7O0FBRmpDLFdBQVcsQ0FBQzs7QUFJWixTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDdkIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsU0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFVBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDbkMsU0FBSyxPQUFPLENBQUM7QUFDYixTQUFLLEtBQUs7QUFDUixhQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFBQSxBQUUzQixTQUFLLE9BQU87QUFDVixhQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUFBLEFBRWpFLFNBQUssTUFBTTtBQUNULGFBQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFBQSxHQUNqRTs7QUFFRCxTQUFPLEVBQUUsQ0FBQztDQUNYOztBQUVELFNBQVMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN0QyxNQUFNLElBQUksR0FBRztBQUNYLFFBQUksRUFBRSxVQUFVLEdBQUcsSUFBSTtBQUN2QixRQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUc7QUFDZixPQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7QUFDZCxRQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsT0FB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SUFBSSxTQUFTLENBQUMsNEJBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2lCQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO1NBQUEsQ0FBQyxHQUM5RixDQUFDO09BQ0gsQ0FBQyxDQUFDOztBQUVILGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQTVDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9hdG9tLWJ1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcblxuZnVuY3Rpb24gZ2V0Q29uZmlnKGZpbGUpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICBjb25zdCByZWFsRmlsZSA9IGZzLnJlYWxwYXRoU3luYyhmaWxlKTtcbiAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbcmVhbEZpbGVdO1xuICBzd2l0Y2ggKHJlcXVpcmUoJ3BhdGgnKS5leHRuYW1lKGZpbGUpKSB7XG4gICAgY2FzZSAnLmpzb24nOlxuICAgIGNhc2UgJy5qcyc6XG4gICAgICByZXR1cm4gcmVxdWlyZShyZWFsRmlsZSk7XG5cbiAgICBjYXNlICcuY3Nvbic6XG4gICAgICByZXR1cm4gcmVxdWlyZSgnY3Nvbi1wYXJzZXInKS5wYXJzZShmcy5yZWFkRmlsZVN5bmMocmVhbEZpbGUpKTtcblxuICAgIGNhc2UgJy55bWwnOlxuICAgICAgcmV0dXJuIHJlcXVpcmUoJ2pzLXlhbWwnKS5zYWZlTG9hZChmcy5yZWFkRmlsZVN5bmMocmVhbEZpbGUpKTtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVpbGRDb25maWcoYnVpbGQsIG5hbWUpIHtcbiAgY29uc3QgY29uZiA9IHtcbiAgICBuYW1lOiAnQ3VzdG9tOiAnICsgbmFtZSxcbiAgICBleGVjOiBidWlsZC5jbWQsXG4gICAgZW52OiBidWlsZC5lbnYsXG4gICAgYXJnczogYnVpbGQuYXJncyxcbiAgICBjd2Q6IGJ1aWxkLmN3ZCxcbiAgICBzaDogYnVpbGQuc2gsXG4gICAgZXJyb3JNYXRjaDogYnVpbGQuZXJyb3JNYXRjaCxcbiAgICBhdG9tQ29tbWFuZE5hbWU6IGJ1aWxkLmF0b21Db21tYW5kTmFtZSxcbiAgICBrZXltYXA6IGJ1aWxkLmtleW1hcFxuICB9O1xuXG4gIGlmICh0eXBlb2YgYnVpbGQucG9zdEJ1aWxkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uZi5wb3N0QnVpbGQgPSBidWlsZC5wb3N0QnVpbGQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ1aWxkLnByZUJ1aWxkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uZi5wcmVCdWlsZCA9IGJ1aWxkLnByZUJ1aWxkO1xuICB9XG5cbiAgcmV0dXJuIGNvbmY7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbUZpbGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjd2QpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY3dkID0gY3dkO1xuICAgIHRoaXMuZmlsZVdhdGNoZXJzID0gW107XG4gIH1cblxuICBkZXN0cnVjdG9yKCkge1xuICAgIHRoaXMuZmlsZVdhdGNoZXJzLmZvckVhY2goZncgPT4gZncuY2xvc2UoKSk7XG4gIH1cblxuICBnZXROaWNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ0N1c3RvbSBmaWxlJztcbiAgfVxuXG4gIGlzRWxpZ2libGUoKSB7XG4gICAgY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIHRoaXMuZmlsZXMgPSBbXS5jb25jYXQuYXBwbHkoW10sIFsgJ2pzb24nLCAnY3NvbicsICd5bWwnLCAnanMnIF0ubWFwKGV4dCA9PiBbXG4gICAgICBwYXRoLmpvaW4odGhpcy5jd2QsIGAuYXRvbS1idWlsZC4ke2V4dH1gKSxcbiAgICAgIHBhdGguam9pbihvcy5ob21lZGlyKCksIGAuYXRvbS1idWlsZC4ke2V4dH1gKVxuICAgIF0pKS5maWx0ZXIoZnMuZXhpc3RzU3luYyk7XG4gICAgcmV0dXJuIDAgPCB0aGlzLmZpbGVzLmxlbmd0aDtcbiAgfVxuXG4gIHNldHRpbmdzKCkge1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICB0aGlzLmZpbGVXYXRjaGVycy5mb3JFYWNoKGZ3ID0+IGZ3LmNsb3NlKCkpO1xuICAgIC8vIE9uIExpbnV4LCBjbG9zaW5nIGEgd2F0Y2hlciB0cmlnZ2VycyBhIG5ldyBjYWxsYmFjaywgd2hpY2ggY2F1c2VzIGFuIGluZmluaXRlIGxvb3BcbiAgICAvLyBmYWxsYmFjayB0byBgd2F0Y2hGaWxlYCBoZXJlIHdoaWNoIHBvbGxzIGluc3RlYWQuXG4gICAgdGhpcy5maWxlV2F0Y2hlcnMgPSB0aGlzLmZpbGVzLm1hcChmaWxlID0+XG4gICAgICAocmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpID09PSAnbGludXgnID8gZnMud2F0Y2hGaWxlIDogZnMud2F0Y2gpKGZpbGUsICgpID0+IHRoaXMuZW1pdCgncmVmcmVzaCcpKVxuICAgICk7XG5cbiAgICBjb25zdCBjb25maWcgPSBbXTtcbiAgICB0aGlzLmZpbGVzLm1hcChnZXRDb25maWcpLmZvckVhY2goYnVpbGQgPT4ge1xuICAgICAgY29uZmlnLnB1c2goXG4gICAgICAgIGNyZWF0ZUJ1aWxkQ29uZmlnKGJ1aWxkLCBidWlsZC5uYW1lIHx8ICdkZWZhdWx0JyksXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGJ1aWxkLnRhcmdldHMgfHwge30pLm1hcChuYW1lID0+IGNyZWF0ZUJ1aWxkQ29uZmlnKGJ1aWxkLnRhcmdldHNbbmFtZV0sIG5hbWUpKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb25maWc7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/sargon/.atom/packages/build/lib/atom-build.js
