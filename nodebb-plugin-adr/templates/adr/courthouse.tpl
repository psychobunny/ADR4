<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-scale-balanced"></i> Courthouse</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <p>Vote on jailed adventurers. Your votes determine early release or continued imprisonment.</p>

  {{{ if cases.length }}}
  <div class="adr-cases">
    {{{ each cases }}}
    <div class="adr-case-card">
      <div class="adr-case-header">
        <a href="/adr/character/{cases.uid}" class="adr-case-name">{cases.characterName}</a>
        <span class="adr-badge">In Jail</span>
      </div>
      <div class="adr-case-body">
        <div class="adr-stat-pair"><span>Reason</span><strong>{cases.jail_reason}</strong></div>
        <div class="adr-stat-pair"><span>Sentence</span><strong>{cases.releaseStr}</strong></div>
        <div class="adr-stat-pair"><span>Votes for release</span><strong class="adr-win">{cases.votes_release}</strong></div>
        <div class="adr-stat-pair"><span>Votes for prison</span><strong class="adr-loss">{cases.votes_prison}</strong></div>
        <div class="adr-stat-pair"><span>Voters needed</span><strong>{config.cell_user_judge_voters}</strong></div>
        <div class="adr-stat-pair"><span>Posts needed</span><strong>{config.cell_user_judge_posts}</strong></div>
      </div>
      {{{ if cases.hasVoted }}}
      <p class="adr-muted">You have already voted on this case.</p>
      {{{ else }}}
      <div class="adr-case-actions">
        <form method="post" action="/adr/courthouse/vote" style="display:inline">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="jailedUid" value="{cases.uid}" />
          <input type="hidden" name="decision" value="release" />
          <button type="submit" class="btn btn-success btn-sm adr-btn"><i class="fa fa-door-open"></i> Vote: Release</button>
        </form>
        <form method="post" action="/adr/courthouse/vote" style="display:inline">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="hidden" name="jailedUid" value="{cases.uid}" />
          <input type="hidden" name="decision" value="prison" />
          <button type="submit" class="btn btn-danger btn-sm adr-btn"><i class="fa fa-lock"></i> Vote: Keep Jailed</button>
        </form>
      </div>
      {{{ end }}}
    </div>
    {{{ end }}}
  </div>
  {{{ else }}}
  <div class="adr-panel">
    <p class="adr-muted"><i class="fa fa-dove"></i> No active cases. The realm is at peace.</p>
  </div>
  {{{ end }}}
</div>
