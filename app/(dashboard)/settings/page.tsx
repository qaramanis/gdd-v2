export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-start justify-between mb-6 flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-accent">
          Manage your account preferences and settings.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

        <div className="grid gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Profile Information</h3>
            <p className="text-sm text-accent">
              Update your personal information and profile picture.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Password and Security</h3>
            <p className="text-sm text-accent">
              Update your password and secure your account.
            </p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-accent">
              Configure your notification preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
