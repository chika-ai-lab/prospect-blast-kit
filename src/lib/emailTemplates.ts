// Bibliothèque de templates d'emails HTML

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: "prospection" | "relance" | "newsletter" | "evenement" | "autre";
  subject: string;
  html: string;
  plainText: string;
  variables: string[];
  preview?: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "prospection-simple",
    name: "Prospection Simple",
    description: "Email de prospection B2B classique",
    category: "prospection",
    subject: "{{Prénom}}, une solution pour {{Société}}",
    plainText: `Bonjour {{Prénom}},

Je m'appelle {{ExpéditeurNom}} et je travaille chez {{ExpéditeurSociété}}.

J'ai remarqué que {{Société}} pourrait bénéficier de notre solution pour [problème/besoin].

Seriez-vous disponible pour un appel de 15 minutes cette semaine ?

Cordialement,
{{ExpéditeurNom}}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #081630;">Bonjour {{Prénom}},</h2>

  <p style="color: #555; line-height: 1.6;">
    Je m'appelle <strong>{{ExpéditeurNom}}</strong> et je travaille chez <strong>{{ExpéditeurSociété}}</strong>.
  </p>

  <p style="color: #555; line-height: 1.6;">
    J'ai remarqué que <strong>{{Société}}</strong> pourrait bénéficier de notre solution pour [problème/besoin].
  </p>

  <p style="color: #555; line-height: 1.6;">
    Seriez-vous disponible pour un appel de 15 minutes cette semaine ?
  </p>

  <div style="margin: 30px 0;">
    <a href="{{LienRDV}}" style="background-color: #f58630; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Réserver un créneau
    </a>
  </div>

  <p style="color: #555; line-height: 1.6;">
    Cordialement,<br>
    <strong>{{ExpéditeurNom}}</strong>
  </p>
</div>`,
    variables: ["Prénom", "Société", "ExpéditeurNom", "ExpéditeurSociété", "LienRDV"],
  },
  {
    id: "relance-1",
    name: "Relance après 1ère prise de contact",
    description: "Email de relance suite à un premier échange",
    category: "relance",
    subject: "Re: Notre échange à propos de {{Société}}",
    plainText: `Bonjour {{Prénom}},

Je reviens vers vous suite à mon précédent email concernant {{Société}}.

Avez-vous eu l'occasion d'y réfléchir ?

Je reste à votre disposition pour en discuter.

Bien cordialement,
{{ExpéditeurNom}}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">Bonjour {{Prénom}},</h2>

  <p style="color: #555; line-height: 1.6;">
    Je reviens vers vous suite à mon précédent email concernant <strong>{{Société}}</strong>.
  </p>

  <p style="color: #555; line-height: 1.6;">
    Avez-vous eu l'occasion d'y réfléchir ?
  </p>

  <p style="color: #555; line-height: 1.6;">
    Je reste à votre disposition pour en discuter.
  </p>

  <p style="color: #555; line-height: 1.6;">
    Bien cordialement,<br>
    <strong>{{ExpéditeurNom}}</strong>
  </p>
</div>`,
    variables: ["Prénom", "Société", "ExpéditeurNom"],
  },
  {
    id: "invitation-evenement",
    name: "Invitation à un événement",
    description: "Invitation personnalisée à un webinar ou événement",
    category: "evenement",
    subject: "{{Prénom}}, invitation exclusive à notre événement",
    plainText: `Bonjour {{Prénom}},

Nous organisons un événement exclusif le {{DateEvenement}} et j'aimerais vous y convier.

Thème : {{ThemeEvenement}}

Cet événement sera l'occasion de découvrir {{Sujet}} et d'échanger avec d'autres professionnels de {{Secteur}}.

Inscrivez-vous dès maintenant : {{LienInscription}}

Au plaisir de vous y retrouver !

{{ExpéditeurNom}}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: white; padding: 30px; border-radius: 10px;">
    <h1 style="color: #f58630; text-align: center; margin-bottom: 20px;">Invitation Exclusive</h1>

    <h2 style="color: #081630;">Bonjour {{Prénom}},</h2>

    <p style="color: #555; line-height: 1.6;">
      Nous organisons un événement exclusif le <strong>{{DateEvenement}}</strong> et j'aimerais vous y convier.
    </p>

    <div style="background-color: #fff5ed; padding: 20px; border-left: 4px solid #f58630; margin: 20px 0;">
      <h3 style="color: #f58630; margin: 0 0 10px 0;">{{ThemeEvenement}}</h3>
      <p style="color: #666; margin: 0;">
        Découvrez {{Sujet}} et échangez avec d'autres professionnels de {{Secteur}}.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{LienInscription}}" style="background-color: #f58630; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        M'inscrire maintenant
      </a>
    </div>

    <p style="color: #555; line-height: 1.6; text-align: center;">
      Au plaisir de vous y retrouver !<br>
      <strong>{{ExpéditeurNom}}</strong>
    </p>
  </div>
</div>`,
    variables: ["Prénom", "DateEvenement", "ThemeEvenement", "Sujet", "Secteur", "LienInscription", "ExpéditeurNom"],
  },
  {
    id: "newsletter-simple",
    name: "Newsletter Simple",
    description: "Template de newsletter minimaliste",
    category: "newsletter",
    subject: "{{TitreNewsletter}} - {{Mois}} {{Année}}",
    plainText: `Bonjour {{Prénom}},

Voici les actualités du mois :

{{Contenu}}

À très bientôt !

{{ExpéditeurNom}}
{{ExpéditeurSociété}}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #081630; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">{{TitreNewsletter}}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">{{Mois}} {{Année}}</p>
  </div>

  <div style="background-color: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #081630;">Bonjour {{Prénom}},</h2>

    <div style="color: #555; line-height: 1.8; margin: 20px 0;">
      {{Contenu}}
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #888; font-size: 14px; text-align: center;">
      {{ExpéditeurNom}}<br>
      {{ExpéditeurSociété}}
    </p>
  </div>
</div>`,
    variables: ["Prénom", "TitreNewsletter", "Mois", "Année", "Contenu", "ExpéditeurNom", "ExpéditeurSociété"],
  },
  {
    id: "offre-speciale",
    name: "Offre Spéciale",
    description: "Promotion ou offre limitée dans le temps",
    category: "prospection",
    subject: "{{Prénom}}, offre exclusive pour {{Société}}",
    plainText: `Bonjour {{Prénom}},

Bonne nouvelle ! Nous avons une offre spéciale pour {{Société}}.

{{DescriptionOffre}}

Cette offre est valable jusqu'au {{DateFin}}.

Pour en profiter : {{LienOffre}}

Cordialement,
{{ExpéditeurNom}}`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #081630 0%, #0a2d5c 100%);">
  <div style="background-color: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="background-color: #f58630; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">
        OFFRE EXCLUSIVE
      </span>
    </div>

    <h2 style="color: #081630;">Bonjour {{Prénom}},</h2>

    <p style="color: #555; line-height: 1.6; font-size: 16px;">
      Bonne nouvelle ! Nous avons une offre spéciale pour <strong>{{Société}}</strong>.
    </p>

    <div style="background: linear-gradient(135deg, #fff5ed 0%, #fef3e8 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f58630;">
      <p style="color: #333; line-height: 1.6; margin: 0;">
        {{DescriptionOffre}}
      </p>
    </div>

    <div style="background-color: #fff5ed; padding: 15px; border-left: 4px solid #f58630; margin: 20px 0;">
      <p style="color: #c2410c; margin: 0;">
        ⏰ <strong>Offre valable jusqu'au {{DateFin}}</strong>
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{LienOffre}}" style="background: linear-gradient(135deg, #f58630 0%, #ea6e1a 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; font-size: 16px;">
        Profiter de l'offre
      </a>
    </div>

    <p style="color: #555; line-height: 1.6;">
      Cordialement,<br>
      <strong>{{ExpéditeurNom}}</strong>
    </p>
  </div>
</div>`,
    variables: ["Prénom", "Société", "DescriptionOffre", "DateFin", "LienOffre", "ExpéditeurNom"],
  },
];

export const getTemplatesByCategory = (category: EmailTemplate["category"]) => {
  return emailTemplates.filter((template) => template.category === category);
};

export const getTemplateById = (id: string) => {
  return emailTemplates.find((template) => template.id === id);
};

export const getTemplateCategories = () => {
  return Array.from(new Set(emailTemplates.map((t) => t.category)));
};
