<!-- IMPORT admin/header.tpl -->
<div class="adr-admin">
  <h1><i class="fa fa-sliders"></i> ADR Settings</h1>
  {{{ if error }}}<div class="alert alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="alert alert-success">{success}</div>{{{ end }}}

  <form method="post" action="/admin/plugins/adr/settings" class="form-horizontal">
    <input type="hidden" name="_csrf" value="{config.csrf_token}" />

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">General</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Disable RPG</label>
          <div class="col-sm-9">
            <input type="checkbox" name="disable_rpg" value="1" {{{ if settings.disable_rpg }}}checked{{{ end }}} />
            <p class="help-block">Disables the entire RPG system site-wide.</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Allow Character Deletion</label>
          <div class="col-sm-9">
            <input type="checkbox" name="allow_character_delete" value="1" {{{ if settings.allow_character_delete }}}checked{{{ end }}} />
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Allow Re-roll</label>
          <div class="col-sm-9">
            <input type="checkbox" name="allow_reroll" value="1" {{{ if settings.allow_reroll }}}checked{{{ end }}} />
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Max Characteristic</label>
          <div class="col-sm-9"><input type="number" name="max_characteristic" value="{settings.max_characteristic}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Min Characteristic</label>
          <div class="col-sm-9"><input type="number" name="min_characteristic" value="{settings.min_characteristic}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">XP for new topic</label>
          <div class="col-sm-9"><input type="number" name="experience_for_new" value="{settings.experience_for_new}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">XP for reply</label>
          <div class="col-sm-9"><input type="number" name="experience_for_reply" value="{settings.experience_for_reply}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Battle Settings</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable PvE Battle</label>
          <div class="col-sm-9"><input type="checkbox" name="battle_enable" value="1" {{{ if settings.battle_enable }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable PvP Battle</label>
          <div class="col-sm-9"><input type="checkbox" name="battle_pvp_enable" value="1" {{{ if settings.battle_pvp_enable }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Base EXP Min</label>
          <div class="col-sm-9"><input type="number" name="battle_base_exp_min" value="{settings.battle_base_exp_min}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Base EXP Max</label>
          <div class="col-sm-9"><input type="number" name="battle_base_exp_max" value="{settings.battle_base_exp_max}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Base Gold Reward Min</label>
          <div class="col-sm-9"><input type="number" name="battle_base_reward_min" value="{settings.battle_base_reward_min}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Base Gold Reward Max</label>
          <div class="col-sm-9"><input type="number" name="battle_base_reward_max" value="{settings.battle_base_reward_max}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Daily Limits</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable Daily Limits</label>
          <div class="col-sm-9"><input type="checkbox" name="character_limit_enable" value="1" {{{ if settings.character_limit_enable }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Daily Battle Limit</label>
          <div class="col-sm-9"><input type="number" name="character_battle_limit" value="{settings.character_battle_limit}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Daily Skill Limit</label>
          <div class="col-sm-9"><input type="number" name="character_skill_limit" value="{settings.character_skill_limit}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Daily Trading Limit</label>
          <div class="col-sm-9"><input type="number" name="character_trading_limit" value="{settings.character_trading_limit}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Limit Regen Duration (hrs)</label>
          <div class="col-sm-9"><input type="number" name="limit_regen_duration" value="{settings.limit_regen_duration}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Temple</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Heal Cost (gold)</label>
          <div class="col-sm-9"><input type="number" name="temple_heal_cost" value="{settings.temple_heal_cost}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Resurrect Cost (gold)</label>
          <div class="col-sm-9"><input type="number" name="temple_resurrect_cost" value="{settings.temple_resurrect_cost}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Vault / Bank</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable Vault</label>
          <div class="col-sm-9"><input type="checkbox" name="vault_enable" value="1" {{{ if settings.vault_enable }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable Loans</label>
          <div class="col-sm-9"><input type="checkbox" name="vault_loan_enable" value="1" {{{ if settings.vault_loan_enable }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Max Loan Sum</label>
          <div class="col-sm-9"><input type="number" name="loan_max_sum" value="{settings.loan_max_sum}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Loan Interest %</label>
          <div class="col-sm-9"><input type="number" name="loan_interests" value="{settings.loan_interests}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Bank Interest %</label>
          <div class="col-sm-9"><input type="number" name="interests_rate" value="{settings.interests_rate}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Enable Stocks</label>
          <div class="col-sm-9"><input type="checkbox" name="stock_use" value="1" {{{ if settings.stock_use }}}checked{{{ end }}} /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Market / Shops</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Shop Tax %</label>
          <div class="col-sm-9"><input type="number" name="shop_tax" value="{settings.shop_tax}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">New Shop Price</label>
          <div class="col-sm-9"><input type="number" name="new_shop_price" value="{settings.new_shop_price}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Shop Duration (days)</label>
          <div class="col-sm-9"><input type="number" name="shop_duration" value="{settings.shop_duration}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h3 class="panel-title">Courthouse / Prison</h3></div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-3 control-label">Allow user vote: Release</label>
          <div class="col-sm-9"><input type="checkbox" name="cell_allow_user_blank" value="1" {{{ if settings.cell_allow_user_blank }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Allow user vote: Caution</label>
          <div class="col-sm-9"><input type="checkbox" name="cell_allow_user_caution" value="1" {{{ if settings.cell_allow_user_caution }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Allow user to judge</label>
          <div class="col-sm-9"><input type="checkbox" name="cell_allow_user_judge" value="1" {{{ if settings.cell_allow_user_judge }}}checked{{{ end }}} /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Voters needed to release</label>
          <div class="col-sm-9"><input type="number" name="cell_user_judge_voters" value="{settings.cell_user_judge_voters}" class="form-control" /></div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Min posts to vote</label>
          <div class="col-sm-9"><input type="number" name="cell_user_judge_posts" value="{settings.cell_user_judge_posts}" class="form-control" /></div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary btn-lg">Save Settings</button>
  </form>
</div>
<!-- IMPORT admin/footer.tpl -->
