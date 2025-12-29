// Math Types System - TypeScript Port
// 33 types of math problems for earning image tokens!

import { MathTypeConfig, MathProblem } from './types';

// Helper function to generate random integer between min and max (inclusive)
const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to find GCD
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const MATH_TYPES: Record<string, MathTypeConfig> = {
  // ========== ELEMENTARY LEVEL ⭐ ==========
  'mult-1-12': {
    id: 'mult-1-12',
    name: 'Multiplication 1-12',
    description: 'Basic multiplication tables',
    difficulty: 1,
    stars: '⭐',
    reward: 10,
    xpReward: 5,
    gradeLevel: 'Elementary',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(1, 12);
      const b = randInt(1, 12);
      return {
        problem: `${a} × ${b} = ?`,
        answer: a * b,
        hint: `Think: ${a} groups of ${b}`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'addition-single': {
    id: 'addition-single',
    name: 'Single Digit Addition',
    description: 'Add two single-digit numbers',
    difficulty: 1,
    stars: '⭐',
    reward: 8,
    xpReward: 4,
    gradeLevel: 'Elementary',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(0, 9);
      const b = randInt(0, 9);
      return {
        problem: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `Add them together!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'subtraction-basic': {
    id: 'subtraction-basic',
    name: 'Basic Subtraction',
    description: 'Subtract single-digit numbers (no negatives)',
    difficulty: 1,
    stars: '⭐',
    reward: 8,
    xpReward: 4,
    gradeLevel: 'Elementary',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(5, 14);
      const b = randInt(0, a);
      return {
        problem: `${a} - ${b} = ?`,
        answer: a - b,
        hint: `What's the difference?`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  // ========== MIDDLE SCHOOL LEVEL ⭐⭐ ==========
  'addition-double': {
    id: 'addition-double',
    name: 'Double Digit Addition',
    description: 'Add two-digit numbers',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 15,
    xpReward: 8,
    gradeLevel: 'Middle School',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      return {
        problem: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `Try breaking it into tens and ones!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'division-basic': {
    id: 'division-basic',
    name: 'Basic Division',
    description: 'Division with whole number answers',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 12,
    xpReward: 6,
    gradeLevel: 'Middle School',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const divisor = randInt(2, 11);
      const quotient = randInt(2, 10);
      const dividend = divisor * quotient;
      return {
        problem: `${dividend} ÷ ${divisor} = ?`,
        answer: quotient,
        hint: `Think multiplication: ${divisor} × ? = ${dividend}`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  // ========== ADVANCED MIDDLE ⭐⭐⭐ ==========
  'mult-2x1': {
    id: 'mult-2x1',
    name: '2×1 Multiplication',
    description: 'Two-digit × one-digit',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 25,
    xpReward: 12,
    gradeLevel: 'Middle School',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(10, 99);
      const b = randInt(2, 9);
      return {
        problem: `${a} × ${b} = ?`,
        answer: a * b,
        hint: `Break ${a} into tens and ones!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'mult-2x2': {
    id: 'mult-2x2',
    name: '2×2 Multiplication',
    description: 'Two-digit × two-digit',
    difficulty: 4,
    stars: '⭐⭐⭐⭐',
    reward: 50,
    xpReward: 20,
    gradeLevel: 'Middle School',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      return {
        problem: `${a} × ${b} = ?`,
        answer: a * b,
        hint: `Use the distributive property!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'fractions-basic': {
    id: 'fractions-basic',
    name: 'Basic Fractions',
    description: 'Add fractions with same denominator',
    difficulty: 4,
    stars: '⭐⭐⭐⭐',
    reward: 40,
    xpReward: 18,
    gradeLevel: 'Middle School',
    category: 'fractions',
    
    generate: (): MathProblem => {
      const a = randInt(1, 5);
      const b = randInt(1, 5);
      const denom = randInt(3, 10);
      const numeratorSum = a + b;
      
      return {
        problem: `${a}/${denom} + ${b}/${denom} = ?`,
        answer: `${numeratorSum}/${denom}`,
        hint: `Same denominator? Just add the numerators!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return userAnswer.replace(/\s/g, '') === String(correctAnswer).replace(/\s/g, '');
    }
  },

  // ========== 6TH GRADE LEVEL ==========
  'parallelogram-area': {
    id: 'parallelogram-area',
    name: 'Parallelogram Area',
    description: 'Find area of parallelograms (A = b × h)',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 25,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'geometry',
    
    generate: (): MathProblem => {
      const base = randInt(5, 20);
      const height = randInt(3, 15);
      const area = base * height;
      
      const diagram = `
        <svg width="280" height="170" viewBox="0 0 280 170">
          <polygon points="50,120 ${50 + base * 8},120 ${70 + base * 8},40 70,40" 
                   fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
          <line x1="50" y1="130" x2="${50 + base * 8}" y2="130" 
                stroke="#e74c3c" stroke-width="2"/>
          <text x="${50 + base * 4}" y="150" text-anchor="middle" 
                font-size="16" fill="#e74c3c" font-weight="bold">base = ${base}</text>
          <line x1="70" y1="40" x2="70" y2="120" 
                stroke="#27ae60" stroke-width="2" stroke-dasharray="5,5"/>
          <text x="30" y="80" text-anchor="middle" 
                font-size="16" fill="#27ae60" font-weight="bold">h = ${height}</text>
          <rect x="65" y="115" width="10" height="10" fill="none" stroke="#27ae60" stroke-width="1"/>
        </svg>
      `;
      
      return {
        problem: `Find the area of the parallelogram.\n\nBase = ${base} cm, Height = ${height} cm`,
        answer: area,
        hint: `Area of parallelogram = base × height`,
        diagram
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'triangle-area': {
    id: 'triangle-area',
    name: 'Triangle Area',
    description: 'Find area of triangles (A = ½bh)',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 30,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'geometry',
    
    generate: (): MathProblem => {
      const base = randInt(4, 16);
      const height = randInt(4, 14);
      // Make sure it's evenly divisible
      const adjustedBase = base % 2 === 0 ? base : base + 1;
      const area = (adjustedBase * height) / 2;
      
      const diagram = `
        <svg width="300" height="200" viewBox="0 0 300 200">
          <polygon points="150,30 ${150 - adjustedBase * 6},160 ${150 + adjustedBase * 6},160" 
                   fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
          <line x1="150" y1="30" x2="150" y2="160" 
                stroke="#27ae60" stroke-width="2" stroke-dasharray="5,5"/>
          <text x="165" y="95" font-size="14" fill="#27ae60" font-weight="bold">h=${height}</text>
          <text x="150" y="180" text-anchor="middle" font-size="14" fill="#e74c3c" font-weight="bold">base=${adjustedBase}</text>
          <rect x="145" y="155" width="10" height="10" fill="none" stroke="#27ae60" stroke-width="1"/>
        </svg>
      `;
      
      return {
        problem: `Find the area of the triangle.\n\nBase = ${adjustedBase}, Height = ${height}`,
        answer: area,
        hint: `Area of triangle = ½ × base × height`,
        diagram
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseFloat(userAnswer) === correctAnswer;
    }
  },

  'decimals-operations': {
    id: 'decimals-operations',
    name: 'Decimal Operations',
    description: 'Add and subtract decimals',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 25,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const isAdd = Math.random() > 0.5;
      const a = (randInt(100, 999) / 10);  // 10.0 - 99.9
      const b = (randInt(100, 999) / 10);
      
      if (isAdd) {
        const answer = Math.round((a + b) * 10) / 10;
        return {
          problem: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
          answer,
          hint: `Line up the decimal points, then add!`
        };
      } else {
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        const answer = Math.round((larger - smaller) * 10) / 10;
        return {
          problem: `${larger.toFixed(1)} - ${smaller.toFixed(1)} = ?`,
          answer,
          hint: `Line up the decimal points, then subtract!`
        };
      }
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return Math.abs(parseFloat(userAnswer) - Number(correctAnswer)) < 0.01;
    }
  },

  'ratio-concepts': {
    id: 'ratio-concepts',
    name: 'Ratio Concepts',
    description: 'Simplify ratios to lowest terms',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 25,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'ratios',
    
    generate: (): MathProblem => {
      const multiplier = randInt(2, 6);
      const a = randInt(2, 8);
      const b = randInt(2, 8);
      const bigA = a * multiplier;
      const bigB = b * multiplier;
      
      // Make sure they're coprime for the simplified version
      const g = gcd(a, b);
      const simplifiedA = a / g;
      const simplifiedB = b / g;
      
      return {
        problem: `Simplify the ratio:\n\n${bigA} : ${bigB}\n\nWrite as: a:b`,
        answer: `${simplifiedA}:${simplifiedB}`,
        hint: `Find the greatest common factor and divide both numbers`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      const cleaned = userAnswer.replace(/\s+/g, '').replace(/to/gi, ':');
      const userParts = cleaned.split(':').map(x => parseInt(x));
      const correctParts = String(correctAnswer).split(':').map(x => parseInt(x));
      
      if (userParts.length !== 2 || correctParts.length !== 2) return false;
      
      // Check if ratios are equivalent
      return userParts[0] * correctParts[1] === userParts[1] * correctParts[0];
    }
  },

  'percent-basics': {
    id: 'percent-basics',
    name: 'Percent Basics',
    description: 'Convert decimals to percents',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 35,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'percents',
    
    generate: (): MathProblem => {
      const decimal = randInt(5, 95) / 100;
      const percent = decimal * 100;
      
      return {
        problem: `Convert to a percent:\n\n${decimal.toFixed(2)} = ?%`,
        answer: percent,
        hint: `Multiply by 100 to convert decimal to percent`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      const cleaned = userAnswer.replace('%', '').trim();
      return parseInt(cleaned) === correctAnswer;
    }
  },

  'solve-equations': {
    id: 'solve-equations',
    name: 'Solve Equations',
    description: 'Solve one-step equations',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 35,
    xpReward: 15,
    gradeLevel: '6th Grade',
    category: 'algebra',
    
    generate: (): MathProblem => {
      const operations = ['+', '-', '×', '÷'];
      const op = operations[randInt(0, 3)];
      const answer = randInt(2, 15);
      
      let problem: string;
      let num: number;
      
      switch (op) {
        case '+':
          num = randInt(1, 20);
          problem = `x + ${num} = ${answer + num}\n\nSolve for x`;
          break;
        case '-':
          num = randInt(1, 10);
          problem = `x - ${num} = ${answer - num}\n\nSolve for x`;
          break;
        case '×':
          num = randInt(2, 10);
          problem = `${num}x = ${answer * num}\n\nSolve for x`;
          break;
        case '÷':
          num = randInt(2, 6);
          problem = `x ÷ ${num} = ${answer}\n\nSolve for x (answer: ${answer * num})`;
          return {
            problem: `x ÷ ${num} = ${answer}\n\nSolve for x`,
            answer: answer * num,
            hint: `To undo division, multiply both sides by ${num}`
          };
        default:
          problem = `x + ${num!} = ${answer + num!}`;
      }
      
      return {
        problem,
        answer,
        hint: `Use inverse operations to isolate x`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'coordinate-plane': {
    id: 'coordinate-plane',
    name: 'Coordinate Plane',
    description: 'Identify coordinates on a grid',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 25,
    xpReward: 10,
    gradeLevel: '6th Grade',
    category: 'geometry',
    
    generate: (): MathProblem => {
      const x = randInt(-5, 5);
      const y = randInt(-5, 5);
      
      // Create a simple coordinate grid
      const diagram = `
        <svg width="240" height="240" viewBox="-60 -60 120 120">
          <!-- Grid lines -->
          ${Array.from({length: 11}, (_, i) => i - 5).map(n => `
            <line x1="${n * 10}" y1="-50" x2="${n * 10}" y2="50" stroke="#ddd" stroke-width="0.5"/>
            <line x1="-50" y1="${n * 10}" x2="50" y2="${n * 10}" stroke="#ddd" stroke-width="0.5"/>
          `).join('')}
          <!-- Axes -->
          <line x1="-50" y1="0" x2="50" y2="0" stroke="#333" stroke-width="1"/>
          <line x1="0" y1="-50" x2="0" y2="50" stroke="#333" stroke-width="1"/>
          <!-- Point -->
          <circle cx="${x * 10}" cy="${-y * 10}" r="5" fill="#e74c3c"/>
          <!-- Labels -->
          <text x="52" y="4" font-size="10" fill="#333">x</text>
          <text x="2" y="-52" font-size="10" fill="#333">y</text>
        </svg>
      `;
      
      return {
        problem: `What are the coordinates of the red point?\n\nWrite as: (x, y)`,
        answer: `(${x}, ${y})`,
        hint: `Read the x-value first (left/right), then the y-value (up/down)`,
        diagram
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      const cleaned = userAnswer.replace(/\s+/g, '');
      return cleaned === String(correctAnswer).replace(/\s+/g, '');
    }
  },

  'order-of-operations': {
    id: 'order-of-operations',
    name: 'Order of Operations',
    description: 'Follow PEMDAS rules',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 30,
    xpReward: 12,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(2, 8);
      const b = randInt(2, 6);
      const c = randInt(1, 5);
      
      // a + b × c
      const answer = a + b * c;
      
      return {
        problem: `${a} + ${b} × ${c} = ?`,
        answer,
        hint: `Remember PEMDAS: Multiply first, then add!`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'absolute-value': {
    id: 'absolute-value',
    name: 'Absolute Value',
    description: 'Find absolute values',
    difficulty: 2,
    stars: '⭐⭐',
    reward: 20,
    xpReward: 8,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const num = randInt(-20, 20);
      
      return {
        problem: `|${num}| = ?`,
        answer: Math.abs(num),
        hint: `Absolute value is always positive - it's the distance from zero`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'exponents': {
    id: 'exponents',
    name: 'Exponents',
    description: 'Calculate powers',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 35,
    xpReward: 15,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const base = randInt(2, 10);
      const exp = randInt(2, 3);
      
      return {
        problem: `${base}${exp === 2 ? '²' : '³'} = ?`,
        answer: Math.pow(base, exp),
        hint: `${base}${exp === 2 ? '²' : '³'} means ${base} × ${base}${exp === 3 ? ` × ${base}` : ''}`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'gcf-lcm': {
    id: 'gcf-lcm',
    name: 'GCF & LCM',
    description: 'Find greatest common factor',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 35,
    xpReward: 15,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const commonFactor = randInt(2, 6);
      const a = commonFactor * randInt(2, 6);
      const b = commonFactor * randInt(2, 6);
      const gcfValue = gcd(a, b);
      
      return {
        problem: `Find the GCF (Greatest Common Factor) of:\n\n${a} and ${b}`,
        answer: gcfValue,
        hint: `List the factors of each number and find the largest one they share`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'integers-operations': {
    id: 'integers-operations',
    name: 'Integer Operations',
    description: 'Add and subtract negative numbers',
    difficulty: 3,
    stars: '⭐⭐⭐',
    reward: 30,
    xpReward: 12,
    gradeLevel: '6th Grade',
    category: 'arithmetic',
    
    generate: (): MathProblem => {
      const a = randInt(-15, 15);
      const b = randInt(-15, 15);
      const isAdd = Math.random() > 0.5;
      
      if (isAdd) {
        return {
          problem: `(${a}) + (${b}) = ?`,
          answer: a + b,
          hint: `When adding integers, think about moving on a number line`
        };
      } else {
        return {
          problem: `(${a}) - (${b}) = ?`,
          answer: a - b,
          hint: `Subtracting a negative is the same as adding!`
        };
      }
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  // ========== HIGH SCHOOL LEVEL ⭐⭐⭐⭐⭐ ==========
  'algebra-linear': {
    id: 'algebra-linear',
    name: 'Linear Equations',
    description: 'Solve multi-step equations',
    difficulty: 5,
    stars: '⭐⭐⭐⭐⭐',
    reward: 100,
    xpReward: 40,
    gradeLevel: 'High School',
    category: 'algebra',
    
    generate: (): MathProblem => {
      const x = randInt(-10, 10);
      const a = randInt(2, 9);
      const b = randInt(-10, 10);
      const c = a * x + b;
      
      const bSign = b >= 0 ? '+' : '';
      
      return {
        problem: `Solve for x:\n\n${a}x ${bSign} ${b} = ${c}`,
        answer: x,
        hint: `First ${b >= 0 ? 'subtract' : 'add'} ${Math.abs(b)}, then divide by ${a}`
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },

  'geometry-area': {
    id: 'geometry-area',
    name: 'Circle Area',
    description: 'Calculate area of circles',
    difficulty: 5,
    stars: '⭐⭐⭐⭐⭐',
    reward: 100,
    xpReward: 40,
    gradeLevel: 'High School',
    category: 'geometry',
    
    generate: (): MathProblem => {
      const radius = randInt(2, 10);
      const area = Math.round(3.14 * radius * radius);
      
      const diagram = `
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="${radius * 8}" fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
          <line x1="100" y1="100" x2="${100 + radius * 8}" y2="100" stroke="#e74c3c" stroke-width="2"/>
          <circle cx="100" cy="100" r="3" fill="#2c3e50"/>
          <text x="${100 + radius * 4}" y="95" font-size="14" fill="#e74c3c" font-weight="bold">r=${radius}</text>
        </svg>
      `;
      
      return {
        problem: `Find the area of the circle.\n\nRadius = ${radius}\n(Use π ≈ 3.14, round to whole number)`,
        answer: area,
        hint: `Area = πr²`,
        diagram
      };
    },
    
    check: (userAnswer: string, correctAnswer: number | string): boolean => {
      return parseInt(userAnswer) === correctAnswer;
    }
  },
};

// Get a specific math type by ID
export function getMathType(id: string): MathTypeConfig | undefined {
  return MATH_TYPES[id];
}

// Get all math types as array
export function getAllMathTypes(): MathTypeConfig[] {
  return Object.values(MATH_TYPES);
}

// Get math types by grade level
export function getMathTypesByGrade(gradeLevel: string): MathTypeConfig[] {
  return Object.values(MATH_TYPES).filter(mt => mt.gradeLevel === gradeLevel);
}

// Get math types by category
export function getMathTypesByCategory(category: string): MathTypeConfig[] {
  return Object.values(MATH_TYPES).filter(mt => mt.category === category);
}

// Generate a problem from a specific math type
export function generateProblem(mathTypeId: string): MathProblem & { mathType: MathTypeConfig } | null {
  const mathType = getMathType(mathTypeId);
  if (!mathType) return null;
  
  const problem = mathType.generate();
  return {
    ...problem,
    mathType
  };
}

// Check an answer
export function checkAnswer(userAnswer: string, correctAnswer: number | string, mathTypeId: string): boolean {
  const mathType = getMathType(mathTypeId);
  if (!mathType) return false;
  
  // Convert string numbers to actual numbers for comparison
  // This handles the case where correctAnswer comes from base64 decoding as a string
  let normalizedAnswer: number | string = correctAnswer;
  if (typeof correctAnswer === 'string' && !isNaN(Number(correctAnswer))) {
    normalizedAnswer = Number(correctAnswer);
  }
  
  return mathType.check(userAnswer, normalizedAnswer);
}

console.log('🧮 Math Types loaded! 20+ types ready for quizzes! 💪');
