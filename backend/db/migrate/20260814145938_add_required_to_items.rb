class AddRequiredToItems < ActiveRecord::Migration[8.1]
  def change
    change_column_null :items, :title, false
    change_column_null :items, :description, false
    change_column_null :items, :price_cents, false
  end
end
