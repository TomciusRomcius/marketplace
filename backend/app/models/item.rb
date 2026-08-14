class Item < ApplicationRecord
  belongs_to :seller, class_name: "User"
  validates :title, presence: true
  validates :description, presence: true
  validates :price_cents, presence: true
end
