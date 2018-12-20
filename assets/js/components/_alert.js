
/*
|--------------------------------------------------------------------------
| Alert
|--------------------------------------------------------------------------
*/

APP.component.Alert = {

    init : function () {

        this.setup();

    },


    setup : function () {



    },

    generico : function (_name) {

        var m = $('.modal'+_name+'');

        $("#mask").fadeIn(200, function() {
            m.center();
            m.fadeIn(200, function() {
                m.center();
            });		
        });

    },

    
    customAlert : function (title, message, action, actionTxt) {

        var m = $(".modal#customAlert");
    
        // Reset
        m.find(".title, .actions").hide();
        m.find(".actions a.action").attr("class", "btn action");
        m.find(".message, .title, .actions a.action").html("");
    
        if (title) {
            m.find(".title").show();
            m.find(".title").html(title);
        }
        if (action) {
            m.find(".actions").show();
            m.find(".actions a.action").addClass(action);
            m.find(".actions a.action").html(actionTxt);
        }
        m.find(".message").html(message);
    
        $("#mask").fadeIn(200, function() {
            m.center();
            m.fadeIn(200, function() {
                m.center();
            });		
        });
    
    },
    
    customConfirm : function (title, message, confirmTxt, confirmAction, cancelTxt, cancelAction) {
        
        var m = $(".modal#customConfirm");
    
        // Reset
        m.find(".title").hide();
        m.find(".actions").show();
        m.find(".message, .title, .actions a.btn").html("");
    
        if (title) {
            m.find(".title").show();
            m.find(".title").html(title);
        }
    
        m.find(".actions a.false").addClass(cancelAction);
        m.find(".actions a.false").html(cancelTxt);
    
        m.find(".actions a.true").addClass(confirmAction);
        m.find(".actions a.true").html(confirmTxt);
    
        m.find(".message").html(message);
    
        $("#mask").fadeIn(200, function() {
            m.center();
            m.fadeIn(200, function() {
                m.center();
            });		
        });
    
    },

    customHtml : function (title, message, html, actionTxt, action, actionSecTxt, actionSec) {

        var m = $(".modal#customHtml");
    
        // Reset
        m.find(".title, .actions, .html").hide();
        m.find(".title, a.action, a.actionSec").hide();
        m.find(".message, .title, .actions a.action, .actions a.actionSec").html("");
    
        if (title) {
            m.find(".title").show();
            m.find(".title").html(title);
        }

        m.find(".message").html(message);

        if (action) {
            m.find(".html").show();
            m.find(".html").html(html);
        }

        if (action) {
            m.find(".actions").show();
            m.find(".actions a.action").show()
            m.find(".actions a.action").addClass(action);
            m.find(".actions a.action").html(actionTxt);
        }

        if (actionSec) {
            m.find(".actions").show();
            m.find(".actions a.actionSec").show()
            m.find(".actions a.actionSec").addClass(actionSec);
            m.find(".actions a.actionSec").html(actionSecTxt);
        }
    
        $("#mask").fadeIn(200, function() {
            m.center();
            m.fadeIn(200, function() {
                m.center();
            });		
        });
    
    },

    customErros : function (erros) {

        var m = $(".modal#customErros");

        m.find(".erros").html("");

        var html = '<ul>';
        $(erros).each(function (e) {
            html += '<li>'+this+'</li>';
        });
        html += '</ul>'

        m.find(".erros").append(html);
    
        $("#mask").fadeIn(200, function() {
            m.center();
            m.fadeIn(200, function() {
                m.center();
            });		
        });
    
    },
    
};

