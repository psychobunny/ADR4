<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-shield-halved"></i> Item Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <button class="btn btn-success" onclick="adrItemNew()"><i class="fa fa-plus"></i> Add Item</button>

  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped table-condensed">
      <thead><tr>
        <th>ID</th><th>Name</th><th>Type</th><th>Quality</th><th>Power</th><th>Dur</th><th>Price</th><th>Store</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {{{ each items }}}
        <tr>
          <td>{items.item_id}</td>
          <td>{items.item_name}</td>
          <td>{items.typeLabel}</td>
          <td>{items.qualityLabel}</td>
          <td>{items.item_power}</td>
          <td>{items.item_duration}</td>
          <td>{items.item_price}</td>
          <td>{items.item_store_id}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrItemEdit(this)"
              data-id="{items.item_id}" data-name="{items.item_name}" data-type="{items.item_type_use}"
              data-quality="{items.item_quality}" data-power="{items.item_power}" data-dur="{items.item_duration}"
              data-dur-max="{items.item_duration_max}" data-weight="{items.item_weight}" data-price="{items.item_price}"
              data-store="{items.item_store_id}" data-in-shop="{items.item_in_shop}"
              data-level="{items.item_level_required}" data-desc="{items.item_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/items/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="itemId" value="{items.item_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="adr-pagination">Page {page} of {totalPages}</div>

  <div class="modal fade" id="itemModal" tabindex="-1">
    <div class="modal-dialog modal-lg"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Item</h4></div>
      <form method="post" action="/admin/plugins/adr/items/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="item_id" id="iId" value="0" />
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group"><label>Name</label><input type="text" name="item_name" id="iName" class="form-control" required /></div>
              <div class="form-group"><label>Type</label>
                <select name="item_type_use" id="iType" class="form-control">
                  <option value="0">None</option>
                  <option value="1">Weapon (1H)</option>
                  <option value="2">Weapon (2H)</option>
                  <option value="3">Shield</option>
                  <option value="4">Helm</option>
                  <option value="5">Body Armour</option>
                  <option value="6">Boots</option>
                  <option value="7">Gloves</option>
                  <option value="8">Belt</option>
                  <option value="9">Ring</option>
                  <option value="10">Amulet</option>
                  <option value="11">Ore / Material</option>
                  <option value="12">Potion</option>
                  <option value="13">Scroll</option>
                  <option value="14">Crafted Weapon</option>
                </select>
              </div>
              <div class="form-group"><label>Quality</label>
                <select name="item_quality" id="iQuality" class="form-control">
                  <option value="0">Common</option>
                  <option value="1">Uncommon</option>
                  <option value="2">Rare</option>
                  <option value="3">Epic</option>
                  <option value="4">Legendary</option>
                </select>
              </div>
              <div class="form-group"><label>Power</label><input type="number" name="item_power" id="iPower" class="form-control" value="10" /></div>
              <div class="form-group"><label>Duration</label><input type="number" name="item_duration" id="iDur" class="form-control" value="100" /></div>
              <div class="form-group"><label>Max Duration</label><input type="number" name="item_duration_max" id="iDurMax" class="form-control" value="100" /></div>
            </div>
            <div class="col-sm-6">
              <div class="form-group"><label>Weight</label><input type="number" name="item_weight" id="iWeight" class="form-control" value="1" /></div>
              <div class="form-group"><label>Price (gold)</label><input type="number" name="item_price" id="iPrice" class="form-control" value="100" /></div>
              <div class="form-group"><label>Level Required</label><input type="number" name="item_level_required" id="iLevel" class="form-control" value="1" /></div>
              <div class="form-group"><label>Store</label>
                <select name="item_store_id" id="iStore" class="form-control">
                  <option value="0">Not in store</option>
                  {{{ each stores }}}
                  <option value="{stores.store_id}">{stores.store_name}</option>
                  {{{ end }}}
                </select>
              </div>
              <div class="form-group"><label>List in shop?</label>
                <input type="checkbox" name="item_in_shop" id="iInShop" value="1" />
              </div>
              <div class="form-group"><label>Description</label><textarea name="item_desc" id="iDesc" class="form-control"></textarea></div>
            </div>
          </div>
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
function adrItemNew() {
  document.getElementById('iId').value = '0';
  ['iName','iDesc'].forEach(function(f) { document.getElementById(f).value = ''; });
  ['iType','iQuality'].forEach(function(f) { document.getElementById(f).selectedIndex = 0; });
  ['iPower','iDur','iDurMax','iWeight','iPrice','iLevel'].forEach(function(f) { document.getElementById(f).value = ''; });
  document.getElementById('iStore').value = '0';
  document.getElementById('iInShop').checked = false;
  $('#itemModal').modal('show');
}
function adrItemEdit(btn) {
  var d = btn.dataset;
  document.getElementById('iId').value = d.id;
  document.getElementById('iName').value = d.name;
  document.getElementById('iType').value = d.type;
  document.getElementById('iQuality').value = d.quality;
  document.getElementById('iPower').value = d.power;
  document.getElementById('iDur').value = d.dur;
  document.getElementById('iDurMax').value = d.durMax;
  document.getElementById('iWeight').value = d.weight;
  document.getElementById('iPrice').value = d.price;
  document.getElementById('iStore').value = d.store || '0';
  document.getElementById('iInShop').checked = d.inShop == '1';
  document.getElementById('iLevel').value = d.level;
  document.getElementById('iDesc').value = d.desc || '';
  $('#itemModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
