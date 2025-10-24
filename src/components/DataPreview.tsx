import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataPreviewProps {
  data: any[];
  columns: string[];
}

export const DataPreview = ({ data, columns }: DataPreviewProps) => {
  const previewData = data.slice(0, 5);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 shadow-lg border-primary/10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">Aperçu des données</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{data.length}</span>{" "}
            contact(s) trouvé(s) • Affichage des 5 premiers
          </p>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="font-semibold text-foreground"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell key={column} className="font-medium">
                    {row[column] || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
