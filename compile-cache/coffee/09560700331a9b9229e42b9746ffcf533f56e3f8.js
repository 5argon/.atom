(function() {
  var BufferedProcess, PlainMessageView, error, exec, fs, getProjectPath, panel, path, simpleExec,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  fs = require("fs");

  exec = require('child_process').exec;

  PlainMessageView = null;

  panel = null;

  error = function(message, className) {
    var MessagePanelView, _ref;
    if (!panel) {
      _ref = require("atom-message-panel"), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView;
      panel = new MessagePanelView({
        title: "Atom Ctags"
      });
    }
    panel.attach();
    return panel.add(new PlainMessageView({
      message: message,
      className: className || "text-error",
      raw: true
    }));
  };

  simpleExec = function(command, exit) {
    return exec(command, function(error, stdout, stderr) {
      if (stdout) {
        console.log('stdout: ' + stdout);
      }
      if (stderr) {
        console.log('stderr: ' + stderr);
      }
      if (error) {
        return console.log('exec error: ' + error);
      }
    });
  };

  getProjectPath = function(codepath) {
    var dirPath, directory, _i, _len, _ref;
    _ref = atom.project.getDirectories();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      directory = _ref[_i];
      dirPath = directory.getPath();
      if (dirPath === codepath || directory.contains(codepath)) {
        return dirPath;
      }
    }
  };

  module.exports = function(codepath, isAppend, cmdArgs, callback) {
    var args, childProcess, command, ctagsFile, exit, genPath, projectCtagsFile, projectPath, stderr, t, tags, tagsPath, timeout;
    tags = [];
    command = atom.config.get("atom-ctags.cmd").trim();
    if (command === "") {
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
    }
    ctagsFile = require.resolve('./.ctags');
    projectPath = getProjectPath(codepath);
    projectCtagsFile = path.join(projectPath, ".ctags");
    if (fs.existsSync(projectCtagsFile)) {
      ctagsFile = projectCtagsFile;
    }
    tagsPath = path.join(projectPath, ".tags");
    if (isAppend) {
      genPath = path.join(projectPath, ".tags1");
    } else {
      genPath = tagsPath;
    }
    args = [];
    if (cmdArgs) {
      args.push.apply(args, cmdArgs);
    }
    args.push("--options=" + ctagsFile, '--fields=+KSn', '--excmd=p');
    args.push('-u', '-R', '-f', genPath, codepath);
    stderr = function(data) {
      return console.error("atom-ctags: command error, " + data, genPath);
    };
    exit = function() {
      var _ref;
      clearTimeout(t);
      if (isAppend) {
        if (_ref = process.platform, __indexOf.call('win32', _ref) >= 0) {
          simpleExec("type '" + tagsPath + "' | findstr /V /C:'" + codepath + "' > '" + tagsPath + "2' & ren '" + tagsPath + "2' '" + tagsPath + "' & more +6 '" + genPath + "' >> '" + tagsPath + "'");
        } else {
          simpleExec("grep -v '" + codepath + "' '" + tagsPath + "' > '" + tagsPath + "2'; mv '" + tagsPath + "2' '" + tagsPath + "'; tail -n +7 '" + genPath + "' >> '" + tagsPath + "'");
        }
      }
      return callback(genPath);
    };
    childProcess = new BufferedProcess({
      command: command,
      args: args,
      stderr: stderr,
      exit: exit
    });
    timeout = atom.config.get('atom-ctags.buildTimeout');
    return t = setTimeout(function() {
      childProcess.kill();
      return error("Stopped: Build more than " + (timeout / 1000) + " seconds, check if " + codepath + " contain too many files.<br>\n        Suggest that add CmdArgs at atom-ctags package setting, example:<br>\n            --exclude=some/path --exclude=some/other");
    }, timeout);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2F0b20tY3RhZ3MvbGliL3RhZy1nZW5lcmF0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxJQUhoQyxDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsSUFMbkIsQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxJQU5SLENBQUE7O0FBQUEsRUFPQSxLQUFBLEdBQVEsU0FBQyxPQUFELEVBQVUsU0FBVixHQUFBO0FBQ04sUUFBQSxzQkFBQTtBQUFBLElBQUEsSUFBRyxDQUFBLEtBQUg7QUFDRSxNQUFBLE9BQXVDLE9BQUEsQ0FBUSxvQkFBUixDQUF2QyxFQUFDLHdCQUFBLGdCQUFELEVBQW1CLHdCQUFBLGdCQUFuQixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVksSUFBQSxnQkFBQSxDQUFpQjtBQUFBLFFBQUEsS0FBQSxFQUFPLFlBQVA7T0FBakIsQ0FEWixDQURGO0tBQUE7QUFBQSxJQUlBLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FKQSxDQUFBO1dBS0EsS0FBSyxDQUFDLEdBQU4sQ0FBYyxJQUFBLGdCQUFBLENBQ1o7QUFBQSxNQUFBLE9BQUEsRUFBUyxPQUFUO0FBQUEsTUFDQSxTQUFBLEVBQVcsU0FBQSxJQUFhLFlBRHhCO0FBQUEsTUFFQSxHQUFBLEVBQUssSUFGTDtLQURZLENBQWQsRUFOTTtFQUFBLENBUFIsQ0FBQTs7QUFBQSxFQWtCQSxVQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO1dBQ1gsSUFBQSxDQUFLLE9BQUwsRUFBYyxTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLEdBQUE7QUFDWixNQUFBLElBQW9DLE1BQXBDO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFVBQUEsR0FBYSxNQUF6QixDQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBb0MsTUFBcEM7QUFBQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBQSxHQUFhLE1BQXpCLENBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUF1QyxLQUF2QztlQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBQSxHQUFpQixLQUE3QixFQUFBO09BSFk7SUFBQSxDQUFkLEVBRFc7RUFBQSxDQWxCYixDQUFBOztBQUFBLEVBd0JBLGNBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixRQUFBLGtDQUFBO0FBQUE7QUFBQSxTQUFBLDJDQUFBOzJCQUFBO0FBQ0UsTUFBQSxPQUFBLEdBQVUsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFWLENBQUE7QUFDQSxNQUFBLElBQWtCLE9BQUEsS0FBVyxRQUFYLElBQXVCLFNBQVMsQ0FBQyxRQUFWLENBQW1CLFFBQW5CLENBQXpDO0FBQUEsZUFBTyxPQUFQLENBQUE7T0FGRjtBQUFBLEtBRGU7RUFBQSxDQXhCakIsQ0FBQTs7QUFBQSxFQTZCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLE9BQXJCLEVBQThCLFFBQTlCLEdBQUE7QUFDZixRQUFBLHdIQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sRUFBUCxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUFpQyxDQUFDLElBQWxDLENBQUEsQ0FEVixDQUFBO0FBRUEsSUFBQSxJQUFHLE9BQUEsS0FBVyxFQUFkO0FBQ0UsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXlDLFFBQUEsR0FBUSxPQUFPLENBQUMsUUFBekQsQ0FBVixDQURGO0tBRkE7QUFBQSxJQUlBLFNBQUEsR0FBWSxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFoQixDQUpaLENBQUE7QUFBQSxJQU1BLFdBQUEsR0FBYyxjQUFBLENBQWUsUUFBZixDQU5kLENBQUE7QUFBQSxJQU9BLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixRQUF2QixDQVBuQixDQUFBO0FBUUEsSUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsZ0JBQWQsQ0FBSDtBQUNFLE1BQUEsU0FBQSxHQUFZLGdCQUFaLENBREY7S0FSQTtBQUFBLElBV0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixPQUF2QixDQVhYLENBQUE7QUFZQSxJQUFBLElBQUcsUUFBSDtBQUNFLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixRQUF2QixDQUFWLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxPQUFBLEdBQVUsUUFBVixDQUhGO0tBWkE7QUFBQSxJQWlCQSxJQUFBLEdBQU8sRUFqQlAsQ0FBQTtBQWtCQSxJQUFBLElBQXdCLE9BQXhCO0FBQUEsTUFBQSxJQUFJLENBQUMsSUFBTCxhQUFVLE9BQVYsQ0FBQSxDQUFBO0tBbEJBO0FBQUEsSUFvQkEsSUFBSSxDQUFDLElBQUwsQ0FBVyxZQUFBLEdBQVksU0FBdkIsRUFBb0MsZUFBcEMsRUFBcUQsV0FBckQsQ0FwQkEsQ0FBQTtBQUFBLElBcUJBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixPQUE1QixFQUFxQyxRQUFyQyxDQXJCQSxDQUFBO0FBQUEsSUF1QkEsTUFBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ1AsT0FBTyxDQUFDLEtBQVIsQ0FBYyw2QkFBQSxHQUFnQyxJQUE5QyxFQUFvRCxPQUFwRCxFQURPO0lBQUEsQ0F2QlQsQ0FBQTtBQUFBLElBMEJBLElBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLElBQUE7QUFBQSxNQUFBLFlBQUEsQ0FBYSxDQUFiLENBQUEsQ0FBQTtBQUVBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxXQUFHLE9BQU8sQ0FBQyxRQUFSLEVBQUEsZUFBb0IsT0FBcEIsRUFBQSxJQUFBLE1BQUg7QUFDRSxVQUFBLFVBQUEsQ0FBWSxRQUFBLEdBQVEsUUFBUixHQUFpQixxQkFBakIsR0FBc0MsUUFBdEMsR0FBK0MsT0FBL0MsR0FBc0QsUUFBdEQsR0FBK0QsWUFBL0QsR0FBMkUsUUFBM0UsR0FBb0YsTUFBcEYsR0FBMEYsUUFBMUYsR0FBbUcsZUFBbkcsR0FBa0gsT0FBbEgsR0FBMEgsUUFBMUgsR0FBa0ksUUFBbEksR0FBMkksR0FBdkosQ0FBQSxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsVUFBQSxDQUFZLFdBQUEsR0FBVyxRQUFYLEdBQW9CLEtBQXBCLEdBQXlCLFFBQXpCLEdBQWtDLE9BQWxDLEdBQXlDLFFBQXpDLEdBQWtELFVBQWxELEdBQTRELFFBQTVELEdBQXFFLE1BQXJFLEdBQTJFLFFBQTNFLEdBQW9GLGlCQUFwRixHQUFxRyxPQUFyRyxHQUE2RyxRQUE3RyxHQUFxSCxRQUFySCxHQUE4SCxHQUExSSxDQUFBLENBSEY7U0FERjtPQUZBO2FBUUEsUUFBQSxDQUFTLE9BQVQsRUFUSztJQUFBLENBMUJQLENBQUE7QUFBQSxJQXFDQSxZQUFBLEdBQW1CLElBQUEsZUFBQSxDQUFnQjtBQUFBLE1BQUMsU0FBQSxPQUFEO0FBQUEsTUFBVSxNQUFBLElBQVY7QUFBQSxNQUFnQixRQUFBLE1BQWhCO0FBQUEsTUFBd0IsTUFBQSxJQUF4QjtLQUFoQixDQXJDbkIsQ0FBQTtBQUFBLElBdUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBdkNWLENBQUE7V0F3Q0EsQ0FBQSxHQUFJLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDYixNQUFBLFlBQVksQ0FBQyxJQUFiLENBQUEsQ0FBQSxDQUFBO2FBQ0EsS0FBQSxDQUNKLDJCQUFBLEdBQTBCLENBQUMsT0FBQSxHQUFRLElBQVQsQ0FBMUIsR0FBd0MscUJBQXhDLEdBQTZELFFBQTdELEdBQXNFLGtLQURsRSxFQUZhO0lBQUEsQ0FBWCxFQU1GLE9BTkUsRUF6Q1c7RUFBQSxDQTdCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/sargon/.atom/packages/atom-ctags/lib/tag-generator.coffee
