import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MessageEditor } from "@/components/MessageEditor";
import { DataPreview } from "@/components/DataPreview";
import { SendProgress } from "@/components/SendProgress";
import { Button } from "@/components/ui/button";
import { ExcelRow, parseExcelFile, replaceVariables } from "@/lib/excelParser";
import { useToast } from "@/hooks/use-toast";
import { Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [sentCount, setSentCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const data = await parseExcelFile(selectedFile);
      setExcelData(data.rows);
      setColumns(data.columns);
      toast({
        title: "Fichier chargé",
        description: `${data.rows.length} contact(s) trouvé(s)`,
      });
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

      try {
        // Appel à l'API backend
        const response = await fetch("http://localhost:3000/send-email", {
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

        <Alert className="mb-6 border-green-500/50 bg-green-50 dark:bg-green-900/10">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Service intégré :</strong> Les emails sont maintenant
            envoyés via le service Node.js backend. Assurez-vous que le serveur
            backend est en cours d'exécution sur le port 3000.
          </AlertDescription>
        </Alert>

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
