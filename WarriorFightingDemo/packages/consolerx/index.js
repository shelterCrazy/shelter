'use strict';
const Electron = require( 'electron' );
const Clipboard = Electron.clipboard;

const crx = require( './crx' );

let index =
{
	load()
	{
		Editor.Menu.register
		(
			crx.keys.OpenLogFile,
			() => { return crx.OpenLogFileOptions; },
			true
		);
	},
	unload()
	{
		Editor.Menu.unregister( crx.keys.OpenLogFile );
	},
	messages: {}
};

//------------------------------------------------------------------------------
// setting messages
//------------------------------------------------------------------------------
index.messages[ crx.keys.msgs.Open ] = () =>
{
	Editor.Panel.open( crx.PackageName );
};
index.messages[ crx.keys.msgs.OpenLogFile ] = () =>
{
	Electron.shell.openItem( Editor.logfile );
};

index.messages[ crx.keys.cmds.Clear ] = ( event, pattern, useRegex ) =>
{
	Editor.clearLog( pattern, useRegex );
};

index.messages[ crx.keys.msgs.PopupLogMenu ] = ( event, x, y ) =>
{
	let menuTmpl = Editor.Menu.getMenu( 'open-log-file' );

	let editorMenu = new Editor.Menu( menuTmpl, event.sender );
	x = Math.floor( x );
	y = Math.floor( y );
	editorMenu.nativeMenu.popup( Electron.BrowserWindow.fromWebContents( event.sender ), x, y );
	editorMenu.dispose();
};

index.messages[ crx.keys.msgs.PopupItemMenu ] = ( event, x, y, text ) =>
{
	var menuTmpl =
	[
		{
			label:  Editor.T( 'CONSOLE.copy_to_clipboard' ),
			params: [],
			click()
			{
				Clipboard.writeText( text || '' );
			}
		}
	];
	let editorMenu = new Editor.Menu( menuTmpl, event.sender );
	x = Math.floor( x );
	y = Math.floor( y );
	editorMenu.nativeMenu.popup( Electron.BrowserWindow.fromWebContents( event.sender ), x, y );
	editorMenu.dispose();
};


module.exports = index;
