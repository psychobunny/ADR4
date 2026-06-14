<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="adr-wrap">
  <div class="adr-hero">
    <h1 class="adr-hero-title">Welcome to the Realm</h1>
    <p class="adr-hero-sub">You have {characterCount} adventurers across the land.</p>
  </div>

  {{{ if character }}}
  <div class="adr-char-summary card">
    <div class="adr-char-summary-left">
      <h2><a href="/adr/character/{uid}">{character.character_name}</a></h2>
      <p>Level {character.character_level} <strong>{character.className}</strong> &mdash; {character.raceName}</p>
      <p><span class="adr-elem-badge" style="background:{character.elementColour}">{character.elementName}</span> &middot; {character.alignmentName}</p>
    </div>
    <div class="adr-char-summary-bars">
      <div class="adr-bar-row">
        <span>HP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-hp-bar" style="width:{character.hpPct}%"></div></div>
        <span>{character.character_hp}/{character.character_hp_max}</span>
      </div>
      <div class="adr-bar-row">
        <span>MP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-mp-bar" style="width:{character.mpPct}%"></div></div>
        <span>{character.character_mp}/{character.character_mp_max}</span>
      </div>
      <div class="adr-bar-row">
        <span>XP</span>
        <div class="adr-bar"><div class="adr-bar-fill adr-xp-bar" style="width:{character.xpPct}%"></div></div>
        <span>{character.character_xp}/{character.xpForNext}</span>
      </div>
    </div>
    <div class="adr-char-summary-right">
      <p class="adr-gold"><i class="fa fa-coins"></i> {character.character_gold} gold</p>
      <p>Battles left: {character.character_battle_limit}</p>
    </div>
  </div>
  {{{ end }}}

  <div class="adr-town-grid">
    <a class="adr-town-card" href="/adr/character">
      <i class="fa fa-user adr-town-icon"></i>
      <span class="adr-town-card-title">Character Sheet</span>
      <span class="adr-town-card-desc">View and manage your character</span>
    </a>
    <a class="adr-town-card" href="/adr/battle">
      <i class="fa fa-dragon adr-town-icon"></i>
      <span class="adr-town-card-title">Battle Arena</span>
      <span class="adr-town-card-desc">Fight monsters for XP and gold</span>
    </a>
    <a class="adr-town-card" href="/adr/pvp">
      <i class="fa fa-swords adr-town-icon"></i>
      <span class="adr-town-card-title">PvP Arena</span>
      <span class="adr-town-card-desc">Challenge other players</span>
    </a>
    <a class="adr-town-card" href="/adr/inventory">
      <i class="fa fa-backpack adr-town-icon"></i>
      <span class="adr-town-card-title">Inventory</span>
      <span class="adr-town-card-desc">Manage your items</span>
    </a>
    <a class="adr-town-card" href="/adr/equipment">
      <i class="fa fa-shield-halved adr-town-icon"></i>
      <span class="adr-town-card-title">Equipment</span>
      <span class="adr-town-card-desc">Equip weapons and armour</span>
    </a>
    <a class="adr-town-card" href="/adr/skills">
      <i class="fa fa-hammer adr-town-icon"></i>
      <span class="adr-town-card-title">Skills</span>
      <span class="adr-town-card-desc">Train your abilities</span>
    </a>
    <a class="adr-town-card" href="/adr/shops">
      <i class="fa fa-shop adr-town-icon"></i>
      <span class="adr-town-card-title">Market</span>
      <span class="adr-town-card-desc">Buy, sell, and trade items</span>
    </a>
    <a class="adr-town-card" href="/adr/forge">
      <i class="fa fa-fire adr-town-icon"></i>
      <span class="adr-town-card-title">Forge</span>
      <span class="adr-town-card-desc">Mine ore and craft weapons</span>
    </a>
    <a class="adr-town-card" href="/adr/temple">
      <i class="fa fa-place-of-worship adr-town-icon"></i>
      <span class="adr-town-card-title">Temple</span>
      <span class="adr-town-card-desc">Heal wounds and resurrect</span>
    </a>
    <a class="adr-town-card" href="/adr/vault">
      <i class="fa fa-vault adr-town-icon"></i>
      <span class="adr-town-card-title">Vault</span>
      <span class="adr-town-card-desc">Bank gold and trade stocks</span>
    </a>
    <a class="adr-town-card" href="/adr/courthouse">
      <i class="fa fa-scale-balanced adr-town-icon"></i>
      <span class="adr-town-card-title">Courthouse</span>
      <span class="adr-town-card-desc">Vote on jailed adventurers</span>
    </a>
    <a class="adr-town-card" href="/adr/character-list">
      <i class="fa fa-list adr-town-icon"></i>
      <span class="adr-town-card-title">Adventurers</span>
      <span class="adr-town-card-desc">Browse all characters</span>
    </a>
    <a class="adr-town-card" href="/adr/battle/community">
      <i class="fa fa-scroll adr-town-icon"></i>
      <span class="adr-town-card-title">Battle Log</span>
      <span class="adr-town-card-desc">Recent community battles</span>
    </a>
    <a class="adr-town-card" href="/adr/faq">
      <i class="fa fa-circle-question adr-town-icon"></i>
      <span class="adr-town-card-title">FAQ</span>
      <span class="adr-town-card-desc">How to play</span>
    </a>
  </div>
</div>
