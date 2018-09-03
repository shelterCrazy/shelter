let crx =
{
	PackageName:	'consolerx',

	keys:
	{
		msgs:
		{
			Open:			'open',
			OpenLogFile:	'open-log-file',
			PopupLogMenu:	'popup-open-log-menu',
			PopupItemMenu:	'popup-item-menu',
		},
		cmds:
		{
			Clear:					'consolerx:clear',
			QueryLastErrorLog:		'consolerx:query-last-error-log',
			UpdateIgnorePatterns:	'consolerx:update-ignore-patterns',
		},
		editor:
		{
			ConsoleQuery:	'editor:console-query',
			PanelDock:		'editor:panel-dock',
			PanelOpen:		'editor:panel-open',
			PanelPopup:		'editor:panel-popup',
		},
	},

	DefaultProfiles:
	{
		fontsize:		11,
		lineheight:		28,
		fontfamilies:	'Monaco, Droid Sans',
		colors:
		{
			log:	"#999999",
			error:	"#DA2121",
			warn:	"#999900",
			info:	"#0099FF",
			failed:	"#DA2121",
			success:"#009900"
		},
		IgnorePatterns:	'',
		AutoClean: 		false,
	}
};


//================================================================================================================
// Runtime
//================================================================================================================
crx.Runtime =
{
	Profile:		null,
	LineHeight:		crx.DefaultProfiles.lineheight,
	IgnorePatterns:	crx.DefaultProfiles.IgnorePatterns,
	AutoClean:		crx.DefaultProfiles.AutoClean,
};

crx.Runtime.UpdateProfileBy = function( key, value )
{
	let profile = crx.Runtime.Profile;
	if( !profile ) { Editor.error( 'Runtime Profile is Null!' ); return; }

	//Editor.log( `[UpdateProfile] key[${ key }] value[${value}]` );

	crx.Runtime[key] = value;
	profile.data[key] = value;
	profile.save();
};


//================================================================================================================

crx.CalculateNeedAddLineHeightBy = function( item )
{
	//defaults LineHeight:30, rows:26
	return ( item.fold ) ? crx.Runtime.LineHeight : item.rows * ( crx.Runtime.LineHeight ) + 14;
	//cc.log( 'Editor: fontSize:' + this.data.fontsize );
};
crx.CalculateMultiLineHeightBy = function( source )
{
	return source.rows * ( crx.Runtime.LineHeight ) + 14 - crx.Runtime.LineHeight;
};





crx.OpenLogFileOptions =
[
	{
		label:  Editor.T( 'CONSOLE.editor_log' ),
		params: [],
		click()
		{
			Editor.Ipc.sendToMain( 'consolerx:open-log-file' );
		}
	},
	{
		label:  Editor.T( 'CONSOLE.cocos_console_log' ),
		params: [],
		click()
		{
			Editor.Ipc.sendToMain( 'app:open-cocos-console-log' );
		}
	},
];

crx.GetValidBooleanBy = function( profile, key, defaultValue )
{
	let value = profile.data[key];
	//Editor.log( `[boolean] read[${key}] type:${ typeof( value ) }` );
	if( typeof( value ) !== 'boolean' )
	{
		value = defaultValue;
		profile.data[key] = value;
		profile.save();
	}
	return value;
};
crx.GetValidNumberBy = function( profile, key, defaultValue )
{
	let value = profile.data[key];
	if( !value || typeof( value ) !== 'number' )
	{
		value = defaultValue;
		profile.data[key] = value;
		profile.save();
	}
	return value;
};
crx.GetValidStringBy = function( profile, key, defaultValue )
{
	let value = profile.data[key];
	if( !value || typeof( value ) !== 'string' )
	{
		value = defaultValue;
		profile.data[key] = value;
		profile.save();
	}
	return value;
};
crx.GetValidColorsBy = function( profile )
{
	let defaultColors	= crx.DefaultProfiles.colors;
	let colors			= profile.data['colors'];

	let _save = () => { profile.data['colors'] = colors; profile.save(); };

	if( !colors ) { colors = defaultColors; _save(); }

	let _valid_colorby = ( key ) =>
	{
		if( crx.IsColorHexBy( colors[key] ) ) return;
		colors[key] = defaultColors[key];
		_save();
	};

	_valid_colorby( 'log' );
	_valid_colorby( 'error' );
	_valid_colorby( 'warn' );
	_valid_colorby( 'info' );
	_valid_colorby( 'failed' );
	_valid_colorby( 'success' );

	return colors;
};


crx.InitializeProfileBy = function( profile, data, targetRuntime = null )
{
	let runtime = targetRuntime || crx.Runtime;

	runtime.Profile = profile;

	data.fontsize		= crx.GetValidNumberBy( profile, 'fontsize',	crx.DefaultProfiles.fontsize );
	data.lineheight		= crx.GetValidNumberBy( profile, 'lineheight',	crx.DefaultProfiles.lineheight );
	data.fontfamilies	= crx.GetValidStringBy( profile, 'fontfamilies',crx.DefaultProfiles.fontfamilies );
	data.colors			= crx.GetValidColorsBy( profile );

	runtime.LineHeight		= data.lineheight;
	runtime.IgnorePatterns	= crx.GetValidStringBy( profile, 'IgnorePatterns',crx.DefaultProfiles.IgnorePatterns );
	runtime.AutoClean		= crx.GetValidBooleanBy( profile, 'AutoClean',	crx.DefaultProfiles.AutoClean );
};









crx.RgbToHexBy = function( r, g, b )
{
	return "#" +
	  ( "0" + parseInt( r, 10 ).toString( 16 ) ).slice(-2) +
	  ( "0" + parseInt( g, 10 ).toString( 16 ) ).slice(-2) +
	  ( "0" + parseInt( b, 10 ).toString( 16 ) ).slice(-2);
};

const _regex_hex = /^#([A-Fa-f0-9]{3}){1,2}$/;
crx.IsColorHexBy = function( hex )
{
	return _regex_hex.test( hex );
};
crx.HexToRgbArrayBy = function( hex )
{
    if( !_regex_hex.test( hex ) ) throw new Error('Bad Hex');

	let c = hex.substring( 1 ).split('');
	if( c.length === 3) {
		c= [ c[0], c[0], c[1], c[1], c[2], c[2] ];
	}
	c = '0x' + c.join( '' );
	return [ (c>>16)&255, (c>>8)&255, c&255 ];
};
crx.HexToRgbaBy = function( hex )
{
	let rgb = crx.HexToRgbArrayBy( hex );
	return 'rgba('+ rgb.join( ',' ) + ',1)';
};

crx.RgbaArrayToHexBy = function( array ) { return crx.RgbToHexBy( array[0], array[1], array[2] ); };







//-------------------------------------------------------------------------------------------



module.exports = crx;