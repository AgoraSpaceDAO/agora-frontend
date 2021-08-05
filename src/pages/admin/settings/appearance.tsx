import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import { settingsSideNavItems } from "./index"

const AppearanceSettings = (): JSX.Element => (
  <AdminLayout title="Settings - Levels" sideNavItems={settingsSideNavItems}>
    <div>Appearance settings</div>
  </AdminLayout>
)

export default AppearanceSettings
