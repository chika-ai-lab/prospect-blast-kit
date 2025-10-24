import { useEffect } from "react";

export interface CampaignDraft {
  subject: string;
  message: string;
  htmlContent: string;
  useHTML: boolean;
  emailsPerMinute: number;
  delayBetweenEmails: number;
  timestamp: number;
}

const DRAFT_KEY = "prospect-blast-draft";
const DRAFT_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

export const useCampaignDraft = () => {
  /**
   * Sauvegarde le brouillon dans localStorage
   */
  const saveDraft = (draft: Omit<CampaignDraft, "timestamp">) => {
    try {
      const draftWithTimestamp: CampaignDraft = {
        ...draft,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du brouillon:", error);
    }
  };

  /**
   * Charge le brouillon depuis localStorage
   */
  const loadDraft = (): CampaignDraft | null => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return null;

      const draft: CampaignDraft = JSON.parse(saved);

      // Vérifier si le brouillon n'est pas expiré
      if (Date.now() - draft.timestamp > DRAFT_EXPIRY) {
        clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error("Erreur lors du chargement du brouillon:", error);
      return null;
    }
  };

  /**
   * Supprime le brouillon de localStorage
   */
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression du brouillon:", error);
    }
  };

  /**
   * Vérifie si un brouillon existe
   */
  const hasDraft = (): boolean => {
    const draft = loadDraft();
    return draft !== null;
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
};
