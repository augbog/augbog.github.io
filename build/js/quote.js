(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var quotes = require('../json/quotes.json');
  var quoteTrigger = document.getElementById('quotes');

  String.prototype.typeout = function(targetElem) {
    var timer;
    var str = this.split('');
    var strCopy = str.slice(0);
    clearTimeout(timer);
    var ll = '';
    (function shuffle(start){
      // This code is run options.fps times per second
      // and updates the contents of the page element
      var i, len = strCopy.length;
      if(start>=len){
        return targetElem.innerHTML = str.join('').toString();// you can use your selectors
      }
      ll = ll + strCopy[start];
      targetElem.innerHTML = ll; // you can use your selectors
      timer = setTimeout(function(){
        shuffle(start+1);
      }, 50);
    })(0);
  }

  function triggerQuoteAnimation() {
    var heading = document.getElementsByClassName('heading')[0];
    var description = document.getElementsByClassName('description')[0];
    heading.className = 'quote';
    description.className = 'author';

    var oHeading = heading.innerText;
    var oDescription = description.innerText;
    for (var i=0; i<=quotes.length; i++) {
      (function(i) {
        if (i == quotes.length) {
          setTimeout(function(e) {
            heading.className = '';
            description.className = '';
            description.innerHTML = '';
            oHeading.typeout(heading);
          }, 10000*i);
          setTimeout(function(e) {
            oDescription.typeout(description);
          }, 10000*i+2000);
          quoteTrigger.removeEventListener('click', triggerQuoteAnimation);
        } else {
          var quote = new String(quotes[i].quote);
          var author = new String(quotes[i].author);
          setTimeout(function(e) {
            var moddedQuote = '“' + quote + '”';
            moddedQuote.typeout(heading);
            description.innerHTML = '';
          }, 10000*i);
          setTimeout(function(e) {
            author.typeout(description);
          }, 10000*i+2000);
        }
      })(i);
    }
  }

  quoteTrigger.addEventListener('click', triggerQuoteAnimation);
})();
},{"../json/quotes.json":2}],2:[function(require,module,exports){
module.exports=[
  {
    "quote" : "Fairy tales are more than true — not because they tell us dragons exist, but because they tell us dragons can be beaten.",
    "author": "G. K. Chesterton"
  },
  {
    "quote" : "Don't go through life, grow through life.",
    "author": "Eric Butterworth"
  },
  {
    "quote" : "Wisdom is knowing what to do next, skill is knowing how to do it, and virtue is doing it.",
    "author": "David Starr Jordan"
  },
  {
    "quote": "Never doubt that a small group of thoughtful, committed, citizens can change the world. Indeed, it is the only thing that ever has.",
    "author": "Margaret Mead"
  },
  {
    "quote": "When we speak we are afraid our words will not be heard or welcomed. But when we are silent, we are still afraid. So it is better to speak.",
    "author": "Audre Lorde"
  }
]


},{}]},{},[1])