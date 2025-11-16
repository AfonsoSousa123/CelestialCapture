import { BlogPost, Photo } from '../types';

export const blogPostsData: { [key: string]: BlogPost[] } = {
  'en': [
    {
      slug: 'choosing-first-telescope',
      title: `Choosing Your First Telescope: A Beginner's Guide to the Cosmos`,
      excerpt: `Navigating the world of telescopes can be daunting. Refractors, reflectors, GoTo mounts... Let's break down the basics to help you find the perfect scope.`,
      date: `2024-01-15`,
      imageUrl: `https://picsum.photos/seed/scopeguide/1200/800`,
      tags: ['Beginner', 'Telescope', 'Gear'],
      content: `
        <p>Taking the plunge into buying your first telescope is an incredibly exciting step. It's a gateway to observing distant galaxies, sparkling nebulae, and the craters of our own Moon. However, the sheer variety of options can be overwhelming. Let's simplify the main types to help you make an informed choice.</p>
        <h3>The Three Main Types of Telescopes</h3>
        <ol>
          <li><strong>Refractor Telescopes:</strong> These are probably what you picture when you think of a telescope. They use a lens at the front to bend and focus light. They are known for producing sharp, high-contrast images, making them excellent for viewing the Moon and planets. They are also low-maintenance and rugged. Their main downside is that larger apertures can become very expensive and bulky.</li>
          <li><strong>Reflector Telescopes:</strong> These telescopes use a large, curved mirror at the back to gather and focus light. Reflectors, particularly the Dobsonian design, offer the most aperture (light-gathering ability) for your money. This makes them fantastic for viewing faint deep-sky objects like nebulae and galaxies. They do require occasional mirror alignment (collimation), but it's a skill that's easy to learn.</li>
          <li><strong>Catadioptric (Compound) Telescopes:</strong> These are a hybrid, using both lenses and mirrors. The most common types are Schmidt-Cassegrains (SCTs) and Maksutov-Cassegrains (Maks). They pack a long focal length into a very compact tube, making them portable and versatile. They are great all-rounders, good for both planetary and deep-sky observing.</li>
        </ol>
        <h3>What About the Mount?</h3>
        <p>The mount is just as important as the telescope itself! An unstable mount will make viewing impossible. There are two main types:</p>
        <ul>
          <li><strong>Alt-Azimuth (Alt-Az):</strong> This is the simplest type, moving up-down (altitude) and left-right (azimuth). Dobsonian reflectors use a simple, sturdy Alt-Az mount. Many computerized "GoTo" mounts are also Alt-Az.</li>
          <li><strong>Equatorial (EQ):</strong> This mount is tilted to align with the Earth's axis of rotation. This means it can track celestial objects with the turn of a single knob or motor, which is essential for astrophotography. They are more complex to set up (requiring polar alignment) but are the standard for serious imaging.</li>
        </ul>
        <p>Ultimately, the best telescope is the one you will use most often. Consider your budget, what you want to see, and how portable you need it to be. Happy stargazing!</p>
      `
    },
    {
      slug: 'art-of-stacking-images',
      title: `The Art of Stacking: More Signal, Less Noise`,
      excerpt: `Ever wonder how astrophotographers get those clean, detailed images? The secret is stacking. Let's explore why capturing hundreds of photos is better than one.`,
      date: `2024-01-02`,
      imageUrl: `https://picsum.photos/seed/imagestack/1200/800`,
      tags: ['Technique', 'Post-processing', 'Imaging'],
      content: `
        <p>In traditional photography, the goal is often to capture the perfect shot in a single frame. In astrophotography, we do the exact opposite. We take hundreds, sometimes thousands, of photos of the same object and combine them using a process called "stacking." But why?</p>
        <p>The answer lies in something called the <strong>Signal-to-Noise Ratio (SNR)</strong>. The "signal" is the faint light from your target galaxy or nebula that you want to capture. The "noise" is the random, grainy texture introduced by your camera's sensor, especially during long exposures. Stacking is a powerful technique to improve this ratio.</p>
        <h3>How Does It Work?</h3>
        <p>Imagine you have a series of images. The signal (the stars and nebula) is in the same place in every photo. The noise, however, is random. When you average all the photos together:</p>
        <ul>
          <li>The consistent signal adds up and becomes stronger.</li>
          <li>The random noise, being different in each frame, gets averaged out and becomes fainter.</li>
        </ul>
        <p>The improvement in SNR is proportional to the square root of the number of frames you stack. So, stacking 4 images will double your SNR, and stacking 16 images will quadruple it!</p>
        <h3>Calibration Frames are Crucial</h3>
        <p>To get the best results, we also use several types of "calibration frames" in the stacking process:</p>
        <ul>
          <li><strong>Darks:</strong> Taken at the same exposure time and temperature as your main photos, but with the lens cap on. They help subtract thermal noise.</li>
          <li><strong>Flats:</strong> Taken of an evenly illuminated surface. They help correct for dust spots and vignetting (darker corners).</li>
          <li><strong>Biases:</strong> Very short exposures with the lens cap on. They capture the baseline electronic noise of the sensor.</li>
        </ul>
        <p>Using software like DeepSkyStacker, Siril, or PixInsight, you can combine all these frames to produce a master image that's ready for post-processing. It's a fundamental technique that will elevate your astrophotography from simple snapshots to stunning cosmic portraits.</p>
      `
    },
    {
      slug: 'capturing-lunar-eclipse',
      title: `How to Photograph a Lunar Eclipse: A Complete Guide`,
      excerpt: `A lunar eclipse is one of nature's most beautiful spectacles. With a bit of planning, you can capture the stunning "blood moon" with your own camera.`,
      date: `2023-12-20`,
      imageUrl: `https://picsum.photos/seed/lunareclipse/1200/800`,
      tags: ['Technique', 'Lunar', 'Events'],
      content: `
        <p>A total lunar eclipse, when the full Moon passes through Earth's shadow, is a slow, beautiful event that's perfect for photography. The Moon doesn't disappear; instead, it turns a deep, dramatic red. Here's how to prepare and capture it.</p>
        <h3>Gear You'll Need</h3>
        <ul>
          <li><strong>Camera with manual controls:</strong> A DSLR or mirrorless camera is ideal.</li>
          <li><strong>Telephoto lens:</strong> A lens of at least 200mm is needed to make the Moon appear large enough in the frame. 300mm or more is even better.</li>
          <li><strong>Sturdy tripod:</strong> Absolutely essential to keep your camera steady for the long exposures required during totality.</li>
          <li><strong>Remote shutter or intervalometer:</strong> To trigger the camera without touching it, preventing vibrations.</li>
        </ul>
        <h3>Camera Settings Through the Phases</h3>
        <p>The brightness of the Moon changes drastically during an eclipse, so you'll need to adjust your settings continuously. Always shoot in RAW format.</p>
        <ol>
          <li><strong>Partial Phases (Moon entering/leaving shadow):</strong> The sunlit part of the Moon is very bright. Start with settings similar to a normal full moon: ISO 100, f/8, and a shutter speed around 1/125s. As the shadow creeps across, you'll need to progressively increase your shutter speed or ISO.</li>
          <li><strong>Totality (The "Blood Moon"):</strong> This is the dimmest phase and requires the longest exposures. The exact brightness varies between eclipses. A good starting point is ISO 800-1600, aperture wide open (e.g., f/4 or f/5.6), and a shutter speed of 1-4 seconds. Bracket your exposures to ensure you get a good one.</li>
        </ol>
        <h3>Pro Tips for Great Shots</h3>
        <ul>
          <li><strong>Focus carefully:</strong> Use your camera's live view, digitally zoom in on the edge of the Moon or a bright crater, and manually focus until it's perfectly sharp.</li>
          <li><strong>Plan a composition:</strong> While a close-up of the Moon is great, consider a wider shot that includes landscape elements for a sense of scale and place.</li>
          <li><strong>Capture a time-lapse:</strong> Set your camera on an intervalometer to take a photo every few minutes. You can later combine these into a beautiful sequence showing the entire event.</li>
        </ul>
        <p>Photographing a lunar eclipse is a rewarding experience that combines technical skill with the awe of witnessing a celestial alignment. Good luck and clear skies!</p>
      `
    },
    {
      slug: 'narrowband-imaging-from-city',
      title: `Beating Light Pollution: An Intro to Narrowband Imaging`,
      excerpt: `Think you can't do deep-sky astrophotography from a light-polluted city? Think again. Narrowband filters are your secret weapon.`,
      date: `2023-12-11`,
      imageUrl: `https://picsum.photos/seed/citynebula/1200/800`,
      tags: ['Technique', 'Imaging', 'Light Pollution'],
      content: `
        <p>For many urban astrophotographers, the biggest enemy is light pollution. The orange glow from city lights washes out the faint light from distant galaxies and nebulae, making them impossible to capture. But there's a powerful technique that allows you to cut through the noise: <strong>narrowband imaging</strong>.</p>
        <h3>How Does It Work?</h3>
        <p>Emission nebulae, the beautiful clouds of gas where stars are born, don't just glow in all colors. They emit light at very specific wavelengths, primarily from excited atoms of hydrogen (H-alpha), oxygen (OIII), and sulfur (SII).</p>
        <p>Narrowband filters are designed to block out almost all light, *except* for a tiny slice of the spectrum corresponding to one of these elements. This means they let the "good" light from the nebula pass through while blocking the "bad" light from streetlights and other sources of light pollution.</p>
        <h3>The Hubble Palette</h3>
        <p>Since you are capturing each element separately in grayscale, you have to assign colors in post-processing. One of the most famous color mappings is the "Hubble Palette," used for many iconic images from the Hubble Space Telescope:</p>
        <ul>
          <li><strong>Sulfur-II (SII) data is mapped to Red.</strong></li>
          <li><strong>Hydrogen-alpha (H-alpha) data is mapped to Green.</strong></li>
          <li><strong>Oxygen-III (OIII) data is mapped to Blue.</strong></li>
        </ul>
        <p>This "false-color" combination creates stunning, high-contrast images with golden and blue hues that reveal the intricate structure of the nebula's gases.</p>
        <h3>What You Need to Start</h3>
        <p>Narrowband imaging is a more advanced technique. You'll typically need:</p>
        <ul>
          <li>A monochrome astronomy camera (which is more sensitive than a color camera).</li>
          <li>A filter wheel to hold your different narrowband filters (Ha, OIII, SII).</li>
          <li>A sturdy equatorial mount capable of long exposures (5-20 minutes per frame is common).</li>
          <li>Patience! You'll need to capture many hours of data for each filter to get a clean final image.</li>
        </ul>
        <p>While the learning curve is steeper, narrowband imaging unlocks the ability to capture breathtaking photos of the deep cosmos, even from the heart of a city.</p>
      `
    }
  ],
  'pt-PT': [
    {
      slug: 'choosing-first-telescope',
      title: 'Escolher o Seu Primeiro Telescópio: Um Guia para Iniciantes no Cosmos',
      excerpt: 'Navegar no mundo dos telescópios pode ser intimidante. Refratores, refletores, montagens GoTo... Vamos simplificar o básico para o ajudar a encontrar o telescópio perfeito.',
      date: '2024-01-15',
      imageUrl: 'https://picsum.photos/seed/scopeguide/1200/800',
      tags: ['Iniciante', 'Telescópio', 'Equipamento'],
      content: `
        <p>Dar o passo de comprar o seu primeiro telescópio é um momento incrivelmente emocionante. É uma porta de entrada para observar galáxias distantes, nebulosas cintilantes e as crateras da nossa própria Lua. No entanto, a enorme variedade de opções pode ser esmagadora. Vamos simplificar os principais tipos para o ajudar a fazer uma escolha informada.</p>
        <h3>Os Três Principais Tipos de Telescópios</h3>
        <ol>
          <li><strong>Telescópios Refratores:</strong> Estes são provavelmente o que imagina quando pensa num telescópio. Usam uma lente na frente para curvar e focar a luz. São conhecidos por produzir imagens nítidas e de alto contraste, tornando-os excelentes para ver a Lua e os planetas. Também são de baixa manutenção e robustos. A sua principal desvantagem é que aberturas maiores podem tornar-se muito caras e volumosas.</li>
          <li><strong>Telescópios Refletores:</strong> Estes telescópios usam um grande espelho curvo na parte de trás para recolher e focar a luz. Os refletores, particularmente o design Dobsoniano, oferecem a maior abertura (capacidade de recolha de luz) pelo seu dinheiro. Isto torna-os fantásticos para ver objetos de céu profundo ténues como nebulosas e galáxias. Requerem alinhamento ocasional do espelho (colimação), mas é uma habilidade fácil de aprender.</li>
          <li><strong>Telescópios Catadióptricos (Compostos):</strong> Estes são um híbrido, usando tanto lentes como espelhos. Os tipos mais comuns são os Schmidt-Cassegrains (SCTs) e os Maksutov-Cassegrains (Maks). Eles concentram uma longa distância focal num tubo muito compacto, tornando-os portáteis e versáteis. São ótimos polivalentes, bons tanto para observação planetária como de céu profundo.</li>
        </ol>
        <h3>E a Montagem?</h3>
        <p>A montagem é tão importante como o próprio telescópio! Uma montagem instável tornará a visualização impossível. Existem dois tipos principais:</p>
        <ul>
          <li><strong>Alt-Azimutal (Alt-Az):</strong> Este é o tipo mais simples, movendo-se para cima-baixo (altitude) e para a esquerda-direita (azimute). Os refletores Dobsonianos usam uma montagem Alt-Az simples e robusta. Muitas montagens computadorizadas "GoTo" também são Alt-Az.</li>
          <li><strong>Equatorial (EQ):</strong> Esta montagem é inclinada para se alinhar com o eixo de rotação da Terra. Isto significa que pode seguir objetos celestes com o girar de um único botão ou motor, o que é essencial para a astrofotografia. São mais complexas de configurar (exigindo alinhamento polar), mas são o padrão para a imagem séria.</li>
        </ul>
        <p>Em última análise, o melhor telescópio é aquele que usará com mais frequência. Considere o seu orçamento, o que quer ver e quão portátil precisa que seja. Boas observações!</p>
      `
    },
    {
      slug: 'art-of-stacking-images',
      title: 'A Arte de Empilhar: Mais Sinal, Menos Ruído',
      excerpt: 'Já se perguntou como os astrofotógrafos obtêm aquelas imagens limpas e detalhadas? O segredo é empilhar. Vamos explorar porque capturar centenas de fotos é melhor do que uma.',
      date: '2024-01-02',
      imageUrl: 'https://picsum.photos/seed/imagestack/1200/800',
      tags: ['Técnica', 'Pós-processamento', 'Imagem'],
      content: `
        <p>Na fotografia tradicional, o objetivo é muitas vezes capturar a foto perfeita num único quadro. Na astrofotografia, fazemos exatamente o oposto. Tiramos centenas, por vezes milhares, de fotos do mesmo objeto e combinamo-las usando um processo chamado "empilhamento". Mas porquê?</p>
        <p>A resposta está em algo chamado <strong>Relação Sinal-Ruído (SNR)</strong>. O "sinal" é a luz ténue da sua galáxia ou nebulosa alvo que quer capturar. O "ruído" é a textura granulada aleatória introduzida pelo sensor da sua câmara, especialmente durante longas exposições. O empilhamento é uma técnica poderosa para melhorar esta relação.</p>
        <h3>Como Funciona?</h3>
        <p>Imagine que tem uma série de imagens. O sinal (as estrelas e a nebulosa) está no mesmo lugar em cada foto. O ruído, no entanto, é aleatório. Quando se faz a média de todas as fotos juntas:</p>
        <ul>
          <li>O sinal consistente soma-se e torna-se mais forte.</li>
          <li>O ruído aleatório, sendo diferente em cada quadro, é atenuado pela média e torna-se mais fraco.</li>
        </ul>
        <p>O resultado é uma imagem final muito mais suave e detalhada do que qualquer exposição única poderia ser. A melhoria no SNR é proporcional à raiz quadrada do número de quadros que empilha. Assim, empilhar 4 imagens duplicará o seu SNR, e empilhar 16 imagens quadruplicá-lo-á!</p>
        <h3>Os Quadros de Calibração são Cruciais</h3>
        <p>Para obter os melhores resultados, usamos também vários tipos de "quadros de calibração" no processo de empilhamento:</p>
        <ul>
          <li><strong>Darks:</strong> Tirados com o mesmo tempo de exposição e temperatura que as suas fotos principais, mas com a tampa da lente colocada. Ajudam a subtrair o ruído térmico.</li>
          <li><strong>Flats:</strong> Tirados de uma superfície uniformemente iluminada. Ajudam a corrigir manchas de poeira e vinhetagem (cantos mais escuros).</li>
          <li><strong>Biases:</strong> Exposições muito curtas com a tampa da lente colocada. Capturam o ruído eletrónico base do sensor.</li>
        </ul>
        <p>Usando software como o DeepSkyStacker, Siril ou PixInsight, pode combinar todos estes quadros para produzir uma imagem mestre pronta para o pós-processamento. É uma técnica fundamental que elevará a sua astrofotografia de simples instantâneos a deslumbrantes retratos cósmicos.</p>
      `
    },
    {
      slug: 'capturing-lunar-eclipse',
      title: 'Como Fotografar um Eclipse Lunar: Um Guia Completo',
      excerpt: 'Um eclipse lunar é um dos espetáculos mais belos da natureza. Com um pouco de planeamento, pode capturar a deslumbrante "lua de sangue" com a sua própria câmara.',
      date: '2023-12-20',
      imageUrl: 'https://picsum.photos/seed/lunareclipse/1200/800',
      tags: ['Técnica', 'Lunar', 'Eventos'],
      content: `
        <p>Um eclipse lunar total, quando a Lua cheia passa pela sombra da Terra, é um evento lento e belo, perfeito para fotografia. A Lua não desaparece; em vez disso, adquire um tom vermelho profundo e dramático. Eis como se preparar e capturá-lo.</p>
        <h3>Equipamento Necessário</h3>
        <ul>
          <li><strong>Câmara com controlos manuais:</strong> Uma DSLR ou mirrorless é ideal.</li>
          <li><strong>Lente telefoto:</strong> Uma lente de pelo menos 200mm é necessária para que a Lua pareça suficientemente grande no enquadramento. 300mm ou mais é ainda melhor.</li>
          <li><strong>Tripé robusto:</strong> Absolutamente essencial para manter a sua câmara estável para as longas exposições necessárias durante a totalidade.</li>
          <li><strong>Disparador remoto ou intervalómetro:</strong> Para acionar a câmara sem a tocar, evitando vibrações.</li>
        </ul>
        <h3>Configurações da Câmara Através das Fases</h3>
        <p>O brilho da Lua muda drasticamente durante um eclipse, por isso terá de ajustar as suas configurações continuamente. Fotografe sempre em formato RAW.</p>
        <ol>
          <li><strong>Fases Parciais (Lua a entrar/sair da sombra):</strong> A parte iluminada da Lua é muito brilhante. Comece com configurações semelhantes a uma lua cheia normal: ISO 100, f/8 e uma velocidade do obturador de cerca de 1/125s. À medida que a sombra avança, terá de aumentar progressivamente a velocidade do obturador ou o ISO.</li>
          <li><strong>Totalidade (A "Lua de Sangue"):</strong> Esta é a fase mais escura e requer as exposições mais longas. O brilho exato varia entre eclipses. Um bom ponto de partida é ISO 800-1600, abertura totalmente aberta (ex: f/4 ou f/5.6) e uma velocidade do obturador de 1-4 segundos. Faça bracketing das suas exposições para garantir que obtém uma boa.</li>
        </ol>
        <h3>Dicas Profissionais para Ótimas Fotos</h3>
        <ul>
          <li><strong>Foque com cuidado:</strong> Use a visualização ao vivo da sua câmara, faça zoom digital na borda da Lua ou numa cratera brilhante e foque manualmente até estar perfeitamente nítido.</li>
          <li><strong>Planeie uma composição:</strong> Embora um close-up da Lua seja ótimo, considere um plano mais aberto que inclua elementos da paisagem para dar uma sensação de escala e lugar.</li>
          <li><strong>Capture um time-lapse:</strong> Configure a sua câmara num intervalómetro para tirar uma foto a cada poucos minutos. Mais tarde, pode combiná-las numa bela sequência mostrando todo o evento.</li>
        </ul>
        <p>Fotografar um eclipse lunar é uma experiência gratificante que combina habilidade técnica com a admiração de testemunhar um alinhamento celestial. Boa sorte e céus limpos!</p>
      `
    },
    {
      slug: 'narrowband-imaging-from-city',
      title: 'Vencer a Poluição Luminosa: Uma Introdução à Imagem de Banda Estreita',
      excerpt: 'Acha que não pode fazer astrofotografia de céu profundo numa cidade com poluição luminosa? Pense novamente. Os filtros de banda estreita são a sua arma secreta.',
      date: '2023-12-11',
      imageUrl: 'https://picsum.photos/seed/citynebula/1200/800',
      tags: ['Técnica', 'Imagem', 'Poluição Luminosa'],
      content: `
        <p>Para muitos astrofotógrafos urbanos, o maior inimigo é a poluição luminosa. O brilho laranja das luzes da cidade ofusca a luz ténue de galáxias e nebulosas distantes, tornando-as impossíveis de capturar. Mas existe uma técnica poderosa que lhe permite atravessar o ruído: a <strong>imagem de banda estreita</strong>.</p>
        <h3>Como Funciona?</h3>
        <p>As nebulosas de emissão, as belas nuvens de gás onde as estrelas nascem, não brilham apenas em todas as cores. Elas emitem luz em comprimentos de onda muito específicos, principalmente de átomos excitados de hidrogénio (H-alfa), oxigénio (OIII) e enxofre (SII).</p>
        <p>Os filtros de banda estreita são concebidos para bloquear quase toda a luz, *exceto* uma pequena fatia do espectro correspondente a um destes elementos. Isto significa que eles deixam passar a luz "boa" da nebulosa, enquanto bloqueiam a luz "má" dos candeeiros de rua e outras fontes de poluição luminosa.</p>
        <h3>A Paleta Hubble</h3>
        <p>Como está a capturar cada elemento separadamente em tons de cinzento, tem de atribuir cores no pós-processamento. Um dos mapeamentos de cores mais famosos é a "Paleta Hubble", usada em muitas imagens icónicas do Telescópio Espacial Hubble:</p>
        <ul>
          <li><strong>Os dados de Enxofre-II (SII) são mapeados para Vermelho.</strong></li>
          <li><strong>Os dados de Hidrogénio-alfa (H-alfa) são mapeados para Verde.</strong></li>
          <li><strong>Os dados de Oxigénio-III (OIII) são mapeados para Azul.</strong></li>
        </ul>
        <p>Esta combinação de "cores falsas" cria imagens deslumbrantes e de alto contraste, com tons dourados e azuis que revelam a estrutura intrincada dos gases da nebulosa.</p>
        <h3>O que Precisa para Começar</h3>
        <p>A imagem de banda estreita é uma técnica mais avançada. Normalmente, precisará de:</p>
        <ul>
          <li>Uma câmara de astronomia monocromática (que é mais sensível do que uma câmara a cores).</li>
          <li>Uma roda de filtros para segurar os seus diferentes filtros de banda estreita (Ha, OIII, SII).</li>
          <li>Uma montagem equatorial robusta capaz de longas exposições (5-20 minutos por quadro é comum).</li>
          <li>Paciência! Precisará de capturar muitas horas de dados para cada filtro para obter uma imagem final limpa.</li>
        </ul>
        <p>Embora a curva de aprendizagem seja mais acentuada, a imagem de banda estreita desbloqueia a capacidade de capturar fotos deslumbrantes do cosmos profundo, mesmo do coração de uma cidade.</p>
      `
    }
  ]
};

export const photosData: { [key: string]: Photo[] } = {
  'en': [
    {
      id: '1',
      title: 'Pillars of Creation',
      date: '2024-03-15',
      url: 'https://picsum.photos/seed/pillarsofcreation/800/1200',
      urls: { small: 'https://picsum.photos/seed/pillarsofcreation/400/600', medium: 'https://picsum.photos/seed/pillarsofcreation/800/1200', large: 'https://picsum.photos/seed/pillarsofcreation/1200/1800' },
      description: 'The Pillars of Creation are elephant trunks of interstellar gas and dust in the Eagle Nebula. They are illuminated by the hot, young stars within the nebula.',
      tags: ['Nebula', 'Deep Sky', 'Hubble'],
      rating: 5,
    },
    {
      id: '2',
      title: 'Andromeda Galaxy',
      date: '2024-02-20',
      url: 'https://picsum.photos/seed/andromeda/1200/800',
      urls: { small: 'https://picsum.photos/seed/andromeda/600/400', medium: 'https://picsum.photos/seed/andromeda/1200/800', large: 'https://picsum.photos/seed/andromeda/1800/1200' },
      description: 'The Andromeda Galaxy (M31) is the closest spiral galaxy to the Milky Way and the most distant object visible to the naked eye.',
      tags: ['Galaxy', 'Deep Sky', 'M31'],
      rating: 5,
    },
    {
      id: '3',
      title: 'The Pleiades (Seven Sisters)',
      date: '2024-01-10',
      url: 'https://picsum.photos/seed/pleiades/1200/800',
      urls: { small: 'https://picsum.photos/seed/pleiades/600/400', medium: 'https://picsum.photos/seed/pleiades/1200/800', large: 'https://picsum.photos/seed/pleiades/1800/1200' },
      description: 'M45, also known as the Pleiades or Seven Sisters, is an open star cluster dominated by hot blue and extremely luminous stars that have formed within the last 100 million years.',
      tags: ['Star Cluster', 'Deep Sky', 'M45'],
      rating: 4,
    },
    {
      id: '4',
      title: 'Lunar Mare Imbrium',
      date: '2023-12-28',
      url: 'https://picsum.photos/seed/moonmare/800/800',
      urls: { small: 'https://picsum.photos/seed/moonmare/400/400', medium: 'https://picsum.photos/seed/moonmare/800/800', large: 'https://picsum.photos/seed/moonmare/1200/1200' },
      description: 'A high-resolution shot of the lunar surface, focusing on the vast lava plain of Mare Imbrium and the sharp craters within it.',
      tags: ['Moon', 'Lunar', 'Planetary'],
      rating: 4,
    },
    {
      id: '5',
      title: 'Milky Way over the Desert',
      date: '2023-12-05',
      url: 'https://picsum.photos/seed/milkywaydesert/1200/800',
      urls: { small: 'https://picsum.photos/seed/milkywaydesert/600/400', medium: 'https://picsum.photos/seed/milkywaydesert/1200/800', large: 'https://picsum.photos/seed/milkywaydesert/1800/1200' },
      description: 'The galactic core of the Milky Way rising over a desert landscape, showing the vibrant dust lanes and star fields.',
      tags: ['Milky Way', 'Nightscape', 'Wide Field'],
      rating: 5,
    },
    {
      id: '6',
      title: 'Jupiter and its Moons',
      date: '2023-11-15',
      url: 'https://picsum.photos/seed/jupiter/1200/800',
      urls: { small: 'https://picsum.photos/seed/jupiter/600/400', medium: 'https://picsum.photos/seed/jupiter/1200/800', large: 'https://picsum.photos/seed/jupiter/1800/1200' },
      description: 'Jupiter showing its Great Red Spot, with the four Galilean moons visible as small points of light.',
      tags: ['Planet', 'Jupiter', 'Planetary'],
      rating: 4,
    },
    {
      id: '7',
      title: 'The Rosette Nebula',
      date: '2023-10-30',
      url: 'https://picsum.photos/seed/rosette/800/800',
      urls: { small: 'https://picsum.photos/seed/rosette/400/400', medium: 'https://picsum.photos/seed/rosette/800/800', large: 'https://picsum.photos/seed/rosette/1200/1200' },
      description: 'A large, circular H II region located near one end of a giant molecular cloud in the Monoceros region of the Milky Way Galaxy.',
      tags: ['Nebula', 'Deep Sky', 'H-alpha'],
      rating: 4,
    },
    {
      id: '8',
      title: 'Saturn\'s Rings',
      date: '2023-10-01',
      url: 'https://picsum.photos/seed/saturn/1200/800',
      urls: { small: 'https://picsum.photos/seed/saturn/600/400', medium: 'https://picsum.photos/seed/saturn/1200/800', large: 'https://picsum.photos/seed/saturn/1800/1200' },
      description: 'A clear view of the planet Saturn, showcasing its magnificent ring system and the Cassini Division.',
      tags: ['Planet', 'Saturn', 'Planetary'],
      rating: 5,
    },
  ],
  'pt-PT': [
    {
      id: '1',
      title: 'Pilares da Criação',
      date: '2024-03-15',
      url: 'https://picsum.photos/seed/pillarsofcreation/800/1200',
      urls: { small: 'https://picsum.photos/seed/pillarsofcreation/400/600', medium: 'https://picsum.photos/seed/pillarsofcreation/800/1200', large: 'https://picsum.photos/seed/pillarsofcreation/1200/1800' },
      description: 'Os Pilares da Criação são trombas de elefante de gás e poeira interestelar na Nebulosa da Águia. São iluminados pelas estrelas quentes e jovens dentro da nebulosa.',
      tags: ['Nebulosa', 'Céu Profundo', 'Hubble'],
      rating: 5,
    },
    {
      id: '2',
      title: 'Galáxia de Andrómeda',
      date: '2024-02-20',
      url: 'https://picsum.photos/seed/andromeda/1200/800',
      urls: { small: 'https://picsum.photos/seed/andromeda/600/400', medium: 'https://picsum.photos/seed/andromeda/1200/800', large: 'https://picsum.photos/seed/andromeda/1800/1200' },
      description: 'A Galáxia de Andrómeda (M31) é a galáxia espiral mais próxima da Via Láctea e o objeto mais distante visível a olho nu.',
      tags: ['Galáxia', 'Céu Profundo', 'M31'],
      rating: 5,
    },
    {
      id: '3',
      title: 'As Plêiades (Sete Irmãs)',
      date: '2024-01-10',
      url: 'https://picsum.photos/seed/pleiades/1200/800',
      urls: { small: 'https://picsum.photos/seed/pleiades/600/400', medium: 'https://picsum.photos/seed/pleiades/1200/800', large: 'https://picsum.photos/seed/pleiades/1800/1200' },
      description: 'M45, também conhecido como as Plêiades ou Sete Irmãs, é um enxame estelar aberto dominado por estrelas azuis quentes e extremamente luminosas que se formaram nos últimos 100 milhões de anos.',
      tags: ['Enxame Estelar', 'Céu Profundo', 'M45'],
      rating: 4,
    },
    {
      id: '4',
      title: 'Mare Imbrium Lunar',
      date: '2023-12-28',
      url: 'https://picsum.photos/seed/moonmare/800/800',
      urls: { small: 'https://picsum.photos/seed/moonmare/400/400', medium: 'https://picsum.photos/seed/moonmare/800/800', large: 'https://picsum.photos/seed/moonmare/1200/1200' },
      description: 'Uma imagem de alta resolução da superfície lunar, focando na vasta planície de lava do Mare Imbrium e nas crateras nítidas dentro dela.',
      tags: ['Lua', 'Lunar', 'Planetário'],
      rating: 4,
    },
    {
      id: '5',
      title: 'Via Láctea sobre o Deserto',
      date: '2023-12-05',
      url: 'https://picsum.photos/seed/milkywaydesert/1200/800',
      urls: { small: 'https://picsum.photos/seed/milkywaydesert/600/400', medium: 'https://picsum.photos/seed/milkywaydesert/1200/800', large: 'https://picsum.photos/seed/milkywaydesert/1800/1200' },
      description: 'O núcleo galáctico da Via Láctea a erguer-se sobre uma paisagem desértica, mostrando as vibrantes faixas de poeira e campos estelares.',
      tags: ['Via Láctea', 'Paisagem Noturna', 'Grande Angular'],
      rating: 5,
    },
    {
      id: '6',
      title: 'Júpiter e as suas Luas',
      date: '2023-11-15',
      url: 'https://picsum.photos/seed/jupiter/1200/800',
      urls: { small: 'https://picsum.photos/seed/jupiter/600/400', medium: 'https://picsum.photos/seed/jupiter/1200/800', large: 'https://picsum.photos/seed/jupiter/1800/1200' },
      description: 'Júpiter mostrando a sua Grande Mancha Vermelha, com as quatro luas galileanas visíveis como pequenos pontos de luz.',
      tags: ['Planeta', 'Júpiter', 'Planetário'],
      rating: 4,
    },
    {
      id: '7',
      title: 'Nebulosa da Roseta',
      date: '2023-10-30',
      url: 'https://picsum.photos/seed/rosette/800/800',
      urls: { small: 'https://picsum.photos/seed/rosette/400/400', medium: 'https://picsum.photos/seed/rosette/800/800', large: 'https://picsum.photos/seed/rosette/1200/1200' },
      description: 'Uma grande região H II circular localizada perto de uma extremidade de uma nuvem molecular gigante na região de Monoceros da Galáxia da Via Láctea.',
      tags: ['Nebulosa', 'Céu Profundo', 'H-alfa'],
      rating: 4,
    },
    {
      id: '8',
      title: 'Anéis de Saturno',
      date: '2023-10-01',
      url: 'https://picsum.photos/seed/saturn/1200/800',
      urls: { small: 'https://picsum.photos/seed/saturn/600/400', medium: 'https://picsum.photos/seed/saturn/1200/800', large: 'https://picsum.photos/seed/saturn/1800/1200' },
      description: 'Uma visão clara do planeta Saturno, exibindo o seu magnífico sistema de anéis e a Divisão de Cassini.',
      tags: ['Planeta', 'Saturno', 'Planetário'],
      rating: 5,
    },
  ]
};