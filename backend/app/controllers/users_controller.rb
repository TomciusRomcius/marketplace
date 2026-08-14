class UsersController < ApplicationController
  def create
    user_params = params.expect(:email_address, :password)
    user = User.create(user_params)
    if user.save
      render status: :created
    else
      render json: { errors: user.errors }, status: :unproccesable_entity
    end
  end
end
