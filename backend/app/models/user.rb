class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :items, foreign_key: :seller_id
  has_many :purchases, foreign_key: :buyer_id
  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
