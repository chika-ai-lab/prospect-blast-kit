// Configuration de l'application

export const config = {
  // URL de l'API backend
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  // Rate limiting (nombre d'emails par minute)
  emailsPerMinute: 30,

  // Délai entre chaque email (millisecondes)
  delayBetweenEmails: 2000, // 2 secondes par défaut

  // Taille maximale des pièces jointes (en Mo)
  maxAttachmentSize: 5,

  // Formats de fichiers acceptés pour l'upload
  acceptedFileFormats: ['.xlsx', '.xls', '.csv'],

  // Formats de pièces jointes acceptés
  acceptedAttachmentFormats: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
};
