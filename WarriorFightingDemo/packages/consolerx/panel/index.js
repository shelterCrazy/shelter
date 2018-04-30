'use strict';
const crx = require( Editor.url( 'packages://consolerx/crx' ) );
const manager = require( Editor.url( 'packages://consolerx/core/manager' ) );
const components =
{
	List:			require( Editor.url( 'packages://consolerx/panel/components/list' ) ),
	Item:			require( Editor.url( 'packages://consolerx/panel/components/item' ) ),
};

//require( Editor.url( 'packages://consolerx/libs/string-format' ) ).extend( String.prototype );

const __defaultColors = `
section .item[type=log]	{ color: #999; }
section .item[type=error] { color: #DA2121; }
section .item[type=warn] { color: #990; }
section .item[type=info] { color: #09F; }
section .item[type=failed] { color: #DA2121; }
section .item[type=success] { color: #090; }
`;

const stylesheet = `
@import url('app://bower_components/fontawesome/css/font-awesome.min.css');
#consolerx { display: flex; flex-direction: column; font-family: Monaco, monospace; }
header { display: flex; padding: 4px; position: relative; }
section { flex: 1; border: 1px solid black; box-shadow: inset 0 0 8px 2px rgba(0, 0, 0, 0.2); background: #333; }
ui-checkbox { padding: 3px 4px; }
.collapse { position: absolute; right: 0; }
section { overflow-y: auto; position: relative; }
section .item { color: #999; line-height: 30px; padding: 0 10px; box-sizing: border-box; position: absolute; top: 0; font-size: 12px; width: 100%; -webkit-user-select: initial; overflow-x: scroll; }
section .item[fold] { overflow-x: hidden; }
section .item[texture=light] { background-color: #292929; }
section .item[texture=dark] { background-color: #222; }

section .item i { }
section .item i.fold { color: #555; cursor: pointer; padding: 2px; }
section .item i.fa-caret-right { padding: 2px 5px 2px 6px; margin: 0 -2px; }
section div .warp { display: flex; }
section div .text { position: relative; flex: 1; white-space: nowrap; text-overflow: ellipsis; padding-right: 2px; }
section div[fold] .text { overflow: hidden; }
section div .info { margin-left: 25px; }
section div[fold] .info > div { display: none; }
section div .info div { white-space: nowrap; text-overflow: ellipsis; }
section div .info div pre { margin: 0; display: inline; }
section div[fold] .info div { overflow: hidden; }
section .item[type=error] .info div { color: #A73637; }
section .item:hover { background: #353535; }

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
`;

const uiTemplate =`
<div id="consolerx" class="fit">

	<header>
		<ui-button class="red small transparent" v-on:confirm="onClear"><i class="icon-block"></i></ui-button>
		<ui-button id="openLogBtn" class="small transparent" v-on:click="onPopupLogMenu"><i class="icon-doc-text"></i></ui-button>
		<ui-input v-on:change="onFilterText"></ui-input>
		<ui-checkbox v-on:confirm="onFilterRegex">Regex</ui-checkbox>
		<ui-select v-on:confirm="onFilterType">
			<option value="">All</option>
			<option value="log">Log</option>
			<option value="success">Success</option>
			<option value="failed">Failed</option>
			<option value="info">Info</option>
			<option value="warn">Warn</option>
			<option value="error">Error</option>
		</ui-select>
		
		&nbsp;
		<ui-button id="openSettings" class="small transparent" v-on:click="onPopSettings"><i class="fa fa-cog"></i>Ignore Settings</ui-button>
		<ui-checkbox id="cbxAutoClean" v-on:confirm="onAutoCleanChanged">AutoClean</ui-checkbox>
		
		<ui-checkbox class="collapse" v-on:confirm="onCollapse" checked>Collapse</ui-checkbox>
	</header>
	<header>
		<!--<i class="split">&lt;!&ndash;split line&ndash;&gt;</i>-->
		<!--------------------------------------------------------------------------------------------------------------->
		<i class="fa fa-text-width" title="Font Size"></i>
		<ui-select id="crx_FontSize" v-on:confirm="onFontSizeChanged" v-value="fontsize" title="Font Size">
			<option v-for="number in SizesOfFont" value="{{ number }}">{{ number }}</option>
		</ui-select>
		
		<i class="fa fa-arrows-v" title="Line Height"></i>
		<ui-select id="crx_LineHeight" v-on:confirm="onLineHeightChanged" v-value="lineheight" title="Line Height">
			<option v-for="number in SizesOfLine" value="{{ number }}">{{ number }}</option>
		</ui-select>
		 
		<i class="fa fa-font" title="Font Names ex: Arial,Tahoma"></i>
		<input id="crx_FontFamilies" v-model="fontfamilies" v-on:change="onFontFamiliesChanged" style="width:130px" title="Font Names ex: Arial,Tahoma" />
		
		<i class="fa fa-cogs" style="margin-left:10px" v-on:click="onCogsClicked"></i>
		<div class="group">
			<ui-color id="log" v-bind:value="colors.log" v-on:change="onColorChanged" title="Color of Log"></ui-color>
			<ui-color id="error" v-bind:value="colors.error" v-on:change="onColorChanged" title="Color of Error"></ui-color>
			<ui-color id="warn" v-bind:value="colors.warn" v-on:change="onColorChanged" title="Color of Warn"></ui-color>
			<ui-color id="info" v-bind:value="colors.info" v-on:change="onColorChanged" title="Color of Info"></ui-color>
			<ui-color id="failed" v-bind:value="colors.failed" v-on:change="onColorChanged" title="Color of Failed"></ui-color>
			<ui-color id="success" v-bind:value="colors.success" v-on:change="onColorChanged" title="Color of Success"></ui-color>
		</div>
		<!--------------------------------------------------------------------------------------------------------------->
	</header>
	
	
	<style type="text/css">
	
		.text span,
		.info span,
		.info pre,
		section .item,
		section div .info div					{ font-size: {{ fontsize }}px!important; font-family: {{ fontfamilies }}; line-height: {{ lineheight }}px!important; }
		
		section .fa								{ font-size: {{ fontsize }}px!important; line-height: {{ lineheight }}px!important; }
		
		section .item[type=log]					{ color: {{ colors.log }}!important; }
		section .item[type=error],
		section .item[type=error] .info div		{ color: {{ colors.error }}!important; }
		section .item[type=warn]				{ color: {{ colors.warn }}!important; }
		section .item[type=info]				{ color: {{ colors.info }}!important; }
		section .item[type=failed]				{ color: {{ colors.failed }}!important; }
		section .item[type=success]				{ color: {{ colors.success }}!important; }
		
		
		/*folding icon hiehlight*/
		section .fa-caret-down,
		section .fa-caret-right 
		{
		 	font-size:{{ fontsize-2 }}px!important; color:#EEE!important; line-height: {{ lineheight - 4 }}px!important;
			display: inherit;
			width: 3px!important;
			height: 3px!important;
			box-shadow: 0px 0px 3px rgba( 255, 255, 255, 1);
    	}
	</style>
	
	<consolerx-list v-bind:messages="messages"></consolerx-list>
</div>
`;

let _data =
{
	messages:		[],
	SizesOfFont:	[],
	SizesOfLine:	[],

	fontsize:		crx.DefaultProfiles.fontsize,
	lineheight:		crx.DefaultProfiles.lineheight,
	fontfamilies:	crx.DefaultProfiles.fontfamilies,
	colors:			crx.DefaultProfiles.colors,
};

//Push runtime data to Editor.crx.data
if( !Editor.crx ) Editor.crx = crx;

//push options
for( let idx = 8; idx <= 20; idx++ ) { _data.SizesOfFont.push( idx ); }
for( let idx = 18; idx <= 36; idx++ ) { _data.SizesOfLine.push( idx ); }


let privateMethods =
{
	ClearLog(){ Editor.Ipc.sendToMain( crx.keys.cmds.Clear, '^(?!.*?SyntaxError)', true ); },
};

let _buildMethods = ( runtime ) =>
{
	let methods =
	{
		onClear(){ privateMethods.ClearLog(); },
		onPopupLogMenu()
		{
			let rect = runtime.$openLogBtn.getBoundingClientRect();
			Editor.Ipc.sendToPackage( crx.PackageName, 'popup-open-log-menu', rect.left, rect.bottom + 5 );
		},
		onPopSettings()
		{
			crx.Runtime.IgnorePatterns = crx.GetValidStringBy( crx.Runtime.Profile, 'IgnorePatterns', crx.DefaultProfiles.IgnorePatterns );
			Editor.Panel.open( 'consolerx-settings', crx.Runtime.IgnorePatterns );
		},
		onAutoCleanChanged( event )
		{
			let value	= event.target.value;
			crx.Runtime.UpdateProfileBy( 'AutoClean', value );
		},
		onFilterType( event )		{ manager.setFilterType( event.target.value ); },
		onCollapse( event )			{ manager.setCollapse( event.target.checked ); },
		onFilterRegex( event )		{ manager.setFilterRegex( event.target.value ); },
		onFilterText( event )		{ manager.setFilterText( event.target.value ); },
		onFontSizeChanged( event )
		{
			let value	= event.target.value;
			let size	=  parseInt( value );

			crx.Runtime.UpdateProfileBy( 'fontsize',size );
		},
		onLineHeightChanged( event )
		{
			let value	= event.target.value;
			let size	=  parseInt( value );

			crx.Runtime.UpdateProfileBy( 'lineheight', size );
			crx.Runtime.LineHeight = size;
			manager.update();
		},
		onFontFamiliesChanged( event )
		{
			let fonts = event.target.value

			crx.Runtime.UpdateProfileBy( 'fontfamilies', fonts );
		},
		onCogsClicked()
		{
			Editor.log( '[Editor] test log...' );
			Editor.info( '[Editor] test log...' );
			Editor.success( '[Editor] test log...' );
			Editor.warn( '[Editor] test log...' );
			Editor.error( '[Editor] test log...' );
			Editor.failed( '[Editor] test log...' );
		},
		onColorChanged( event )
		{
			let picker	= event.target;
			let hex		= crx.RgbaArrayToHexBy( picker.value );
			//console.info( `OnUpdateColor: Id[${ picker.id }] Rgba[${ hex }]` );

			this.colors[picker.id] = hex;
			crx.Runtime.UpdateProfileBy( 'colors', this.colors );
		},
	};
	return methods;
}




const _DefineOfPanel =
{
	style: stylesheet,
	template: uiTemplate,

	$:{ consolerx: '#consolerx', openLogBtn:  '#openLogBtn', cbxAutoClean: '#cbxAutoClean' },

	listeners:
	{
		'panel-resize'(){ manager.update(); },
		'panel-show'()	{ manager.update(); }
	},
	messages:
	{
		'editor:console-log'( event, message )		{ manager.addItem( { type: 'log', message: message } ); },
		'editor:console-success'( event, message )	{ manager.addItem( { type: 'success', message: message } ); },
		'editor:console-failed'( event, message )	{ manager.addItem( { type: 'failed', message: message } ); },
		'editor:console-info'( event, message )		{ manager.addItem( { type: 'info', message: message } ); },
		'editor:console-warn'( event, message )		{ manager.addItem( { type: 'warn', message: message } ); },
		'editor:console-error'( event, message )	{ manager.addItem( { type: 'error', message: message } ); },
		'editor:console-clear'( event, pattern, useRegex )
		{
			if ( !pattern ) return manager.clear();

			let filter;
			if ( useRegex )
			{
				try { filter = new RegExp( pattern ); }
				catch ( err ) { filter = new RegExp( '' ); }
			}
			else filter = pattern;

			for ( let i = manager.list.length - 1; i >= 0; i-- )
			{
				let log = manager.list[i];
				if ( useRegex )
				{ if ( filter.exec( log.title ) ) manager.list.splice( i, 1 ); }
				else
				{ if ( log.title.indexOf( filter ) !== -1 ) manager.list.splice( i, 1 ); }
			}

			manager.update();
		},

		'consolerx:query-last-error-log'( event )
		{
			if ( !event.reply ) return;

			let list = manager.list;
			let index = list.length - 1;
			while ( index >= 0 )
			{
				let item = list[index--];
				if ( item.type === 'error' || item.type === 'failed' || item.type === 'warn' ) return event.reply( null, item );
			}

			event.reply( null, undefined );
		},
		'update-ignore-patterns'( event, patterns )
		{
			//Editor.log( `[Panel] Received Update Ignore: ${ patterns }` );

			crx.Runtime.UpdateProfileBy( 'IgnorePatterns', patterns );
			manager.setIgnorePatternsBy( patterns );
			//Editor.log( `update IgnorePatterns: ${ patterns }` );
		},

		'scene:play-on-device'( event )
		{
			if( crx.Runtime.AutoClean ) privateMethods.ClearLog();
		},

		'query-ip'( event )
		{
			if( event.reply )
			{
				event.reply( crx.Runtime.IgnorePatterns );
			}
		},
	},
	ready()
	{
		let buildVue =
		{
			el:         this.$consolerx,
			components:
			{
				'consolerx-list':	components.List,
			},
			data: _data,
			methods: _buildMethods( this ),
		};

		//Initialize crx profile and validate buildVue.data
		crx.InitializeProfileBy( this.profiles.project, buildVue.data, crx.Runtime );

		this._vm = new Vue( buildVue );

		//restore values
		this.$cbxAutoClean.checked = crx.Runtime.AutoClean;

		manager.setIgnorePatternsBy( crx.Runtime.IgnorePatterns );
		manager.SetRenderItemsBy( this._vm.messages );

		Editor.Ipc.sendToMain( crx.keys.editor.ConsoleQuery, ( err, results ) =>{ manager.addItems( results ); } );

	},
	close()
	{
	},

	clear()
	{
		manager.clear();
		Editor.Ipc.sendToMain( crx.keys.cmds.Clear );
	}

};



Editor.Panel.extend( _DefineOfPanel );
