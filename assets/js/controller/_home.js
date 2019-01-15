/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var data;
var $itens;
APP.controller.Home = {

    init : function () {
        this.fillContentFirebase();
    },

    setup : function () {
        this.filterItens();                
        this.scrollFilters();
        this.menu();
        this.clicksItemGallery();

        $('section#portfolio ul.filters').find('li a').first().click();

        $(window).stellar({
            responsive: true,
            hideDistantElements: false,
        });



        setTimeout(function() {
            $('#loading').fadeOut();
            $('body').removeClass('loading');                
        }, 1000);
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

    scrollFilters : function () {
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            if (scroll >= $('section#portfolio').offset().top - 100) {
                $('section#portfolio ul.filters').addClass('fixed')
            } else {
                $('section#portfolio ul.filters').removeClass('fixed')
            }
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
            $('.toggleMenu, header#main div.wrap').removeClass('active');

            var hash = $(this).attr('href')

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80
            }, 400, function(){
                // window.location.hash = hash;
            });
            
        });
    },

    clicksItemGallery : function () {
        $('body').on('click', '.items-wrap .items .item', function(event) {
            event.preventDefault();
            var idItem = $(this).attr('data-id');
            APP.controller.Home.openItemGallery(idItem);
        });

        $('body').on('click', 'aside#itemGallery div.overlay', function(event) {
            event.preventDefault();
            $('aside#itemGallery').removeClass('active');
            $('body').removeClass('lockScroll');
            setTimeout(function() {
                $('aside#itemGallery div.content').html("");
            }, 300);
        });
    },

    openItemGallery : function () {
        $('aside#itemGallery').addClass('active');
        $('body').addClass('lockScroll');
    },

    fillContentFirebase : function () {
        
        database.ref('/').once('value').then(function(snapshot) {
            data = snapshot.val()

            // Vídeo do topo
            var hero = $('section#hero video').attr('src', data["heroVideo"]);

            // Vídeos em destaque
            var videoEl = $('.featured .video');
            $.each(data['featuredVideos'], function(index, val) {
                videoEl.append(`
                    <iframe class="${index}" src="https://player.vimeo.com/video/${val}?title=0&byline=0&portrait=0" style="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                `)
            });

            // Itens da galeria
            var wrap = $('.items-wrap .items');
            $.each(data['gallery'], function(index, val) {
                wrap.append(`
                    <div data-item="${val.id}" class="item ${val.category}" style="background-image: url(${val.thumb})">
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                `)
            });

        }).then(function() {

            // Setup dos plugins
            APP.controller.Home.setup();

        })
    },

};