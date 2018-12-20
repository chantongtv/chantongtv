/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

APP.component.Form = {

    init : function () {

        this.setup();
        this.formulario();

    },

    setup : function () {



    },

    formulario : function () {

        this.setChangeHidePass();
        this.setCepFields();
        this.blockCopyPast();
        
    },

    /*
    |--------------------------------------------------------------------------
    | CAMPOS
    |--------------------------------------------------------------------------
    */
    validaCamposForm : function (_form, _idForm) {

        var erros = [];
        
        _idForm.find('.error').removeClass('error');
        _idForm.find('.right').removeClass('right');

        //Login
        if (_form.login != undefined) {
            if(_form.login == '') {
                _idForm.find('.login').closest('.field').find('.verify').addClass('error');
                erros.push('Login Invalido');
            } else {
                _idForm.find('.login').closest('.field').find('.verify').addClass('right');
            }
        }

        //Senha
        if (_form.senha != undefined) {
            if(_form.senha == '') {
                _idForm.find('.senha').closest('.field').find('.verify').addClass('error');
            } else if (!APP.component.Form.validateSenha(_form.senha)) {
                _idForm.find('.senha').closest('.field').find('.verify').addClass('error');
                erros.push('A Senha deve conter no mínimo 6 caracteres e letras e numeros.');
            } else {
                _idForm.find('.senha').closest('.field').find('.verify').addClass('right');
            } 
        }

        if (_idForm.find('.error').length > 0) {
            if (erros.length > 0) {
                APP.component.Alert.customErros(erros);
            }
            return false;
        }

        return true;

    },

    /*
    |--------------------------------------------------------------------------
    | VALIDACAO
    |--------------------------------------------------------------------------
    */

    validateSenha : function (senha) {

        var patternFull = /^(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

        return true;
        //return patternFull.test(String(senha));
        
    },

    validateSenhaPattern : function (senha) {

        var patternFull = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

        var oneDigit = /^(?=.*\d)$/;
        var lowerCase = /^(?=.*[a-z])$/;
        var upperCase = /^(?=.*[A-Z])$/;
        var digitos = /^[a-zA-Z0-9]{8,}$/;

        return patternFull.test(String(senha));
        
    },
    
    validateEmail : function (email) {

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());

    },

    validateCpf : function (cpf) {

        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpf.length < 11)
                return false;
        for (i = 0; i < cpf.length - 1; i++)
                if (cpf.charAt(i) != cpf.charAt(i + 1))
                    {
                    digitos_iguais = 0;
                    break;
                    }
        if (!digitos_iguais)
                {
                numeros = cpf.substring(0,9);
                digitos = cpf.substring(9);
                soma = 0;
                for (i = 10; i > 1; i--)
                    soma += numeros.charAt(10 - i) * i;
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                    return false;
                numeros = cpf.substring(0,10);
                soma = 0;
                for (i = 11; i > 1; i--)
                    soma += numeros.charAt(11 - i) * i;
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                    return false;
                return true;
                }
        else
            return false;

    },

    validateCelular : function (celular) {

        var re = /^(?:\()[0-9]{2}(?:\))\s?[0-9]{4,5}(?:-)[0-9]{4}$/;
        return re.test(String(celular));

    },

    validateIdade : function (data) {

        var dateSplit = data.split('/');

        var dia = parseInt(dateSplit[0]);
        var mes = parseInt(dateSplit[1]);
        var ano = parseInt(dateSplit[2]);

        var idade = new Date(ano, mes, dia)

        var hoje = new Date();
        var diferencaAnos = hoje.getFullYear() - idade.getFullYear();
        if ( new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) < 
            new Date(hoje.getFullYear(), idade.getMonth(), idade.getDate()) )
            diferencaAnos--;

        return diferencaAnos < 18 ? false : true;

    },

    /*
    |--------------------------------------------------------------------------
    | INTERACAO
    |--------------------------------------------------------------------------
    */
    setChangeHidePass : function () {

        $('a.showpass').on('click', function (event) {

            event.preventDefault();

            $(this).toggleClass('active');

            if ($(this).hasClass('active')) {
                $(this).closest('.field').find('input').attr('type', 'text');
            } else {
                $(this).closest('.field').find('input').attr('type', 'password');
            }

        });

    },

    setCepFields : function () {

        var form = $('#form-cadastro, #form-meu-perfil');

        form.find('.cep').keyup(function (event) {

            var cep = form.find('.cep').cleanVal();

            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                if (!("erro" in dados)) {
                    //console.log(dados)
                    //Atualiza os campos com os valores da consulta.
                    form.find(".bairro").val(dados.bairro);
                    form.find(".logradouro").val(dados.logradouro);
                    form.find(".numero").val("");
                    form.find(".complemento").val("");
                    form.find("select#estados").val(dados.uf);
                    form.find("select#estados").trigger("change");
                    form.find("select#cidades").val(dados.localidade);

                    //Bloqueia Campos
                    // form.find(".bairro").prop('disabled', true);
                    // form.find(".logradouro").prop('disabled', true);
                    // form.find(".cidade").prop('disabled', true);
                    // form.find(".estado").prop('disabled', true);
                }
            }).fail(function() {

                //Limpa Campos
                form.find(".bairro").val("");
                form.find(".logradouro").val("");;
                form.find(".numero").val("");
                form.find(".complemento").val("");
                form.find(".cidade").val("");
                form.find(".estado").val("");
                form.find("select#estados").val("");
                $("#cidades").html('<option value="">Escolha a cidade:</option>');
                //css
                $("#estados").css('color', '#d7d7d7');
                $("#cidades").css('color', '#d7d7d7');

                //Desbloqueia Campos
                // form.find(".bairro").prop('disabled', false);
                // form.find(".logradouro").prop('disabled', false);
                // form.find(".cidade").prop('disabled', false);
                // form.find(".estado").prop('disabled', false);
            })
        });

    },

    setCleanForms : function () {
        $('form').each (function(){
            $(this).find('.error').removeClass('error');
            $(this).find('.right').removeClass('right');
            this.reset();
        });
    },

    blockCopyPast : function () {
        $('.confirma-senha').on("cut copy paste",function(e) {
            e.preventDefault();
        });
    }

};


