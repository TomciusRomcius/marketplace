class Item < ApplicationRecord
  belongs_to :seller, class_name: "User"
  validates :title, presence: true, length: { minimum: 8, maximum: 64 }
  validates :description, presence: true, length: { minimum: 8, maximum: 255 }
  validates :price_cents, presence: true
end
