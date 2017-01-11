var gulp = require( 'gulp' ),
    imagemin      = require( 'gulp-imagemin'),
    clean         = require( 'gulp-clean' ),
    concat        = require( 'gulp-concat' ),
    htmlReplace   = require ( 'gulp-html-replace' ),
    uglify        = require( 'gulp-uglify' ),
    usemin        = require( 'gulp-usemin' ),
    cssmin        = require( 'gulp-cssmin' ),
    browserSync   = require( 'browser-sync' ),
    jshint        = require( 'gulp-jshint' ),
    jshintStylish = require( 'jshint-stylish' ),
    csslint       = require( 'gulp-csslint' ),
    autoPrefixer  = require( 'gulp-autoprefixer' ),
    less          = require( 'gulp-less' );


// Tarefa default

gulp.task( 'default', [ 'copy' ], function(){

    gulp.start( 'build-img', 'usemin' );

});

// Copiando diretório src

gulp.task( 'copy', [ 'clean' ], function() {

    return gulp.src( 'src/**/*' )
    .pipe(
        gulp.dest( 'dist' )
    );
});

// Limpando dist

gulp.task( 'clean', function() {

    return gulp.src( 'dist' )
        .pipe(
            clean()
        );
});

// Minificando imagens

gulp.task( 'build-img', function() {

    gulp.src( 'dist/img/**/*' )
    .pipe(
        imagemin()
    )
    .pipe( gulp.dest( 'dist/img' ) );

});

// Minificando CSS e JS

gulp.task( 'usemin', function(){
    gulp.src( 'dist/**/*.html' )
    .pipe( usemin({
        'js': [ uglify ],
        'css': [ autoPrefixer, cssmin ]
    }))
    .pipe( gulp.dest( 'dist/' ));
});

// Browser Sync

gulp.task( 'server', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch( 'src/js/*.js' ).on( 'change', function( event ){
        gulp.src( event.path )
            .pipe( jshint() )
            .pipe( jshint.reporter( jshintStylish ) );
    });

    gulp.watch( 'src/css/*.css' ).on( 'change', function( event ){
        gulp.src( event.path )
            .pipe( csslint() );
            // .pipe( csslint.formatter() );
    });

    gulp.watch( 'src/less/*.less' ).on( 'change', function( event ){
        console.log( `Compilando arquivo ${ event.path }` );
        gulp.src( event.path )
            .pipe( less().on( 'error', function( error ) {
                console.log( 'Problema na compilação' );
                console.log( error.message );  
            }))
            .pipe( gulp.dest( 'src/css' ) );
    });

    gulp.watch( 'src/**/*' ).on( 'change', browserSync.reload );
});
