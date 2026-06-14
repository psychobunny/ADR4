<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-dragon"></i> Monster Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <button class="btn btn-success" onclick="adrMonsterNew()"><i class="fa fa-plus"></i> Add Monster</button>

  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr>
        <th>ID</th><th>Name</th><th>Level</th><th>HP</th><th>ATT</th><th>DEF</th><th>XP</th><th>Gold</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {{{ each monsters }}}
        <tr>
          <td>{monsters.monster_id}</td>
          <td>{monsters.monster_name}</td>
          <td>{monsters.monster_level}</td>
          <td>{monsters.monster_hp}</td>
          <td>{monsters.monster_att}</td>
          <td>{monsters.monster_def}</td>
          <td>{monsters.monster_exp}</td>
          <td>{monsters.monster_gold}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrMonsterEdit(this)"
              data-id="{monsters.monster_id}"
              data-name="{monsters.monster_name}"
              data-level="{monsters.monster_level}"
              data-hp="{monsters.monster_hp}"
              data-att="{monsters.monster_att}"
              data-def="{monsters.monster_def}"
              data-magic-att="{monsters.monster_magic_att}"
              data-magic-def="{monsters.monster_magic_def}"
              data-exp="{monsters.monster_exp}"
              data-gold="{monsters.monster_gold}"
              data-element="{monsters.monster_element}"
              data-desc="{monsters.monster_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/monsters/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="monsterId" value="{monsters.monster_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>

  <div class="modal fade" id="monsterModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Monster</h4></div>
      <form method="post" action="/admin/plugins/adr/monsters/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="monster_id" id="mId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="monster_name" id="mName" class="form-control" required /></div>
          <div class="form-group"><label>Level</label><input type="number" name="monster_level" id="mLevel" class="form-control" min="1" value="1" /></div>
          <div class="form-group"><label>HP</label><input type="number" name="monster_hp" id="mHp" class="form-control" min="1" value="100" /></div>
          <div class="form-group"><label>ATT</label><input type="number" name="monster_att" id="mAtt" class="form-control" value="10" /></div>
          <div class="form-group"><label>DEF</label><input type="number" name="monster_def" id="mDef" class="form-control" value="5" /></div>
          <div class="form-group"><label>Magic ATT</label><input type="number" name="monster_magic_att" id="mMagicAtt" class="form-control" value="5" /></div>
          <div class="form-group"><label>Magic DEF</label><input type="number" name="monster_magic_def" id="mMagicDef" class="form-control" value="5" /></div>
          <div class="form-group"><label>XP Reward</label><input type="number" name="monster_exp" id="mExp" class="form-control" value="50" /></div>
          <div class="form-group"><label>Gold Reward</label><input type="number" name="monster_gold" id="mGold" class="form-control" value="25" /></div>
          <div class="form-group"><label>Element</label>
            <select name="monster_element" id="mElem" class="form-control">
              {{{ each elements }}}
              <option value="{elements.element_id}">{elements.element_name}</option>
              {{{ end }}}
            </select>
          </div>
          <div class="form-group"><label>Description</label><textarea name="monster_desc" id="mDesc" class="form-control"></textarea></div>
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
function adrMonsterNew() {
  document.getElementById('mId').value = '0';
  document.getElementById('mName').value = '';
  document.getElementById('mLevel').value = 1;
  document.getElementById('mHp').value = 100;
  document.getElementById('mAtt').value = 10;
  document.getElementById('mDef').value = 5;
  document.getElementById('mMagicAtt').value = 5;
  document.getElementById('mMagicDef').value = 5;
  document.getElementById('mExp').value = 50;
  document.getElementById('mGold').value = 25;
  document.getElementById('mDesc').value = '';
  $('#monsterModal').modal('show');
}
function adrMonsterEdit(btn) {
  var d = btn.dataset;
  document.getElementById('mId').value = d.id;
  document.getElementById('mName').value = d.name;
  document.getElementById('mLevel').value = d.level;
  document.getElementById('mHp').value = d.hp;
  document.getElementById('mAtt').value = d.att;
  document.getElementById('mDef').value = d.def;
  document.getElementById('mMagicAtt').value = d.magicAtt;
  document.getElementById('mMagicDef').value = d.magicDef;
  document.getElementById('mExp').value = d.exp;
  document.getElementById('mGold').value = d.gold;
  document.getElementById('mDesc').value = d.desc;
  $('#monsterModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
