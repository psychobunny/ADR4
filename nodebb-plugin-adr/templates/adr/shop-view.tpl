<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-user-tie"></i> {shop.shop_name}</h1>
  <p class="adr-muted">Owned by <a href="/adr/character/{shop.shop_owner_id}">{shop.ownerName}</a></p>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}
  {{{ if character }}}
  <div class="adr-panel-inline">
    <span>Your Gold: <strong class="adr-gold">{character.character_gold}</strong></span>
  </div>
  {{{ end }}}
  {{{ if items.length }}}
  <div class="adr-item-grid">
    {{{ each items }}}
    <div class="adr-item-card adr-quality-{items.item_quality}">
      <div class="adr-item-name">{items.item_name}</div>
      <div class="adr-item-type">{items.typeLabel}</div>
      <div class="adr-item-stats">Pwr: {items.item_power} &middot; Dur: {items.item_duration}</div>
      <div class="adr-item-price"><i class="fa fa-coins"></i> {items.item_shop_price} gold</div>
      <form method="post" action="/adr/shops/buy/shop">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="shopId" value="{shop.shop_id}" />
        <input type="hidden" name="itemId" value="{items.item_id}" />
        <button type="submit" class="btn btn-primary btn-sm adr-btn"><i class="fa fa-bag-shopping"></i> Buy</button>
      </form>
    </div>
    {{{ end }}}
  </div>
  {{{ else }}}
  <p class="adr-muted">This shop has no items listed.</p>
  {{{ end }}}
  <a href="/adr/shops" class="btn btn-outline adr-btn-outline"><i class="fa fa-arrow-left"></i> Back to Market</a>
</div>
