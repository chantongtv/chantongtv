/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var $itens;
APP.controller.Home = {

    init : function () {
        this.fillFeaturedVideos();
        this.menu();        
    },

    filterItens : function () {

        var $itens = $('section#portfolio div.items').isotope({
            layoutMode: 'fitRows'
        });

        // filter items on button click
        $('section#portfolio ul.filters').on('click', 'a', function(event) {
            event.preventDefault();

            $(this).parents('ul').find('li a').removeClass('active')
            $(this).addClass('active')

            var filterValue = $(this).attr('href');

            $('.featured .video').find('iframe').each(function(index, el) {
                var src = $(this).attr('src');
                $(this).attr('src', src + "&random=" + parseInt(Math.random() * 1000000000000))
                $(this).removeClass('active');
            });
            $('.featured .video').find('.' + filterValue.split('._')[1]).addClass('active');
            

            $itens.isotope({ filter: filterValue });
        });

    },

    menu : function () {
        $('body').on('click', '.toggleMenu', function(event) {
            event.preventDefault();
            $(this).toggleClass('active');
            $(this).parent().toggleClass('active');
        });

        $('body').on('click', 'nav#main a, a.logo', function(event) {
            event.preventDefault();
            $('.toggleMenu, header div.wrap').removeClass('active');

            var hash = $(this).attr('href')

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 400, function(){
                // window.location.hash = hash;
            });
            
        });


    },

    fillFeaturedVideos : function () {

        database.ref('/featuredVideos').once('value').then(function(snapshot) {
            var video = $('.featured .video');
            $.each(snapshot.val(), function(index, val) {
                if (index == "2d") {}
                video.append(`
                    <iframe class="${index} ${index == "2d" ? "active" : ""}" src="https://player.vimeo.com/video/${val}?title=0&byline=0&portrait=0" style="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                `)
            });
        }).then(function() {
            APP.controller.Home.fillGallery();
        })
    },

    fillGallery : function () {
        database.ref('/gallery').once('value').then(function(snapshot) {
            var wrap = $('.items-wrap .items');
            $.each(snapshot.val(), function(index, val) {
                wrap.append(`
                    <div data-item="${val.id}" class="item ${val.category}" style="background-image: url(${val.thumb})">
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                `)
            });
        }).then(function() {
            setTimeout(function() {
                APP.controller.Home.filterItens();                

                $('section#portfolio ul.filters').find('li a').first().click();

                $('#loading').fadeOut();
                $('body').removeClass('loading')

                $(window).stellar({
                    responsive: true,
                    hideDistantElements: false,
                });

            }, 250);
        });
    }

};