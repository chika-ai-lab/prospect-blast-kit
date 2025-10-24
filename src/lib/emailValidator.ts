// Validation et nettoyage des emails

export interface EmailValidationResult {
  validEmails: string[];
  invalidEmails: string[];
  duplicates: string[];
  cleanedData: any[];
}

/**
 * Valide le format d'un email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  // Regex améliorée pour validation email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Normalise un email (trim + lowercase)
 */
export const normalizeEmail = (email: unknown): string => {
  if (!email) return '';
  return String(email).trim().toLowerCase();
};

/**
 * Détecte les doublons dans une liste d'emails
 */
export const findDuplicates = (emails: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  emails.forEach(email => {
    const normalized = normalizeEmail(email);
    if (seen.has(normalized)) {
      duplicates.add(normalized);
    } else {
      seen.add(normalized);
    }
  });

  return Array.from(duplicates);
};

/**
 * Valide et nettoie une liste de données Excel
 */
export const validateAndCleanEmails = (
  data: any[],
  emailColumnName: string
): EmailValidationResult => {
  const validEmails: string[] = [];
  const invalidEmails: string[] = [];
  const cleanedData: any[] = [];
  const seenEmails = new Set<string>();

  data.forEach((row, index) => {
    const rawEmail = row[emailColumnName];
    const email = normalizeEmail(rawEmail);

    // Vérifier si l'email est vide
    if (!email) {
      invalidEmails.push(`Ligne ${index + 2}: Email vide`);
      return;
    }

    // Vérifier le format
    if (!isValidEmail(email)) {
      invalidEmails.push(`Ligne ${index + 2}: Format invalide - ${email}`);
      return;
    }

    // Vérifier les doublons
    if (seenEmails.has(email)) {
      // On ne l'ajoute pas, c'est un doublon
      return;
    }

    // Email valide et unique
    seenEmails.add(email);
    validEmails.push(email);
    cleanedData.push({ ...row, [emailColumnName]: email });
  });

  // Trouver les doublons dans les données originales
  const allEmails = data.map(row => normalizeEmail(row[emailColumnName])).filter(e => e);
  const duplicates = findDuplicates(allEmails);

  return {
    validEmails,
    invalidEmails,
    duplicates,
    cleanedData,
  };
};

/**
 * Compte les statistiques de validation
 */
export const getValidationStats = (result: EmailValidationResult) => {
  return {
    total: result.validEmails.length + result.invalidEmails.length + result.duplicates.length,
    valid: result.validEmails.length,
    invalid: result.invalidEmails.length,
    duplicates: result.duplicates.length,
  };
};
