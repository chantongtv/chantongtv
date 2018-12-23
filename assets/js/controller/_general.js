/*
|--------------------------------------------------------------------------
| General
|--------------------------------------------------------------------------
*/

APP.controller.General = {
 
	init : function () {

		this.start();
		this.funcao();
 
    },

	start : function() {

		APP.component.LocalStorage.init();
		APP.component.Menu.init();

	},
 
	funcao : function () {

		// APP.controller.Main.init();

	}

}
