class PurchasesController < ApplicationController
  def index
    purchases = Current.user.purchases.includes(item: { item_photo_attachments: :blob})
    result = purchases.map do |p|
      p.as_json.merge({
        item: p.item.as_json.merge({
          image_url: p.item.item_photo.first ? url_for(p.item.item_photo.first) : nil
        })
      })
    end
    render json: result
  end

  def show
    purchase = Current.user.purchases.find_by(id: params.require(:purchase_id))
    render json: purchase
  end

  def create
    item_id = params.require(:item_id)
    item = Item.find_by(id: item_id)
    unless item
      render json: { message: "Item does not exist" }, status: :not_found
    end
    if Current.user.id == item.seller_id
      render json: { message: "You cannot buy the item you own" }, status: :bad_request
    end
    ActiveRecord::Base.transaction do
      item.update!(status: "sold")
      Purchase.create!(item: item, buyer: Current.user)
    end
    head :created
  end

  # PATCH/PUT /purchases/1
  def update
    if @purchase.update(purchase_params)
      render json: @purchase
    else
      render json: @purchase.errors, status: :unprocessable_content
    end
  end

  # DELETE /purchases/1
  def destroy
    purchase.destroy!
  end
end
