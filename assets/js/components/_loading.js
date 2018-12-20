/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

APP.component.Loading = {

    init : function () {

        this.loading();

    },

    show : function () {

        $('.box-loading').stop(true, true).css("display", "flex").hide().stop(true, true).fadeIn(200)

    },

    hide : function () {

        $('.box-loading').stop(true, true).fadeOut(200);

    },

};