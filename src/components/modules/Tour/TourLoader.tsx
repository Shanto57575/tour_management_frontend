export default function TourLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-purple-950">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin" />
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
    </div>
  );
}
