/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var data;
var $itensJobs;
var $itensPersonalWorks;
let simplebar;
APP.controller.Home = {

    init : function () {
        this.fillContentFirebase();
    },

    setup : function () {
        this.filterItens();                
        this.scrollFilters();
        this.menu();
        this.clicksItemGallery();
        this.clicksItemPersonalWorks();

        $('section#portfolio ul.filters').find('li a').first().click();

        $(window).stellar({
            responsive: true,
            hideDistantElements: false,
        });

        simplebar = new SimpleBar($('aside#itemGallery div.content')[0], {
            forceVisible: true,
            autoHide: false,
        });

        $('section#portfolio div.items').imagesLoaded( function() {
            var $itensJobs = $('section#portfolio #jobs div.items').isotope({
                layoutMode: 'fitRows'
            });

            var $itensPersonalWorks = $('section#portfolio #personalworks div.items').isotope({
            });
            
            $('#loading').fadeOut();
            $('body').removeClass('loading');                
        });

    },

    filterItens : function () {

        

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
            

            $('section#portfolio div#jobs div.items').isotope({ filter: filterValue });
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

            if (scroll >= $('section#portfolio').offset().top - 100 && scroll <= $('div#personalworks').offset().top - 100) {
                $('section#portfolio ul.filters').removeClass('hide')
            } else {
                $('section#portfolio ul.filters').addClass('hide')
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
        $('body').on('click', '#jobs.items-wrap .items .item', function(event) {
            event.preventDefault();
            var idItem = $(this).attr('data-id');
            APP.controller.Home.openItemGallery(idItem);
        });

        $('body').on('click', 'aside#itemGallery div.overlay, aside#itemGallery a.close', function(event) {
            event.preventDefault();
            // $('aside#itemGallery div.content').mCustomScrollbar('destroy');
            $('aside#itemGallery').removeClass('active');
            $('aside#itemGallery div.content div.scrollbar').html("");
            $('body, html').removeClass('lockScroll');
        });
    },

    openItemGallery : function (idItem) {
        $('#loading').stop().fadeIn();

        var dataItem = data["gallery"][idItem];
        var content = $('aside#itemGallery div.content div.scrollbar');

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
            <div class="wrap">
                <div class="featured">
                    ${dataItem.media.map(function(media, index) {
                        if (media.type === "image" && media.featured) {
                            return `<img data-order="${media.url.split('.').pop().split('?')[0] === "gif" ? media.order + 100 : media.order}" src="${media.url}" class="grid-item ${media.url.split('.').pop().split('?')[0]}" />`;
                        } else if (media.type === "video" && media.featured) {
                            return `<div class="grid-item video" data-order="${media.order}"><video controls src="${media.url}"></video></div>`;
                        } else if (media.type === "embed" && media.featured) {
                            return `<div data-order="${media.order}" class="grid-item embed">${media.url}</div>`;
                        }
                    }).join("")}
                </div>

                ${typeof(dataItem.desc) === "undefined" || dataItem.desc === "" ? "" : `<div class="desc">${dataItem.desc}</div>`}
                <div class="media${dataItem.media.length < 2 ? " full" : ""}" >
                    <div class="grid-sizer"></div>
                    ${dataItem.media.map(function(media, index) {
                        if (media.type === "image" && !media.featured) {
                            return `<img data-order="${media.url.split('.').pop().split('?')[0] === "gif" ? media.order + 100 : media.order}" src="${media.url}" class="grid-item ${media.url.split('.').pop().split('?')[0]}" />`;
                        } else if (media.type === "video" && !media.featured) {
                            return `<div class="grid-item video" data-order="${media.order}"><video controls src="${media.url}"></video></div>`;
                        } else if (media.type === "embed" && !media.featured) {
                            return `<div data-order="${media.order}" class="grid-item embed">${media.url}</div>`;
                        }
                    }).join("")}
                </div>

                <div class="chantong">
                    <img src="/assets/img/logo.png" alt="" />
                    Chan Tong
                </div>
            </div>
        `)


        var $grid = $('aside#itemGallery div.media').imagesLoaded( function() {
            tinysort('aside#itemGallery>div.content>div.scrollbar>div.media>*',{attr:'data-order'});
            $('aside#itemGallery').addClass('active');
            $('body, html').addClass('lockScroll');

            setTimeout(function() {
                $grid.masonry({
                  // set itemSelector so .grid-sizer is not used in layout
                  itemSelector: '.grid-item',
                  // use element for option
                  columnWidth: '.grid-sizer',
                  percentPosition: true,
                })
            }, 200);
            
            if (isMobile.any) {
                $('aside#itemGallery div.content').addClass('mobile')
            }
            console.log("carregou as imagens")
            $('#loading').stop().fadeOut();
        });

    },

    clicksItemPersonalWorks : function () {
        $('body').on('click', '#personalworks.items-wrap .items .item', function(event) {
            event.preventDefault();
            var idItem = $(this).attr('data-id');
            APP.controller.Home.openItemPersonalWorks(idItem);
        });

        $('body').on('click', 'div#modalPersonalWorks div.overlay, div#modalPersonalWorks a.close', function(event) {
            event.preventDefault();
            // $('aside#itemGallery div.content').mCustomScrollbar('destroy');
            $('div#modalPersonalWorks').removeClass('active');
            $('div#modalPersonalWorks div.content').html("");
            $('div#modalPersonalWorks div.media').slick('destroy');
            $('body, html').removeClass('lockScroll');
        });
    },

    openItemPersonalWorks : function (idItem) {
        $('#loading').stop().fadeIn();

        var dataItem = data["personalworks"][idItem];
        var content = $('div#modalPersonalWorks div.content');

        content.append(`
            <div class="header">
                <a class="close"><i class="fas fa-times"></i></a>
                <h2>${dataItem.name}</h2>
            </div>
            <div class="wrap">
                <div class="media" >
                    ${dataItem.media.map(function(media, index) {
                        if (media.type === "image" && !media.featured) {
                            return `<img data-order="${media.url.split('.').pop().split('?')[0] === "gif" ? media.order + 100 : media.order}" src="${media.url}" class="grid-item ${media.url.split('.').pop().split('?')[0]}" />`;
                        } else if (media.type === "video" && !media.featured) {
                            return `<div class="grid-item video" data-order="${media.order}"><video controls src="${media.url}"></video></div>`;
                        } else if (media.type === "embed" && !media.featured) {
                            return `<div data-order="${media.order}" class="grid-item embed">${media.url}</div>`;
                        }
                    }).join("")}
                </div>
            </div>
        `)


        var $grid = $('div#modalPersonalWorks div.media').imagesLoaded( function() {
            tinysort('div#modalPersonalWorks>div.content>div.scrollbar>div.media>*',{attr:'data-order'});
            $('div#modalPersonalWorks').addClass('active');
            $('body, html').addClass('lockScroll');

            // setTimeout(function() {
            //     $grid.masonry({
            //       // set itemSelector so .grid-sizer is not used in layout
            //       itemSelector: '.grid-item',
            //       // use element for option
            //       columnWidth: '.grid-sizer',
            //       percentPosition: true,
            //     })
            // }, 200);
            
            if (isMobile.any) {
                $('div#modalPersonalWorks div.content').addClass('mobile')
            }

            $('div#modalPersonalWorks div.media').slick({
                nextArrow: `<a class="next"><i class="fas fa-chevron-right"></i></a>`,
                prevArrow: `<a class="prev"><i class="fas fa-chevron-left"></i></a>`,
                adaptiveHeight: true
            });
            console.log("carregou as imagens")
            $('#loading').stop().fadeOut();
        });

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

            // Itens Jobs
            var wrap = $('#jobs.items-wrap .items');
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

            tinysort('#jobs.items-wrap .items .item',{attr:'data-order'});

            // Itens Personal Works
            var wrap = $('#personalworks.items-wrap .items');
            $.each(data['personalworks'], function(index, val) {
                var categories = "";
                $.each(val.category, function(i, cat) {
                    categories += " _" + cat;
                });
                var imageFeatured = "";
                $.each(val.media, function(i, feat) {
                    feat.featured ? imageFeatured = feat.url : "";
                });
                wrap.append(`
                    <div data-order="${val.order}" data-id="${index}" class="item${categories}">
                        <span>${val.name}</span>
                        <img src="${imageFeatured != "" ? imageFeatured : val.media[0].url}" alt="" class="ratio">
                    </div>
                `)
            });

            tinysort('#personalworks.items-wrap .items .item',{attr:'data-order'});

        }).then(function() {

            // Setup dos plugins e fadeout do loading
            setTimeout(function() {
                APP.controller.Home.setup();
            }, 1000);

        })
    },

};