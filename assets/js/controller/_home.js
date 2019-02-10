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

        $('#loading').fadeOut();
        $('body').removeClass('loading');                
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

        $('body').on('click', 'nav#main a, a.logo, a.scrollBottom', function(event) {
            event.preventDefault();
            $('.toggleMenu, header#main div.wrap').removeClass('active');

            var hash = $(this).attr('href')

            $('html').animate({
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

        $('body').on('click', 'aside#itemGallery div.overlay, aside#itemGallery a.close', function(event) {
            event.preventDefault();
            $('aside#itemGallery').removeClass('active');
            $('aside#itemGallery div.content').html("");
            $('body').removeClass('lockScroll');
        });
    },

    openItemGallery : function (idItem) {

        var dataItem = data["gallery"][idItem];
        var content = $('aside#itemGallery div.content');

        content.append(`
            <div class="header">
                <a class="close"><i class="fas fa-times"></i></a>
                <div class="thumb" style="background-image: url(${dataItem.thumb})"></div>
                <h2>${dataItem.name}</h2>
                <h3>
                    ${dataItem.category.map(function(cat, index) {
                        return cat + (index === dataItem.category.length - 1 ? "" : " / ");
                    }).join("")}
                </h3>
            </div>
            ${typeof(dataItem.featured) === "undefined" || dataItem.featured === "" 
                ? `
                    <div class="featured">
                        <div class="embed">
                            <iframe src="https://player.vimeo.com/video/IDVIMEO?title=0&byline=0&portrait=0" style="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        </div>
                    </div>
                `
                : `` 
            }
            ${typeof(dataItem.desc) === "undefined" || dataItem.desc === "" ? "" : `<div class="desc">${dataItem.desc}</div>`}
            <div class="media">
                ${dataItem.media.map(function(media, index) {
                    if (media.type === "image") {
                        return `<img data-order="${media.order}" src="${media.url}" />`;
                    } else if (media.type === "video") {
                        return `<video controls data-order="${media.order}" src="${media.url}"></video>`;
                    } else if (media.type === "embed") {
                        return `<div data-order="${media.order}" class="embed">${media.url}</div>`;
                    }
                }).join("")}
            </div>

            <div class="chantong">
                <img src="/assets/img/logo.png" alt="" />
                Chan Tong
            </div>
        `)

        tinysort('aside#itemGallery>div.content>div.media>*',{attr:'data-order'});

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
                var vimeoId = val.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
                videoEl.append(`
                    <iframe class="${index}" src="https://player.vimeo.com/video/${vimeoId[1]}?title=0&byline=0&portrait=0" style="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                `)
            });

            // Itens da galeria
            var wrap = $('.items-wrap .items');
            $.each(data['gallery'], function(index, val) {
                var categories = "";
                $.each(val.category, function(i, cat) {
                    categories += " _" + cat;
                });
                wrap.append(`
                    <div data-order="${val.order}" data-id="${index}" class="item${categories}" style="background-image: url(${val.thumb})">
                        <span>${val.name}</span>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                `)
            });

            tinysort('.items-wrap .items .item',{attr:'data-order'});

        }).then(function() {

            // Setup dos plugins e fadeout do loading
            setTimeout(function() {
                APP.controller.Home.setup();
            }, 1000);

        })
    },

};