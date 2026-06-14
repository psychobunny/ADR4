<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="adr-wrap">
  <div class="adr-char-sheet">
    <div class="adr-char-header">
      <div class="adr-char-avatar">
        {{{ if picture }}}
        <img src="{picture}" alt="{username}" class="adr-avatar-img" />
        {{{ end }}}
      </div>
      <div class="adr-char-identity">
        <h1>{character.character_name}</h1>
        <p class="adr-char-subtitle">
          Level {character.character_level}
          <span class="adr-elem-badge" style="background:{character.elementColour}">{character.elementName}</span>
          {character.className} &mdash; {character.raceName} &mdash; {character.alignmentName}
        </p>
        <p class="adr-char-user">Played by <a href="/user/{userslug}">{username}</a></p>
        {{{ if character.character_desc }}}
        <blockquote class="adr-char-desc">{character.character_desc}</blockquote>
        {{{ end }}}
      </div>
      {{{ if isOwner }}}
      <div class="adr-char-actions">
        <a href="/adr/character-edit" class="btn btn-sm btn-outline adr-btn-outline">
          <i class="fa fa-pen"></i> Edit
        </a>
      </div>
      {{{ end }}}
    </div>

    <div class="adr-char-body">
      <div class="adr-panel adr-panel-vitals">
        <h3><i class="fa fa-heart"></i> Vitals</h3>
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
        <div class="adr-bar-row">
          <span>XP</span>
          <div class="adr-bar"><div class="adr-bar-fill adr-xp-bar" style="width:{character.xpPct}%"></div></div>
          <span>{character.character_xp} / {character.xpForNext}</span>
        </div>
        <div class="adr-stat-pair">
          <span>AC</span><strong>{character.character_ac}</strong>
        </div>
        <div class="adr-stat-pair">
          <span>Gold</span><strong class="adr-gold">{character.character_gold}</strong>
        </div>
      </div>

      <div class="adr-panel adr-panel-stats">
        <h3><i class="fa fa-chart-bar"></i> Characteristics</h3>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>Might</span><strong>{character.character_might}</strong></div>
          <div class="adr-stat-pair"><span>Dexterity</span><strong>{character.character_dexterity}</strong></div>
          <div class="adr-stat-pair"><span>Constitution</span><strong>{character.character_constitution}</strong></div>
          <div class="adr-stat-pair"><span>Intelligence</span><strong>{character.character_intelligence}</strong></div>
          <div class="adr-stat-pair"><span>Wisdom</span><strong>{character.character_wisdom}</strong></div>
          <div class="adr-stat-pair"><span>Charisma</span><strong>{character.character_charisma}</strong></div>
          <div class="adr-stat-pair"><span>Magic Atk</span><strong>{character.character_magic_attack}</strong></div>
          <div class="adr-stat-pair"><span>Magic Res</span><strong>{character.character_magic_resistance}</strong></div>
        </div>
      </div>

      <div class="adr-panel adr-panel-skills">
        <h3><i class="fa fa-hammer"></i> Skills</h3>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>Mining</span><strong>{character.character_skill_mining}</strong></div>
          <div class="adr-stat-pair"><span>Stonecraft</span><strong>{character.character_skill_stone}</strong></div>
          <div class="adr-stat-pair"><span>Forge</span><strong>{character.character_skill_forge}</strong></div>
          <div class="adr-stat-pair"><span>Enchantment</span><strong>{character.character_skill_enchantment}</strong></div>
          <div class="adr-stat-pair"><span>Trading</span><strong>{character.character_skill_trading}</strong></div>
          <div class="adr-stat-pair"><span>Thievery</span><strong>{character.character_skill_thief}</strong></div>
        </div>
      </div>

      <div class="adr-panel adr-panel-record">
        <h3><i class="fa fa-trophy"></i> Battle Record</h3>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>PvE Wins</span><strong class="adr-win">{character.character_victories}</strong></div>
          <div class="adr-stat-pair"><span>PvE Losses</span><strong class="adr-loss">{character.character_defeats}</strong></div>
          <div class="adr-stat-pair"><span>PvE Flees</span><strong>{character.character_flees}</strong></div>
          <div class="adr-stat-pair"><span>PvP Wins</span><strong class="adr-win">{character.character_victories_pvp}</strong></div>
          <div class="adr-stat-pair"><span>PvP Losses</span><strong class="adr-loss">{character.character_defeats_pvp}</strong></div>
          <div class="adr-stat-pair"><span>PvP Flees</span><strong>{character.character_flees_pvp}</strong></div>
          <div class="adr-stat-pair"><span>Double KOs</span><strong>{character.character_double_ko}</strong></div>
        </div>
      </div>

      <div class="adr-panel adr-panel-equip">
        <h3><i class="fa fa-shield-halved"></i> Equipment</h3>
        {{{ if equippedItems.length }}}
        <ul class="adr-equip-list">
          {{{ each equippedItems }}}
          <li>
            <span class="adr-item-name">{equippedItems.item_name}</span>
            <span class="adr-item-detail">Pwr: {equippedItems.item_power} &middot; Dur: {equippedItems.item_duration}/{equippedItems.item_duration_max}</span>
          </li>
          {{{ end }}}
        </ul>
        {{{ else }}}
        <p class="adr-muted">No items equipped.</p>
        {{{ end }}}
      </div>

      <div class="adr-panel adr-panel-limits">
        <h3><i class="fa fa-clock"></i> Daily Limits</h3>
        <div class="adr-stats-list">
          <div class="adr-stat-pair"><span>Battles</span><strong>{character.character_battle_limit}</strong></div>
          <div class="adr-stat-pair"><span>Skills</span><strong>{character.character_skill_limit}</strong></div>
          <div class="adr-stat-pair"><span>Trading</span><strong>{character.character_trading_limit}</strong></div>
          <div class="adr-stat-pair"><span>Thievery</span><strong>{character.character_thief_limit}</strong></div>
          <div class="adr-stat-pair"><span>Born</span><strong>{character.age}</strong></div>
        </div>
      </div>
    </div>

    {{{ if isOwner }}}
    <div class="adr-char-footer">
      <a href="/adr/battle" class="btn btn-primary adr-btn"><i class="fa fa-dragon"></i> Go Battle</a>
      <a href="/adr/pvp" class="btn btn-secondary adr-btn"><i class="fa fa-swords"></i> PvP</a>
      <a href="/adr/inventory" class="btn btn-outline adr-btn-outline"><i class="fa fa-backpack"></i> Inventory</a>
      <a href="/adr/town" class="btn btn-outline adr-btn-outline"><i class="fa fa-home"></i> Town</a>
    </div>
    {{{ else }}}
    <div class="adr-char-footer">
      <a href="/adr/pvp?challenge={character.uid}" class="btn btn-primary adr-btn"><i class="fa fa-swords"></i> Challenge</a>
    </div>
    {{{ end }}}
  </div>
</div>
