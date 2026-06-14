<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-hat-wizard"></i> Class Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrClassNew()"><i class="fa fa-plus"></i> Add Class</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Base HP</th><th>Base MP</th><th>Base AC</th><th>Selectable</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each classes }}}
        <tr>
          <td>{classes.class_id}</td><td>{classes.class_name}</td>
          <td>{classes.class_base_hp}</td><td>{classes.class_base_mp}</td><td>{classes.class_base_ac}</td>
          <td>{{{ if classes.class_selectable }}}Yes{{{ else }}}No{{{ end }}}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrClassEdit(this)"
              data-id="{classes.class_id}" data-name="{classes.class_name}"
              data-hp="{classes.class_base_hp}" data-mp="{classes.class_base_mp}"
              data-ac="{classes.class_base_ac}" data-selectable="{classes.class_selectable}"
              data-desc="{classes.class_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/classes/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="classId" value="{classes.class_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="classModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Class</h4></div>
      <form method="post" action="/admin/plugins/adr/classes/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="class_id" id="cId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="class_name" id="cName" class="form-control" required /></div>
          <div class="form-group"><label>Base HP</label><input type="number" name="class_base_hp" id="cHp" class="form-control" value="100" /></div>
          <div class="form-group"><label>Base MP</label><input type="number" name="class_base_mp" id="cMp" class="form-control" value="50" /></div>
          <div class="form-group"><label>Base AC</label><input type="number" name="class_base_ac" id="cAc" class="form-control" value="10" /></div>
          <div class="form-group"><label>Selectable</label><input type="checkbox" name="class_selectable" id="cSelectable" value="1" /></div>
          <div class="form-group"><label>Description</label><textarea name="class_desc" id="cDesc" class="form-control"></textarea></div>
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
function adrClassNew() {
  document.getElementById('cId').value = '0';
  document.getElementById('cName').value = '';
  document.getElementById('cHp').value = 100;
  document.getElementById('cMp').value = 50;
  document.getElementById('cAc').value = 10;
  document.getElementById('cSelectable').checked = true;
  document.getElementById('cDesc').value = '';
  $('#classModal').modal('show');
}
function adrClassEdit(btn) {
  var d = btn.dataset;
  document.getElementById('cId').value = d.id;
  document.getElementById('cName').value = d.name;
  document.getElementById('cHp').value = d.hp;
  document.getElementById('cMp').value = d.mp;
  document.getElementById('cAc').value = d.ac;
  document.getElementById('cSelectable').checked = d.selectable == '1';
  document.getElementById('cDesc').value = d.desc || '';
  $('#classModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
