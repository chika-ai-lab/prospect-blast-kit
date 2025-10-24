import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, Trash2 } from "lucide-react";
import { EmailValidationResult } from "@/lib/emailValidator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmailValidationProps {
  validationResult: EmailValidationResult | null;
  onCleanData: () => void;
}

export const EmailValidation = ({ validationResult, onCleanData }: EmailValidationProps) => {
  if (!validationResult) return null;

  const hasIssues = validationResult.invalidEmails.length > 0 || validationResult.duplicates.length > 0;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Validation des emails
        </CardTitle>
        <CardDescription>
          Vérification de la qualité de vos données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Emails valides */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {validationResult.validEmails.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-500">
                Emails valides
              </div>
            </div>
          </div>

          {/* Emails invalides */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {validationResult.invalidEmails.length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-500">
                Emails invalides
              </div>
            </div>
          </div>

          {/* Doublons */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {validationResult.duplicates.length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-500">
                Doublons détectés
              </div>
            </div>
          </div>
        </div>

        {hasIssues && (
          <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-900/10">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Attention :</strong> {validationResult.invalidEmails.length + validationResult.duplicates.length} problème(s) détecté(s).
                  Cliquez sur "Nettoyer les données" pour les supprimer.
                </span>
                <div className="flex gap-2">
                  {validationResult.invalidEmails.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Voir les invalides
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Emails invalides ({validationResult.invalidEmails.length})</DialogTitle>
                          <DialogDescription>
                            Ces emails ont un format incorrect et seront supprimés si vous nettoyez les données.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="overflow-y-auto flex-1 rounded-md border p-4">
                          <div className="space-y-2">
                            {validationResult.invalidEmails.map((email, index) => (
                              <div key={index} className="text-sm text-red-600 dark:text-red-400 font-mono">
                                {email}
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {validationResult.duplicates.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Voir les doublons
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Emails en double ({validationResult.duplicates.length})</DialogTitle>
                          <DialogDescription>
                            Ces emails apparaissent plusieurs fois dans votre fichier. Seule la première occurrence sera conservée.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="overflow-y-auto flex-1 rounded-md border p-4">
                          <div className="space-y-2">
                            {validationResult.duplicates.map((email, index) => (
                              <div key={index} className="text-sm text-orange-600 dark:text-orange-400 font-mono">
                                {email}
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button
                    onClick={onCleanData}
                    variant="default"
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Nettoyer les données
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!hasIssues && (
          <Alert className="border-green-500/50 bg-green-50 dark:bg-green-900/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Parfait !</strong> Tous les emails sont valides et uniques. Vous pouvez procéder à l'envoi.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
