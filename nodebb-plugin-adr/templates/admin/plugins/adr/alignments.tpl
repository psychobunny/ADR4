<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-yin-yang"></i> Alignment Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrAlignNew()"><i class="fa fa-plus"></i> Add Alignment</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each alignments }}}
        <tr>
          <td>{alignments.alignment_id}</td><td>{alignments.alignment_name}</td>
          <td>{alignments.alignment_desc}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrAlignEdit(this)"
              data-id="{alignments.alignment_id}" data-name="{alignments.alignment_name}"
              data-desc="{alignments.alignment_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/alignments/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="alignmentId" value="{alignments.alignment_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="alignModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Alignment</h4></div>
      <form method="post" action="/admin/plugins/adr/alignments/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="alignment_id" id="alId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="alignment_name" id="alName" class="form-control" required /></div>
          <div class="form-group"><label>Description</label><textarea name="alignment_desc" id="alDesc" class="form-control"></textarea></div>
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
function adrAlignNew() {
  document.getElementById('alId').value = '0';
  document.getElementById('alName').value = '';
  document.getElementById('alDesc').value = '';
  $('#alignModal').modal('show');
}
function adrAlignEdit(btn) {
  var d = btn.dataset;
  document.getElementById('alId').value = d.id;
  document.getElementById('alName').value = d.name;
  document.getElementById('alDesc').value = d.desc || '';
  $('#alignModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
