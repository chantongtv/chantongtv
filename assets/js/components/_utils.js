/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

APP.component.Utils = {

    init : function () {
        this.setup();
    },

    setup : function () {



    },

    tratarUrl: function(url){

        var ambiente = urlBase.substring(0, urlBase.length - 1);

            var ret = ambiente + url;
            return ret;
    },

    getUrlAmbiente : function () {

        var url = (window.location.href);
        var protocol = window.location.protocol;
        var host = window.location.host;
        var pathname = window.location.pathname;
        var newURL = protocol + "//" + host;
        return newURL;
        
    },

    getController: function () {

        var controller = $('meta[name=controller]').attr('content');
        return controller ? controller : false;

    },

    getPage: function () {

        var page = $('meta[name=page]').attr('content');
        return page ? page : false;
    
    },

    getUrlParameter : function (_parameter) {

        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === _parameter) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }

    },

    getLogin : function () {

        var login = $('meta[name=login]').attr('content');
        return login ? true : false;
    
    },  

};


