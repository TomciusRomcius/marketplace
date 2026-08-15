class ItemsController < ApplicationController
  def index
    items = Item.limit(10).with_attached_item_photo.map do |item|
      photo = item.item_photo.first
      item.as_json.merge(
        image_url: photo ? url_for(photo) : nil
      )
    end
    render json: { items: items }, status: :ok
  end

  def mine
    render json: { items: Current.user.items.to_a }, status: :ok
  end
  
  def show
    id = params[:id]
    item = Item.find_by(id: id)
    if item
      render json: { item: item }, status: :ok
    else
      render status: :not_found
    end
  end

  def create
    item_params = params.permit(:title, :description, :price_cents)
    item = Item.create(item_params.merge(seller: Current.user))
    if item.save
      render json: { id: item.id }, status: :created
    else
      render json: { errors: item.errors }, status: :unprocessable_entity
    end
  end

  def update
    id = params.expect(:id)
    Current.user.items
      .where(id: id)
      .update_all(**params.permit(:title, :description, :price_cents))
  end

  def destroy
    item_id = params.expect(:id)
    affected_rows = Current.user.items.where(id: item_id).delete_all
    if affected_rows == 1
      head :no_content
    else
      head :not_found 
    end
  end
end
