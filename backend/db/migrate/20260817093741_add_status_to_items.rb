class AddStatusToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :status, :integer, null: false, default: 1
  end
end
