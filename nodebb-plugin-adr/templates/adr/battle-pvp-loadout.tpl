<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-shield-halved"></i> PvP Loadout — Review &amp; Accept</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}

  <div class="adr-panel">
    <h3><i class="fa fa-swords"></i> Matchup</h3>
    <div class="adr-loadout-vs">
      <div class="adr-loadout-char">
        <div style="font-weight:700;margin-bottom:0.5rem">{character.character_name} <span class="adr-muted" style="font-size:0.8rem">(You)</span></div>
        <div class="adr-bar-row"><span>HP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{character.hpPct}%"></div></div>
          <span>{character.character_hp}/{character.character_hp_max}</span>
        </div>
        <div class="adr-bar-row"><span>MP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{character.mpPct}%"></div></div>
          <span>{character.character_mp}/{character.character_mp_max}</span>
        </div>
        <div class="adr-stats-list" style="margin-top:0.5rem">
          <div class="adr-stat-pair"><span>ATK</span><strong>{character.totalAttack}</strong></div>
          <div class="adr-stat-pair"><span>DEF</span><strong>{character.totalDefense}</strong></div>
          <div class="adr-stat-pair"><span>Mag ATK</span><strong>{character.magicAttack}</strong></div>
          <div class="adr-stat-pair"><span>Mag RES</span><strong>{character.magicResist}</strong></div>
        </div>
      </div>
      <div class="adr-loadout-vs-label"><i class="fa fa-swords"></i></div>
      <div class="adr-loadout-monster">
        <div style="font-weight:700;margin-bottom:0.5rem">{challenger.character_name}</div>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>Level</span><strong>{challenger.character_level}</strong></div>
          <div class="adr-stat-pair"><span>ATK</span><strong>{challenger.totalAttack}</strong></div>
          <div class="adr-stat-pair"><span>DEF</span><strong>{challenger.totalDefense}</strong></div>
          <div class="adr-stat-pair"><span>Element</span><strong>{challenger.elementName}</strong></div>
        </div>
      </div>
    </div>
  </div>

  <div class="adr-loadout-body">
    <div class="adr-panel adr-loadout-equip">
      <h3><i class="fa fa-shield-halved"></i> Your Gear</h3>
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
        <a href="/adr/equipment" class="btn btn-sm btn-outline adr-btn-outline">
          <i class="fa fa-arrows-rotate"></i> Change Equipment
        </a>
      </div>
    </div>

    <div class="adr-panel adr-loadout-action">
      <h3><i class="fa fa-circle-info"></i> How PvP Works</h3>
      <ul style="color:var(--adr-muted);font-size:0.88rem;padding-left:1.25rem;line-height:1.8">
        <li>The battle auto-resolves using both characters' current stats.</li>
        <li>Both fighters may randomly take a <strong>defensive stance</strong>, reducing damage by 50%.</li>
        <li>Element advantages apply — fire beats nature, water beats fire, etc.</li>
        <li>Critical hits are possible — 10% chance for 2× damage.</li>
        <li>Winner earns XP and gold. Loser loses nothing except the bragging rights.</li>
      </ul>

      <div class="adr-form-actions" style="margin-top:1.25rem">
        <form method="post" action="/adr/pvp/accept">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="battleId" value="{battle.battle_id}" />
          <button type="submit" class="btn btn-success btn-lg adr-btn">
            <i class="fa fa-swords"></i> Accept &amp; Fight!
          </button>
        </form>
        <form method="post" action="/adr/pvp/decline" style="margin-top:0.5rem">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="battleId" value="{battle.battle_id}" />
          <button type="submit" class="btn btn-danger adr-btn"
            onclick="return confirm('Decline this challenge?')">
            <i class="fa fa-xmark"></i> Decline
          </button>
        </form>
        <a href="/adr/pvp" class="btn btn-default adr-btn">Back</a>
      </div>
    </div>
  </div>
</div>
