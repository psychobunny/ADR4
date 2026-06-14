<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-shield-halved"></i> Equipment</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-equip-layout">
    <div class="adr-panel adr-equip-slots">
      <h3>Equipped Slots</h3>
      <div class="adr-slot-grid">
        {{{ each slots }}}
        <div class="adr-slot {{{ if slots.item }}}adr-slot-filled adr-quality-{slots.item.item_quality}{{{ end }}}">
          <div class="adr-slot-label">{slots.label}</div>
          {{{ if slots.item }}}
          <div class="adr-slot-item">
            <span class="adr-item-name">{slots.item.item_name}</span>
            <span class="adr-item-stats">Pwr: {slots.item.item_power} Dur: {slots.item.item_duration}</span>
            <form method="post" action="/adr/equipment/unequip">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="itemId" value="{slots.item.item_id}" />
              <button type="submit" class="btn btn-xs btn-outline adr-btn-xs">Remove</button>
            </form>
          </div>
          {{{ else }}}
          <div class="adr-slot-empty"><i class="fa fa-minus"></i> Empty</div>
          {{{ end }}}
        </div>
        {{{ end }}}
      </div>
    </div>

    <div class="adr-panel adr-equip-inventory">
      <h3>Equippable Items</h3>
      {{{ if equippable.length }}}
      <div class="adr-item-grid">
        {{{ each equippable }}}
        <div class="adr-item-card adr-quality-{equippable.item_quality}">
          <div class="adr-item-name">{equippable.item_name}</div>
          <div class="adr-item-type">{equippable.typeLabel}</div>
          <div class="adr-item-stats">Pwr: {equippable.item_power} &middot; Slot: {equippable.slotLabel}</div>
          <form method="post" action="/adr/equipment/equip">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" name="itemId" value="{equippable.item_id}" />
            <button type="submit" class="btn btn-xs btn-primary adr-btn">Equip</button>
          </form>
        </div>
        {{{ end }}}
      </div>
      {{{ else }}}
      <p class="adr-muted">No equippable items in your bag.</p>
      {{{ end }}}
    </div>
  </div>

  <div class="adr-stat-preview adr-panel">
    <h3>Current Combat Stats</h3>
    <div class="adr-stats-list">
      <div class="adr-stat-pair"><span>Total Attack</span><strong>{character.totalAttack}</strong></div>
      <div class="adr-stat-pair"><span>Total Defense</span><strong>{character.totalDefense}</strong></div>
      <div class="adr-stat-pair"><span>HP</span><strong>{character.character_hp}/{character.character_hp_max}</strong></div>
      <div class="adr-stat-pair"><span>AC</span><strong>{character.character_ac}</strong></div>
    </div>
  </div>
</div>
