
var $ = {
    ajax:function(options){

        var xhr = cc.loader.getXMLHttpRequest();


        //xhr.open(options.type,"http://39.106.67.112:3000" + options.url,true);
        var params = this.formatParams(options.data);

        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        xhr.timeout = 5000;
        // method and before calling the send() method.
        if (options.type == "GET") {
            if(options.data === undefined || options.data === null){
                xhr.open("GET","http://39.106.67.112:3000" + options.url, true);
                xhr.send();
            }else{
                xhr.open("GET","http://39.106.67.112:3000" + options.url + "?" + params, true);
                xhr.send(params);
            }
        } else if (options.type == "POST") {
            //xhr.open("POST","http://39.106.67.112:3000" + options.url + "?" + params, true);
            xhr.open("POST","http://39.106.67.112:3000" + options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)){
                var response = xhr.responseText;
                cc.log(xhr.responseText);
                var obj = JSON.parse(response);
                options.success(obj);
            }else{
                options.error();
            }
        };
    },
    //格式化参数
    formatParams:function (data){
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".",""));
        return arr.join("&");
    }
}