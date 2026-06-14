<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-hammer"></i> Skills</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-skills-header">
    <div class="adr-panel-inline">
      <span>Skill Actions Today: <strong>{character.character_skill_limit}</strong></span>
      <span>Training Cost: <strong>{config.training_skill_cost} XP</strong></span>
    </div>
  </div>

  <div class="adr-skill-grid">
    {{{ each skills }}}
    <div class="adr-skill-card">
      <div class="adr-skill-header">
        <h3>{skills.skill_name}</h3>
        <span class="adr-skill-level">Lv {skills.current_level}</span>
      </div>
      <p class="adr-skill-desc">{skills.skill_desc}</p>
      <div class="adr-skill-stats">
        <div class="adr-stat-pair"><span>Type</span><strong>{skills.typeLabel}</strong></div>
        <div class="adr-stat-pair"><span>Effect</span><strong>{skills.effectLabel}</strong></div>
        <div class="adr-stat-pair"><span>Cost to train</span><strong>{skills.trainCost} XP</strong></div>
      </div>
      {{{ if skills.can_train }}}
      <form method="post" action="/adr/skills/train">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="hidden" name="skillId" value="{skills.skill_id}" />
        <button type="submit" class="btn btn-primary btn-sm adr-btn">
          <i class="fa fa-arrow-up"></i> Train (Lv {skills.current_level} → {skills.next_level})
        </button>
      </form>
      {{{ else }}}
      <p class="adr-muted">{skills.blockReason}</p>
      {{{ end }}}
    </div>
    {{{ end }}}
  </div>
</div>
