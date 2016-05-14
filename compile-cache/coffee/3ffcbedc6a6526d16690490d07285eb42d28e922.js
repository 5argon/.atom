(function() {
  module.exports = {
    General: {
      title: 'General Settings',
      type: 'object',
      properties: {
        preferredFormat: {
          title: 'Preferred Color Format',
          description: 'On opening for the first time, the Color Picker uses this format.',
          type: 'string',
          "enum": ['rgb', 'hex', 'hsl', 'As authored'],
          "default": 'As authored'
        },
        autoSetColor: {
          title: 'Auto Set Color',
          description: 'Automatically set the color values as you edit them',
          type: 'boolean',
          "default": false
        },
        autoShortColor: {
          title: 'Compress text colors',
          description: 'Place the color format without any spaces and zeroes (if possible)<br/>*e.g* rgba(0, 0, 0, 0.26) becomes rgba(0,0,0,.26)',
          type: 'boolean',
          "default": false
        },
        autoColorNames: {
          title: 'Auto Color Names',
          description: 'Automatically switch to a color name<br/>*e.g* color name of #f00 is red, so the color will be set as red.',
          type: 'boolean',
          "default": false
        },
        paletteOpen: {
          title: 'Palette Open',
          description: 'If the palette is open when the dialog is opened or not.',
          type: 'boolean',
          "default": true
        }
      }
    },
    HexColors: {
      title: 'Hex Color Specific Settings',
      type: 'object',
      properties: {
        fallbackAlphaFormat: {
          title: 'Fallback Color Format With Alpha Channel',
          description: 'If the current color has an **alpha** value less than **1**<br/>The picker automatically switches to this notation.',
          type: 'string',
          "enum": ['rgb', 'hsl'],
          "default": 'rgb'
        },
        uppercaseHex: {
          title: 'Uppercase Hex Values',
          description: 'Sets **hex** values to UPPER CASE.',
          type: 'boolean',
          "default": false
        },
        autoShortHex: {
          title: 'Auto Shorten Hex',
          description: 'Automatically shorten **hex** values if possible.<br/>*e.g* color #f00f00 becomes #f00',
          type: 'boolean',
          "default": false
        },
        forceHexSize: {
          title: 'Force the size of hex string',
          description: 'Force the **hex** to be specific to a certain size if it is possible<br/>*e.g* **hex6** of #f00 is #f00f00',
          type: ['boolean', 'string'],
          "enum": [false, 'hex3', 'hex6', 'hex8'],
          "default": false
        }
      }
    },
    RgbColors: {
      title: 'RGB and RGBa Color Specific Settings',
      type: 'object',
      properties: {
        preferredFormat: {
          title: 'Preferred output format',
          description: 'Format in which the rgb or rgba colors (whichever apply) are output to the editor.<br/>[More info](https://github.com/puranjayjain/chrome-color-picker/wiki/RGB-Formats)',
          type: 'string',
          "enum": ['standard', 'prgb', 'rrgb'],
          "default": 'standard'
        }
      }
    },
    HslColors: {
      title: 'HSL and HSLa Color Specific Settings',
      type: 'object',
      properties: {
        preferredFormat: {
          title: 'Preferred output format',
          description: 'Format in which the hsl or hsla colors (whichever apply) are output to the editor.<br/>[More info](https://github.com/puranjayjain/chrome-color-picker/wiki/HSL-Formats)',
          type: 'string',
          "enum": ['standard', 'rhsl'],
          "default": 'standard'
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUNFLE9BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxlQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyx3QkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLG1FQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFVBR0EsTUFBQSxFQUFNLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxLQUFmLEVBQXNCLGFBQXRCLENBSE47QUFBQSxVQUlBLFNBQUEsRUFBUyxhQUpUO1NBREY7QUFBQSxRQU1BLFlBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsVUFDQSxXQUFBLEVBQWEscURBRGI7QUFBQSxVQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsVUFHQSxTQUFBLEVBQVMsS0FIVDtTQVBGO0FBQUEsUUFXQSxjQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLDBIQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLEtBSFQ7U0FaRjtBQUFBLFFBZ0JBLGNBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsVUFDQSxXQUFBLEVBQWEsNEdBRGI7QUFBQSxVQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsVUFHQSxTQUFBLEVBQVMsS0FIVDtTQWpCRjtBQUFBLFFBcUJBLFdBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxVQUNBLFdBQUEsRUFBYSwwREFEYjtBQUFBLFVBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxVQUdBLFNBQUEsRUFBUyxJQUhUO1NBdEJGO09BSEY7S0FGSjtBQUFBLElBK0JFLFNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLDZCQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxtQkFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sMENBQVA7QUFBQSxVQUNBLFdBQUEsRUFBYSxxSEFEYjtBQUFBLFVBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxVQUdBLE1BQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxLQUFSLENBSE47QUFBQSxVQUlBLFNBQUEsRUFBUyxLQUpUO1NBREY7QUFBQSxRQU1BLFlBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLHNCQUFQO0FBQUEsVUFDQSxXQUFBLEVBQWEsb0NBRGI7QUFBQSxVQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsVUFHQSxTQUFBLEVBQVMsS0FIVDtTQVBGO0FBQUEsUUFXQSxZQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLHdGQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLEtBSFQ7U0FaRjtBQUFBLFFBZ0JBLFlBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLDhCQUFQO0FBQUEsVUFDQSxXQUFBLEVBQWEsNEdBRGI7QUFBQSxVQUVBLElBQUEsRUFBTSxDQUFDLFNBQUQsRUFBWSxRQUFaLENBRk47QUFBQSxVQUdBLE1BQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBSE47QUFBQSxVQUlBLFNBQUEsRUFBUyxLQUpUO1NBakJGO09BSEY7S0FoQ0o7QUFBQSxJQXlERSxTQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxzQ0FBUDtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFVBQUEsRUFDRTtBQUFBLFFBQUEsZUFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8seUJBQVA7QUFBQSxVQUNBLFdBQUEsRUFBYSwwS0FEYjtBQUFBLFVBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxVQUdBLE1BQUEsRUFBTSxDQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLE1BQXJCLENBSE47QUFBQSxVQUlBLFNBQUEsRUFBUyxVQUpUO1NBREY7T0FIRjtLQTFESjtBQUFBLElBbUVFLFNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLHNDQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxlQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyx5QkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLDBLQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFVBR0EsTUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLE1BQWIsQ0FITjtBQUFBLFVBSUEsU0FBQSxFQUFTLFVBSlQ7U0FERjtPQUhGO0tBcEVKO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/config.coffee
