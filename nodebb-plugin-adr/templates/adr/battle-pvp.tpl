<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-swords"></i> PvP Arena</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  {{{ if pendingChallenges.length }}}
  <div class="adr-panel adr-panel-warning">
    <h3>Pending Challenges</h3>
    {{{ each pendingChallenges }}}
    <div class="adr-challenge-row">
      <span><a href="/adr/character/{pendingChallenges.battle_challenger_id}">{pendingChallenges.challengerName}</a> challenges you!</span>
      <form method="post" action="/adr/pvp/accept" style="display:inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="battleId" value="{pendingChallenges.battle_id}" />
        <button type="submit" class="btn btn-sm btn-success adr-btn">Accept</button>
      </form>
      <form method="post" action="/adr/pvp/decline" style="display:inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="battleId" value="{pendingChallenges.battle_id}" />
        <button type="submit" class="btn btn-sm btn-danger adr-btn">Decline</button>
      </form>
    </div>
    {{{ end }}}
  </div>
  {{{ end }}}

  <div class="adr-panel">
    <h3>Challenge a Player</h3>
    <p>Enter the UID of the adventurer you wish to challenge.</p>
    <form method="post" action="/adr/pvp/challenge" class="adr-form adr-form-inline">
      <input type="hidden" name="_csrf" value="{config.csrf_token}" />
      <input type="number" name="targetUid" placeholder="Player UID" class="adr-input" required />
      <button type="submit" class="btn btn-primary adr-btn"><i class="fa fa-swords"></i> Challenge!</button>
    </form>
  </div>

  <div class="adr-battle-links">
    <a href="/adr/pvp/history" class="btn btn-outline adr-btn-outline"><i class="fa fa-scroll"></i> My PvP History</a>
    <a href="/adr/character-list" class="btn btn-outline adr-btn-outline"><i class="fa fa-list"></i> Find Opponents</a>
  </div>
</div>
