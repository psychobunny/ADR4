<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-fire"></i> Forge</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-forge-layout">
    <div class="adr-panel">
      <h3><i class="fa fa-pickaxe"></i> Mining (Skill Lv {character.character_skill_mining})</h3>
      <p>Mine for ore and raw materials.</p>
      <form method="post" action="/adr/forge/mine">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <button type="submit" class="btn btn-primary adr-btn"><i class="fa fa-hammer"></i> Mine Ore</button>
      </form>
    </div>

    <div class="adr-panel">
      <h3><i class="fa fa-fire-flame-curved"></i> Forge Weapon (Skill Lv {character.character_skill_forge})</h3>
      <p>Combine two materials to forge a weapon.</p>
      {{{ if materials.length }}}
      <form method="post" action="/adr/forge/weapon" class="adr-form">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="adr-form-row">
          <label>Material 1</label>
          <select name="mat1Id" class="adr-select" required>
            <option value="">-- Select --</option>
            {{{ each materials }}}
            <option value="{materials.item_id}">{materials.item_name}</option>
            {{{ end }}}
          </select>
        </div>
        <div class="adr-form-row">
          <label>Material 2</label>
          <select name="mat2Id" class="adr-select" required>
            <option value="">-- Select --</option>
            {{{ each materials }}}
            <option value="{materials.item_id}">{materials.item_name}</option>
            {{{ end }}}
          </select>
        </div>
        <button type="submit" class="btn btn-warning adr-btn"><i class="fa fa-fire"></i> Forge!</button>
      </form>
      {{{ else }}}
      <p class="adr-muted">No materials in your inventory. Try mining first.</p>
      {{{ end }}}
    </div>

    <div class="adr-panel">
      <h3><i class="fa fa-wand-sparkles"></i> Enchantment (Skill Lv {character.character_skill_enchantment})</h3>
      <p>Enchant a weapon to boost its power.</p>
      {{{ if enchantable.length }}}
      <form method="post" action="/adr/forge/enchant" class="adr-form">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="adr-form-row">
          <label>Select Weapon</label>
          <select name="weaponId" class="adr-select" required>
            <option value="">-- Select --</option>
            {{{ each enchantable }}}
            <option value="{enchantable.item_id}">{enchantable.item_name} (Pwr {enchantable.item_power})</option>
            {{{ end }}}
          </select>
        </div>
        <button type="submit" class="btn btn-info adr-btn"><i class="fa fa-magic"></i> Enchant!</button>
      </form>
      {{{ else }}}
      <p class="adr-muted">No enchantable weapons in your inventory.</p>
      {{{ end }}}
    </div>
  </div>
</div>
