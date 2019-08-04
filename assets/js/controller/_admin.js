/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
var data;
var $itens;
var gModal = $('#editAddGalleryItemModal');
var pModal = $('#editAddPersonalWorksItemModal');
var descTextbox;
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
        APP.controller.Admin.reorderPersonalWorks();
        
        APP.controller.Admin.actionsHeroVideo();
        APP.controller.Admin.actionsFeaturedVideos();

        APP.controller.Admin.actionsGallery();
        APP.controller.Admin.actionsGalleryItem();

        APP.controller.Admin.actionsPersonalWorks();
        APP.controller.Admin.actionsPersonalWorksItem();

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

            // Itens Jobs
            var wrap = $('section#admin div#gallery div.items');
            $.each(data['gallery'], function(index, val) {
                wrap.append(`               
                    <div data-order="${val.order}" data-id="${index}" class="item" style="background-image: url(${val.thumb})">
                        <span>${val.name}</span>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                        <a href="#" class="editItem"><i class="fas fa-edit"></i></a>
                        <a href="#" class="deleteItem"><i class="fas fa-trash"></i></a>
                    </div>
                `)
            });

            // Itens Personal Works
            var wrap = $('section#admin div#personalworks div.items');
            $.each(data['personalworks'], function(index, val) {
                var imageFeatured = "";
                $.each(val.media, function(i, feat) {
                    feat.featured ? imageFeatured = feat.url : "";
                });
                wrap.append(`               
                    <div data-order="${val.order}" data-id="${index}" class="item" style="background-image: url(${imageFeatured != "" ? imageFeatured : val.media[0].url})">
                        <span>${val.name}</span>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                        <a href="#" class="editItem"><i class="fas fa-edit"></i></a>
                        <a href="#" class="deleteItem"><i class="fas fa-trash"></i></a>
                    </div>
                `)
            });

            tinysort('section#admin div#personalworks div.items div.item',{attr:'data-order'});

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

    uploadGalleryThumbImage : function (file) {

        $('#loading').fadeIn();
        $('body').addClass('loading');

        console.log(file);

        var uploadTask = firebase.storage().ref().child('gallery/thumbs/' + moment().format("X") + "_" + file.name).put(file);

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

            gModal.find('div.thumbnail div.ratio').css('background-image', 'url(' + url + ')');
            
            $('#loading').fadeOut();
            $('body').removeClass('loading');

          });
        });

    },
    uploadGalleryItemVideo : function (file, indexItem) {

        $('#loading').fadeIn();
        $('body').addClass('loading');

        console.log(file);

        var uploadTask = firebase.storage().ref().child('gallery/videos/' + moment().format("X") + "_" + file.name).put(file);

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
            
            $(gModal.find('div.item')[indexItem]).find('video').attr('src', url);

            $('#loading').fadeOut();
            $('body').removeClass('loading');

          });
        });

    },
    uploadGalleryItemImage : function (file, indexItem) {

        $('#loading').fadeIn();
        $('body').addClass('loading');

        console.log(file);

        var uploadTask = firebase.storage().ref().child('gallery/images/' + moment().format("X") + "_" + file.name).put(file);

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

            $(gModal.find('div.item')[indexItem]).find('> img').attr('src', url)
            
            $('#loading').fadeOut();
            $('body').removeClass('loading');

          });
        });

    },

    uploadPersonalWorksItemImage : function (file, indexItem) {

        $('#loading').fadeIn();
        $('body').addClass('loading');

        console.log(file);

        var uploadTask = firebase.storage().ref().child('personalworks/images/' + moment().format("X") + "_" + file.name).put(file);

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

            $(pModal.find('div.item')[indexItem]).find('> img').attr('src', url)
            
            $('#loading').fadeOut();
            $('body').removeClass('loading');

          });
        });

    },


    // Vídeos em destaque na Galeria
    actionsFeaturedVideos : function () {
        $('body').on('click', 'div#featuredVideos a.changeUrlFeaturedVideos', function(event) {
            event.preventDefault();
            var category = $(this).data('category');
            APP.controller.Admin.openModalFeaturedVideo(category);
        });

        $('body').on('click', 'div#changeFeaturedVideoModal', function(event) {
            event.preventDefault();
            if ($(event.originalEvent.target).hasClass('modal-wrap')) {
                $('#changeFeaturedVideoModal').fadeOut(300, function() {
                    $('#changeFeaturedVideoModal div.wrap').html("");
                });
            }
        });
        $('body').on('click', 'div#changeFeaturedVideoModal a.changeFeaturedVideo', function(event) {
            event.preventDefault();
            var category = $(this).data('category');
            var url = $("div#changeFeaturedVideoModal input").val()
            APP.controller.Admin.changeFeaturedVideo(url, category);
        });
    },
    openModalFeaturedVideo : function (category) {
        database.ref('/featuredVideos/'+category).once('value').then(function(snapshot) {
            var urlVideo = "";
            urlVideo = snapshot.val();
            $('#changeFeaturedVideoModal div.wrap').html("");
            $('#changeFeaturedVideoModal div.wrap').append(`
                <h3>Alterar URL do vídeo em destaque da categoria ${category}</h3>
                <input type="text" value="${urlVideo}" />
                <a href="#" class="changeFeaturedVideo" data-category="${category}">Alterar URL</a>
            `)
            $('#changeFeaturedVideoModal').css("display", "flex").hide().fadeIn();
        });        
    },
    changeFeaturedVideo : function (url, category) {
        database.ref('/featuredVideos/'+category).set(url);

        var vimeoId = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
        $('section#admin div#featuredVideos div.item.'+category + ' iframe').attr('src', `https://player.vimeo.com/video/${vimeoId[1]}?title=0&byline=0&portrait=0`);

        $('#changeFeaturedVideoModal').fadeOut(300, function() {
            $('#changeFeaturedVideoModal div.wrap').html("");
        });
    },

    // Jobs
    actionsGallery : function () {
        $('body').on('click', 'div#gallery div.items div.item a.editItem', function(event) {
            event.preventDefault();
            var id = $(this).parent().data('id');
            APP.controller.Admin.editOrAddGalleryItem(id);
        });
        $('body').on('click', 'div#gallery div.items div.item a.deleteItem', function(event) {
            event.preventDefault();
            var id = $(this).parent().data('id');
            APP.controller.Admin.confirmDeleteGalleryItem(id);
        });
        $('body').on('click', 'div#gallery a.addNewItem', function(event) {
            event.preventDefault();
            APP.controller.Admin.editOrAddGalleryItem();
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
    actionsGalleryItem : function () {
        $('body').on('click', '#editAddGalleryItemModal a.save', function(event) {
            event.preventDefault();

            if (gModal.attr('data-id') != null) {
                var id = gModal.attr('data-id');
            } else {
                var id = moment().format('x');
            }
            var dataGalleryItem = {};

            // Categoria
            dataGalleryItem.category = [];
            $('#editAddGalleryItemModal .categories input:checked').each(function(index, el) {
                dataGalleryItem.category.push($(this).attr('id').replace('_', ''));
            });

            // Descrição
            dataGalleryItem.desc = descTextbox[0].content.get();

            // Mídia
            dataGalleryItem.media = [];
            $('#editAddGalleryItemModal .media div.items div.item').each(function(index, el) {
                var order = index;
                var type = $(this).attr('class').replace('item ', '');
                var featured = $(this).find('input[type=checkbox]').is(':checked');
                if (type == "video") { var url = $(this).find('video').attr('src')}
                if (type == "image") { var url = $(this).find('> img').attr('src')}
                if (type == "embed") { var url = $(this).find('.actions textarea').val()}
                dataGalleryItem.media.push({
                    order: order,
                    type: type,
                    url: url,
                    featured: featured
                })
            });

            // Nome
            dataGalleryItem.name = $('#editAddGalleryItemModal #name').val();

            // Ordem
            dataGalleryItem.order = $('#admin #gallery .items .item').length;

            // Thumbnail
            var reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
            var url = $('#editAddGalleryItemModal .thumbnail .ratio').css('background-image') === "none" ? "" : reg.exec($('#editAddGalleryItemModal .thumbnail .ratio').css('background-image'))[1];
            dataGalleryItem.thumb = url;

            if (window.confirm("Você realmente deseja salvar esse projeto?")) { 
                APP.controller.Admin.saveGalleryItem(dataGalleryItem, id);
                if (gModal.attr('data-id') === undefined) {

                    var wrap = $('section#admin div#gallery div.items');
                    wrap.append(`               
                        <div data-order="${dataGalleryItem.order}" data-id="${id}" class="item" style="background-image: url(${dataGalleryItem.thumb})">
                            <span>${dataGalleryItem.name}</span>
                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                            <a href="#" class="editItem"><i class="fas fa-edit"></i></a>
                            <a href="#" class="deleteItem"><i class="fas fa-trash"></i></a>
                        </div>
                    `)

                    tinysort('section#admin div#gallery div.items div.item',{attr:'data-order'});

                }
            }

        });
        $('body').on('click', '#editAddGalleryItemModal a.close', function(event) {
            if (window.confirm("Você realmente deseja sair desse projeto?")) { 
                $('#editAddGalleryItemModal').removeClass('active');
            }
        });
        $('body').on('click', '#editAddGalleryItemModal div.addMore a', function(event) {
            event.preventDefault();
            var type = $(this).data('type');
            APP.controller.Admin.addGalleryItemMedia(type);
        });
        $('body').on('click', '#editAddGalleryItemModal div.items div.item a.deleteItemProject', function(event) {
            event.preventDefault();
            $(this).parents('.item').remove();
            APP.controller.Admin.dragSortGalleryItemMedia();
        });
        $('body').on('change', '#editAddGalleryItemModal div.thumbnail input[type=file]', function(event) {
            event.preventDefault()
            var file = $(this)[0].files[0];
            APP.controller.Admin.uploadGalleryThumbImage(file);            
        });
        $('body').on('change', '#editAddGalleryItemModal div.items div.item.video input[type=file]', function(event) {
            event.preventDefault()
            var file = $(this)[0].files[0];
            var indexItem = $(this).parents('.item').index();
            APP.controller.Admin.uploadGalleryItemVideo(file, indexItem);            
        });
        $('body').on('change', '#editAddGalleryItemModal div.items div.item.image input[type=file]', function(event) {
            var file = $(this)[0].files[0];
            var indexItem = $(this).parents('.item').index();
            APP.controller.Admin.uploadGalleryItemImage(file, indexItem);
        });

        $('body').on('keyup', '#editAddGalleryItemModal div.items div.item.embed textarea', function(event) {
            var code = $(this).val()
            $(this).parents('.item').find('.wrap-item').html(`
                ${code}
                <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
            `)
        });        

    },
    resetEditOrAddGalleryItem : function () {
        gModal.removeAttr('data-id');
        gModal.find('div.content div.name input#name').val("");
        gModal.find('div.content div.categories input[type=checkbox]').prop('checked', false);
        gModal.find('div.content div.desc').html('<h3>Descrição:</h3><textarea id="desc"></textarea>');
        gModal.find('div.content div.thumbnail div.ratio').removeAttr('style');
        gModal.find('div.content div.media div.items').html('');
    },
    dragSortGalleryItemMedia : function () {
        gModal.find('div.media div.items').dragsort("destroy");
        gModal.find('div.media div.items').dragsort({ 
            dragSelector: ".item", 
            dragEnd: function() {
                gModal.find('div.media div.items div.item').each(function(index, el) {
                    $(this).attr('data-order', index);
                });
            }, 
            dragBetween: false, 
            placeHolderTemplate: "<div class='placeholder'></div>" 
        });
    },
    editOrAddGalleryItem : function (id) {
    
        // Reseta o os itens na tela
        APP.controller.Admin.resetEditOrAddGalleryItem();
        
        descTextbox = textboxio.replaceAll('textarea#desc', {
            paste: {
                style: 'clean'
            }
        });

        if (id === undefined) {
            // Insere o Título do Modal
            gModal.find('header h2').html("Adicionar novo projeto");
            $('#editAddGalleryItemModal').addClass('active');
        } else {

            database.ref('/').once('value').then(function(snapshot) {
                data = snapshot.val()
            }).then(function() {

                console.log(data["gallery"][id])
                console.table(data["gallery"][id]["media"])

                var pData = data["gallery"][id]

                gModal.attr('data-id', id)
                
                // Insere o Título do Modal
                gModal.find('header h2').html("Editar projeto");

                // Insere o nome
                gModal.find('input#name').val(pData["name"])

                // Insere as categorias selecionadas
                if (typeof(pData["category"]) != "undefined") {
                    $.each(pData["category"], function(index, val) {
                        gModal.find('input#_' + val).prop('checked', true)
                    });
                }

                // Insere o Thumbnail
                gModal.find('div.thumbnail div.ratio').css('background-image', 'url(' + pData['thumb'] + ')');

                // Insere descrição
                descTextbox[0].content.set(pData["desc"])

                // Insere os itens de mídia
                if (typeof(pData["media"]) != "undefined") {
                    gModal.find('div.media .items').append(`
                        ${pData["media"].map(function(media, index) {
                            var temp_id = "temp_" + parseInt(Math.random() * 1000000000000);
                            if (media.type === "image") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <img src="${media.url}" />
                                        <div class="actions">
                                            <label for="${temp_id}">Alterar imagem</label>
                                            <input id="${temp_id}" accept=".jpg, .png, .gif" size="10240" type="file" />

                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar Imagem</a>
                                        </div>
                                    </div>
                                `;
                            } else if (media.type === "video") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <div class="wrap-item">
                                            <video controls src="${media.url}"></video>
                                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                                        </div>
                                        <div class="actions">
                                            <label for="${temp_id}">Alterar vídeo</label>
                                            <input id="${temp_id}" accept=".mp4" size="10240" type="file" />
                                            
                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar Vídeo</a>
                                        </div>
                                    </div>
                                `;
                            } else if (media.type === "embed") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <div class="wrap-item">
                                            ${media.url}
                                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                                        </div>
                                        <div class="actions">
                                            <textarea>${media.url}</textarea>
                                            
                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar embed</a>
                                        </div>
                                    </div>
                                `;
                            }
                        }).join("")}
                    `)
                    tinysort('#editAddGalleryItemModal div.media div.items>*',{attr:'data-order'});
                    APP.controller.Admin.dragSortGalleryItemMedia();
                }

                $('#editAddGalleryItemModal').addClass('active');
                

            })


        }
    },
    addGalleryItemMedia : function (type) {
        var temp_id = "temp_" + parseInt(Math.random() * 1000000000000);
        if (type === "image") {
            gModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${gModal.find('.media .items .item').length}">
                    <img src="" />
                    <div class="actions">
                        <label for="${temp_id}">Alterar imagem</label>
                        <input id="${temp_id}" accept=".jpg, .png, .gif" size="10240" type="file" />

                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar Imagem</a>
                    </div>
                </div>
            `)
        } else if (type === "video") {
            gModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${gModal.find('.media .items .item').length}">
                    <div class="wrap-item">
                        <video controls src=""></video>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                    <div class="actions">
                        <label for="${temp_id}">Alterar vídeo</label>
                        <input id="${temp_id}" accept=".mp4" size="10240" type="file" />
                        
                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar Vídeo</a>
                    </div>
                </div>
            `);
        } else if (type === "embed") {
            gModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${gModal.find('.media .items .item').length}">
                    <div class="wrap-item">
                        
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                    <div class="actions">
                        <textarea placeholder="Cole o código de embed aqui"></textarea>
                        
                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar embed</a>
                    </div>
                </div>
            `);
        }
    },
    saveGalleryItem : function (dataGalleryItem, id) {
        database.ref('/gallery/'+id).set(dataGalleryItem);
        APP.controller.Admin.saveGalleryOrder();
        gModal.removeClass('active');
    },
    confirmDeleteGalleryItem : function (id) {
        if (window.confirm("Você realmente deseja apagar esse projeto?")) { 
            APP.controller.Admin.deleteGalleryItem(id);
            $('#gallery .item[data-id='+id+']').remove();
            APP.controller.Admin.saveGalleryOrder();
        }
    },
    deleteGalleryItem : function (id) {
        database.ref('/gallery/'+id).remove()
    },

    // Personal Works
    actionsPersonalWorks : function () {
        $('body').on('click', 'div#personalworks div.items div.item a.editItem', function(event) {
            event.preventDefault();
            var id = $(this).parent().data('id');
            APP.controller.Admin.editOrAddPersonalWorksItem(id);
        });
        $('body').on('click', 'div#personalworks div.items div.item a.deleteItem', function(event) {
            event.preventDefault();
            var id = $(this).parent().data('id');
            APP.controller.Admin.confirmDeletePersonalWorksItem(id);
        });
        $('body').on('click', 'div#personalworks a.addNewItem', function(event) {
            event.preventDefault();
            APP.controller.Admin.editOrAddPersonalWorksItem();
        });
    },
    reorderPersonalWorks : function () {
        $('div#personalworks div.items').dragsort({ 
            dragSelector: ".item", 
            dragEnd: function() {
                APP.controller.Admin.savePersonalWorksOrder();
            }, 
            dragBetween: false, 
            placeHolderTemplate: "<div class='placeholder'></div>" 
        });
    },
    savePersonalWorksOrder : function () {
        $('section#admin div#personalworks div.items div.item').each(function(index, el) {
            var index = $(this).index();
            var id = $(this).attr('data-id');

            database.ref('/personalworks/'+id+'/order').set(index);

        });
    },
    actionsPersonalWorksItem : function () {
        $('body').on('click', '#editAddPersonalWorksItemModal a.save', function(event) {
            event.preventDefault();

            if (pModal.attr('data-id') != null) {
                var id = pModal.attr('data-id');
            } else {
                var id = moment().format('x');
            }
            var dataPersonalWorksItem = {};

            // Categoria
            // dataPersonalWorksItem.category = [];
            // $('#editAddPersonalWorksItemModal .categories input:checked').each(function(index, el) {
            //     dataPersonalWorksItem.category.push($(this).attr('id').replace('_', ''));
            // });

            // Descrição
            // dataPersonalWorksItem.desc = descTextbox[0].content.get();

            // Mídia
            dataPersonalWorksItem.media = [];
            $('#editAddPersonalWorksItemModal .media div.items div.item').each(function(index, el) {
                var order = index;
                var type = $(this).attr('class').replace('item ', '');
                var featured = $(this).find('input[type=checkbox]').is(':checked');
                if (type == "video") { var url = $(this).find('video').attr('src')}
                if (type == "image") { var url = $(this).find('> img').attr('src')}
                if (type == "embed") { var url = $(this).find('.actions textarea').val()}
                dataPersonalWorksItem.media.push({
                    order: order,
                    type: type,
                    url: url,
                    featured: featured
                })
            });

            // Nome
            dataPersonalWorksItem.name = $('#editAddPersonalWorksItemModal #name').val();

            // Ordem
            dataPersonalWorksItem.order = $('#admin #personalworks .items .item').length;

            // Thumbnail
            // var reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
            // var url = $('#editAddPersonalWorksItemModal .thumbnail .ratio').css('background-image') === "none" ? "" : reg.exec($('#editAddPersonalWorksItemModal .thumbnail .ratio').css('background-image'))[1];
            // dataPersonalWorksItem.thumb = url;

            if (window.confirm("Você realmente deseja salvar esse projeto?")) { 
                APP.controller.Admin.savePersonalWorksItem(dataPersonalWorksItem, id);
                if (pModal.attr('data-id') === undefined) {

                    var wrap = $('section#admin div#personalworks div.items');
                    wrap.append(`               
                        <div data-order="${dataPersonalWorksItem.order}" data-id="${id}" class="item" style="background-image: url()">
                            <span>${dataPersonalWorksItem.name}</span>
                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                            <a href="#" class="editItem"><i class="fas fa-edit"></i></a>
                            <a href="#" class="deleteItem"><i class="fas fa-trash"></i></a>
                        </div>
                    `)

                    tinysort('section#admin div#personalworks div.items div.item',{attr:'data-order'});

                }
            }

        });
        $('body').on('click', '#editAddPersonalWorksItemModal a.close', function(event) {
            if (window.confirm("Você realmente deseja sair desse projeto?")) { 
                $('#editAddPersonalWorksItemModal').removeClass('active');
            }
        });
        $('body').on('click', '#editAddPersonalWorksItemModal div.addMore a', function(event) {
            event.preventDefault();
            var type = $(this).data('type');
            APP.controller.Admin.addPersonalWorksItemMedia(type);
        });
        $('body').on('click', '#editAddPersonalWorksItemModal div.items div.item a.deleteItemProject', function(event) {
            event.preventDefault();
            $(this).parents('.item').remove();
            APP.controller.Admin.dragSortPersonalWorksItemMedia();
        });
        // $('body').on('change', '#editAddPersonalWorksItemModal div.thumbnail input[type=file]', function(event) {
        //     event.preventDefault()
        //     var file = $(this)[0].files[0];
        //     APP.controller.Admin.uploadPersonalWorksThumbImage(file);            
        // });
        // $('body').on('change', '#editAddPersonalWorksItemModal div.items div.item.video input[type=file]', function(event) {
        //     event.preventDefault()
        //     var file = $(this)[0].files[0];
        //     var indexItem = $(this).parents('.item').index();
        //     APP.controller.Admin.uploadPersonalWorksItemVideo(file, indexItem);            
        // });
        $('body').on('change', '#editAddPersonalWorksItemModal div.items div.item.image input[type=file]', function(event) {
            var file = $(this)[0].files[0];
            var indexItem = $(this).parents('.item').index();
            APP.controller.Admin.uploadPersonalWorksItemImage(file, indexItem);
        });

        // $('body').on('keyup', '#editAddPersonalWorksItemModal div.items div.item.embed textarea', function(event) {
        //     var code = $(this).val()
        //     $(this).parents('.item').find('.wrap-item').html(`
        //         ${code}
        //         <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
        //     `)
        // });   

    },
    resetEditOrAddPersonalWorksItem : function () {
        pModal.removeAttr('data-id');
        pModal.find('div.content div.name input#name').val("");
        pModal.find('div.content div.categories input[type=checkbox]').prop('checked', false);
        pModal.find('div.content div.desc').html('<h3>Descrição:</h3><textarea id="desc"></textarea>');
        pModal.find('div.content div.thumbnail div.ratio').removeAttr('style');
        pModal.find('div.content div.media div.items').html('');
    },
    dragSortPersonalWorksItemMedia : function () {
        pModal.find('div.media div.items').dragsort("destroy");
        pModal.find('div.media div.items').dragsort({ 
            dragSelector: ".item", 
            dragEnd: function() {
                pModal.find('div.media div.items div.item').each(function(index, el) {
                    $(this).attr('data-order', index);
                });
            }, 
            dragBetween: false, 
            placeHolderTemplate: "<div class='placeholder'></div>" 
        });
    },
    editOrAddPersonalWorksItem : function (id) {
    
        // Reseta o os itens na tela
        APP.controller.Admin.resetEditOrAddPersonalWorksItem();
        
        descTextbox = textboxio.replaceAll('textarea#desc', {
            paste: {
                style: 'clean'
            }
        });

        if (id === undefined) {
            // Insere o Título do Modal
            pModal.find('header h2').html("Adicionar novo projeto");
            $('#editAddPersonalWorksItemModal').addClass('active');
        } else {

            database.ref('/').once('value').then(function(snapshot) {
                data = snapshot.val()
            }).then(function() {

                console.log(data["personalworks"][id])
                console.table(data["personalworks"][id]["media"])

                var pData = data["personalworks"][id]

                pModal.attr('data-id', id)
                
                // Insere o Título do Modal
                pModal.find('header h2').html("Editar projeto");

                // Insere o nome
                pModal.find('input#name').val(pData["name"])

                // Insere as categorias selecionadas
                // if (typeof(pData["category"]) != "undefined") {
                //     $.each(pData["category"], function(index, val) {
                //         pModal.find('input#_' + val).prop('checked', true)
                //     });
                // }

                // Insere o Thumbnail
                // pModal.find('div.thumbnail div.ratio').css('background-image', 'url(' + pData['thumb'] + ')');

                // Insere descrição
                // descTextbox[0].content.set(pData["desc"])

                // Insere os itens de mídia
                if (typeof(pData["media"]) != "undefined") {
                    pModal.find('div.media .items').append(`
                        ${pData["media"].map(function(media, index) {
                            var temp_id = "temp_" + parseInt(Math.random() * 1000000000000);
                            if (media.type === "image") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <img src="${media.url}" />
                                        <div class="actions">
                                            <label for="${temp_id}">Alterar imagem</label>
                                            <input id="${temp_id}" accept=".jpg, .png, .gif" size="10240" type="file" />

                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar Imagem</a>
                                        </div>
                                    </div>
                                `;
                            } else if (media.type === "video") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <div class="wrap-item">
                                            <video controls src="${media.url}"></video>
                                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                                        </div>
                                        <div class="actions">
                                            <label for="${temp_id}">Alterar vídeo</label>
                                            <input id="${temp_id}" accept=".mp4" size="10240" type="file" />
                                            
                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar Vídeo</a>
                                        </div>
                                    </div>
                                `;
                            } else if (media.type === "embed") {
                                return `
                                    <div class="item ${media.type}" data-order="${media.order}">
                                        <div class="wrap-item">
                                            ${media.url}
                                            <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                                        </div>
                                        <div class="actions">
                                            <textarea>${media.url}</textarea>
                                            
                                            <input ${media.featured ? "checked" : ""} id="${temp_id}_destaque" type="checkbox" />
                                            <label for="${temp_id}_destaque">Item em destaque</label>

                                            <a href="#" class="deleteItemProject">Apagar embed</a>
                                        </div>
                                    </div>
                                `;
                            }
                        }).join("")}
                    `)
                    tinysort('#editAddPersonalWorksItemModal div.media div.items>*',{attr:'data-order'});
                    APP.controller.Admin.dragSortPersonalWorksItemMedia();
                }

                $('#editAddPersonalWorksItemModal').addClass('active');
                

            })


        }
    },
    addPersonalWorksItemMedia : function (type) {
        var temp_id = "temp_" + parseInt(Math.random() * 1000000000000);
        if (type === "image") {
            pModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${pModal.find('.media .items .item').length}">
                    <img src="" />
                    <div class="actions">
                        <label for="${temp_id}">Alterar imagem</label>
                        <input id="${temp_id}" accept=".jpg, .png, .gif" size="10240" type="file" />

                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar Imagem</a>
                    </div>
                </div>
            `)
        } else if (type === "video") {
            pModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${pModal.find('.media .items .item').length}">
                    <div class="wrap-item">
                        <video controls src=""></video>
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                    <div class="actions">
                        <label for="${temp_id}">Alterar vídeo</label>
                        <input id="${temp_id}" accept=".mp4" size="10240" type="file" />
                        
                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar Vídeo</a>
                    </div>
                </div>
            `);
        } else if (type === "embed") {
            pModal.find('.media .items').append(`
                <div class="item ${type}" data-order="${pModal.find('.media .items .item').length}">
                    <div class="wrap-item">
                        
                        <img src="/assets/img/ratio16x9.png" alt="" class="ratio">
                    </div>
                    <div class="actions">
                        <textarea placeholder="Cole o código de embed aqui"></textarea>
                        
                        <input id="${temp_id}_destaque" type="checkbox" />
                        <label for="${temp_id}_destaque">Item em destaque</label>

                        <a href="#" class="deleteItemProject">Apagar embed</a>
                    </div>
                </div>
            `);
        }
    },
    savePersonalWorksItem : function (dataPersonalWorksItem, id) {
        database.ref('/personalworks/'+id).set(dataPersonalWorksItem);
        APP.controller.Admin.savePersonalWorksOrder();
        pModal.removeClass('active');
    },
    confirmDeletePersonalWorksItem : function (id) {
        if (window.confirm("Você realmente deseja apagar esse projeto?")) { 
            APP.controller.Admin.deletePersonalWorksItem(id);
            $('#personalworks .item[data-id='+id+']').remove();
            APP.controller.Admin.savePersonalWorksOrder();
        }
    },
    deletePersonalWorksItem : function (id) {
        database.ref('/personalworks/'+id).remove()
    },

};