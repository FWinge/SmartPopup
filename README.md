<h1>SmartPopup</h1>

Lightweigth fancybox alternative.

To open a href in a SmartPopup you just need to add the class "smartpopup" to any href. The target page will automatically open as a popup.

<h2>SmartPopup Alert</h2>
To render a SmartPopup as an alert box, use the $.smartpopup.alert() function.

$.smartpopup.alert(
  "SOME TEXT", 
  yourCallback()
);


<h2>SmartPopup Confirm</h2>
To render a SmartPopup as an confirm box, use the $.smartpopup.confirm() function.

$.smartpopup.confirm(
  "SOME TEXT", 
  yourCallback()
);

<h2>Your SmartPopup</h2>
$.smartpopup.({
    content             :   null, // your html content. Only used, if url is null.
    url                 :   null, // url to your content.
    showCloseButton     :   false, // (bool)
    closeOnOutsideClick :   true, // (bool)
    onOutsideClick      :   null, // (function)
    onStart             :   null, // (function)
    onLoad              :   null, // (function)
    onClose             :   null, // (function)
    onClosed            :   null // (function)
});
