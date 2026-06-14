<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-place-of-worship"></i> Temple</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-temple-layout">
    <div class="adr-panel adr-temple-status">
      <h3>Your Status</h3>
      <div class="adr-bar-row">
        <span>HP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{character.hpPct}%"></div></div>
        <span>{character.character_hp} / {character.character_hp_max}</span>
      </div>
      <div class="adr-bar-row">
        <span>MP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{character.mpPct}%"></div></div>
        <span>{character.character_mp} / {character.character_mp_max}</span>
      </div>
      <p class="adr-gold">Gold: <strong>{character.character_gold}</strong></p>
    </div>

    <div class="adr-panel">
      <h3><i class="fa fa-heart"></i> Healing</h3>
      <p>Fully restore your HP and MP.</p>
      <p>Cost: <strong class="adr-gold">{healCost} gold</strong></p>
      {{{ if character.character_hp }}}
      <form method="post" action="/adr/temple/heal">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <button type="submit" class="btn btn-primary adr-btn"><i class="fa fa-heart-pulse"></i> Heal ({healCost} gold)</button>
      </form>
      {{{ end }}}
    </div>

    <div class="adr-panel">
      <h3><i class="fa fa-cross"></i> Resurrection</h3>
      <p>Bring a fallen adventurer back from the dead.</p>
      <p>Cost: <strong class="adr-gold">{resurrCost} gold</strong></p>
      <form method="post" action="/adr/temple/resurrect">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <button type="submit" class="btn btn-warning adr-btn"><i class="fa fa-bolt"></i> Resurrect ({resurrCost} gold)</button>
      </form>
    </div>
  </div>
</div>
