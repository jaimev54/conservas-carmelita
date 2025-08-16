<?php require_once __DIR__.'/config.php'; ?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= isset($PAGE_TITLE)? $PAGE_TITLE.' • ' : '' ?><?= $BRAND ?></title>
  <meta name="description" content="Catálogo de productos <?= $BRAND ?> con cotización por WhatsApp" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
  <style>:root{ --green: <?= $COLOR_MAIN ?>; }</style>
</head>
<body>
  <header class="header">
    <nav class="nav container">
      <a href="/" class="brand">
    <img src="assets/img/logo.jpg" alt="Conservas Carmelita" class="brand__logo">
    <span class="brand__title">Conservas Carmelita</span>
      </a>
      <div class="nav__links">
        <a href="/productos.php">Productos</a>
        <a href="/carrito.php">Carrito <span id="navCartCount" class="pill">0</span></a>
        <a href="/contacto.php">Contacto</a>
      </div>
    </nav>
  </header>
  <main class="container">
