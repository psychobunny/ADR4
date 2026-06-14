<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-store"></i> Store Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrStoreNew()"><i class="fa fa-plus"></i> Add Store</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each stores }}}
        <tr>
          <td>{stores.store_id}</td><td>{stores.store_name}</td><td>{stores.store_desc}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrStoreEdit(this)"
              data-id="{stores.store_id}" data-name="{stores.store_name}" data-desc="{stores.store_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/stores/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="storeId" value="{stores.store_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="storeModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Store</h4></div>
      <form method="post" action="/admin/plugins/adr/stores/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="store_id" id="stId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="store_name" id="stName" class="form-control" required /></div>
          <div class="form-group"><label>Description</label><textarea name="store_desc" id="stDesc" class="form-control"></textarea></div>
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
function adrStoreNew() {
  document.getElementById('stId').value = '0';
  document.getElementById('stName').value = '';
  document.getElementById('stDesc').value = '';
  $('#storeModal').modal('show');
}
function adrStoreEdit(btn) {
  var d = btn.dataset;
  document.getElementById('stId').value = d.id;
  document.getElementById('stName').value = d.name;
  document.getElementById('stDesc').value = d.desc || '';
  $('#storeModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
