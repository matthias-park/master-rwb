// @ts-nocheck
import 'core-js';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}
export {};
