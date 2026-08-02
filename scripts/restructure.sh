#!/usr/bin/env bash
# ===========================================================================
# ALREADY APPLIED — kept as the historical record of the restructure.
#
# This was a one-shot migration: it moved the tree onto the
# TRAVLS-CRYPTO-DASHBOARD conventions (Phase A) and rewrote every import
# specifier to match (Phase B). Both have been applied and verified.
#
# It is NOT runnable any more. Every path it references (Components/AppShell,
# modules/Dashboard, redux/reducers/authSlice.ts, …) was renamed by this very
# script, so a second run would abort on the first `mv`. The guard below makes
# that explicit instead of leaving a script that looks executable.
#
# Read it to understand what moved where; see STRUCTURE.md for the reasoning.
# ===========================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f Components/AppShell/AppShell.tsx ]; then
  cat <<'MSG'
This migration has already been applied — nothing to do.

  Components/AppShell/AppShell.tsx does not exist, which means the tree is
  already on the new conventions. Running it again would abort partway through.

  Current layout:  README.md  ("Structure")
  Why, per rule:   STRUCTURE.md
MSG
  exit 0
fi

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# ---------------------------------------------------------------------------
say "Phase A1 — shell: AppShell/Topbar/Sidebar → DashboardWrapper"
# ---------------------------------------------------------------------------
mkdir -p Components/DashboardWrapper/Components/NavBar \
         Components/DashboardWrapper/Components/SideBar
mv Components/AppShell/AppShell.tsx Components/DashboardWrapper/index.tsx
mv Components/Topbar/Topbar.tsx     Components/DashboardWrapper/Components/NavBar/index.tsx
mv Components/Sidebar/Sidebar.tsx   Components/DashboardWrapper/Components/SideBar/index.tsx

# ---------------------------------------------------------------------------
say "Phase A2 — components adopt index.tsx entries"
# ---------------------------------------------------------------------------
mv Components/Avatar/Avatar.tsx                   Components/Avatar/NameAvatar.tsx
mv Components/Badge/Badge.tsx                     Components/Badge/index.tsx
mkdir -p Components/CoinIcon
mv Components/Badge/CoinIcon.tsx                  Components/CoinIcon/index.tsx

mkdir -p Components/Charts/Sparkline Components/Charts/AreaChart Components/Charts/EcgLine
mv Components/Charts/Sparkline.tsx Components/Charts/Sparkline/index.tsx
mv Components/Charts/AreaChart.tsx Components/Charts/AreaChart/index.tsx
mv Components/Charts/EcgLine.tsx   Components/Charts/EcgLine/index.tsx

mv Components/Icons/index.tsx            Components/Icons/__tmp.tsx 2>/dev/null || true
mv Components/Icons/Icon.tsx             Components/Icons/index.tsx
rm -f Components/Icons/__tmp.tsx

mv Components/Loader/Loader.tsx                   Components/Loader/index.tsx
mv Components/PageHeader/PageHeader.tsx           Components/PageHeader/index.tsx
mv Components/DateRangePicker/DateRangePicker.tsx Components/DateRangePicker/index.tsx
mv Components/StatCard/StatCard.tsx               Components/StatCard/index.tsx
mv Components/DetailGrid/DetailGrid.tsx           Components/DetailGrid/index.tsx
mv Components/CommandPalette/CommandPalette.tsx   Components/CommandPalette/index.tsx
mv Components/LanguageSelect/LanguageSelect.tsx   Components/LanguageSelect/index.tsx
mv Components/Pagination/Pagination.tsx           Components/Pagination/index.tsx
mv Components/Toast/ToastHost.tsx                 Components/Toast/index.tsx

# ---------------------------------------------------------------------------
say "Phase A3 — popups: Popup.tsx + popup.module.scss convention"
# ---------------------------------------------------------------------------
mkdir -p Components/Popup Components/ConfirmPopup
mv Components/PopUps/Modal.tsx        Components/Popup/Popup.tsx
mv Components/PopUps/ConfirmPopup.tsx Components/ConfirmPopup/index.tsx

# ---------------------------------------------------------------------------
say "Phase A4 — table family: index.tsx + Table_V2.tsx, helpers get own dirs"
# ---------------------------------------------------------------------------
mv Components/Table/DataTable.tsx Components/Table/index.tsx
mv Components/Table/TableCard.tsx Components/Table/Table_V2.tsx
mkdir -p Components/SearchField Components/PerPageSelect Components/FilterMenu \
         Components/SelectFilter Components/RowMenu Components/RefCell Components/ExportButton
mv Components/Table/SearchField.tsx   Components/SearchField/index.tsx
mv Components/Table/PerPageSelect.tsx Components/PerPageSelect/index.tsx
mv Components/Table/FilterMenu.tsx    Components/FilterMenu/index.tsx
mv Components/Table/SelectFilter.tsx  Components/SelectFilter/index.tsx
mv Components/Table/RowMenu.tsx       Components/RowMenu/index.tsx
mv Components/Table/RefCell.tsx       Components/RefCell/index.tsx
mv Components/Table/ExportButton.tsx  Components/ExportButton/index.tsx

# ---------------------------------------------------------------------------
say "Phase A5 — form controls out of Forms/ into their own dirs"
# ---------------------------------------------------------------------------
mkdir -p Components/TextField Components/PasswordField Components/Checkbox
mv Components/Forms/TextField.tsx     Components/TextField/index.tsx
mv Components/Forms/PasswordField.tsx Components/PasswordField/index.tsx
mv Components/Forms/Checkbox.tsx      Components/Checkbox/index.tsx

# ---------------------------------------------------------------------------
say "Phase A6 — auth: AuthWrapper + shared AuthShell/SocialButtons"
# ---------------------------------------------------------------------------
mkdir -p Components/AuthWrapper Components/AuthShell Components/SocialButtons
mv Components/AuthGate/AuthGate.tsx         Components/AuthWrapper/index.tsx
mv Components/AuthGate/SessionBootstrap.tsx Components/AuthWrapper/SessionBootstrap.tsx
mv modules/Auth/AuthShell.tsx               Components/AuthShell/index.tsx
mv modules/Auth/SocialButtons.tsx           Components/SocialButtons/index.tsx

# ---------------------------------------------------------------------------
say "Phase A7 — modules become XxxModule/index.tsx"
# ---------------------------------------------------------------------------
mkdir -p modules/DashboardModule/Components/FloatCard \
         modules/DashboardModule/Components/OpsHealthCard \
         modules/DashboardModule/Components/QuickLinks
mv modules/Dashboard/Dashboard.tsx     modules/DashboardModule/index.tsx
mv modules/Dashboard/FloatCard.tsx     modules/DashboardModule/Components/FloatCard/index.tsx
mv modules/Dashboard/OpsHealthCard.tsx modules/DashboardModule/Components/OpsHealthCard/index.tsx
mv modules/Dashboard/QuickLinks.tsx    modules/DashboardModule/Components/QuickLinks/index.tsx

mkdir -p modules/EndUsersModule/components/AddEndUserModal
mv modules/EndUsers/EndUsers.tsx        modules/EndUsersModule/index.tsx
mv modules/EndUsers/AddEndUserModal.tsx modules/EndUsersModule/components/AddEndUserModal/index.tsx

mkdir -p modules/CardholdersModule/components/AddCardholderModal
mv modules/Cardholders/Cardholders.tsx        modules/CardholdersModule/index.tsx
mv modules/Cardholders/AddCardholderModal.tsx modules/CardholdersModule/components/AddCardholderModal/index.tsx

mkdir -p modules/CardsModule       && mv modules/Cards/Cards.tsx               modules/CardsModule/index.tsx
mkdir -p modules/TransactionModule && mv modules/Transactions/Transactions.tsx modules/TransactionModule/index.tsx
mkdir -p modules/CardOrdersModule  && mv modules/CardOrders/CardOrders.tsx     modules/CardOrdersModule/index.tsx
mkdir -p modules/CustodyModule     && mv modules/Custody/Custody.tsx           modules/CustodyModule/index.tsx
mkdir -p modules/CryptoTxsModule   && mv modules/CryptoTxs/CryptoTxs.tsx       modules/CryptoTxsModule/index.tsx
mkdir -p modules/ApiKeysModule     && mv modules/ApiKeys/ApiKeys.tsx           modules/ApiKeysModule/index.tsx
mkdir -p modules/AuditLogModule    && mv modules/AuditLog/AuditLog.tsx         modules/AuditLogModule/index.tsx
mkdir -p modules/SettingsModule    && mv modules/Settings/Settings.tsx         modules/SettingsModule/index.tsx

mkdir -p modules/FloatModule/components/ConvertCard
mv modules/Float/Float.tsx       modules/FloatModule/index.tsx
mv modules/Float/ConvertCard.tsx modules/FloatModule/components/ConvertCard/index.tsx

mkdir -p modules/WebhooksModule/components/WebhookConfigCard
mv modules/Webhooks/Webhooks.tsx          modules/WebhooksModule/index.tsx
mv modules/Webhooks/WebhookConfigCard.tsx modules/WebhooksModule/components/WebhookConfigCard/index.tsx

mkdir -p modules/SignInModule modules/SignUpModule
mv modules/Auth/SignIn.tsx modules/SignInModule/index.tsx
mv modules/Auth/SignUp.tsx modules/SignUpModule/index.tsx

# ---------------------------------------------------------------------------
say "Phase A8 — redux reducers adopt XxxReducer.ts naming"
# ---------------------------------------------------------------------------
mv redux/reducers/authSlice.ts    redux/reducers/AuthReducer.ts
mv redux/reducers/configSlice.ts  redux/reducers/ConfigReducer.ts
mv redux/reducers/popupsSlice.ts  redux/reducers/PopUpsReducer.ts
mv redux/reducers/toastSlice.ts   redux/reducers/ToastReducer.ts
mv redux/reducers/filtersSlice.ts redux/reducers/FiltersReducer.ts

# ---------------------------------------------------------------------------
say "Phase A10 — nest the auth API segment"
# ---------------------------------------------------------------------------
mkdir -p app/api/auth/token
mv app/api/auth/route.ts app/api/auth/token/route.ts

# ---------------------------------------------------------------------------
say "Phase A11 — styles/: drop the leading underscore on mixins + media"
# ---------------------------------------------------------------------------
# `@use "mixins"` resolves either spelling, so this is safe as long as only one
# of each exists. _index.scss and _variables.scss keep their underscore because
# they are partials that are only ever forwarded.
mv styles/_mixins.scss styles/mixins.scss
mv styles/_media.scss  styles/media.scss

# ---------------------------------------------------------------------------
say "Phase A9 — prune emptied directories"
# ---------------------------------------------------------------------------
rmdir Components/AppShell Components/Topbar Components/Sidebar Components/PopUps \
      Components/Forms Components/AuthGate \
      modules/Dashboard modules/EndUsers modules/Cardholders modules/Cards \
      modules/Transactions modules/CardOrders modules/Float modules/Custody \
      modules/CryptoTxs modules/Webhooks modules/ApiKeys modules/AuditLog \
      modules/Settings modules/Auth 2>/dev/null || true

# ===========================================================================
say "Phase B — rewrite import specifiers"
# ===========================================================================
FILES=$(find app Components modules customHooks redux services utils types libs \
        -type f \( -name '*.ts' -o -name '*.tsx' \))

# Longest / most specific patterns first so nothing is partially matched.
MAP=(
  '@/Components/AppShell/AppShell|@/Components/DashboardWrapper'
  '@/Components/Sidebar/Sidebar|@/Components/DashboardWrapper/Components/SideBar'
  '@/Components/Topbar/Topbar|@/Components/DashboardWrapper/Components/NavBar'
  '@/Components/AuthGate/SessionBootstrap|@/Components/AuthWrapper/SessionBootstrap'
  '@/Components/AuthGate/AuthGate|@/Components/AuthWrapper'
  '@/Components/Avatar/Avatar|@/Components/Avatar/NameAvatar'
  '@/Components/Badge/CoinIcon|@/Components/CoinIcon'
  '@/Components/Badge/Badge|@/Components/Badge'
  '@/Components/Icons/Icon|@/Components/Icons'
  '@/Components/Loader/Loader|@/Components/Loader'
  '@/Components/PageHeader/PageHeader|@/Components/PageHeader'
  '@/Components/DateRangePicker/DateRangePicker|@/Components/DateRangePicker'
  '@/Components/StatCard/StatCard|@/Components/StatCard'
  '@/Components/DetailGrid/DetailGrid|@/Components/DetailGrid'
  '@/Components/CommandPalette/CommandPalette|@/Components/CommandPalette'
  '@/Components/LanguageSelect/LanguageSelect|@/Components/LanguageSelect'
  '@/Components/Pagination/Pagination|@/Components/Pagination'
  '@/Components/Toast/ToastHost|@/Components/Toast'
  '@/Components/PopUps/ConfirmPopup|@/Components/ConfirmPopup'
  '@/Components/PopUps/Modal|@/Components/Popup/Popup'
  '@/Components/Table/DataTable|@/Components/Table'
  '@/Components/Table/TableCard|@/Components/Table/Table_V2'
  '@/Components/Table/SearchField|@/Components/SearchField'
  '@/Components/Table/PerPageSelect|@/Components/PerPageSelect'
  '@/Components/Table/FilterMenu|@/Components/FilterMenu'
  '@/Components/Table/SelectFilter|@/Components/SelectFilter'
  '@/Components/Table/RowMenu|@/Components/RowMenu'
  '@/Components/Table/RefCell|@/Components/RefCell'
  '@/Components/Table/ExportButton|@/Components/ExportButton'
  '@/Components/Forms/TextField|@/Components/TextField'
  '@/Components/Forms/PasswordField|@/Components/PasswordField'
  '@/Components/Forms/Checkbox|@/Components/Checkbox'
  '@/redux/reducers/authSlice|@/redux/reducers/AuthReducer'
  '@/redux/reducers/configSlice|@/redux/reducers/ConfigReducer'
  '@/redux/reducers/popupsSlice|@/redux/reducers/PopUpsReducer'
  '@/redux/reducers/toastSlice|@/redux/reducers/ToastReducer'
  '@/redux/reducers/filtersSlice|@/redux/reducers/FiltersReducer'
  '@/modules/Dashboard/Dashboard|@/modules/DashboardModule'
  '@/modules/EndUsers/EndUsers|@/modules/EndUsersModule'
  '@/modules/Cardholders/Cardholders|@/modules/CardholdersModule'
  '@/modules/Cards/Cards|@/modules/CardsModule'
  '@/modules/Transactions/Transactions|@/modules/TransactionModule'
  '@/modules/CardOrders/CardOrders|@/modules/CardOrdersModule'
  '@/modules/Float/Float|@/modules/FloatModule'
  '@/modules/Custody/Custody|@/modules/CustodyModule'
  '@/modules/CryptoTxs/CryptoTxs|@/modules/CryptoTxsModule'
  '@/modules/Webhooks/Webhooks|@/modules/WebhooksModule'
  '@/modules/ApiKeys/ApiKeys|@/modules/ApiKeysModule'
  '@/modules/AuditLog/AuditLog|@/modules/AuditLogModule'
  '@/modules/Settings/Settings|@/modules/SettingsModule'
  '@/modules/Auth/SignIn|@/modules/SignInModule'
  '@/modules/Auth/SignUp|@/modules/SignUpModule'
)

for pair in "${MAP[@]}"; do
  old="${pair%%|*}"; new="${pair##*|}"
  # shellcheck disable=SC2086
  sed -i "s#\"${old}\"#\"${new}\"#g" $FILES
done

say "Phase B2 — relative imports whose depth changed"
sed -i 's#"./chartMath"#"../chartMath"#g' \
  Components/Charts/Sparkline/index.tsx Components/Charts/AreaChart/index.tsx
sed -i 's#"./DataTable"#"./index"#g;s#"./SearchField"#"@/Components/SearchField"#g;s#"./PerPageSelect"#"@/Components/PerPageSelect"#g' \
  Components/Table/Table_V2.tsx
sed -i 's#"./Modal"#"@/Components/Popup/Popup"#g' Components/ConfirmPopup/index.tsx
sed -i 's#"@/Components/DashboardWrapper/Components/SideBar"#"./Components/SideBar"#g;s#"@/Components/DashboardWrapper/Components/NavBar"#"./Components/NavBar"#g' \
  Components/DashboardWrapper/index.tsx
sed -i 's#"./FloatCard"#"./Components/FloatCard"#g;s#"./OpsHealthCard"#"./Components/OpsHealthCard"#g;s#"./QuickLinks"#"./Components/QuickLinks"#g' \
  modules/DashboardModule/index.tsx
sed -i 's#"./AddEndUserModal"#"./components/AddEndUserModal"#g'       modules/EndUsersModule/index.tsx
sed -i 's#"./AddCardholderModal"#"./components/AddCardholderModal"#g' modules/CardholdersModule/index.tsx
sed -i 's#"./ConvertCard"#"./components/ConvertCard"#g'               modules/FloatModule/index.tsx
sed -i 's#"./WebhookConfigCard"#"./components/WebhookConfigCard"#g'   modules/WebhooksModule/index.tsx
sed -i 's#"./AuthShell"#"@/Components/AuthShell"#g;s#"./SocialButtons"#"@/Components/SocialButtons"#g' \
  modules/SignInModule/index.tsx modules/SignUpModule/index.tsx

say "Done. Now run:  npx tsc --noEmit && npm run lint && npm run build"
