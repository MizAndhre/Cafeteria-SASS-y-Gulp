// function tarea(done) {
// 	console.log("boba first");

// 	done();
// }

// exports.tarea = tarea;

const { src, dest, watch, series, parallel } = require("gulp");

// Dependencias de CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require('cssnano')

// Dependencias de IMAGENES
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
	// Compilar SASS => PASOS

	// 1. Identificar Archivo
	src("src/scss/app.scss")
		// iniciar sourcemaps
		.pipe(sourcemaps.init())
		// 2. Compilarla
		// .pipe(sass({ outputStyle: "compressed" }))
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano() ]))
		//guardar el sourcemaps antes del css
		.pipe(sourcemaps.write("."))
		// 3. Guardar el .css
		.pipe(dest("build/css"));

	done();
}

// Manejar las imagenes con gulp
function imagenes() {
	// "return" reemplaza al "done"
	return (
		src("src/img/**/*")
			// minimizar imagenes primero
			.pipe(imagemin({ optimizationLevel: 3 }))
			// Mandar al build:
			.pipe(dest("build/img"))
	);
}

function versionWebp() {
	const opciones = {
		quality: 50,
	};
	// filtrar imagenes png y jpg
	return (
		src("src/img/**/*.{jpg, png}")
			// convertirlas a webp
			.pipe(webp(opciones))
			// guardarlas
			.pipe(dest("build/img"))
	);
}

function versionAvif() {
	const opciones = {
		quality: 50,
	};
	// filtrar imagenes png y jpg
	return (
		src("src/img/**/*.{jpg, png}")
			// convertirlas a avif
			.pipe(avif(opciones))
			// guardarlas
			.pipe(dest("build/img"))
	);
}

// Crear un WATCH => revisar si hay un cambio o no en los archivos
function dev() {
	// dos valores
	// 1. Qué archivo ver
	// 2.Qué hacer si hay cambio
	// watch("src/scss/app.scss", css); Eliminada

	watch("src/scss/**/*.scss", css);
	watch("src/img/**/*", imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

// series => iniciar tarea una, luego otra
// parallel => tareas inician al tiempo
