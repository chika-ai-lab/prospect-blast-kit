import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MessageEditor } from "@/components/MessageEditor";
import { DataPreview } from "@/components/DataPreview";
import { SendProgress } from "@/components/SendProgress";
import { EmailValidation } from "@/components/EmailValidation";
import { RateLimitSettings } from "@/components/RateLimitSettings";
import { TemplateSelector } from "@/components/TemplateSelector";
import { EmailPreview } from "@/components/EmailPreview";
import { Button } from "@/components/ui/button";
import { ExcelRow, parseExcelFile, replaceVariables } from "@/lib/excelParser";
import { useToast } from "@/hooks/use-toast";
import { useCampaignDraft } from "@/hooks/useCampaignDraft";
import { Mail, AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { config } from "@/lib/config";
import {
  validateAndCleanEmails,
  EmailValidationResult,
} from "@/lib/emailValidator";
import { EmailTemplate } from "@/lib/emailTemplates";

interface SendResult {
  email: string;
  status: "success" | "error";
  message?: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [useHTML, setUseHTML] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [sentCount, setSentCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [validationResult, setValidationResult] =
    useState<EmailValidationResult | null>(null);
  const [emailsPerMinute, setEmailsPerMinute] = useState(
    config.emailsPerMinute
  );
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(
    config.delayBetweenEmails
  );
  const [draftLoaded, setDraftLoaded] = useState(false);
  const { toast } = useToast();
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useCampaignDraft();

  // Charger le brouillon au démarrage
  useEffect(() => {
    if (!draftLoaded) {
      const draft = loadDraft();
      if (draft && hasDraft()) {
        setSubject(draft.subject);
        setMessage(draft.message);
        setHtmlContent(draft.htmlContent);
        setUseHTML(draft.useHTML);
        setEmailsPerMinute(draft.emailsPerMinute);
        setDelayBetweenEmails(draft.delayBetweenEmails);
        toast({
          title: "Brouillon restauré",
          description: "Votre dernier brouillon a été chargé automatiquement",
        });
      }
      setDraftLoaded(true);
    }
  }, [draftLoaded, loadDraft, hasDraft, toast]);

  // Sauvegarder automatiquement le brouillon quand les champs changent
  useEffect(() => {
    if (draftLoaded && (subject || message)) {
      const timeoutId = setTimeout(() => {
        saveDraft({
          subject,
          message,
          htmlContent,
          useHTML,
          emailsPerMinute,
          delayBetweenEmails,
        });
      }, 1000); // Debounce de 1 seconde

      return () => clearTimeout(timeoutId);
    }
  }, [
    subject,
    message,
    htmlContent,
    useHTML,
    emailsPerMinute,
    delayBetweenEmails,
    draftLoaded,
    saveDraft,
  ]);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setMessage(template.plainText);
    setHtmlContent(template.html);
    setUseHTML(true);
    toast({
      title: "Template appliqué",
      description: `Le template "${template.name}" a été chargé`,
    });
  };

  const handleSendTest = async (testEmail: string) => {
    if (!excelData.length || !subject || !message) {
      toast({
        title: "Données manquantes",
        description: "Veuillez remplir tous les champs avant d'envoyer un test",
        variant: "destructive",
      });
      return;
    }

    const firstRow = excelData[0];
    const personalizedSubject = replaceVariables(subject, firstRow);
    const personalizedMessage = replaceVariables(message, firstRow);
    const personalizedHTML = useHTML
      ? replaceVariables(htmlContent, firstRow)
      : undefined;

    try {
      const response = await fetch(`${config.apiUrl}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: testEmail,
          subject: `[TEST] ${personalizedSubject}`,
          text: personalizedMessage,
          html: personalizedHTML,
        }),
      });

      if (response.ok) {
        toast({
          title: "Email de test envoyé",
          description: `Un email de test a été envoyé à ${testEmail}`,
        });
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.error || "Impossible d'envoyer l'email de test",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer l'email",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const data = await parseExcelFile(selectedFile);
      setExcelData(data.rows);
      setColumns(data.columns);

      // Trouver la colonne email
      const emailColumn = data.columns.find(
        (col) =>
          col.toLowerCase().includes("email") || col.toLowerCase() === "mail"
      );

      if (emailColumn) {
        // Valider et nettoyer les emails
        const validation = validateAndCleanEmails(data.rows, emailColumn);
        setValidationResult(validation);

        toast({
          title: "Fichier chargé",
          description: `${data.rows.length} contact(s) trouvé(s) - ${validation.validEmails.length} email(s) valide(s)`,
        });
      } else {
        setValidationResult(null);
        toast({
          title: "Fichier chargé",
          description: `${data.rows.length} contact(s) trouvé(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur de lecture du fichier",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExcelData([]);
    setColumns([]);
    setSendResults([]);
    setSentCount(0);
    setIsComplete(false);
    setValidationResult(null);
  };

  const handleCleanData = () => {
    if (!validationResult) return;

    // Remplacer les données par les données nettoyées
    setExcelData(validationResult.cleanedData);

    // Revalider pour mettre à jour les statistiques
    const emailColumn = columns.find(
      (col) =>
        col.toLowerCase().includes("email") || col.toLowerCase() === "mail"
    );

    if (emailColumn) {
      const validation = validateAndCleanEmails(
        validationResult.cleanedData,
        emailColumn
      );
      setValidationResult(validation);

      toast({
        title: "Données nettoyées",
        description: `${validation.validEmails.length} email(s) valide(s) conservé(s)`,
      });
    }
  };

  const handleRetry = async () => {
    // Filtrer uniquement les emails qui ont échoué
    const failedEmails = sendResults.filter((r) => r.status === "error");

    if (failedEmails.length === 0) return;

    // Créer une liste de données pour les emails échoués
    const emailColumn = columns.find(
      (col) =>
        col.toLowerCase().includes("email") || col.toLowerCase() === "mail"
    );

    if (!emailColumn) return;

    const failedData = excelData.filter((row) => {
      const email = String(row[emailColumn] || "")
        .trim()
        .toLowerCase();
      return failedEmails.some(
        (failedEmail) => failedEmail.email.toLowerCase() === email
      );
    });

    // Réinitialiser les résultats pour les échecs uniquement
    setIsSending(true);
    setSentCount(0);

    const results: SendResult[] = [
      ...sendResults.filter((r) => r.status === "success"),
    ];

    for (let i = 0; i < failedData.length; i++) {
      const row = failedData[i];
      const recipientEmail = emailColumn ? String(row[emailColumn] || "") : "";

      const personalizedSubject = replaceVariables(subject, row);
      const personalizedMessage = replaceVariables(message, row);

      try {
        const response = await fetch(`${config.apiUrl}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: recipientEmail,
            subject: personalizedSubject,
            text: personalizedMessage,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          results.push({
            email: recipientEmail,
            status: "success",
            message: "Email envoyé avec succès",
          });
        } else {
          results.push({
            email: recipientEmail,
            status: "error",
            message: data.error || "Erreur lors de l'envoi",
          });
        }
      } catch (error) {
        results.push({
          email: recipientEmail,
          status: "error",
          message: error instanceof Error ? error.message : "Erreur réseau",
        });
      }

      setSentCount(i + 1);
      setSendResults([...results]);

      if (i < failedData.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenEmails));
      }
    }

    setIsComplete(true);
    setIsSending(false);

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    toast({
      title: "Reprise terminée",
      description: `${successCount} emails envoyés au total, ${errorCount} erreurs restantes`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const handleExportCSV = () => {
    if (sendResults.length === 0) return;

    // Créer le contenu CSV
    const headers = ["Email", "Statut", "Message"];
    const rows = sendResults.map((result) => [
      result.email,
      result.status === "success" ? "Réussi" : "Échoué",
      result.message || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `resultats-envoi-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: "Les résultats ont été exportés en CSV",
    });
  };

  const handleSendEmails = async () => {
    if (!excelData.length || !subject || !message) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    // Vérifier qu'il y a une colonne email
    const hasEmailColumn = columns.some(
      (col) =>
        col.toLowerCase().includes("email") || col.toLowerCase() === "mail"
    );

    if (!hasEmailColumn) {
      toast({
        title: "Colonne email manquante",
        description: 'Votre fichier doit contenir une colonne "email"',
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setSendResults([]);
    setSentCount(0);
    setIsComplete(false);

    const results: SendResult[] = [];

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      const emailColumn = columns.find(
        (col) =>
          col.toLowerCase().includes("email") || col.toLowerCase() === "mail"
      );
      const recipientEmail = emailColumn ? String(row[emailColumn] || "") : "";

      // Remplacer les variables
      const personalizedSubject = replaceVariables(subject, row);
      const personalizedMessage = replaceVariables(message, row);
      const personalizedHTML = useHTML
        ? replaceVariables(htmlContent, row)
        : undefined;

      try {
        console.log(config.apiUrl);
        // Appel à l'API backend
        const response = await fetch(`${config.apiUrl}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: recipientEmail,
            subject: personalizedSubject,
            text: personalizedMessage,
            html: personalizedHTML,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          results.push({
            email: recipientEmail,
            status: "success",
            message: "Email envoyé avec succès",
          });
        } else {
          results.push({
            email: recipientEmail,
            status: "error",
            message: data.error || "Erreur lors de l'envoi",
          });
        }
      } catch (error) {
        results.push({
          email: recipientEmail,
          status: "error",
          message: error instanceof Error ? error.message : "Erreur réseau",
        });
      }

      setSentCount(i + 1);
      setSendResults([...results]);

      // Ajouter un délai entre chaque email (sauf pour le dernier)
      if (i < excelData.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenEmails));
      }
    }

    setIsComplete(true);
    setIsSending(false);

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    toast({
      title: "Envoi terminé",
      description: `${successCount} emails envoyés avec succès, ${errorCount} erreurs`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Envoi d'Emails Personnalisés
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Importez un fichier Excel et envoyez des emails personnalisés à vos
            contacts en quelques clics
          </p>
        </div>

        {/* <Alert className="mb-6 border-green-500/50 bg-green-50 dark:bg-green-900/10">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Service intégré :</strong> Les emails sont maintenant
            envoyés via le service Node.js backend. Assurez-vous que le serveur
            backend est en cours d'exécution sur le port 3000.
          </AlertDescription>
        </Alert> */}

        <div className="space-y-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <h2 className="text-2xl font-semibold">
                Importer le fichier Excel
              </h2>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={file}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {excelData.length > 0 && (
            <>
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-2xl font-semibold">Aperçu des données</h2>
                </div>
                <DataPreview data={excelData} columns={columns} />
              </div>

              {validationResult && (
                <div className="animate-fade-in">
                  <EmailValidation
                    validationResult={validationResult}
                    onCleanData={handleCleanData}
                  />
                </div>
              )}

              <div className="animate-fade-in">
                <TemplateSelector onSelectTemplate={handleSelectTemplate} />
              </div>

              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-2xl font-semibold">
                    Personnaliser le message
                  </h2>
                </div>
                <MessageEditor
                  subject={subject}
                  message={message}
                  onSubjectChange={setSubject}
                  onMessageChange={setMessage}
                  availableVariables={columns}
                />
              </div>

              {subject && message && (
                <div className="animate-fade-in h-fit">
                  <EmailPreview
                    subject={subject}
                    message={message}
                    htmlContent={htmlContent}
                    useHTML={useHTML}
                    firstRowData={excelData[0] || {}}
                    onSendTest={handleSendTest}
                  />
                </div>
              )}

              <div className="animate-fade-in">
                <RateLimitSettings
                  emailsPerMinute={emailsPerMinute}
                  delayBetweenEmails={delayBetweenEmails}
                  onEmailsPerMinuteChange={setEmailsPerMinute}
                  onDelayChange={setDelayBetweenEmails}
                  totalEmails={excelData.length}
                />
              </div>

              <div className="flex justify-center animate-fade-in">
                <Button
                  onClick={handleSendEmails}
                  disabled={isSending || !subject || !message}
                  size="lg"
                  className="px-12 py-6 text-lg shadow-glow hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {isSending
                    ? "Envoi en cours..."
                    : `Envoyer ${excelData.length} email(s)`}
                </Button>
              </div>

              {(isSending || sendResults.length > 0) && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      4
                    </div>
                    <h2 className="text-2xl font-semibold">
                      Résultats de l'envoi
                    </h2>
                  </div>
                  <SendProgress
                    totalEmails={excelData.length}
                    sentCount={sentCount}
                    results={sendResults}
                    isComplete={isComplete}
                    onRetry={handleRetry}
                    onExportCSV={handleExportCSV}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
