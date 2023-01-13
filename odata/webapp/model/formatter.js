sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        fooBar:function(aktivnost){
            if(aktivnost == true){
                return "Korisnik je aktiviran"
            } else{

                return "Korisnik nije aktiviran"
            }

        },

        tfcheck:function(checkpoint){
            if(checkpoint == true){
                return "Korisnik je aktiviran"
            } else{

                return "Korisnik nije aktiviran"
            }
        }

    };

});