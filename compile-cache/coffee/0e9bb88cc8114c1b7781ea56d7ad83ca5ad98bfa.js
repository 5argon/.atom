(function() {
  var child_process, jsx_bin_path;

  jsx_bin_path = '/node_modules/jsx/bin/jsx';

  child_process = require('child_process');

  module.exports = {
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'jsx:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      });
    },
    run: function() {
      var command, editor, jsx_bin, lang_jsx_path, node_path, options, uri;
      editor = atom.workspace.getActiveTextEditor();
      lang_jsx_path = atom.packages.resolvePackagePath('language-jsx');
      jsx_bin = lang_jsx_path + jsx_bin_path;
      node_path = this.getNodePath() || this.getExecPath();
      uri = atom.workspace.getActivePaneItem().buffer.file.path;
      command = require('util').format('%s %s --run %s', node_path, jsx_bin, uri);
      options = {
        'cwd': lang_jsx_path
      };
      child_process.exec(command, options, function(error, stdout, stderr) {
        if (error) {
          console.error(error);
        }
        if (stderr) {
          console.error(stderr);
        }
        if (stdout) {
          return console.log(stdout);
        }
      });
      return atom.openDevTools();
    },
    getExecPath: function() {
      return 'ATOM_SHELL_INTERNAL_RUN_AS_NODE=1 ';
    },
    getNodePath: function() {
      return atom.config.get('language-jsx.nodepath');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1qc3gvbGliL2pzeC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsMkJBQWYsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLFNBQUEsRUFBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsR0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYO09BQXBDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFFQSxHQUFBLEVBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxnRUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxjQUFqQyxDQURoQixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsYUFBQSxHQUFnQixZQUYxQixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQVksSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLElBQWtCLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FIOUIsQ0FBQTtBQUFBLE1BSUEsR0FBQSxHQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFKckQsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxNQUFoQixDQUF1QixnQkFBdkIsRUFBeUMsU0FBekMsRUFBb0QsT0FBcEQsRUFBNkQsR0FBN0QsQ0FMVixDQUFBO0FBQUEsTUFNQSxPQUFBLEdBQVU7QUFBQSxRQUNSLEtBQUEsRUFBUSxhQURBO09BTlYsQ0FBQTtBQUFBLE1BU0EsYUFBYSxDQUFDLElBQWQsQ0FBbUIsT0FBbkIsRUFBNEIsT0FBNUIsRUFBcUMsU0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixHQUFBO0FBQ2pDLFFBQUEsSUFBd0IsS0FBeEI7QUFBQSxVQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxDQUFBLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBeUIsTUFBekI7QUFBQSxVQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZCxDQUFBLENBQUE7U0FEQTtBQUVBLFFBQUEsSUFBdUIsTUFBdkI7aUJBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLEVBQUE7U0FIaUM7TUFBQSxDQUFyQyxDQVRBLENBQUE7YUFjQSxJQUFJLENBQUMsWUFBTCxDQUFBLEVBZkc7SUFBQSxDQUZMO0FBQUEsSUFrQkEsV0FBQSxFQUFhLFNBQUEsR0FBQTthQUNYLHFDQURXO0lBQUEsQ0FsQmI7QUFBQSxJQW9CQSxXQUFBLEVBQWEsU0FBQSxHQUFBO2FBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQURXO0lBQUEsQ0FwQmI7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/language-jsx/lib/jsx.coffee
