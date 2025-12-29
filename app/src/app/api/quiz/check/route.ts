// Quiz Check API - Check answer and award tokens
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAnswer } from '@/lib/mathQuiz';
import { STREAK_BONUSES, DEFAULT_QUESTIONS_PER_TOKEN } from '@/lib/mathQuiz/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mathType, problemType, userAnswer, answerHash, problemText } = body;
    
    // Accept either mathType or problemType (modal sends problemType)
    const type = mathType || problemType;

    if (!type || userAnswer === undefined || !answerHash) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Decode the correct answer from hash
    const correctAnswer = Buffer.from(answerHash, 'base64').toString('utf-8');

    // Check the answer
    const isCorrect = checkAnswer(userAnswer, correctAnswer, type);

    // Get user's current stats
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('image_tokens, quiz_streak, classroom_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    let newStreak = profile?.quiz_streak || 0;
    let tokensEarned = 0;
    let streakBonus = false;
    let questionsPerToken = DEFAULT_QUESTIONS_PER_TOKEN;

    // Get classroom settings if applicable
    if (profile?.classroom_id) {
      const { data: classSettings } = await supabase
        .from('classroom_image_settings')
        .select('questions_per_token')
        .eq('classroom_id', profile.classroom_id)
        .single();

      if (classSettings?.questions_per_token) {
        questionsPerToken = classSettings.questions_per_token;
      }
    }

    if (isCorrect) {
      newStreak++;

      // Check if we've earned a token (every N correct answers)
      // For simplicity, we award a token on every Nth correct answer
      // The streak is cumulative, so we check modulo
      if (newStreak % questionsPerToken === 0) {
        // Calculate streak bonus
        let bonusMultiplier = 1;
        
        for (const [threshold, bonus] of Object.entries(STREAK_BONUSES)) {
          if (newStreak >= parseInt(threshold)) {
            bonusMultiplier = bonus;
            streakBonus = true;
          }
        }
        
        tokensEarned = bonusMultiplier;
      }
    } else {
      // Wrong answer resets streak
      newStreak = 0;
    }

    // Update user's profile
    const newTokens = (profile?.image_tokens || 0) + tokensEarned;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        image_tokens: newTokens,
        quiz_streak: newStreak,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Log the quiz attempt
    const { error: logError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        math_type: type,
        problem: problemText || '',
        user_answer: String(userAnswer),
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        tokens_earned: tokensEarned,
        streak_at_time: newStreak,
      });

    if (logError) {
      console.error('Quiz log error:', logError);
      // Don't fail the request, just log the error
    }

    // Calculate questions until next token
    const questionsUntilNextToken = isCorrect 
      ? questionsPerToken - (newStreak % questionsPerToken)
      : questionsPerToken;

    // Get streak description
    let streakDescription: string | null = null;
    if (newStreak >= 15) {
      streakDescription = '🔥🔥🔥 LEGENDARY STREAK! 4x tokens!';
    } else if (newStreak >= 10) {
      streakDescription = '🔥🔥 AMAZING STREAK! 3x tokens!';
    } else if (newStreak >= 5) {
      streakDescription = '🔥 HOT STREAK! 2x tokens!';
    } else if (newStreak >= 3) {
      streakDescription = '✨ Nice streak! Keep going!';
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer,
      streak: newStreak,
      tokensEarned,
      totalTokens: newTokens,
      streakBonus,
      streakDescription,
      questionsUntilNextToken: questionsUntilNextToken === questionsPerToken && isCorrect ? 0 : questionsUntilNextToken,
      questionsPerToken,
    });
  } catch (error) {
    console.error('Quiz check error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
