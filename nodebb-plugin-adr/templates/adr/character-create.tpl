<!-- IMPORT partials/breadcrumbs.tpl -->

<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-user-plus"></i> Create Your Character</h1>

  {{{ if error }}}
  <div class="adr-alert adr-alert-danger"><i class="fa fa-circle-exclamation"></i> {error}</div>
  {{{ end }}}

  <form method="post" action="/adr/character/create" class="adr-form">
    <input type="hidden" name="_csrf" value="{config.csrf_token}" />

    <div class="adr-form-section">
      <h3>Identity</h3>
      <div class="adr-form-row">
        <label>Character Name *</label>
        <input type="text" name="character_name" maxlength="50" required placeholder="Enter a name..."
               value="{formData.character_name}" class="adr-input" />
      </div>
      <div class="adr-form-row">
        <label>Description</label>
        <textarea name="character_desc" maxlength="500" placeholder="Tell us about your character..."
                  class="adr-textarea">{formData.character_desc}</textarea>
      </div>
    </div>

    <div class="adr-form-section">
      <h3>Race</h3>
      <div class="adr-select-grid">
        {{{ each races }}}
        <label class="adr-select-card">
          <input type="radio" name="character_race" value="{races.race_id}" required />
          <span class="adr-select-card-inner">
            <strong>{races.race_name}</strong>
            <span>{races.race_desc}</span>
          </span>
        </label>
        {{{ end }}}
      </div>
    </div>

    <div class="adr-form-section">
      <h3>Class</h3>
      <div class="adr-select-grid">
        {{{ each classes }}}
        {{{ if classes.class_selectable }}}
        <label class="adr-select-card">
          <input type="radio" name="character_class" value="{classes.class_id}" required />
          <span class="adr-select-card-inner">
            <strong>{classes.class_name}</strong>
            <span>{classes.class_desc}</span>
            <small>HP: +{classes.class_base_hp} MP: +{classes.class_base_mp} AC: {classes.class_base_ac}</small>
          </span>
        </label>
        {{{ end }}}
        {{{ end }}}
      </div>
    </div>

    <div class="adr-form-section">
      <h3>Element</h3>
      <div class="adr-select-grid">
        {{{ each elements }}}
        <label class="adr-select-card">
          <input type="radio" name="character_element" value="{elements.element_id}" required />
          <span class="adr-select-card-inner">
            <strong style="color:{elements.element_colour}">{elements.element_name}</strong>
            <span>{elements.element_desc}</span>
          </span>
        </label>
        {{{ end }}}
      </div>
    </div>

    <div class="adr-form-section">
      <h3>Alignment</h3>
      <div class="adr-select-grid">
        {{{ each alignments }}}
        <label class="adr-select-card">
          <input type="radio" name="character_alignment" value="{alignments.alignment_id}" />
          <span class="adr-select-card-inner">
            <strong>{alignments.alignment_name}</strong>
            <span>{alignments.alignment_desc}</span>
          </span>
        </label>
        {{{ end }}}
      </div>
    </div>

    <div class="adr-form-section">
      <h3>Characteristics <small>(each must be between {minChar} and {maxChar})</small></h3>
      <div class="adr-stats-grid">
        <div class="adr-stat-input">
          <label>Might (STR)</label>
          <input type="number" name="character_might" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>Physical attack power</small>
        </div>
        <div class="adr-stat-input">
          <label>Dexterity (DEX)</label>
          <input type="number" name="character_dexterity" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>Speed &amp; accuracy</small>
        </div>
        <div class="adr-stat-input">
          <label>Constitution (CON)</label>
          <input type="number" name="character_constitution" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>HP &amp; endurance</small>
        </div>
        <div class="adr-stat-input">
          <label>Intelligence (INT)</label>
          <input type="number" name="character_intelligence" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>Magic power</small>
        </div>
        <div class="adr-stat-input">
          <label>Wisdom (WIS)</label>
          <input type="number" name="character_wisdom" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>MP &amp; magic resist</small>
        </div>
        <div class="adr-stat-input">
          <label>Charisma (CHA)</label>
          <input type="number" name="character_charisma" value="10" min="{minChar}" max="{maxChar}" class="adr-input" />
          <small>Social &amp; trading</small>
        </div>
      </div>
    </div>

    <div class="adr-form-actions">
      <button type="submit" class="btn btn-primary btn-lg adr-btn">
        <i class="fa fa-wand-magic-sparkles"></i> Create Character
      </button>
    </div>
  </form>
</div>
