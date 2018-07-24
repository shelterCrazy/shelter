/**
 * @主要功能:   单位
 * @type {Function}
 */
var globalConstant = require("Constant");

var unit = cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad: function(){
        var i;
        var script = this.node.getComponent(sp.Skeleton);



        this.initAction();
    },

});
