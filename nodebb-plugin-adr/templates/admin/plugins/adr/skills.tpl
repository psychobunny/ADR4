<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-hammer"></i> Skill Management</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}
  <button class="btn btn-success" onclick="adrSkillNew()"><i class="fa fa-plus"></i> Add Skill</button>
  <div class="table-responsive" style="margin-top:1rem">
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Max Level</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        {{{ each skills }}}
        <tr>
          <td>{skills.skill_id}</td><td>{skills.skill_name}</td>
          <td>{skills.skill_type}</td><td>{skills.skill_max_level}</td>
          <td>{skills.skill_desc}</td>
          <td>
            <button type="button" class="btn btn-xs btn-primary" onclick="adrSkillEdit(this)"
              data-id="{skills.skill_id}" data-name="{skills.skill_name}"
              data-type="{skills.skill_type}" data-max="{skills.skill_max_level}"
              data-cost="{skills.skill_cost}" data-desc="{skills.skill_desc}"
            >Edit</button>
            <form method="post" action="/admin/plugins/adr/skills/delete" style="display:inline" onsubmit="return confirm('Delete?')">
              <input type="hidden" name="_csrf" value="{config.csrf_token}" />
              <input type="hidden" name="skillId" value="{skills.skill_id}" />
              <button type="submit" class="btn btn-xs btn-danger">Delete</button>
            </form>
          </td>
        </tr>
        {{{ end }}}
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="skillModal" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h4 class="modal-title">Skill</h4></div>
      <form method="post" action="/admin/plugins/adr/skills/save">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="modal-body">
          <input type="hidden" name="skill_id" id="skId" value="0" />
          <div class="form-group"><label>Name</label><input type="text" name="skill_name" id="skName" class="form-control" required /></div>
          <div class="form-group"><label>Type</label>
            <select name="skill_type" id="skType" class="form-control">
              <option value="forge">Forge</option>
              <option value="mining">Mining</option>
              <option value="stone">Stonecraft</option>
              <option value="enchantment">Enchantment</option>
              <option value="trading">Trading</option>
              <option value="thief">Thievery</option>
            </select>
          </div>
          <div class="form-group"><label>Max Level</label><input type="number" name="skill_max_level" id="skMax" class="form-control" value="10" /></div>
          <div class="form-group"><label>Base Train Cost (XP)</label><input type="number" name="skill_cost" id="skCost" class="form-control" value="100" /></div>
          <div class="form-group"><label>Description</label><textarea name="skill_desc" id="skDesc" class="form-control"></textarea></div>
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
function adrSkillNew() {
  document.getElementById('skId').value = '0';
  document.getElementById('skName').value = '';
  document.getElementById('skType').value = 'forge';
  document.getElementById('skMax').value = 10;
  document.getElementById('skCost').value = 100;
  document.getElementById('skDesc').value = '';
  $('#skillModal').modal('show');
}
function adrSkillEdit(btn) {
  var d = btn.dataset;
  document.getElementById('skId').value = d.id;
  document.getElementById('skName').value = d.name;
  document.getElementById('skType').value = d.type;
  document.getElementById('skMax').value = d.max;
  document.getElementById('skCost').value = d.cost;
  document.getElementById('skDesc').value = d.desc || '';
  $('#skillModal').modal('show');
}
</script>
<!-- IMPORT admin/footer.tpl -->
