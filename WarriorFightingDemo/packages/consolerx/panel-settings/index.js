'use strict';
const urlOfIcon = Editor.url( 'packages://consolerx/icon.png' );


const stylesheet = `
@import url('app://bower_components/fontawesome/css/font-awesome.min.css');
#settings { display: flex; flex-direction: column; font-family: Monaco, monospace; padding:5px; }
header { display: flex; padding: 4px; position: relative; }
h3 { margin: 3px; }
ui-checkbox { padding: 3px 4px; }

li { font-size: 11px; }

label { line-height:23px; font-size:9px; font-family:Monaco; }
#crx_FontFamilies input { font-size:9px!important; font-family:Monaco; }
#consolerx .split { height:20px; margin:2px 0 0 5px; border-right:#999 1px dotted; width:5px; }
#consolerx input { color: #fd942b; background: #09f; font-size:9px; font-family:Monaco; margin: 0; padding: .2em .6em; display: inline-block; outline: 0; border-radius: 3px; border: 1px solid #888; box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, .3); background: #252525 }
#consolerx input:focus { border: 1px solid #fd942b!important; }
#consolerx input:hover { border: 1px solid #bababa; }
#consolerx input:-webkit-input-placeholder { font-style: italic; color: #595959 }
#consolerx .fa { font-size:18px; line-height:28px; margin:0px 5px 0px 6px; }
#consolerx select { padding:2px 18px 2px 5px!important; border:red 2px solid; }

/* Change for UI Kit */
ui-color { width:30px; }

#settings textarea { color: #fd942b; background: #09f; font-size:9px; font-family:Monaco; margin: 0; padding: .2em .6em; display: inline-block; outline: 0; border-radius: 3px; border: 1px solid #888; box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, .3); background: #252525 }
#settings textarea:focus { border: 1px solid #fd942b!important; }
#settings textarea:hover { border: 1px solid #bababa; }
#settings textarea:-webkit-input-placeholder { font-style: italic; color: #595959 }
`;

const uiTemplate =`
<div id="settings">

	<div class="group">
		<h3>Ignore Pattern</h3>
		<textarea id="textarea" style="width:100%;height:160px"></textarea>
	</div>
	<div>
		<ul>
			<li>Each Line is one pattern</li>
			<li>Support Regular Expression</li>
			<li>you can use // prefix to ignore one pattern</li>
		</ul>
	</div>
	<div style="padding:5px;">
		<ui-button class="green" v-on:click="onIgnorePatternsChanged">Save</ui-button>
	</div>
	
</div>
`;

let _data =
{
};


let _buildMethods = ( runtime ) =>
{
	let funcs =
	{
		onIgnorePatternsChanged( event )
		{
			//let patterns = event.target.value
			let patterns = runtime.$textarea.value;
			Editor.Ipc.sendToPanel( 'consolerx', 'update-ignore-patterns', patterns );
		},
	};
	return funcs;
}




const _DefineOfPanel =
{
	style: stylesheet,
	template: uiTemplate,

	$:{
		settings: '#settings',
		textarea: '#textarea',
	},

	listeners:
	{
		//'panel-resize'(){ manager.update(); },
		//'panel-show'()	{ manager.update(); }
	},
	messages:
	{
	},
	run( args )
	{
	},
	ready()
	{
		let root = this;
		let _Vue =
		{
			el:         this.$settings,
			components:
			{
			},
			data: _data,
			methods: _buildMethods( root ),
		};
		Editor.Ipc.sendToPanel( 'consolerx', 'query-ip', null, function( ignorePatterns )
		{
			root.$textarea.value = ignorePatterns;

			root._vm = new Vue( _Vue );
		});
	},
	close()
	{
	}

};



Editor.Panel.extend( _DefineOfPanel );
