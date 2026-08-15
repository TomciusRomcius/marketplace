class ItemPhotosController < ApplicationController
  def index
    item_id = params.expect(:item_id)
    item = Item.find(item_id)
    photos = item.item_photo.map do |p|
      {
        id: p.id,
        url: url_for(photo),
        content_type: photo.content_type
      }
    end
    render json: { photos: photos }
  end

  def create
    item = Current.user.items.find(params[:item_id])
    photos = params.require(:photos)
    if photos
      Array.wrap(photos).each { |p| item.item_photo.attach(p) }
    end
  end

  def update

  end

  def destroy

  end
end
