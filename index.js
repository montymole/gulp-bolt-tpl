var through = require( 'through' ),
    gutil = require( 'gulp-util' ),
    PluginError = gutil.PluginError,
    path = require( 'path' ),
    File = gutil.File,
    minify = require( 'html-minifier' ).minify;

const PLUGIN_NAME = 'gulp-bolt-tpl';

function compileTpls( fileName ) {

    var minify = require( 'html-minifier' ).minify;
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeCommentsFromCDATA: true,
        removeRedundantAttributes: true,
        collapseBooleanAttributes: true
    };

    var tpls = {};

    return through( function( file ) {

        if ( file.isBuffer( ) ) {
            var name = path.basename( file.path ).split( '.' ).shift( );
            tpls[ name ] = minify( String( file.contents ), options );
        } else {
            this.emit( 'error', new PluginError( PLUGIN_NAME, 'Only Buffers are supported!' ) );
        }


    }, function( ) {

        var tplsFile = new File( {
            path: fileName,
            contents: new Buffer( 'var tpl=' + JSON.stringify( tpls ) + ';' )
        } );

        this.emit( 'data', tplsFile );
        this.emit( 'end' );

    } );
};

module.exports = compileTpls;
