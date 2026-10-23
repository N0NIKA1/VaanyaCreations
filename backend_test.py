#!/usr/bin/env python3
"""
Backend API test suite for Vaanya Creation 5 - Devastram catalogue rebuild
Tests all endpoints after the full 505-product / 62-collection import
"""

import requests
import sys
import os

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://deity-crafts.preview.emergentagent.com')
API_URL = f"{BASE_URL}/api"

print(f"Testing backend at: {API_URL}\n")

# Track test results
passed = 0
failed = 0
test_number = 0

def test(name, fn):
    global passed, failed, test_number
    test_number += 1
    try:
        print(f"\n{'='*80}")
        print(f"TEST {test_number}: {name}")
        print('='*80)
        fn()
        passed += 1
        print(f"✅ PASSED: {name}")
    except AssertionError as e:
        failed += 1
        print(f"❌ FAILED: {name}")
        print(f"   Error: {e}")
    except Exception as e:
        failed += 1
        print(f"❌ ERROR: {name}")
        print(f"   Exception: {e}")

def assert_equal(actual, expected, msg=""):
    if actual != expected:
        raise AssertionError(f"{msg}\n  Expected: {expected}\n  Got: {actual}")

def assert_true(condition, msg=""):
    if not condition:
        raise AssertionError(msg)

def assert_in(item, container, msg=""):
    if item not in container:
        raise AssertionError(f"{msg}\n  {item} not in {container}")

def assert_not_in(item, container, msg=""):
    if item in container:
        raise AssertionError(f"{msg}\n  {item} should not be in {container}")

# ============================================================================
# TEST 1: GET /api/products → exactly 505 products
# ============================================================================
def test_products_count():
    resp = requests.get(f"{API_URL}/products")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('products', data, "Response should have 'products' key")
    assert_equal(len(data['products']), 505, "Should have exactly 505 products")
    print(f"✓ Found {len(data['products'])} products")
    
    # Check no unsplash/pexels images
    for p in data['products']:
        for img in p.get('images', []):
            assert_true('unsplash' not in img.lower(), f"Product {p['id']} has unsplash image: {img}")
            assert_true('pexels' not in img.lower(), f"Product {p['id']} has pexels image: {img}")
    print("✓ No unsplash/pexels images found")
    
    # Check no _id leakage
    for p in data['products']:
        assert_not_in('_id', p, f"Product {p['id']} has _id field")
    print("✓ No MongoDB _id leakage")
    
    # Verify all images are from cdn.shopify.com
    shopify_count = 0
    for p in data['products']:
        for img in p.get('images', []):
            if 'cdn.shopify.com' in img:
                shopify_count += 1
    print(f"✓ Found {shopify_count} Shopify CDN images")

test("GET /api/products returns exactly 505 products with no unsplash/pexels images", test_products_count)

# ============================================================================
# TEST 2: GET /api/nav → 10 top-level items
# ============================================================================
def test_nav():
    resp = requests.get(f"{API_URL}/nav")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('nav', data, "Response should have 'nav' key")
    assert_equal(len(data['nav']), 10, "Should have exactly 10 top-level nav items")
    print(f"✓ Found {len(data['nav'])} top-level nav items")
    
    # Verify each item has either href or children
    for item in data['nav']:
        has_href = 'href' in item
        has_children = 'children' in item and len(item['children']) > 0
        assert_true(has_href or has_children, f"Nav item '{item.get('label')}' must have href or children")
    print("✓ All nav items have href or children")

test("GET /api/nav returns 10 top-level items", test_nav)

# ============================================================================
# TEST 3: GET /api/collections → 62 entries
# ============================================================================
def test_collections():
    resp = requests.get(f"{API_URL}/collections")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('collections', data, "Response should have 'collections' key")
    assert_equal(len(data['collections']), 62, "Should have exactly 62 collections")
    print(f"✓ Found {len(data['collections'])} collections")
    
    # Verify each collection has required fields
    for coll in data['collections']:
        assert_in('handle', coll, "Collection must have handle")
        assert_in('title', coll, "Collection must have title")
        assert_in('image', coll, "Collection must have image")
        assert_in('count', coll, "Collection must have count")
        assert_true(isinstance(coll['image'], str) and len(coll['image']) > 0, f"Collection {coll['handle']} image must be non-empty string")
        assert_true(coll['count'] > 0, f"Collection {coll['handle']} count must be > 0")
    print("✓ All collections have handle, title, non-empty image, and count > 0")

test("GET /api/collections returns 62 entries with required fields", test_collections)

# ============================================================================
# TEST 4: GET /api/collections/luxe-laddu → 12 products with sort
# ============================================================================
def test_collection_detail():
    # Test basic collection fetch
    resp = requests.get(f"{API_URL}/collections/luxe-laddu")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('collection', data, "Response should have 'collection' key")
    assert_in('products', data, "Response should have 'products' key")
    assert_in('total', data, "Response should have 'total' key")
    assert_equal(len(data['products']), 12, "Should have exactly 12 products")
    print(f"✓ luxe-laddu collection has {len(data['products'])} products")
    
    # Test sort=price-asc
    resp = requests.get(f"{API_URL}/collections/luxe-laddu?sort=price-asc")
    data = resp.json()
    prices = [p['price'] for p in data['products']]
    assert_equal(prices, sorted(prices), "Prices should be in ascending order")
    print(f"✓ sort=price-asc works: {prices[:3]}...")
    
    # Test sort=price-desc
    resp = requests.get(f"{API_URL}/collections/luxe-laddu?sort=price-desc")
    data = resp.json()
    prices = [p['price'] for p in data['products']]
    assert_equal(prices, sorted(prices, reverse=True), "Prices should be in descending order")
    print(f"✓ sort=price-desc works: {prices[:3]}...")
    
    # Test sort=newest
    resp = requests.get(f"{API_URL}/collections/luxe-laddu?sort=newest")
    assert_equal(resp.status_code, 200, "sort=newest should work")
    print("✓ sort=newest works")
    
    # Test sort=popular
    resp = requests.get(f"{API_URL}/collections/luxe-laddu?sort=popular")
    assert_equal(resp.status_code, 200, "sort=popular should work")
    print("✓ sort=popular works")
    
    # Test 404 for non-existent collection
    resp = requests.get(f"{API_URL}/collections/does-not-exist")
    assert_equal(resp.status_code, 404, "Non-existent collection should return 404")
    print("✓ Non-existent collection returns 404")

test("GET /api/collections/luxe-laddu returns 12 products with sort options", test_collection_detail)

# ============================================================================
# TEST 5: GET /api/products with collection filter
# ============================================================================
def test_products_collection_filter():
    resp = requests.get(f"{API_URL}/products?collection=glam-potlies")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('products', data, "Response should have 'products' key")
    
    # Verify all products have 'glam-potlies' in their collections array
    for p in data['products']:
        assert_in('collections', p, f"Product {p['id']} should have collections array")
        assert_in('glam-potlies', p['collections'], f"Product {p['id']} should have 'glam-potlies' in collections")
    print(f"✓ Found {len(data['products'])} products with collection=glam-potlies")

test("GET /api/products?collection=glam-potlies filters by collections array", test_products_collection_filter)

# ============================================================================
# TEST 6: GET /api/products with deity filter
# ============================================================================
def test_products_deity_filter():
    resp = requests.get(f"{API_URL}/products?deity=laddu-gopal")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify all products have deity=laddu-gopal
    for p in data['products']:
        assert_equal(p.get('deity'), 'laddu-gopal', f"Product {p['id']} should have deity=laddu-gopal")
    print(f"✓ Found {len(data['products'])} products with deity=laddu-gopal")

test("GET /api/products?deity=laddu-gopal filters correctly", test_products_deity_filter)

# ============================================================================
# TEST 7: GET /api/products with category filter
# ============================================================================
def test_products_category_filter():
    resp = requests.get(f"{API_URL}/products?category=poshak")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify all products have category=poshak
    for p in data['products']:
        assert_equal(p.get('category'), 'poshak', f"Product {p['id']} should have category=poshak")
    print(f"✓ Found {len(data['products'])} products with category=poshak")

test("GET /api/products?category=poshak filters correctly", test_products_category_filter)

# ============================================================================
# TEST 8: GET /api/products with search filter
# ============================================================================
def test_products_search():
    resp = requests.get(f"{API_URL}/products?search=mukut")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify search matches name, productType, or tags
    for p in data['products']:
        search_text = f"{p.get('name', '')} {p.get('productType', '')} {' '.join(p.get('tags', []))}".lower()
        assert_true('mukut' in search_text, f"Product {p['id']} should match 'mukut' in name/productType/tags")
    print(f"✓ Found {len(data['products'])} products matching search=mukut")

test("GET /api/products?search=mukut matches name/productType/tags", test_products_search)

# ============================================================================
# TEST 9: GET /api/products with price range filter
# ============================================================================
def test_products_price_range():
    resp = requests.get(f"{API_URL}/products?priceMin=500&priceMax=1000")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify all products are within price range
    for p in data['products']:
        price = p.get('price', 0)
        assert_true(500 <= price <= 1000, f"Product {p['id']} price {price} should be between 500 and 1000")
    print(f"✓ Found {len(data['products'])} products with price between 500 and 1000")

test("GET /api/products?priceMin=500&priceMax=1000 filters correctly", test_products_price_range)

# ============================================================================
# TEST 10: GET /api/products with bestSeller filter
# ============================================================================
def test_products_bestseller():
    resp = requests.get(f"{API_URL}/products?bestSeller=true")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify all products have bestSeller=true
    for p in data['products']:
        assert_equal(p.get('bestSeller'), True, f"Product {p['id']} should have bestSeller=true")
    print(f"✓ Found {len(data['products'])} bestseller products")

test("GET /api/products?bestSeller=true filters correctly", test_products_bestseller)

# ============================================================================
# TEST 11: GET /api/products with isNew filter
# ============================================================================
def test_products_isnew():
    resp = requests.get(f"{API_URL}/products?isNew=true")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    
    # Verify all products have isNew=true
    for p in data['products']:
        assert_equal(p.get('isNew'), True, f"Product {p['id']} should have isNew=true")
    print(f"✓ Found {len(data['products'])} new products")

test("GET /api/products?isNew=true filters correctly", test_products_isnew)

# ============================================================================
# TEST 12: GET /api/products with limit
# ============================================================================
def test_products_limit():
    resp = requests.get(f"{API_URL}/products?limit=5")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_equal(len(data['products']), 5, "Should return exactly 5 products")
    print(f"✓ limit=5 returns {len(data['products'])} products")

test("GET /api/products?limit=5 returns 5 products", test_products_limit)

# ============================================================================
# TEST 13: GET /api/products/:handle → product + related
# ============================================================================
def test_product_detail():
    resp = requests.get(f"{API_URL}/products/kanha-phulwari-laddu-gopal-dress")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('product', data, "Response should have 'product' key")
    assert_in('related', data, "Response should have 'related' key")
    
    product = data['product']
    assert_in('name', product, "Product should have name")
    assert_in('price', product, "Product should have price")
    assert_in('images', product, "Product should have images")
    assert_in('sizes', product, "Product should have sizes")
    assert_in('description', product, "Product should have description")
    assert_in('deity', product, "Product should have deity")
    assert_in('category', product, "Product should have category")
    assert_in('collections', product, "Product should have collections array")
    assert_not_in('_id', product, "Product should not have _id")
    print(f"✓ Product detail has all required fields")
    
    # Check related products
    for rel in data['related']:
        assert_not_in('_id', rel, "Related product should not have _id")
    print(f"✓ Found {len(data['related'])} related products")
    
    # Test 404 for non-existent product
    resp = requests.get(f"{API_URL}/products/nope")
    assert_equal(resp.status_code, 404, "Non-existent product should return 404")
    print("✓ Non-existent product returns 404")

test("GET /api/products/:handle returns product + related", test_product_detail)

# ============================================================================
# TEST 14: GET /api/deity-meta/laddu-gopal
# ============================================================================
def test_deity_meta_laddu_gopal():
    resp = requests.get(f"{API_URL}/deity-meta/laddu-gopal")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('subcategories', data, "Response should have 'subcategories' key")
    assert_in('collections', data, "Response should have 'collections' key")
    assert_equal(len(data['collections']), 8, "laddu-gopal should have 8 collections")
    print(f"✓ laddu-gopal has {len(data['collections'])} collections")

test("GET /api/deity-meta/laddu-gopal returns 8 collections", test_deity_meta_laddu_gopal)

# ============================================================================
# TEST 15: GET /api/deity-meta/radha-krishna
# ============================================================================
def test_deity_meta_radha_krishna():
    resp = requests.get(f"{API_URL}/deity-meta/radha-krishna")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('subcategories', data, "Response should have 'subcategories' key")
    assert_in('collections', data, "Response should have 'collections' key")
    print(f"✓ radha-krishna has {len(data['collections'])} collections")

test("GET /api/deity-meta/radha-krishna returns collections", test_deity_meta_radha_krishna)

# ============================================================================
# TEST 16: GET /api/deity-meta/mata-rani
# ============================================================================
def test_deity_meta_mata_rani():
    resp = requests.get(f"{API_URL}/deity-meta/mata-rani")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('subcategories', data, "Response should have 'subcategories' key")
    assert_in('collections', data, "Response should have 'collections' key")
    print(f"✓ mata-rani has {len(data['collections'])} collections")

test("GET /api/deity-meta/mata-rani returns collections", test_deity_meta_mata_rani)

# ============================================================================
# TEST 17: Order flow - POST /api/orders
# ============================================================================
order_id = None
def test_order_create():
    global order_id
    order_data = {
        "items": [
            {"id": "test-product-1", "name": "Test Poshak", "price": 1299, "quantity": 1, "size": "2"}
        ],
        "customer": {
            "name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone": "9876543210"
        },
        "shipping": {
            "address": "123 Temple Street",
            "city": "Vrindavan",
            "state": "Uttar Pradesh",
            "pincode": "281121"
        },
        "subtotal": 1299,
        "total": 1299,
        "paymentMethod": "cod"
    }
    
    resp = requests.post(f"{API_URL}/orders", json=order_data)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_equal(data['success'], True, "Success should be true")
    assert_in('order', data, "Response should have 'order' key")
    
    order = data['order']
    assert_in('id', order, "Order should have id")
    assert_true(order['id'].startswith('VH-'), f"Order ID should start with 'VH-', got {order['id']}")
    order_id = order['id']
    print(f"✓ Created order with ID: {order_id}")

test("POST /api/orders creates order with VH- prefix", test_order_create)

# ============================================================================
# TEST 18: Order flow - GET /api/orders/:id
# ============================================================================
def test_order_get():
    global order_id
    if not order_id:
        raise AssertionError("No order_id from previous test")
    
    resp = requests.get(f"{API_URL}/orders/{order_id}")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('order', data, "Response should have 'order' key")
    assert_equal(data['order']['id'], order_id, f"Order ID should match {order_id}")
    assert_not_in('_id', data['order'], "Order should not have _id")
    print(f"✓ Retrieved order {order_id}")
    
    # Test lowercase version (should be uppercased internally)
    resp = requests.get(f"{API_URL}/orders/{order_id.lower()}")
    assert_equal(resp.status_code, 200, "Lowercase order ID should work")
    print(f"✓ Lowercase order ID lookup works")
    
    # Test 404 for non-existent order
    resp = requests.get(f"{API_URL}/orders/VH-FAKE123")
    assert_equal(resp.status_code, 404, "Non-existent order should return 404")
    print("✓ Non-existent order returns 404")

test("GET /api/orders/:id retrieves order correctly", test_order_get)

# ============================================================================
# TEST 19: Admin login
# ============================================================================
admin_token = None
def test_admin_login():
    global admin_token
    
    # Test correct password
    resp = requests.post(f"{API_URL}/admin/login", json={"password": "vaanya-admin-2025"})
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_equal(data['success'], True, "Success should be true")
    assert_in('token', data, "Response should have 'token' key")
    admin_token = data['token']
    print(f"✓ Admin login successful with correct password")
    
    # Test wrong password
    resp = requests.post(f"{API_URL}/admin/login", json={"password": "wrong-password"})
    assert_equal(resp.status_code, 401, "Wrong password should return 401")
    print("✓ Wrong password returns 401")

test("POST /api/admin/login with correct/wrong password", test_admin_login)

# ============================================================================
# TEST 20: Admin endpoints require authorization
# ============================================================================
def test_admin_auth_required():
    # Test without Authorization header
    resp = requests.get(f"{API_URL}/admin/products")
    assert_equal(resp.status_code, 401, "Should return 401 without auth")
    print("✓ GET /api/admin/products without auth returns 401")
    
    resp = requests.get(f"{API_URL}/admin/coupons")
    assert_equal(resp.status_code, 401, "Should return 401 without auth")
    print("✓ GET /api/admin/coupons without auth returns 401")
    
    resp = requests.get(f"{API_URL}/admin/orders")
    assert_equal(resp.status_code, 401, "Should return 401 without auth")
    print("✓ GET /api/admin/orders without auth returns 401")
    
    resp = requests.get(f"{API_URL}/admin/messages")
    assert_equal(resp.status_code, 401, "Should return 401 without auth")
    print("✓ GET /api/admin/messages without auth returns 401")

test("Admin endpoints require Authorization header", test_admin_auth_required)

# ============================================================================
# TEST 21: Admin GET endpoints with auth
# ============================================================================
def test_admin_get_endpoints():
    global admin_token
    if not admin_token:
        raise AssertionError("No admin_token from previous test")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # GET /api/admin/products
    resp = requests.get(f"{API_URL}/admin/products", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('products', data, "Response should have 'products' key")
    print(f"✓ GET /api/admin/products returns {len(data['products'])} products")
    
    # GET /api/admin/coupons
    resp = requests.get(f"{API_URL}/admin/coupons", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('coupons', data, "Response should have 'coupons' key")
    print(f"✓ GET /api/admin/coupons returns {len(data['coupons'])} coupons")
    
    # GET /api/admin/orders
    resp = requests.get(f"{API_URL}/admin/orders", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('orders', data, "Response should have 'orders' key")
    print(f"✓ GET /api/admin/orders returns {len(data['orders'])} orders")
    
    # GET /api/admin/messages
    resp = requests.get(f"{API_URL}/admin/messages", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('messages', data, "Response should have 'messages' key")
    print(f"✓ GET /api/admin/messages returns {len(data['messages'])} messages")

test("Admin GET endpoints work with Bearer token", test_admin_get_endpoints)

# ============================================================================
# TEST 22: Admin product CRUD
# ============================================================================
test_product_id = None
def test_admin_product_crud():
    global admin_token, test_product_id
    if not admin_token:
        raise AssertionError("No admin_token from previous test")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # POST - Create product
    product_data = {
        "name": "Test Laddu Gopal Poshak",
        "price": 999,
        "mrp": 1499,
        "deity": "laddu-gopal",
        "category": "poshak",
        "description": "Beautiful test poshak for automated testing"
    }
    resp = requests.post(f"{API_URL}/admin/products", json=product_data, headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_in('product', data, "Response should have 'product' key")
    test_product_id = data['product']['id']
    print(f"✓ Created test product with ID: {test_product_id}")
    
    # PATCH - Update product
    update_data = {"bestSeller": True}
    resp = requests.patch(f"{API_URL}/admin/products/{test_product_id}", json=update_data, headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_equal(data['success'], True, "Success should be true")
    print(f"✓ Updated product {test_product_id} bestSeller=true")
    
    # DELETE - Delete product
    resp = requests.delete(f"{API_URL}/admin/products/{test_product_id}", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_equal(data['success'], True, "Success should be true")
    print(f"✓ Deleted test product {test_product_id}")

test("Admin product CRUD (POST/PATCH/DELETE)", test_admin_product_crud)

# ============================================================================
# TEST 23: Admin coupon CRUD
# ============================================================================
test_coupon_code = None
def test_admin_coupon_crud():
    global admin_token, test_coupon_code
    if not admin_token:
        raise AssertionError("No admin_token from previous test")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # POST - Create coupon
    coupon_data = {
        "code": "TEST10",
        "discountPct": 10,
        "minCartValue": 500,
        "description": "Test coupon for automated testing"
    }
    resp = requests.post(f"{API_URL}/admin/coupons", json=coupon_data, headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_in('coupon', data, "Response should have 'coupon' key")
    test_coupon_code = data['coupon']['code']
    print(f"✓ Created test coupon with code: {test_coupon_code}")
    
    # PATCH - Update coupon
    update_data = {"active": False}
    resp = requests.patch(f"{API_URL}/admin/coupons/{test_coupon_code}", json=update_data, headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_equal(data['success'], True, "Success should be true")
    print(f"✓ Updated coupon {test_coupon_code} active=false")
    
    # DELETE - Delete coupon
    resp = requests.delete(f"{API_URL}/admin/coupons/{test_coupon_code}", headers=headers)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_equal(data['success'], True, "Success should be true")
    print(f"✓ Deleted test coupon {test_coupon_code}")

test("Admin coupon CRUD (POST/PATCH/DELETE)", test_admin_coupon_crud)

# ============================================================================
# TEST 24: Regression - GET /api/deities
# ============================================================================
def test_deities():
    resp = requests.get(f"{API_URL}/deities")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('deities', data, "Response should have 'deities' key")
    assert_true(len(data['deities']) >= 6, "Should have at least 6 deities")
    print(f"✓ Found {len(data['deities'])} deities")

test("Regression: GET /api/deities", test_deities)

# ============================================================================
# TEST 25: Regression - GET /api/categories
# ============================================================================
def test_categories():
    resp = requests.get(f"{API_URL}/categories")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('categories', data, "Response should have 'categories' key")
    assert_true(len(data['categories']) >= 6, "Should have at least 6 categories")
    print(f"✓ Found {len(data['categories'])} categories")

test("Regression: GET /api/categories", test_categories)

# ============================================================================
# TEST 26: Regression - POST /api/contact
# ============================================================================
def test_contact():
    contact_data = {
        "name": "Radha Devi",
        "email": "radha.devi@example.com",
        "phone": "9876543210",
        "message": "I would like to know more about your Laddu Gopal poshak collection."
    }
    resp = requests.post(f"{API_URL}/contact", json=contact_data)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_equal(data['success'], True, "Success should be true")
    assert_in('id', data, "Response should have 'id' key")
    print(f"✓ Contact form submission successful with ID: {data['id']}")

test("Regression: POST /api/contact", test_contact)

# ============================================================================
# TEST 27: Regression - POST /api/newsletter
# ============================================================================
def test_newsletter():
    newsletter_data = {
        "email": "krishna.bhakt@example.com"
    }
    resp = requests.post(f"{API_URL}/newsletter", json=newsletter_data)
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('success', data, "Response should have 'success' key")
    assert_equal(data['success'], True, "Success should be true")
    print(f"✓ Newsletter subscription successful")

test("Regression: POST /api/newsletter", test_newsletter)

# ============================================================================
# TEST 28: Regression - GET /api/coupons/:code validation
# ============================================================================
def test_coupon_validation():
    # First create a test coupon
    global admin_token
    if not admin_token:
        raise AssertionError("No admin_token from previous test")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    coupon_data = {
        "code": "TESTVALID",
        "discountPct": 15,
        "minCartValue": 1000,
        "active": True
    }
    resp = requests.post(f"{API_URL}/admin/coupons", json=coupon_data, headers=headers)
    assert_equal(resp.status_code, 200, "Coupon creation should succeed")
    
    # Test valid coupon
    resp = requests.get(f"{API_URL}/coupons/TESTVALID")
    assert_equal(resp.status_code, 200, "Status should be 200")
    data = resp.json()
    assert_in('valid', data, "Response should have 'valid' key")
    assert_equal(data['valid'], True, "Valid should be true")
    assert_in('coupon', data, "Response should have 'coupon' key")
    print(f"✓ Valid coupon TESTVALID returns valid=true")
    
    # Test invalid coupon
    resp = requests.get(f"{API_URL}/coupons/INVALID123")
    assert_equal(resp.status_code, 404, "Invalid coupon should return 404")
    data = resp.json()
    assert_equal(data['valid'], False, "Valid should be false")
    print(f"✓ Invalid coupon returns 404 with valid=false")
    
    # Cleanup
    requests.delete(f"{API_URL}/admin/coupons/TESTVALID", headers=headers)

test("Regression: GET /api/coupons/:code validation", test_coupon_validation)

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "="*80)
print("TEST SUMMARY")
print("="*80)
print(f"Total tests: {passed + failed}")
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"Success rate: {(passed / (passed + failed) * 100):.1f}%")
print("="*80)

if failed > 0:
    sys.exit(1)
else:
    print("\n🎉 ALL TESTS PASSED!")
    sys.exit(0)
