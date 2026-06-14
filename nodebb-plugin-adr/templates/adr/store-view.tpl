<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-store"></i> {store.store_name}</h1>
  {{{ if store.store_desc }}}<p class="adr-muted">{store.store_desc}</p>{{{ end }}}
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
      <div class="adr-item-stats">
        <span>Pwr: {items.item_power}</span>
        <span>Dur: {items.item_duration}</span>
        <span>Wt: {items.item_weight}</span>
      </div>
      <div class="adr-item-price"><i class="fa fa-coins"></i> {items.item_price} gold</div>
      {{{ if items.item_desc }}}<p class="adr-item-desc">{items.item_desc}</p>{{{ end }}}
      <form method="post" action="/adr/shops/buy/store">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="storeId" value="{store.store_id}" />
        <input type="hidden" name="itemId" value="{items.item_id}" />
        <button type="submit" class="btn btn-primary btn-sm adr-btn"><i class="fa fa-bag-shopping"></i> Buy</button>
      </form>
    </div>
    {{{ end }}}
  </div>
  {{{ else }}}
  <p class="adr-muted">This store is currently empty.</p>
  {{{ end }}}

  <a href="/adr/shops" class="btn btn-outline adr-btn-outline"><i class="fa fa-arrow-left"></i> Back to Market</a>
</div>
