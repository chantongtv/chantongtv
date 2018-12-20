/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/
var user = 123;
APP.component.LocalStorage = {

    init : function () {

        this.setup();
        this.localStorage();

    },

    setup : function () {

        //

    },

    localStorage : function () {



    },

    //SET
    setLocalStorage : function (_name, _value) {

        localStorage.setItem(_name, _value);

    },

    //GET
    getLocalStorage : function (_name) {

        var value = localStorage.getItem(_name);

        return value;

    },

    //Remove
    removeLocalStorage : function (_name) {
      
        localStorage.removeItem(_name);

    },

    //Grava Nome Array
    setPorcentagemMinhasPrioridades : function (pagina) {


        // Pega o usuário e vincula ao objeto
        var playerId = localStorage.getItem(playerId);

        if (typeof localStorage.porcentagemMP === "undefined") {
            var obj = {}
        } else {
            var obj = JSON.parse(localStorage.porcentagemMP)
        }
        if (typeof obj[user] === "undefined") {
            obj[user] = []
            obj[user].push(pagina);
        } else {
            if (obj[user].indexOf(pagina) === -1) {
                obj[user].push(pagina);
            }
        }

        localStorage.setItem('nome', JSON.stringify(obj));

    },

     //Remove Nome Array
    removePorcentagemMinhasPrioridades : function (pagina) {

        var newObj = {};
        newObj[user] = []

        if (typeof localStorage.porcentagemMP === "undefined") {
            var obj = {}
        } else {
            var obj = JSON.parse(localStorage.porcentagemMP)
        }

        $(obj[user]).each(function (index) {
            if (this != pagina) {
                var text = obj[user][index];
                newObj[user].push(text);
            }
        });

        localStorage.setItem('nome', JSON.stringify(newObj));

    },

};


