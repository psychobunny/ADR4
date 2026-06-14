<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-scroll"></i> PvP History</h1>
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}
  <div class="adr-table-wrap">
    <table class="adr-table">
      <thead><tr><th>Date</th><th>Challenger</th><th>Defender</th><th>Rounds</th><th>Result</th><th>XP</th><th>Gold</th></tr></thead>
      <tbody>
        {{{ each battles }}}
        <tr class="adr-row-{battles.resultClass}">
          <td>{battles.dateStr}</td>
          <td><a href="/adr/character/{battles.battle_challenger_id}">{battles.challengerName}</a></td>
          <td><a href="/adr/character/{battles.battle_opponent_id}">{battles.opponentName}</a></td>
          <td>{battles.battle_round}</td>
          <td><span class="adr-badge adr-badge-{battles.resultClass}">{battles.resultLabel}</span></td>
          <td>{battles.battle_xp_gained}</td>
          <td>{battles.battle_gold_gained}</td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="adr-pagination">Page {page}</div>
  <a href="/adr/pvp" class="btn btn-outline adr-btn-outline"><i class="fa fa-arrow-left"></i> Back to PvP</a>
</div>
