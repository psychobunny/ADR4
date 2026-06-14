<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-shop"></i> Market</h1>

  <div class="adr-market-section">
    <h2>Official Stores</h2>
    <div class="adr-store-grid">
      {{{ each stores }}}
      <a class="adr-store-card" href="/adr/shops/store/{stores.store_id}">
        <i class="fa fa-store adr-store-icon"></i>
        <span class="adr-store-name">{stores.store_name}</span>
        <span class="adr-store-desc">{stores.store_desc}</span>
      </a>
      {{{ end }}}
    </div>
  </div>

  <div class="adr-market-section">
    <h2>Player Shops</h2>
    {{{ if shops.length }}}
    <div class="adr-store-grid">
      {{{ each shops }}}
      <a class="adr-store-card" href="/adr/shops/user/{shops.shop_id}">
        <i class="fa fa-user-tie adr-store-icon"></i>
        <span class="adr-store-name">{shops.shop_name}</span>
        <span class="adr-store-desc">Owner: {shops.ownerName}</span>
      </a>
      {{{ end }}}
    </div>
    {{{ else }}}
    <p class="adr-muted">No player shops open yet.</p>
    {{{ end }}}
  </div>

  <div class="adr-market-links">
    <a href="/adr/shops/manage" class="btn btn-outline adr-btn-outline"><i class="fa fa-gears"></i> Manage My Shop</a>
  </div>
</div>
