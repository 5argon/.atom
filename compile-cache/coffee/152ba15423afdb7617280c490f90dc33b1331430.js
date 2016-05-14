(function() {
  var Base, C1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = (function() {
    function Base(args) {}

    Base.prototype.methodOneBase = function() {};

    Base.prototype.methodTwoBase = function() {};

    return Base;

  })();

  C1 = (function(_super) {
    __extends(C1, _super);

    function C1(args) {
      console.log("HELLO");
    }

    return C1;

  })(Base);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtbW92ZS10by1zeW1ib2xzL3NwZWMvZml4dHVyZXMvc2FtcGxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsY0FBQyxJQUFELEdBQUEsQ0FBYjs7QUFBQSxtQkFFQSxhQUFBLEdBQWUsU0FBQSxHQUFBLENBRmYsQ0FBQTs7QUFBQSxtQkFJQSxhQUFBLEdBQWUsU0FBQSxHQUFBLENBSmYsQ0FBQTs7Z0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQU9NO0FBQ0oseUJBQUEsQ0FBQTs7QUFBYSxJQUFBLFlBQUMsSUFBRCxHQUFBO0FBQ1gsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FBQSxDQURXO0lBQUEsQ0FBYjs7Y0FBQTs7S0FEZSxLQVBqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/sargon/.atom/packages/vim-mode-plus-move-to-symbols/spec/fixtures/sample.coffee
