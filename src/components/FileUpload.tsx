import { useCallback, useState } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export const FileUpload = ({ onFileSelect, selectedFile, onRemoveFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  if (selectedFile) {
    return (
      <Card className="p-6 flex items-center justify-between bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <Button 
          onClick={onRemoveFile} 
          variant="ghost" 
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-5 w-5" />
        </Button>
      </Card>
    );
  }

  return (
    <Card
      className={`p-12 border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className={`p-4 rounded-full transition-all duration-300 ${
          isDragging ? 'bg-primary/20 scale-110' : 'bg-primary/10'
        }`}>
          <Upload className={`h-12 w-12 transition-colors ${
            isDragging ? 'text-primary' : 'text-primary/70'
          }`} />
        </div>
        <p className="text-xl font-semibold mb-2 mt-6">
          Glissez-déposez votre fichier Excel ici
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          ou cliquez pour sélectionner un fichier
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <span className="text-xs text-muted-foreground font-medium">
            Formats acceptés: .xlsx, .xls
          </span>
        </div>
      </label>
    </Card>
  );
};
