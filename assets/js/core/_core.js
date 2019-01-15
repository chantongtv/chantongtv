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



var config = {
    apiKey: "AIzaSyBORHWLZMvNhezuRfffymO7ppIgR07y1Mc",
    authDomain: "chantongtv-portfolio.firebaseapp.com",
    databaseURL: "https://chantongtv-portfolio.firebaseio.com",
    storageBucket: "chantongtv-portfolio.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

$(document).ready(function () {
    APP.core.Main.init();
});