import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { emailTemplates, EmailTemplate, getTemplatesByCategory } from "@/lib/emailTemplates";
import { FileText, Eye, Check } from "lucide-react";
import { useState } from "react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: EmailTemplate) => void;
}

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const filteredTemplates =
    selectedCategory === "all"
      ? emailTemplates
      : getTemplatesByCategory(selectedCategory as EmailTemplate["category"]);

  const categories = [
    { value: "all", label: "Tous les templates" },
    { value: "prospection", label: "Prospection" },
    { value: "relance", label: "Relance" },
    { value: "newsletter", label: "Newsletter" },
    { value: "evenement", label: "Événement" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Templates d'emails
        </CardTitle>
        <CardDescription>
          Utilisez un template prédéfini pour gagner du temps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtre par catégorie */}
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste des templates */}
        <div className="max-h-[400px] overflow-y-auto w-full rounded-md border p-4">
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                      {template.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      {template.variables.length} variable(s)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {/* Bouton prévisualisation */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle>{previewTemplate?.name}</DialogTitle>
                        <DialogDescription>
                          {previewTemplate?.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-y-auto flex-1 rounded-md border p-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Sujet :</h4>
                            <p className="text-sm bg-muted p-2 rounded">
                              {previewTemplate?.subject}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Aperçu HTML :</h4>
                            <div
                              className="border rounded p-4 bg-white"
                              dangerouslySetInnerHTML={{
                                __html: previewTemplate?.html || "",
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Version texte :</h4>
                            <pre className="text-sm bg-muted p-4 rounded whitespace-pre-wrap">
                              {previewTemplate?.plainText}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Variables disponibles :</h4>
                            <div className="flex flex-wrap gap-2">
                              {previewTemplate?.variables.map((variable) => (
                                <span
                                  key={variable}
                                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono"
                                >
                                  {`{{${variable}}}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Bouton utiliser */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Utiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
