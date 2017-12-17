cc.Class({
    extends: cc.Component,

    properties: {

        creatureCard:true,
        //������ֵ���ýڵ㣨���֣���׼��һ������
        cardNumNode:cc.Node,
        //�������ƽڵ�
        cardNameNode:cc.Node,
        //����ϸ�ڣ������ڵ㣩
        cardDetailNode:cc.Node,
        //����ϸ�ڣ������ڵ㣩
        cardDetailLabel:cc.Label,
        //���Ƴߴ�ڵ�
        cardSizeNode:cc.Node,
        //���Ƶ�ͼƬ���ֳߴ�
        cardMaskNode:cc.Node,
        //���Ƶķ������Ľڵ�
        cardManaNode:cc.Node,
        //���Ƶķ������Ľڵ�
        cardManaLabel:cc.Label,

        //���忨�ƹ���������ֵ�ȵȵı�ǩ����Ҫ���ڸ������С
        cardDatLabel:[cc.Label],
        //���忨�ƹ���������ֵ�ȵȵĽڵ�
        cardDatNode:[cc.Node],
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        //��ʼ�����ƵĲ��֣�ʵ��ֻҪ�޸Ľű��Ϳ�����ɵĲ���

        //�������ֵĽڵ�λ��
        this.cardNameNode.x = 0;
        this.cardNameNode.y = 75;
        //����ϸ�ڣ��������Ľڵ�λ��
        this.cardDetailNode.x = -43;
        this.cardDetailNode.y = -52;
        //����ϸ�ڣ��������Ľڵ�λ��
        this.cardSizeNode.width = 92;
        this.cardSizeNode.height = 177;
        //�������ĵĽڵ�λ��
        this.cardManaNode.x = -47;
        this.cardManaNode.y = 87;
        this.cardManaNode.width = 20;
        this.cardManaNode.height = 20;
        //�������ֵĿ�ȸ߶ȣ��Լ��ڵ��Y����
        this.cardMaskNode.y = 8;
        this.cardMaskNode.width = 86;
        this.cardMaskNode.height = 109;

        this.cardManaLabel.fontSize = 20;

        this.cardDetailLabel.fontSize = 12;
        this.cardDetailLabel.lineHeight = 12;
        this.cardDetailLabel.node.width = 74;

        if(this.creatureCard === true) {
            //�������ݽڵ㣨���֣���λ������
            this.cardNumNode.x = 42;
            this.cardNumNode.y = 10;
            //�������ڵ��ȸ߶�
            this.cardDatNode[0].width = 28;
            this.cardDatNode[0].height = 50;
            //����ֵ�ڵ��ȸ߶�
            this.cardDatNode[1].width = 28;
            this.cardDatNode[1].height = 32;
            //�ٶȽڵ��ȸ߶�
            this.cardDatNode[2].width = 28;
            this.cardDatNode[2].height = 32;

            for (var i = 0; i < 3; i++)
                this.cardDatLabel[i].fontSize = 20;

        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
