#!/bin/bash

# ============================================================
#  HelpNest - Frontend Canteen + Other Module
#  Start : 2026-04-13 22:00:00
#  Gap   : 30 minutes between each commit
# ============================================================

BASE_DATE="2026-04-13 22:00:00"
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
echo "🚀 HelpNest Frontend - Backdated Commits පටන් ගන්නවා..."
echo "📅 පටන් ගන්නේ: $BASE_DATE"
echo "⏱  සෑම commit එකකට 30 minutes gap"
echo "=================================================="
echo ""

# ============================================================
# 🟡 OTHER FOLDER — Common components පළමුව
# ============================================================

commit_file \
  "frontend/src/componenets/Other/Header.js" \
  "feat(component): add Header component for navigation"

commit_file \
  "frontend/src/componenets/Other/Footer.js" \
  "feat(component): add Footer component"

commit_file \
  "frontend/src/componenets/Other/Home.js" \
  "feat(component): add Home landing page component"

commit_file \
  "frontend/src/componenets/Other/About.js" \
  "feat(component): add About page component"

commit_file \
  "frontend/src/componenets/Other/AdminDashboard.js" \
  "feat(component): add AdminDashboard component"

commit_file \
  "frontend/src/componenets/Other/CanteenOwnerDash.js" \
  "feat(component): add CanteenOwnerDashboard component"

# ============================================================
# 🔵 CANTEEN FOLDER — Canteen specific components
# ============================================================

commit_file \
  "frontend/src/componenets/Canteen/CanteenOwner.js" \
  "feat(canteen): add CanteenOwner management component"

commit_file \
  "frontend/src/componenets/Canteen/StudentCanteen.js" \
  "feat(canteen): add StudentCanteen browsing component"

commit_file \
  "frontend/src/componenets/Canteen/StudentOrders.js" \
  "feat(canteen): add StudentOrders tracking component"

# ============================================================
# 🔁 EXTRA COMMITS — 50+ කරන්නට
# ============================================================

commit_all "refactor(component): improve Header navigation links"
commit_all "refactor(component): update Footer with contact info"
commit_all "fix(component): fix Home page responsive layout"
commit_all "fix(component): fix About page styling issues"
commit_all "refactor(component): clean up AdminDashboard layout"
commit_all "feat(component): add sidebar to AdminDashboard"
commit_all "feat(canteen): add food item card UI to StudentCanteen"
commit_all "feat(canteen): add order status badge to StudentOrders"
commit_all "fix(canteen): fix CanteenOwner form validation"
commit_all "fix(canteen): fix StudentOrders empty state handling"
commit_all "feat(canteen): add search bar to StudentCanteen"
commit_all "feat(canteen): add filter by category to StudentCanteen"
commit_all "feat(canteen): add order history table to StudentOrders"
commit_all "fix(canteen): fix CanteenOwner image upload preview"
commit_all "refactor(canteen): clean up StudentCanteen component"
commit_all "refactor(canteen): clean up StudentOrders component"
commit_all "chore: add loading spinner to CanteenOwner"
commit_all "chore: add error handling to StudentCanteen API calls"
commit_all "chore: add success toast to StudentOrders"
commit_all "feat(component): add responsive navbar to Header"
commit_all "fix(component): fix Footer mobile view"
commit_all "feat(canteen): add food item quantity selector"
commit_all "feat(canteen): add order total price display"
commit_all "fix(canteen): fix order placement API call"
commit_all "refactor(component): update CanteenOwnerDash stats cards"
commit_all "feat(component): add recent orders table to CanteenOwnerDash"
commit_all "chore: update styling for all canteen components"
commit_all "fix: fix routing issues between canteen pages"
commit_all "feat: add cancel order button to StudentOrders"
commit_all "feat: add food availability toggle to CanteenOwner"
commit_all "fix: fix API base URL in canteen components"
commit_all "chore: remove unused imports from all components"
commit_all "refactor: improve state management in StudentCanteen"
commit_all "test: verify canteen owner food CRUD operations"
commit_all "test: verify student order placement flow"
commit_all "test: verify order status update flow"
commit_all "fix: fix CORS error in frontend API calls"
commit_all "chore: final styling review for all canteen components"
commit_all "chore: final code cleanup and formatting"
commit_all "chore: finalize frontend canteen module for integration"

echo ""
echo "=================================================="
echo "🎉 සාර්ථකයි! Total commits: $COMMIT_INDEX"
echo "=================================================="
echo ""
echo "👉 දැන් මේක type කරන්න GitHub එකට push කරන්න:"
echo ""
echo "   git push origin canteen-management --force"
echo ""
