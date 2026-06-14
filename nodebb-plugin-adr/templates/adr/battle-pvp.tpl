<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-swords"></i> PvP Arena</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <!-- ── Status bar ── -->
  <div class="adr-panel adr-panel-inline">
    <span><i class="fa fa-heart" style="color:var(--adr-hp)"></i> HP <strong>{character.character_hp}</strong>/{character.character_hp_max}</span>
    <span><i class="fa fa-star" style="color:var(--adr-mp)"></i> MP <strong>{character.character_mp}</strong>/{character.character_mp_max}</span>
    <span><i class="fa fa-sword" style="color:var(--adr-accent)"></i> ATK <strong>{character.totalAttack}</strong></span>
    <span><i class="fa fa-shield" style="color:var(--adr-primary)"></i> DEF <strong>{character.totalDefense}</strong></span>
  </div>

  <!-- ── Pending challenges ── -->
  {{{ if pendingChallenges.length }}}
  <div class="adr-panel adr-panel-warning">
    <h3><i class="fa fa-exclamation-triangle"></i> Pending Challenges</h3>
    {{{ each pendingChallenges }}}
    <div class="adr-challenge-row">
      <div class="adr-challenge-info">
        <a href="/adr/character/{pendingChallenges.battle_challenger_id}" class="adr-challenge-name">
          {pendingChallenges.challengerName}
        </a>
        <span class="adr-muted" style="font-size:0.8rem">Lv.{pendingChallenges.challengerLevel} — challenged you {pendingChallenges.dateStr}</span>
      </div>
      <div class="adr-challenge-actions">
        <a href="/adr/pvp/loadout/{pendingChallenges.battle_id}" class="btn btn-sm btn-outline adr-btn-outline">
          <i class="fa fa-shield-halved"></i> Review &amp; Accept
        </a>
        <form method="post" action="/adr/pvp/decline" style="display:inline">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="battleId" value="{pendingChallenges.battle_id}" />
          <button type="submit" class="btn btn-sm btn-danger adr-btn"
            onclick="return confirm('Decline this challenge?')">
            <i class="fa fa-xmark"></i> Decline
          </button>
        </form>
      </div>
    </div>
    {{{ end }}}
  </div>
  {{{ end }}}

  <!-- ── Challenge a player ── -->
  <div class="adr-panel">
    <h3><i class="fa fa-crosshairs"></i> Challenge a Player</h3>
    <p style="color:var(--adr-muted);font-size:0.88rem">
      Enter the UID of your target. They must have PvP enabled in their preferences.
      PvP battles auto-resolve — both sides fight with their current stats. Defenders may occasionally use a defensive stance.
    </p>
    <form method="post" action="/adr/pvp/challenge" class="adr-form adr-form-inline">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="number" name="targetUid" placeholder="Player UID" class="adr-input" style="max-width:160px" required />
      <button type="submit" class="btn btn-primary adr-btn"><i class="fa fa-swords"></i> Challenge!</button>
    </form>
  </div>

  <div class="adr-battle-links">
    <a href="/adr/equipment" class="btn btn-outline adr-btn-outline"><i class="fa fa-shield-halved"></i> Equipment</a>
    <a href="/adr/pvp/history" class="btn btn-outline adr-btn-outline"><i class="fa fa-scroll"></i> My PvP History</a>
    <a href="/adr/character-list" class="btn btn-outline adr-btn-outline"><i class="fa fa-list"></i> Find Opponents</a>
    <a href="/adr/battle" class="btn btn-outline adr-btn-outline"><i class="fa fa-dragon"></i> PvE Battle</a>
  </div>
</div>
