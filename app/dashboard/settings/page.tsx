export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage your account preferences and settings.
        </p>

        <div className="grid gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Profile Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your personal information and profile picture.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Password and Security</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your password and secure your account.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your notification preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
