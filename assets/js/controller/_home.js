/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var $itens;
APP.controller.Home = {

    init : function () {
        this.filterItensGallery();
        this.menu();
    },

    filterItensGallery : function () {

        var $itens = $('section#portfolio div.items').isotope({
            layoutMode: 'fitRows'
        });

        // filter items on button click
        $('section#portfolio ul.filters').on('click', 'a', function(event) {
            event.preventDefault();

            $(this).parents('ul').find('li a').removeClass('active')
            $(this).addClass('active')

            var filterValue = $(this).attr('href');

            $itens.isotope({ filter: filterValue });
        });

    },

    menu : function () {
        $('body').on('click', '.toggleMenu', function(event) {
            event.preventDefault();
            $(this).toggleClass('active');
            $(this).parent().toggleClass('active');
        });

        $('body').on('click', 'nav#main a', function(event) {
            event.preventDefault();
            $('.toggleMenu, header div.wrap').toggleClass('active');

            var hash = $(this).attr('href')

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 400, function(){
                // window.location.hash = hash;
            });
            
        });


    },

};