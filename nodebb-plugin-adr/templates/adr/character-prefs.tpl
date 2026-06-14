<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-pen-to-square"></i> Character Preferences</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}
  <form method="post" action="/adr/character-edit" class="adr-form">
    <input type="hidden" name="_csrf" value="{config.csrf_token}" />
    <div class="adr-form-section">
      <h3>Profile</h3>
      <div class="adr-form-row">
        <label>Character Name</label>
        <input type="text" name="character_name" value="{character.character_name}" maxlength="50" class="adr-input" required />
      </div>
      <div class="adr-form-row">
        <label>Description</label>
        <textarea name="character_desc" maxlength="500" class="adr-textarea">{character.character_desc}</textarea>
      </div>
      <div class="adr-form-row">
        <label>Alignment</label>
        <select name="character_alignment" class="adr-select">
          {{{ each alignments }}}
          <option value="{alignments.alignment_id}">{alignments.alignment_name}</option>
          {{{ end }}}
        </select>
      </div>
    </div>
    <div class="adr-form-section">
      <h3>Notifications</h3>
      <label class="adr-toggle"><input type="checkbox" name="prefs_pvp_notif_pm" value="1" {{{ if character.prefs_pvp_notif_pm }}}checked{{{ end }}} /> Receive PM when challenged to PvP</label>
      <label class="adr-toggle"><input type="checkbox" name="prefs_pvp_allow" value="1" {{{ if character.prefs_pvp_allow }}}checked{{{ end }}} /> Allow PvP challenges</label>
      <label class="adr-toggle"><input type="checkbox" name="prefs_tax_pm_notify" value="1" {{{ if character.prefs_tax_pm_notify }}}checked{{{ end }}} /> Notify when shop tax is due</label>
      <label class="adr-toggle"><input type="checkbox" name="character_pref_give_pm" value="1" {{{ if character.character_pref_give_pm }}}checked{{{ end }}} /> Notify when items are given to me</label>
      <label class="adr-toggle"><input type="checkbox" name="character_pref_seller_pm" value="1" {{{ if character.character_pref_seller_pm }}}checked{{{ end }}} /> Notify when my shop items are sold</label>
    </div>
    <div class="adr-form-actions">
      <button type="submit" class="btn btn-primary adr-btn">Save Preferences</button>
      <a href="/adr/character" class="btn btn-outline adr-btn-outline">Cancel</a>
    </div>
  </form>
</div>
