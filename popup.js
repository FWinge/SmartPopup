/*
 * Smart-Popup-Plugin
 *
 * Copyright (c) 2020 - Florian Winge
 * Author: Florian Winge
 */

(function($){
    // Change button text for different languages.
    var confirmSuccessButtonText = "Yes",
        confirmNoSuccessButtontext = "No",
        alertButtonText = "Okay";
    
    var overlay, outer, inner, loading, close, currentOpts,

    // ########## Private methods ##########
    smartpopup_init = function(){
        if($('#smartpopup-overlay').length > 0){
            return;
        }

        $('body').append(
            overlay     = $('<div id="smartpopup-overlay"></div>'),
            outer = $('<div id="smartpopup-outer"></div>')
                    .append( inner = $('<div id="smartpopup-inner"></div>'))
                    .append( loading = $('<div id="smartpopup-loading"></div>')
                                        .append('<div class="loading_container"><div class="spinner_container"><div class="spinner"><svg class="spinner_inner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div></div></div>'))
        );

        smartpopup_calculate_position();

        if(currentOpts.showCloseButton == true){
            close = $('<a id="close"><i class="material-icons md-36">close</i></a>').appendTo(inner);

            close.on('click', function(){
                smartpopup_close();
            });
        }

        // Close Popup on click on overlay
        if(currentOpts.closeOnOutsideClick === true){
            overlay.on('click', function(){
                smartpopup_close();
            });
        }

        if(typeof currentOpts.onOutsideClick == 'function'){
            // OnOutsideClick
            overlay.on('click', function(){
                currentOpts.onOutsideClick();
            });
        }

        // OnStart
        if(typeof currentOpts.onStart == 'function'){
            currentOpts.onStart();
        }

        if(currentOpts.url != null && currentOpts.url != ""){
            smartpopup_showLoading();
            $.post(currentOpts.url, {}, function(content){
                inner.append(content);
                smartpopup_hideLoading();

                //OnLoad
                if(typeof currentOpts.onLoad == 'function'){
                    currentOpts.onLoad();
                }
            });
        }else if(currentOpts.content != null && currentOpts.content != ""){
            inner.append(currentOpts.content);

            //OnLoad
            if(typeof currentOpts.onLoad == 'function'){
                currentOpts.onLoad();
            }
        }
        
        smartpopup_show();

        
    };

    smartpopup_show = function(){
        smartpopup_set_body_scroll(false);

        overlay.addClass("smartpopup-show");
        outer.addClass("smartpopup-show");
    };

    smartpopup_hide = function(){
        smartpopup_set_body_scroll(true);

        overlay.removeClass("smartpopup-show");
        outer.removeClass("smartpopup-show");

        overlay.addClass("smartpopup-hide");
        outer.addClass("smartpopup-hide");
    };

    smartpopup_close = function(){
        smartpopup_set_body_scroll(true);

        if(typeof currentOpts.onClose == 'function'){
            currentOpts.onClose();
        }

        smartpopup_hide();

        setTimeout(function(){
            smartpopup_remove();
            if(typeof currentOpts.onClosed == 'function'){
                currentOpts.onClosed();
            }
        }, 300);
    };

    smartpopup_remove = function(){
        inner.remove();
        outer.remove();
        overlay.remove();
    };

    smartpopup_showLoading = function(){
        loading.addClass("loading");
    };

    smartpopup_hideLoading = function(){
        loading.removeClass("loading");
    };

    smartpopup_set_body_scroll = function(scroll){
        var value = (scroll) ? "auto" : "hidden";
        $('body').css('overflow', value);
    };

    smartpopup_calculate_position = function(){
        var $w = $(window),
        top = $w.scrollTop(),
        height = $w.height();

        var outerTop = top + (height / 2);

        overlay.css({'top' : top});
        outer.css({'top' : outerTop});
    };


    // ########## Public methods ##########

    $.smartpopup = function(opts){

        if( typeof opts == 'undefined'){
            opts = {};
        }

        // Prepare Options and overwrite defaults
        currentOpts = {};
        $.each($.smartpopup.defaults, function(i, e){
            if(typeof opts[i] != 'undefined'){
                currentOpts[i] = opts[i];
            }else{
                currentOpts[i] = e;
            }
        });

        smartpopup_init();
    };

    // Close and delete smartpopup
    $.smartpopup.close = function(){
        smartpopup_close();
    };

    // Show loading overlay
    $.smartpopup.showLoading = function(){
        smartpopup_showLoading();
    };

    // Hide loading overlay
    $.smartpopup.hideLoading = function(){
        smartpopup_hideLoading();
    };

    $.smartpopup.defaults = {
        content             :   null,
        url                 :   null,
        showCloseButton     :   false,
        closeOnOutsideClick :   true,
        onOutsideClick      :   null,
        onStart             :   null,
        onLoad              :   null,
        onClose             :   null,
        onClosed            :   null
    };


    // Create confirm-dialog
    $.smartpopup.confirm = function(text, callback){
        var confirmContent= '<div class="smartpopup-confirm-text">' + text + '</div>';
        confirmContent += '<div class="smartpopup-confirm-buttons"><button id="smartpopup-confirm-true" class="blue">'+ confirmSuccessButtontext +'</button><button id="smartpopup-confirm-false" class="blue">'+ confirmNoSuccessButtontext +'</button></div>';

        $.smartpopup({
            content: confirmContent,
            closeOnOutsideClick: false,
            onLoad : function(){
                $('#smartpopup-confirm-true').on('click', function(){
                    currentOpts.onClose = callback(true);
                    $.smartpopup.close();
                });
        
                $('#smartpopup-confirm-false').on('click', function(){
                    currentOpts.onClose = callback(false);
                    $.smartpopup.close();
                });
            },
            onOutsideClick : function(){
                $('#smartpopup-confirm-true').addClass("animate__animated animate__fast animate__shakeX");
                $('#smartpopup-confirm-false').css("animation-delay", "40ms");
                $('#smartpopup-confirm-false').addClass("animate__animated animate__fast animate__shakeX");

                setTimeout(function(){
                    $('#smartpopup-confirm-true').removeClass("animate__animated animate__fast animate__shakeX");
                    $('#smartpopup-confirm-false').removeClass("animate__animated animate__fast animate__shakeX");
                }, 1000);
            }
        });

        
    }

    // Create confirm-dialog
    $.smartpopup.alert = function(text, callback = function(){}){
        var alertContent= '<div class="smartpopup-confirm-text">' + text + '</div>';
        alertContent += '<div class="smartpopup-confirm-buttons"><button id="smartpopup-confirm-true" class="blue">'+ alertButtonText +'</button></div>';

        $.smartpopup({
            content: alertContent,
            closeOnOutsideClick: true,
            onLoad : function(){
                $('#smartpopup-confirm-true').on('click', function(){
                    currentOpts.onClose = callback(true);
                    $.smartpopup.close();
                });
            }
        });

        
    }

    $(function(){
        // Open Link in smartpopup
        $('a.smartpopup').on('click', function(e){
            var url = $(this).attr("href");
            e.preventDefault();
            $.smartpopup({
                showCloseButton : true,
                url : url
            });
        });
    });

})(jQuery);
