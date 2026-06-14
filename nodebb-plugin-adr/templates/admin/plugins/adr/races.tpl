<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-person"></i> Race Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrRaceNew()"><i class="fa fa-plus"></i> Add Race</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>HP Bonus</th><th>MP Bonus</th><th>Selectable</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each races }}}
        <tr>
          <td>{races.race_id}</td><td>{races.race_name}</td>
          <td>{races.race_base_hp}</td><td>{races.race_base_mp}</td>
          <td>{{{ if races.race_selectable }}}Yes{{{ else }}}No{{{ end }}}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrRaceEdit(this)"
              data-id="{races.race_id}" data-name="{races.race_name}" data-hp="{races.race_base_hp}"
              data-mp="{races.race_base_mp}" data-ac="{races.race_base_ac}"
              data-selectable="{races.race_selectable}" data-desc="{races.race_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/races/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="raceId" value="{races.race_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="raceModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Race</h4></div>
      <form method="post" action="/admin/plugins/adr/races/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="race_id" id="rId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="race_name" id="rName" class="form-control" required /></div>
          <div class="form-group"><label>HP Bonus</label><input type="number" name="race_base_hp" id="rHp" class="form-control" value="0" /></div>
          <div class="form-group"><label>MP Bonus</label><input type="number" name="race_base_mp" id="rMp" class="form-control" value="0" /></div>
          <div class="form-group"><label>AC Bonus</label><input type="number" name="race_base_ac" id="rAc" class="form-control" value="0" /></div>
          <div class="form-group"><label>Selectable</label><input type="checkbox" name="race_selectable" id="rSelectable" value="1" /></div>
          <div class="form-group"><label>Description</label><textarea name="race_desc" id="rDesc" class="form-control"></textarea></div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        </div>
      </form>
    </div></div>
  </div>
</div>
<script>
function adrRaceNew() {
  document.getElementById('rId').value = '0';
  document.getElementById('rName').value = '';
  document.getElementById('rHp').value = 0;
  document.getElementById('rMp').value = 0;
  document.getElementById('rAc').value = 0;
  document.getElementById('rSelectable').checked = true;
  document.getElementById('rDesc').value = '';
  $('#raceModal').modal('show');
}
function adrRaceEdit(btn) {
  var d = btn.dataset;
  document.getElementById('rId').value = d.id;
  document.getElementById('rName').value = d.name;
  document.getElementById('rHp').value = d.hp;
  document.getElementById('rMp').value = d.mp;
  document.getElementById('rAc').value = d.ac;
  document.getElementById('rSelectable').checked = d.selectable == '1';
  document.getElementById('rDesc').value = d.desc || '';
  $('#raceModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
