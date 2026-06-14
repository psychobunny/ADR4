<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-dragon"></i> Battle Arena</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}

  <div class="adr-battle-header">
    <div class="adr-panel">
      <h3>Your Status</h3>
      <div class="adr-bar-row"><span>HP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{character.hpPct}%"></div></div>
        <span>{character.character_hp}/{character.character_hp_max}</span>
      </div>
      <div class="adr-bar-row"><span>MP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{character.mpPct}%"></div></div>
        <span>{character.character_mp}/{character.character_mp_max}</span>
      </div>
      <p>Battles remaining today: <strong>{character.character_battle_limit}</strong></p>
    </div>
  </div>

  {{{ if activeBattle }}}
  <div class="adr-panel adr-panel-warning">
    <h3><i class="fa fa-exclamation-triangle"></i> Battle in Progress!</h3>
    <p>You have an unresolved battle. Finish it before starting another.</p>
    <form method="post" action="/adr/battle/action">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="hidden" name="battleId" value="{activeBattle.battle_id}" />
      <button type="submit" name="useMagic" value="0" class="btn btn-primary adr-btn"><i class="fa fa-sword"></i> Attack</button>
      <button type="submit" name="useMagic" value="1" class="btn btn-info adr-btn"><i class="fa fa-wand-sparkles"></i> Use Magic</button>
    </form>
    <form method="post" action="/adr/battle/flee" style="margin-top:0.5rem">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="hidden" name="battleId" value="{activeBattle.battle_id}" />
      <button type="submit" class="btn btn-danger adr-btn"><i class="fa fa-person-running"></i> Flee</button>
    </form>
  </div>
  {{{ else }}}
  <h3>Choose Your Foe</h3>
  <div class="adr-monster-grid">
    {{{ each monsters }}}
    <div class="adr-monster-card">
      <div class="adr-monster-name">{monsters.monster_name}</div>
      <div class="adr-monster-level">Level {monsters.monster_level}</div>
      <div class="adr-monster-stats">
        <span>HP: ~{monsters.monster_hp}</span>
        <span>ATT: {monsters.monster_att}</span>
        <span>DEF: {monsters.monster_def}</span>
      </div>
      <form method="post" action="/adr/battle/start">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="monsterId" value="{monsters.monster_id}" />
        <button type="submit" class="btn btn-primary btn-sm adr-btn">
          <i class="fa fa-dragon"></i> Fight!
        </button>
      </form>
    </div>
    {{{ end }}}
  </div>
  {{{ end }}}

  <div class="adr-battle-links">
    <a href="/adr/battle/history" class="btn btn-outline adr-btn-outline"><i class="fa fa-scroll"></i> My Battle History</a>
    <a href="/adr/battle/community" class="btn btn-outline adr-btn-outline"><i class="fa fa-list"></i> Community Log</a>
  </div>
</div>
