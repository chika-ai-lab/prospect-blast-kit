import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

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
  const progress = (sentCount / totalEmails) * 100;
  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-card to-muted/20 shadow-lg border-primary/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">Progression</h3>
        <div className="flex items-center gap-2">
          {!isComplete && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          <span className="text-lg font-bold text-primary">
            {sentCount} / {totalEmails}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
      </div>

      {isComplete && (
        <div className="pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-sm text-muted-foreground">Réussis</p>
              </div>
            </div>
            {errorCount > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                  <p className="text-sm text-muted-foreground">Échoués</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-auto pr-2">
            <p className="text-sm font-semibold mb-3 text-muted-foreground">Détails :</p>
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                  result.status === 'success'
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-destructive/5 border-destructive/20'
                }`}
              >
                {result.status === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{result.email}</p>
                  {result.message && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
