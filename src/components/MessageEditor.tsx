import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface MessageEditorProps {
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  availableVariables: string[];
}

export const MessageEditor = ({
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  availableVariables,
}: MessageEditorProps) => {
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variable: string, target: "subject" | "message") => {
    const ref = target === "subject" ? subjectRef : messageRef;
    const currentValue = target === "subject" ? subject : message;
    const onChange = target === "subject" ? onSubjectChange : onMessageChange;

    if (ref.current) {
      const start = ref.current.selectionStart;
      const end = ref.current.selectionEnd;
      const newValue =
        currentValue.substring(0, start) +
        `{{${variable}}}` +
        currentValue.substring(end);
      onChange(newValue);

      // Restaurer la position du curseur après l'insertion
      setTimeout(() => {
        if (ref.current) {
          const newCursorPos = start + `{{${variable}}}`.length;
          ref.current.setSelectionRange(newCursorPos, newCursorPos);
          ref.current.focus();
        }
      }, 0);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-card to-muted/20 shadow-lg border-primary/10">
      <div>
        <Label htmlFor="subject" className="text-base font-semibold">
          Sujet de l'email
        </Label>
        <Input
          ref={subjectRef}
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Ex: Proposition de collaboration avec {{entreprise}}"
          className="mt-2 h-12 text-base border-border/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-base font-semibold">
          Message
        </Label>
        <Textarea
          ref={messageRef}
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Ex: Bonjour {{nom}}, Je me permets de vous contacter..."
          className="mt-2 min-h-[250px] text-base border-border/50 focus:border-primary transition-colors resize-none"
        />
      </div>

      {availableVariables.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm font-semibold mb-3 text-muted-foreground">
            Variables disponibles (cliquez pour insérer) :
          </p>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <div key={variable} className="flex gap-1">
                <code
                  onClick={() => insertVariable(variable, "subject")}
                  className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-mono hover:bg-primary/20 transition-colors cursor-pointer"
                  title="Insérer dans le sujet"
                >
                  {`{{${variable}}}`}
                </code>
                <code
                  onClick={() => insertVariable(variable, "message")}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-mono hover:bg-blue-200 transition-colors cursor-pointer"
                  title="Insérer dans le message"
                >
                  {`{{${variable}}}`}
                </code>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-primary font-medium">Orange</span> : insérer
            dans le sujet •{" "}
            <span className="text-blue-600 font-medium">Bleu</span> : insérer
            dans le message
          </p>
        </div>
      )}
    </Card>
  );
};
