class UsersController < ApplicationController
  allow_unauthenticated_access only: :create

  def create
    user_params = params.permit(:email_address, :password)
    user = User.new(user_params)
    if user.save
      render status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end
end
