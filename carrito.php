<?php $PAGE_TITLE='Carrito'; include __DIR__.'/includes/header.php'; ?>
<header class="section__head">
  <h1>Tu selección</h1>
</header>
<section>
  <div id="cartList" class="cartlist"></div>
  <div class="cart__summary">
    <strong id="cartTotal">Total: $0.00</strong>
    <div class="cart__actions">
      <a class="btn btn--ghost" href="/productos.php">Seguir comprando</a>
      <button class="btn btn--green" id="sendCart">Enviar por WhatsApp</button>
    </div>
  </div>
</section>
<?php include __DIR__.'/includes/footer.php'; ?>
