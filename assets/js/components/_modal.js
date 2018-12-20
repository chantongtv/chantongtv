
/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

APP.component.Modal = {

    init : function () {
        
        this.setup();
        this.modal();
        
    },


    setup : function () {

        //

    },

    modal : function() {
    
    	$('a[rel=modal]').on('click', function(event) {
            event.preventDefault();
            $($(this).attr('href')+', #mask').fadeIn('fast', function() {

            });
        });

        $('body').on("click", ".modal .close, .modal .false, #mask", function(event) {
            event.preventDefault();
            if ($('.modal:visible').length > 1) {
                $('.modal, #mask').fadeOut();                
            } else {
                $('.modal, #mask').fadeOut();
            }
        });
    	
    },

};

