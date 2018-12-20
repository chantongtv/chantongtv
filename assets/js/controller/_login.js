/*
|--------------------------------------------------------------------------
| Controller
|--------------------------------------------------------------------------
*/
APP.controller.Login = {

    init: function () {

        this.setup();
        this.login();

    },

    setup: function () {

        //

    },

    //Login 
    login: function () {

        this.setLogin();
        APP.component.Form.init();

    },

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */
    setLogin: function () {

        this.setMaskOnFields();
        APP.controller.Login.sendFormLogin();

    },

    setMaskOnFields: function () {

        

    },

    sendFormLogin: function () {

        $('#form-login .entrar').on('click', function (event) {

            event.preventDefault();

            var formLogin = APP.controller.Login.getFormLogin();
            var validate = APP.controller.Login.setValidateLogin(formLogin);

            //validate = true;

            if (validate) {
                APP.controller.Login.saveFormLogin(formLogin);
            }

        });

    },

    getFormLogin: function () {

        var form = $('form#form-login');

        var login = {

            login: $(form).find('.login').val(),
            senha: $(form).find('.senha').val()

        };

        return login;
    },

    setValidateLogin: function (_form) {

        var _idform = $('form#form-login');
        return APP.component.Form.validaCamposForm(_form, _idform);

    },

    saveFormLogin: function (login) {

        var erro = "";

        $.ajax({
            type: "POST",
            data: { login },
            dataType: 'json',
            url: "/Login/Login",
            beforeSend: function () {
                APP.component.Loading.show();
            },
            success: function (result) {

            },
            error: function (result) {
                APP.component.Alert.customAlert('Erro desconhecido. Entre em contato com a Central de Atendimento.', 'Alerta!');
            },
            complete: function (result) {
                APP.component.Loading.hide();
            }
        });

    },

};