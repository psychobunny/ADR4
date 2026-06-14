<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-shield-halved"></i> Battle Loadout</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}

  <div class="adr-panel">
    <h3><i class="fa fa-dragon"></i> Challenger</h3>
    <div class="adr-loadout-vs">
      <div class="adr-loadout-char">
        <div class="adr-bar-row"><span>HP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{character.hpPct}%"></div></div>
          <span>{character.character_hp}/{character.character_hp_max}</span>
        </div>
        <div class="adr-bar-row"><span>MP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{character.mpPct}%"></div></div>
          <span>{character.character_mp}/{character.character_mp_max}</span>
        </div>
        <div class="adr-stats-list" style="margin-top:0.75rem">
          <div class="adr-stat-pair"><span>Attack</span><strong>{character.totalAttack}</strong></div>
          <div class="adr-stat-pair"><span>Defense</span><strong>{character.totalDefense}</strong></div>
          <div class="adr-stat-pair"><span>Magic ATK</span><strong>{character.magicAttack}</strong></div>
          <div class="adr-stat-pair"><span>Magic RES</span><strong>{character.magicResist}</strong></div>
        </div>
      </div>
      <div class="adr-loadout-vs-label"><i class="fa fa-swords"></i></div>
      <div class="adr-loadout-monster">
        <div class="adr-monster-name" style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">{monster.monster_name}</div>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>Level</span><strong>{monster.monster_level}</strong></div>
          <div class="adr-stat-pair"><span>~HP</span><strong>{monster.monster_hp}</strong></div>
          <div class="adr-stat-pair"><span>Attack</span><strong>{monster.monster_att}</strong></div>
          <div class="adr-stat-pair"><span>Defense</span><strong>{monster.monster_def}</strong></div>
        </div>
      </div>
    </div>
  </div>

  <div class="adr-loadout-body">
    <div class="adr-panel adr-loadout-equip">
      <h3><i class="fa fa-shield-halved"></i> Equipped Gear</h3>
      <div class="adr-slot-grid">
        {{{ each slots }}}
        <div class="adr-slot {{{ if slots.item }}}adr-slot-filled adr-quality-{slots.item.item_quality}{{{ end }}}">
          <div class="adr-slot-label">{slots.label}</div>
          {{{ if slots.item }}}
          <div class="adr-slot-item">
            <span class="adr-item-name">{slots.item.item_name}</span>
            <span class="adr-item-stats">Pwr: {slots.item.item_power}</span>
          </div>
          {{{ else }}}
          <div class="adr-slot-empty"><i class="fa fa-minus"></i> Empty</div>
          {{{ end }}}
        </div>
        {{{ end }}}
      </div>
      <div style="margin-top:0.75rem">
        <a href="/adr/equipment?next=/adr/battle/loadout?monsterId={monster.monster_id}" class="btn btn-sm btn-outline adr-btn-outline">
          <i class="fa fa-arrows-rotate"></i> Change Equipment
        </a>
      </div>
    </div>

    <div class="adr-panel adr-loadout-action">
      <h3><i class="fa fa-fist-raised"></i> Choose Your Strategy</h3>
      <p style="color:var(--adr-muted);font-size:0.88rem">Select your primary action and the items you'll use in battle. The simulation will run using your chosen strategy.</p>

      <form method="post" action="/adr/battle/start" class="adr-form">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="monsterId" value="{monster.monster_id}" />

        <div class="adr-form-row">
          <label>Primary Action</label>
          <div class="adr-battle-action-grid">
            <label class="adr-action-option">
              <input type="radio" name="action" value="attack" checked />
              <div class="adr-action-card">
                <i class="fa fa-sword"></i>
                <strong>Attack</strong>
                <small>Physical strike with fist or weapon</small>
              </div>
            </label>
            <label class="adr-action-option">
              <input type="radio" name="action" value="magic" />
              <div class="adr-action-card">
                <i class="fa fa-wand-sparkles"></i>
                <strong>Magic</strong>
                <small>Cast a spell using MP</small>
              </div>
            </label>
            <label class="adr-action-option">
              <input type="radio" name="action" value="defend" />
              <div class="adr-action-card">
                <i class="fa fa-shield"></i>
                <strong>Defend</strong>
                <small>Reduce damage taken, counter when able</small>
              </div>
            </label>
            <label class="adr-action-option">
              <input type="radio" name="action" value="potion" />
              <div class="adr-action-card">
                <i class="fa fa-flask"></i>
                <strong>Potion</strong>
                <small>Use a potion before fighting</small>
              </div>
            </label>
          </div>
        </div>

        <div class="adr-form-row" id="loadout-weapon-row">
          <label>Weapon to Use</label>
          <select name="weaponId" class="adr-select">
            <option value="">Bare Fists (no bonus)</option>
            {{{ each weapons }}}
            <option value="{weapons.item_id}">{weapons.item_name} (+{weapons.item_power} ATK)</option>
            {{{ end }}}
          </select>
          {{{ if not weapons.length }}}<small class="adr-muted">No weapons in your bag. Visit the Shops or Forge.</small>{{{ end }}}
        </div>

        <div class="adr-form-row" id="loadout-spell-row" style="display:none">
          <label>Spell to Cast</label>
          <select name="spellId" class="adr-select">
            <option value="">— Select spell —</option>
            {{{ each spells }}}
            <option value="{spells.item_id}">{spells.item_name} (Pwr {spells.item_power}, Cost {spells.item_mp_use} MP)</option>
            {{{ end }}}
          </select>
          {{{ if not spells.length }}}<small class="adr-muted">No spells in your bag. Visit the Shops.</small>{{{ end }}}
        </div>

        <div class="adr-form-row" id="loadout-potion-row" style="display:none">
          <label>Potion to Use Before Battle</label>
          <select name="potionId" class="adr-select">
            <option value="">— Select potion —</option>
            {{{ each potions }}}
            <option value="{potions.item_id}">{potions.item_name} (+{potions.item_power} {potions.effectLabel})</option>
            {{{ end }}}
          </select>
          {{{ if not potions.length }}}<small class="adr-muted">No potions in your bag. Visit the Shops or Temple.</small>{{{ end }}}
        </div>

        <div class="adr-form-actions" style="margin-top:1rem">
          <button type="submit" class="btn btn-danger btn-lg adr-btn">
            <i class="fa fa-dragon"></i> Begin Battle!
          </button>
          <a href="/adr/battle" class="btn btn-default adr-btn">Back</a>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
(function() {
  var radios  = document.querySelectorAll('input[name="action"]');
  var wRow    = document.getElementById('loadout-weapon-row');
  var sRow    = document.getElementById('loadout-spell-row');
  var pRow    = document.getElementById('loadout-potion-row');

  function updateRows() {
    var val = document.querySelector('input[name="action"]:checked');
    val = val ? val.value : 'attack';
    wRow.style.display = (val === 'attack' || val === 'defend') ? '' : 'none';
    sRow.style.display = (val === 'magic')  ? '' : 'none';
    pRow.style.display = (val === 'potion') ? '' : 'none';
  }

  radios.forEach(function(r) { r.addEventListener('change', updateRows); });
  updateRows();
})();
</script>
