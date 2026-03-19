import { useNavigate } from "react-router";
import { MapPin } from "lucide-react";
import type { IGuideApplication } from "@/redux/features/guide/guide.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  activeApplication: IGuideApplication;
}

export function ApplicationStatusCard({ activeApplication }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none max-w-3xl mx-auto" />
      <Card className="w-full max-w-lg shadow-xl shadow-purple-500/5 dark:shadow-purple-900/10 border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10 relative">
        <CardHeader className="text-center space-y-2 pb-6 pt-8">
          <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 w-16 h-16 rounded-full flex flex-col items-center justify-center mb-2">
            <MapPin className="text-amber-600 dark:text-amber-400 w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold font-merriweather text-slate-900 dark:text-white">
            Application {activeApplication.status === "PENDING" ? "Under Review" : activeApplication.status}
          </CardTitle>
          <CardDescription className="text-base">
            {activeApplication.status === "PENDING"
              ? "You have already submitted an application. Please wait for review."
              : "Your application has been approved and you are now a Guide."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate(activeApplication.status === "APPROVED" ? "/guide" : "/user")}
            className="w-full h-12 text-base font-semibold"
          >
            {activeApplication.status === "APPROVED" ? "Go to Guide Dashboard" : "Return to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
