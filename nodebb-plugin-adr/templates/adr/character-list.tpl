<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-list"></i> Adventurers</h1>
  <div class="adr-table-wrap">
    <table class="adr-table">
      <thead><tr>
        <th>#</th><th>Name</th><th>Level</th><th>Class</th><th>Race</th><th>Element</th><th>W/L/F</th>
      </tr></thead>
      <tbody>
        {{{ each characters }}}
        <tr>
          <td>{@index}</td>
          <td><a href="/adr/character/{characters.uid}">{characters.character_name}</a></td>
          <td>{characters.character_level}</td>
          <td>{characters.className}</td>
          <td>{characters.raceName}</td>
          <td><span class="adr-elem-badge" style="background:{characters.elementColour}">{characters.elementName}</span></td>
          <td class="adr-record">{characters.character_victories}/{characters.character_defeats}/{characters.character_flees}</td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="adr-pagination">
    {{{ if page }}}
    <a href="/adr/character-list?page=1" class="btn btn-sm">First</a>
    <span>Page {page} of {totalPages}</span>
    {{{ end }}}
  </div>
</div>
