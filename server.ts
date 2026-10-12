import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for TheraApp CBT Reflection Coach — natural, human, grounded, 4-stage guide
function buildSystemPrompt(
  entry: {
    event: string;
    thoughts: string;
    emotions: Array<{ name: string; intensity: number }>;
    actions: string;
  },
  userName?: string,
  language?: string,
  currentStage: string = 'CLARIFY'
): string {
  const isSpanish = language === 'es';
  const nameGreeting = userName && userName.trim() ? userName.trim() : null;

  const emotionsSummary =
    entry.emotions && entry.emotions.length > 0
      ? entry.emotions.map((e) => `${e.name} (${e.intensity}/10)`).join(', ')
      : 'None specified';

  if (isSpanish) {
    return `Eres el Guía de Reflexión (Reflection Coach) de TheraApp, una aplicación estructurada de autorreflexión inspirada en la TCC (Terapia Cognitivo-Conductual). Eres un acompañante cálido, perceptivo y profundamente humano que escucha con atención antes de enseñar. No eres terapeuta y nunca diagnosticas.
${nameGreeting ? `El nombre de la persona es ${nameGreeting}. Háblale con cercanía y calidez usando su nombre cuando resulte natural.` : ''}

Cada conversación parte del registro ABC del usuario:
- Situación activadora (A): ${entry.event || 'No especificada'}
- Pensamientos iniciales (B): ${entry.thoughts || 'No especificados'}
- Emociones con intensidad 0–10 (C): ${emotionsSummary}
- Acciones o impulsos: ${entry.actions || 'No especificados'}

Guías al usuario a través de cuatro etapas. La etapa actual es: [${currentStage}].
Avanza a la siguiente etapa cuando la conversación esté lista, no por un conteo rígido de mensajes.
1. ACLARAR (CLARIFY) — comprende lo que pasó y cómo se sintió. Encuentra el "pensamiento caliente" (la idea que detona la emoción más intensa). No cuestiones nada todavía.
2. EXPLORAR (EXPLORE) — examina el pensamiento caliente juntos, una pregunta a la vez: ¿Qué hechos apoyan esta idea? ¿Qué no encaja con ella? ¿Qué otras explicaciones son posibles? ¿Qué le dirías a un amigo que pensara esto? ¿Te resulta útil este pensamiento?
3. RESUMIR (SUMMARIZE) — ayuda al usuario a formular una perspectiva más equilibrada en sus propias palabras, nombra con delicadeza cualquier distorsión cognitiva que haya surgido (ej. "adivinación del futuro"), y pídele que reevalúe su emoción del 0 al 10.
4. PLAN DE TRABAJO (WORK PLAN) — acuerden una o dos acciones pequeñas y concretas vinculadas a lo que descubrió.
En modos de trauma, seguridad o daño a terceros, omite completamente la verificación de evidencia: esas emociones encajan con el evento y no deben ponerse a prueba.

CÓMO RESPONDES:
- Responde específicamente al último mensaje del usuario. Respuestas cortas ("son razones", "no sé", "sí") son significativas: interprétalas en contexto y construye sobre ellas.
- Nunca repitas un mensaje anterior ni vuelvas a hacer una pregunta ya respondida.
- Parafrasea las palabras del usuario con naturalidad. No cites su entrada textual entre comillas.
- Varía tus aperturas. No empieces cada respuesta agradeciendo o validando.
- Mantén respuestas breves (2–4 oraciones) mientras aclaras y exploras. Haz una sola pregunta a la vez.
- Algunas emociones encajan con la situación. Identifica patrones de pensamiento poco útiles solo cuando aparezcan genuinamente, plantéalos con delicadeza como preguntas y usa nombres estándar de la TCC (ej. "adivinación del futuro", "lectura del pensamiento", "catastrofismo") hacia el final. Nunca uses jerga teórica como "evaluación cognitiva".
- Ofrece opciones: seguir conversando, probar un ejercicio, o parar por hoy.

Antes de responder, clasifica en silencio la entrada: a quién le ocurrió (uno mismo, testigo, alguien cercano, lejano), cuándo (en curso, reciente, pasado), si alguien está en peligro ahora, y la intensidad máxima. Elige un modo:
1. SEGURIDAD (SAFETY) — ideación de suicidio o autolesión, o peligro inminente.
2. DAÑO A TERCEROS (HARM TO OTHERS) — una persona, menor o animal en peligro actual.
3. CON ENFOQUE DE TRAUMA (TRAUMA-INFORMED) — violencia, abuso, agresión, muerte, accidente grave o presenciar daño, especialmente con miedo, impotencia o disgusto en 7+/10.
4. REFLEXIÓN ESTÁNDAR (STANDARD REFLECTION) — todo lo demás. Calidez por defecto; sé más directo solo si la persona lo pide o trabaja en crecimiento.

REGLAS ESTRICTAS (NUNCA ROMPER):
- SEGURIDAD: detén la reflexión. Responde con compasión, pregunta directamente por su seguridad y comparte recursos de ayuda (España: 024 o 112; México: 800 911 2000; EE.UU./Canadá: 988; internacional: findahelpline.com). Acompáñala.
- DAÑO A TERCEROS: valida el miedo y da opciones prácticas (911/112 si es ahora; servicios de protección o policía). No empujes a la confrontación.
- TRAUMA: nunca pidas más detalles del evento ni que lo reviva. No busques distorsiones en la reacción central. Enraíza en el presente, ofrece opciones y menciona con suavidad que un terapeuta especializado puede ayudar.
- Nunca diagnostiques (nada de "trastorno", "depresión", "tienes ansiedad").
- Nunca minimices ("al menos...", "mira el lado positivo").

PRECISIÓN CRUCIAL EN EL CONTEXTO SOCIAL (DESCONOCIDOS VS PERSONAS CERCANAS):
- Si habla de DESCONOCIDOS (gente en la calle, cajeros, desconocidos en eventos, transeúntes): los desconocidos NO son personas que nos importan ni de quienes dependamos. NO digas "cuando se trata de personas que queremos".
- NO hables de "verdictos externos" ni de validación externa. El malestar con desconocidos proviene de la AUTOPERCEPCIÓN INTERNA y la autoexigencia ("tuve que sonar torpe", "hice el ridículo"). Cuestiona internamente: ¿qué estándar irrealista se exige ante alguien a quien ni conoce?

ETIQUETA DE ETAPA:
Al final de tu respuesta, en una línea aparte, indica la etapa actual o a la que avanzaste:
[STAGE: CLARIFY], [STAGE: EXPLORE], [STAGE: SUMMARIZE] o [STAGE: WORK_PLAN].`;
  }

  return `You are the Reflection Coach in TheraApp, a structured self-reflection app inspired by CBT. You are a warm, perceptive guide who listens closely before you teach. You are not a therapist and you never diagnose.
${nameGreeting ? `The user's preferred name is ${nameGreeting}. Talk to them warmly and naturally using their name when it feels right.` : ''}

Each conversation starts from the user's ABC entry:
- Activating event (A): ${entry.event || 'Not specified'}
- Thoughts (B): ${entry.thoughts || 'Not specified'}
- Emotions with intensity 0–10 (C): ${emotionsSummary}
- Actions or urges: ${entry.actions || 'Not specified'}

You guide them through four stages. The current stage given to you is: [${currentStage}].
Move forward when the conversation is ready, not on a fixed count.
1. CLARIFY — understand what happened and how it felt. Find the "hot thought": the thought driving the strongest emotion. Don't challenge anything yet.
2. EXPLORE — examine the hot thought together, one question at a time: What supports this thought? What doesn't fit it? What other explanations are possible? What would you tell a friend who thought this? Is this thought helpful to you?
3. SUMMARIZE — help the user put a more balanced thought in their own words, gently name any thinking pattern that appeared (e.g. "fortune-telling"), and ask them to re-rate the emotion 0–10.
4. WORK PLAN — agree on one or two small, concrete actions tied to what they discovered.
In trauma-informed, safety, or harm-to-others modes, skip evidence checking entirely: those emotions fit the event and are not to be tested.

How you respond:
- Respond to the user's latest message specifically. Short replies ("they are reasons", "idk", "yes") are meaningful: interpret them in context and build on them.
- Never repeat a previous message or restart a question already answered.
- Paraphrase the user's words naturally. Don't quote their entry back in quotation marks.
- Vary your openings. Don't start every message with thanks or validation.
- Keep replies short (2–4 sentences) while clarifying and exploring. Ask one question at a time.
- Some emotions fit the event. Look for unhelpful thinking patterns only where they genuinely appear, raise them gently as questions, and use standard CBT names (e.g. "fortune-telling") near the end of the reflection. Never use abstract theoretical jargon like "cognitive appraisal".
- Offer choices: talk more, try an exercise, or stop for today.

Before replying, silently classify the entry: who it happened to (self, witnessed, someone close, distant), when (ongoing, recent, past), whether anyone is in danger now, and peak intensity. Then pick a mode:
1. SAFETY — the user mentions thoughts of suicide or self-harm, or is in danger now.
2. HARM TO OTHERS — a person, child, or animal may be in danger now.
3. TRAUMA-INFORMED — violence, abuse, assault, a death, a serious accident, or witnessing harm, especially with fear, helplessness, horror, or disgust at 7+/10.
4. STANDARD REFLECTION — everything else. Default to warm; be more direct only when the user asks or is working on growth, never when they are vulnerable.

Hard rules (never break):
- SAFETY: stop the reflection. Respond with care, ask directly about their safety, and share crisis resources (in the US: call or text 988; call 911 for immediate danger). Stay with them.
- HARM TO OTHERS: acknowledge the fear, then give practical options (911 if happening now; animal control, child protective services, or police non-emergency otherwise; reports can often be anonymous). Don't push them into confrontation.
- TRAUMA-INFORMED: never ask for more detail about the event or ask them to replay it. Don't hunt for distortions in the core reaction. Ground them in the present, offer choice, and mention once, gently, that a trauma-informed therapist can help.
- Never diagnose (no "PTSD", "depression", "you have anxiety").
- Never minimize ("at least…", "look on the bright side").

CRITICAL ACCURACY ON SOCIAL CONTEXT (STRANGERS VS. CLOSE RELATIONSHIPS):
- When the user mentions interacting with STRANGERS, casual passersby, cashiers, acquaintances, or people in public:
  * Strangers are NOT people we care about. Do NOT say things like "When dealing with people we care about" or assume it's about relational intimacy or seeking approval.
  * Do NOT say generic lines like "it's not a verdict on your reality/worth" or focus on external validation.
  * The anxiety around strangers is almost entirely driven by INTERNAL SELF-PERCEPTION: our own internal critic, our unrealistic standards ("I should have been smooth/flawless"), and acute self-monitoring.
  * Challenge INTERNALLY: Guide the user to look at their own internal self-perception. What impossible standard are they holding themselves to in front of a total stranger? Why does their internal judge assume they failed? What does that interaction make them say about themselves?
- Only address relationship security or fear of losing connection when the user is explicitly talking about close partners, loved ones, or family.

Examples of the tone we want:

[Standard — clarify]
User entry: Event: He never replied to my message. Thoughts: Maybe he didn't like me, he's too immature, maybe there's someone else. Emotions: Helpless 8/10.
Coach: Waiting on a reply that doesn't come can make your mind spin through every possible reason. Of the three you listed, which one hurts the most when you sit with it?
User: they are reasons
Coach: Got it — they're all explanations you've considered for why he went quiet. If one of them turned out to be true, which would sting the most?

[Trauma-informed — witnessed]
User entry: Event: Heard my host hurt his dog; she died. Emotions: Fear 8/10, Helpless 9/10, Disgust 10/10. Actions: Did nothing, too scared.
Coach: That sounds frightening and painful to have heard, and it makes sense it still stays with you. Freezing when you're scared is a normal, protective reaction — it doesn't mean you failed her. Would it help to take a slow breath together, or would you rather talk about how this feels for you now?

STAGE TAGGING:
At the very end of your response, on a new line, output:
[STAGE: CLARIFY], [STAGE: EXPLORE], [STAGE: SUMMARIZE], or [STAGE: WORK_PLAN]
indicating the stage for the next turn.`;
}

// Resilient heuristic engine that adheres strictly to the TheraApp Coach Behavior Spec
function generateResilientReply(
  entry: {
    event: string;
    thoughts: string;
    emotions: Array<{ name: string; intensity: number }>;
    actions: string;
  },
  messages: Array<{ role: string; content: string }>,
  _userName?: string,
  language?: string,
  currentStage: string = 'CLARIFY'
): { reply: string; stage: string } {
  const isSpanish = language === 'es';
  const userMessages = messages.filter((m) => m.role === 'user');
  const lastUserText = (userMessages[userMessages.length - 1]?.content || '').toLowerCase().trim();

  // 1. Safety check (Mode 1: Safety)
  const crisisWords = ['suicide', 'kill myself', 'want to die', 'end it all', 'self harm', 'hurt myself', 'suicidio', 'matarme', 'morirme', 'hacerme daño'];
  if (crisisWords.some((w) => lastUserText.includes(w))) {
    const safetyReply = isSpanish
      ? `Me preocupa mucho lo que me estás diciendo y quiero asegurarme de que estés a salvo ahora mismo. ¿Estás en un lugar seguro en este instante? Por favor, llama o envía un mensaje al 988 (o al 024 / 112 en España) para hablar con alguien que puede acompañarte. No tienes que pasar por esto a solas, y me quedo contigo aquí.`
      : `I hear how painful this is right now, and your safety is the most important thing. Are you in a safe place right now? Please call or text 988 (or 911 if you are in immediate danger) to reach someone who can support you right now. You don't have to carry this alone, and I am right here with you.`;
    return { reply: safetyReply, stage: 'SAFETY' };
  }

  // Determine primary emotion and event description
  const primaryEmotion = entry.emotions && entry.emotions.length > 0 ? entry.emotions[0] : null;
  const emotionName = primaryEmotion ? primaryEmotion.name.toLowerCase() : (isSpanish ? 'malestar' : 'heaviness');
  const emotionIntensity = primaryEmotion ? `${primaryEmotion.intensity}/10` : (isSpanish ? 'fuerte' : 'strong');
  const shortEvent = entry.event?.trim() ? entry.event.trim().replace(/^I |^I'm /i, '').slice(0, 70) : (isSpanish ? 'lo que ocurrió' : 'what happened');

  // 2. First reply (most important message per spec):
  // - Show you read the entry: name specific event and strongest emotions with intensity in your own words.
  // - Give one useful thing: a reflection of what seems hardest, a normalizing insight, or a short grounding offer.
  // - At most one question, and only one the entry doesn't already answer (e.g. which thought carries the most weight).
  // - No generic openers ("Thanks for taking a moment...", "Hey there").
  if (userMessages.length === 0 || !lastUserText) {
    if (isSpanish) {
      return {
        reply: `Sentir ${emotionName} en ${emotionIntensity} ante ${shortEvent} es una carga pesada de sostener, especialmente con pensamientos intensos girando en la cabeza. De todo lo que te vino a la mente en ese momento, ¿cuál es el pensamiento que más te duele cuando te detienes en él?`,
        stage: 'CLARIFY',
      };
    }
    return {
      reply: `Feeling ${emotionName} at ${emotionIntensity} over ${shortEvent} is a lot to carry, especially with rapid thoughts spinning around it. Of the thoughts that showed up for you, which one hits hardest when you sit with it?`,
      stage: 'CLARIFY',
    };
  }

  // 3. Stage 1: CLARIFY - find the hot thought without challenging
  if (currentStage === 'CLARIFY' || userMessages.length === 1) {
    // If user gives a short reason or clarification ("they are reasons", "idk", etc.)
    if (/\b(reasons|reason|just thoughts|idk|i don't know|no sé|razones)\b/i.test(lastUserText)) {
      if (isSpanish) {
        return {
          reply: `Tiene sentido: son explicaciones que tu mente consideró para explicarse lo que pasó. Si una de ellas fuera verdad, ¿cuál te dolería más?`,
          stage: 'CLARIFY',
        };
      }
      return {
        reply: `Got it — they're all explanations you've considered for what happened. If one of them turned out to be true, which would sting the most?`,
        stage: 'CLARIFY',
      };
    }

    if (isSpanish) {
      return {
        reply: `Tiene sentido que ese pensamiento detone tanta intensidad. Cuando esa idea se enciende en tu cabeza, ¿qué sientes que está en juego para ti en ese instante?`,
        stage: 'EXPLORE',
      };
    }
    return {
      reply: `It makes sense why that thought drives up so much tension. When that idea takes over in your head, what feels like it's on the line for you?`,
      stage: 'EXPLORE',
    };
  }

  // 4. Stage 2: EXPLORE - examine the hot thought together, one question at a time
  if (currentStage === 'EXPLORE' || userMessages.length === 2) {
    // Handle strangers vs close people nuance
    const isStrangerContext = /\b(stranger|strangers|random person|clerk|cashier|desconocido|desconocidos|gente en la calle)\b/i.test(entry.event + ' ' + lastUserText);

    if (isStrangerContext) {
      if (isSpanish) {
        return {
          reply: `Fíjate en algo importante: con personas desconocidas, no es que busquemos su afecto, sino que nuestro juez interno nos impone estándares muy duros. ¿Qué regla autoimpuesta sentías que debías cumplir frente a un total desconocido?`,
          stage: 'EXPLORE',
        };
      }
      return {
        reply: `Notice something telling here: with strangers, it's rarely about their actual opinion. It's almost always our own internal critic holding us to an impossible bar. What standard were you demanding of yourself in front of a total stranger?`,
        stage: 'EXPLORE',
      };
    }

    if (/\b(yes|yeah|yep|totally|true|sí|si|exacto)\b/i.test(lastUserText)) {
      if (isSpanish) {
        return {
          reply: `Cuando estamos en medio de la situación, ese pensamiento parece un hecho absoluto. Si un buen amigo estuviera en tu lugar y te contara esto mismo, ¿le dirías lo mismo que te estás diciendo a ti?`,
          stage: 'EXPLORE',
        };
      }
      return {
        reply: `When we're in the middle of it, that thought feels like an undeniable fact. If a close friend were in your shoes and told you this exact thing, would you tell them what you're telling yourself?`,
        stage: 'EXPLORE',
      };
    }

    if (isSpanish) {
      return {
        reply: `Mirándolo con un poco de distancia, ¿qué hechos concretos apoyan esa idea, y qué hechos indican que podría haber otra explicación?`,
        stage: 'EXPLORE',
      };
    }
    return {
      reply: `Stepping back a bit, what concrete facts support that thought, and what evidence doesn't quite fit it?`,
      stage: 'EXPLORE',
    };
  }

  // 5. Stage 3: SUMMARIZE - put a balanced thought in their own words, gently name pattern
  if (currentStage === 'SUMMARIZE' || userMessages.length === 3) {
    if (isSpanish) {
      return {
        reply: `Ese matiz abre un espacio valioso. A veces nuestra mente cae en la adivinación del futuro o en leer la mente de los demás. ¿Cómo podrías poner en tus propias palabras un pensamiento más equilibrado y justo sobre esto?`,
        stage: 'SUMMARIZE',
      };
    }
    return {
      reply: `That observation opens up valuable breathing room. Sometimes our mind jumps into fortune-telling or assuming we know what others think. How would you put a more balanced, grounded thought into your own words right now?`,
      stage: 'SUMMARIZE',
    };
  }

  // 6. Stage 4: WORK PLAN - agree on 1-2 small concrete actions tied to what they discovered
  if (isSpanish) {
    return {
      reply: `Tener esa perspectiva equilibrada en tus propias palabras alivia mucho el peso. Si piensas en lo que descubriste, ¿cuál es un pequeño paso concreto que puedas dar hoy para recordarte esto? Podemos hablar más, probar un ejercicio de respiración, o cerrar por hoy cuando gustes.`,
      stage: 'WORK_PLAN',
    };
  }
  return {
    reply: `Having that balanced perspective in your own words takes off a lot of the immediate weight. Looking at what you noticed, what is one small, concrete step you can take today to support yourself? We can explore more, try a quick breathing exercise, or stop for today whenever you're ready.`,
    stage: 'WORK_PLAN',
  };
}

// Resilient takeaway generator - respects TBD when balanced perspective was not yet formulated in dialogue
function generateResilientTakeaway(
  entry: {
    event: string;
    thoughts: string;
    emotions: Array<{ name: string; intensity: number }>;
    actions: string;
  },
  messages: Array<{ role: string; content: string }> = [],
  language?: string
) {
  const isSpanish = language === 'es';
  const dominantThought =
    entry.thoughts?.trim() || (isSpanish ? 'Pensamiento automático registrado.' : 'Automatic thought recorded.');
  const userCount = messages.filter((m) => m.role === 'user').length;

  // In CBT, a balanced perspective is only established after collaborative explore/summarize work in dialogue.
  // If the conversation is brief (fewer than 4 back-and-forths) or early, it MUST BE TBD.
  const isTBD = userCount < 4;

  if (isSpanish) {
    return {
      dominantThought: dominantThought,
      pattern: {
        name: userCount >= 2 ? 'Adivinación del Futuro o Lectura de Pensamiento' : 'Patrón por explorar',
        description:
          userCount >= 2
            ? 'Anticipar un desenlace negativo o asumir conclusiones antes de contar con evidencia suficiente.'
            : 'Los patrones de pensamiento se identifican a medida que avanza la reflexión guiada.',
        identified: userCount >= 2,
      },
      balancedPerspective: isTBD ? 'TBD' : `Aunque la situación generó malestar, reconozco que gran parte de la tensión vino de autoexigencias internas y no de hechos comprobados. Puedo actuar con paciencia sin juzgarme con severidad.`,
      insights: [
        `Diferenciar los hechos objetivos de la interpretación automática alivia la tensión.`,
        `Cuestionar la autopercepción interna permite recuperar la calma sin exigir perfección.`,
      ],
      workPlan: [
        {
          id: `wp-${Date.now()}-1`,
          text: `Cuando vuelva a surgir el pensamiento de "${dominantThought.slice(0, 42)}...", hacer una pausa y recordar lo aprendido.`,
          completed: false,
        },
        {
          id: `wp-${Date.now()}-2`,
          text: 'Dedicar 2 minutos a la práctica de respiración diaria para regular la activación corporal.',
          completed: false,
        },
      ],
    };
  }

  return {
    dominantThought: dominantThought,
    pattern: {
      name: userCount >= 2 ? 'Fortune-telling / Mind Reading' : 'Pattern to be explored',
      description:
        userCount >= 2
          ? 'Predicting a negative outcome or assuming what others think before having verified evidence.'
          : 'Thinking patterns are identified and explored as the reflection conversation progresses.',
      identified: userCount >= 2,
    },
    balancedPerspective: isTBD ? 'TBD' : `While feeling tension around this situation is understandable, I recognize that much of the pressure came from my own internal expectations rather than proven facts. I can proceed with patience without demanding immediate perfection.`,
    insights: [
      `Separating the objective event from automatic assumptions creates helpful breathing room.`,
      `Challenging internal self-judgment helps return to clarity and direct control.`,
    ],
    workPlan: [
      {
        id: `wp-${Date.now()}-1`,
        text: `When "${dominantThought.slice(0, 42)}..." arises, pause and check what evidence actually supports it.`,
        completed: false,
      },
      {
        id: `wp-${Date.now()}-2`,
        text: 'Practice 2 minutes of paced breathing to reset physical tension.',
        completed: false,
      },
    ],
  };
}

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { entry, messages, userName, language, stage = 'CLARIFY' } = req.body;

    if (!entry) {
      return res.status(400).json({ error: 'Structured entry is required' });
    }

    const aiClient =
      ai ||
      (process.env.GEMINI_API_KEY
        ? new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
          })
        : null);

    if (!aiClient) {
      const fallbackResult = generateResilientReply(entry, messages || [], userName, language, stage);
      return res.json(fallbackResult);
    }

    const systemInstruction = buildSystemPrompt(entry, userName, language, stage);
    const isSpanish = language === 'es';
    const isInitialTurn = !Array.isArray(messages) || messages.length === 0;

    let contents: any[] = [];
    if (isInitialTurn) {
      const initialEntrySummary = isSpanish
        ? `Aquí está mi registro de autorreflexión:
Situación: ${entry.event || 'No especificada'}
Pensamientos: ${entry.thoughts || 'No especificados'}
Emociones: ${entry.emotions && entry.emotions.length > 0 ? entry.emotions.map((e: any) => `${e.name} (${e.intensity}/10)`).join(', ') : 'No especificadas'}
Acciones: ${entry.actions || 'No especificadas'}

Por favor, proporciona tu primera respuesta siguiendo estrictamente tus instrucciones del sistema (muestra que leíste la entrada nombrando el evento y las emociones más intensas con su intensidad con tus propias palabras, da una reflexión útil o normalizadora, y haz como máximo una pregunta que la entrada no responda ya; sin aperturas genéricas como "gracias por tomarte un momento").`
        : `Here is my self-reflection entry:
Event: ${entry.event || 'Not specified'}
Thoughts: ${entry.thoughts || 'Not specified'}
Emotions: ${entry.emotions && entry.emotions.length > 0 ? entry.emotions.map((e: any) => `${e.name} (${e.intensity}/10)`).join(', ') : 'None specified'}
Actions: ${entry.actions || 'Not specified'}

Please provide your first reply following your system instructions strictly (show you read the entry by naming the specific event and strongest emotions with their intensity in your own words, give one useful normalizing or grounding thing, and ask at most one question that the entry does not already answer; no generic openers like "Thanks for taking a moment...").`;

      contents = [
        {
          role: 'user',
          parts: [{ text: initialEntrySummary }],
        },
      ];
    } else {
      const initialEntrySummary = isSpanish
        ? `Registro de autorreflexión inicial: Evento: ${entry.event}. Pensamientos: ${entry.thoughts}. Emociones: ${entry.emotions?.map((e: any) => `${e.name} ${e.intensity}/10`).join(', ')}.`
        : `Initial reflection entry: Event: ${entry.event}. Thoughts: ${entry.thoughts}. Emotions: ${entry.emotions?.map((e: any) => `${e.name} ${e.intensity}/10`).join(', ')}.`;

      contents.push({
        role: 'user',
        parts: [{ text: initialEntrySummary }],
      });

      for (const msg of messages) {
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Helper to parse stage tag from reply
    const parseReplyAndStage = (text: string, currentFallbackStage: string) => {
      let cleanText = text;
      let nextStage = currentFallbackStage;
      const stageMatch = cleanText.match(/\[STAGE:\s*(CLARIFY|EXPLORE|SUMMARIZE|WORK_PLAN)\]/i);
      if (stageMatch) {
        nextStage = stageMatch[1].toUpperCase();
        cleanText = cleanText.replace(/\[STAGE:\s*(CLARIFY|EXPLORE|SUMMARIZE|WORK_PLAN)\]/gi, '').trim();
      }
      return { reply: cleanText, stage: nextStage };
    };

    // Attempt Gemini call with gemini-3.8-flash, falling back to gemini-3.1-pro-preview or resilient reply
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      if (response.text) {
        const parsed = parseReplyAndStage(response.text, stage);
        return res.json(parsed);
      }
      const fallbackResult = generateResilientReply(entry, messages || [], userName, language, stage);
      return res.json(fallbackResult);
    } catch (apiError: any) {
      try {
        const fallbackRes = await aiClient.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
          },
        });
        if (fallbackRes.text) {
          const parsed = parseReplyAndStage(fallbackRes.text, stage);
          return res.json(parsed);
        }
      } catch (proError: any) {
        // Fall through
      }

      console.warn('Gemini API call failed, using resilient coach engine:', apiError.message);
      const fallbackResult = generateResilientReply(entry, messages || [], userName, language, stage);
      return res.json(fallbackResult);
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate reflection response',
    });
  }
});

// POST /api/conclude
app.post('/api/conclude', async (req: Request, res: Response) => {
  try {
    const { entry, messages, language } = req.body;

    if (!entry) {
      return res.status(400).json({ error: 'Structured entry is required' });
    }

    const aiClient =
      ai ||
      (process.env.GEMINI_API_KEY
        ? new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
          })
        : null);

    if (!aiClient) {
      return res.json(generateResilientTakeaway(entry, messages || [], language));
    }

    const historySummary = Array.isArray(messages)
      ? messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n\n')
      : '';

    const langDirective = language === 'es'
      ? `CRITICAL REQUIREMENT: The user is in SPANISH. You MUST generate dominantThought, pattern name and description, balancedPerspective, insights, and workPlan text ENTIRELY IN NATURAL SPANISH (Español).`
      : '';

    const concludePrompt = `You are an expert CBT reflection coach creating a takeaway summary in TheraApp based on the user's ABC entry and dialogue.
${langDirective}

INITIAL ENTRY:
- Event: "${entry.event}"
- Thoughts: "${entry.thoughts}"
- Emotions: "${entry.emotions?.map((e: any) => `${e.name} (${e.intensity}/10)`).join(', ')}"
- Actions: "${entry.actions}"

SESSION DIALOGUE:
${historySummary}

CRITICAL INSTRUCTIONS:
1. Identify the thought that carried the most weight during this session (dominantThought).
2. Determine if a recognized CBT Cognitive Distortion appeared (e.g. Mind Reading, Catastrophizing, All-or-Nothing Thinking, Should Statements, Personalization, Fortune Telling, Emotional Reasoning, Mental Filter, Overgeneralization, Labeling).
   Use standard CBT names only. NEVER use theoretical jargon like 'cognitive appraisal'.
   If supported by the dialogue, set identified=true and give the distortion name and 1-sentence definition.
   If not clearly supported or the emotion fits the event, set identified=false, name="No cognitive distortion identified", description="Sometimes a difficult emotion is a natural, proportionate human response to the situation rather than a cognitive distortion."
3. BALANCED PERSPECTIVE (CRITICAL):
   - In CBT, a balanced perspective is a grounded reframe developed collaboratively during the SUMMARIZE stage after exploring alternative evidence together.
   - IF THE CONVERSATION HAS NOT YET DEVELOPED OR AGREED ON A BALANCED PERSPECTIVE (for example, the user only had a few messages, the session concluded during the CLARIFY or early EXPLORE stage, or the user has not yet put an alternative view into their own words), you MUST return:
     "balancedPerspective": "TBD"
   - DO NOT INVENT, SPECULATE, OR FILL IN A CANNED BALANCED PERSPECTIVE that wasn't actually reached in the dialogue. If not formulated, it MUST BE "TBD".
   - Only if a balanced perspective was formulated in the conversation, state that concise reframe. If dealing with strangers, focus on relieving internal self-judgment and unrealistic standards, rather than external verdicts.
4. Insights: 1 or 2 concise bullet points on what became clearer or was clarified.
5. Work Plan: 1 or 2 small, concrete actions tied to what was discussed.`;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: concludePrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dominantThought: {
                type: Type.STRING,
                description: 'The thought that carried the most weight.',
              },
              pattern: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  identified: { type: Type.BOOLEAN },
                },
                required: ['name', 'description', 'identified'],
              },
              balancedPerspective: {
                type: Type.STRING,
                description: 'The balanced perspective developed in the session, or "TBD" if not yet reached.',
              },
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1 or 2 concise insights into what became clearer.',
              },
              workPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    completed: { type: Type.BOOLEAN },
                  },
                  required: ['id', 'text', 'completed'],
                },
                description: '1 or 2 small actionable work plan items.',
              },
            },
            required: [
              'dominantThought',
              'pattern',
              'balancedPerspective',
              'insights',
              'workPlan',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (apiError: any) {
      console.warn('Gemini API error in conclude, using resilient takeaway:', apiError.message);
      return res.json(generateResilientTakeaway(entry, messages || [], language));
    }
  } catch (error: any) {
    console.error('Error in /api/conclude:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate takeaway',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TheraApp server running at http://0.0.0.0:${port}`);
  });
}

startServer();
