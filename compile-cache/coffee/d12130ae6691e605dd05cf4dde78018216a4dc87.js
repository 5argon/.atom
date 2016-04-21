(function() {
  var ConfigPlus;

  ConfigPlus = require('atom-config-plus');

  module.exports = new ConfigPlus('cursor-history', {
    max: {
      order: 11,
      type: 'integer',
      "default": 100,
      minimum: 1,
      description: "number of history to remember"
    },
    rowDeltaToRemember: {
      order: 12,
      type: 'integer',
      "default": 4,
      minimum: 0,
      description: "Only if dirrerence of cursor row exceed this value, cursor position is saved to history"
    },
    excludeClosedBuffer: {
      order: 13,
      type: 'boolean',
      "default": false,
      description: "Don't open closed Buffer on history excursion"
    },
    searchAllPanes: {
      order: 31,
      type: 'boolean',
      "default": true,
      description: "Land to another pane or stick to same pane"
    },
    flashOnLand: {
      order: 32,
      type: 'boolean',
      "default": false,
      description: "flash cursor line on land"
    },
    flashDurationMilliSeconds: {
      order: 33,
      type: 'integer',
      "default": 150,
      description: "Duration for flash"
    },
    flashColor: {
      order: 34,
      type: 'string',
      "default": 'info',
      "enum": ['info', 'success', 'warning', 'error', 'highlight', 'selected'],
      description: 'flash color style, correspoinding to @background-color-{flashColor}: see `styleguide:show`'
    },
    flashType: {
      order: 35,
      type: 'string',
      "default": 'line',
      "enum": ['line', 'word', 'point'],
      description: 'Range to be flashed'
    },
    ignoreCommands: {
      order: 36,
      type: 'array',
      items: {
        type: 'string'
      },
      "default": ['command-palette:toggle'],
      description: 'list of commands to exclude from history tracking.'
    },
    debug: {
      order: 99,
      type: 'boolean',
      "default": false,
      description: "Output history on console.log"
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L2xpYi9zZXR0aW5ncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FBcUIsSUFBQSxVQUFBLENBQVcsZ0JBQVgsRUFDbkI7QUFBQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsR0FGVDtBQUFBLE1BR0EsT0FBQSxFQUFTLENBSFQ7QUFBQSxNQUlBLFdBQUEsRUFBYSwrQkFKYjtLQURGO0FBQUEsSUFNQSxrQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxDQUZUO0FBQUEsTUFHQSxPQUFBLEVBQVMsQ0FIVDtBQUFBLE1BSUEsV0FBQSxFQUFhLHlGQUpiO0tBUEY7QUFBQSxJQVlBLG1CQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLFdBQUEsRUFBYSwrQ0FIYjtLQWJGO0FBQUEsSUFpQkEsY0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxXQUFBLEVBQWEsNENBSGI7S0FsQkY7QUFBQSxJQXNCQSxXQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLFdBQUEsRUFBYSwyQkFIYjtLQXZCRjtBQUFBLElBMkJBLHlCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEdBRlQ7QUFBQSxNQUdBLFdBQUEsRUFBYSxvQkFIYjtLQTVCRjtBQUFBLElBZ0NBLFVBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsTUFGVDtBQUFBLE1BR0EsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsU0FBcEIsRUFBK0IsT0FBL0IsRUFBd0MsV0FBeEMsRUFBcUQsVUFBckQsQ0FITjtBQUFBLE1BSUEsV0FBQSxFQUFhLDRGQUpiO0tBakNGO0FBQUEsSUFzQ0EsU0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxNQUZUO0FBQUEsTUFHQSxNQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQixDQUhOO0FBQUEsTUFJQSxXQUFBLEVBQWEscUJBSmI7S0F2Q0Y7QUFBQSxJQTRDQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsS0FBQSxFQUFPO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtPQUZQO0FBQUEsTUFHQSxTQUFBLEVBQVMsQ0FBQyx3QkFBRCxDQUhUO0FBQUEsTUFJQSxXQUFBLEVBQWEsb0RBSmI7S0E3Q0Y7QUFBQSxJQWtEQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxNQUdBLFdBQUEsRUFBYSwrQkFIYjtLQW5ERjtHQURtQixDQUZyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/sargon/.atom/packages/cursor-history/lib/settings.coffee
