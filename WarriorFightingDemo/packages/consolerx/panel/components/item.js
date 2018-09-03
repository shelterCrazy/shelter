'use strict';

exports.template = `
<div class="item" v-bind:type="type" v-init="y" v-info="info" v-bind:style="style" v-bind:texture="texture" v-bind:fold="fold"
    v-on:mousedown="onMouseDown"
>
    <div class="warp">
        <div class="text">
            <span>
                <i class="fa fa-times-circle" v-if="type==='error'"></i>
                <i class="fa fa-warning" v-if="type==='warn'"></i>
            </span>
            
            <span title="{{title}}">
                <i class="fold fa fa-caret-down" v-if="info&&!fold" v-on:click="onHide"></i>
                <i class="fold fa fa-caret-right" v-if="info&&fold" v-on:click="onShow"></i>
                {{title}}
            </span>
            
        </div>
        <span v-if="num>1">{{num}}</span>
    </div>
    <div class="info">
        <template v-for="item in foldInfo" track-by="$index">
            <div>
                <pre>{{item.info}}</pre>
                <span class="path">{{item.path}}</span>
            </div>
        </template>
    </div>
</div>
`;

exports.props = ['type', 'title', 'info', 'y', 'texture', 'rows', 'fold', 'num'];

exports.data = function ()
{
	return {
		foldInfo: [],
		style:
		{
			transform: 'translateY(0)'
		}
	};
};

exports.directives =
{
	init( y )
	{
		this.vm.style.transform = `translateY(${y}px)`;
	},
	info( info )
	{
		var sources = info.split( '\n' );
		var results = this.vm.foldInfo;
		while ( results.length > 0 )
		{
			results.pop();
		}
		sources.forEach( ( item ) =>{
			var match = item.match( /(^ *at (\S+ )*)(\(*[^\:]+\:\d+\:\d+\)*)/ );
			match = match || ['', item, undefined, ''];
			results.push( {
				info: match[1] || '',
				path: match[3] || ''
			} );
		} );
	}
};

var Selection = document.getSelection();

exports.methods =
{
	onHide()
	{
		this.$parent.onUpdateFold( this.y, true );
	},
	onShow()
	{
		this.$parent.onUpdateFold( this.y, false );
	},
	onMouseDown( event )
	{
		if ( event.button !== 2 ) return;

		// 获取选中的文本
		var text = Selection.toString();
		if ( !text )
		{
			text += this.title;
			if ( this.info )
			{
				text += '\r\n' + this.info;
			}
		}

		Editor.Ipc.sendToPackage( 'consolerx', 'popup-item-menu', event.clientX, event.clientY + 5, text );
	}
};
