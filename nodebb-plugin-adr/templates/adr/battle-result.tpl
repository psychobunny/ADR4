<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-dragon"></i> Battle Result</h1>
  <div class="adr-result-card adr-result-{resultLabel}">
    <div class="adr-result-banner">
      <h2>{resultLabel}!</h2>
      <p>You fought <strong>{monster.monster_name}</strong></p>
    </div>
    <div class="adr-result-body">
      <div class="adr-result-stats">
        <div class="adr-stat-pair"><span>Rounds</span><strong>{battle.battle_round}</strong></div>
        <div class="adr-stat-pair"><span>Your HP left</span><strong>{battle.battle_challenger_hp}</strong></div>
        <div class="adr-stat-pair"><span>Monster HP left</span><strong>{battle.battle_opponent_hp}</strong></div>
        <div class="adr-stat-pair"><span>Damage dealt</span><strong>{battle.battle_challenger_dmg}</strong></div>
        <div class="adr-stat-pair"><span>Damage taken</span><strong>{battle.battle_opponent_dmg}</strong></div>
      </div>
      <div class="adr-battle-log">
        <h4>Battle Log</h4>
        {{{ each log }}}
        <div class="adr-log-line">{log.value}</div>
        {{{ end }}}
      </div>
    </div>
  </div>
  <div class="adr-result-actions">
    <a href="/adr/battle" class="btn btn-primary adr-btn"><i class="fa fa-rotate-right"></i> Fight Again</a>
    <a href="/adr/character" class="btn btn-outline adr-btn-outline"><i class="fa fa-user"></i> Character</a>
    <a href="/adr/temple" class="btn btn-outline adr-btn-outline"><i class="fa fa-church"></i> Temple</a>
  </div>
</div>
