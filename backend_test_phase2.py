#!/usr/bin/env python3
"""
Backend API Tests for Vanya Handicrafts E-commerce - Phase 2
Tests all Phase-2 endpoints including deity-meta, admin auth, CRUD, coupons, and file upload
"""

import requests
import json
import sys
import io
from typing import Dict, Any

# Base URL from environment
BASE_URL = "https://deity-crafts.preview.emergentagent.com/api"
ADMIN_PASSWORD = "vanya-admin-2025"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✅ PASS{Colors.END}" if passed else f"{Colors.RED}❌ FAIL{Colors.END}"
    print(f"{status} | {name}")
    if details:
        print(f"     {details}")
    return passed

# Global variable to store admin token
admin_token = None
created_product_id = None
created_coupon_code = None

# ==================== DEITY META TESTS ====================

def test_deity_meta_laddu_gopal():
    """Test GET /api/deity-meta/laddu-gopal → {subcategories: [7], collections: [5]}"""
    try:
        response = requests.get(f"{BASE_URL}/deity-meta/laddu-gopal", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'subcategories' in data and
            'collections' in data and
            len(data['subcategories']) == 7 and
            len(data['collections']) == 5
        )
        
        details = f"Status: {response.status_code}, Subcategories: {len(data.get('subcategories', []))}, Collections: {len(data.get('collections', []))}"
        return print_test("GET /api/deity-meta/laddu-gopal (7 subcats, 5 collections)", passed, details)
    except Exception as e:
        return print_test("GET /api/deity-meta/laddu-gopal", False, f"Error: {str(e)}")

def test_deity_meta_radha_krishna():
    """Test GET /api/deity-meta/radha-krishna → {subcategories: [4], collections: [4]}"""
    try:
        response = requests.get(f"{BASE_URL}/deity-meta/radha-krishna", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'subcategories' in data and
            'collections' in data and
            len(data['subcategories']) == 4 and
            len(data['collections']) == 4
        )
        
        details = f"Status: {response.status_code}, Subcategories: {len(data.get('subcategories', []))}, Collections: {len(data.get('collections', []))}"
        return print_test("GET /api/deity-meta/radha-krishna (4 subcats, 4 collections)", passed, details)
    except Exception as e:
        return print_test("GET /api/deity-meta/radha-krishna", False, f"Error: {str(e)}")

def test_deity_meta_mata_rani():
    """Test GET /api/deity-meta/mata-rani → {subcategories: [4], collections: [5]}"""
    try:
        response = requests.get(f"{BASE_URL}/deity-meta/mata-rani", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'subcategories' in data and
            'collections' in data and
            len(data['subcategories']) == 4 and
            len(data['collections']) == 5
        )
        
        details = f"Status: {response.status_code}, Subcategories: {len(data.get('subcategories', []))}, Collections: {len(data.get('collections', []))}"
        return print_test("GET /api/deity-meta/mata-rani (4 subcats, 5 collections)", passed, details)
    except Exception as e:
        return print_test("GET /api/deity-meta/mata-rani", False, f"Error: {str(e)}")

def test_deity_meta_unknown():
    """Test GET /api/deity-meta/unknown-deity → empty arrays"""
    try:
        response = requests.get(f"{BASE_URL}/deity-meta/unknown-deity", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'subcategories' in data and
            'collections' in data and
            len(data['subcategories']) == 0 and
            len(data['collections']) == 0
        )
        
        details = f"Status: {response.status_code}, Subcategories: {len(data.get('subcategories', []))}, Collections: {len(data.get('collections', []))}"
        return print_test("GET /api/deity-meta/unknown-deity (empty arrays)", passed, details)
    except Exception as e:
        return print_test("GET /api/deity-meta/unknown-deity", False, f"Error: {str(e)}")

# ==================== PRODUCT FILTER TESTS ====================

def test_filter_radha_krishna():
    """Test GET /api/products?deity=radha-krishna → ~15 products"""
    try:
        response = requests.get(f"{BASE_URL}/products?deity=radha-krishna", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) >= 10 and
            len(products) <= 20 and
            all(p.get('deity') == 'radha-krishna' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        return print_test("GET /api/products?deity=radha-krishna (~15 products)", passed, details)
    except Exception as e:
        return print_test("GET /api/products?deity=radha-krishna", False, f"Error: {str(e)}")

def test_filter_mata_rani():
    """Test GET /api/products?deity=mata-rani → ~15 products"""
    try:
        response = requests.get(f"{BASE_URL}/products?deity=mata-rani", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) >= 10 and
            len(products) <= 20 and
            all(p.get('deity') == 'mata-rani' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        return print_test("GET /api/products?deity=mata-rani (~15 products)", passed, details)
    except Exception as e:
        return print_test("GET /api/products?deity=mata-rani", False, f"Error: {str(e)}")

def test_filter_subcategory_poshak():
    """Test GET /api/products?subcategory=poshak&deity=laddu-gopal → poshak-only"""
    try:
        response = requests.get(f"{BASE_URL}/products?subcategory=poshak&deity=laddu-gopal", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all(p.get('subcategory') == 'poshak' and p.get('deity') == 'laddu-gopal' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        return print_test("GET /api/products?subcategory=poshak&deity=laddu-gopal", passed, details)
    except Exception as e:
        return print_test("GET /api/products?subcategory=poshak&deity=laddu-gopal", False, f"Error: {str(e)}")

def test_filter_collection_luxe():
    """Test GET /api/products?collection=luxe → luxe collection products"""
    try:
        response = requests.get(f"{BASE_URL}/products?collection=luxe", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all(p.get('collection') == 'luxe' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        return print_test("GET /api/products?collection=luxe", passed, details)
    except Exception as e:
        return print_test("GET /api/products?collection=luxe", False, f"Error: {str(e)}")

# ==================== ADMIN AUTH TESTS ====================

def test_admin_login_success():
    """Test POST /api/admin/login with correct password → {success:true, token}"""
    global admin_token
    try:
        payload = {"password": ADMIN_PASSWORD}
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'token' in data and
            data['token'] == ADMIN_PASSWORD
        )
        
        if passed:
            admin_token = data['token']
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Token: {'Present' if 'token' in data else 'Missing'}"
        return print_test("POST /api/admin/login (correct password)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/login (correct password)", False, f"Error: {str(e)}")

def test_admin_login_failure():
    """Test POST /api/admin/login with wrong password → 401"""
    try:
        payload = {"password": "wrong-password"}
        response = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            'error' in data and
            data['error'] == 'Invalid password'
        )
        
        details = f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        return print_test("POST /api/admin/login (wrong password → 401)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/login (wrong password)", False, f"Error: {str(e)}")

# ==================== ADMIN PRODUCT CRUD TESTS ====================

def test_admin_products_no_auth():
    """Test GET /api/admin/products WITHOUT auth → 401"""
    try:
        response = requests.get(f"{BASE_URL}/admin/products", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            'error' in data and
            data['error'] == 'Unauthorized'
        )
        
        details = f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        return print_test("GET /api/admin/products (no auth → 401)", passed, details)
    except Exception as e:
        return print_test("GET /api/admin/products (no auth)", False, f"Error: {str(e)}")

def test_admin_products_with_auth():
    """Test GET /api/admin/products WITH auth → all products list"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/products", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'products' in data and
            'total' in data and
            isinstance(data['products'], list) and
            len(data['products']) > 0
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('products', []))}, Total: {data.get('total')}"
        return print_test("GET /api/admin/products (with auth)", passed, details)
    except Exception as e:
        return print_test("GET /api/admin/products (with auth)", False, f"Error: {str(e)}")

def test_admin_create_product():
    """Test POST /api/admin/products WITH auth → create product"""
    global created_product_id
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "name": "Test Radha Krishna Poshak",
            "price": 499,
            "mrp": 799,
            "deity": "laddu-gopal",
            "category": "dresses",
            "subcategory": "poshak",
            "collection": "designer",
            "fabric": "Silk",
            "color": "Blue",
            "description": "Test product for automated testing"
        }
        
        response = requests.post(f"{BASE_URL}/admin/products", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'product' in data and
            data['product'].get('name') == payload['name'] and
            data['product'].get('price') == payload['price']
        )
        
        if passed and 'product' in data:
            created_product_id = data['product'].get('id')
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Product ID: {created_product_id}"
        return print_test("POST /api/admin/products (create product)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/products (create product)", False, f"Error: {str(e)}")

def test_admin_update_product():
    """Test PATCH /api/admin/products/:id WITH auth → update product"""
    try:
        if not created_product_id:
            return print_test("PATCH /api/admin/products/:id (update)", False, "No product ID from create test")
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"bestSeller": True}
        
        response = requests.patch(f"{BASE_URL}/admin/products/{created_product_id}", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True
        )
        
        # Verify the update by fetching the product
        if passed:
            verify_response = requests.get(f"{BASE_URL}/products/{created_product_id}", timeout=10)
            verify_data = verify_response.json()
            if 'product' in verify_data:
                passed = verify_data['product'].get('bestSeller') == True
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Verified: {passed}"
        return print_test("PATCH /api/admin/products/:id (update bestSeller)", passed, details)
    except Exception as e:
        return print_test("PATCH /api/admin/products/:id (update)", False, f"Error: {str(e)}")

def test_admin_delete_product():
    """Test DELETE /api/admin/products/:id WITH auth → delete product"""
    try:
        if not created_product_id:
            return print_test("DELETE /api/admin/products/:id (delete)", False, "No product ID from create test")
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/products/{created_product_id}", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True
        )
        
        # Verify deletion by trying to fetch the product
        if passed:
            verify_response = requests.get(f"{BASE_URL}/products/{created_product_id}", timeout=10)
            passed = verify_response.status_code == 404
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Verified 404: {passed}"
        return print_test("DELETE /api/admin/products/:id (delete + verify 404)", passed, details)
    except Exception as e:
        return print_test("DELETE /api/admin/products/:id (delete)", False, f"Error: {str(e)}")

# ==================== COUPON TESTS ====================

def test_admin_create_coupon():
    """Test POST /api/admin/coupons WITH auth → create coupon"""
    global created_coupon_code
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "code": "TEST20",
            "discountPct": 20,
            "minCartValue": 500,
            "description": "Test coupon for automated testing"
        }
        
        response = requests.post(f"{BASE_URL}/admin/coupons", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'coupon' in data and
            data['coupon'].get('code') == payload['code']
        )
        
        if passed:
            created_coupon_code = data['coupon'].get('code')
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Code: {created_coupon_code}"
        return print_test("POST /api/admin/coupons (create coupon)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/coupons (create coupon)", False, f"Error: {str(e)}")

def test_admin_create_duplicate_coupon():
    """Test POST /api/admin/coupons with duplicate code → 409"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "code": "TEST20",
            "discountPct": 15,
            "minCartValue": 300,
            "description": "Duplicate test"
        }
        
        response = requests.post(f"{BASE_URL}/admin/coupons", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 409 and
            'error' in data
        )
        
        details = f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        return print_test("POST /api/admin/coupons (duplicate code → 409)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/coupons (duplicate)", False, f"Error: {str(e)}")

def test_public_validate_coupon():
    """Test GET /api/coupons/:code (public) → {valid:true, coupon:{...}}"""
    try:
        response = requests.get(f"{BASE_URL}/coupons/{created_coupon_code}", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('valid') == True and
            'coupon' in data and
            data['coupon'].get('code') == created_coupon_code
        )
        
        details = f"Status: {response.status_code}, Valid: {data.get('valid')}, Code: {data.get('coupon', {}).get('code')}"
        return print_test("GET /api/coupons/TEST20 (public validate)", passed, details)
    except Exception as e:
        return print_test("GET /api/coupons/TEST20 (public)", False, f"Error: {str(e)}")

def test_public_validate_nonexistent_coupon():
    """Test GET /api/coupons/NONEXISTENT → 404 {valid:false}"""
    try:
        response = requests.get(f"{BASE_URL}/coupons/NONEXISTENT", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 404 and
            data.get('valid') == False
        )
        
        details = f"Status: {response.status_code}, Valid: {data.get('valid')}"
        return print_test("GET /api/coupons/NONEXISTENT (404)", passed, details)
    except Exception as e:
        return print_test("GET /api/coupons/NONEXISTENT", False, f"Error: {str(e)}")

def test_admin_update_coupon():
    """Test PATCH /api/admin/coupons/:code WITH auth → update coupon"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"active": False}
        
        response = requests.patch(f"{BASE_URL}/admin/coupons/{created_coupon_code}", json=payload, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True
        )
        
        # Verify the coupon is now inactive (should return 404 for public endpoint)
        if passed:
            verify_response = requests.get(f"{BASE_URL}/coupons/{created_coupon_code}", timeout=10)
            passed = verify_response.status_code == 404
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Verified inactive: {passed}"
        return print_test("PATCH /api/admin/coupons/:code (deactivate)", passed, details)
    except Exception as e:
        return print_test("PATCH /api/admin/coupons/:code", False, f"Error: {str(e)}")

def test_admin_delete_coupon():
    """Test DELETE /api/admin/coupons/:code WITH auth → delete coupon"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(f"{BASE_URL}/admin/coupons/{created_coupon_code}", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True
        )
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}"
        return print_test("DELETE /api/admin/coupons/:code (delete)", passed, details)
    except Exception as e:
        return print_test("DELETE /api/admin/coupons/:code", False, f"Error: {str(e)}")

# ==================== FILE UPLOAD TESTS ====================

def test_admin_upload_no_auth():
    """Test POST /api/admin/upload without auth → 401"""
    try:
        # Create a small test image (1x1 pixel JPG)
        files = {'file': ('test.jpg', io.BytesIO(b'\xff\xd8\xff\xe0\x00\x10JFIF'), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/admin/upload", files=files, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            'error' in data
        )
        
        details = f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        return print_test("POST /api/admin/upload (no auth → 401)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/upload (no auth)", False, f"Error: {str(e)}")

def test_admin_upload_invalid_file():
    """Test POST /api/admin/upload with text file → 415"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        files = {'file': ('test.txt', io.BytesIO(b'test content'), 'text/plain')}
        response = requests.post(f"{BASE_URL}/admin/upload", files=files, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 415 and
            'error' in data
        )
        
        details = f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        return print_test("POST /api/admin/upload (text file → 415)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/upload (invalid file)", False, f"Error: {str(e)}")

def test_admin_upload_success():
    """Test POST /api/admin/upload with valid JPG → {success:true, url:'/uploads/...'}"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        # Create a minimal valid JPEG file
        jpeg_data = (
            b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
            b'\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c'
            b'\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c'
            b'\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00'
            b'\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00'
            b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01'
            b'\x01\x00\x00?\x00\x7f\xff\xd9'
        )
        files = {'file': ('test.jpg', io.BytesIO(jpeg_data), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/admin/upload", files=files, headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'url' in data and
            data['url'].startswith('/uploads/') and
            data['url'].endswith('.jpg')
        )
        
        # Verify the file is accessible
        if passed:
            file_url = f"https://deity-crafts.preview.emergentagent.com{data['url']}"
            verify_response = requests.get(file_url, timeout=10)
            passed = verify_response.status_code == 200 and 'image' in verify_response.headers.get('content-type', '')
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, URL: {data.get('url', 'N/A')}, Accessible: {passed}"
        return print_test("POST /api/admin/upload (valid JPG + verify)", passed, details)
    except Exception as e:
        return print_test("POST /api/admin/upload (valid JPG)", False, f"Error: {str(e)}")

# ==================== ADMIN ORDERS & MESSAGES TESTS ====================

def test_admin_get_orders():
    """Test GET /api/admin/orders WITH auth → orders list"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'orders' in data and
            isinstance(data['orders'], list)
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('orders', []))}"
        return print_test("GET /api/admin/orders (with auth)", passed, details)
    except Exception as e:
        return print_test("GET /api/admin/orders", False, f"Error: {str(e)}")

def test_admin_get_messages():
    """Test GET /api/admin/messages WITH auth → messages list"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/messages", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'messages' in data and
            isinstance(data['messages'], list)
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('messages', []))}"
        return print_test("GET /api/admin/messages (with auth)", passed, details)
    except Exception as e:
        return print_test("GET /api/admin/messages", False, f"Error: {str(e)}")

# ==================== PHASE-1 REGRESSION TESTS ====================

def test_regression_health():
    """Regression: GET /api/ → health check"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        data = response.json()
        passed = response.status_code == 200 and 'message' in data and 'version' in data
        details = f"Status: {response.status_code}, Version: {data.get('version')}"
        return print_test("REGRESSION: GET /api/ (health)", passed, details)
    except Exception as e:
        return print_test("REGRESSION: GET /api/", False, f"Error: {str(e)}")

def test_regression_deities():
    """Regression: GET /api/deities → 6 deities"""
    try:
        response = requests.get(f"{BASE_URL}/deities", timeout=10)
        data = response.json()
        passed = response.status_code == 200 and len(data.get('deities', [])) == 6
        details = f"Status: {response.status_code}, Count: {len(data.get('deities', []))}"
        return print_test("REGRESSION: GET /api/deities (6)", passed, details)
    except Exception as e:
        return print_test("REGRESSION: GET /api/deities", False, f"Error: {str(e)}")

def test_regression_categories():
    """Regression: GET /api/categories → 6 categories"""
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        data = response.json()
        passed = response.status_code == 200 and len(data.get('categories', [])) == 6
        details = f"Status: {response.status_code}, Count: {len(data.get('categories', []))}"
        return print_test("REGRESSION: GET /api/categories (6)", passed, details)
    except Exception as e:
        return print_test("REGRESSION: GET /api/categories", False, f"Error: {str(e)}")

def test_regression_products():
    """Regression: GET /api/products → >50 total products"""
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        passed = response.status_code == 200 and len(data.get('products', [])) > 50
        details = f"Status: {response.status_code}, Count: {len(data.get('products', []))}"
        return print_test("REGRESSION: GET /api/products (>50)", passed, details)
    except Exception as e:
        return print_test("REGRESSION: GET /api/products", False, f"Error: {str(e)}")

def test_regression_contact():
    """Regression: POST /api/contact → success"""
    try:
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91-9999999999",
            "message": "Regression test message"
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        passed = response.status_code == 200 and data.get('success') == True
        details = f"Status: {response.status_code}, Success: {data.get('success')}"
        return print_test("REGRESSION: POST /api/contact", passed, details)
    except Exception as e:
        return print_test("REGRESSION: POST /api/contact", False, f"Error: {str(e)}")

def test_regression_newsletter():
    """Regression: POST /api/newsletter → success"""
    try:
        payload = {"email": "regression@example.com"}
        response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
        data = response.json()
        passed = response.status_code == 200 and data.get('success') == True
        details = f"Status: {response.status_code}, Success: {data.get('success')}"
        return print_test("REGRESSION: POST /api/newsletter", passed, details)
    except Exception as e:
        return print_test("REGRESSION: POST /api/newsletter", False, f"Error: {str(e)}")

def test_regression_orders():
    """Regression: POST /api/orders → VH- prefix"""
    try:
        payload = {
            "items": [{"id": "lg001", "name": "Test", "price": 100, "quantity": 1}],
            "customer": {"name": "Test", "email": "test@example.com", "phone": "1234567890"},
            "shipping": {"address": "Test", "city": "Test", "state": "Test", "pincode": "123456"},
            "subtotal": 100,
            "total": 100,
            "paymentMethod": "cod"
        }
        response = requests.post(f"{BASE_URL}/orders", json=payload, timeout=10)
        data = response.json()
        passed = response.status_code == 200 and data.get('order', {}).get('id', '').startswith('VH-')
        details = f"Status: {response.status_code}, Order ID: {data.get('order', {}).get('id')}"
        return print_test("REGRESSION: POST /api/orders (VH- prefix)", passed, details)
    except Exception as e:
        return print_test("REGRESSION: POST /api/orders", False, f"Error: {str(e)}")

# ==================== MAIN TEST RUNNER ====================

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Vanya Handicrafts Backend API Tests - Phase 2{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    results = []
    
    # Phase 2: Deity Meta Tests
    print(f"{Colors.YELLOW}Testing Deity Meta Endpoints...{Colors.END}")
    results.append(test_deity_meta_laddu_gopal())
    results.append(test_deity_meta_radha_krishna())
    results.append(test_deity_meta_mata_rani())
    results.append(test_deity_meta_unknown())
    
    # Phase 2: Product Filter Tests
    print(f"\n{Colors.YELLOW}Testing Phase-2 Product Filters...{Colors.END}")
    results.append(test_filter_radha_krishna())
    results.append(test_filter_mata_rani())
    results.append(test_filter_subcategory_poshak())
    results.append(test_filter_collection_luxe())
    
    # Phase 2: Admin Auth Tests
    print(f"\n{Colors.YELLOW}Testing Admin Authentication...{Colors.END}")
    results.append(test_admin_login_success())
    results.append(test_admin_login_failure())
    
    # Phase 2: Admin Product CRUD Tests
    print(f"\n{Colors.YELLOW}Testing Admin Product CRUD...{Colors.END}")
    results.append(test_admin_products_no_auth())
    results.append(test_admin_products_with_auth())
    results.append(test_admin_create_product())
    results.append(test_admin_update_product())
    results.append(test_admin_delete_product())
    
    # Phase 2: Coupon Tests
    print(f"\n{Colors.YELLOW}Testing Coupon Management...{Colors.END}")
    results.append(test_admin_create_coupon())
    results.append(test_admin_create_duplicate_coupon())
    results.append(test_public_validate_coupon())
    results.append(test_public_validate_nonexistent_coupon())
    results.append(test_admin_update_coupon())
    results.append(test_admin_delete_coupon())
    
    # Phase 2: File Upload Tests
    print(f"\n{Colors.YELLOW}Testing File Upload...{Colors.END}")
    results.append(test_admin_upload_no_auth())
    results.append(test_admin_upload_invalid_file())
    results.append(test_admin_upload_success())
    
    # Phase 2: Admin Orders & Messages
    print(f"\n{Colors.YELLOW}Testing Admin Orders & Messages...{Colors.END}")
    results.append(test_admin_get_orders())
    results.append(test_admin_get_messages())
    
    # Phase 1 Regression Tests
    print(f"\n{Colors.YELLOW}Running Phase-1 Regression Tests...{Colors.END}")
    results.append(test_regression_health())
    results.append(test_regression_deities())
    results.append(test_regression_categories())
    results.append(test_regression_products())
    results.append(test_regression_contact())
    results.append(test_regression_newsletter())
    results.append(test_regression_orders())
    
    # Summary
    passed_count = sum(results)
    total_count = len(results)
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Test Summary{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"Total Tests: {total_count}")
    print(f"{Colors.GREEN}Passed: {passed_count}{Colors.END}")
    print(f"{Colors.RED}Failed: {total_count - passed_count}{Colors.END}")
    print(f"Success Rate: {(passed_count/total_count)*100:.1f}%")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    # Exit with appropriate code
    sys.exit(0 if passed_count == total_count else 1)

if __name__ == "__main__":
    main()
