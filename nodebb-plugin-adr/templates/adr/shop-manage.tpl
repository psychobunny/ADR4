<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-gears"></i> Manage My Shop</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  {{{ if shop }}}
  <div class="adr-panel">
    <h3><i class="fa fa-pen"></i> Edit Shop</h3>
    <form method="post" action="/adr/shops/manage/update" class="adr-form">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="hidden" name="shopId" value="{shop.shop_id}" />
      <div class="adr-form-row">
        <label>Shop Name</label>
        <input type="text" name="shop_name" value="{shop.shop_name}" maxlength="80" class="adr-input" required />
      </div>
      <div class="adr-form-row">
        <label>Description</label>
        <textarea name="shop_desc" maxlength="255" class="adr-textarea">{shop.shop_desc}</textarea>
      </div>
      <button type="submit" class="btn btn-primary adr-btn">Update</button>
    </form>
  </div>

  <div class="adr-panel">
    <h3>Current Listings</h3>
    {{{ if shopItems.length }}}
    <div class="adr-item-grid">
      {{{ each shopItems }}}
      <div class="adr-item-card adr-quality-{shopItems.item_quality}">
        <div class="adr-item-name">{shopItems.item_name}</div>
        <div class="adr-item-price"><i class="fa fa-coins"></i> {shopItems.item_shop_price} gold</div>
        <form method="post" action="/adr/shops/manage/remove-item">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="itemId" value="{shopItems.item_id}" />
          <button type="submit" class="btn btn-xs btn-danger adr-btn-xs">Remove</button>
        </form>
      </div>
      {{{ end }}}
    </div>
    {{{ else }}}
    <p class="adr-muted">No items listed yet.</p>
    {{{ end }}}
  </div>

  <div class="adr-panel">
    <h3>List an Item</h3>
    <form method="post" action="/adr/shops/manage/add-item" class="adr-form adr-form-inline">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <select name="itemId" class="adr-select" required>
        <option value="">-- Select item --</option>
        {{{ each inventoryItems }}}
        <option value="{inventoryItems.item_id}">{inventoryItems.item_name}</option>
        {{{ end }}}
      </select>
      <input type="number" name="price" placeholder="Price (gold)" class="adr-input" min="1" required />
      <button type="submit" class="btn btn-primary adr-btn">List Item</button>
    </form>
  </div>

  {{{ else }}}
  <div class="adr-panel">
    <h3>Open a Shop</h3>
    <p>You don't have a shop yet. Opening one costs <strong>{shopCost} gold</strong>.</p>
    <form method="post" action="/adr/shops/manage/create" class="adr-form">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <div class="adr-form-row">
        <label>Shop Name</label>
        <input type="text" name="shop_name" maxlength="80" class="adr-input" required />
      </div>
      <div class="adr-form-row">
        <label>Description</label>
        <textarea name="shop_desc" maxlength="255" class="adr-textarea"></textarea>
      </div>
      <button type="submit" class="btn btn-primary adr-btn"><i class="fa fa-shop"></i> Open Shop ({shopCost} gold)</button>
    </form>
  </div>
  {{{ end }}}
</div>
