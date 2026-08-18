require "test_helper"

class PurchasesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @purchase = purchases(:one)
  end

  test "should get index" do
    get purchases_url, as: :json
    assert_response :success
  end

  test "should create purchase" do
    assert_difference("Purchase.count") do
      post purchases_url, params: { purchase: { amount_cents: @purchase.amount_cents, buyer_id: @purchase.buyer_id, item_id: @purchase.item_id } }, as: :json
    end

    assert_response :created
  end

  test "should show purchase" do
    get purchase_url(@purchase), as: :json
    assert_response :success
  end

  test "should update purchase" do
    patch purchase_url(@purchase), params: { purchase: { amount_cents: @purchase.amount_cents, buyer_id: @purchase.buyer_id, item_id: @purchase.item_id } }, as: :json
    assert_response :success
  end

  test "should destroy purchase" do
    assert_difference("Purchase.count", -1) do
      delete purchase_url(@purchase), as: :json
    end

    assert_response :no_content
  end
end
