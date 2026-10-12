import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

export interface Translations {
  // Navigation
  navNewEntry: string;
  navGuide: string;
  navSupport: string;
  navHome: string;
  navDistortions: string;
  navReflect: string;
  navJournal: string;
  navProgress: string;
  navBreathe: string;
  navSpanishToggleTitle: string;
  navLanguageLabel: string;

  // Home
  homeWelcomeBack: string;
  homeWelcome: string;
  homeSubtitle: string;
  homeBreathWork: string;
  homeBreathSub: string;
  homeTrapsMap: string;
  homeTrapsMapSub: string;
  homeStartNew: string;
  homeStartNewSub: string;
  homeResumeDraft: string;
  homeResumeDraftSub: string;
  homeDiscardDraft: string;
  homeCalmingBreath: string;
  homeCalmingBreathSub: string;
  homeActiveWorkPlan: string;
  homeNoHomework: string;
  homeViewAllJournal: string;
  homeMarkDone: string;
  homeCompleted: string;

  // Breathe
  breatheTitle: string;
  breathePacing: string;
  breatheStart: string;
  breathePause: string;
  breatheReset: string;
  breatheRemaining: string;
  breatheInhale: string;
  breatheExhale: string;
  breatheHold: string;
  breathePausePhase: string;
  breatheCardioSync: string;
  breatheWhyTitle: string;
  breatheWhyExplanation: string;
  breatheCalmInitial: string;
  breatheCalmInhale: string;
  breatheCalmHold: string;
  breatheCalmExhale: string;
  breatheCalmPause: string;

  // Distortions
  distortionsExpedition: string;
  distortionsTitle: string;
  distortionsSubtitle: string;
  distortionsScouted: string;
  distortionsReflectButton: string;
  distortionsSeeReframe: string;
  distortionsHideReframe: string;
  distortionsAntidoteTitle: string;
  distortionsCoreQuestion: string;
  distortionsAutomaticThought: string;
  distortionsBalancedReframe: string;

  // Form
  formStep1Title: string;
  formStep1Sub: string;
  formStep2Title: string;
  formStep2Sub: string;
  formStep3Title: string;
  formStep3Sub: string;
  formStep4Title: string;
  formStep4Sub: string;
  formSaveDraft: string;
  formBack: string;
  formContinue: string;
  formStartGuided: string;
  formSaveDirectly: string;
  formPlaceholderEvent: string;
  formPlaceholderThoughts: string;
  formPlaceholderActions: string;
  formSelectEmotions: string;
  formSelectedEmotions: string;
  formRateIntensity: string;
  formDraftSaved: string;

  // Chat
  chatCoachTitle: string;
  chatPrivateBadge: string;
  chatConclude: string;
  chatInputPlaceholder: string;
  chatVoiceListening: string;
  chatTakeBreath: string;
  chatEmergencyNotice: string;
  chatReflectingWithAI: string;

  // Progress
  progressMastery: string;
  progressTitle: string;
  progressSubtitle: string;
  progressDailyBreath: string;
  progressBreathSub: string;
  progressJournalCount: string;
  progressJournalSub: string;
  progressDays: string[];
}

const enTranslations: Translations = {
  navNewEntry: 'New Entry',
  navGuide: 'Guide',
  navSupport: 'Support',
  navHome: 'Home',
  navDistortions: 'Distortions',
  navReflect: 'Reflect',
  navJournal: 'Archive',
  navProgress: 'Progress',
  navBreathe: 'Breathe',
  navSpanishToggleTitle: 'View in Spanish (Español)',
  navLanguageLabel: 'EN',

  homeWelcomeBack: 'Welcome back',
  homeWelcome: 'Welcome to TheraApp',
  homeSubtitle: "What's on your mind right now? A structured reflection helps uncover balanced perspective.",
  homeBreathWork: 'Breath Work',
  homeBreathSub: '6s In · 4s Out',
  homeTrapsMap: 'Cognitive Distortions',
  homeTrapsMapSub: '10 Common Patterns',
  homeStartNew: 'Start New Reflection',
  homeStartNewSub: 'Begin guided 4-step CBT thought log',
  homeResumeDraft: 'Resume Saved Draft',
  homeResumeDraftSub: 'Continue where you left off',
  homeDiscardDraft: 'Discard Draft',
  homeCalmingBreath: 'Quick Calming Breath',
  homeCalmingBreathSub: '6-4 nervous system regulation',
  homeActiveWorkPlan: 'Active Work Plan',
  homeNoHomework: 'No pending work plan tasks. Conclude a reflection to add one!',
  homeViewAllJournal: 'View Archive',
  homeMarkDone: 'Mark as done',
  homeCompleted: 'Done',

  breatheTitle: 'Breathe',
  breathePacing: 'Pacing Technique',
  breatheStart: 'Start',
  breathePause: 'Pause',
  breatheReset: 'Reset',
  breatheRemaining: 'remaining',
  breatheInhale: 'Inhale',
  breatheExhale: 'Exhale',
  breatheHold: 'Hold',
  breathePausePhase: 'Pause',
  breatheCardioSync: 'Cardiovascular Synchronization',
  breatheWhyTitle: 'Why 6s inhale and 4s exhale?',
  breatheWhyExplanation: "This pace brings your breathing into sync with your body's natural blood pressure rhythm — the point where heart rate variability (HRV), a marker of a resilient nervous system, is highest.",
  breatheCalmInitial: "Let go. You're safe here.",
  breatheCalmInhale: 'Draw breath gently in through your nose...',
  breatheCalmHold: 'Soft pause. Relax your jaw and shoulders.',
  breatheCalmExhale: 'Smooth, slow release through parted lips...',
  breatheCalmPause: 'Stillness. Let your body settle.',

  distortionsExpedition: 'Mind Cartographer Expedition',
  distortionsTitle: 'Cognitive Distortions Map',
  distortionsSubtitle: 'Uncover and disarm 10 common thinking habits with CBT reframing antidotes.',
  distortionsScouted: 'Scouted',
  distortionsReflectButton: 'Reflect on this Cognitive Distortion',
  distortionsSeeReframe: 'See Balanced CBT Reframe',
  distortionsHideReframe: 'Hide Reframe',
  distortionsAntidoteTitle: 'How to Disarm this Pattern (3-Step Antidote)',
  distortionsCoreQuestion: 'Core Reflective Question',
  distortionsAutomaticThought: 'Automatic Distorted Thought:',
  distortionsBalancedReframe: 'Balanced CBT Reframe:',

  formStep1Title: 'Step 1 of 4: The Activating Event',
  formStep1Sub: 'What concretely happened? Stick strictly to the objective facts as a camera would record them.',
  formStep2Title: 'Step 2 of 4: Automatic Thoughts',
  formStep2Sub: 'What went through your mind? What meaning, prediction, or story did you make?',
  formStep3Title: 'Step 3 of 4: Felt Emotions & Intensity',
  formStep3Sub: 'Select the primary emotions and rate their intensity from 1 to 10.',
  formStep4Title: 'Step 4 of 4: Actions & Behaviors',
  formStep4Sub: 'What did you do, or feel a strong urge to do in response?',
  formSaveDraft: 'Save Draft',
  formBack: 'Back',
  formContinue: 'Continue',
  formStartGuided: 'Start Guided AI Reflection',
  formSaveDirectly: 'Save Directly to Archive',
  formPlaceholderEvent: 'e.g. Sent a proposal to my client at 9 AM and have not received a reply by 3 PM...',
  formPlaceholderThoughts: 'e.g. They thought it was terrible, they are going to reject me and cancel the contract...',
  formPlaceholderActions: 'e.g. Re-read the email 5 times, checked my phone every 2 minutes, paced the room...',
  formSelectEmotions: 'Select emotions from the categories below:',
  formSelectedEmotions: 'Selected Emotions',
  formRateIntensity: 'Rate Intensity',
  formDraftSaved: 'Draft saved locally',

  chatCoachTitle: 'CBT Reflection Coach',
  chatPrivateBadge: 'Private & local reflection',
  chatConclude: 'Conclude & Summary',
  chatInputPlaceholder: 'Type your reflection or questions here...',
  chatVoiceListening: 'Listening to your voice...',
  chatTakeBreath: 'Take a Breath',
  chatEmergencyNotice: 'If in crisis, please connect with human support.',
  chatReflectingWithAI: 'Reflecting on your entry...',

  progressMastery: 'Weekly Mastery Tracker',
  progressTitle: 'Your Healing Progress',
  progressSubtitle: 'Map your nervous system regulation, cognitive thought logs, and mastered thinking traps.',
  progressDailyBreath: 'Daily Breathwork (This Week)',
  progressBreathSub: '6s Inhale · 4s Exhale Breath Work',
  progressJournalCount: 'Archive Reflection Entries',
  progressJournalSub: 'CBT thought logs stored in archive',
  progressDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

const esTranslations: Translations = {
  navNewEntry: 'Nueva Entrada',
  navGuide: 'Guía',
  navSupport: 'Apoyo',
  navHome: 'Inicio',
  navDistortions: 'Distorsiones',
  navReflect: 'Reflejar',
  navJournal: 'Archivo',
  navProgress: 'Progreso',
  navBreathe: 'Respirar',
  navSpanishToggleTitle: 'Cambiar a Inglés (English)',
  navLanguageLabel: 'ES',

  homeWelcomeBack: 'Bienvenido/a de nuevo',
  homeWelcome: 'Bienvenido/a a TheraApp',
  homeSubtitle: '¿Qué tienes en mente en este momento? Una reflexión estructurada ayuda a descubrir una perspectiva equilibrada.',
  homeBreathWork: 'Trabajo de Respiración',
  homeBreathSub: '6s Inhala · 4s Exhala',
  homeTrapsMap: 'Distorsiones Cognitivas',
  homeTrapsMapSub: '10 Patrones Comunes',
  homeStartNew: 'Iniciar Nueva Reflexión',
  homeStartNewSub: 'Registro guiado de pensamientos TCC en 4 pasos',
  homeResumeDraft: 'Reanudar Borrador Guardado',
  homeResumeDraftSub: 'Continúa donde lo dejaste',
  homeDiscardDraft: 'Descartar Borrador',
  homeCalmingBreath: 'Respiración Calmante Rápida',
  homeCalmingBreathSub: 'Regulación del sistema nervioso 6-4',
  homeActiveWorkPlan: 'Plan de Acción y Tareas Activas',
  homeNoHomework: 'No hay tareas pendientes. ¡Concluye una reflexión para agregar una!',
  homeViewAllJournal: 'Ver Archivo',
  homeMarkDone: 'Marcar hecho',
  homeCompleted: 'Hecho',

  breatheTitle: 'Respirar',
  breathePacing: 'Técnica de Ritmo',
  breatheStart: 'Iniciar',
  breathePause: 'Pausar',
  breatheReset: 'Reiniciar',
  breatheRemaining: 'restante',
  breatheInhale: 'Inhala',
  breatheExhale: 'Exhala',
  breatheHold: 'Mantén',
  breathePausePhase: 'Pausa',
  breatheCardioSync: 'Sincronización Cardiovascular',
  breatheWhyTitle: '¿Por qué 6s de inhalación y 4s de exhalación?',
  breatheWhyExplanation: 'Este ritmo sincroniza tu respiración con el ritmo natural de la presión arterial de tu cuerpo, el punto donde la variabilidad de la frecuencia cardíaca (VFC), indicador de un sistema nervioso resiliente, alcanza su nivel óptimo.',
  breatheCalmInitial: 'Suelta la tensión. Estás a salvo aquí.',
  breatheCalmInhale: 'Inhala suavemente por la nariz...',
  breatheCalmHold: 'Pausa suave. Relaja la mandíbula y los hombros.',
  breatheCalmExhale: 'Exhalación suave y lenta entre los labios...',
  breatheCalmPause: 'Quietud. Deja que tu cuerpo se asiente.',

  distortionsExpedition: 'Expedición Cartográfica de la Mente',
  distortionsTitle: 'Mapa de Distorsiones Cognitivas',
  distortionsSubtitle: 'Descubre y desarma 10 hábitos de pensamiento comunes con antídotos de reencuadre TCC.',
  distortionsScouted: 'Explorado',
  distortionsReflectButton: 'Reflexionar sobre esta Distorsión Cognitiva',
  distortionsSeeReframe: 'Ver Reencuadre Equilibrado de TCC',
  distortionsHideReframe: 'Ocultar Reencuadre',
  distortionsAntidoteTitle: 'Cómo Desarmar este Patrón (Antídoto en 3 Pasos)',
  distortionsCoreQuestion: 'Pregunta Clave de Reflexión',
  distortionsAutomaticThought: 'Pensamiento Automático Distorsionado:',
  distortionsBalancedReframe: 'Reencuadre Equilibrado TCC:',

  formStep1Title: 'Paso 1 de 4: El Hecho Activador',
  formStep1Sub: '¿Qué ocurrió concretamente? Cíñete estrictamente a los hechos objetivos tal como los registraría una cámara.',
  formStep2Title: 'Paso 2 de 4: Pensamientos Automáticos',
  formStep2Sub: '¿Qué pasó por tu mente? ¿Qué significado, predicción o conclusión elaboraste?',
  formStep3Title: 'Paso 3 de 4: Emociones Sentidas e Intensidad',
  formStep3Sub: 'Selecciona las emociones primarias y califica su intensidad del 1 al 10.',
  formStep4Title: 'Paso 4 de 4: Acciones y Conductas',
  formStep4Sub: '¿Qué hiciste o qué impulso urgente sentiste de hacer en respuesta?',
  formSaveDraft: 'Guardar Borrador',
  formBack: 'Atrás',
  formContinue: 'Continuar',
  formStartGuided: 'Iniciar Reflexión Guiada por IA',
  formSaveDirectly: 'Guardar Directamente en el Archivo',
  formPlaceholderEvent: 'ej. Envié una propuesta a mi cliente a las 9 AM y no he recibido respuesta para las 3 PM...',
  formPlaceholderThoughts: 'ej. Pensaron que era terrible, van a rechazarme y cancelar el contrato...',
  formPlaceholderActions: 'ej. Releí el correo 5 veces, miré el teléfono cada 2 minutos, di vueltas por la habitación...',
  formSelectEmotions: 'Selecciona emociones de las categorías siguientes:',
  formSelectedEmotions: 'Emociones Seleccionadas',
  formRateIntensity: 'Calificar Intensidad',
  formDraftSaved: 'Borrador guardado localmente',

  chatCoachTitle: 'Guía de Reflexión TCC',
  chatPrivateBadge: 'Reflexión privada y local',
  chatConclude: 'Concluir y Resumen',
  chatInputPlaceholder: 'Escribe tu reflexión o respuestas aquí...',
  chatVoiceListening: 'Escuchando tu voz...',
  chatTakeBreath: 'Tomar un Respiro',
  chatEmergencyNotice: 'Si estás en crisis, por favor conecta con apoyo humano.',
  chatReflectingWithAI: 'Reflexionando sobre tu entrada...',

  progressMastery: 'Seguimiento Semanal de Progreso',
  progressTitle: 'Tu Progreso de Sanación',
  progressSubtitle: 'Registra tu regulación del sistema nervioso, registros cognitivos y trampas superadas.',
  progressDailyBreath: 'Respiración Diaria (Esta Semana)',
  progressBreathSub: '6s Inhala · 4s Exhala Trabajo de Respiración',
  progressJournalCount: 'Entradas del Archivo de Reflexión',
  progressJournalSub: 'Registros de pensamientos TCC guardados en el archivo',
  progressDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
};

// Spanish translations for the 10 Cognitive Distortions
export const SPANISH_DISTORTIONS_DATA: Record<string, {
  name: string;
  line1: string;
  line2: string;
  category: string;
  definition: string;
  whyBrainDoesIt: string;
  bookExample: string;
  bookReframe: string;
  coreQuestion: string;
  antidoteSteps: { step: string; action: string }[];
}> = {
  'all-or-nothing': {
    name: 'Pensamiento de Todo o Nada',
    line1: 'Todo o Nada',
    line2: 'Pensamiento',
    category: 'Polarización',
    definition: 'Evaluar las cualidades personales o situaciones en categorías blanco o negro, absolutas. Si tu rendimiento no es perfecto, te consideras un fracaso absoluto.',
    whyBrainDoesIt: 'El cerebro simplifica la complejidad reduciendo situaciones con matices a categorías binarias de supervivencia rápida.',
    bookExample: 'Cometí un error menor en mi presentación; ahora todo el proyecto es un fracaso absoluto.',
    bookReframe: 'Un error no borra el valor de toda la presentación. Las cosas rara vez son 100% perfectas o 100% arruinadas.',
    coreQuestion: '¿Existe una escala de grises entre la perfección y el fracaso total en esta situación?',
    antidoteSteps: [
      { step: 'Reconocer el binario', action: 'Identifica palabras como "siempre", "nunca", "arruinado" o "perfecto".' },
      { step: 'Colocar en una escala', action: 'Califica la situación del 1 al 100% en lugar de 0 o 100%.' },
      { step: 'Aceptar el matiz', action: 'Reconoce qué partes salieron bien y cuáles son simplemente áreas de aprendizaje.' },
    ],
  },
  'overgeneralization': {
    name: 'Sobregeneralización',
    line1: 'Sobre-',
    line2: 'generalización',
    category: 'Predicción',
    definition: 'Interpretar un solo acontecimiento negativo como un patrón interminable de derrota.',
    whyBrainDoesIt: 'Nuestro sistema de alarma intenta detectar patrones rápidamente para evitar el dolor futuro.',
    bookExample: 'No me devolvió la llamada. Nadie se queda conmigo nunca; siempre me abandonan.',
    bookReframe: 'Esta persona no devolvió una llamada hoy. Eso es un hecho aislado, no un veredicto sobre todas mis relaciones futuras.',
    coreQuestion: '¿Estoy tratando un solo hecho decepcionante como si fuera una ley universal permanente?',
    antidoteSteps: [
      { step: 'Aislar el hecho', action: 'Separa este acontecimiento concreto de tu historia completa.' },
      { step: 'Buscar contraejemplos', action: 'Recuerda veces en que las cosas resultaron de manera diferente.' },
      { step: 'Limitar el alcance', action: 'Reemplaza "siempre" o "nunca" por "en esta ocasión específica".' },
    ],
  },
  'mental-filter': {
    name: 'Filtro Mental',
    line1: 'Filtro',
    line2: 'Mental',
    category: 'Filtrado',
    definition: 'Elegir un solo detalle negativo y obsesionarse exclusivamente con él, oscureciendo toda la realidad objetiva.',
    whyBrainDoesIt: 'El sesgo evolutivo de negatividad da prioridad a posibles amenazas frente a señales seguras.',
    bookExample: 'Nueve personas elogiaron mi trabajo, pero una hizo una pregunta crítica; la reunión fue un desastre.',
    bookReframe: 'Hubo una pregunta crítica y nueve respuestas positivas. Elijo mantener ambas en el panorama general.',
    coreQuestion: '¿Qué información o retroalimentación positiva estoy filtrando activamente?',
    antidoteSteps: [
      { step: 'Reconocer el filtro', action: 'Observa si estás enfocando una lupa solo sobre una mancha.' },
      { step: 'Alejar la perspectiva', action: 'Enumera intencionalmente tres hechos neutrales o positivos del mismo hecho.' },
      { step: 'Ver el conjunto', action: 'Sostén la imagen completa en lugar de solo el punto oscuro.' },
    ],
  },
  'disqualifying-positive': {
    name: 'Descalificar lo Positivo',
    line1: 'Descalificar',
    line2: 'lo Positivo',
    category: 'Filtrado',
    definition: 'Rechazar activamente experiencias positivas insistiendo en que "no cuentan" por una razón u otra.',
    whyBrainDoesIt: 'Protege las creencias negativas arraigadas sobre uno mismo descartando la evidencia contradictoria.',
    bookExample: 'Me felicitaron por el informe solo porque estaban siendo educados, no porque estuviera bien hecho.',
    bookReframe: 'Dedicaron tiempo a felicitarme. Merece la pena aceptar el cumplido por su valor real.',
    coreQuestion: '¿Por qué descarto los éxitos como accidentes mientras trato los errores como verdades definitivas?',
    antidoteSteps: [
      { step: 'Atrapar la descalificación', action: 'Nota cuando digas "sí, pero..." tras recibir un cumplido o logro.' },
      { step: 'Aceptar el dato', action: 'Permite que el hecho positivo exista sin devaluarlo mentalmente.' },
      { step: 'Practicar gratitud interna', action: 'Di simplemente "gracias" a ti mismo o a los demás.' },
    ],
  },
  'jumping-to-conclusions': {
    name: 'Saltar a Conclusiones',
    line1: 'Saltar a',
    line2: 'Conclusiones',
    category: 'Predicción',
    definition: 'Interpretar las cosas negativamente sin hechos definitivos que respalden la conclusión (Lectura del Pensamiento o Adivinación del Futuro).',
    whyBrainDoesIt: 'La intolerancia a la incertidumbre impulsa a la mente a inventar respuestas antes de contar con datos.',
    bookExample: 'Pasó a mi lado sin saludar; seguro está molesto conmigo y ya no le caigo bien.',
    bookReframe: 'No sé lo que está pensando. Podría estar distraído, preocupado o con prisa.',
    coreQuestion: '¿Estoy leyendo la mente de alguien o prediciendo el futuro sin pruebas verificables?',
    antidoteSteps: [
      { step: 'Verificar la evidencia', action: 'Distingue entre lo que sabes con certeza y lo que estás suponiendo.' },
      { step: 'Generar 3 alternativas', action: 'Imagina tres explicaciones neutrales o benignas para la misma conducta.' },
      { step: 'Esperar datos', action: 'Tolera la incertidumbre hasta tener información real.' },
    ],
  },
  'magnification': {
    name: 'Catastrofismo y Minimización',
    line1: 'Catastrofismo /',
    line2: 'Magnificación',
    category: 'Polarización',
    definition: 'Exagerar la gravedad de los problemas ("catastrofismo") o reducir indebidamente la importancia de tus propias fortalezas.',
    whyBrainDoesIt: 'El sistema simpático de lucha o huida amplifica los riesgos para inducir una alerta máxima.',
    bookExample: 'Llegué 10 minutos tarde; mi reputación profesional está destruida para siempre.',
    bookReframe: 'Llegar tarde es incómodo y poco ideal, pero dista mucho de ser una catástrofe irreversible.',
    coreQuestion: 'En una escala del 1 al 100 de dificultad real en la vida, ¿dónde se ubica esto honestamente?',
    antidoteSteps: [
      { step: 'Aterrizar la proporción', action: 'Pregúntate: ¿importará esto dentro de seis meses o un año?' },
      { step: 'Evaluar tu capacidad', action: 'Recuerda situaciones difíciles que ya has gestionado y superado con éxito.' },
      { step: 'Rebajar el volumen', action: 'Reemplaza "catástrofe" por "inconveniente superable".' },
    ],
  },
  'emotional-reasoning': {
    name: 'Razonamiento Emocional',
    line1: 'Razonamiento',
    line2: 'Emocional',
    category: 'Juicio',
    definition: 'Asumir que tus emociones negativas reflejan necesariamente la realidad de los hechos: "Lo siento así, por lo tanto debe ser verdad".',
    whyBrainDoesIt: 'Las emociones intensas generan una convicción visceral que engaña al pensamiento lógico.',
    bookExample: 'Siento una ansiedad enorme al pensar en viajar, así que algo peligroso va a ocurrir.',
    bookReframe: 'Mis sentimientos son reales y comprensibles, pero los sentimientos son señales internas, no hechos objetivos del mundo exterior.',
    coreQuestion: '¿Estoy usando mi nivel de ansiedad o culpa como prueba de un peligro o fracaso real?',
    antidoteSteps: [
      { step: 'Validar la emoción', action: 'Reconoce: "Siento miedo ahora mismo, y está bien sentirlo."' },
      { step: 'Separar emoción y hecho', action: 'Pregunta: "Si retiramos la emoción por un segundo, ¿cuáles son los hechos tangibles?"' },
      { step: 'Actuar con calma', action: 'No tomes decisiones permanentes basadas en una marea emocional transitoria.' },
    ],
  },
  'should-statements': {
    name: 'Declaraciones de "Debería"',
    line1: 'Declaraciones de',
    line2: '"Debería"',
    category: 'Juicio',
    definition: 'Intentar motivarte o juzgar a otros con "debería", "tengo que" o "no debería", generando culpa, frustración y resentimiento.',
    whyBrainDoesIt: 'Un deseo de control y estándares rígidos para evitar la vulnerabilidad o la imperfección humana.',
    bookExample: 'No debería sentirme triste por esto; debería ser mucho más fuerte.',
    bookReframe: 'Preferiría sentirme mejor, pero es humano y comprensible sentir tristeza en este momento.',
    coreQuestion: '¿Puedo reemplazar "yo debería" por "preferiría" o "elijo"?',
    antidoteSteps: [
      { step: 'Detectar la tiranía del deber', action: 'Nota cada vez que uses "debería" como un látigo mental.' },
      { step: 'Traducir a preferencia', action: 'Cambia "debería" por "me gustaría" o "es comprensible que".' },
      { step: 'Ofrecer autocompasión', action: 'Trátate con la misma amabilidad con que tratarías a un buen amigo.' },
    ],
  },
  'labeling': {
    name: 'Etiquetado y Descalificación',
    line1: 'Etiquetado /',
    line2: 'Descalificación',
    category: 'Juicio',
    definition: 'Forma extrema de sobregeneralización. En lugar de describir tu error, te colocas una etiqueta global y negativa: "Soy un perdedor".',
    whyBrainDoesIt: 'El cerebro busca atajos de identidad para cerrar preguntas complejas sobre el autoconcepto.',
    bookExample: 'Olvidé la contraseña de nuevo; soy un completo idiota.',
    bookReframe: 'Olvidé una contraseña porque estaba cansado y distraído. Eso es una conducta, no define mi identidad.',
    coreQuestion: '¿Estoy confundiendo una acción u omisión humana con mi identidad completa como persona?',
    antidoteSteps: [
      { step: 'Pelar la etiqueta', action: 'Reconoce que una persona no puede ser reducida a un sustantivo peyorativo.' },
      { step: 'Describir la conducta', action: 'Di: "Cometí un error específico" en lugar de "Soy un error".' },
      { step: 'Recordar tu humanidad', action: 'La imperfección es parte inherente de la experiencia de todo ser humano.' },
    ],
  },
  'personalization': {
    name: 'Personalización',
    line1: 'Personali-',
    line2: 'zación',
    category: 'Juicio',
    definition: 'Hacerte responsable de un hecho negativo externo del cual, en realidad, no eras el principal responsable.',
    whyBrainDoesIt: 'El egocentrismo psicológico natural genera una ilusión de control desproporcionada sobre el entorno.',
    bookExample: 'Mi colega estaba de mal humor hoy; seguro hice algo malo para molestarlo.',
    bookReframe: 'El estado de ánimo de mi colega está influido por docenas de factores en su propia vida, no solo por mí.',
    coreQuestion: '¿Qué otros factores externos y decisiones ajenas están presentes además de mi intervención?',
    antidoteSteps: [
      { step: 'Mapear la responsabilidad', action: 'Dibuja mentalmente un pastel con todas las causas contribuyentes.' },
      { step: 'Respetar la autonomía ajena', action: 'Reconoce que los demás son dueños de sus propias reacciones y vidas.' },
      { step: 'Liberar la carga', action: 'Asume únicamente tu parte constructiva y suelta lo que no te pertenece.' },
    ],
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isSpanish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'thera_app_language_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'es' || saved === 'en') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const t = language === 'es' ? esTranslations : enTranslations;
  const isSpanish = language === 'es';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isSpanish,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
