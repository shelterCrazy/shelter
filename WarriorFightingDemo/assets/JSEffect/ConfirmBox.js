cc.Class({
    extends: cc.Component,

    properties: {
        number:0,
        inputBoxSwitch:false,
        tipLabel:cc.Label,
        inputBox:cc.EditBox
    },
    /**
     * @主要功能 获取答案的弹框
     * @author C14
     * @Date 2018/7/20
     * @parameters fn
     * @parameters str
     * @parameters boxBoolean
     * @returns
     */
    getAnswer:function(fn,str,editBoxStr){
        this.node.active = true;
        if(editBoxStr === undefined){
            this.inputBox.node.active = false;
        }else{
            this.inputBox.string = editBoxStr;
            this.inputBox.node.active = true;
        }
        this.tipLabel.string = (str === undefined) ? "" : str;
        this.fn = fn;
    },

    answer:function(event, customEventData) {
        this.number = Number(customEventData);
        cc.log(this.number);
        if(this.number === 1){
            cc.log(this.inputBox.string);
            this.fn(true,this.inputBox.string);
        }else if(this.number === 2){
            this.fn(false,this.inputBox.string);
        }
        this.node.active = false;
    },
    UnicodeToUtf8:function(unicode) {
        var uchar;
        var utf8str = "";
        for(var i=0; i<unicode.length;i+=2){
            uchar = (unicode[i]<<8) | unicode[i+1];        //UNICODE为2字节编码，一次读入2个字节
            utf8str = utf8str + String.fromCharCode(uchar);  //使用String.fromCharCode强制转换
        }
        return utf8str;
    }
// update (dt) {},
});
