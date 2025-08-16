const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

const paths = {
  scss: "assets/scss/**/*.scss",
  css: "assets/css",
  php: "**/*.php"
};

// Compilar SCSS → CSS
function styles() {
  return gulp.src("assets/scss/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

// Build (minificado)
function buildStyles() {
  return gulp.src("assets/scss/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css));
}

// Servidor de desarrollo (SIN auto-abrir navegador)
function serve() {
  browserSync.init({
    // 🔁 Elige UNO de estos y deja el otro comentado:

    // 1) Proxy a tu servidor PHP (XAMPP/Laragon/PHP embebido)
    proxy: "http://localhost/conservas-carmelita",

    // 2) Estático (si no usas PHP)
    // server: { baseDir: "./" },

    port: 3000,
    open: false,     // ⛔ No abrir navegador automáticamente
    notify: false,   // Ocultar banner de BrowserSync
    ui: false,       // Desactiva UI extra
    ghostMode: false // No replicar clicks/scroll en varias pestañas
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.php).on("change", browserSync.reload);
}

exports.styles = styles;
exports.build = buildStyles;
exports.default = gulp.series(styles, serve);
