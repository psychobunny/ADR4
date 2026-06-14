<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-scale-balanced"></i> Courthouse / Prison Admin</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <div class="panel panel-default">
    <div class="panel-heading"><h3 class="panel-title">Jail a User</h3></div>
    <div class="panel-body">
      <form method="post" action="/admin/plugins/adr/courthouse/jail" class="form-inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <div class="form-group">
          <label>UID</label>
          <input type="number" name="targetUid" class="form-control" placeholder="User UID" required />
        </div>
        <div class="form-group">
          <label>Sentence (hours)</label>
          <input type="number" name="sentence" class="form-control" value="24" min="1" />
        </div>
        <div class="form-group">
          <label>Reason</label>
          <input type="text" name="caution" class="form-control" placeholder="Rule violation..." />
        </div>
        <button type="submit" class="btn btn-danger"><i class="fa fa-lock"></i> Jail User</button>
      </form>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading"><h3 class="panel-title">Active Cases</h3></div>
    <div class="panel-body">
      {{{ if cases.length }}}
      <div class="table-responsive">
        <table class="table table-striped">
          <thead><tr><th>UID</th><th>Character</th><th>Reason</th><th>Release</th><th>Votes (R/P)</th><th>Actions</th></tr></thead>
          <tbody>
            {{{ each cases }}}
            <tr>
              <td>{cases.uid}</td>
              <td><a href="/adr/character/{cases.uid}" target="_blank">{cases.characterName}</a></td>
              <td>{cases.jail_reason}</td>
              <td>{cases.releaseStr}</td>
              <td>{cases.votes_release} / {cases.votes_prison}</td>
              <td>
                <form method="post" action="/admin/plugins/adr/courthouse/release" style="display:inline" onsubmit="return confirm('Release this user?')">
                  <input type="hidden" name="_csrf" value="{config.csrf_token}" />
                  <input type="hidden" name="targetUid" value="{cases.uid}" />
                  <button type="submit" class="btn btn-xs btn-success"><i class="fa fa-door-open"></i> Release</button>
                </form>
              </td>
            </tr>
            {{{ end }}}
          </tbody>
        </table>
      </div>
      {{{ else }}}
      <p class="text-muted">No active cases.</p>
      {{{ end }}}
    </div>
  </div>
</div>
<!-- IMPORT admin/footer.tpl -->
