(function() {
  module.exports = {
    text: {
      html: {
        regex: {
          commentaire_html: /^[^\S\n]*<!-- !(.+)-->/gmi,
          structure: /^[^\S\n]*<(head|body|section)/gmi,
          entete: /^[^\S\n]*<h[1-9][^>]*>([^<]*)<\/h[1-9]>/gmi
        },
        php: {
          regex: {
            commentaire: /^[^\S\n]*\/\/ !(.+)/gmi,
            commentaire_multi: /^[^\S\n]*\/\* !(.+)\*\//gmi,
            "class": /^[^\S\n]*class ([\w]+)/gmi,
            "function": /^[^\S\n]*(?:final|static|abstract|private|public)*\s*function ([\w]+\(.*\))/gmi
          }
        }
      }
    },
    source: {
      css: {
        regex: {
          commentaire_multi: /^[^\S\n]*\/\* !(.+)\*\//gmi
        }
      },
      js: {
        regex: {
          commentaire: /^\h*\/\/ !(.+)/gmi,
          commentaire_multi: /^[^\S\n]*\/\* !(.+)\*\//gmi,
          "class": /^[^\S\n]*class ([\w]+)/gmi,
          "function": /^[^\S\n]*(?:final|static|abstract|private|public)*\s*function ([\w]+\(.*\))/gmi,
          controller: /^[^\S\n]*\.controller\s*\(\s*["']+([\w]+)["']+[\s,]*function/gmi,
          method: /^[^\S\n]*[^\s]*\.([\w]*)\s*=\s*function/gmi,
          constant: /^[^\S\n]*\.constant\(["']+([\w]+)["']+/gmi,
          filter: /^[^\S\n]*\.filter\(["']+([\w]+)["']+/gmi,
          structure: /^[^\S\n]*\.(config|run)\(function/gmi
        }
      },
      coffee: {
        regex: {
          "function": /^[^\S\n]*([\w]+:)\s*\([^\)]*\)\s*->/gmi,
          "class": /^[\S\n]*class ([\w]+)/gmi
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtbGlzdC9saWIvc3ltYm9scy1saXN0LXJlZ2V4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxJQUFBLEVBQ0k7QUFBQSxNQUFBLElBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUNJO0FBQUEsVUFBQSxnQkFBQSxFQUFrQiwyQkFBbEI7QUFBQSxVQUNBLFNBQUEsRUFBVyxrQ0FEWDtBQUFBLFVBRUEsTUFBQSxFQUFRLDRDQUZSO1NBREo7QUFBQSxRQUlBLEdBQUEsRUFDSTtBQUFBLFVBQUEsS0FBQSxFQUNJO0FBQUEsWUFBQSxXQUFBLEVBQWEsd0JBQWI7QUFBQSxZQUNBLGlCQUFBLEVBQW1CLDRCQURuQjtBQUFBLFlBRUEsT0FBQSxFQUFPLDJCQUZQO0FBQUEsWUFHQSxVQUFBLEVBQVUsZ0ZBSFY7V0FESjtTQUxKO09BREo7S0FESjtBQUFBLElBYUEsTUFBQSxFQUNJO0FBQUEsTUFBQSxHQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFDSTtBQUFBLFVBQUEsaUJBQUEsRUFBbUIsNEJBQW5CO1NBREo7T0FESjtBQUFBLE1BR0EsRUFBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQ0k7QUFBQSxVQUFBLFdBQUEsRUFBYSxtQkFBYjtBQUFBLFVBQ0EsaUJBQUEsRUFBbUIsNEJBRG5CO0FBQUEsVUFFQSxPQUFBLEVBQU8sMkJBRlA7QUFBQSxVQUdBLFVBQUEsRUFBVSxnRkFIVjtBQUFBLFVBSUEsVUFBQSxFQUFZLGlFQUpaO0FBQUEsVUFLQSxNQUFBLEVBQVEsNENBTFI7QUFBQSxVQU1BLFFBQUEsRUFBVSwyQ0FOVjtBQUFBLFVBT0EsTUFBQSxFQUFRLHlDQVBSO0FBQUEsVUFRQSxTQUFBLEVBQVcsc0NBUlg7U0FESjtPQUpKO0FBQUEsTUFjQSxNQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFDSTtBQUFBLFVBQUEsVUFBQSxFQUFVLHdDQUFWO0FBQUEsVUFDQSxPQUFBLEVBQU8sMEJBRFA7U0FESjtPQWZKO0tBZEo7R0FESixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/sargon/.atom/packages/symbols-list/lib/symbols-list-regex.coffee
