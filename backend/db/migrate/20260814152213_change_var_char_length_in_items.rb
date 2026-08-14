class ChangeVarCharLengthInItems < ActiveRecord::Migration[8.1]
  def change
    change_column :items, :title, :string, limit: 64
    change_column :items, :description, :string, limit: 255
  end
end
