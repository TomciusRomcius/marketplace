Rails.application.routes.draw do
  post "/users", to: "users#create"
  resource :session
  resources :passwords, param: :token
  get "up" => "rails/health#show", as: :rails_health_check
end
