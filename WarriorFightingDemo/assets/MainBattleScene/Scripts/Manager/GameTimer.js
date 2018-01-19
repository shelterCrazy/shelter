/**
 * @��Ҫ���� ��Ϸʱ��ǣ�ʵ���Զ�תȦ�ͷŷ����ȹ���
 * @author C14
 * @Date 2017/12/3
 * @parameters
 * @returns
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        //��ȡ�ýڵ��µĽ�����
        this.processBar = this.node.getComponent(cc.ProgressBar);
        //���ڵ�ʱ���Ϊ0
        this.timer = 0;
        //תһȦ��ʱ���Ϊ800
        this.maxTimer = 800;

        //�������Ľ���Ϊ this.timer/this.maxTimer
        this.processBar.progress = this.timer/this.maxTimer;

        //����һ����ʱ��������ѭ��
        this.schedule(function() {
            //ʱ���һ
            this.timer++;

            //���ڵ�ʱ���¼�������ֵ������
            if(this.timer > this.maxTimer){
                this.timer = 0;
                //��ȡʱ��ǵ������ӽڵ㣨ӽ����¼����
                var allChild = this.node.getChildren();
                    for(var i = 0;i < allChild.length;i++){
                        //��ȡӽ����¼���Ľű�
                        var chantScript = allChild[i].getComponent("Chant");
                        if(chantScript != null) {
                            //����flag��Ϊfalse��������һ�ο��Դ�����
                            chantScript.flag = false;
                        }
                    }
            }

            //��ȡʱ��ǵ������ӽڵ㣨ӽ����¼����
            var allChild1 = this.node.getChildren();
            for(var j = 0;j < allChild1.length;j++){
                //��ȡӽ����¼���Ľű�
                var chantScript1 = allChild1[j].getComponent("Chant");
                if(chantScript1 != null) {
                    //����ﵽ����ռ�İٷֱȣ������Ѿ��ǿɴ�����״̬
                    if(chantScript1.percent <= this.timer/this.maxTimer && chantScript1.flag === false){
                        //���ڲ��ɴ�����
                        chantScript1.flag = true;
                        //�غ�����һ
                        chantScript1.fnChangeRound(-1);
                    }
                }
            }
            //���½������Ľ���
            this.processBar.progress = this.timer/this.maxTimer;
        },0.01);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // },
});
