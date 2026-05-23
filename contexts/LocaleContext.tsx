import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type Locale = 'en' | 'pt-PT';
type Translations = Record<string, any>;

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, replacements?: Record<string, string | number>) => any;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'celestial-capture-locale';

// Inline translations to avoid loading issues
const enTranslations = {
  "edit": "Edit",
  "login": {
    "title": "Admin Login",
    "usernameLabel": "Username",
    "passwordLabel": "Password",
    "loginButton": "Login",
    "error": "Invalid username or password."
  },
  "logoutConfirm": {
    "title": "Confirm Logout",
    "message": "Are you sure you want to log out of the admin session?",
    "cancel": "Cancel",
    "logout": "Logout"
  },
  "header": {
    "title": "Celestial",
    "titleHighlight": "Capture",
    "gallery": "Gallery",
    "blog": "Blog",
    "stargazing": "Stargazing",
    "adminLogin": "Admin Login",
    "logout": "Logout"
  },
  "hero": {
    "subtitle": "Exploring the cosmos through the lens. A personal journey into astrophotography.",
    "exploreButton": "Explore Gallery"
  },
  "search": {
    "photoPlaceholder": "Search photos by title or tag..."
  },
  "sort": {
    "label": "Sort photos by",
    "newest": "Newest First",
    "oldest": "Oldest First",
    "rating": "Highest Rated",
    "title": "Title (A-Z)"
  },
  "ratingFilter": {
    "label": "Filter by minimum rating:",
    "any": "Any",
    "clear": "Clear",
    "clearAriaLabel": "Clear rating filter"
  },
  "tagFilter": {
    "clear": "Clear Filters"
  },
  "gallery": {
    "uploadButton": "Upload Your Photo",
    "processing": "Processing...",
    "untitled": "Untitled",
    "uploadError": "Could not process the image file.",
    "invalidFileType": "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
    "noPhotosFound": {
      "title": "No Photos Found",
      "subtitle": "Try adjusting your search or filter criteria to find what you're looking for."
    },
    "dropzone": {
      "title": "Drop image to upload",
      "subtitle": "Only JPEG, PNG, or WebP files are accepted."
    }
  },
  "photoCard": {
    "viewDetails": "View details for {{title}}"
  },
  "photoDetail": {
    "viewFullscreen": "View fullscreen",
    "titlePlaceholder": "Enter a title",
    "ratingLabel": "Rating:",
    "descriptionPlaceholderAdmin": "Add a description... or generate one with AI!",
    "descriptionPlaceholderUser": "No description available.",
    "resolution": "Resolution",
    "fileSize": "File Size",
    "aperture": "Aperture",
    "exposure": "Exposure",
    "generating": "Conjuring Words...",
    "generateButton": "Generate AI Details",
    "regenerateButton": "Regenerate AI Details",
    "generateError": "Description can only be generated for newly uploaded photos with valid image data.",
    "generateErrorApi": "An error occurred while communicating with the cosmos.",
    "generateTooltip": "AI Details are only available for newly uploaded photos.",
    "addTagPlaceholder": "Add a tag and press Enter",
    "setFeaturedButton": "Set as Photo of the Week",
    "saveButton": "Save Changes",
    "undo": "Undo change",
    "redo": "Redo change",
    "deleteButton": "Delete photo",
    "deleteButtonAria": "Delete photo: {{title}}",
    "undoAria": "Undo changes to {{title}}",
    "redoAria": "Redo changes to {{title}}",
    "confirmDeleteTitle": "Confirm Deletion",
    "confirmDeleteMessage": "Are you sure you want to permanently delete \"{{title}}\"? This action cannot be undone.",
    "cancelButton": "Cancel"
  },
  "fullscreen": {
    "close": "Close fullscreen view (Esc)",
    "zoomOut": "Zoom out (-)",
    "resetZoom": "Reset zoom (0 or R)",
    "zoomIn": "Zoom in (+)",
    "scroll": "Scroll",
    "toZoom": "to Zoom",
    "arrows": "Arrows",
    "toPan": "to Pan",
    "esc": "Esc",
    "toClose": "to Close"
  },
  "relatedPhotos": {
    "title": "Related Photos"
  },
  "photoOfWeek": {
    "badge": "Photo of the Week",
    "capturedOn": "Captured on {{date}}"
  },
  "blog": {
    "title": "From the Field Journal",
    "addPostButton": "Add New Post",
    "searchPlaceholder": "Search articles by title or excerpt...",
    "readMore": "Read More",
    "noArticlesFound": "No articles found matching your search.",
    "noArticlesHint": "Try a different keyword or clear the search.",
    "inspirationTitle": "Need Inspiration?",
    "inspirationSubtitle": "Let AI help you brainstorm your next astrophotography blog post.",
    "generateIdeasButton": "Generate Blog Ideas"
  },
  "blogPost": {
    "backToBlog": "Back to Blog",
    "share": "Share",
    "shareCopied": "Link Copied!",
    "shareError": "Error!",
    "editPost": "Edit Post",
    "publishedOn": "Published on {{date}}"
  },
  "relatedPosts": {
    "title": "You Might Also Like"
  },
  "comments": {
    "oneComment": "1 Comment",
    "multipleComments": "{{count}} Comments",
    "beFirst": "Be the first to leave a comment!",
    "leaveComment": "Leave a Comment",
    "errorRequired": "Please fill out all required fields.",
    "errorEmail": "Please enter a valid email address.",
    "nameLabel": "Name",
    "emailLabel": "Email (not published)",
    "replyLabel": "Your Reply",
    "commentLabel": "Comment",
    "posting": "Posting...",
    "postReplyButton": "Post Reply",
    "postCommentButton": "Post Comment",
    "cancel": "Cancel",
    "reply": "Reply"
  },
  "editor": {
    "bold": "Bold",
    "italic": "Italic",
    "bulletList": "Bulleted List",
    "imageLabel": "Post Image",
    "imageAlt": "Current post",
    "fromUrl": "From URL",
    "uploadImage": "Upload Image",
    "changeImage": "Change Image",
    "chooseImage": "Choose an Image",
    "cancel": "Cancel",
    "save": "Save Changes"
  },
  "stargazing": {
    "title": "Under the Night Sky",
    "subtitle": "Your guide to the best celestial viewing and photography conditions, tips, and tricks."
  },
  "moon": {
    "title": "Current Moon Phase",
    "illumination": "Illumination",
    "nextPhase": "Next Phase",
    "tonight": "tonight",
    "tomorrow": "tomorrow",
    "inDays": "in {{count}} days",
    "onDate": "on {{date}}",
    "conditionsTitle": "Viewing Conditions",
    "stargazing": "Stargazing",
    "astrophotography": "Astrophotography",
    "phases": [
      "New Moon",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full Moon",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent"
    ],
    "conditions": {
      "newMoon": {
        "stargazing": {
          "rating": "Excellent",
          "ratingKey": "excellent",
          "description": "Dark skies are perfect for spotting faint galaxies and nebulae."
        },
        "astrophotography": {
          "rating": "Excellent (Deep Sky)",
          "ratingKey": "excellent",
          "description": "Ideal conditions for capturing deep-sky objects like the Milky Way."
        }
      },
      "crescent": {
        "stargazing": {
          "rating": "Good",
          "ratingKey": "good",
          "description": "The moon sets early or rises late, providing dark sky windows."
        },
        "astrophotography": {
          "rating": "Good",
          "ratingKey": "good",
          "description": "Great for lunar details along the terminator and still dark enough for brighter deep-sky targets."
        }
      },
      "quarter": {
        "stargazing": {
          "rating": "Fair",
          "ratingKey": "fair",
          "description": "The bright moon will wash out fainter stars."
        },
        "astrophotography": {
          "rating": "Excellent (Lunar)",
          "ratingKey": "excellent",
          "description": "Perfect for capturing detailed crater shots along the terminator. Challenging for nebulae."
        }
      },
      "gibbous": {
        "stargazing": {
          "rating": "Poor",
          "ratingKey": "poor",
          "description": "Significant moonlight will hide all but the brightest stars and planets."
        },
        "astrophotography": {
          "rating": "Challenging (Deep Sky)",
          "ratingKey": "challenging",
          "description": "Focus on bright targets like planets, or shoot the moon itself. Use narrowband filters for nebulae."
        }
      },
      "fullMoon": {
        "stargazing": {
          "rating": "Poor",
          "ratingKey": "poor",
          "description": "The sky is very bright, making it hard to see anything but the moon and brightest planets."
        },
        "astrophotography": {
          "rating": "Lunar & Landscape",
          "ratingKey": "fair",
          "description": "Difficult for deep-sky. Best for moon portraits or moonlit landscape photography."
        }
      }
    }
  },
  "whatsUp": {
    "title": "What's Up Tonight?",
    "planets": {
      "title": "Planet Visibility",
      "list": [
        { "name": "Mercury", "emoji": "☿️", "status": "Difficult to see", "location": "Very low in the west after sunset." },
        { "name": "Venus", "emoji": "♀️", "status": "Not Visible", "location": "Currently too close to the Sun." },
        { "name": "Mars", "emoji": "♂️", "status": "Morning Sky", "location": "Visible in the east before sunrise. Look for a reddish point of light." },
        { "name": "Jupiter", "emoji": "♃", "status": "Evening Sky", "location": "Brilliant and bright in the south after dusk. Impossible to miss." },
        { "name": "Saturn", "emoji": "♄", "status": "Evening Sky", "location": "Visible in the southeast after dusk. Fainter than Jupiter, with a yellowish hue." },
        { "name": "Uranus", "emoji": "♅", "status": "Binoculars Needed", "location": "Near Jupiter, but requires optical aid to be seen as a tiny blue-green dot." },
        { "name": "Neptune", "emoji": "♆", "status": "Telescope Needed", "location": "Requires a telescope and a good star chart to locate." }
      ]
    },
    "meteors": {
      "title": "Meteor Shower Calendar",
      "peak": "Peak",
      "moon": "Moon",
      "list": [
        { "name": "Perseids", "peak": "Aug 12-13", "rate": "~100/hr", "moon": "Waxing Crescent (Favorable)" },
        { "name": "Draconids", "peak": "Oct 8-9", "rate": "Variable", "moon": "Waxing Crescent (Favorable)" },
        { "name": "Orionids", "peak": "Oct 21-22", "rate": "~20/hr", "moon": "Waning Gibbous (Unfavorable)" },
        { "name": "Leonids", "peak": "Nov 17-18", "rate": "~15/hr", "moon": "Full Moon (Poor)" },
        { "name": "Geminids", "peak": "Dec 13-14", "rate": "~150/hr", "moon": "Waning Crescent (Excellent)" },
        { "name": "Quadrantids", "peak": "Jan 3-4", "rate": "~120/hr", "moon": "Waning Crescent (Excellent)" }
      ]
    }
  },
  "milkyWayGuide": {
    "title": "Personalized Milky Way Guide",
    "prompt": "See when the Milky Way's core is most visible from your location.",
    "button": "Use My Location",
    "loading": "Analyzing your night sky...",
    "errorTitle": "Error",
    "errorDenied": "Location access was denied. We can't generate a guide without it.",
    "errorUnavailable": "Location information is unavailable from your device.",
    "errorTimeout": "The request to get your location timed out.",
    "errorUnknown": "An unknown error occurred while getting your location.",
    "errorApi": "Could not generate a guide for your location at this time. Please try again later.",
    "tryAgain": "Try Again"
  },
  "bortleScale": {
    "title": "Light Pollution Meter (Bortle Scale)",
    "prompt": "Estimate your local sky darkness and see what's visible from your location.",
    "button": "Estimate My Sky Quality",
    "loading": "Estimating your local sky quality...",
    "errorTitle": "Estimation Failed",
    "errorApi": "Could not generate a sky quality report at this time. Please try again later.",
    "tryAgain": "Try Again",
    "classLabel": "Estimated Bortle Class"
  },
  "celestialEvents": {
    "title": "Upcoming Celestial Events",
    "loading": "Scanning the cosmos for upcoming events...",
    "error": "Could not fetch celestial events. The cosmos is silent for now.",
    "noEvents": "No major celestial events found at this time. Check back later!",
    "addToCalendar": "Add to Google Calendar",
    "addToCalendarTooltip": "Add this event to Google Calendar",
    "addToCalendarAriaLabel": "Add this event to Google Calendar"
  },
  "stargazingTips": {
    "title": "Tips for the Best Experience",
    "tips": [
      { "icon": "📍", "title": "Seek Dark Skies", "description": "Find a location away from city lights. The darker the sky, the more you will see. Use a light pollution map to find the best spots near you." },
      { "icon": "☁️", "title": "Check the Weather", "description": "A clear, cloudless night is essential for good viewing. Check the forecast for cloud cover, humidity, and atmospheric seeing conditions." },
      { "icon": "👁️", "title": "Let Your Eyes Adapt", "description": "It takes about 20-30 minutes for your eyes to fully adapt to the dark. Avoid looking at bright screens. Use a red flashlight to preserve your night vision." },
      { "icon": "🔭", "title": "Use the Right Gear", "description": "Binoculars are a great starting point for exploring the Moon and star clusters. A telescope will reveal more distant galaxies and nebulae." }
    ]
  },
  "interactiveTelescope": {
    "title": "Know Your Gear: Telescope Anatomy",
    "prompt": "Hover over a part of the telescope to learn about it.",
    "parts": {
      "objective": { "name": "Objective Lens / Mirror", "description": "The primary optical element. It gathers the faint light from distant objects and focuses it. The larger the diameter (aperture), the brighter and more detailed the image will be." },
      "tube": { "name": "Optical Tube", "description": "The main body of the telescope. It holds the optics in alignment and blocks out stray light to ensure a high-contrast image." },
      "eyepiece": { "name": "Eyepiece & Focuser", "description": "The eyepiece magnifies the focused image from the objective lens. The focuser moves it to achieve a sharp view. You can change eyepieces for different magnifications." },
      "mount": { "name": "Equatorial Mount & Tripod", "description": "The foundation of the telescope. It provides stability and allows aiming. This equatorial mount is designed to follow the rotation of the sky with a single motion." },
      "finderscope": { "name": "Finderscope", "description": "A small, secondary telescope mounted on the main scope. It has a wider field of view, making it easier to locate objects before viewing them through the main eyepiece." }
    }
  },
  "astrophotographyTips": {
    "title": "Astrophotography Starter Guide",
    "tips": [
      { "icon": "🗼", "title": "Use a Sturdy Mount", "description": "A stable base is non-negotiable. For long exposures, a star tracker or equatorial mount is essential to prevent star trails and capture sharp details." },
      { "icon": "🎯", "title": "Master Manual Focus", "description": "Use your camera's live view, zoom in on a bright star, and adjust the focus ring until the star is a tiny, sharp point of light. A Bahtinov mask can help achieve perfection." },
      { "icon": "📁", "title": "Shoot in RAW", "description": "RAW files capture all the sensor data, giving you maximum flexibility in post-processing to bring out faint details and correct colors." },
      { "icon": "⚙️", "title": "The Exposure Triangle", "description": "Use a wide aperture (e.g., f/2.8), a moderate ISO (800-1600), and the longest shutter speed your mount allows without trails." },
      { "icon": "🧭", "title": "Polar Align Carefully", "description": "If using a tracker, take your time with polar alignment. This is the most important step for getting sharp, round stars in long exposures." },
      { "icon": "🗺️", "title": "Plan Your Shoot", "description": "Know what you want to capture before you go out. Use apps like Stellarium or SkySafari to see what objects are visible and plan your composition." },
      { "icon": "⏱️", "title": "Use an Intervalometer", "description": "A remote shutter or intervalometer lets you take photos without touching the camera, preventing vibrations that can blur your images." },
      { "icon": "📚", "title": "Stack Your Images", "description": "Take many identical exposures ('lights') and stack them later in software like DeepSkyStacker to reduce noise and reveal faint details." }
    ]
  },
  "footer": {
    "copyright": "Celestial Capture. All rights reserved.",
    "tagline": "Capturing the beauty of the cosmos, one frame at a time."
  },
  "addPost": {
    "title": "Create New Blog Post",
    "postTitleLabel": "Title",
    "excerptLabel": "Excerpt",
    "imageLabel": "Image",
    "fromUrl": "From URL",
    "uploadImage": "Upload Image",
    "imageUrlLabel": "Image URL",
    "changeImage": "Change Image",
    "chooseImage": "Choose an Image",
    "previewAlt": "Post preview",
    "contentLabel": "Content (HTML supported)",
    "errorAllFields": "All text fields are required.",
    "errorImageProcess": "Could not process the uploaded image.",
    "errorImageRequired": "An image is required.",
    "cancelButton": "Cancel",
    "createButton": "Create Post"
  },
  "prompts": {
    "photoDescription": "You are an expert astrophotographer. Describe this celestial object in a captivating and informative way. Include details about what is being shown (e.g., type of nebula, galaxy features). If possible, infer the likely technical details of how it was captured, such as ISO, Aperture, and Exposure time, and format them clearly under a 'Technical Details' heading.",
    "blogIdeas": "You are an AI assistant for an astrophotography blog. Generate 5 creative and engaging blog post ideas. The ideas should be suitable for both beginners and intermediate enthusiasts. Return the ideas as a JSON object with a single key 'ideas' which is an array of strings.",
    "chatbotSystemInstruction": "You are Cosmos, a friendly and knowledgeable AI assistant for the 'Celestial Capture' astrophotography website. Your goal is to help users learn about space, astronomy, and astrophotography. Answer questions clearly and enthusiastically. You can talk about planets, stars, galaxies, nebulae, telescopes, camera gear, and techniques. Keep your answers concise and easy to understand. Format your responses with simple HTML tags like <p>, <ul>, <li>, and <strong> for readability."
  },
  "chatbot": {
    "open": "Open Chatbot",
    "close": "Close Chatbot",
    "title": "Cosmos Chat",
    "welcome": "Hi! I'm Cosmos.",
    "welcomePrompt": "Ask me about astrophotography, gear, or celestial objects!",
    "inputPlaceholder": "Type a message..."
  },
  "pagination": {
    "previous": "Previous",
    "next": "Next",
    "page": "Page",
    "goToPage": "Go to page {{page}}"
  },
  "toasts": {
    "changesSaved": "Changes saved successfully!",
    "photoOfWeekUpdated": "Photo of the Week has been updated!",
    "photoDeleted": "Photo \"{{title}}\" has been deleted."
  }
};

const ptTranslations = {
  "edit": "Editar",
  "login": {
    "title": "Login de Admin",
    "usernameLabel": "Nome de Utilizador",
    "passwordLabel": "Palavra-passe",
    "loginButton": "Entrar",
    "error": "Nome de utilizador ou palavra-passe inválidos."
  },
  "logoutConfirm": {
    "title": "Confirmar Saída",
    "message": "Tem a certeza que quer terminar a sessão de administrador?",
    "cancel": "Cancelar",
    "logout": "Sair"
  },
  "header": {
    "title": "Celestial",
    "titleHighlight": "Capture",
    "gallery": "Galeria",
    "blog": "Blog",
    "stargazing": "Observação",
    "adminLogin": "Login Admin",
    "logout": "Sair"
  },
  "hero": {
    "subtitle": "A explorar o cosmos através da lente. Uma jornada pessoal pela astrofotografia.",
    "exploreButton": "Explorar Galeria"
  },
  "search": {
    "photoPlaceholder": "Pesquisar fotos por título ou tag..."
  },
  "sort": {
    "label": "Ordenar fotos por",
    "newest": "Mais Recentes",
    "oldest": "Mais Antigas",
    "rating": "Melhor Classificação",
    "title": "Título (A-Z)"
  },
  "ratingFilter": {
    "label": "Filtrar por classificação mínima:",
    "any": "Qualquer",
    "clear": "Limpar",
    "clearAriaLabel": "Limpar filtro de classificação"
  },
  "tagFilter": {
    "clear": "Limpar Filtros"
  },
  "gallery": {
    "uploadButton": "Carregar a Sua Foto",
    "processing": "A processar...",
    "untitled": "Sem Título",
    "uploadError": "Não foi possível processar o ficheiro de imagem.",
    "invalidFileType": "Tipo de ficheiro inválido. Por favor, carregue uma imagem JPEG, PNG ou WebP.",
    "noPhotosFound": {
      "title": "Nenhuma Foto Encontrada",
      "subtitle": "Tente ajustar a sua pesquisa ou os critérios de filtro para encontrar o que procura."
    },
    "dropzone": {
      "title": "Arraste a imagem para carregar",
      "subtitle": "Apenas ficheiros JPEG, PNG ou WebP são aceites."
    }
  },
  "photoCard": {
    "viewDetails": "Ver detalhes de {{title}}"
  },
  "photoDetail": {
    "viewFullscreen": "Ver em ecrã inteiro",
    "titlePlaceholder": "Introduza um título",
    "ratingLabel": "Classificação:",
    "descriptionPlaceholderAdmin": "Adicione uma descrição... ou gere uma com IA!",
    "descriptionPlaceholderUser": "Sem descrição disponível.",
    "resolution": "Resolução",
    "fileSize": "Tamanho",
    "aperture": "Abertura",
    "exposure": "Exposição",
    "generating": "A Conjurar Palavras...",
    "generateButton": "Gerar Detalhes com IA",
    "regenerateButton": "Regenerar Detalhes com IA",
    "generateError": "A descrição só pode ser gerada para fotos recém-carregadas com dados de imagem válidos.",
    "generateErrorApi": "Ocorreu um erro ao comunicar com o cosmos.",
    "generateTooltip": "Detalhes de IA estão disponíveis apenas para fotos recém-carregadas.",
    "addTagPlaceholder": "Adicionar uma tag e premir Enter",
    "setFeaturedButton": "Definir como Foto da Semana",
    "saveButton": "Guardar Alterações",
    "undo": "Desfazer alteração",
    "redo": "Refazer alteração",
    "deleteButton": "Apagar foto",
    "deleteButtonAria": "Apagar foto: {{title}}",
    "undoAria": "Desfazer alterações em {{title}}",
    "redoAria": "Refazer alterações em {{title}}",
    "confirmDeleteTitle": "Confirmar Eliminação",
    "confirmDeleteMessage": "Tem a certeza que quer apagar permanentemente \"{{title}}\"? Esta ação não pode ser desfeita.",
    "cancelButton": "Cancelar"
  },
  "fullscreen": {
    "close": "Fechar ecrã inteiro (Esc)",
    "zoomOut": "Reduzir zoom (-)",
    "resetZoom": "Repor zoom (0 ou R)",
    "zoomIn": "Aumentar zoom (+)",
    "scroll": "Scroll",
    "toZoom": "para Zoom",
    "arrows": "Setas",
    "toPan": "para Mover",
    "esc": "Esc",
    "toClose": "para Fechar"
  },
  "relatedPhotos": {
    "title": "Fotografias Relacionadas"
  },
  "photoOfWeek": {
    "badge": "Foto da Semana",
    "capturedOn": "Capturada em {{date}}"
  },
  "blog": {
    "title": "Do Diário de Campo",
    "addPostButton": "Adicionar Novo Post",
    "searchPlaceholder": "Pesquisar artigos por título ou excerto...",
    "readMore": "Ler Mais",
    "noArticlesFound": "Nenhum artigo encontrado para a sua pesquisa.",
    "noArticlesHint": "Tente uma palavra-chave diferente ou limpe a pesquisa.",
    "inspirationTitle": "Precisa de Inspiração?",
    "inspirationSubtitle": "Deixe a IA ajudá-lo a ter ideias para o seu próximo post de blog de astrofotografia.",
    "generateIdeasButton": "Gerar Ideias para Blog"
  },
  "blogPost": {
    "backToBlog": "Voltar ao Blog",
    "share": "Partilhar",
    "shareCopied": "Link Copiado!",
    "shareError": "Erro!",
    "editPost": "Editar Post",
    "publishedOn": "Publicado em {{date}}"
  },
  "relatedPosts": {
    "title": "Também Poderá Gostar"
  },
  "comments": {
    "oneComment": "1 Comentário",
    "multipleComments": "{{count}} Comentários",
    "beFirst": "Seja o primeiro a deixar um comentário!",
    "leaveComment": "Deixe um Comentário",
    "errorRequired": "Por favor, preencha todos os campos obrigatórios.",
    "errorEmail": "Por favor, introduza um endereço de e-mail válido.",
    "nameLabel": "Nome",
    "emailLabel": "Email (não será publicado)",
    "replyLabel": "A Sua Resposta",
    "commentLabel": "Comentário",
    "posting": "A publicar...",
    "postReplyButton": "Publicar Resposta",
    "postCommentButton": "Publicar Comentário",
    "cancel": "Cancelar",
    "reply": "Responder"
  },
  "editor": {
    "bold": "Negrito",
    "italic": "Itálico",
    "bulletList": "Lista com marcadores",
    "imageLabel": "Imagem do Post",
    "imageAlt": "Pré-visualização do post",
    "fromUrl": "De URL",
    "uploadImage": "Carregar Imagem",
    "changeImage": "Alterar Imagem",
    "chooseImage": "Escolher uma Imagem",
    "cancel": "Cancelar",
    "save": "Guardar Alterações"
  },
  "stargazing": {
    "title": "Sob o Céu Noturno",
    "subtitle": "O seu guia para as melhores condições de observação e fotografia celestial, dicas e truques."
  },
  "moon": {
    "title": "Fase da Lua Atual",
    "illumination": "Iluminação",
    "nextPhase": "Próxima Fase",
    "tonight": "esta noite",
    "tomorrow": "amanhã",
    "inDays": "em {{count}} dias",
    "onDate": "a {{date}}",
    "conditionsTitle": "Condições de Observação",
    "stargazing": "Observação",
    "astrophotography": "Astrofotografia",
    "phases": [
      "Lua Nova",
      "Crescente Fina",
      "Quarto Crescente",
      "Gibosa Crescente",
      "Lua Cheia",
      "Gibosa Minguante",
      "Quarto Minguante",
      "Minguante Fina"
    ],
    "conditions": {
      "newMoon": {
        "stargazing": {
          "rating": "Excelente",
          "ratingKey": "excellent",
          "description": "Céus escuros são perfeitos para avistar galáxias e nebulosas ténues."
        },
        "astrophotography": {
          "rating": "Excelente (Céu Profundo)",
          "ratingKey": "excellent",
          "description": "Condições ideais para capturar objetos de céu profundo como a Via Láctea."
        }
      },
      "crescent": {
        "stargazing": {
          "rating": "Bom",
          "ratingKey": "good",
          "description": "A lua põe-se cedo ou nasce tarde, proporcionando janelas de céu escuro."
        },
        "astrophotography": {
          "rating": "Bom",
          "ratingKey": "good",
          "description": "Ótimo para detalhes lunares ao longo do terminador e ainda escuro o suficiente para alvos de céu profundo mais brilhantes."
        }
      },
      "quarter": {
        "stargazing": {
          "rating": "Razoável",
          "ratingKey": "fair",
          "description": "A lua brilhante irá ofuscar as estrelas mais ténues."
        },
        "astrophotography": {
          "rating": "Excelente (Lunar)",
          "ratingKey": "excellent",
          "description": "Perfeito para capturar fotos detalhadas de crateras ao longo do terminador. Desafiante para nebulosas."
        }
      },
      "gibbous": {
        "stargazing": {
          "rating": "Fraco",
          "ratingKey": "poor",
          "description": "A luz da lua significativa irá esconder todas, exceto as estrelas e planetas mais brilhantes."
        },
        "astrophotography": {
          "rating": "Desafiante (Céu Profundo)",
          "ratingKey": "challenging",
          "description": "Concentre-se em alvos brilhantes como planetas, ou fotografe a própria lua. Use filtros de banda estreita para nebulosas."
        }
      },
      "fullMoon": {
        "stargazing": {
          "rating": "Fraco",
          "ratingKey": "poor",
          "description": "O céu está muito brilhante, tornando difícil ver qualquer coisa exceto a lua e os planetas mais brilhantes."
        },
        "astrophotography": {
          "rating": "Lunar & Paisagem",
          "ratingKey": "fair",
          "description": "Difícil para céu profundo. Melhor para retratos da lua ou fotografia de paisagem iluminada pela lua."
        }
      }
    }
  },
  "whatsUp": {
    "title": "O Que Se Vê Esta Noite?",
    "planets": {
      "title": "Visibilidade dos Planetas",
      "list": [
        { "name": "Mercúrio", "emoji": "☿️", "status": "Difícil de ver", "location": "Muito baixo a oeste após o pôr do sol." },
        { "name": "Vénus", "emoji": "♀️", "status": "Não visível", "location": "Atualmente muito perto do Sol." },
        { "name": "Marte", "emoji": "♂️", "status": "Céu da manhã", "location": "Visível a leste antes do nascer do sol. Procure um ponto de luz avermelhado." },
        { "name": "Júpiter", "emoji": "♃", "status": "Céu da noite", "location": "Brilhante e intenso no sul após o anoitecer. Impossível de não ver." },
        { "name": "Saturno", "emoji": "♄", "status": "Céu da noite", "location": "Visível a sudeste após o anoitecer. Mais ténue que Júpiter, com tom amarelado." },
        { "name": "Úrano", "emoji": "♅", "status": "Binóculos necessários", "location": "Perto de Júpiter, mas requer ajuda ótica para ser visto como um pequeno ponto azul-esverdeado." },
        { "name": "Neptuno", "emoji": "♆", "status": "Telescópio necessário", "location": "Requer um telescópio e uma boa carta celeste para localizar." }
      ]
    },
    "meteors": {
      "title": "Calendário de Chuvas de Meteoros",
      "peak": "Pico",
      "moon": "Lua",
      "list": [
        { "name": "Perseidas", "peak": "12-13 Ago", "rate": "~100/h", "moon": "Crescente Fina (Favorável)" },
        { "name": "Dracónidas", "peak": "8-9 Out", "rate": "Variável", "moon": "Crescente Fina (Favorável)" },
        { "name": "Oriónidas", "peak": "21-22 Out", "rate": "~20/h", "moon": "Gibosa Minguante (Desfavorável)" },
        { "name": "Leónidas", "peak": "17-18 Nov", "rate": "~15/h", "moon": "Lua Cheia (Fraco)" },
        { "name": "Gemínidas", "peak": "13-14 Dez", "rate": "~150/h", "moon": "Minguante Fina (Excelente)" },
        { "name": "Quadrantídeos", "peak": "3-4 Jan", "rate": "~120/h", "moon": "Minguante Fina (Excelente)" }
      ]
    }
  },
  "milkyWayGuide": {
    "title": "Guia Personalizado da Via Láctea",
    "prompt": "Veja quando o núcleo da Via Láctea está mais visível da sua localização.",
    "button": "Usar a Minha Localização",
    "loading": "A analisar o seu céu noturno...",
    "errorTitle": "Erro",
    "errorDenied": "O acesso à localização foi negado. Não podemos gerar um guia sem ela.",
    "errorUnavailable": "A informação de localização não está disponível no seu dispositivo.",
    "errorTimeout": "O pedido para obter a sua localização expirou.",
    "errorUnknown": "Ocorreu um erro desconhecido ao obter a sua localização.",
    "errorApi": "Não foi possível gerar um guia para a sua localização neste momento. Por favor, tente novamente mais tarde.",
    "tryAgain": "Tentar Novamente"
  },
  "bortleScale": {
    "title": "Medidor de Poluição Luminosa (Escala de Bortle)",
    "prompt": "Estime a escuridão do seu céu local e veja o que está visível da sua localização.",
    "button": "Estimar Qualidade do Meu Céu",
    "loading": "A estimar a qualidade do seu céu local...",
    "errorTitle": "Falha na Estimativa",
    "errorApi": "Não foi possível gerar um relatório da qualidade do céu neste momento. Por favor, tente novamente mais tarde.",
    "tryAgain": "Tentar Novamente",
    "classLabel": "Classe de Bortle Estimada"
  },
  "celestialEvents": {
    "title": "Próximos Eventos Celestiais",
    "loading": "A vasculhar o cosmos por eventos futuros...",
    "error": "Não foi possível obter os eventos celestiais. O cosmos está em silêncio por agora.",
    "noEvents": "Nenhum evento celestial importante encontrado de momento. Volte mais tarde!",
    "addToCalendar": "Adicionar ao Google Calendar",
    "addToCalendarTooltip": "Adicionar este evento ao Google Calendar",
    "addToCalendarAriaLabel": "Adicionar este evento ao Google Calendar"
  },
  "stargazingTips": {
    "title": "Dicas para a Melhor Experiência",
    "tips": [
      { "icon": "📍", "title": "Procure Céus Escuros", "description": "Encontre um local longe das luzes da cidade. Quanto mais escuro o céu, mais verá. Use um mapa de poluição luminosa para encontrar os melhores locais perto de si." },
      { "icon": "☁️", "title": "Verifique o Tempo", "description": "Uma noite clara e sem nuvens é essencial para uma boa observação. Verifique a previsão para a cobertura de nuvens, humidade e condições de 'seeing' atmosférico." },
      { "icon": "👁️", "title": "Deixe os Seus Olhos Adaptarem-se", "description": "Leva cerca de 20-30 minutos para os seus olhos se adaptarem totalmente ao escuro. Evite olhar para ecrãs brilhantes. Use uma lanterna de luz vermelha para preservar a sua visão noturna." },
      { "icon": "🔭", "title": "Use o Equipamento Certo", "description": "Binóculos são um ótimo ponto de partida para explorar a Lua e enxames estelares. Um telescópio revelará galáxias e nebulosas mais distantes." }
    ]
  },
  "interactiveTelescope": {
    "title": "Conheça o Seu Equipamento: Anatomia do Telescópio",
    "prompt": "Passe o rato sobre uma parte do telescópio para saber mais sobre ela.",
    "parts": {
      "objective": { "name": "Lente / Espelho Objetivo", "description": "O elemento ótico principal. Recolhe a luz ténue de objetos distantes e foca-a. Quanto maior o diâmetro (abertura), mais brilhante e detalhada será a imagem." },
      "tube": { "name": "Tubo Ótico", "description": "O corpo principal do telescópio. Mantém as óticas alinhadas e bloqueia a luz difusa para garantir uma imagem de alto contraste." },
      "eyepiece": { "name": "Ocular e Focador", "description": "A ocular amplia a imagem focada pela lente objetiva. O focador move-a para obter uma visão nítida. Pode trocar de oculares para diferentes ampliações." },
      "mount": { "name": "Montagem Equatorial e Tripé", "description": "A base do telescópio. Fornece estabilidade e permite apontar. Esta montagem equatorial foi projetada para seguir a rotação do céu com um único movimento." },
      "finderscope": { "name": "Buscador", "description": "Um pequeno telescópio secundário montado no principal. Tem um campo de visão mais amplo, facilitando a localização de objetos antes de os ver através da ocular principal." }
    }
  },
  "astrophotographyTips": {
    "title": "Guia de Iniciação à Astrofotografia",
    "tips": [
      { "icon": "🗼", "title": "Use uma Montagem Robusta", "description": "Uma base estável não é negociável. Para longas exposições, um 'star tracker' ou montagem equatorial é essencial para evitar rastos de estrelas e capturar detalhes nítidos." },
      { "icon": "🎯", "title": "Domine o Foco Manual", "description": "Use a visualização ao vivo da sua câmara, aumente o zoom numa estrela brilhante e ajuste o anel de foco até a estrela ser um ponto de luz minúsculo e nítido. Uma máscara de Bahtinov pode ajudar a atingir a perfeição." },
      { "icon": "📁", "title": "Fotografe em RAW", "description": "Ficheiros RAW capturam todos os dados do sensor, dando-lhe a máxima flexibilidade no pós-processamento para realçar detalhes ténues e corrigir cores." },
      { "icon": "⚙️", "title": "O Triângulo de Exposição", "description": "Use uma abertura ampla (ex: f/2.8), um ISO moderado (800-1600) e a maior velocidade do obturador que a sua montagem permite sem rastos." },
      { "icon": "🧭", "title": "Alinhe Polarmente com Cuidado", "description": "Se usar um 'tracker', dedique tempo ao alinhamento polar. Este é o passo mais importante para obter estrelas nítidas e redondas em longas exposições." },
      { "icon": "🗺️", "title": "Planeie a Sua Sessão", "description": "Saiba o que quer capturar antes de sair. Use aplicações como o Stellarium ou SkySafari para ver que objetos estão visíveis e planear a sua composição." },
      { "icon": "⏱️", "title": "Use um Intervalómetro", "description": "Um disparador remoto ou intervalómetro permite-lhe tirar fotos sem tocar na câmara, evitando vibrações que podem desfocar as suas imagens." },
      { "icon": "📚", "title": "Empilhe as Suas Imagens", "description": "Tire muitas exposições idênticas ('lights') e empilhe-as mais tarde em software como o DeepSkyStacker para reduzir o ruído e revelar detalhes ténues." }
    ]
  },
  "footer": {
    "copyright": "Celestial Capture. Todos os direitos reservados.",
    "tagline": "A capturar a beleza do cosmos, uma imagem de cada vez."
  },
  "addPost": {
    "title": "Criar Novo Post de Blog",
    "postTitleLabel": "Título",
    "excerptLabel": "Excerto",
    "imageLabel": "Imagem",
    "fromUrl": "De URL",
    "uploadImage": "Carregar Imagem",
    "imageUrlLabel": "URL da Imagem",
    "changeImage": "Alterar Imagem",
    "chooseImage": "Escolher uma Imagem",
    "previewAlt": "Pré-visualização do post",
    "contentLabel": "Conteúdo (HTML suportado)",
    "errorAllFields": "Todos os campos de texto são obrigatórios.",
    "errorImageProcess": "Não foi possível processar a imagem carregada.",
    "errorImageRequired": "É necessária uma imagem.",
    "cancelButton": "Cancelar",
    "createButton": "Criar Post"
  },
  "prompts": {
    "photoDescription": "É um astrofotógrafo experiente. Descreva este objeto celestial de forma cativante e informativa. Inclua detalhes sobre o que está a ser mostrado (ex: tipo de nebulosa, características da galáxia). Se possível, infira os detalhes técnicos prováveis de como foi capturado, como ISO, Abertura e tempo de Exposição, e formate-os claramente sob um cabeçalho 'Detalhes Técnicos'.",
    "blogIdeas": "É um assistente de IA para um blog de astrofotografia. Gere 5 ideias de posts de blog criativas e envolventes. As ideias devem ser adequadas tanto para iniciantes como para entusiastas de nível intermédio. Devolva as ideias como um objeto JSON com uma única chave 'ideas' que é um array de strings.",
    "chatbotSystemInstruction": "Você é o Cosmos, um assistente de IA amigável e conhecedor do site de astrofotografia 'Celestial Capture'. O seu objetivo é ajudar os utilizadores a aprender sobre o espaço, astronomia e astrofotografia. Responda às perguntas de forma clara e entusiástica. Pode falar sobre planetas, estrelas, galáxias, nebulosas, telescópios, equipamento de câmara e técnicas. Mantenha as suas respostas concisas e fáceis de entender. Formate as suas respostas com tags HTML simples como <p>, <ul>, <li>, e <strong> para legibilidade."
  },
  "chatbot": {
    "open": "Abrir chatbot",
    "close": "Fechar chatbot",
    "title": "Chat Cosmos",
    "welcome": "Olá! Eu sou o Cosmos.",
    "welcomePrompt": "Pergunte-me sobre astrofotografia, equipamento ou objetos celestes!",
    "inputPlaceholder": "Escreva uma mensagem..."
  },
  "pagination": {
    "previous": "Anterior",
    "next": "Próxima",
    "page": "Página",
    "goToPage": "Ir para a página {{page}}"
  },
  "toasts": {
    "changesSaved": "Alterações guardadas com sucesso!",
    "photoOfWeekUpdated": "A Foto da Semana foi atualizada!",
    "photoDeleted": "A foto \"{{title}}\" foi eliminada."
  }
};

const getInitialLocale = (): Locale => {
    try {
        const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (storedLocale === 'en' || storedLocale === 'pt-PT') {
            return storedLocale;
        }
    } catch (error) {
        console.error("Could not read locale from localStorage", error);
    }
    return 'en';
};

const getNestedTranslation = (obj: Translations | undefined, key: string): any => {
    if (!obj) return undefined;
    return key.split('.').reduce((o: any, i: string) => (o && typeof o === 'object' ? o[i] : undefined), obj);
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale());
    // Use hardcoded translations instead of fetching
    const translations: Record<Locale, Translations> = {
        'en': enTranslations,
        'pt-PT': ptTranslations
    };

    const setLocale = useCallback((newLocale: Locale) => {
        try {
            localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        } catch (error) {
            console.error("Could not save locale to localStorage", error);
        }
        setLocaleState(newLocale);
    }, []);

    const t = useCallback((key: string, replacements?: Record<string, string | number>): any => {
        let translation = getNestedTranslation(translations[locale], key);

        if (translation === undefined) {
            translation = getNestedTranslation(translations['en'], key);
        }

        if (translation === undefined) {
            return key;
        }

        if (typeof translation === 'string' && replacements) {
            Object.keys(replacements).forEach(rKey => {
                const regex = new RegExp(`{{${rKey}}}`, 'g');
                translation = (translation as string).replace(regex, String(replacements[rKey]));
            });
        }
        return translation;
    }, [locale]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
