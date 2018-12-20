/*
|--------------------------------------------------------------------------
| Menu
|--------------------------------------------------------------------------
*/
APP.component.Menu = {

    init : function () {
        
        this.setup();
        this.menu();

    },

    setup : function () {

        

    },

    menu : function () {

        this.openMenu();


    },

    openMenu : function () {

        $('.open-menu').on('click', function (event) {

            event.preventDefault();

            $('.menu').toggleClass('active');
            $('.open-menu').toggleClass('active');
            $('section').toggleClass('blur');

        });

    },

};


