<?php $PAGE_TITLE='Inicio'; include __DIR__.'/includes/header.php'; require __DIR__.'/data/products.php'; ?>
<section class="hero">
  <div class="hero__text">
    <h1>Conservas con <span class="text-green">sabor auténtico</span></h1>
    <p>Descubre nuestro catálogo y cotiza tu pedido por WhatsApp de forma rápida.</p>
    <div class="hero__cta">
      <a class="btn btn--green" href="/productos.php">Ver productos</a>
      <a class="btn btn--ghost" href="/carrito.php">Ver carrito</a>
    </div>
  </div>
  <div class="hero__img"></div>
</section>

<section class="section">
  <header class="section__head">
    <h2>Destacados</h2>
  </header>
  <div id="featured" class="grid"></div>
</section>
<script>
  // Exponer productos para el bloque de destacados
  window.__PRODUCTS__ = <?= json_encode($PRODUCTS, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) ?>;
</script>
<?php include __DIR__.'/includes/footer.php'; ?>
