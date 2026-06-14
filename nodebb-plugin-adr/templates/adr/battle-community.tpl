<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-list"></i> Community Battle Log</h1>
  <div class="adr-table-wrap">
    <table class="adr-table">
      <thead><tr><th>Date</th><th>Fighter</th><th>Opponent</th><th>Result</th><th>Rounds</th></tr></thead>
      <tbody>
        {{{ each battles }}}
        <tr class="adr-row-{battles.resultClass}">
          <td>{battles.dateStr}</td>
          <td><a href="/adr/character/{battles.battle_challenger_id}">{battles.challengerName}</a></td>
          <td>{battles.opponentName}</td>
          <td><span class="adr-badge adr-badge-{battles.resultClass}">{battles.resultLabel}</span></td>
          <td>{battles.battle_round}</td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <a href="/adr/battle" class="btn btn-outline adr-btn-outline"><i class="fa fa-arrow-left"></i> Back to Arena</a>
</div>
