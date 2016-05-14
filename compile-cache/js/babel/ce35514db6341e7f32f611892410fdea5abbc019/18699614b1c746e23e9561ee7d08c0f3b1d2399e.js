Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

'use babel';

var ErrorMatcher = (function (_EventEmitter) {
  _inherits(ErrorMatcher, _EventEmitter);

  function ErrorMatcher() {
    _classCallCheck(this, ErrorMatcher);

    _get(Object.getPrototypeOf(ErrorMatcher.prototype), 'constructor', this).call(this);
    this.regex = null;
    this.cwd = null;
    this.stdout = null;
    this.stderr = null;
    this.currentMatch = [];
    this.firstMatchId = null;

    atom.commands.add('atom-workspace', 'build:error-match', this.match.bind(this));
    atom.commands.add('atom-workspace', 'build:error-match-first', this.matchFirst.bind(this));
  }

  _createClass(ErrorMatcher, [{
    key: '_gotoNext',
    value: function _gotoNext() {
      if (0 === this.currentMatch.length) {
        return;
      }

      this.goto(this.currentMatch[0].id);
    }
  }, {
    key: 'goto',
    value: function goto(id) {
      var _this = this;

      var match = this.currentMatch.find(function (m) {
        return m.id === id;
      });
      if (!match) {
        this.emit('error', 'Can\'t find match with id ' + id);
        return;
      }

      // rotate to next match
      while (this.currentMatch[0] !== match) {
        this.currentMatch.push(this.currentMatch.shift());
      }
      this.currentMatch.push(this.currentMatch.shift());

      var file = match.file;
      if (!file) {
        this.emit('error', 'Did not match any file. Don\'t know what to open.');
        return;
      }

      var path = require('path');
      if (!path.isAbsolute(file)) {
        file = this.cwd + path.sep + file;
      }

      var row = match.line ? match.line - 1 : 0; /* Because atom is zero-based */
      var col = match.col ? match.col - 1 : 0; /* Because atom is zero-based */

      require('fs').exists(file, function (exists) {
        if (!exists) {
          _this.emit('error', 'Matched file does not exist: ' + file);
          return;
        }
        atom.workspace.open(file, {
          initialLine: row,
          initialColumn: col,
          searchAllPanes: true
        });
        _this.emit('matched', match);
      });
    }
  }, {
    key: '_parse',
    value: function _parse() {
      var _this2 = this;

      this.currentMatch = [];
      var self = this;
      var matchFunction = function matchFunction(match, i, string, regex) {
        match.id = 'error-match-' + self.regex.indexOf(regex) + '-' + i;
        this.push(match);
      };
      this.regex.forEach(function (regex) {
        if (typeof regex === 'function') {
          regex(_this2.output).forEach((function (match) {
            this.push(match);
          }).bind(_this2.currentMatch));
        } else {
          require('xregexp').forEach(_this2.output, regex, matchFunction.bind(_this2.currentMatch));
        }
      });

      this.currentMatch.sort(function (a, b) {
        return a.index - b.index;
      });

      this.firstMatchId = this.currentMatch.length > 0 ? this.currentMatch[0].id : null;
    }
  }, {
    key: 'set',
    value: function set(regex, cwd, output) {
      var _this3 = this;

      regex = regex || [];
      regex = regex instanceof Array ? regex : [regex];

      this.regex = regex.map(function (r) {
        if (typeof r === 'function') {
          return r;
        }
        try {
          var XRegExp = require('xregexp');
          return XRegExp(r);
        } catch (err) {
          _this3.emit('error', 'Error parsing regex. ' + err.message);
          return null;
        }
      }).filter(Boolean);

      this.cwd = cwd;
      this.output = output;
      this.currentMatch = [];

      this._parse();
    }
  }, {
    key: 'match',
    value: function match() {
      require('./google-analytics').sendEvent('errorMatch', 'match');

      this._gotoNext();
    }
  }, {
    key: 'matchFirst',
    value: function matchFirst() {
      require('./google-analytics').sendEvent('errorMatch', 'first');

      if (this.firstMatchId) {
        this.goto(this.firstMatchId);
      }
    }
  }, {
    key: 'hasMatch',
    value: function hasMatch() {
      return 0 !== this.currentMatch.length;
    }
  }, {
    key: 'getMatches',
    value: function getMatches() {
      return this.currentMatch;
    }
  }]);

  return ErrorMatcher;
})(_events.EventEmitter);

exports['default'] = ErrorMatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvZXJyb3ItbWF0Y2hlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRTZCLFFBQVE7O0FBRnJDLFdBQVcsQ0FBQzs7SUFJUyxZQUFZO1lBQVosWUFBWTs7QUFFcEIsV0FGUSxZQUFZLEdBRWpCOzBCQUZLLFlBQVk7O0FBRzdCLCtCQUhpQixZQUFZLDZDQUdyQjtBQUNSLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUV6QixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBSSxJQUFJLENBQUMsS0FBSyxNQUFWLElBQUksRUFBTyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixFQUFJLElBQUksQ0FBQyxVQUFVLE1BQWYsSUFBSSxFQUFZLENBQUM7R0FDbkY7O2VBYmtCLFlBQVk7O1dBZXRCLHFCQUFHO0FBQ1YsVUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDbEMsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNwQzs7O1dBRUcsY0FBQyxFQUFFLEVBQUU7OztBQUNQLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztlQUFJ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LFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV2QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRUksaUJBQUc7QUFDTixhQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUUvRCxVQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbEI7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQzlCO0tBQ0Y7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7S0FDdkM7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7U0FsSWtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL3Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvZXJyb3ItbWF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvck1hdGNoZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5yZWdleCA9IG51bGw7XG4gICAgdGhpcy5jd2QgPSBudWxsO1xuICAgIHRoaXMuc3Rkb3V0ID0gbnVsbDtcbiAgICB0aGlzLnN0ZGVyciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50TWF0Y2ggPSBbXTtcbiAgICB0aGlzLmZpcnN0TWF0Y2hJZCA9IG51bGw7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6ZXJyb3ItbWF0Y2gnLCA6OnRoaXMubWF0Y2gpO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDplcnJvci1tYXRjaC1maXJzdCcsIDo6dGhpcy5tYXRjaEZpcnN0KTtcbiAgfVxuXG4gIF9nb3RvTmV4dCgpIHtcbiAgICBpZiAoMCA9PT0gdGhpcy5jdXJyZW50TWF0Y2gubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5nb3RvKHRoaXMuY3VycmVudE1hdGNoWzBdLmlkKTtcbiAgfVxuXG4gIGdvdG8oaWQpIHtcbiAgICBjb25zdCBtYXRjaCA9IHRoaXMuY3VycmVudE1hdGNoLmZpbmQobSA9PiBtLmlkID09PSBpZCk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsICdDYW5cXCd0IGZpbmQgbWF0Y2ggd2l0aCBpZCAnICsgaWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJvdGF0ZSB0byBuZXh0IG1hdGNoXG4gICAgd2hpbGUgKHRoaXMuY3VycmVudE1hdGNoWzBdICE9PSBtYXRjaCkge1xuICAgICAgdGhpcy5jdXJyZW50TWF0Y2gucHVzaCh0aGlzLmN1cnJlbnRNYXRjaC5zaGlmdCgpKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50TWF0Y2gucHVzaCh0aGlzLmN1cnJlbnRNYXRjaC5zaGlmdCgpKTtcblxuICAgIGxldCBmaWxlID0gbWF0Y2guZmlsZTtcbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCAnRGlkIG5vdCBtYXRjaCBhbnkgZmlsZS4gRG9uXFwndCBrbm93IHdoYXQgdG8gb3Blbi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGZpbGUpKSB7XG4gICAgICBmaWxlID0gdGhpcy5jd2QgKyBwYXRoLnNlcCArIGZpbGU7XG4gICAgfVxuXG4gICAgY29uc3Qgcm93ID0gbWF0Y2gubGluZSA/IG1hdGNoLmxpbmUgLSAxIDogMDsgLyogQmVjYXVzZSBhdG9tIGlzIHplcm8tYmFzZWQgKi9cbiAgICBjb25zdCBjb2wgPSBtYXRjaC5jb2wgPyBtYXRjaC5jb2wgLSAxIDogMDsgLyogQmVjYXVzZSBhdG9tIGlzIHplcm8tYmFzZWQgKi9cblxuICAgIHJlcXVpcmUoJ2ZzJykuZXhpc3RzKGZpbGUsIChleGlzdHMpID0+IHtcbiAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCAnTWF0Y2hlZCBmaWxlIGRvZXMgbm90IGV4aXN0OiAnICsgZmlsZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSwge1xuICAgICAgICBpbml0aWFsTGluZTogcm93LFxuICAgICAgICBpbml0aWFsQ29sdW1uOiBjb2wsXG4gICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZW1pdCgnbWF0Y2hlZCcsIG1hdGNoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9wYXJzZSgpIHtcbiAgICB0aGlzLmN1cnJlbnRNYXRjaCA9IFtdO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG1hdGNoRnVuY3Rpb24gPSBmdW5jdGlvbiAobWF0Y2gsIGksIHN0cmluZywgcmVnZXgpIHtcbiAgICAgIG1hdGNoLmlkID0gJ2Vycm9yLW1hdGNoLScgKyBzZWxmLnJlZ2V4LmluZGV4T2YocmVnZXgpICsgJy0nICsgaTtcbiAgICAgIHRoaXMucHVzaChtYXRjaCk7XG4gICAgfTtcbiAgICB0aGlzLnJlZ2V4LmZvckVhY2goKHJlZ2V4KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHJlZ2V4ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlZ2V4KHRoaXMub3V0cHV0KS5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgIHRoaXMucHVzaChtYXRjaCk7XG4gICAgICAgIH0uYmluZCh0aGlzLmN1cnJlbnRNYXRjaCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgneHJlZ2V4cCcpLmZvckVhY2godGhpcy5vdXRwdXQsIHJlZ2V4LCBtYXRjaEZ1bmN0aW9uLmJpbmQodGhpcy5jdXJyZW50TWF0Y2gpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY3VycmVudE1hdGNoLnNvcnQoKGEsIGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcblxuICAgIHRoaXMuZmlyc3RNYXRjaElkID0gKHRoaXMuY3VycmVudE1hdGNoLmxlbmd0aCA+IDApID8gdGhpcy5jdXJyZW50TWF0Y2hbMF0uaWQgOiBudWxsO1xuICB9XG5cbiAgc2V0KHJlZ2V4LCBjd2QsIG91dHB1dCkge1xuICAgIHJlZ2V4ID0gcmVnZXggfHwgW107XG4gICAgcmVnZXggPSAocmVnZXggaW5zdGFuY2VvZiBBcnJheSkgPyByZWdleCA6IFsgcmVnZXggXTtcblxuICAgIHRoaXMucmVnZXggPSByZWdleC5tYXAoKHIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gcjtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFhSZWdFeHAgPSByZXF1aXJlKCd4cmVnZXhwJyk7XG4gICAgICAgIHJldHVybiBYUmVnRXhwKHIpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCAnRXJyb3IgcGFyc2luZyByZWdleC4gJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgdGhpcy5jd2QgPSBjd2Q7XG4gICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG4gICAgdGhpcy5jdXJyZW50TWF0Y2ggPSBbXTtcblxuICAgIHRoaXMuX3BhcnNlKCk7XG4gIH1cblxuICBtYXRjaCgpIHtcbiAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ2Vycm9yTWF0Y2gnLCAnbWF0Y2gnKTtcblxuICAgIHRoaXMuX2dvdG9OZXh0KCk7XG4gIH1cblxuICBtYXRjaEZpcnN0KCkge1xuICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgnZXJyb3JNYXRjaCcsICdmaXJzdCcpO1xuXG4gICAgaWYgKHRoaXMuZmlyc3RNYXRjaElkKSB7XG4gICAgICB0aGlzLmdvdG8odGhpcy5maXJzdE1hdGNoSWQpO1xuICAgIH1cbiAgfVxuXG4gIGhhc01hdGNoKCkge1xuICAgIHJldHVybiAwICE9PSB0aGlzLmN1cnJlbnRNYXRjaC5sZW5ndGg7XG4gIH1cblxuICBnZXRNYXRjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRNYXRjaDtcbiAgfVxufVxuIl19
//# sourceURL=/home/sargon/.atom/packages/build/lib/error-matcher.js
