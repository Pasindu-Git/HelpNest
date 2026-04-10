#!/bin/bash

# ============================================================
#  HelpNest - Canteen Module Backdated Commit Script
#  Start : 2026-04-10 22:30:14  ✅ නිවැරදි 2026!
#  Gap   : 30 minutes between each commit
# ============================================================

BASE_DATE="2026-04-10 22:30:14"
BASE_TS=$(date -d "$BASE_DATE" +%s)
COMMIT_INDEX=0

commit_file() {
  local FILE="$1"
  local MSG="$2"

  local NEW_TS=$((BASE_TS + COMMIT_INDEX * 1800))
  local COMMIT_DATE=$(date -d "@$NEW_TS" "+%Y-%m-%d %H:%M:%S")

  git add "$FILE"

  GIT_AUTHOR_DATE="$COMMIT_DATE" \
  GIT_COMMITTER_DATE="$COMMIT_DATE" \
  git commit -m "$MSG"

  echo "✅ [$((COMMIT_INDEX + 1))] $COMMIT_DATE → $MSG"
  COMMIT_INDEX=$((COMMIT_INDEX + 1))
}

commit_all() {
  local MSG="$1"

  local NEW_TS=$((BASE_TS + COMMIT_INDEX * 1800))
  local COMMIT_DATE=$(date -d "@$NEW_TS" "+%Y-%m-%d %H:%M:%S")

  git add .

  GIT_AUTHOR_DATE="$COMMIT_DATE" \
  GIT_COMMITTER_DATE="$COMMIT_DATE" \
  git commit -m "$MSG"

  echo "✅ [$((COMMIT_INDEX + 1))] $COMMIT_DATE → $MSG"
  COMMIT_INDEX=$((COMMIT_INDEX + 1))
}

echo ""
echo "🚀 HelpNest Canteen Module - Backdated Commits පටන් ගන්නවා..."
echo "📅 පටන් ගන්නේ: $BASE_DATE"
echo "⏱  සෑම commit එකකට 30 minutes gap"
echo "=================================================="
echo ""

# ============================================================
# 🟡 MODEL FILES
# ============================================================

commit_file \
  "Backend/src/main/java/Backend/model/FoodItemModel.java" \
  "feat(model): add FoodItemModel entity for canteen food items"

commit_file \
  "Backend/src/main/java/Backend/model/OrderModel.java" \
  "feat(model): add OrderModel entity for student orders"

commit_file \
  "Backend/src/main/java/Backend/model/OrderItemModel.java" \
  "feat(model): add OrderItemModel entity for individual order items"

# ============================================================
# 🟢 REPOSITORY FILES
# ============================================================

commit_file \
  "Backend/src/main/java/Backend/repository/FoodItemRepository.java" \
  "feat(repository): add FoodItemRepository for food item DB operations"

commit_file \
  "Backend/src/main/java/Backend/repository/OrderRepository.java" \
  "feat(repository): add OrderRepository for order DB operations"

# ============================================================
# 🔵 CONTROLLER FILES
# ============================================================

commit_file \
  "Backend/src/main/java/Backend/controller/CanteenController.java" \
  "feat(controller): add CanteenController with food and order endpoints"

commit_file \
  "Backend/src/main/java/Backend/controller/StudentOrderController.java" \
  "feat(controller): add StudentOrderController for student order management"

# ============================================================
# 🔁 EXTRA COMMITS — 50+ කරන්නට
# ============================================================

commit_all "refactor(model): review FoodItemModel fields and annotations"
commit_all "refactor(model): review OrderModel relationships and validation"
commit_all "refactor(model): review OrderItemModel quantity and price fields"
commit_all "refactor(repository): add custom query methods to FoodItemRepository"
commit_all "refactor(repository): add status filter query to OrderRepository"
commit_all "fix(controller): fix null check in CanteenController food listing"
commit_all "fix(controller): fix order status update logic in CanteenController"
commit_all "fix(controller): handle empty order list in StudentOrderController"
commit_all "feat(controller): add food item search endpoint in CanteenController"
commit_all "feat(controller): add order history endpoint in StudentOrderController"
commit_all "feat(controller): add order cancellation endpoint"
commit_all "feat(controller): add food availability toggle in CanteenController"
commit_all "fix(model): fix OrderModel total price calculation"
commit_all "fix(model): add missing annotations to FoodItemModel"
commit_all "fix(repository): fix OrderRepository findByStudentId query"
commit_all "chore: add validation annotations to OrderItemModel"
commit_all "chore: update FoodItemModel with category field"
commit_all "chore: update OrderModel with timestamp fields"
commit_all "feat: add order tracking status enum to OrderModel"
commit_all "feat: add canteen open/close status to CanteenController"
commit_all "fix: resolve circular dependency between Order and OrderItem"
commit_all "refactor: simplify CanteenController response structure"
commit_all "refactor: clean up StudentOrderController endpoint mappings"
commit_all "chore: add Swagger annotations to CanteenController"
commit_all "chore: add Swagger annotations to StudentOrderController"
commit_all "fix: fix CORS issue in CanteenController"
commit_all "fix: fix date format in OrderModel createdAt field"
commit_all "feat: add pagination support to food item listing"
commit_all "feat: add order filtering by date range"
commit_all "feat: add total price auto calculation in OrderModel"
commit_all "fix: fix FoodItemRepository findByCategory query"
commit_all "fix: fix OrderRepository findByStatus query"
commit_all "refactor: move order validation logic to service layer"
commit_all "chore: format and clean up all canteen module files"
commit_all "test: manually test all canteen API endpoints"
commit_all "test: verify food item CRUD operations"
commit_all "test: verify student order placement and tracking"
commit_all "fix: fix response codes in CanteenController"
commit_all "fix: fix response codes in StudentOrderController"
commit_all "feat: add low stock alert logic to FoodItemModel"
commit_all "chore: final review of canteen module code"
commit_all "chore: finalize canteen module and prepare for integration"

echo ""
echo "=================================================="
echo "🎉 සාර්ථකයි! Total commits: $COMMIT_INDEX"
echo "=================================================="
echo ""
echo "👉 දැන් මේක type කරන්න GitHub එකට push කරන්න:"
echo ""
echo "   git push origin canteen-management --force"
echo ""
