# Format du Fichier Excel pour l'Envoi d'Emails

Le fichier Excel doit contenir les données des destinataires. Une colonne email est obligatoire pour l'envoi des messages. Les autres colonnes sont optionnelles et peuvent être utilisées pour personnaliser les messages.

## Colonnes Attendues

| Nom de la Colonne            | Type  | Obligatoire | Description                   | Exemple             |
| ---------------------------- | ----- | ----------- | ----------------------------- | ------------------- |
| Email / Mail / Adresse Email | Texte | Oui         | Adresse email du destinataire | contact@exemple.com |
| Nom                          | Texte | Non         | Nom du destinataire           | Dupont              |
| Prénom                       | Texte | Non         | Prénom du destinataire        | Jean                |
| Société / Entreprise         | Texte | Non         | Nom de l'entreprise           | ABC Corp            |
| Poste / Fonction             | Texte | Non         | Poste occupé                  | Directeur Marketing |
| Téléphone                    | Texte | Non         | Numéro de téléphone           | +33 1 23 45 67 89   |
| Ville                        | Texte | Non         | Ville du destinataire         | Paris               |
| Pays                         | Texte | Non         | Pays du destinataire          | France              |

## Notes Importantes

- **Colonne Email Obligatoire** : Le fichier doit contenir au moins une colonne dont le nom inclut "email" ou "mail" (insensible à la casse).
- **Variables Personnalisables** : Toutes les colonnes peuvent être utilisées dans le sujet et le corps du message en utilisant la syntaxe `{{NomColonne}}`.
- **Format** : Le fichier doit être au format Excel (.xlsx ou .xls) ou CSV.
- **Encodage** : Pour les fichiers CSV, utilisez l'encodage UTF-8 pour éviter les problèmes de caractères spéciaux.

## Exemple de Fichier Excel

| Email                    | Prénom | Nom    | Société  |
| ------------------------ | ------ | ------ | -------- |
| jean.dupont@exemple.com  | Jean   | Dupont | ABC Corp |
| marie.martin@exemple.com | Marie  | Martin | XYZ Ltd  |

## Utilisation des Variables

Dans le sujet ou le message, vous pouvez utiliser :

- `{{Prénom}}` → Jean
- `{{Nom}}` → Dupont
- `{{Société}}` → ABC Corp

Exemple de message personnalisé :

```
Bonjour {{Prénom}} {{Nom}},

Nous sommes ravis de vous contacter depuis {{Société}}.

Cordialement,
Votre équipe
```
