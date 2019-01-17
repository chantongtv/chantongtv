/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var data;
var $itens;
APP.controller.Admin = {

    init : function () {
        // this.fillFeaturedVideos();
        // this.menu();
        this.actionsLogin();
        this.checkLogged();
    },

    setup : function () {
        APP.controller.Admin.tabsShowAndHide();
        APP.controller.Admin.reorderGallery();

        APP.controller.Admin.actionsHeroVideo();

        $('#loading').fadeOut();
        $('body').removeClass('loading');  
    },

    // Login e Logout
    checkLogged : function () {
        firebase.auth().onAuthStateChanged(function() {
            if (firebase.auth().currentUser === null) {
                $('#loading').fadeOut();
                $('body').removeClass('loading'); 
                $('section#login').show();
                $('section#admin').hide();
            } else {
                $('section#login').hide();
                $('section#admin').show();
                APP.controller.Admin.fillContentFirebase();
            }
        });     
    },
    actionsLogin : function () {
        $('body').on('submit', 'section#login form', function(event) {
            event.preventDefault();
            var email = $('section#login form #email').val();
            var password = $('section#login form #password').val();
            APP.controller.Admin.submitLogin(email, password);
        });
    },
    submitLogin : function (email, password) {
        $('#loading').fadeIn();
        $('body').addClass('loading');

        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            
        });
    },

    // Geral
    tabsShowAndHide : function () {
        $('body').on('click', '.box > h2', function(event) {
            event.preventDefault();
            $(this).next().slideToggle();
            $(this).toggleClass('active')
        });
    },

    fillContentFirebase : function () {
        
        database.ref('/').once('value').then(function(snapshot) {
            data = snapshot.val()

            // Vídeo do topo
            $('section#admin div#heroVideo video').attr('src', data["heroVideo"]);

            // Vídeos em destaque
            $.each(data['featuredVideos'], function(index, val) {
                var vimeoId = val.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
                $('section#admin div#featuredVideos div.item.'+index + ' iframe').attr('src', `https://player.vimeo.com/video/${vimeoId[1]}?title=0&byline=0&portrait=0`)
            });

            // Itens da galeria
            var wrap = $('section#admin div#gallery div.items');
            $.each(data['gallery'], function(index, val) {
                wrap.append(`               
                    <div data-order="${val.order}" data-id="${index}" class="item" style="background-image: url(${val.thumb})">
                        <span>${val.name}</span>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                `)
            });

            tinysort('section#admin div#gallery div.items div.item',{attr:'data-order'});

        }).then(function() {

            // Setup dos plugins e fadeout do loading
            setTimeout(function() {
                APP.controller.Admin.setup();
            }, 1000);

        })
    },

    // Vídeo principal do topo
    actionsHeroVideo : function () {
        $('body').on('change', 'input#uploadHeroVideo', function(event) {
            event.preventDefault();
            var file = $(this)[0].files[0];
            APP.controller.Admin.uploadHeroVideo(file);
        });

    },
    uploadHeroVideo : function (file) {

        $('#loading').fadeIn();
        $('body').addClass('loading');

        console.log(file);

        var uploadTask = firebase.storage().ref().child('heroVideo/' + file.name).put(file);

        uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
          // Handle unsuccessful uploads
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(url) {

            database.ref('/heroVideo').set(url);
            $('section#admin div#heroVideo video').attr('src', url);
            
            $('#loading').fadeOut();
            $('body').removeClass('loading');

          });
        });

    },

    // Vídeos em destaque na Galeria

    // Galeria
    actionsGallery : function () {
        $('body').on('click', 'div#gallery div.items div.item', function(event) {
            event.preventDefault();
            // alert('opa')
        });
    },
    reorderGallery : function () {
        $('div#gallery div.items').dragsort({ 
            dragSelector: ".item", 
            dragEnd: function() {
                APP.controller.Admin.saveGalleryOrder();
            }, 
            dragBetween: false, 
            placeHolderTemplate: "<div class='placeholder'></div>" 
        });
    },
    saveGalleryOrder : function () {
        $('section#admin div#gallery div.items div.item').each(function(index, el) {
            var index = $(this).index();
            var id = $(this).attr('data-id');

            database.ref('/gallery/'+id+'/order').set(index);

        });
    },
    saveGalleryItem : function () {

    },

};