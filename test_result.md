#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Full-stack e-commerce store for Vanya Handicrafts selling deity dresses (Poshak/Vastra for Laddu Gopal, Radha Krishna, Mata Rani, Shiv Parivar, Hanuman ji, Ganesh ji) and handmade antiques (brass idols, wooden puja items). Devotional palette (saffron/maroon/gold/cream). MVP Phase 1: beautiful storefront (Home, Shop with filters, Product detail, Cart, Contact, About, Deity pages), no live payments yet, English only (Hindi toggle in a follow-up). Sample products seeded.

backend:
  - task: "Product catalog API with filters (deity, category, price, sort)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Implemented GET /api/products with filters: deity, category, priceMin, priceMax, bestSeller=true, isNew=true, search, sort (popular/newest/price-asc/price-desc). Seeds 18 sample products into MongoDB on first call."
      - working: true
        agent: "testing"
        comment: "✅ ALL TESTS PASSED. Verified: (1) GET /api/products returns 18 products with auto-seed, (2) deity filter (laddu-gopal) returns exactly 3 products, (3) category filter (antiques) returns exactly 3 products, (4) bestSeller filter returns 7 products, (5) isNew filter returns 7 products, (6) price range filter (1000-2000) returns 6 products correctly, (7) sort=price-asc and sort=price-desc work correctly, (8) search for 'laddu' returns 3 matching products. No MongoDB _id leakage detected. All filters and sorting working perfectly."

  - task: "Product detail with related products"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/products/:id returns product plus up to 4 related products (same deity or category)."
      - working: true
        agent: "testing"
        comment: "✅ PASSED. GET /api/products/p001 returns correct product with id='p001' and related array with 4 products. GET /api/products/nonexistent correctly returns 404 with error message. No MongoDB _id leakage in product or related products."

  - task: "Deities and Categories listing endpoints"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/deities and GET /api/categories return static reference data."
      - working: true
        agent: "testing"
        comment: "✅ PASSED. GET /api/deities returns 6 deities correctly. GET /api/categories returns 6 categories correctly. No MongoDB _id leakage detected."

  - task: "Contact form + newsletter subscription"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/contact and POST /api/newsletter persist submissions to MongoDB (contact_messages, newsletter collections)."
      - working: true
        agent: "testing"
        comment: "✅ PASSED. POST /api/contact successfully inserts contact message into MongoDB and returns success:true with UUID. POST /api/newsletter successfully inserts email into newsletter collection and returns success:true."

  - task: "Order placement (mock, no payment gateway yet)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/orders creates a pending order document in MongoDB with a VH- prefixed order ID. Payment gateway integration (Razorpay + PayPal) is Phase 2."
      - working: true
        agent: "testing"
        comment: "✅ PASSED. POST /api/orders successfully creates order with VH- prefixed ID (e.g., VH-MTV67FPJ), status='pending', and correctly stores all order data including items, customer, shipping, subtotal, and total."

frontend:
  - task: "Homepage with hero, deity tiles, best-sellers, festival banner, categories, antiques feature, new arrivals, testimonials, newsletter"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Shop page with filters (deity, category, price) and sort"
    implemented: true
    working: "NA"
    file: "/app/app/shop/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Product detail with gallery, size, quantity, add-to-cart, pincode delivery estimator, tabs"
    implemented: true
    working: "NA"
    file: "/app/app/product/[id]/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Cart with quantity edit, coupon codes (BLESSED10, DIWALI15), order summary"
    implemented: true
    working: "NA"
    file: "/app/app/cart/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false

  - task: "Deity landing pages, About, Contact"
    implemented: true
    working: "NA"
    file: "/app/app/deity/[slug]/page.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1

test_plan:
  current_focus:
    - "Product catalog API with filters (deity, category, price, sort)"
    - "Product detail with related products"
    - "Contact form + newsletter subscription"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Phase 2 complete. New endpoints to test: (1) GET /api/deity-meta/:slug for laddu-gopal, radha-krishna, mata-rani — each should return subcategories + collections arrays. (2) GET /api/products?subcategory=poshak&collection=luxe filters. (3) Admin flow: POST /api/admin/login with {password: 'vanya-admin-2025'} should return {success:true, token}. Wrong password returns 401. (4) All /api/admin/* routes require Authorization: Bearer <token>. Without header returns 401. (5) With valid token: GET /api/admin/products (list all), POST /api/admin/products (create; requires name+price), PATCH /api/admin/products/:id (toggle bestSeller/isNew), DELETE /api/admin/products/:id. (6) Coupons: POST /api/admin/coupons {code, discountPct, minCartValue}, GET /api/admin/coupons, PATCH /api/admin/coupons/:CODE {active}, DELETE /api/admin/coupons/:CODE. Also public: GET /api/coupons/:CODE returns {valid, coupon} for cart validation. (7) POST /api/admin/upload with multipart form-data file field (JPG/PNG/WEBP up to 6MB) should return {url:'/uploads/<uuid>.<ext>'}. Files saved to /app/public/uploads/. Existing Phase 1 endpoints should still pass. Catalog grew from 18 to ~55 products with new radha-krishna and mata-rani products. Do NOT test frontend."
  - agent: "testing"
    message: "✅ BACKEND TESTING COMPLETE - ALL 17 TESTS PASSED (100% success rate). Tested all endpoints as requested: health check, deities (6), categories (6), products catalog (18 with auto-seed), all filters (deity, category, bestSeller, isNew, price range), sorting (price-asc, price-desc), search, product detail with related products, 404 handling, contact form, newsletter subscription, and order placement with VH- prefix. All filters work correctly, no MongoDB _id leakage detected, proper HTTP status codes returned. Backend APIs are production-ready for Phase 1."
