<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-users"></i> Character Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <div class="table-responsive">
    <table class="table table-striped">
      <thead><tr>
        <th>UID</th><th>Name</th><th>Level</th><th>Class</th><th>Race</th><th>HP</th><th>Gold</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {{{ each characters }}}
        <tr>
          <td>{characters.uid}</td>
          <td><a href="/adr/character/{characters.uid}" target="_blank">{characters.character_name}</a></td>
          <td>{characters.character_level}</td>
          <td>{characters.className}</td>
          <td>{characters.raceName}</td>
          <td>{characters.character_hp}/{characters.character_hp_max}</td>
          <td>{characters.character_gold}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrAdminEditChar(this)"
              data-uid="{characters.uid}"
              data-name="{characters.character_name}"
              data-level="{characters.character_level}"
              data-hp="{characters.character_hp}"
              data-hp-max="{characters.character_hp_max}"
              data-mp="{characters.character_mp}"
              data-mp-max="{characters.character_mp_max}"
              data-gold="{characters.character_gold}"
              data-xp="{characters.character_xp}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/characters/delete" style="display:inline" onsubmit="return confirm('Delete this character permanently?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="uid" value="{characters.uid}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>

  <div class="adr-pagination">Page {page} of {totalPages}</div>

  <div class="modal fade" id="editCharModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h4 class="modal-title">Edit Character</h4></div>
        <form method="post" action="/admin/plugins/adr/characters/edit">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <div class="modal-body">
            <input type="hidden" name="uid" id="editCharUid" />
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="character_name" id="editCharName" class="form-control" />
            </div>
            <div class="form-group">
              <label>Level</label>
              <input type="number" name="character_level" id="editCharLevel" class="form-control" min="1" />
            </div>
            <div class="form-group">
              <label>HP / Max HP</label>
              <div class="input-group">
                <input type="number" name="character_hp" id="editCharHp" class="form-control" />
                <input type="number" name="character_hp_max" id="editCharHpMax" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label>MP / Max MP</label>
              <div class="input-group">
                <input type="number" name="character_mp" id="editCharMp" class="form-control" />
                <input type="number" name="character_mp_max" id="editCharMpMax" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label>Gold</label>
              <input type="number" name="character_gold" id="editCharGold" class="form-control" min="0" />
            </div>
            <div class="form-group">
              <label>XP</label>
              <input type="number" name="character_xp" id="editCharXp" class="form-control" min="0" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<script>
function adrAdminEditChar(btn) {
  var d = btn.dataset;
  document.getElementById('editCharUid').value   = d.uid;
  document.getElementById('editCharName').value  = d.name;
  document.getElementById('editCharLevel').value = d.level;
  document.getElementById('editCharHp').value    = d.hp;
  document.getElementById('editCharHpMax').value = d.hpMax;
  document.getElementById('editCharMp').value    = d.mp;
  document.getElementById('editCharMpMax').value = d.mpMax;
  document.getElementById('editCharGold').value  = d.gold;
  document.getElementById('editCharXp').value    = d.xp;
  $('#editCharModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
