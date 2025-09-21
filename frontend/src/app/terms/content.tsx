export type Language = "fr" | "en";

export interface ContentSection {
  title: string;
  content: string;
}

export interface TermsContent {
  title: string;
  sections: ContentSection[];
}

export const termsContent: Record<Language, TermsContent> = {
  fr: {
    title: "Politique de Confidentialité",
    sections: [
      {
        title: "",
        content: "Chez Bottes & Jambes, la protection de vos données personnelles est une priorité. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site ou effectuez un achat."
      },
      {
        title: "Informations collectées",
        content: "Nous pouvons collecter les informations suivantes :\n• Nom, prénom et coordonnées (adresse, e-mail, numéro de téléphone)\n• Informations de paiement (traitées de manière sécurisée via nos prestataires)\n• Historique de commandes et préférences d'achat\n• Données techniques (adresse IP, type de navigateur, cookies)"
      },
      {
        title: "Utilisation des informations",
        content: "Vos informations sont utilisées pour :\n• Traiter vos commandes et expéditions\n• Communiquer avec vous concernant vos achats ou nos promotions\n• Améliorer nos produits et services\n• Respecter nos obligations légales"
      },
      {
        title: "Partage des données",
        content: "Nous ne partageons vos données qu'avec :\n• Nos prestataires de paiement et de livraison\n• Les services techniques nécessaires au fonctionnement du site\n\nVos données ne sont jamais revendues à des tiers."
      },
      {
        title: "Cookies",
        content: "Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser l'utilisation du site. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur."
      },
      {
        title: "Sécurité",
        content: "Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé."
      },
      {
        title: "Vos droits",
        content: "Conformément à la réglementation applicable, vous disposez de droits d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles.\n\nPour exercer ces droits, contactez-nous à Bootes&Jambes@gmail.com"
      },
      {
        title: "Modifications",
        content: "Cette politique peut être modifiée. Nous vous informerons de tout changement important."
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    sections: [
      {
        title: "",
        content: "At Bottes & Jambes, protecting your personal data is a priority. This privacy policy explains how we collect, use, and protect your information when you visit our site or make a purchase."
      },
      {
        title: "Information Collected",
        content: "We may collect the following information:\n• Name, first name, and contact details (address, email, phone number)\n• Payment information (processed securely through our providers)\n• Order history and purchase preferences\n• Technical data (IP address, browser type, cookies)"
      },
      {
        title: "Use of Information",
        content: "Your information is used to:\n• Process your orders and shipments\n• Communicate with you regarding your purchases or our promotions\n• Improve our products and services\n• Comply with our legal obligations"
      },
      {
        title: "Data Sharing",
        content: "We only share your data with:\n• Our payment and delivery providers\n• Technical services necessary for site operation\n\nYour data is never resold to third parties."
      },
      {
        title: "Cookies",
        content: "We use cookies to improve your browsing experience and analyze site usage. You can manage your cookie preferences in your browser settings."
      },
      {
        title: "Security",
        content: "We implement technical and organizational security measures to protect your data from unauthorized access."
      },
      {
        title: "Your Rights",
        content: "In accordance with applicable regulations, you have rights of access, rectification, deletion, and opposition regarding your personal data.\n\nTo exercise these rights, contact us at Bootes&Jambes@gmail.com"
      },
      {
        title: "Modifications",
        content: "This policy may be modified. We will inform you of any significant changes."
      }
    ]
  }
};