/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

APP.component.Date = {

    init : function () {

        this.setup();
        this.date();

    },

    setup : function () {

        //

    },

    date : function () {

        this.getCurrentDate();

    },

    getCurrentDate : function () {
        
        var fullDate = new Date()
        //Thu May 19 2011 17:25:38 GMT+1000 {}
        
        //convert month to 2 digits
        var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
        
        var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        //19/05/2011

        return currentDate;

    },

    formatDate : function (_date) {
        var fullDate = new Date(_date)
        //Thu May 19 2011 17:25:38 GMT+1000 {}
        
        //convert month to 2 digits
        var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
        
        var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        //19/05/2011

        return currentDate;
    }

};


