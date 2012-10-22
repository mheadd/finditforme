// Object with message components.
var messages = {
    butonHTML: '<button type="button" class="close" data-dismiss="alert">×</button>',
    sms: 'You can also find a place by sending a text message to <strong>(267) 293-9385</strong>. Send an address in Philly with a place type, like "908 N. 3rd Street, Philadelphia PA #bakery"',
    about: 'PhindItFor.me is a demo application built by <a href="https://twitter.com/mheadd">Mark Headd</a> as an example of how to use the Google Places API. more information <a href="http://codeforamerica.org/2012/10/05/calling-all-civic-coders/">here</a>.'
};

// Logic to display messages.
function displayMessage(text) {
   var message = document.getElementById('message');
   if(message) {
     message.innerHTML = messages.butonHTML + text;
   }
   else {
     var messageBlock = document.getElementById('alert_placeholder');
     var message = document.createElement('div');
     message.setAttribute('id', 'message');
     message.setAttribute('class', 'alert alert-info');
     message.innerHTML = messages.butonHTML + text;
     messageBlock.appendChild(message);
   }
}