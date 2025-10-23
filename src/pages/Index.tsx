import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { MessageEditor } from '@/components/MessageEditor';
import { DataPreview } from '@/components/DataPreview';
import { SendProgress } from '@/components/SendProgress';
import { Button } from '@/components/ui/button';
import { parseExcelFile, replaceVariables } from '@/lib/excelParser';
import { useToast } from '@/hooks/use-toast';
import { Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SendResult {
  email: string;
  status: 'success' | 'error';
  message?: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
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
        title: 'Fichier chargé',
        description: `${data.rows.length} contact(s) trouvé(s)`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur de lecture du fichier',
        variant: 'destructive',
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
        title: 'Information manquante',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    // Vérifier qu'il y a une colonne email
    const hasEmailColumn = columns.some(col => 
      col.toLowerCase().includes('email') || col.toLowerCase() === 'mail'
    );

    if (!hasEmailColumn) {
      toast({
        title: 'Colonne email manquante',
        description: 'Votre fichier doit contenir une colonne "email"',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    setSendResults([]);
    setSentCount(0);
    setIsComplete(false);

    const results: SendResult[] = [];

    // Simulation de l'envoi d'emails
    // IMPORTANT: L'envoi réel nécessite une fonction backend pour sécuriser les identifiants SMTP
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      const emailColumn = columns.find(col => 
        col.toLowerCase().includes('email') || col.toLowerCase() === 'mail'
      );
      const recipientEmail = emailColumn ? row[emailColumn] : '';

      // Remplacer les variables
      const personalizedSubject = replaceVariables(subject, row);
      const personalizedMessage = replaceVariables(message, row);

      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 500));

      // Pour le moment, on simule un succès
      // Dans la réalité, cela devrait appeler une API backend
      results.push({
        email: recipientEmail,
        status: 'success',
        message: 'Email envoyé avec succès',
      });

      setSentCount(i + 1);
      setSendResults([...results]);
    }

    setIsComplete(true);
    setIsSending(false);

    toast({
      title: 'Envoi terminé',
      description: `${results.filter(r => r.status === 'success').length} emails envoyés`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Envoi d'Emails Personnalisés</h1>
          </div>
          <p className="text-muted-foreground">
            Importez un fichier Excel et envoyez des emails personnalisés à vos contacts
          </p>
        </div>

        <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-900/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Note importante :</strong> Pour sécuriser l'envoi d'emails avec vos identifiants SMTP,
            une fonction backend est nécessaire. Actuellement en mode démonstration.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Importer le fichier Excel</h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={file}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {excelData.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">2. Aperçu des données</h2>
                <DataPreview data={excelData} columns={columns} />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">3. Personnaliser le message</h2>
                <MessageEditor
                  subject={subject}
                  message={message}
                  onSubjectChange={setSubject}
                  onMessageChange={setMessage}
                  availableVariables={columns}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSendEmails}
                  disabled={isSending || !subject || !message}
                  size="lg"
                >
                  {isSending ? 'Envoi en cours...' : `Envoyer ${excelData.length} email(s)`}
                </Button>
              </div>

              {(isSending || sendResults.length > 0) && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">4. Résultats de l'envoi</h2>
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
