#!/usr/bin/env python3
"""
Backend API Tests for Vanya Handicrafts E-commerce
Tests all endpoints in /app/app/api/[[...path]]/route.js
"""

import requests
import json
import sys
from typing import Dict, Any

# Base URL from environment
BASE_URL = "https://deity-crafts.preview.emergentagent.com/api"

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

def test_health_check():
    """Test GET /api/ → { message, version }"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'message' in data and
            'version' in data and
            data['version'] == '1.0'
        )
        
        details = f"Status: {response.status_code}, Data: {data}"
        return print_test("GET /api/ (health check)", passed, details)
    except Exception as e:
        return print_test("GET /api/ (health check)", False, f"Error: {str(e)}")

def test_get_deities():
    """Test GET /api/deities → { deities: [...] } (6 deities)"""
    try:
        response = requests.get(f"{BASE_URL}/deities", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'deities' in data and
            isinstance(data['deities'], list) and
            len(data['deities']) == 6
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('deities', []))}"
        if passed:
            # Verify no MongoDB _id leakage
            for deity in data['deities']:
                if '_id' in deity:
                    passed = False
                    details += " | ERROR: MongoDB _id found in response"
                    break
        
        return print_test("GET /api/deities (6 deities)", passed, details)
    except Exception as e:
        return print_test("GET /api/deities (6 deities)", False, f"Error: {str(e)}")

def test_get_categories():
    """Test GET /api/categories → { categories: [...] } (6 categories)"""
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'categories' in data and
            isinstance(data['categories'], list) and
            len(data['categories']) == 6
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('categories', []))}"
        if passed:
            # Verify no MongoDB _id leakage
            for category in data['categories']:
                if '_id' in category:
                    passed = False
                    details += " | ERROR: MongoDB _id found in response"
                    break
        
        return print_test("GET /api/categories (6 categories)", passed, details)
    except Exception as e:
        return print_test("GET /api/categories (6 categories)", False, f"Error: {str(e)}")

def test_get_all_products():
    """Test GET /api/products → 18 products (triggers seed)"""
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'products' in data and
            isinstance(data['products'], list) and
            len(data['products']) == 18 and
            'total' in data and
            data['total'] == 18
        )
        
        details = f"Status: {response.status_code}, Count: {len(data.get('products', []))}, Total: {data.get('total')}"
        
        if passed:
            # Verify no MongoDB _id leakage
            for product in data['products']:
                if '_id' in product:
                    passed = False
                    details += " | ERROR: MongoDB _id found in response"
                    break
        
        return print_test("GET /api/products (18 products, auto-seed)", passed, details)
    except Exception as e:
        return print_test("GET /api/products (18 products, auto-seed)", False, f"Error: {str(e)}")

def test_filter_by_deity():
    """Test GET /api/products?deity=laddu-gopal → only Laddu Gopal products (should be 3)"""
    try:
        response = requests.get(f"{BASE_URL}/products?deity=laddu-gopal", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) == 3 and
            all(p.get('deity') == 'laddu-gopal' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if not passed and products:
            deities = [p.get('deity') for p in products]
            details += f" | Deities: {deities}"
        
        return print_test("GET /api/products?deity=laddu-gopal (3 products)", passed, details)
    except Exception as e:
        return print_test("GET /api/products?deity=laddu-gopal (3 products)", False, f"Error: {str(e)}")

def test_filter_by_category():
    """Test GET /api/products?category=antiques → antique products (should be 3)"""
    try:
        response = requests.get(f"{BASE_URL}/products?category=antiques", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) == 3 and
            all(p.get('category') == 'antiques' for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if not passed and products:
            categories = [p.get('category') for p in products]
            details += f" | Categories: {categories}"
        
        return print_test("GET /api/products?category=antiques (3 products)", passed, details)
    except Exception as e:
        return print_test("GET /api/products?category=antiques (3 products)", False, f"Error: {str(e)}")

def test_filter_bestsellers():
    """Test GET /api/products?bestSeller=true → bestsellers only"""
    try:
        response = requests.get(f"{BASE_URL}/products?bestSeller=true", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all(p.get('bestSeller') == True for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if not passed and products:
            bestsellers = [p.get('bestSeller') for p in products]
            details += f" | BestSeller flags: {bestsellers}"
        
        return print_test("GET /api/products?bestSeller=true", passed, details)
    except Exception as e:
        return print_test("GET /api/products?bestSeller=true", False, f"Error: {str(e)}")

def test_filter_new_arrivals():
    """Test GET /api/products?isNew=true → new arrivals only"""
    try:
        response = requests.get(f"{BASE_URL}/products?isNew=true", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all(p.get('isNew') == True for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if not passed and products:
            new_flags = [p.get('isNew') for p in products]
            details += f" | isNew flags: {new_flags}"
        
        return print_test("GET /api/products?isNew=true", passed, details)
    except Exception as e:
        return print_test("GET /api/products?isNew=true", False, f"Error: {str(e)}")

def test_filter_price_range():
    """Test GET /api/products?priceMin=1000&priceMax=2000 → in-range products"""
    try:
        response = requests.get(f"{BASE_URL}/products?priceMin=1000&priceMax=2000", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all(1000 <= p.get('price', 0) <= 2000 for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if not passed and products:
            prices = [p.get('price') for p in products]
            details += f" | Prices: {prices}"
        
        return print_test("GET /api/products?priceMin=1000&priceMax=2000", passed, details)
    except Exception as e:
        return print_test("GET /api/products?priceMin=1000&priceMax=2000", False, f"Error: {str(e)}")

def test_sort_price_asc():
    """Test GET /api/products?sort=price-asc → verify ascending order"""
    try:
        response = requests.get(f"{BASE_URL}/products?sort=price-asc", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        prices = [p.get('price', 0) for p in products]
        is_sorted = prices == sorted(prices)
        
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            is_sorted
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}, First 5 prices: {prices[:5]}"
        
        return print_test("GET /api/products?sort=price-asc", passed, details)
    except Exception as e:
        return print_test("GET /api/products?sort=price-asc", False, f"Error: {str(e)}")

def test_sort_price_desc():
    """Test GET /api/products?sort=price-desc → verify descending order"""
    try:
        response = requests.get(f"{BASE_URL}/products?sort=price-desc", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        prices = [p.get('price', 0) for p in products]
        is_sorted = prices == sorted(prices, reverse=True)
        
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            is_sorted
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}, First 5 prices: {prices[:5]}"
        
        return print_test("GET /api/products?sort=price-desc", passed, details)
    except Exception as e:
        return print_test("GET /api/products?sort=price-desc", False, f"Error: {str(e)}")

def test_search_products():
    """Test GET /api/products?search=laddu → search matches"""
    try:
        response = requests.get(f"{BASE_URL}/products?search=laddu", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = (
            response.status_code == 200 and
            len(products) > 0 and
            all('laddu' in p.get('name', '').lower() for p in products)
        )
        
        details = f"Status: {response.status_code}, Count: {len(products)}"
        if products:
            details += f" | First match: {products[0].get('name', 'N/A')[:50]}"
        
        return print_test("GET /api/products?search=laddu", passed, details)
    except Exception as e:
        return print_test("GET /api/products?search=laddu", False, f"Error: {str(e)}")

def test_get_product_by_id():
    """Test GET /api/products/p001 → returns single product + related array (up to 4)"""
    try:
        response = requests.get(f"{BASE_URL}/products/p001", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'product' in data and
            'related' in data and
            isinstance(data['product'], dict) and
            isinstance(data['related'], list) and
            len(data['related']) <= 4 and
            data['product'].get('id') == 'p001'
        )
        
        details = f"Status: {response.status_code}, Product ID: {data.get('product', {}).get('id')}, Related count: {len(data.get('related', []))}"
        
        if passed:
            # Verify no MongoDB _id leakage
            if '_id' in data['product']:
                passed = False
                details += " | ERROR: MongoDB _id found in product"
            for rel in data.get('related', []):
                if '_id' in rel:
                    passed = False
                    details += " | ERROR: MongoDB _id found in related products"
                    break
        
        return print_test("GET /api/products/p001 (single + related)", passed, details)
    except Exception as e:
        return print_test("GET /api/products/p001 (single + related)", False, f"Error: {str(e)}")

def test_get_nonexistent_product():
    """Test GET /api/products/nonexistent → 404"""
    try:
        response = requests.get(f"{BASE_URL}/products/nonexistent", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 404 and
            'error' in data
        )
        
        details = f"Status: {response.status_code}, Response: {data}"
        
        return print_test("GET /api/products/nonexistent (404)", passed, details)
    except Exception as e:
        return print_test("GET /api/products/nonexistent (404)", False, f"Error: {str(e)}")

def test_post_contact():
    """Test POST /api/contact with {name,email,message} → success:true and inserted into contact_messages"""
    try:
        payload = {
            "name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone": "+91-9876543210",
            "message": "I would like to know more about the Laddu Gopal poshak collection. Do you ship internationally?"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'id' in data
        )
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, ID: {data.get('id', 'N/A')}"
        
        return print_test("POST /api/contact (insert contact message)", passed, details)
    except Exception as e:
        return print_test("POST /api/contact (insert contact message)", False, f"Error: {str(e)}")

def test_post_newsletter():
    """Test POST /api/newsletter with {email} → success:true and inserted into newsletter"""
    try:
        payload = {
            "email": "rajesh.verma@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True
        )
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}"
        
        return print_test("POST /api/newsletter (subscribe)", passed, details)
    except Exception as e:
        return print_test("POST /api/newsletter (subscribe)", False, f"Error: {str(e)}")

def test_post_order():
    """Test POST /api/orders with items/customer/subtotal/total → returns order with VH- prefixed id"""
    try:
        payload = {
            "items": [
                {
                    "id": "p001",
                    "name": "Royal Red Silk Poshak for Laddu Gopal",
                    "price": 899,
                    "quantity": 2,
                    "size": "2"
                },
                {
                    "id": "p010",
                    "name": "Antique Brass Laddu Gopal Idol (4 inch)",
                    "price": 1899,
                    "quantity": 1,
                    "size": "4 inch"
                }
            ],
            "customer": {
                "name": "Anita Iyer",
                "email": "anita.iyer@example.com",
                "phone": "+91-9988776655"
            },
            "shipping": {
                "address": "123 MG Road, Koramangala",
                "city": "Bengaluru",
                "state": "Karnataka",
                "pincode": "560034"
            },
            "subtotal": 3697,
            "total": 3697,
            "paymentMethod": "cod"
        }
        
        response = requests.post(f"{BASE_URL}/orders", json=payload, timeout=10)
        data = response.json()
        
        order = data.get('order', {})
        order_id = order.get('id', '')
        
        passed = (
            response.status_code == 200 and
            data.get('success') == True and
            'order' in data and
            order_id.startswith('VH-') and
            order.get('status') == 'pending' and
            len(order.get('items', [])) == 2
        )
        
        details = f"Status: {response.status_code}, Success: {data.get('success')}, Order ID: {order_id}, Items: {len(order.get('items', []))}"
        
        return print_test("POST /api/orders (create order with VH- prefix)", passed, details)
    except Exception as e:
        return print_test("POST /api/orders (create order with VH- prefix)", False, f"Error: {str(e)}")

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Vanya Handicrafts Backend API Tests{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    results = []
    
    # Run all tests
    print(f"{Colors.YELLOW}Testing Health & Reference Data...{Colors.END}")
    results.append(test_health_check())
    results.append(test_get_deities())
    results.append(test_get_categories())
    
    print(f"\n{Colors.YELLOW}Testing Product Catalog...{Colors.END}")
    results.append(test_get_all_products())
    
    print(f"\n{Colors.YELLOW}Testing Product Filters...{Colors.END}")
    results.append(test_filter_by_deity())
    results.append(test_filter_by_category())
    results.append(test_filter_bestsellers())
    results.append(test_filter_new_arrivals())
    results.append(test_filter_price_range())
    
    print(f"\n{Colors.YELLOW}Testing Product Sorting...{Colors.END}")
    results.append(test_sort_price_asc())
    results.append(test_sort_price_desc())
    
    print(f"\n{Colors.YELLOW}Testing Product Search...{Colors.END}")
    results.append(test_search_products())
    
    print(f"\n{Colors.YELLOW}Testing Product Detail...{Colors.END}")
    results.append(test_get_product_by_id())
    results.append(test_get_nonexistent_product())
    
    print(f"\n{Colors.YELLOW}Testing Contact & Newsletter...{Colors.END}")
    results.append(test_post_contact())
    results.append(test_post_newsletter())
    
    print(f"\n{Colors.YELLOW}Testing Order Placement...{Colors.END}")
    results.append(test_post_order())
    
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
