class RemoveAmountCentsFromPurchase < ActiveRecord::Migration[8.1]
  def change
    remove_column :purchases, :amount_cents
  end
end
