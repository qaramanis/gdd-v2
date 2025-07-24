export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black dark:to-gray-950">
      <div className="w-full max-w-md p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
