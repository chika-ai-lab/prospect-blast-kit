import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Send } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmailPreviewProps {
  subject: string;
  message: string;
  htmlContent?: string;
  useHTML: boolean;
  firstRowData: any;
  onSendTest: (email: string) => void;
}

export const EmailPreview = ({
  subject,
  message,
  htmlContent,
  useHTML,
  firstRowData,
  onSendTest,
}: EmailPreviewProps) => {
  const [testEmail, setTestEmail] = useState("");

  // Remplacer les variables avec les données de la première ligne
  const replaceVars = (text: string) => {
    let result = text;
    Object.keys(firstRowData).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "gi");
      result = result.replace(regex, String(firstRowData[key] || ""));
    });
    return result;
  };

  const previewSubject = replaceVars(subject);
  const previewMessage = replaceVars(message);
  const previewHTML =
    useHTML && htmlContent ? replaceVars(htmlContent) : undefined;

  return (
    <Card className="border-2 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-cyan-600" />
          Prévisualisation & Test
        </CardTitle>
        <CardDescription>
          Prévisualisez votre email avec les données du premier contact et
          envoyez un test
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {/* Bouton Prévisualiser */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Prévisualiser
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Prévisualisation de l'email</DialogTitle>
                <DialogDescription>
                  Aperçu avec les données du premier contact
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Sujet :</h4>
                    <p className="text-sm bg-muted p-3 rounded">
                      {previewSubject}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Corps de l'email :</h4>
                    {useHTML && previewHTML ? (
                      <div
                        className="border rounded p-4 bg-white"
                        dangerouslySetInnerHTML={{ __html: previewHTML }}
                      />
                    ) : (
                      <pre className="text-sm bg-muted p-4 rounded whitespace-pre-wrap">
                        {previewMessage}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bouton Envoyer un Test */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Envoyer un test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Envoyer un email de test</DialogTitle>
                <DialogDescription>
                  Recevez un aperçu de votre email dans votre boîte de réception
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="test-email">Adresse email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (testEmail) {
                      onSendTest(testEmail);
                    }
                  }}
                  disabled={!testEmail}
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le test
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
