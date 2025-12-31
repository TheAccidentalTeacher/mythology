import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AccuracyIssue {
  claim: string;
  issue: string;
  correction: string;
  severity: 'error' | 'questionable';
}

interface AccuracyReport {
  errors: AccuracyIssue[];
  questionable: AccuracyIssue[];
  correct_facts: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { content, subject } = await request.json();

    if (!content || !subject) {
      return NextResponse.json(
        { error: 'Content and subject are required' },
        { status: 400 }
      );
    }

    const prompts: Record<string, string> = {
      science: `You are a fact-checking assistant for student work. Review this student's writing about science and identify any factual errors. Be gentle but accurate - remember this is for educational feedback.

Student writing:
${content}

Carefully identify:
1. **Clear factual errors** - Things that are scientifically incorrect (e.g., wrong number of planets, incorrect cell parts, misunderstood processes)
2. **Questionable claims** - Statements that need verification or clarification
3. **What they got RIGHT** - Important for positive feedback!

Return ONLY valid JSON in this exact format:
{
  "errors": [
    {
      "claim": "exact quote from student",
      "issue": "why this is incorrect",
      "correction": "the correct information",
      "severity": "error"
    }
  ],
  "questionable": [
    {
      "claim": "exact quote from student",
      "issue": "why this needs clarification",
      "correction": "suggested clarification",
      "severity": "questionable"
    }
  ],
  "correct_facts": [
    "things the student got right - be specific"
  ]
}`,

      history: `You are a fact-checking assistant for student work. Review this student's writing about history and identify any factual errors. Be gentle but accurate - this is for educational feedback.

Student writing:
${content}

Carefully identify:
1. **Clear factual errors** - Incorrect dates, events, people, or historical facts
2. **Questionable claims** - Statements that need verification or may be oversimplified
3. **What they got RIGHT** - Important for positive feedback!

Return ONLY valid JSON in this exact format:
{
  "errors": [
    {
      "claim": "exact quote from student",
      "issue": "why this is incorrect",
      "correction": "the correct information",
      "severity": "error"
    }
  ],
  "questionable": [
    {
      "claim": "exact quote from student",
      "issue": "why this needs clarification",
      "correction": "suggested clarification",
      "severity": "questionable"
    }
  ],
  "correct_facts": [
    "things the student got right - be specific"
  ]
}`,

      civics: `You are a fact-checking assistant for student work about American government and civics. Review this student's writing and identify any factual errors. Be accurate but remember this is educational feedback.

Student writing:
${content}

Carefully identify:
1. **Clear factual errors** - Incorrect information about the Constitution, Bill of Rights, government structure, or civic processes
2. **Questionable claims** - Statements that need clarification or may reflect misunderstanding
3. **What they got RIGHT** - Important for positive feedback!

Focus on factual accuracy about:
- Constitutional provisions and amendments
- Structure of government (branches, checks and balances)
- Historical facts about founding documents
- Civic processes (elections, legislation, etc.)

Return ONLY valid JSON in this exact format:
{
  "errors": [
    {
      "claim": "exact quote from student",
      "issue": "why this is incorrect",
      "correction": "the correct information",
      "severity": "error"
    }
  ],
  "questionable": [
    {
      "claim": "exact quote from student",
      "issue": "why this needs clarification",
      "correction": "suggested clarification",
      "severity": "questionable"
    }
  ],
  "correct_facts": [
    "things the student got right - be specific"
  ]
}`,
    };

    const prompt = prompts[subject];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid subject. Must be science, history, or civics' },
        { status: 400 }
      );
    }

    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || '';

    const report: AccuracyReport = JSON.parse(responseText);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error checking accuracy:', error);
    return NextResponse.json(
      { error: 'Failed to check accuracy' },
      { status: 500 }
    );
  }
}
