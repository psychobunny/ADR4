<!-- IMPORT admin/header.tpl -->

<div class="adr-admin">
  <div class="adr-admin-hero">
    <h1><i class="fa fa-dragon"></i> Anime Dungeon Raids RPG</h1>
    <p>Manage all aspects of the ADR RPG plugin from this panel.</p>
  </div>

  <div class="adr-admin-stats row">
    <div class="col-xs-6 col-sm-3">
      <div class="adr-admin-stat-card">
        <div class="adr-admin-stat-num">{charCount}</div>
        <div class="adr-admin-stat-label">Characters</div>
      </div>
    </div>
    <div class="col-xs-6 col-sm-3">
      <div class="adr-admin-stat-card adr-stat-rpg {{{ if config.disable_rpg }}}adr-stat-off{{{ else }}}adr-stat-on{{{ end }}}">
        <div class="adr-admin-stat-num">{{{ if config.disable_rpg }}}Off{{{ else }}}On{{{ end }}}</div>
        <div class="adr-admin-stat-label">RPG Status</div>
      </div>
    </div>
  </div>

  <div class="adr-admin-nav">
    <h2>Admin Pages</h2>
    <div class="adr-admin-links">
      <a href="/admin/plugins/adr/settings" class="adr-admin-link-card">
        <i class="fa fa-sliders"></i><span>Settings</span>
      </a>
      <a href="/admin/plugins/adr/characters" class="adr-admin-link-card">
        <i class="fa fa-users"></i><span>Characters</span>
      </a>
      <a href="/admin/plugins/adr/monsters" class="adr-admin-link-card">
        <i class="fa fa-dragon"></i><span>Monsters</span>
      </a>
      <a href="/admin/plugins/adr/items" class="adr-admin-link-card">
        <i class="fa fa-shield-halved"></i><span>Items</span>
      </a>
      <a href="/admin/plugins/adr/races" class="adr-admin-link-card">
        <i class="fa fa-person"></i><span>Races</span>
      </a>
      <a href="/admin/plugins/adr/classes" class="adr-admin-link-card">
        <i class="fa fa-hat-wizard"></i><span>Classes</span>
      </a>
      <a href="/admin/plugins/adr/elements" class="adr-admin-link-card">
        <i class="fa fa-fire"></i><span>Elements</span>
      </a>
      <a href="/admin/plugins/adr/alignments" class="adr-admin-link-card">
        <i class="fa fa-yin-yang"></i><span>Alignments</span>
      </a>
      <a href="/admin/plugins/adr/skills" class="adr-admin-link-card">
        <i class="fa fa-hammer"></i><span>Skills</span>
      </a>
      <a href="/admin/plugins/adr/stores" class="adr-admin-link-card">
        <i class="fa fa-store"></i><span>Stores</span>
      </a>
      <a href="/admin/plugins/adr/courthouse" class="adr-admin-link-card">
        <i class="fa fa-scale-balanced"></i><span>Courthouse</span>
      </a>
      <a href="/admin/plugins/adr/vault" class="adr-admin-link-card">
        <i class="fa fa-chart-line"></i><span>Vault / Stocks</span>
      </a>
    </div>
  </div>
</div>

<!-- IMPORT admin/footer.tpl -->
