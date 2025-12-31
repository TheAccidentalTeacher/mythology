import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { mythologyData, targetSubject, gradeLevel, specificTopic } = await request.json();

    if (!mythologyData || !targetSubject || !gradeLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompts: Record<string, string> = {
      science: `You are an expert educator who creates engaging, curiosity-driven lessons. Convert this student's mythology into a science lesson that uses their creative work as the HOOK.

Student's Mythology:
${JSON.stringify(mythologyData, null, 2)}

Grade Level: ${gradeLevel}
${specificTopic ? `Focus Topic: ${specificTopic}` : ''}

Create a complete lesson plan that:
1. **Uses their mythology as the HOOK** - Start with their gods, creatures, or world
2. **Connects to real science** - Teach actual scientific concepts
3. **Maintains the fun** - Keep the creativity and engagement
4. **Includes activities** - Hands-on or creative applications
5. **Aligns with standards** - Reference NGSS when appropriate

Examples:
- Water god → Water cycle, states of matter, hydrosphere
- Fire god → Chemical reactions, combustion, energy transfer
- Creation myth → Big Bang theory, cell division, evolution
- Flying creatures → Aerodynamics, bird anatomy, physics of flight
- Underground realms → Geology, plate tectonics, caves

Return a JSON object with:
{
  "lessonTitle": "engaging title",
  "scienceTopic": "specific science concept",
  "mythologyConnection": "how their work connects",
  "learningObjectives": ["objective 1", "objective 2"],
  "materials": ["material 1", "material 2"],
  "hook": "engaging opening using their mythology",
  "directInstruction": "main teaching content",
  "guidedPractice": "activity with scaffolding",
  "independentPractice": "what students do independently",
  "closure": "wrap-up and assessment",
  "extensions": ["challenge 1", "challenge 2"],
  "assessmentIdeas": ["idea 1", "idea 2"],
  "crossCurricularConnections": ["connection 1", "connection 2"],
  "ngssStandards": ["standard if applicable"]
}`,

      civics: `You are an expert educator who creates engaging civics lessons. Convert this student's mythology into a lesson about American government, the Constitution, and founding principles.

Student's Mythology:
${JSON.stringify(mythologyData, null, 2)}

Grade Level: ${gradeLevel}

Create a complete lesson plan that:
1. **Uses their mythology as the HOOK** - Start with their government, laws, or conflicts
2. **Connects to US Constitution and founding documents**
3. **Teaches American principles** - Rule of law, individual rights, checks and balances
4. **Maintains engagement** - Make civics exciting through their creativity
5. **Promotes critical thinking** - Compare and contrast their world with American democracy

Examples:
- Pantheon structure → Separation of powers, checks and balances
- Gods' rules → Constitution and amendments
- Individual vs. collective rights → Bill of Rights
- Conflicts between gods → How Constitution resolves disputes
- Hero's journey → Founding Fathers' vision and sacrifice

Return a JSON object with:
{
  "lessonTitle": "engaging title",
  "civicsTopic": "specific civics concept",
  "mythologyConnection": "how their work connects",
  "learningObjectives": ["objective 1", "objective 2"],
  "materials": ["material 1", "material 2"],
  "hook": "engaging opening using their mythology",
  "directInstruction": "main teaching content about American government",
  "constitutionalConnections": ["connection 1", "connection 2"],
  "guidedPractice": "activity comparing their world to American system",
  "independentPractice": "what students do independently",
  "closure": "wrap-up and assessment",
  "extensions": ["challenge 1", "challenge 2"],
  "primarySources": ["founding document excerpts to include"],
  "discussionQuestions": ["question 1", "question 2"]
}`,

      math: `You are an expert educator who creates engaging math lessons. Convert this student's mythology into a mathematics lesson that uses their creative work as the HOOK.

Student's Mythology:
${JSON.stringify(mythologyData, null, 2)}

Grade Level: ${gradeLevel}
${specificTopic ? `Focus Topic: ${specificTopic}` : ''}

Create a complete lesson plan that:
1. **Uses their mythology as the HOOK** - Start with their numbers, patterns, or structures
2. **Teaches real math concepts**
3. **Makes math relevant** - Show why math matters through their world
4. **Includes problem-solving** - Real applications
5. **Builds number sense and reasoning**

Examples:
- Pantheon relationships → Ratios, proportions, fractions
- God powers → Exponents, multiplication
- Realm sizes → Area, volume, measurement
- Battle outcomes → Probability, statistics
- Time periods → Timeline math, elapsed time
- Character ages → Number operations, word problems

Return a JSON object with:
{
  "lessonTitle": "engaging title",
  "mathTopic": "specific math concept",
  "mythologyConnection": "how their work connects",
  "learningObjectives": ["objective 1", "objective 2"],
  "materials": ["material 1", "material 2"],
  "hook": "engaging opening using their mythology",
  "directInstruction": "main teaching content",
  "guidedPractice": "problems using their mythology",
  "independentPractice": "what students solve independently",
  "closure": "wrap-up and assessment",
  "extensions": ["challenge problems"],
  "realWorldConnections": ["connection 1", "connection 2"],
  "commonCoreStandards": ["standard if applicable"]
}`,

      ela: `You are an expert educator who creates engaging English Language Arts lessons. Convert this student's mythology into an ELA lesson that builds on their creative work.

Student's Mythology:
${JSON.stringify(mythologyData, null, 2)}

Grade Level: ${gradeLevel}
${specificTopic ? `Focus Topic: ${specificTopic}` : ''}

Create a complete lesson plan that:
1. **Builds on their mythology** - Use what they created
2. **Teaches ELA skills** - Reading, writing, speaking, listening
3. **Develops deeper understanding** - Literary elements, author's craft
4. **Promotes revision and growth** - Make their work even better
5. **Aligns with standards** - Reference Common Core when appropriate

Examples:
- Character development → Character analysis, motivation, arc
- Story structure → Plot diagram, narrative structure, pacing
- Descriptive writing → Imagery, sensory details, word choice
- Dialogue → Punctuation, characterization through speech
- Poetry → Figurative language, meter, rhyme
- Research → Comparing to real mythologies

Return a JSON object with:
{
  "lessonTitle": "engaging title",
  "elaTopic": "specific ELA skill",
  "mythologyConnection": "how their work connects",
  "learningObjectives": ["objective 1", "objective 2"],
  "materials": ["material 1", "material 2"],
  "hook": "engaging opening using their mythology",
  "directInstruction": "main teaching content",
  "modelingExamples": "show examples from their work",
  "guidedPractice": "activity with scaffolding",
  "independentPractice": "what students write/revise",
  "closure": "wrap-up and sharing",
  "extensions": ["challenge 1", "challenge 2"],
  "assessmentIdeas": ["idea 1", "idea 2"],
  "commonCoreStandards": ["standard if applicable"]
}`,
    };

    const prompt = prompts[targetSubject];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid subject. Must be science, civics, math, or ela' },
        { status: 400 }
      );
    }

    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 3000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || '';

    const lesson = JSON.parse(responseText);

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error converting to lesson:', error);
    return NextResponse.json(
      { error: 'Failed to convert to lesson' },
      { status: 500 }
    );
  }
}
