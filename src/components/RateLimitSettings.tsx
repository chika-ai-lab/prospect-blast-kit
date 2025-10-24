import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Clock, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RateLimitSettingsProps {
  emailsPerMinute: number;
  delayBetweenEmails: number;
  onEmailsPerMinuteChange: (value: number) => void;
  onDelayChange: (value: number) => void;
  totalEmails: number;
}

export const RateLimitSettings = ({
  emailsPerMinute,
  delayBetweenEmails,
  onEmailsPerMinuteChange,
  onDelayChange,
  totalEmails,
}: RateLimitSettingsProps) => {
  // Calculer le temps estimé
  const calculateEstimatedTime = () => {
    const totalSeconds = (totalEmails * delayBetweenEmails) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (minutes === 0) {
      return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds > 0 ? `et ${seconds} seconde${seconds > 1 ? "s" : ""}` : ""}`;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Configuration de l'envoi
        </CardTitle>
        <CardDescription>
          Configurez la vitesse d'envoi pour éviter d'être bloqué par les serveurs SMTP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emails par minute */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="emails-per-minute" className="text-base font-medium">
              Emails par minute
            </Label>
            <span className="text-2xl font-bold text-primary">
              {emailsPerMinute}
            </span>
          </div>
          <Slider
            id="emails-per-minute"
            min={1}
            max={60}
            step={1}
            value={[emailsPerMinute]}
            onValueChange={(value) => {
              onEmailsPerMinuteChange(value[0]);
              // Calculer le délai correspondant
              const delayMs = Math.floor(60000 / value[0]);
              onDelayChange(delayMs);
            }}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Recommandé : 20-30 emails/min pour éviter les limitations SMTP
          </p>
        </div>

        {/* Délai entre emails */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="delay" className="text-base font-medium">
              Délai entre chaque email
            </Label>
            <span className="text-2xl font-bold text-primary">
              {(delayBetweenEmails / 1000).toFixed(1)}s
            </span>
          </div>
          <Slider
            id="delay"
            min={500}
            max={10000}
            step={100}
            value={[delayBetweenEmails]}
            onValueChange={(value) => {
              onDelayChange(value[0]);
              // Calculer les emails par minute correspondants
              const emailsPerMin = Math.floor(60000 / value[0]);
              onEmailsPerMinuteChange(emailsPerMin);
            }}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Plus le délai est long, plus le risque de blocage est faible
          </p>
        </div>

        {/* Temps estimé */}
        {totalEmails > 0 && (
          <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-900/10">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Temps estimé :</strong> {calculateEstimatedTime()}
                </span>
                <span className="text-sm">
                  pour {totalEmails} email{totalEmails > 1 ? "s" : ""}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Avertissement si trop rapide */}
        {emailsPerMinute > 40 && (
          <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-900/10">
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>Attention :</strong> Une vitesse d'envoi trop élevée peut entraîner un blocage temporaire de votre compte SMTP.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
