class ApplicationController < ActionController::API
  include Authentication
  include ActionController::Cookies
end
