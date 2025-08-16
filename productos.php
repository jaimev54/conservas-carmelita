<?php
  // 1) Título + Header (abre <body> y carga estilos)
  $PAGE_TITLE = 'Productos';
  include __DIR__ . '/includes/header.php';

  // 2) Cargar catálogo desde PHP
  //    OJO: este archivo debe estar en "conservas-carmelita/data/products.php"
  require __DIR__ . '/data/products.php';

  // Asegurar que $PRODUCTS exista como arreglo
  if (!isset($PRODUCTS) || !is_array($PRODUCTS)) {
    $PRODUCTS = [];
  }
?>
<header class="section__head">
  <h1>Catálogo</h1>
  <div class="filters">
    <input id="searchInput" class="input" type="search" placeholder="Buscar producto...">
    <select id="categoryFilter" class="select">
      <option value="">Todas las categorías</option>
      <?php
        // Categorías únicas (evita null/'' y aplica HTML escaping)
        $cats = array_values(array_unique(array_filter(array_map(
          fn($p)=> isset($p['category']) ? trim((string)$p['category']) : '',
          $PRODUCTS
        ))));
        foreach ($cats as $c) {
          echo '<option value="' . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . '">' .
               htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . '</option>';
        }
      ?>
    </select>
    <button id="clearFilters" class="btn btn--ghost">Limpiar</button>
  </div>
</header>

<section id="catalog" class="grid"></section>

<!-- 3) Inyectar productos ANTES de cargar app.js (que viene en footer.php) -->
<script>
  // Exponer productos al front sin fetch/eval
  window.__PRODUCTS__ = <?= json_encode($PRODUCTS, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;

  // (Opcional) Log de depuración — puedes quitarlo cuando confirmes que hay datos
  console.log("PRODUCTS:", window.__PRODUCTS__, "len:", (window.__PRODUCTS__||[]).length);
</script>

<?php
  // 4) Footer (cierra </main>, carga app.js y </body>)
  include __DIR__ . '/includes/footer.php';
