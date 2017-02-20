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