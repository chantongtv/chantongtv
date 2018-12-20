/*
|--------------------------------------------------------------------------
| Core
|--------------------------------------------------------------------------
*/

APP.core.Main = {

    init: function() {
        APP.controller.General.init(); 
        this.loadPageController();
    },

    loadPageController: function () {
        var ctrl = APP.component.Utils.getController();
        
        if (ctrl != '') {
            APP.controller[ctrl].init();
        }

    }
    
};

/*
|--------------------------------------------------------------------------
| Chamada
|--------------------------------------------------------------------------
*/

$(document).ready(function () {

    APP.core.Main.init();

});