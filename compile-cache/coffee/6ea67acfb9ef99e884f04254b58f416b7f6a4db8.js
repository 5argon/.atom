(function() {
  var db, os, projects, utils;

  os = require('os');

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  projects = {
    testproject1: {
      title: "Test project 1",
      group: "Test",
      paths: ["/Users/project-1"]
    },
    testproject2: {
      _id: 'testproject2',
      title: "Test project 2",
      paths: ["/Users/project-2"]
    }
  };

  db.writeFile(projects);

  describe("DB", function() {
    describe("::addUpdater", function() {
      it("finds project from path", function() {
        var query;
        query = {
          key: 'paths',
          value: projects.testproject2.paths
        };
        db.addUpdater('noIdMatchButPathMatch', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe('testproject2');
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from title", function() {
        var query;
        query = {
          key: 'title',
          value: 'Test project 1'
        };
        db.addUpdater('noIdMatchButTitleMatch', query, (function(_this) {
          return function(props) {
            return expect(props.title).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from id", function() {
        var query;
        query = {
          key: '_id',
          value: 'testproject1'
        };
        db.addUpdater('shouldIdMatchButNotOnThis', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      return it("finds nothing if query is wrong", function() {
        var haveBeenChanged, query;
        query = {
          key: '_id',
          value: 'IHaveNoID'
        };
        haveBeenChanged = false;
        db.addUpdater('noIdMatch', query, (function(_this) {
          return function(props) {
            return haveBeenChanged = true;
          };
        })(this));
        db.emitter.emit('db-updated');
        return expect(haveBeenChanged).toBe(false);
      });
    });
    it("can add a project", function() {
      var newProject;
      newProject = {
        title: "New Project",
        paths: ["/Users/new-project"]
      };
      return db.add(newProject, function(id) {
        expect(id).toBe('newproject');
        return db.find(function(projects) {
          var found, project, _i, _len;
          found = false;
          for (_i = 0, _len = projects.length; _i < _len; _i++) {
            project = projects[_i];
            if (project._id = 'newproject') {
              found = true;
            }
          }
          return expect(found).toBe(true);
        });
      });
    });
    return it("can remove a project", function() {
      return db["delete"]("testproject1", function() {
        return db.find(function(projects) {
          return expect(projects.length).toBe(1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvc3BlYy9kYi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxXQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FBbEIsQ0FIQSxDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxZQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxnQkFBUDtBQUFBLE1BQ0EsS0FBQSxFQUFPLE1BRFA7QUFBQSxNQUVBLEtBQUEsRUFBTyxDQUNMLGtCQURLLENBRlA7S0FERjtBQUFBLElBTUEsWUFBQSxFQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssY0FBTDtBQUFBLE1BQ0EsS0FBQSxFQUFPLGdCQURQO0FBQUEsTUFFQSxLQUFBLEVBQU8sQ0FDTCxrQkFESyxDQUZQO0tBUEY7R0FMRixDQUFBOztBQUFBLEVBa0JBLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBYixDQWxCQSxDQUFBOztBQUFBLEVBb0JBLFFBQUEsQ0FBUyxJQUFULEVBQWUsU0FBQSxHQUFBO0FBQ2IsSUFBQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUNFO0FBQUEsVUFBQSxHQUFBLEVBQUssT0FBTDtBQUFBLFVBQ0Es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

//# sourceURL=/Users/Sargon/.atom/packages/project-manager/spec/db-spec.coffee
