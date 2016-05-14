(function() {
  var BufferedProcess, Point, Q, TagGenerator, path, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, Point = _ref.Point;

  Q = require('q');

  path = require('path');

  module.exports = TagGenerator = (function() {
    function TagGenerator(path, scopeName) {
      this.path = path;
      this.scopeName = scopeName;
    }

    TagGenerator.prototype.parseTagLine = function(line) {
      var sections, tag;
      sections = line.split('\t');
      if (sections.length > 3) {
        tag = {
          position: new Point(parseInt(sections[2]) - 1),
          name: sections[0],
          type: sections[3],
          parent: null
        };
        if (sections.length > 4 && sections[4].search('signature:') === -1) {
          tag.parent = sections[4];
        }
        if (this.getLanguage() === 'Python' && tag.type === 'member') {
          tag.type = 'function';
        }
        return tag;
      } else {
        return null;
      }
    };

    TagGenerator.prototype.getLanguage = function() {
      var _ref1;
      if ((_ref1 = path.extname(this.path)) === '.cson' || _ref1 === '.gyp') {
        return 'Cson';
      }
      return {
        'source.c': 'C',
        'source.cpp': 'C++',
        'source.clojure': 'Lisp',
        'source.coffee': 'CoffeeScript',
        'source.css': 'Css',
        'source.css.less': 'Css',
        'source.css.scss': 'Css',
        'source.gfm': 'Markdown',
        'source.go': 'Go',
        'source.java': 'Java',
        'source.js': 'JavaScript',
        'source.js.jsx': 'JavaScript',
        'source.jsx': 'JavaScript',
        'source.json': 'Json',
        'source.makefile': 'Make',
        'source.objc': 'C',
        'source.objcpp': 'C++',
        'source.python': 'Python',
        'source.ruby': 'Ruby',
        'source.sass': 'Sass',
        'source.yaml': 'Yaml',
        'text.html': 'Html',
        'text.html.php': 'Php',
        'source.livecodescript': 'LiveCode',
        'source.c++': 'C++',
        'source.objc++': 'C++'
      }[this.scopeName];
    };

    TagGenerator.prototype.generate = function() {
      var args, command, defaultCtagsFile, deferred, exit, language, stderr, stdout, tags;
      deferred = Q.defer();
      tags = [];
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
      defaultCtagsFile = require.resolve('./.ctags');
      args = ["--options=" + defaultCtagsFile, '--fields=KsS'];
      if (atom.config.get('symbols-view.useEditorGrammarAsCtagsLanguage')) {
        if (language = this.getLanguage()) {
          args.push("--language-force=" + language);
        }
      }
      args.push('-nf', '-', this.path);
      stdout = (function(_this) {
        return function(lines) {
          var line, tag, _i, _len, _ref1, _results;
          _ref1 = lines.split('\n');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            line = _ref1[_i];
            if (tag = _this.parseTagLine(line.trim())) {
              _results.push(tags.push(tag));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      stderr = function(lines) {};
      exit = function() {
        return deferred.resolve(tags);
      };
      new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return deferred.promise;
    };

    return TagGenerator;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtdHJlZS12aWV3L2xpYi90YWctZ2VuZXJhdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLE9BQTJCLE9BQUEsQ0FBUSxNQUFSLENBQTNCLEVBQUMsdUJBQUEsZUFBRCxFQUFrQixhQUFBLEtBQWxCLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLHNCQUFFLElBQUYsRUFBUyxTQUFULEdBQUE7QUFBcUIsTUFBcEIsSUFBQyxDQUFBLE9BQUEsSUFBbUIsQ0FBQTtBQUFBLE1BQWIsSUFBQyxDQUFBLFlBQUEsU0FBWSxDQUFyQjtJQUFBLENBQWI7O0FBQUEsMkJBRUEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osVUFBQSxhQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQVgsQ0FBQTtBQUNBLE1BQUEsSUFBRyxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFyQjtBQUNFLFFBQUEsR0FBQSxHQUFNO0FBQUEsVUFDSixRQUFBLEVBQWMsSUFBQSxLQUFBLENBQU0sUUFBQSxDQUFTLFFBQVMsQ0FBQSxDQUFBLENBQWxCLENBQUEsR0FBd0IsQ0FBOUIsQ0FEVjtBQUFBLFVBRUosSUFBQSxFQUFNLFFBQVMsQ0FBQSxDQUFBLENBRlg7QUFBQSxVQUdKLElBQUEsRUFBTSxRQUFTLENBQUEsQ0FBQSxDQUhYO0FBQUEsVUFJSixNQUFBLEVBQVEsSUFKSjtTQUFOLENBQUE7QUFNQSxRQUFB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

//# sourceURL=/home/sargon/.atom/packages/symbols-tree-view/lib/tag-generator.coffee
