<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-chart-line"></i> Vault / Stock Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <div class="panel panel-default">
    <div class="panel-heading"><h3 class="panel-title">Actions</h3></div>
    <div class="panel-body">
      <button class="btn btn-success" onclick="adrStockNew()"><i class="fa fa-plus"></i> Add Stock</button>
      <form method="post" action="/admin/plugins/adr/vault/stocks/update-prices" style="display:inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <button type="submit" class="btn btn-info"><i class="fa fa-arrows-rotate"></i> Update All Prices</button>
      </form>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading"><h3 class="panel-title">Stocks</h3></div>
    <div class="panel-body">
      {{{ if stocks.length }}}
      <div class="table-responsive">
        <table class="table table-striped">
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Min Change %</th><th>Max Change %</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {{{ each stocks }}}
            <tr>
              <td>{stocks.stock_id}</td>
              <td>{stocks.stock_name}</td>
              <td class="adr-gold">{stocks.stock_price}</td>
              <td>{stocks.stock_min_change}</td>
              <td>{stocks.stock_max_change}</td>
              <td>{stocks.stock_desc}</td>
              <td>
                <button type="button" class="btn btn-xs btn-primary" onclick="adrStockEdit(this)"
                  data-id="{stocks.stock_id}" data-name="{stocks.stock_name}"
                  data-price="{stocks.stock_price}" data-min="{stocks.stock_min_change}"
                  data-max="{stocks.stock_max_change}" data-desc="{stocks.stock_desc}"
                >Edit</button>
                <form method="post" action="/admin/plugins/adr/vault/stocks/delete" style="display:inline" onsubmit="return confirm('Delete?')">
                  <input type="hidden" name="_csrf" value="{config.csrf_token}" />
                  <input type="hidden" name="stockId" value="{stocks.stock_id}" />
                  <button type="submit" class="btn btn-xs btn-danger">Delete</button>
                </form>
              </td>
            </tr>
            {{{ end }}}
          </tbody>
        </table>
      </div>
      {{{ else }}}
      <p class="text-muted">No stocks created yet.</p>
      {{{ end }}}
    </div>
  </div>

  <div class="modal fade" id="stockModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Stock</h4></div>
      <form method="post" action="/admin/plugins/adr/vault/stocks/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="stock_id" id="stkId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="stock_name" id="stkName" class="form-control" required /></div>
          <div class="form-group"><label>Starting Price (gold)</label><input type="number" name="stock_price" id="stkPrice" class="form-control" value="100" /></div>
          <div class="form-group"><label>Min Change % per tick</label><input type="number" name="stock_min_change" id="stkMin" class="form-control" value="1" /></div>
          <div class="form-group"><label>Max Change % per tick</label><input type="number" name="stock_max_change" id="stkMax" class="form-control" value="10" /></div>
          <div class="form-group"><label>Description</label><textarea name="stock_desc" id="stkDesc" class="form-control"></textarea></div>
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
function adrStockNew() {
  document.getElementById('stkId').value = '0';
  document.getElementById('stkName').value = '';
  document.getElementById('stkPrice').value = 100;
  document.getElementById('stkMin').value = 1;
  document.getElementById('stkMax').value = 10;
  document.getElementById('stkDesc').value = '';
  $('#stockModal').modal('show');
}
function adrStockEdit(btn) {
  var d = btn.dataset;
  document.getElementById('stkId').value = d.id;
  document.getElementById('stkName').value = d.name;
  document.getElementById('stkPrice').value = d.price;
  document.getElementById('stkMin').value = d.min;
  document.getElementById('stkMax').value = d.max;
  document.getElementById('stkDesc').value = d.desc || '';
  $('#stockModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
