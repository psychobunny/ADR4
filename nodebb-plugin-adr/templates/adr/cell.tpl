<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-bars"></i> Prison Cell</h1>

  <div class="adr-cell-card">
    <div class="adr-cell-header">
      <i class="fa fa-lock adr-cell-icon"></i>
      <h2>You are imprisoned!</h2>
    </div>

    <div class="adr-panel">
      <h3>Your Sentence</h3>
      <div class="adr-stats-list">
        <div class="adr-stat-pair"><span>Reason</span><strong>{jailRecord.jail_reason}</strong></div>
        <div class="adr-stat-pair"><span>Jailed by</span><strong>{jailRecord.jailedByName}</strong></div>
        <div class="adr-stat-pair"><span>Sentence ends</span><strong>{jailRecord.releaseStr}</strong></div>
        <div class="adr-stat-pair"><span>Fine</span><strong class="adr-gold">{jailRecord.jail_fine} gold</strong></div>
      </div>
    </div>

    {{{ if config.cell_allow_user_blank }}}
    <div class="adr-panel">
      <h3>Buy Freedom</h3>
      <p>Pay your fine to be released immediately.</p>
      <form method="post" action="/adr/cell/buy-freedom">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <button type="submit" class="btn btn-warning adr-btn">
          <i class="fa fa-coins"></i> Pay Fine &amp; Be Released
        </button>
      </form>
    </div>
    {{{ end }}}

    {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  </div>
</div>
