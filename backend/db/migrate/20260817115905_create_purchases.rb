class CreatePurchases < ActiveRecord::Migration[8.1]
  def change
    create_table :purchases do |t|
      t.integer :amount_cents, null: false
      t.references :buyer, null: false, foreign_key: { to_table: :users }
      t.references :item, null: false, foreign_key: true, index: { unique: true }

      t.timestamps
    end
  end
end
