<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-dragon"></i> Battle Arena</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}

  <div class="adr-panel adr-panel-inline">
    <span><i class="fa fa-heart" style="color:var(--adr-hp)"></i> HP <strong>{character.character_hp}</strong>/{character.character_hp_max}</span>
    <span><i class="fa fa-star" style="color:var(--adr-mp)"></i> MP <strong>{character.character_mp}</strong>/{character.character_mp_max}</span>
    <span><i class="fa fa-shield" style="color:var(--adr-primary)"></i> DEF <strong>{character.totalDefense}</strong></span>
    <span><i class="fa fa-sword" style="color:var(--adr-accent)"></i> ATK <strong>{character.totalAttack}</strong></span>
    <span class="adr-gold"><i class="fa fa-coins"></i> <strong>{character.character_gold}</strong></span>
    <span style="margin-left:auto;color:var(--adr-muted);font-size:0.85rem">Battles left today: <strong style="color:var(--adr-text)">{character.character_battle_limit}</strong></span>
  </div>

  {{{ if activeBattle }}}
  <!-- ═══════════════════ ACTIVE BATTLE ═══════════════════ -->
  <div class="adr-panel adr-panel-warning">
    <h3><i class="fa fa-swords"></i> Battle In Progress — {activeBattle.monsterName}</h3>

    <div class="adr-battle-versus">
      <div class="adr-battle-side">
        <div class="adr-bar-row"><span>HP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{activeBattle.charHpPct}%"></div></div>
          <span>{activeBattle.battle_challenger_hp}</span>
        </div>
        <div class="adr-bar-row"><span>MP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{activeBattle.charMpPct}%"></div></div>
          <span>{activeBattle.battle_challenger_mp}</span>
        </div>
      </div>
      <div class="adr-battle-vs-icon"><i class="fa fa-swords"></i></div>
      <div class="adr-battle-side adr-battle-side-right">
        <div class="adr-bar-row"><span>HP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{activeBattle.monHpPct}%"></div></div>
          <span>{activeBattle.battle_opponent_hp}</span>
        </div>
        <div class="adr-bar-row"><span>MP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{activeBattle.monMpPct}%"></div></div>
          <span>{activeBattle.battle_opponent_mp}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="adr-panel adr-battle-action-panel">
    <h3><i class="fa fa-fist-raised"></i> Choose Your Action</h3>

    <form method="post" action="/adr/battle/action" class="adr-battle-action-form">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="hidden" name="battleId" value="{activeBattle.battle_id}" />

      <div class="adr-battle-action-grid">
        <label class="adr-action-option">
          <input type="radio" name="action" value="attack" checked />
          <div class="adr-action-card">
            <i class="fa fa-sword"></i>
            <strong>Attack</strong>
            <small>Physical strike</small>
          </div>
        </label>
        <label class="adr-action-option">
          <input type="radio" name="action" value="magic" />
          <div class="adr-action-card">
            <i class="fa fa-wand-sparkles"></i>
            <strong>Magic</strong>
            <small>Elemental spell</small>
          </div>
        </label>
        <label class="adr-action-option">
          <input type="radio" name="action" value="defend" />
          <div class="adr-action-card">
            <i class="fa fa-shield"></i>
            <strong>Defend</strong>
            <small>Take half damage</small>
          </div>
        </label>
        <label class="adr-action-option">
          <input type="radio" name="action" value="potion" />
          <div class="adr-action-card">
            <i class="fa fa-flask"></i>
            <strong>Potion</strong>
            <small>Drink &amp; fight</small>
          </div>
        </label>
      </div>

      <div class="adr-battle-item-rows">
        <div class="adr-battle-item-row" id="act-weapon-row">
          <label><i class="fa fa-sword"></i> Weapon</label>
          <select name="weaponId" class="adr-select">
            <option value="">Bare Fists (base ATK)</option>
            {{{ each weapons }}}
            <option value="{weapons.item_id}">{weapons.item_name} (+{weapons.item_power} ATK)</option>
            {{{ end }}}
          </select>
          {{{ if not weapons.length }}}<small class="adr-muted">No weapons in bag</small>{{{ end }}}
        </div>

        <div class="adr-battle-item-row" id="act-spell-row" style="display:none">
          <label><i class="fa fa-wand-sparkles"></i> Spell</label>
          <select name="spellId" class="adr-select">
            <option value="">— Pick a spell —</option>
            {{{ each spells }}}
            <option value="{spells.item_id}">{spells.item_name} (Pwr {spells.item_power}, Cost {spells.item_mp_use} MP)</option>
            {{{ end }}}
          </select>
          {{{ if not spells.length }}}<small class="adr-muted">No spells in bag</small>{{{ end }}}
        </div>

        <div class="adr-battle-item-row" id="act-potion-row" style="display:none">
          <label><i class="fa fa-flask"></i> Potion (used before first round)</label>
          <select name="potionId" class="adr-select">
            <option value="">— Pick a potion —</option>
            {{{ each potions }}}
            <option value="{potions.item_id}">{potions.item_name} (+{potions.item_power} {potions.effectLabel})</option>
            {{{ end }}}
          </select>
          {{{ if not potions.length }}}<small class="adr-muted">No potions in bag</small>{{{ end }}}
        </div>
      </div>

      <div class="adr-form-actions" style="margin-top:1rem">
        <button type="submit" class="btn btn-primary btn-lg adr-btn">
          <i class="fa fa-bolt"></i> Execute Action
        </button>
      </div>
    </form>

    <form method="post" action="/adr/battle/flee" style="margin-top:0.75rem">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="hidden" name="battleId" value="{activeBattle.battle_id}" />
      <button type="submit" class="btn btn-sm btn-danger adr-btn"
        onclick="return confirm('Flee the battle? You will lose some XP.')">
        <i class="fa fa-person-running"></i> Flee
      </button>
    </form>
  </div>

  {{{ else }}}
  <!-- ═══════════════════ CHOOSE MONSTER ═══════════════════ -->
  <h3 style="margin-bottom:0.75rem">Choose Your Foe</h3>
  <div class="adr-monster-grid">
    {{{ each monsters }}}
    <div class="adr-monster-card">
      <div class="adr-monster-name">{monsters.monster_name}</div>
      <div class="adr-monster-level">Level {monsters.monster_level}</div>
      <div class="adr-monster-stats">
        <span>~HP: {monsters.monster_hp}</span>
        <span>ATK: {monsters.monster_att}</span>
        <span>DEF: {monsters.monster_def}</span>
      </div>
      {{{ if monsters.monster_element_name }}}
      <div><span class="adr-elem-badge" style="background:{monsters.monster_element_color}">{monsters.monster_element_name}</span></div>
      {{{ end }}}
      <a href="/adr/battle/loadout?monsterId={monsters.monster_id}" class="btn btn-primary btn-sm adr-btn" style="margin-top:0.4rem">
        <i class="fa fa-shield-halved"></i> Loadout &amp; Fight
      </a>
    </div>
    {{{ end }}}
    {{{ if not monsters.length }}}
    <p class="adr-muted">No monsters available at your level yet.</p>
    {{{ end }}}
  </div>
  {{{ end }}}

  <div class="adr-battle-links">
    <a href="/adr/equipment" class="btn btn-outline adr-btn-outline"><i class="fa fa-shield-halved"></i> Equipment</a>
    <a href="/adr/battle/history" class="btn btn-outline adr-btn-outline"><i class="fa fa-scroll"></i> My History</a>
    <a href="/adr/battle/community" class="btn btn-outline adr-btn-outline"><i class="fa fa-list"></i> Community Log</a>
    <a href="/adr/pvp" class="btn btn-outline adr-btn-outline"><i class="fa fa-swords"></i> PvP</a>
  </div>
</div>
<script>
(function () {
  var radios   = document.querySelectorAll('input[name="action"]');
  var wRow     = document.getElementById('act-weapon-row');
  var sRow     = document.getElementById('act-spell-row');
  var pRow     = document.getElementById('act-potion-row');
  if (!radios.length) return;

  function sync() {
    var val = document.querySelector('input[name="action"]:checked');
    val = val ? val.value : 'attack';
    if (wRow) wRow.style.display = (val === 'attack' || val === 'defend') ? '' : 'none';
    if (sRow) sRow.style.display = (val === 'magic')  ? '' : 'none';
    if (pRow) pRow.style.display = (val === 'potion') ? '' : 'none';
  }

  radios.forEach(function (r) { r.addEventListener('change', sync); });
  sync();
})();
</script>
