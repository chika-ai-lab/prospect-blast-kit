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
    <Card className="p-6 space-y-4">
      <div>
        <Label htmlFor="subject">Sujet de l'email</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Ex: Proposition de collaboration avec {{entreprise}}"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Ex: Bonjour {{nom}}, Je me permets de vous contacter..."
          className="mt-2 min-h-[200px]"
        />
      </div>

      {availableVariables.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">Variables disponibles :</p>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <code
                key={variable}
                className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
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
