/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/

APP.controller.Main = {

    init : function () {

        this.setup();
        this.main();

    },

    setup : function () {

        //

    },

    //Models
    models : {

        //PerfilUsuarioModel: APP.model.PerfilUsuario,

    },

    //Global
    onUserLoaded : function() {},
    
    //Main
    main : function () {
        
        APP.component.CheckConnection.init();
        APP.component.Modal.init();
        this.setScroll();

    },

    setScroll : function () {

		$(window).bind('scroll', function() {

            if ( $(".modal:visible").length > 0 ) {
				$(".modal").center();
			}

        });
        
        // $(window).on("navigate", function (event, data) {
        //     var direction = data.state.direction;
        //     if (direction == 'back') {
        //       console.log('back')
        //     }
        //     if (direction == 'forward') {
        //         console.log('forward')
        //     }
        //   });

    },

};