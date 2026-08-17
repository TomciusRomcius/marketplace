class AddIndexToItems < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pg_trgm"
    add_index :items, :title, using: :gin, opclass: :gin_trgm_ops
  end
end
