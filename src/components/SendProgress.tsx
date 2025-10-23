import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SendResult {
  email: string;
  status: 'success' | 'error';
  message?: string;
}

interface SendProgressProps {
  totalEmails: number;
  sentCount: number;
  results: SendResult[];
  isComplete: boolean;
}

export const SendProgress = ({
  totalEmails,
  sentCount,
  results,
  isComplete,
}: SendProgressProps) => {
  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  const progress = totalEmails > 0 ? (sentCount / totalEmails) * 100 : 0;

  return (
    <Card className="p-6 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            {isComplete ? 'Envoi terminé' : 'Envoi en cours...'}
          </h3>
          <span className="text-sm text-muted-foreground">
            {sentCount} / {totalEmails}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm">
            <strong>{successCount}</strong> réussis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm">
            <strong>{errorCount}</strong> échoués
          </span>
        </div>
      </div>

      {results.length > 0 && (
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                {result.status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.email}</p>
                  {result.message && (
                    <p className="text-xs text-muted-foreground">
                      {result.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {!isComplete && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Envoi des emails en cours...</span>
        </div>
      )}
    </Card>
  );
};
