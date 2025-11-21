import { CheckCircle2, XCircle, Clock, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmailResult {
  email: string;
  status: "success" | "failed" | "pending";
  message?: string;
}

interface EmailStatusProps {
  results: EmailResult[];
}

export const EmailStatus = ({ results }: EmailStatusProps) => {
  if (results.length === 0) return null;

  return (
    <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        Email Status
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
          >
            {result.status === "success" && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
            {result.status === "failed" && (
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            )}
            {result.status === "pending" && (
              <Clock className="w-5 h-5 text-muted-foreground animate-pulse flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {result.email}
              </p>
              {result.message && (
                <p className="text-xs text-muted-foreground truncate">
                  {result.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
