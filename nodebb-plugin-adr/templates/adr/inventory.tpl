<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-backpack"></i> Inventory</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-inv-header">
    <div class="adr-panel-inline">
      <span>Gold: <strong class="adr-gold">{character.character_gold}</strong></span>
      <span>Weight: <strong>{weight.current}/{weight.max}</strong></span>
    </div>
  </div>

  <div class="adr-tabs">
    <button class="adr-tab active" data-tab="bag">Bag ({items.length})</button>
    <button class="adr-tab" data-tab="warehouse">Warehouse ({warehouse.length})</button>
  </div>

  <div class="adr-tab-content active" id="tab-bag">
    {{{ if items.length }}}
    <div class="adr-item-grid">
      {{{ each items }}}
      <div class="adr-item-card adr-quality-{items.item_quality}">
        <div class="adr-item-name">{items.item_name}</div>
        <div class="adr-item-type">{items.typeLabel}</div>
        <div class="adr-item-stats">
          Pwr: {items.item_power} &middot; Dur: {items.item_duration}/{items.item_duration_max}
        </div>
        <div class="adr-item-actions">
          {{{ if items.item_equippable }}}
          <form method="post" action="/adr/equipment/equip" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{items.item_id}" />
            <button type="submit" class="btn btn-xs btn-primary adr-btn">Equip</button>
          </form>
          {{{ end }}}
          {{{ if items.item_usable }}}
          <form method="post" action="/adr/inventory/use" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{items.item_id}" />
            <button type="submit" class="btn btn-xs btn-success adr-btn">Use</button>
          </form>
          {{{ end }}}
          <form method="post" action="/adr/inventory/warehouse" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{items.item_id}" />
            <button type="submit" class="btn btn-xs btn-outline adr-btn-xs">Store</button>
          </form>
          <form method="post" action="/adr/inventory/sell" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{items.item_id}" />
            <button type="submit" class="btn btn-xs btn-warning adr-btn-xs">Sell</button>
          </form>
          <form method="post" action="/adr/inventory/drop" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{items.item_id}" />
            <button type="submit" class="btn btn-xs btn-danger adr-btn-xs">Drop</button>
          </form>
        </div>
      </div>
      {{{ end }}}
    </div>
    {{{ else }}}
    <p class="adr-muted"><i class="fa fa-backpack"></i> Your bag is empty.</p>
    {{{ end }}}
  </div>

  <div class="adr-tab-content" id="tab-warehouse" style="display:none">
    {{{ if warehouse.length }}}
    <div class="adr-item-grid">
      {{{ each warehouse }}}
      <div class="adr-item-card adr-quality-{warehouse.item_quality}">
        <div class="adr-item-name">{warehouse.item_name}</div>
        <div class="adr-item-type">{warehouse.typeLabel}</div>
        <div class="adr-item-stats">Pwr: {warehouse.item_power}</div>
        <div class="adr-item-actions">
          <form method="post" action="/adr/inventory/retrieve" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{warehouse.item_id}" />
            <button type="submit" class="btn btn-xs btn-primary adr-btn">Retrieve</button>
          </form>
          <form method="post" action="/adr/inventory/sell" style="display:inline">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{warehouse.item_id}" />
            <button type="submit" class="btn btn-xs btn-warning adr-btn-xs">Sell</button>
          </form>
        </div>
      </div>
      {{{ end }}}
    </div>
    {{{ else }}}
    <p class="adr-muted">Your warehouse is empty.</p>
    {{{ end }}}
  </div>

  <div class="adr-inv-footer">
    <a href="/adr/equipment" class="btn btn-outline adr-btn-outline"><i class="fa fa-shield-halved"></i> Equipment</a>
    <a href="/adr/shops" class="btn btn-outline adr-btn-outline"><i class="fa fa-shop"></i> Market</a>
  </div>
</div>
