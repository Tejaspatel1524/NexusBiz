/**
 * Translations for multi-language support
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

export const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
};

export type TranslationKey = keyof typeof translations.en;

export const translations = {
    en: {
        // Navbar
        home: 'Home',
        generator: 'Generator',
        dashboard: 'Dashboard',
        pricing: 'Pricing',
        about: 'About',
        settings: 'Settings',
        login: 'Login',
        logout: 'Logout',

        // Landing Page
        heroTitle: 'Transform Ideas Into',
        heroBusiness: 'Business',
        heroSubtitle: 'AI-powered business idea generator that turns your skills and resources into actionable ventures',
        getStarted: 'Get Started',
        learnMore: 'Learn More',

        // Generator
        stepOne: 'Industry & Market',
        stepTwo: 'Budget & Timeline',
        stepThree: 'Skills & Experience',
        stepFour: 'Preferences',
        nextStep: 'Next Step',
        previousStep: 'Previous',
        initiateSynthesis: 'Initiate Synthesis',
        selectIndustry: 'Select Industry',
        selectBudget: 'Select Budget',
        selectTimeline: 'Select Timeline',

        // Results
        yourBusinessIdeas: 'Your Business Ideas',
        generatedIdeas: 'Generated Ideas',
        viewDetails: 'View Details',
        generatePlan: 'Generate Plan',
        noIdeasYet: 'No ideas generated yet',
        goToGenerator: 'Go to Generator',

        // Pricing
        pricingTitle: 'Simple, Transparent Pricing',
        pricingSubtitle: 'Choose the plan that fits your entrepreneurial journey',
        starter: 'Starter',
        professional: 'Professional',
        enterprise: 'Enterprise',
        free: 'Free',
        perMonth: '/month',
        startFreeTrial: 'Start Free Trial',
        contactSales: 'Contact Sales',

        // About
        aboutHeroTitle: 'Turning Ideas Into Businesses',
        ourMission: 'Our Mission',
        whyChooseUs: 'Why Choose NexusBiz',
        poweredByAI: 'Powered By AI',
        readyToStart: 'Ready to Start Your Journey?',
        generateFirstIdea: 'Generate Your First Idea',

        // Settings
        settingsTitle: 'Settings',
        customizeExperience: 'Customize your NexusBiz experience',
        notifications: 'Notifications',
        pushNotifications: 'Push Notifications',
        emailUpdates: 'Email Updates',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        language: 'Language',
        aiPerformance: 'AI & Performance',
        autoSaveIdeas: 'Auto-save Ideas',
        usageAnalytics: 'Usage Analytics',
        privacy: 'Privacy',
        saveSettings: 'Save Settings',
        saved: 'Saved!',
        localProcessingActive: 'Local AI Processing Active',

        // Login
        loginTitle: 'Login',
        signUp: 'Sign Up',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        createAccount: 'Create Account',
        continueAsGuest: 'Continue as Guest',
        or: 'or',

        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
    },

    es: {
        // Navbar
        home: 'Inicio',
        generator: 'Generador',
        dashboard: 'Panel',
        pricing: 'Precios',
        about: 'Acerca de',
        settings: 'Configuración',
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',

        // Landing Page
        heroTitle: 'Transforma Ideas En',
        heroBusiness: 'Negocios',
        heroSubtitle: 'Generador de ideas de negocio impulsado por IA que convierte tus habilidades en empresas viables',
        getStarted: 'Comenzar',
        learnMore: 'Saber Más',

        // Generator
        stepOne: 'Industria y Mercado',
        stepTwo: 'Presupuesto y Plazo',
        stepThree: 'Habilidades y Experiencia',
        stepFour: 'Preferencias',
        nextStep: 'Siguiente',
        previousStep: 'Anterior',
        initiateSynthesis: 'Iniciar Síntesis',
        selectIndustry: 'Seleccionar Industria',
        selectBudget: 'Seleccionar Presupuesto',
        selectTimeline: 'Seleccionar Plazo',

        // Results
        yourBusinessIdeas: 'Tus Ideas de Negocio',
        generatedIdeas: 'Ideas Generadas',
        viewDetails: 'Ver Detalles',
        generatePlan: 'Generar Plan',
        noIdeasYet: 'Aún no hay ideas generadas',
        goToGenerator: 'Ir al Generador',

        // Pricing
        pricingTitle: 'Precios Simples y Transparentes',
        pricingSubtitle: 'Elige el plan que se adapte a tu viaje emprendedor',
        starter: 'Inicial',
        professional: 'Profesional',
        enterprise: 'Empresarial',
        free: 'Gratis',
        perMonth: '/mes',
        startFreeTrial: 'Prueba Gratis',
        contactSales: 'Contactar Ventas',

        // About
        aboutHeroTitle: 'Convirtiendo Ideas En Negocios',
        ourMission: 'Nuestra Misión',
        whyChooseUs: 'Por Qué Elegir NexusBiz',
        poweredByAI: 'Impulsado Por IA',
        readyToStart: '¿Listo Para Comenzar Tu Viaje?',
        generateFirstIdea: 'Genera Tu Primera Idea',

        // Settings
        settingsTitle: 'Configuración',
        customizeExperience: 'Personaliza tu experiencia NexusBiz',
        notifications: 'Notificaciones',
        pushNotifications: 'Notificaciones Push',
        emailUpdates: 'Actualizaciones por Email',
        appearance: 'Apariencia',
        darkMode: 'Modo Oscuro',
        language: 'Idioma',
        aiPerformance: 'IA y Rendimiento',
        autoSaveIdeas: 'Auto-guardar Ideas',
        usageAnalytics: 'Análisis de Uso',
        privacy: 'Privacidad',
        saveSettings: 'Guardar Configuración',
        saved: '¡Guardado!',
        localProcessingActive: 'Procesamiento Local de IA Activo',

        // Login
        loginTitle: 'Iniciar Sesión',
        signUp: 'Registrarse',
        fullName: 'Nombre Completo',
        emailAddress: 'Correo Electrónico',
        password: 'Contraseña',
        forgotPassword: '¿Olvidaste tu contraseña?',
        createAccount: 'Crear Cuenta',
        continueAsGuest: 'Continuar como Invitado',
        or: 'o',

        // Common
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        submit: 'Enviar',
    },

    fr: {
        // Navbar
        home: 'Accueil',
        generator: 'Générateur',
        dashboard: 'Tableau de Bord',
        pricing: 'Tarifs',
        about: 'À Propos',
        settings: 'Paramètres',
        login: 'Connexion',
        logout: 'Déconnexion',

        // Landing Page
        heroTitle: 'Transformez Vos Idées En',
        heroBusiness: 'Entreprise',
        heroSubtitle: 'Générateur d\'idées d\'entreprise alimenté par l\'IA qui transforme vos compétences en ventures réalisables',
        getStarted: 'Commencer',
        learnMore: 'En Savoir Plus',

        // Generator
        stepOne: 'Industrie et Marché',
        stepTwo: 'Budget et Délai',
        stepThree: 'Compétences et Expérience',
        stepFour: 'Préférences',
        nextStep: 'Étape Suivante',
        previousStep: 'Précédent',
        initiateSynthesis: 'Lancer la Synthèse',
        selectIndustry: 'Sélectionner l\'Industrie',
        selectBudget: 'Sélectionner le Budget',
        selectTimeline: 'Sélectionner le Délai',

        // Results
        yourBusinessIdeas: 'Vos Idées d\'Entreprise',
        generatedIdeas: 'Idées Générées',
        viewDetails: 'Voir les Détails',
        generatePlan: 'Générer un Plan',
        noIdeasYet: 'Aucune idée générée pour l\'instant',
        goToGenerator: 'Aller au Générateur',

        // Pricing
        pricingTitle: 'Tarification Simple et Transparente',
        pricingSubtitle: 'Choisissez le plan qui correspond à votre parcours entrepreneurial',
        starter: 'Débutant',
        professional: 'Professionnel',
        enterprise: 'Entreprise',
        free: 'Gratuit',
        perMonth: '/mois',
        startFreeTrial: 'Essai Gratuit',
        contactSales: 'Contacter les Ventes',

        // About
        aboutHeroTitle: 'Transformer les Idées en Entreprises',
        ourMission: 'Notre Mission',
        whyChooseUs: 'Pourquoi Choisir NexusBiz',
        poweredByAI: 'Propulsé par l\'IA',
        readyToStart: 'Prêt à Commencer Votre Voyage?',
        generateFirstIdea: 'Générez Votre Première Idée',

        // Settings
        settingsTitle: 'Paramètres',
        customizeExperience: 'Personnalisez votre expérience NexusBiz',
        notifications: 'Notifications',
        pushNotifications: 'Notifications Push',
        emailUpdates: 'Mises à Jour par Email',
        appearance: 'Apparence',
        darkMode: 'Mode Sombre',
        language: 'Langue',
        aiPerformance: 'IA et Performance',
        autoSaveIdeas: 'Sauvegarde Auto des Idées',
        usageAnalytics: 'Analyse d\'Utilisation',
        privacy: 'Confidentialité',
        saveSettings: 'Enregistrer les Paramètres',
        saved: 'Enregistré!',
        localProcessingActive: 'Traitement IA Local Actif',

        // Login
        loginTitle: 'Connexion',
        signUp: 'S\'inscrire',
        fullName: 'Nom Complet',
        emailAddress: 'Adresse Email',
        password: 'Mot de Passe',
        forgotPassword: 'Mot de passe oublié?',
        createAccount: 'Créer un Compte',
        continueAsGuest: 'Continuer en tant qu\'Invité',
        or: 'ou',

        // Common
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
        submit: 'Soumettre',
    },

    de: {
        // Navbar
        home: 'Startseite',
        generator: 'Generator',
        dashboard: 'Dashboard',
        pricing: 'Preise',
        about: 'Über Uns',
        settings: 'Einstellungen',
        login: 'Anmelden',
        logout: 'Abmelden',

        // Landing Page
        heroTitle: 'Verwandeln Sie Ideen In',
        heroBusiness: 'Geschäft',
        heroSubtitle: 'KI-gestützter Geschäftsideen-Generator, der Ihre Fähigkeiten in umsetzbare Unternehmungen verwandelt',
        getStarted: 'Loslegen',
        learnMore: 'Mehr Erfahren',

        // Generator
        stepOne: 'Branche & Markt',
        stepTwo: 'Budget & Zeitrahmen',
        stepThree: 'Fähigkeiten & Erfahrung',
        stepFour: 'Präferenzen',
        nextStep: 'Nächster Schritt',
        previousStep: 'Zurück',
        initiateSynthesis: 'Synthese Starten',
        selectIndustry: 'Branche Wählen',
        selectBudget: 'Budget Wählen',
        selectTimeline: 'Zeitrahmen Wählen',

        // Results
        yourBusinessIdeas: 'Ihre Geschäftsideen',
        generatedIdeas: 'Generierte Ideen',
        viewDetails: 'Details Anzeigen',
        generatePlan: 'Plan Erstellen',
        noIdeasYet: 'Noch keine Ideen generiert',
        goToGenerator: 'Zum Generator',

        // Pricing
        pricingTitle: 'Einfache, Transparente Preise',
        pricingSubtitle: 'Wählen Sie den Plan, der zu Ihrer unternehmerischen Reise passt',
        starter: 'Starter',
        professional: 'Professionell',
        enterprise: 'Unternehmen',
        free: 'Kostenlos',
        perMonth: '/Monat',
        startFreeTrial: 'Kostenlos Testen',
        contactSales: 'Vertrieb Kontaktieren',

        // About
        aboutHeroTitle: 'Ideen in Unternehmen Verwandeln',
        ourMission: 'Unsere Mission',
        whyChooseUs: 'Warum NexusBiz Wählen',
        poweredByAI: 'Powered by KI',
        readyToStart: 'Bereit, Ihre Reise zu Beginnen?',
        generateFirstIdea: 'Generieren Sie Ihre Erste Idee',

        // Settings
        settingsTitle: 'Einstellungen',
        customizeExperience: 'Passen Sie Ihre NexusBiz-Erfahrung an',
        notifications: 'Benachrichtigungen',
        pushNotifications: 'Push-Benachrichtigungen',
        emailUpdates: 'E-Mail-Updates',
        appearance: 'Erscheinungsbild',
        darkMode: 'Dunkelmodus',
        language: 'Sprache',
        aiPerformance: 'KI & Leistung',
        autoSaveIdeas: 'Ideen Auto-Speichern',
        usageAnalytics: 'Nutzungsanalyse',
        privacy: 'Datenschutz',
        saveSettings: 'Einstellungen Speichern',
        saved: 'Gespeichert!',
        localProcessingActive: 'Lokale KI-Verarbeitung Aktiv',

        // Login
        loginTitle: 'Anmelden',
        signUp: 'Registrieren',
        fullName: 'Vollständiger Name',
        emailAddress: 'E-Mail-Adresse',
        password: 'Passwort',
        forgotPassword: 'Passwort vergessen?',
        createAccount: 'Konto Erstellen',
        continueAsGuest: 'Als Gast Fortfahren',
        or: 'oder',

        // Common
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        cancel: 'Abbrechen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        close: 'Schließen',
        back: 'Zurück',
        next: 'Weiter',
        submit: 'Absenden',
    },

    ja: {
        // Navbar
        home: 'ホーム',
        generator: 'ジェネレーター',
        dashboard: 'ダッシュボード',
        pricing: '料金',
        about: '概要',
        settings: '設定',
        login: 'ログイン',
        logout: 'ログアウト',

        // Landing Page
        heroTitle: 'アイデアを',
        heroBusiness: 'ビジネスに',
        heroSubtitle: 'あなたのスキルとリソースを実行可能なベンチャーに変えるAI搭載のビジネスアイデアジェネレーター',
        getStarted: '始める',
        learnMore: '詳しく見る',

        // Generator
        stepOne: '業界と市場',
        stepTwo: '予算とタイムライン',
        stepThree: 'スキルと経験',
        stepFour: '好み',
        nextStep: '次へ',
        previousStep: '前へ',
        initiateSynthesis: '合成を開始',
        selectIndustry: '業界を選択',
        selectBudget: '予算を選択',
        selectTimeline: 'タイムラインを選択',

        // Results
        yourBusinessIdeas: 'あなたのビジネスアイデア',
        generatedIdeas: '生成されたアイデア',
        viewDetails: '詳細を見る',
        generatePlan: 'プランを生成',
        noIdeasYet: 'まだアイデアがありません',
        goToGenerator: 'ジェネレーターへ',

        // Pricing
        pricingTitle: 'シンプルで透明な料金',
        pricingSubtitle: 'あなたの起業家の旅に合ったプランを選択',
        starter: 'スターター',
        professional: 'プロフェッショナル',
        enterprise: 'エンタープライズ',
        free: '無料',
        perMonth: '/月',
        startFreeTrial: '無料トライアル開始',
        contactSales: '営業に連絡',

        // About
        aboutHeroTitle: 'アイデアをビジネスに変える',
        ourMission: '私たちの使命',
        whyChooseUs: 'NexusBizを選ぶ理由',
        poweredByAI: 'AIパワード',
        readyToStart: '旅を始める準備はできましたか？',
        generateFirstIdea: '最初のアイデアを生成',

        // Settings
        settingsTitle: '設定',
        customizeExperience: 'NexusBiz体験をカスタマイズ',
        notifications: '通知',
        pushNotifications: 'プッシュ通知',
        emailUpdates: 'メール更新',
        appearance: '外観',
        darkMode: 'ダークモード',
        language: '言語',
        aiPerformance: 'AIとパフォーマンス',
        autoSaveIdeas: 'アイデアを自動保存',
        usageAnalytics: '使用分析',
        privacy: 'プライバシー',
        saveSettings: '設定を保存',
        saved: '保存しました！',
        localProcessingActive: 'ローカルAI処理がアクティブ',

        // Login
        loginTitle: 'ログイン',
        signUp: 'サインアップ',
        fullName: '氏名',
        emailAddress: 'メールアドレス',
        password: 'パスワード',
        forgotPassword: 'パスワードをお忘れですか？',
        createAccount: 'アカウントを作成',
        continueAsGuest: 'ゲストとして続行',
        or: 'または',

        // Common
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        save: '保存',
        delete: '削除',
        edit: '編集',
        close: '閉じる',
        back: '戻る',
        next: '次へ',
        submit: '送信',
    },
};

export const getTranslation = (lang: Language, key: TranslationKey): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
};
