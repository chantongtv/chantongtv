
/*
|--------------------------------------------------------------------------
| Slick
|--------------------------------------------------------------------------
*/

APP.component.Slick = {

  init : function (classe, config) {

    this.slick(classe, config);

  },

  slick : function (_classe, _config) {

    if (_config == null) {
      _config = {
        dots: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
      }
    }

    $(_classe).slick(_config);

  }

};