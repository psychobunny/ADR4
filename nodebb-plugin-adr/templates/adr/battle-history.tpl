<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-scroll"></i> My Battle History</h1>
  <div class="adr-table-wrap">
    <table class="adr-table">
      <thead><tr><th>Date</th><th>Opponent</th><th>Rounds</th><th>Result</th><th>XP</th><th>Gold</th></tr></thead>
      <tbody>
        {{{ each battles }}}
        <tr class="adr-row-{battles.resultClass}">
          <td>{battles.dateStr}</td>
          <td>{battles.opponentName}</td>
          <td>{battles.battle_round}</td>
          <td><span class="adr-badge adr-badge-{battles.resultClass}">{battles.resultLabel}</span></td>
          <td>+{battles.battle_xp_gained}</td>
          <td>+{battles.battle_gold_gained}</td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="adr-pagination">Page {page}</div>
  <a href="/adr/battle" class="btn btn-outline adr-btn-outline"><i class="fa fa-arrow-left"></i> Back to Battle</a>
</div>
