class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :title
      t.references :seller, null: false, foreign_key: { to_table: :users }
      t.string :description
      t.integer :price_cents

      t.timestamps
    end
  end
end
