'use strict';
const components =
{
	List:	require( Editor.url( 'packages://consolerx/panel/components/list' ) ),
	Item:	require( Editor.url( 'packages://consolerx/panel/components/item' ) ),
};



var scrollTimer = null;
var scrollNumCache = null;

var _calculateHeight = function ( list )
{
	var height = 0;
	list.forEach( (item) => { height += Editor.crx.CalculateNeedAddLineHeightBy( item ); } )
	return height;
};

var _createItem = function (){
	return {
		type:       '',
		rows:       0, // 默认高度
		title:      '',
		info:       '',
		texture:    'dark',
		fold:       true,
		num:        1,
		translateY: -1000,
		show:       false,
	};
};


let _ui_template = `
<section v-init="messages" v-on:scroll="onScroll">
    <!--<consolerx-item id=""></consolerx-item>-->
    <div v-bind:style="sectionStyle">
        <template v-for="item in list">
            <consolerx-item             
             v-bind:type="item.type"
             v-bind:title="item.title"
             v-bind:info="item.info"
             v-bind:y="item.translateY"
             v-bind:texture="item.texture"
             v-bind:rows="item.rows"
             v-bind:fold="item.fold"
             v-bind:num="item.num"
             v-show="item.show"
         ></consolerx-item>
        </template>
    </div>

</section>
`;

let _methods =
{
	onScroll( event )
	{
		var list = this.messages;
		var dataList = this.list;
		var scroll = event.target.scrollTop;

		var tmp = 0;
		var index = 0;
		list.some( ( item, i ) =>
		{
			tmp += Editor.crx.CalculateNeedAddLineHeightBy( item );

			if ( tmp > scroll )
			{
				index = i - 1;
				return true;
			}
		} );

		dataList.forEach( function ( item, i )
		{
			var source = list[index + i];
			if ( !source )
			{
				item.translateY = -1000;
				item.show = false;
				return;
			}

			item.type = source.type;
			item.rows = source.rows;
			item.title = source.title;
			item.info = source.info;
			item.fold = source.fold;
			item.num = source.num;
			item.texture = ((index + i) % 2 === 0) ? 'dark' : 'light';
			item.translateY = source.translateY;
			item.show = true;
		} );
	},
	onUpdateFold( y, fold )
	{
		var index = 0;
		for ( var j = 0; j < this.messages.length; j++ )
		{
			if ( this.messages[j].translateY === y )
			{
				index = j;
				break;
			}
		}

		var source = this.messages[index++];
		source.fold = fold;
		var offsetY = Editor.crx.CalculateMultiLineHeightBy( source );
		if ( fold )
		{
			offsetY = -offsetY;
		}
		for ( index; index < this.messages.length; index++ )
		{
			let item = this.messages[index];
			item['translateY'] += offsetY;
			item.show = true;
		}

		// 计算总高度
		this.sectionStyle.height = _calculateHeight( this.messages );

		this.onScroll( { target: this.$el } );
	}
};

let _directives =
{
	init( list )
	{
		// 计算总高度
		var height = _calculateHeight( list );
		this.vm.sectionStyle.height = height;

		// 当前显示高度可以显示多少条信息
		var num = this.vm.$el.clientHeight / Editor.crx.Runtime.LineHeight + 3 | 0;

		// 生成 list 数组
		var dataList = this.vm.list;
		while ( dataList.length > num )
		{
			dataList.pop();
		}

		clearTimeout( scrollTimer );
		scrollTimer = setTimeout( () =>
		{

			var height = _calculateHeight( list );

			// 用户如果更改了滚动的 scrollTop，则不自动跳到底部
			// 如果滚动条不在页面最顶部以及最底部，则添加 log 的时候不去滚动
			var ts = this.vm.$el.scrollTop;
			var tc = this.vm.$el.clientHeight;
			var cn = list.length - scrollNumCache;
			scrollNumCache = list.length;

			var scroll;
			if ( ts !== 0 && height - tc - ts > Editor.crx.Runtime.LineHeight * cn )
			{
				scroll = this.vm.$el.scrollTop;
			}
			else
			{
				scroll = this.vm.$el.scrollTop = height - tc
			}

			var tmp = 0;
			var index = 0;
			list.some( ( item, i ) =>
			{
				tmp += Editor.crx.CalculateNeedAddLineHeightBy( item );

				if ( tmp > scroll )
				{
					index = i - 1;
					return true;
				}
			} );

			for ( var i = 0; i < num; i++ )
			{
				if ( !dataList[i] ) dataList.push( _createItem() );
				else
				{
					let item = dataList[i];
					item.translateY = -1000;
					item.show = false;
				}

			}

			this.vm.onScroll( { target: this.vm.$el } );
		}, 10 );
	}
};




let componentList =
{
	template:	_ui_template,
	props:		['messages'],
	components: { 'consolerx-item': components.Item },
	data: function ()
	{
		return {
			list:         [],
			sectionStyle: { height: 0 }
		}
	},

	methods: _methods,

	directives: _directives
};

module.exports = componentList;