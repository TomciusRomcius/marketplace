Rails.application.routes.draw do
  post "/users", to: "users#create"
  resource :session
  resources :items
  resources :item_photos, only: %i[index create destroy]
  resources :passwords, param: :token
  get "up" => "rails/health#show", as: :rails_health_check
end
