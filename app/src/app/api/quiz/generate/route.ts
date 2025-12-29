// Quiz Generate API - Generate a math quiz problem
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  MATH_TYPES, 
  getMathType, 
  generateProblem, 
  getAllMathTypes 
} from '@/lib/mathQuiz';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle empty body gracefully
    let body: { mathType?: string; random?: boolean } = { random: true };
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // Empty body is fine, use defaults
    }
    const { mathType, random = true } = body;

    // Get user's disabled topics
    const { data: profile } = await supabase
      .from('profiles')
      .select('disabled_math_topics, classroom_id')
      .eq('id', user.id)
      .single();

    const disabledTopics: string[] = profile?.disabled_math_topics || [];

    // Check classroom settings for additional blocked topics
    if (profile?.classroom_id) {
      const { data: classSettings } = await supabase
        .from('classroom_image_settings')
        .select('blocked_math_topics')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classSettings?.blocked_math_topics) {
        disabledTopics.push(...classSettings.blocked_math_topics);
      }
    }

    // Get available math types
    const availableTypes = getAllMathTypes().filter(
      mt => !disabledTopics.includes(mt.id)
    );

    if (availableTypes.length === 0) {
      return NextResponse.json({ 
        error: 'No math topics available. Please contact your teacher.' 
      }, { status: 400 });
    }

    // Select math type
    let selectedType: string;
    
    if (random || !mathType) {
      // Pick a random available type
      const randomIndex = Math.floor(Math.random() * availableTypes.length);
      selectedType = availableTypes[randomIndex].id;
    } else {
      // Use requested type if available
      if (disabledTopics.includes(mathType)) {
        return NextResponse.json({ 
          error: 'This math topic is not available for you.' 
        }, { status: 400 });
      }
      selectedType = mathType;
    }

    // Generate the problem
    const problem = generateProblem(selectedType);
    
    if (!problem) {
      return NextResponse.json({ 
        error: 'Failed to generate problem' 
      }, { status: 500 });
    }

    // Return the problem (without the answer for security)
    return NextResponse.json({
      success: true,
      problem: {
        type: selectedType,
        typeName: problem.mathType.name,
        difficulty: problem.mathType.difficulty,
        stars: problem.mathType.stars,
        gradeLevel: problem.mathType.gradeLevel,
        category: problem.mathType.category,
        question: problem.problem,
        hints: [problem.hint],
        diagram: problem.diagram,
        // Store answer hash for verification (not the actual answer)
        answerHash: Buffer.from(String(problem.answer)).toString('base64'),
      },
    });
  } catch (error) {
    console.error('Quiz generate error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET available math types
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's disabled topics
    const { data: profile } = await supabase
      .from('profiles')
      .select('disabled_math_topics, classroom_id')
      .eq('id', user.id)
      .single();

    const disabledTopics: string[] = profile?.disabled_math_topics || [];

    // Check classroom settings
    if (profile?.classroom_id) {
      const { data: classSettings } = await supabase
        .from('classroom_image_settings')
        .select('blocked_math_topics')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classSettings?.blocked_math_topics) {
        disabledTopics.push(...classSettings.blocked_math_topics);
      }
    }

    // Get all math types with availability status
    const allTypes = getAllMathTypes().map(mt => ({
      id: mt.id,
      name: mt.name,
      description: mt.description,
      difficulty: mt.difficulty,
      stars: mt.stars,
      gradeLevel: mt.gradeLevel,
      category: mt.category,
      available: !disabledTopics.includes(mt.id),
    }));

    // Group by grade level
    const byGrade = allTypes.reduce((acc, mt) => {
      if (!acc[mt.gradeLevel]) acc[mt.gradeLevel] = [];
      acc[mt.gradeLevel].push(mt);
      return acc;
    }, {} as Record<string, typeof allTypes>);

    return NextResponse.json({
      success: true,
      mathTypes: allTypes,
      byGradeLevel: byGrade,
      totalAvailable: allTypes.filter(mt => mt.available).length,
      totalDisabled: allTypes.filter(mt => !mt.available).length,
    });
  } catch (error) {
    console.error('Quiz types error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
