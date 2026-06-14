<!-- IMPORT partials/breadcrumbs.tpl -->
<div class="adr-wrap">
  <h1 class="adr-page-title"><i class="fa fa-vault"></i> Vault &amp; Bank</h1>
  {{{ if error }}}<div class="adr-alert adr-alert-danger">{error}</div>{{{ end }}}
  {{{ if success }}}<div class="adr-alert adr-alert-success">{success}</div>{{{ end }}}

  <div class="adr-vault-layout">
    <div class="adr-panel">
      <h3><i class="fa fa-piggy-bank"></i> Bank Account</h3>
      <div class="adr-stats-list">
        <div class="adr-stat-pair"><span>Wallet</span><strong class="adr-gold">{character.character_gold} gold</strong></div>
        <div class="adr-stat-pair"><span>Saved</span><strong class="adr-gold">{account.vault_gold} gold</strong></div>
        {{{ if account.vault_loan }}}<div class="adr-stat-pair"><span>Loan</span><strong class="adr-loss">{account.vault_loan} gold</strong></div>{{{ end }}}
        <div class="adr-stat-pair"><span>Interest Rate</span><strong>{config.interests_rate}%</strong></div>
      </div>
      <div class="adr-vault-actions">
        <form method="post" action="/adr/vault/deposit" class="adr-form-inline">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="number" name="amount" placeholder="Amount" min="1" class="adr-input" />
          <button type="submit" class="btn btn-primary btn-sm adr-btn">Deposit</button>
        </form>
        <form method="post" action="/adr/vault/withdraw" class="adr-form-inline">
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />
          <input type="number" name="amount" placeholder="Amount" min="1" class="adr-input" />
          <button type="submit" class="btn btn-outline btn-sm adr-btn-outline">Withdraw</button>
        </form>
      </div>
    </div>

    {{{ if config.vault_loan_enable }}}
    <div class="adr-panel">
      <h3><i class="fa fa-hand-holding-dollar"></i> Loans</h3>
      <p>Max loan: <strong>{config.loan_max_sum} gold</strong> at <strong>{config.loan_interests}% interest</strong></p>
      {{{ if account.vault_loan }}}
      <p>Outstanding: <strong class="adr-loss">{account.vault_loan} gold</strong></p>
      <form method="post" action="/adr/vault/repay" class="adr-form-inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="number" name="amount" placeholder="Repay amount" min="1" class="adr-input" />
        <button type="submit" class="btn btn-warning btn-sm adr-btn">Repay</button>
      </form>
      {{{ else }}}
      <form method="post" action="/adr/vault/loan" class="adr-form-inline">
        <input type="hidden" name="_csrf" value="{config.csrf_token}" />
        <input type="number" name="amount" placeholder="Borrow amount" min="1" max="{config.loan_max_sum}" class="adr-input" />
        <button type="submit" class="btn btn-warning btn-sm adr-btn">Take Loan</button>
      </form>
      {{{ end }}}
    </div>
    {{{ end }}}

    {{{ if config.stock_use }}}
    <div class="adr-panel adr-vault-stocks">
      <h3><i class="fa fa-chart-line"></i> Stock Market</h3>
      {{{ if stocks.length }}}
      <div class="adr-table-wrap">
        <table class="adr-table">
          <thead><tr><th>Stock</th><th>Price</th><th>You Own</th><th>Buy</th><th>Sell</th></tr></thead>
          <tbody>
            {{{ each stocks }}}
            <tr>
              <td>{stocks.stock_name}</td>
              <td class="adr-gold">{stocks.stock_price}</td>
              <td>{stocks.userShares}</td>
              <td>
                <form method="post" action="/adr/vault/stock/buy" class="adr-form-inline">
                  <input type="hidden" name="_csrf" value="{config.csrf_token}" />
                  <input type="hidden" name="stockId" value="{stocks.stock_id}" />
                  <input type="number" name="amount" min="1" value="1" class="adr-input adr-input-xs" />
                  <button type="submit" class="btn btn-xs btn-success adr-btn">Buy</button>
                </form>
              </td>
              <td>
                {{{ if stocks.userShares }}}
                <form method="post" action="/adr/vault/stock/sell" class="adr-form-inline">
                  <input type="hidden" name="_csrf" value="{config.csrf_token}" />
                  <input type="hidden" name="stockId" value="{stocks.stock_id}" />
                  <input type="number" name="amount" min="1" max="{stocks.userShares}" value="1" class="adr-input adr-input-xs" />
                  <button type="submit" class="btn btn-xs btn-danger adr-btn">Sell</button>
                </form>
                {{{ end }}}
              </td>
            </tr>
            {{{ end }}}
          </tbody>
        </table>
      </div>
      {{{ else }}}
      <p class="adr-muted">No stocks available.</p>
      {{{ end }}}
    </div>
    {{{ end }}}
  </div>
</div>
