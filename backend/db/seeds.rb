# frozen_string_literal: true

require "open-uri"

puts "Seeding marketplace…"

seller = User.find_or_create_by!(email_address: "seller@example.com") do |user|
  user.password = "password123"
end

# Re-seed products for a clean, repeatable dataset.
seller.items.find_each do |item|
  item.item_photo.purge
  item.destroy!
end

PRODUCTS = [
  {
    title: "Vintage Leather Jacket",
    description: "Soft brown leather jacket with classic cut. Light wear, fully lined, fits medium.",
    price_cents: 12_500
  },
  {
    title: "Wireless Noise Cancelling Headphones",
    description: "Over-ear Bluetooth headphones with long battery life and clear everyday sound.",
    price_cents: 8_999
  },
  {
    title: "Ceramic Pour Over Coffee Set",
    description: "Hand-finished dripper and mug set. Ideal for a calm morning coffee ritual.",
    price_cents: 4_200
  },
  {
    title: "Mechanical Keyboard RGB",
    description: "Hot-swap mechanical keyboard with tactile switches and customizable RGB lighting.",
    price_cents: 11_499
  },
  {
    title: "Minimal Oak Desk Lamp",
    description: "Warm LED desk lamp with adjustable arm and solid oak base for home offices.",
    price_cents: 5_750
  },
  {
    title: "Trail Running Shoes Size 42",
    description: "Grip-ready trail shoes with cushioned midsole. Used for a few light hikes only.",
    price_cents: 6_800
  },
  {
    title: "Polaroid Instant Camera",
    description: "Classic instant camera with fresh film pack included. Fun for parties and travel.",
    price_cents: 7_250
  },
  {
    title: "Handmade Ceramic Plant Pot",
    description: "Speckled stoneware planter with drainage hole. Fits medium indoor houseplants.",
    price_cents: 2_400
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Compact waterproof speaker with punchy bass and twelve-hour playtime.",
    price_cents: 3_999
  },
  {
    title: "Wool Throw Blanket Cream",
    description: "Soft cream wool throw for sofa or bed. Breathable weave and fringed edges.",
    price_cents: 4_850
  },
  {
    title: "Stainless Steel Water Bottle",
    description: "Insulated 750ml bottle keeps drinks cold for hours. Scratch-resistant finish.",
    price_cents: 1_899
  },
  {
    title: "Bamboo Cutting Board Set",
    description: "Three nested bamboo boards with juice grooves. Kitchen-ready and easy to clean.",
    price_cents: 2_750
  },
  {
    title: "Retro Vinyl Record Player",
    description: "Belt-drive turntable with built-in speakers. Plays 33 and 45 RPM records.",
    price_cents: 9_500
  },
  {
    title: "Canvas Weekender Travel Bag",
    description: "Rugged canvas duffel with leather accents. Spacious main compartment and pocket.",
    price_cents: 6_200
  },
  {
    title: "Smart Fitness Watch Black",
    description: "Tracks steps, heart rate, and sleep. Water resistant with a week of battery life.",
    price_cents: 10_999
  },
  {
    title: "Cast Iron Skillet 12 Inch",
    description: "Pre-seasoned cast iron skillet for stovetop and oven. Even heat for searing.",
    price_cents: 3_450
  },
  {
    title: "Linen Bedding Set Queen",
    description: "Breathable stonewashed linen duvet cover and two pillowcases in soft sage.",
    price_cents: 8_200
  },
  {
    title: "Cordless Handheld Vacuum",
    description: "Lightweight stick vacuum for quick cleanups. Includes crevice and brush tools.",
    price_cents: 7_800
  },
  {
    title: "Acrylic Desk Organizer Set",
    description: "Clear acrylic trays and pen cups to tidy your workspace without visual clutter.",
    price_cents: 2_150
  },
  {
    title: "Insulated Picnic Cooler Bag",
    description: "Soft-sided cooler bag with shoulder strap. Keeps lunch and drinks chilled outdoors.",
    price_cents: 3_300
  },
  {
    title: "Matte Black Desk Chair",
    description: "Ergonomic office chair with lumbar support and smooth-rolling casters for daily work.",
    price_cents: 14_500
  },
  {
    title: "Espresso Machine Compact",
    description: "Home espresso maker with milk frother. Pulls rich shots for lattes and cappuccinos.",
    price_cents: 18_900
  },
  {
    title: "Leather Messenger Bag Tan",
    description: "Full-grain tan leather messenger with padded laptop sleeve and adjustable strap.",
    price_cents: 9_750
  },
  {
    title: "Wireless Charging Pad Duo",
    description: "Dual-device charging pad for phone and earbuds. Slim profile fits any nightstand.",
    price_cents: 3_600
  },
  {
    title: "Scented Candle Cedar Grove",
    description: "Soy wax candle with cedar and amber notes. Fifty-hour burn time in frosted glass.",
    price_cents: 2_200
  },
  {
    title: "Folding Camping Chair Blue",
    description: "Lightweight folding chair with cup holder. Packs into a carry bag for trips.",
    price_cents: 4_100
  },
  {
    title: "Glass Food Storage Set",
    description: "Eight-piece borosilicate glass containers with locking lids for fridge and oven.",
    price_cents: 3_850
  },
  {
    title: "Electric Standing Desk Frame",
    description: "Motorized height-adjustable desk frame with memory presets. Supports most tops.",
    price_cents: 22_000
  },
  {
    title: "Noise Machine White Noise",
    description: "Compact sleep sound machine with multiple ambient tracks and gentle night light.",
    price_cents: 2_950
  },
  {
    title: "Cotton Bath Towel Bundle",
    description: "Four plush cotton bath towels in charcoal. Absorbent, soft, and dryer friendly.",
    price_cents: 4_600
  },
  {
    title: "USB Desk Hub Multiport",
    description: "Aluminum USB-C hub with HDMI, SD, and USB-A ports for a cleaner laptop setup.",
    price_cents: 3_250
  },
  {
    title: "Outdoor String Lights 10m",
    description: "Weatherproof warm LED string lights for patio nights. Includes spare bulbs.",
    price_cents: 2_800
  },
  {
    title: "Stainless Cocktail Shaker",
    description: "Professional cocktail shaker set with jigger, strainer, and mixing spoon included.",
    price_cents: 2_450
  },
  {
    title: "Kids Balance Bike Wooden",
    description: "Wooden balance bike for toddlers learning to ride. Adjustable seat and rubber tires.",
    price_cents: 5_500
  },
  {
    title: "Wall Mirror Round Brass",
    description: "Sixty-centimeter round mirror with brushed brass frame. Ready to hang in any room.",
    price_cents: 6_750
  },
  {
    title: "Portable External SSD 1TB",
    description: "Fast USB-C solid state drive in a pocketable metal case. Ideal for backups on the go.",
    price_cents: 9_200
  },
  {
    title: "Herb Garden Starter Kit",
    description: "Indoor herb kit with basil, mint, and parsley seeds plus pots and soil discs.",
    price_cents: 1_750
  },
  {
    title: "Fleece Zip Hoodie Navy",
    description: "Midweight navy fleece hoodie with full zip and kangaroo pockets. Unisex medium.",
    price_cents: 3_900
  },
  {
    title: "Board Game Night Bundle",
    description: "Three popular party games in one bundle. Great for weekends with friends and family.",
    price_cents: 5_250
  },
  {
    title: "Robot Vacuum Slim Profile",
    description: "App-controlled robot vacuum with scheduled cleans and low-profile under-furniture fit.",
    price_cents: 16_800
  }
].freeze

PRODUCTS.each_with_index do |attrs, index|
  item = seller.items.create!(
    title: attrs[:title],
    description: attrs[:description],
    price_cents: attrs[:price_cents]
  )

  6.times do |photo_index|
    image_url = "https://picsum.photos/seed/marketplace-#{index + 1}-#{photo_index + 1}/600/600"
    image_data = URI.open(image_url, redirect: true).read
    item.item_photo.attach(
      io: StringIO.new(image_data),
      filename: "product-#{index + 1}-#{photo_index + 1}.jpg",
      content_type: "image/jpeg"
    )
  end

  puts "  created ##{item.id} #{item.title}"
end

puts "Done. Seller: seller@example.com / password123 (#{seller.items.count} items)"
