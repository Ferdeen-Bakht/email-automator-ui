import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmailStatus } from "@/components/EmailStatus";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface EmailResult {
  email: string;
  status: "success" | "failed" | "pending";
  message?: string;
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const { toast } = useToast();

  const webhookUrl = "https://zubair1718.app.n8n.cloud/webhook/email-automation";

  const handleProcessEmails = async () => {
    setIsProcessing(true);
    setIsComplete(false);
    setEmailResults([]);

    try {
      console.log("Sending request to n8n webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          action: "process_emails",
          source: "email-automation-ui",
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Webhook response:", data);

      // Parse the results from the webhook response
      if (data.results && Array.isArray(data.results)) {
        setEmailResults(data.results);
      } else if (data.success) {
        // If webhook returns success but no detailed results
        setEmailResults([
          {
            email: "All emails",
            status: "success",
            message: data.message || "Emails processed successfully",
          },
        ]);
      }

      setIsComplete(true);
      toast({
        title: "Success!",
        description: "Email automation process completed successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error processing emails:", error);
      toast({
        title: "Error",
        description: "Failed to process emails. Please check your webhook configuration.",
        variant: "destructive",
        duration: 5000,
      });
      setEmailResults([
        {
          email: "Process Failed",
          status: "failed",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Email Automation
          </h1>
          <p className="text-muted-foreground text-lg">
            Process and send emails to your users with one click
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom duration-700 shadow-xl border-border/50">
          <div className="space-y-4">
            {/* Status Indicator */}
            {(isProcessing || isComplete) && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/50 animate-in fade-in slide-in-from-top duration-300">
                {isProcessing && (
                  <>
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm font-medium text-foreground">
                      Processing emails...
                    </span>
                  </>
                )}
                {isComplete && !isProcessing && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-foreground">
                      Process completed!
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleProcessEmails}
              disabled={isProcessing}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Process Emails
                </>
              )}
            </Button>

            {/* Webhook Info */}
            <p className="text-xs text-muted-foreground text-center">
              Connected to n8n webhook
            </p>
          </div>
        </Card>

        {/* Email Status Results */}
        {emailResults.length > 0 && <EmailStatus results={emailResults} />}
      </div>
    </div>
  );
};

export default Index;
