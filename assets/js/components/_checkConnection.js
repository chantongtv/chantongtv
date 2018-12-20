/*
|--------------------------------------------------------------------------
| Check Connection
|--------------------------------------------------------------------------
*/

APP.component.CheckConnection = {

    init : function () {

        this.setup();
        //this.checkConnection();

    },

	setup : function () {

        window.addEventListener('online',  APP.component.CheckConnection.checkConnection);
        window.addEventListener('offline', APP.component.CheckConnection.checkConnection);
        //console.log(!navigator.onLine);

	},

	checkConnection : function () {

        if (!navigator.onLine) {
            $('body').addClass('lockScroll');
            $('body #check-connection').css('display', 'flex').hide().fadeIn(400);
        } else {
            $('body').removeClass('lockScroll');
            $('body #check-connection').fadeOut(400);		
        }

	},
    
};

