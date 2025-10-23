import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

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
  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-card to-muted/20 shadow-lg border-primary/10">
      <div>
        <Label htmlFor="subject" className="text-base font-semibold">Sujet de l'email</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Ex: Proposition de collaboration avec {{entreprise}}"
          className="mt-2 h-12 text-base border-border/50 focus:border-primary transition-colors"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-base font-semibold">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Ex: Bonjour {{nom}}, Je me permets de vous contacter..."
          className="mt-2 min-h-[250px] text-base border-border/50 focus:border-primary transition-colors resize-none"
        />
      </div>

      {availableVariables.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm font-semibold mb-3 text-muted-foreground">Variables disponibles :</p>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <code
                key={variable}
                className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-mono hover:bg-primary/20 transition-colors cursor-default"
              >
                {`{{${variable}}}`}
              </code>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
