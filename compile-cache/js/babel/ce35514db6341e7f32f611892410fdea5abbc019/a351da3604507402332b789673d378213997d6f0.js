Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.provideBuilder = provideBuilder;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _child_process = require('child_process');

var _voucher = require('voucher');

var _voucher2 = _interopRequireDefault(_voucher);

var _events = require('events');

'use babel';

var config = {
  jobs: {
    title: 'Simultaneous jobs',
    description: 'Limits how many jobs make will run simultaneously. Defaults to number of processors. Set to 1 for default behavior of make.',
    type: 'number',
    'default': _os2['default'].cpus().length,
    minimum: 1,
    maximum: _os2['default'].cpus().length,
    order: 1
  },
  useMake: {
    title: 'Target extraction with make',
    description: 'Use `make` to extract targets. This may yield unwanted targets, or take a long time and a lot of resource.',
    type: 'boolean',
    'default': false,
    order: 2
  }
};

exports.config = config;

function provideBuilder() {
  var gccErrorMatch = '(?<file>[^:\\n]+):(?<line>\\d+):(?<col>\\d+):\\s*(fatal error|error|warning):\\s*(?<message>.+)';
  var ocamlErrorMatch = '(?<file>[\\/0-9a-zA-Z\\._\\-]+)", line (?<line>\\d+), characters (?<col>\\d+)-(?<col_end>\\d+):\\n(?<message>.+)';
  var errorMatch = [gccErrorMatch, ocamlErrorMatch];

  return (function (_EventEmitter) {
    _inherits(MakeBuildProvider, _EventEmitter);

    function MakeBuildProvider(cwd) {
      var _this = this;

      _classCallCheck(this, MakeBuildProvider);

      _get(Object.getPrototypeOf(MakeBuildProvider.prototype), 'constructor', this).call(this);
      this.cwd = cwd;
      atom.config.observe('build-make.jobs', function () {
        return _this.emit('refresh');
      });
    }

    _createClass(MakeBuildProvider, [{
      key: 'getNiceName',
      value: function getNiceName() {
        return 'GNU Make';
      }
    }, {
      key: 'isEligible',
      value: function isEligible() {
        var _this2 = this;

        this.files = ['Makefile', 'GNUmakefile', 'makefile'].map(function (f) {
          return _path2['default'].join(_this2.cwd, f);
        }).filter(_fs2['default'].existsSync);
        return this.files.length > 0;
      }
    }, {
      key: 'settings',
      value: function settings() {
        var args = ['-j' + atom.config.get('build-make.jobs')];

        var defaultTarget = {
          exec: 'make',
          name: 'GNU Make: default (no target)',
          args: args,
          sh: false,
          errorMatch: errorMatch
        };

        var promise = atom.config.get('build-make.useMake') ? (0, _voucher2['default'])(_child_process.exec, 'make -prRn', { cwd: this.cwd }) : (0, _voucher2['default'])(_fs2['default'].readFile, this.files[0]); // Only take the first file

        return promise.then(function (output) {
          return [defaultTarget].concat(output.toString('utf8').split(/[\r\n]{1,2}/).filter(function (line) {
            return (/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$)/.test(line)
            );
          }).map(function (targetLine) {
            return targetLine.split(':').shift();
          }).map(function (target) {
            return {
              exec: 'make',
              args: args.concat([target]),
              name: 'GNU Make: ' + target,
              sh: false,
              errorMatch: errorMatch
            };
          }));
        })['catch'](function (e) {
          return [defaultTarget];
        });
      }
    }]);

    return MakeBuildProvider;
  })(_events.EventEmitter);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC1tYWtlL2xpYi9tYWtlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7NkJBQ0UsZUFBZTs7dUJBQ2hCLFNBQVM7Ozs7c0JBQ0EsUUFBUTs7QUFQckMsV0FBVyxDQUFDOztBQVNMLElBQU0sTUFBTSxHQUFHO0FBQ3BCLE1BQUksRUFBRTtBQUNKLFNBQUssRUFBRSxtQkFBbUI7QUFDMUIsZUFBVyxFQUFFLDZIQUE2SDtBQUMxSSxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsZ0JBQUcsSUFBSSxFQUFFLENBQUMsTUFBTTtBQUN6QixXQUFPLEVBQUUsQ0FBQztBQUNWLFdBQU8sRUFBRSxnQkFBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNO0FBQ3pCLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUUsNkJBQTZCO0FBQ3BDLGVBQVcsRUFBRSw0R0FBNEc7QUFDekgsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0NBQ0YsQ0FBQzs7OztBQUVLLFNBQVMsY0FBYyxHQUFHO0FBQy9CLE1BQU0sYUFBYSxHQUFHLGlHQUFpRyxDQUFDO0FBQ3hILE1BQU0sZUFBZSxHQUFHLGtIQUFrSCxDQUFDO0FBQzNJLE1BQU0sVUFBVSxHQUFHLENBQ2pCLGFBQWEsRUFBRSxlQUFlLENBQy9CLENBQUM7O0FBRUY7Y0FBYSxpQkFBaUI7O0FBQ2pCLGFBREEsaUJBQWlCLENBQ2hCLEdBQUcsRUFBRTs7OzRCQUROLGlCQUFpQjs7QUFFMUIsaUNBRlMsaUJBQWlCLDZDQUVsQjtBQUNSLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxTQUFTLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDcEU7O2lCQUxVLGlCQUFpQjs7YUFPakIsdUJBQUc7QUFDWixlQUFPLFVBQVUsQ0FBQztPQUNuQjs7O2FBRVMsc0JBQUc7OztBQUNYLFlBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFVBQVUsQ0FBRSxDQUNuRCxHQUFHLENBQUMsVUFBQSxDQUFDO2lCQUFJLGtCQUFLLElBQUksQ0FBQyxPQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FBQSxDQUFDLENBQ2hDLE1BQU0sQ0FBQyxnQkFBRyxVQUFVLENBQUMsQ0FBQztBQUN6QixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztPQUM5Qjs7O2FBRU8sb0JBQUc7QUFDVCxZQUFNLElBQUksR0FBRyxRQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUksQ0FBQzs7QUFFM0QsWUFBTSxhQUFhLEdBQUc7QUFDcEIsY0FBSSxFQUFFLE1BQU07QUFDWixjQUFJLGlDQUFpQztBQUNyQyxjQUFJLEVBQUUsSUFBSTtBQUNWLFlBQUUsRUFBRSxLQUFLO0FBQ1Qsb0JBQVUsRUFBRSxVQUFVO1NBQ3ZCLENBQUM7O0FBRUYsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsR0FDbkQsK0NBQWMsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUM5QywwQkFBUSxnQkFBRyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0QyxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDNUIsaUJBQU8sQ0FBRSxhQUFhLENBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FDcEQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUNwQixNQUFNLENBQUMsVUFBQSxJQUFJO21CQUFJLG1DQUFrQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O1dBQUEsQ0FBQyxDQUM3RCxHQUFHLENBQUMsVUFBQSxVQUFVO21CQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO1dBQUEsQ0FBQyxDQUNoRCxHQUFHLENBQUMsVUFBQSxNQUFNO21CQUFLO0FBQ2Qsa0JBQUksRUFBRSxNQUFNO0FBQ1osa0JBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUUsTUFBTSxDQUFFLENBQUM7QUFDN0Isa0JBQUksaUJBQWUsTUFBTSxBQUFFO0FBQzNCLGdCQUFFLEVBQUUsS0FBSztBQUNULHdCQUFVLEVBQUUsVUFBVTthQUN2QjtXQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1IsQ0FBQyxTQUFNLENBQUMsVUFBQSxDQUFDO2lCQUFJLENBQUUsYUFBYSxDQUFFO1NBQUEsQ0FBQyxDQUFDO09BQ2xDOzs7V0E5Q1UsaUJBQWlCOzJCQStDNUI7Q0FDSCIsImZpbGUiOiIvaG9tZS9zYXJnb24vLmF0b20vcGFja2FnZXMvYnVpbGQtbWFrZS9saWIvbWFrZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHZvdWNoZXIgZnJvbSAndm91Y2hlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBqb2JzOiB7XG4gICAgdGl0bGU6ICdTaW11bHRhbmVvdXMgam9icycsXG4gICAgZGVzY3JpcHRpb246ICdMaW1pdHMgaG93IG1hbnkgam9icyBtYWtlIHdpbGwgcnVuIHNpbXVsdGFuZW91c2x5LiBEZWZhdWx0cyB0byBudW1iZXIgb2YgcHJvY2Vzc29ycy4gU2V0IHRvIDEgZm9yIGRlZmF1bHQgYmVoYXZpb3Igb2YgbWFrZS4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IG9zLmNwdXMoKS5sZW5ndGgsXG4gICAgbWluaW11bTogMSxcbiAgICBtYXhpbXVtOiBvcy5jcHVzKCkubGVuZ3RoLFxuICAgIG9yZGVyOiAxXG4gIH0sXG4gIHVzZU1ha2U6IHtcbiAgICB0aXRsZTogJ1RhcmdldCBleHRyYWN0aW9uIHdpdGggbWFrZScsXG4gICAgZGVzY3JpcHRpb246ICdVc2UgYG1ha2VgIHRvIGV4dHJhY3QgdGFyZ2V0cy4gVGhpcyBtYXkgeWllbGQgdW53YW50ZWQgdGFyZ2V0cywgb3IgdGFrZSBhIGxvbmcgdGltZSBhbmQgYSBsb3Qgb2YgcmVzb3VyY2UuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDJcbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVCdWlsZGVyKCkge1xuICBjb25zdCBnY2NFcnJvck1hdGNoID0gJyg/PGZpbGU+W146XFxcXG5dKyk6KD88bGluZT5cXFxcZCspOig/PGNvbD5cXFxcZCspOlxcXFxzKihmYXRhbCBlcnJvcnxlcnJvcnx3YXJuaW5nKTpcXFxccyooPzxtZXNzYWdlPi4rKSc7XG4gIGNvbnN0IG9jYW1sRXJyb3JNYXRjaCA9ICcoPzxmaWxlPltcXFxcLzAtOWEtekEtWlxcXFwuX1xcXFwtXSspXCIsIGxpbmUgKD88bGluZT5cXFxcZCspLCBjaGFyYWN0ZXJzICg/PGNvbD5cXFxcZCspLSg/PGNvbF9lbmQ+XFxcXGQrKTpcXFxcbig/PG1lc3NhZ2U+LispJztcbiAgY29uc3QgZXJyb3JNYXRjaCA9IFtcbiAgICBnY2NFcnJvck1hdGNoLCBvY2FtbEVycm9yTWF0Y2hcbiAgXTtcblxuICByZXR1cm4gY2xhc3MgTWFrZUJ1aWxkUHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGN3ZCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuY3dkID0gY3dkO1xuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQtbWFrZS5qb2JzJywgKCkgPT4gdGhpcy5lbWl0KCdyZWZyZXNoJykpO1xuICAgIH1cblxuICAgIGdldE5pY2VOYW1lKCkge1xuICAgICAgcmV0dXJuICdHTlUgTWFrZSc7XG4gICAgfVxuXG4gICAgaXNFbGlnaWJsZSgpIHtcbiAgICAgIHRoaXMuZmlsZXMgPSBbICdNYWtlZmlsZScsICdHTlVtYWtlZmlsZScsICdtYWtlZmlsZScgXVxuICAgICAgICAubWFwKGYgPT4gcGF0aC5qb2luKHRoaXMuY3dkLCBmKSlcbiAgICAgICAgLmZpbHRlcihmcy5leGlzdHNTeW5jKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbGVzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MoKSB7XG4gICAgICBjb25zdCBhcmdzID0gWyBgLWoke2F0b20uY29uZmlnLmdldCgnYnVpbGQtbWFrZS5qb2JzJyl9YCBdO1xuXG4gICAgICBjb25zdCBkZWZhdWx0VGFyZ2V0ID0ge1xuICAgICAgICBleGVjOiAnbWFrZScsXG4gICAgICAgIG5hbWU6IGBHTlUgTWFrZTogZGVmYXVsdCAobm8gdGFyZ2V0KWAsXG4gICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgIHNoOiBmYWxzZSxcbiAgICAgICAgZXJyb3JNYXRjaDogZXJyb3JNYXRjaFxuICAgICAgfTtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQtbWFrZS51c2VNYWtlJykgP1xuICAgICAgICB2b3VjaGVyKGV4ZWMsICdtYWtlIC1wclJuJywgeyBjd2Q6IHRoaXMuY3dkIH0pIDpcbiAgICAgICAgdm91Y2hlcihmcy5yZWFkRmlsZSwgdGhpcy5maWxlc1swXSk7IC8vIE9ubHkgdGFrZSB0aGUgZmlyc3QgZmlsZVxuXG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG91dHB1dCA9PiB7XG4gICAgICAgIHJldHVybiBbIGRlZmF1bHRUYXJnZXQgXS5jb25jYXQob3V0cHV0LnRvU3RyaW5nKCd1dGY4JylcbiAgICAgICAgICAuc3BsaXQoL1tcXHJcXG5dezEsMn0vKVxuICAgICAgICAgIC5maWx0ZXIobGluZSA9PiAvXlthLXpBLVowLTldW14kI1xcL1xcdD1dKjooW149XXwkKS8udGVzdChsaW5lKSlcbiAgICAgICAgICAubWFwKHRhcmdldExpbmUgPT4gdGFyZ2V0TGluZS5zcGxpdCgnOicpLnNoaWZ0KCkpXG4gICAgICAgICAgLm1hcCh0YXJnZXQgPT4gKHtcbiAgICAgICAgICAgIGV4ZWM6ICdtYWtlJyxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MuY29uY2F0KFsgdGFyZ2V0IF0pLFxuICAgICAgICAgICAgbmFtZTogYEdOVSBNYWtlOiAke3RhcmdldH1gLFxuICAgICAgICAgICAgc2g6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3JNYXRjaDogZXJyb3JNYXRjaFxuICAgICAgICAgIH0pKSk7XG4gICAgICB9KS5jYXRjaChlID0+IFsgZGVmYXVsdFRhcmdldCBdKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
//# sourceURL=/home/sargon/.atom/packages/build-make/lib/make.js
