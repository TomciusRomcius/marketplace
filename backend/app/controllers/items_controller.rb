class ItemsController < ApplicationController
  def index
    search_text = params[:search_text]
    cursor_id = params[:cursor_id]
    query = Item.item_listed
      .order(id: :asc)
    if search_text
      query = query.where("title ILIKE ?", "%#{search_text}%")
    end
    query = cursor_id != nil ? query.where("id > ?", cursor_id) : query
    query = query.limit(10)
      .with_attached_item_photo
      .map do |item|
      photo = item.item_photo.first
      item.as_json.merge(
        image_url: photo ? url_for(photo) : nil
      )
    end
    render json: { items: query.to_a }, status: :ok
  end

  def mine
    render json: { items: Current.user.items.to_a }, status: :ok
  end
  
  def show
    id = params[:id]
    item = Item.with_attached_item_photo.find_by(id: id)
    unless item
      return render status: :not_found
    end

    if !item.item_listed? and Current.user.id != item.seller_id
      return head :forbidden
    end

    item_photos = item.item_photo.map do |photo|
      url_for(photo)
    end

    render json: {
      item: item.as_json.merge(image_urls: item_photos),
    }, status: :ok
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