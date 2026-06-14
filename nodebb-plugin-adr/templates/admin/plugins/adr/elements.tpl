<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-fire"></i> Element Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrElemNew()"><i class="fa fa-plus"></i> Add Element</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Color</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each elements }}}
        <tr>
          <td>{elements.element_id}</td>
          <td style="color:{elements.element_colour}"><strong>{elements.element_name}</strong></td>
          <td><span style="background:{elements.element_colour};padding:2px 12px">&nbsp;</span> {elements.element_colour}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrElemEdit(this)"
              data-id="{elements.element_id}" data-name="{elements.element_name}"
              data-colour="{elements.element_colour}" data-desc="{elements.element_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/elements/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="elementId" value="{elements.element_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="elemModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Element</h4></div>
      <form method="post" action="/admin/plugins/adr/elements/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="element_id" id="eId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="element_name" id="eName" class="form-control" required /></div>
          <div class="form-group"><label>Color</label><input type="color" name="element_colour" id="eColour" class="form-control" value="#888888" /></div>
          <div class="form-group"><label>Description</label><textarea name="element_desc" id="eDesc" class="form-control"></textarea></div>
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
function adrElemNew() {
  document.getElementById('eId').value = '0';
  document.getElementById('eName').value = '';
  document.getElementById('eColour').value = '#888888';
  document.getElementById('eDesc').value = '';
  $('#elemModal').modal('show');
}
function adrElemEdit(btn) {
  var d = btn.dataset;
  document.getElementById('eId').value = d.id;
  document.getElementById('eName').value = d.name;
  document.getElementById('eColour').value = d.colour || '#888888';
  document.getElementById('eDesc').value = d.desc || '';
  $('#elemModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
