(function() {
  var KeymapTableView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  module.exports = KeymapTableView = (function(_super) {
    __extends(KeymapTableView, _super);

    function KeymapTableView() {
      return KeymapTableView.__super__.constructor.apply(this, arguments);
    }

    KeymapTableView.prototype.mapTable = {};

    KeymapTableView.prototype.keymapChangeCallback = null;

    KeymapTableView.content = function() {
      return this.section({
        "class": 'map-table-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'section-heading pull-left icon icon-code'
          }, 'Key-Mappings');
          _this.div({
            "class": 'btn-group pull-right'
          }, function() {
            _this.div({
              "class": 'btn btn-clipboard icon-clippy',
              click: 'saveToClipboard'
            }, ' clipboard');
            return _this.div({
              "class": 'btn btn-clear icon icon-trashcan',
              click: 'clear'
            }, 'clear');
          });
          return _this.pre({
            "class": 'map-table',
            outlet: 'mapTableView'
          });
        };
      })(this));
    };

    KeymapTableView.prototype.addKeyMapping = function(down, modifier, press, isAccentKey) {
      var modIdentifier;
      modIdentifier = 'unshifted';
      if (modifier.shift) {
        modIdentifier = 'shifted';
      }
      if (modifier.altgr) {
        modIdentifier = 'alted';
      }
      if (modifier.shift && modifier.altgr) {
        modIdentifier = 'altshifted';
      }
      if (this.mapTable[down.code] == null) {
        this.mapTable[down.code] = {};
      }
      if (isAccentKey) {
        this.mapTable[down.code]['accent'] = true;
      }
      this.mapTable[down.code][modIdentifier] = press.code;
      if (this.keymapChangeCallback) {
        this.keymapChangeCallback(this.mapTable);
      }
      return this.render();
    };

    KeymapTableView.prototype.render = function() {
      return this.mapTableView.text(JSON.stringify(this.mapTable, void 0, 4));
    };

    KeymapTableView.prototype.getKeymap = function() {
      return this.mapTable;
    };

    KeymapTableView.prototype.saveToClipboard = function() {
      var input;
      console.log('clipboard');
      input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = JSON.stringify(this.mapTable, void 0, 4);
      input.focus();
      input.select();
      document.execCommand('Copy');
      return input.remove();
    };


    /*
    saveToFile: ->
      console.log 'save'
    
    saveToGithub: ->
      console.log 'github'
     */

    KeymapTableView.prototype.onKeymapChange = function(keymapChangeCallback) {
      return this.keymapChangeCallback = keymapChangeCallback;
    };

    KeymapTableView.prototype.clear = function() {
      this.mapTable = {};
      this.render();
      if (this.keymapChangeCallback) {
        return this.keymapChangeCallback(this.mapTable);
      }
    };

    return KeymapTableView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvdmlld3Mva2V5bWFwLXRhYmxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxzQkFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSw4QkFDQSxvQkFBQSxHQUFzQixJQUR0QixDQUFBOztBQUFBLElBR0EsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsT0FBRCxDQUFTO0FBQUEsUUFBQSxPQUFBLEVBQU0saUJBQU47T0FBVCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLDBDQUFQO1dBQUwsRUFBd0QsY0FBeEQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU0sc0JBQU47V0FBTCxFQUFtQyxTQUFBLEdBQUE7QUFFakMsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU0sK0JBQU47QUFBQSxjQUF1QyxLQUFBLEVBQU0saUJBQTdDO2FBQUwsRUFBcUUsWUFBckUsQ0FBQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTSxrQ0FBTjtBQUFBLGNBQTBDLEtBQUEsRUFBTSxPQUFoRDthQUFMLEVBQThELE9BQTlE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

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/views/keymap-table-view.coffee
