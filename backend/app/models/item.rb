class Item < ApplicationRecord
  enum :status, { archived: 0, listed: 1, sold: 2 }, prefix: :item
  belongs_to :seller, class_name: "User"
  has_many_attached :item_photo
  validates :title, presence: true, length: { minimum: 8, maximum: 64 }
  validates :description, presence: true, length: { minimum: 8, maximum: 255 }
  validates :price_cents, presence: true

  def human_status(status)
    I18n.t("activerecord.attributes.item.status.#{status}")
  end
end
