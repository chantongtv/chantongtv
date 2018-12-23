/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var $itens;
APP.controller.Home = {

    init : function () {
        this.filterItensGallery();
        this.toggleMenu();
    },

    filterItensGallery : function () {

        var $itens = $('section#gallery div.items').isotope({
            layoutMode: 'fitRows'
        });

        // filter items on button click
        $('section#gallery ul.filters').on('click', 'a', function(event) {
            event.preventDefault();

            $(this).parents('ul').find('li a').removeClass('active')
            $(this).addClass('active')

            var filterValue = $(this).attr('href');

            console.log(filterValue)

            $itens.isotope({ filter: filterValue });
        });

    },

    toggleMenu : function () {
        $('body').on('click', '.toggleMenu', function(event) {
            event.preventDefault();
            $(this).toggleClass('active');
            $(this).parent().toggleClass('active');
        });
    },

};