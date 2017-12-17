/**
 * @主要功能:   小地图类
 * @type {Function}
 */
var smallMap = cc.Class({
    extends: cc.Component,

    properties: {
        signs: [cc.Node],
        signPrefab: [cc.Prefab],
        //小地图标识0：蓝色 属于小于0的阵营
        //小地图标识1：红色 属于大于0的阵营
        data: cc.Node,
        script: null,
    },

    onLoad: function () {
        this.script = this.data.getComponent('MainGameManager');
    },


    /**
     * @主要功能:  创建小地图标记节点
     * @param node
     */
    fnCreateCreatureSign: function(node){
        //借用一个node来创建一个小兵标记，将Node绑定在预制资源中
        var script = node.getComponent('Creature');
        var newsign;

        newsign = cc.instantiate(this.signPrefab[0]);
        var signScript = newsign.getComponent('SignScript');

        signScript.nodeType = 0;
        signScript.fnGiveNode(node);

        this.signs.push(newsign);
        this.node.addChild(this.signs[this.signs.length - 1]);
    },
    fnCreateHeroSign: function(node){
        //借用一个node来创建一个小兵标记，将Node绑定在预制资源中
        var script = node.getComponent('Player');
        var newsign;

        newsign = cc.instantiate(this.signPrefab[0]);
        var signScript = newsign.getComponent('SignScript');

        signScript.nodeType = 1;
        signScript.fnGiveNode(node);

        this.signs.push(newsign);
        this.node.addChild(this.signs[this.signs.length - 1]);
    },

    /**
     * @主要功能: 释放小兵节点
     *          建议使用资源池回收节点
     * @param node
     */
    fnDeleteSign: function(node){
        var i,script;
        for(i = 0;i < this.signs.length; i++){
            script = this.signs[i].getComponent('SignScript');
            if(script.creature === node){
                this.node.removeChild(this.signs[i],true);
                this.signs[i].active = false;
                this.signs.splice(i,1);
                script.removeSign();
                break;
            }
        }

        //kenan 因为没有回收池  这里需要释放资源
        //node.destroy();

    },

});
