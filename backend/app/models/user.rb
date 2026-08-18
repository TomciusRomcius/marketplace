class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :items, foreign_key: :seller_id
  has_many :purchases
  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
