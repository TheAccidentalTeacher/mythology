// MATH TYPES SYSTEM - 11 TYPES OF MATHEMATICAL ASS-KICKING! 🧮💥
// From "3 × 4" to "PROVE THIS GEOMETRIC THEOREM" - WE GOT IT ALL!

// Global function for toggling scaffolding visibility
window.toggleScaffolding = function(contentId, buttonId) {
    const content = document.getElementById(contentId);
    const btn = document.getElementById(buttonId);
    if (content && btn) {
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            btn.textContent = '🔼 Hide Visual Help';
        } else {
            content.style.display = 'none';
            btn.textContent = '🔽 Show Visual Help';
        }
    }
};

const MATH_TYPES = {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 12) + 1;
            const b = Math.floor(Math.random() * 12) + 1;
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Think: ${a} times ${b}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            return {
                problem: `${a} + ${b} = ?`,
                answer: a + b,
                hint: `Add them together!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 10) + 5; // 5-14
            const b = Math.floor(Math.random() * a); // Ensure no negatives
            return {
                problem: `${a} - ${b} = ?`,
                answer: a - b,
                hint: `What's the difference?`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 90) + 10;
            return {
                problem: `${a} + ${b} = ?`,
                answer: a + b,
                hint: `Try breaking it into tens and ones!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const divisor = Math.floor(Math.random() * 10) + 2; // 2-11
            const quotient = Math.floor(Math.random() * 10) + 2;
            const dividend = divisor * quotient; // Ensures even division
            return {
                problem: `${dividend} ÷ ${divisor} = ?`,
                answer: quotient,
                hint: `Think multiplication: ${divisor} × ? = ${dividend}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 9) + 1;   // 1-9
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Break ${a} into tens and ones!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
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
        
        generate: function() {
            const a = Math.floor(Math.random() * 90) + 10; // 10-99
            const b = Math.floor(Math.random() * 90) + 10;
            return {
                problem: `${a} × ${b} = ?`,
                answer: a * b,
                hint: `Use the distributive property!`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'fractions-basic': {
        id: 'fractions-basic',
        name: 'Basic Fractions',
        description: 'Simplify fractions and find equivalents',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 40,
        xpReward: 18,
        gradeLevel: 'Middle School',
        category: 'fractions',
        
        generate: function() {
            const types = ['simplify', 'add', 'equivalent'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'simplify') {
                const numerator = Math.floor(Math.random() * 20) + 4;
                const gcd = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
                const denom = numerator * gcd;
                return {
                    problem: `Simplify: ${numerator * gcd}/${denom * gcd}`,
                    answer: `${numerator}/${denom}`,
                    hint: `Find the GCD!`
                };
            } else if (type === 'add') {
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 5) + 1;
                const denom = Math.floor(Math.random() * 8) + 2;
                return {
                    problem: `${a}/${denom} + ${b}/${denom} = ?`,
                    answer: `${a + b}/${denom}`,
                    hint: `Same denominator? Just add the tops!`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return userAnswer.replace(/\s/g, '') === correctAnswer.replace(/\s/g, '');
        }
    },
    
    // ========== HIGH SCHOOL LEVEL ⭐⭐⭐⭐⭐ ==========
    'algebra-linear': {
        id: 'algebra-linear',
        name: 'Algebra: Linear Equations',
        description: 'Solve for x: ax + b = c',
        difficulty: 5,
        stars: '⭐⭐⭐⭐⭐',
        reward: 100,
        xpReward: 40,
        gradeLevel: 'High School',
        category: 'algebra',
        
        generate: function() {
            const x = Math.floor(Math.random() * 20) - 10; // -10 to 9
            const a = Math.floor(Math.random() * 9) + 1;   // 1-9
            const b = Math.floor(Math.random() * 20) - 10;
            const c = a * x + b;
            
            return {
                problem: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
                answer: x,
                hint: `Isolate x! Subtract ${b}, then divide by ${a}`
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'geometry-area': {
        id: 'geometry-area',
        name: 'Geometry: Area & Perimeter',
        description: 'Calculate area or perimeter of shapes',
        difficulty: 5,
        stars: '⭐⭐⭐⭐⭐',
        reward: 100,
        xpReward: 40,
        gradeLevel: 'High School',
        category: 'geometry',
        
        generate: function() {
            const shapes = ['rectangle', 'triangle', 'circle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            if (shape === 'rectangle') {
                const length = Math.floor(Math.random() * 15) + 5;
                const width = Math.floor(Math.random() * 10) + 3;
                const calcType = Math.random() > 0.5 ? 'area' : 'perimeter';
                
                const diagram = `
                    <svg width="250" height="150" viewBox="0 0 250 150">
                        <rect x="50" y="30" width="${length * 8}" height="${width * 8}" 
                              fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
                        <text x="50" y="20" font-size="14" fill="#2c3e50">${length}</text>
                        <text x="20" y="${30 + (width * 4)}" font-size="14" fill="#2c3e50">${width}</text>
                        <line x1="50" y1="25" x2="${50 + length * 8}" y2="25" 
                              stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <line x1="45" y1="30" x2="45" y2="${30 + width * 8}" 
                              stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowhead)"/>
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                    refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c"/>
                            </marker>
                        </defs>
                    </svg>
                `;
                
                if (calcType === 'area') {
                    return {
                        problem: `Rectangle: Length=${length}, Width=${width}. Area = ?`,
                        answer: length * width,
                        hint: `Area = length × width`,
                        diagram: diagram
                    };
                } else {
                    return {
                        problem: `Rectangle: Length=${length}, Width=${width}. Perimeter = ?`,
                        answer: 2 * (length + width),
                        hint: `Perimeter = 2(length + width)`,
                        diagram: diagram
                    };
                }
            } else if (shape === 'triangle') {
                const base = Math.floor(Math.random() * 15) + 5;
                const height = Math.floor(Math.random() * 10) + 3;
                
                const diagram = `
                    <svg width="250" height="150" viewBox="0 0 250 150">
                        <polygon points="125,30 ${50 + base * 6},120 ${125 - (base * 6 - 75)},120" 
                                 fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
                        <line x1="125" y1="30" x2="125" y2="120" 
                              stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,5"/>
                        <text x="130" y="75" font-size="14" fill="#e74c3c">h=${height}</text>
                        <text x="${100 + base * 3}" y="135" font-size="14" fill="#2c3e50">b=${base}</text>
                    </svg>
                `;
                
                return {
                    problem: `Triangle: Base=${base}, Height=${height}. Area = ?`,
                    answer: (base * height) / 2,
                    hint: `Area = (base × height) / 2`,
                    diagram: diagram
                };
            } else { // circle
                const radius = Math.floor(Math.random() * 8) + 2;
                
                const diagram = `
                    <svg width="250" height="150" viewBox="0 0 250 150">
                        <circle cx="125" cy="75" r="${radius * 8}" 
                                fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
                        <line x1="125" y1="75" x2="${125 + radius * 8}" y2="75" 
                              stroke="#e74c3c" stroke-width="2"/>
                        <circle cx="125" cy="75" r="3" fill="#2c3e50"/>
                        <text x="${125 + radius * 4}" y="70" font-size="14" fill="#e74c3c">r=${radius}</text>
                    </svg>
                `;
                
                return {
                    problem: `Circle: Radius=${radius}. Area = ? (use π ≈ 3.14, round to whole number)`,
                    answer: Math.round(3.14 * radius * radius),
                    hint: `Area = πr²`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // ========== ADVANCED LEVEL ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ ==========
    'geometry-proofs': {
        id: 'geometry-proofs',
        name: 'Geometry: Two-Column Proofs',
        description: 'Complete geometric proofs (simplified)',
        difficulty: 10,
        stars: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',
        reward: 500,
        xpReward: 100,
        gradeLevel: 'Advanced High School',
        category: 'geometry',
        
        generate: function() {
            // Simplified: Just ask for the reason for a statement
            const proofs = [
                {
                    statement: 'If AB = CD and CD = EF, then AB = EF',
                    reason: 'Transitive Property',
                    options: ['Transitive', 'Reflexive', 'Symmetric', 'Definition'],
                    diagram: `
                        <svg width="300" height="80" viewBox="0 0 300 80">
                            <line x1="20" y1="40" x2="80" y2="40" stroke="#2c3e50" stroke-width="3"/>
                            <text x="50" y="30" text-anchor="middle" font-size="14" fill="#2c3e50">AB</text>
                            
                            <line x1="120" y1="40" x2="180" y2="40" stroke="#e74c3c" stroke-width="3"/>
                            <text x="150" y="30" text-anchor="middle" font-size="14" fill="#e74c3c">CD</text>
                            
                            <line x1="220" y1="40" x2="280" y2="40" stroke="#e74c3c" stroke-width="3"/>
                            <text x="250" y="30" text-anchor="middle" font-size="14" fill="#e74c3c">EF</text>
                            
                            <text x="100" y="60" text-anchor="middle" font-size="12" fill="#7f8c8d">AB = CD</text>
                            <text x="200" y="60" text-anchor="middle" font-size="12" fill="#7f8c8d">CD = EF</text>
                        </svg>
                    `
                },
                {
                    statement: 'If angle A and angle B are vertical angles, they are congruent',
                    reason: 'Vertical',
                    options: ['Vertical', 'Complementary', 'Supplementary', 'Adjacent'],
                    diagram: `
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            <line x1="30" y1="170" x2="170" y2="30" stroke="#3498db" stroke-width="3"/>
                            <line x1="30" y1="30" x2="170" y2="170" stroke="#e74c3c" stroke-width="3"/>
                            <circle cx="100" cy="100" r="3" fill="#2c3e50"/>
                            
                            <text x="60" y="60" font-size="18" fill="#3498db" font-weight="bold">∠A</text>
                            <text x="130" y="150" font-size="18" fill="#e74c3c" font-weight="bold">∠B</text>
                            
                            <path d="M 80 80 Q 85 85 90 80" stroke="#3498db" fill="none" stroke-width="2"/>
                            <path d="M 110 120 Q 115 115 120 120" stroke="#e74c3c" fill="none" stroke-width="2"/>
                        </svg>
                    `
                },
                {
                    statement: 'If two lines are parallel and cut by a transversal, alternate interior angles are congruent',
                    reason: 'Alternate',
                    options: ['Alternate', 'Corresponding', 'Vertical', 'Linear'],
                    diagram: `
                        <svg width="250" height="200" viewBox="0 0 250 200">
                            <!-- Parallel lines -->
                            <line x1="20" y1="60" x2="230" y2="60" stroke="#2c3e50" stroke-width="2"/>
                            <line x1="20" y1="140" x2="230" y2="140" stroke="#2c3e50" stroke-width="2"/>
                            
                            <!-- Parallel markers -->
                            <line x1="190" y1="55" x2="195" y2="50" stroke="#7f8c8d" stroke-width="1"/>
                            <line x1="195" y1="55" x2="200" y2="50" stroke="#7f8c8d" stroke-width="1"/>
                            <line x1="190" y1="135" x2="195" y2="130" stroke="#7f8c8d" stroke-width="1"/>
                            <line x1="195" y1="135" x2="200" y2="130" stroke="#7f8c8d" stroke-width="1"/>
                            
                            <!-- Transversal -->
                            <line x1="60" y1="20" x2="150" y2="180" stroke="#e74c3c" stroke-width="3"/>
                            
                            <!-- Angle markers -->
                            <path d="M 95 60 L 105 60 L 100 70 Z" fill="#3498db" opacity="0.5"/>
                            <path d="M 115 140 L 125 140 L 120 130 Z" fill="#3498db" opacity="0.5"/>
                            
                            <text x="110" y="55" font-size="14" fill="#3498db" font-weight="bold">∠1</text>
                            <text x="130" y="145" font-size="14" fill="#3498db" font-weight="bold">∠2</text>
                            <text x="70" y="15" font-size="12" fill="#7f8c8d">transversal</text>
                        </svg>
                    `
                }
            ];
            
            const proof = proofs[Math.floor(Math.random() * proofs.length)];
            
            return {
                problem: `Statement: "${proof.statement}"\n\nWhat property justifies this? (Type: ${proof.options.join(', ')})`,
                answer: proof.reason,
                hint: `Think about angle relationships!`,
                diagram: proof.diagram
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return userAnswer.toLowerCase().includes(correctAnswer.toLowerCase());
        }
    },
    
    // ========== 6TH GRADE PRACTICE TYPES 🎯 ==========
    // Practice the skills taught in class - NOT lessons!
    
    'parallelogram-area': {
        id: 'parallelogram-area',
        name: 'Parallelogram Area',
        description: 'Practice finding area of parallelograms (A = b × h)',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 25,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        generate: function() {
            const base = Math.floor(Math.random() * 16) + 5; // 5-20
            const height = Math.floor(Math.random() * 13) + 3; // 3-15
            const area = base * height;
            
            const diagram = `
                <svg width="280" height="170" viewBox="0 0 280 170">
                    <!-- Parallelogram -->
                    <polygon points="50,120 ${50 + base * 8},120 ${70 + base * 8},40 70,40" 
                             fill="#ecf0f1" stroke="#3498db" stroke-width="3"/>
                    
                    <!-- Base line with arrow -->
                    <line x1="50" y1="130" x2="${50 + base * 8}" y2="130" 
                          stroke="#e74c3c" stroke-width="2"/>
                    <text x="${50 + base * 4}" y="150" text-anchor="middle" 
                          font-size="16" fill="#e74c3c" font-weight="bold">base = ${base}</text>
                    
                    <!-- Height line (dashed) - MOVED LEFT to avoid overlap -->
                    <line x1="70" y1="40" x2="70" y2="120" 
                          stroke="#27ae60" stroke-width="2" stroke-dasharray="5,5"/>
                    <text x="30" y="80" text-anchor="middle" 
                          font-size="16" fill="#27ae60" font-weight="bold">h = ${height}</text>
                    
                    <!-- Right angle marker -->
                    <rect x="65" y="115" width="10" height="10" fill="none" stroke="#27ae60" stroke-width="1"/>
                </svg>
            `;
            
            return {
                problem: `Find the area of the parallelogram.\n\nBase = ${base} cm\nHeight = ${height} cm\n\nArea = ?`,
                answer: area,
                hint: `Area of parallelogram = base × height`,
                diagram: diagram
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'triangle-area': {
        id: 'triangle-area',
        name: 'Triangle Area',
        description: 'Practice finding area of triangles (A = ½bh)',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 30,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        generate: function() {
            const base = Math.floor(Math.random() * 16) + 5; // 5-20
            const height = Math.floor(Math.random() * 13) + 3; // 3-15
            const area = (base * height) / 2;
            
            // Calculate triangle dimensions that actually match the base and height values
            const baseWidth = base * 12; // pixels per unit for base
            const triangleHeight = height * 12; // pixels per unit for height
            const topY = 280 - triangleHeight; // Top point Y coordinate
            
            const diagram = `
                <svg width="500" height="350" viewBox="0 0 500 350" style="max-width: 100%;">
                    <!-- Triangle -->
                    <polygon points="250,${topY} ${250 - baseWidth/2},280 ${250 + baseWidth/2},280" 
                             fill="#ecf0f1" stroke="#3498db" stroke-width="4"/>
                    
                    <!-- Base line -->
                    <line x1="${250 - baseWidth/2}" y1="300" x2="${250 + baseWidth/2}" y2="300" 
                          stroke="#e74c3c" stroke-width="3"/>
                    <text x="250" y="330" text-anchor="middle" 
                          font-size="22" fill="#e74c3c" font-weight="bold">base = ${base}</text>
                    
                    <!-- Height line (dashed) -->
                    <line x1="250" y1="${topY}" x2="250" y2="280" 
                          stroke="#27ae60" stroke-width="3" stroke-dasharray="8,8"/>
                    <text x="290" y="${topY + triangleHeight/2}" text-anchor="start" 
                          font-size="22" fill="#27ae60" font-weight="bold">h = ${height}</text>
                    
                    <!-- Right angle marker at base -->
                    <rect x="242" y="272" width="16" height="16" fill="none" stroke="#27ae60" stroke-width="2"/>
                </svg>
            `;
            
            return {
                problem: `Find the area of the triangle.\n\nBase = ${base} m\nHeight = ${height} m\n\nArea = ?`,
                answer: area,
                hint: `Area of triangle = ½ × base × height`,
                diagram: diagram
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseFloat(userAnswer) === correctAnswer;
        }
    },
    
    'decimals-operations': {
        id: 'decimals-operations',
        name: 'Decimal Operations',
        description: 'Practice adding, subtracting, and multiplying decimals',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 25,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'arithmetic',
        
        generate: function() {
            const operations = ['add', 'subtract', 'multiply'];
            const op = operations[Math.floor(Math.random() * operations.length)];
            
            if (op === 'add') {
                const a = (Math.floor(Math.random() * 9000) + 1000) / 100; // 10.00-99.99
                const b = (Math.floor(Math.random() * 9000) + 1000) / 100;
                const answer = Math.round((a + b) * 100) / 100;
                
                // Format numbers to ensure 2 decimal places
                const aStr = a.toFixed(2);
                const bStr = b.toFixed(2);
                
                const diagram = `
                    <svg width="200" height="120" viewBox="0 0 200 120">
                        <!-- Vertical addition format -->
                        <text x="150" y="30" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${aStr}</text>
                        <text x="40" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-weight="bold">+</text>
                        <text x="150" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${bStr}</text>
                        <line x1="30" y1="70" x2="160" y2="70" stroke="#2c3e50" stroke-width="2"/>
                        <text x="150" y="100" text-anchor="end" font-size="24" fill="#e74c3c" font-family="monospace">?</text>
                    </svg>
                `;
                
                return {
                    problem: `Add the decimals:`,
                    answer: answer,
                    hint: `Line up the decimal points and add`,
                    diagram: diagram
                };
            } else if (op === 'subtract') {
                const a = (Math.floor(Math.random() * 9000) + 1000) / 100;
                const b = (Math.floor(Math.random() * (a * 100 - 1000)) + 500) / 100;
                const answer = Math.round((a - b) * 100) / 100;
                
                const aStr = a.toFixed(2);
                const bStr = b.toFixed(2);
                
                const diagram = `
                    <svg width="200" height="120" viewBox="0 0 200 120">
                        <!-- Vertical subtraction format -->
                        <text x="150" y="30" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${aStr}</text>
                        <text x="40" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-weight="bold">−</text>
                        <text x="150" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${bStr}</text>
                        <line x1="30" y1="70" x2="160" y2="70" stroke="#2c3e50" stroke-width="2"/>
                        <text x="150" y="100" text-anchor="end" font-size="24" fill="#e74c3c" font-family="monospace">?</text>
                    </svg>
                `;
                
                return {
                    problem: `Subtract the decimals:`,
                    answer: answer,
                    hint: `Line up the decimal points and subtract`,
                    diagram: diagram
                };
            } else {
                const a = (Math.floor(Math.random() * 900) + 100) / 10; // 10.0-99.9
                const b = Math.floor(Math.random() * 9) + 2; // 2-10
                const answer = Math.round((a * b) * 100) / 100;
                
                const aStr = a.toFixed(1);
                
                const diagram = `
                    <svg width="200" height="120" viewBox="0 0 200 120">
                        <!-- Vertical multiplication format -->
                        <text x="150" y="30" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${aStr}</text>
                        <text x="40" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-weight="bold">×</text>
                        <text x="150" y="60" text-anchor="end" font-size="24" fill="#2c3e50" font-family="monospace">${b}</text>
                        <line x1="30" y1="70" x2="160" y2="70" stroke="#2c3e50" stroke-width="2"/>
                        <text x="150" y="100" text-anchor="end" font-size="24" fill="#e74c3c" font-family="monospace">?</text>
                    </svg>
                `;
                
                return {
                    problem: `Multiply:`,
                    answer: answer,
                    hint: `Multiply, then count decimal places`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.01;
        }
    },
    
    'ratio-concepts': {
        id: 'ratio-concepts',
        name: 'Ratio Concepts',
        description: 'Practice writing and simplifying ratios',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 25,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'ratios',
        
        generate: function() {
            // Generate a ratio that can be simplified
            const gcf = Math.floor(Math.random() * 5) + 2; // 2-6
            const a = gcf * (Math.floor(Math.random() * 8) + 2); // Multiple of gcf (4-48)
            const b = gcf * (Math.floor(Math.random() * 8) + 2);
            const simplifiedA = a / gcf;
            const simplifiedB = b / gcf;
            
            // Choose visualization type
            const vizTypes = ['bars', 'emojis', 'table', 'dots'];
            const vizType = vizTypes[Math.floor(Math.random() * vizTypes.length)];
            
            let diagram = '';
            
            if (vizType === 'bars') {
                // COLOR BARS - Good for seeing relative sizes
                const maxWidth = Math.max(a, b);
                const scale = Math.min(8, 200 / maxWidth); // Scale to fit, max 8px per unit
                
                diagram = `
                    <svg width="400" height="120" viewBox="0 0 400 120">
                        <!-- Blue bar for first number -->
                        <rect x="20" y="20" width="${a * scale}" height="35" fill="#3498db" stroke="#2c3e50" stroke-width="2"/>
                        <text x="${20 + a * scale / 2}" y="42" text-anchor="middle" font-size="18" fill="white" font-weight="bold">${a}</text>
                        
                        <text x="${30 + a * scale}" y="42" text-anchor="middle" font-size="24" fill="#2c3e50" font-weight="bold">:</text>
                        
                        <!-- Red bar for second number -->
                        <rect x="${40 + a * scale}" y="20" width="${b * scale}" height="35" fill="#e74c3c" stroke="#2c3e50" stroke-width="2"/>
                        <text x="${40 + a * scale + b * scale / 2}" y="42" text-anchor="middle" font-size="18" fill="white" font-weight="bold">${b}</text>
                        
                        <text x="200" y="85" text-anchor="middle" font-size="16" fill="#7f8c8d" font-weight="bold">Simplify this ratio</text>
                    </svg>
                `;
            } else if (vizType === 'emojis') {
                // EMOJI REPRESENTATION - Fun and visual!
                // Use different emojis for different place values
                const emoji1 = ['🔵', '⚽', '🏀', '🎾'][Math.floor(Math.random() * 4)];
                const emoji2 = ['🔴', '🍎', '🌹', '❤️'][Math.floor(Math.random() * 4)];
                
                // For larger numbers, group by 10s and 1s
                const aTens = Math.floor(a / 10);
                const aOnes = a % 10;
                const bTens = Math.floor(b / 10);
                const bOnes = b % 10;
                
                let emojiStr1 = '';
                let emojiStr2 = '';
                
                // Build emoji strings with grouping
                if (aTens > 0) {
                    emojiStr1 += `<tspan font-size="28" fill="#9b59b6">🔟</tspan> × ${aTens}  `;
                }
                if (aOnes > 0 || aTens === 0) {
                    emojiStr1 += emoji1.repeat(Math.min(aOnes, 10)); // Cap display at 10
                    if (aOnes > 10) emojiStr1 += ` (${aOnes} total)`;
                }
                
                if (bTens > 0) {
                    emojiStr2 += `<tspan font-size="28" fill="#9b59b6">🔟</tspan> × ${bTens}  `;
                }
                if (bOnes > 0 || bTens === 0) {
                    emojiStr2 += emoji2.repeat(Math.min(bOnes, 10));
                    if (bOnes > 10) emojiStr2 += ` (${bOnes} total)`;
                }
                
                diagram = `
                    <svg width="450" height="140" viewBox="0 0 450 140">
                        <text x="10" y="30" font-size="32" fill="#2c3e50">${emojiStr1}</text>
                        <text x="420" y="30" font-size="20" fill="#2c3e50" font-weight="bold">${a}</text>
                        
                        <text x="225" y="60" text-anchor="middle" font-size="28" fill="#2c3e50" font-weight="bold">:</text>
                        
                        <text x="10" y="100" font-size="32" fill="#2c3e50">${emojiStr2}</text>
                        <text x="420" y="100" font-size="20" fill="#2c3e50" font-weight="bold">${b}</text>
                        
                        <text x="225" y="130" text-anchor="middle" font-size="14" fill="#7f8c8d" font-weight="bold">Simplify this ratio</text>
                    </svg>
                `;
            } else if (vizType === 'table') {
                // INPUT-OUTPUT TABLE - Shows equivalent ratios
                const mult1 = gcf;
                const mult2 = gcf * 2;
                
                diagram = `
                    <svg width="380" height="220" viewBox="0 0 380 220">
                        <!-- Table header -->
                        <rect x="50" y="20" width="280" height="45" fill="#34495e" stroke="#2c3e50" stroke-width="2"/>
                        <text x="140" y="48" text-anchor="middle" font-size="20" fill="white" font-weight="bold">First</text>
                        <line x1="215" y1="20" x2="215" y2="195" stroke="#2c3e50" stroke-width="2"/>
                        <text x="265" y="48" text-anchor="middle" font-size="20" fill="white" font-weight="bold">Second</text>
                        
                        <!-- Row 1 - Simplified ratio (THE ANSWER!) -->
                        <rect x="50" y="65" width="280" height="45" fill="#ecf0f1" stroke="#2c3e50" stroke-width="2"/>
                        <text x="140" y="93" text-anchor="middle" font-size="24" fill="#3498db" font-weight="bold">${simplifiedA}</text>
                        <text x="265" y="93" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold">${simplifiedB}</text>
                        
                        <!-- Row 2 - Multiplied by gcf -->
                        <rect x="50" y="110" width="280" height="45" fill="#ecf0f1" stroke="#2c3e50" stroke-width="2"/>
                        <text x="140" y="138" text-anchor="middle" font-size="24" fill="#3498db" font-weight="bold">${simplifiedA * mult1}</text>
                        <text x="265" y="138" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold">${simplifiedB * mult1}</text>
                        
                        <!-- Row 3 - The actual problem (HIGHLIGHTED) -->
                        <rect x="50" y="155" width="280" height="45" fill="#f39c12" stroke="#2c3e50" stroke-width="3"/>
                        <text x="140" y="183" text-anchor="middle" font-size="24" fill="white" font-weight="bold">${a}</text>
                        <text x="265" y="183" text-anchor="middle" font-size="24" fill="white" font-weight="bold">${b}</text>
                        
                        <!-- Instruction text with MORE space -->
                        <text x="190" y="215" text-anchor="middle" font-size="13" fill="#7f8c8d" font-weight="bold">↑ Find the simplest form (row 1)</text>
                    </svg>
                `;
            } else {
                // DOT GROUPS - Shows grouping by GCF
                const dotsPerGroup = gcf;
                const groups1 = simplifiedA;
                const groups2 = simplifiedB;
                
                // Limit display to reasonable size
                const maxGroupsToShow = 6;
                const showGroups1 = Math.min(groups1, maxGroupsToShow);
                const showGroups2 = Math.min(groups2, maxGroupsToShow);
                
                let dots1 = '';
                for (let g = 0; g < showGroups1; g++) {
                    const xPos = 20 + g * 55;
                    // Draw a box around each group
                    dots1 += `<rect x="${xPos}" y="35" width="50" height="50" fill="none" stroke="#3498db" stroke-width="2" stroke-dasharray="4,4"/>`;
                    // Draw dots in group
                    for (let d = 0; d < Math.min(dotsPerGroup, 9); d++) {
                        const dx = xPos + 12 + (d % 3) * 13;
                        const dy = 47 + Math.floor(d / 3) * 13;
                        dots1 += `<circle cx="${dx}" cy="${dy}" r="5" fill="#3498db"/>`;
                    }
                    if (dotsPerGroup > 9) {
                        dots1 += `<text x="${xPos + 25}" y="80" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">${dotsPerGroup}</text>`;
                    }
                }
                if (groups1 > maxGroupsToShow) {
                    dots1 += `<text x="${20 + showGroups1 * 55 + 10}" y="62" font-size="14" fill="#3498db" font-weight="bold">...${groups1} groups</text>`;
                }
                
                let dots2 = '';
                for (let g = 0; g < showGroups2; g++) {
                    const xPos = 20 + g * 55;
                    dots2 += `<rect x="${xPos}" y="125" width="50" height="50" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="4,4"/>`;
                    for (let d = 0; d < Math.min(dotsPerGroup, 9); d++) {
                        const dx = xPos + 12 + (d % 3) * 13;
                        const dy = 137 + Math.floor(d / 3) * 13;
                        dots2 += `<circle cx="${dx}" cy="${dy}" r="5" fill="#e74c3c"/>`;
                    }
                    if (dotsPerGroup > 9) {
                        dots2 += `<text x="${xPos + 25}" y="170" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">${dotsPerGroup}</text>`;
                    }
                }
                if (groups2 > maxGroupsToShow) {
                    dots2 += `<text x="${20 + showGroups2 * 55 + 10}" y="152" font-size="14" fill="#e74c3c" font-weight="bold">...${groups2} groups</text>`;
                }
                
                diagram = `
                    <svg width="500" height="220" viewBox="0 0 500 220">
                        <!-- Top label -->
                        <text x="10" y="20" font-size="16" fill="#3498db" font-weight="bold">Blue:</text>
                        <text x="420" y="20" font-size="16" fill="#3498db" font-weight="bold">${a} total</text>
                        
                        ${dots1}
                        
                        <!-- Middle label -->
                        <text x="10" y="110" font-size="16" fill="#e74c3c" font-weight="bold">Red:</text>
                        <text x="420" y="110" font-size="16" fill="#e74c3c" font-weight="bold">${b} total</text>
                        
                        ${dots2}
                        
                        <!-- Bottom explanation with better spacing -->
                        <text x="250" y="200" text-anchor="middle" font-size="14" fill="#7f8c8d" font-weight="bold">Each group has ${dotsPerGroup}.</text>
                        <text x="250" y="215" text-anchor="middle" font-size="14" fill="#7f8c8d" font-weight="bold">How many groups? ${groups1} : ${groups2}</text>
                    </svg>
                `;
            }
            
            return {
                problem: `Simplify the ratio:\n\n${a} : ${b}\n\nWrite your answer as: a:b (example: 3:5)`,
                answer: `${simplifiedA}:${simplifiedB}`,
                hint: `Find the GCF (${gcf}) and divide both numbers by it`,
                diagram: diagram
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            // Accept various formats: "3:5", "3 : 5", "3 to 5"
            const cleaned = userAnswer.replace(/\s+/g, '').replace(/to/g, ':');
            
            // Parse both ratios
            const userParts = cleaned.split(':').map(x => parseInt(x));
            const correctParts = correctAnswer.split(':').map(x => parseInt(x));
            
            if (userParts.length !== 2 || correctParts.length !== 2) {
                return false;
            }
            
            const [userA, userB] = userParts;
            const [correctA, correctB] = correctParts;
            
            // Check if ratios are equivalent (cross multiply)
            // userA/userB = correctA/correctB if userA * correctB = userB * correctA
            return userA * correctB === userB * correctA;
        }
    },
    
    'percent-basics': {
        id: 'percent-basics',
        name: 'Percent Basics',
        description: 'Practice converting between percents, decimals, and fractions',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 35,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'percents',
        
        generate: function() {
            const types = ['decimal-to-percent', 'percent-to-decimal', 'fraction-to-percent'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'decimal-to-percent') {
                const decimal = (Math.floor(Math.random() * 95) + 5) / 100; // 0.05-0.99
                const percent = decimal * 100;
                
                // VISUAL TYPE: 10x10 grid OR circular progress bar
                const vizType = Math.random() < 0.5 ? 'grid' : 'circle';
                let diagram = '';
                
                if (vizType === 'grid') {
                    // 10x10 grid of 100 squares - shade the correct percentage
                    const squaresToShade = Math.round(percent);
                    let svgSquares = '';
                    const squareSize = 28;
                    const gap = 2;
                    
                    for (let row = 0; row < 10; row++) {
                        for (let col = 0; col < 10; col++) {
                            const index = row * 10 + col;
                            const x = col * (squareSize + gap) + 20;
                            const y = row * (squareSize + gap) + 50;
                            const isFilled = index < squaresToShade;
                            const fillColor = isFilled ? '#3498db' : '#ecf0f1';
                            const strokeColor = isFilled ? '#2980b9' : '#bdc3c7';
                            
                            svgSquares += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" 
                                fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" rx="3"/>`;
                        }
                    }
                    
                    diagram = `
                        <svg width="340" height="380" viewBox="0 0 340 380">
                            <text x="170" y="30" text-anchor="middle" font-size="20" fill="#2c3e50" font-weight="bold">
                                What percent is shaded?
                            </text>
                            ${svgSquares}
                            <text x="170" y="365" text-anchor="middle" font-size="16" fill="#7f8c8d" font-weight="bold">
                                Each square = 1%
                            </text>
                        </svg>
                    `;
                } else {
                    // CIRCULAR PROGRESS BAR like TikTok loading screens!
                    const radius = 80;
                    const circumference = 2 * Math.PI * radius;
                    const fillAmount = (percent / 100) * circumference;
                    const emptyAmount = circumference - fillAmount;
                    const dashArray = `${fillAmount} ${emptyAmount}`;
                    
                    // Gradient colors based on percentage
                    let color1 = '#e74c3c', color2 = '#c0392b'; // Red for low
                    if (percent >= 33 && percent < 66) {
                        color1 = '#f39c12'; color2 = '#e67e22'; // Orange for medium
                    } else if (percent >= 66) {
                        color1 = '#2ecc71'; color2 = '#27ae60'; // Green for high
                    }
                    
                    diagram = `
                        <svg width="340" height="340" viewBox="0 0 340 340">
                            <defs>
                                <linearGradient id="progressGrad${percent}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            
                            <text x="170" y="40" text-anchor="middle" font-size="20" fill="#2c3e50" font-weight="bold">
                                Convert this to a percent:
                            </text>
                            
                            <!-- Background circle -->
                            <circle cx="170" cy="190" r="${radius}" fill="none" stroke="#ecf0f1" stroke-width="20"/>
                            
                            <!-- Progress circle - starts at top (12 o'clock) and goes clockwise -->
                            <circle cx="170" cy="190" r="${radius}" fill="none" 
                                stroke="url(#progressGrad${percent})" stroke-width="20"
                                stroke-dasharray="${dashArray}"
                                stroke-linecap="round"
                                transform="rotate(-90 170 190)"
                                style="transition: stroke-dasharray 0.3s ease;"/>
                            
                            <!-- Center text -->
                            <text x="170" y="200" text-anchor="middle" font-size="48" fill="#2c3e50" font-weight="bold">
                                ${decimal}
                            </text>
                            
                            <text x="170" y="320" text-anchor="middle" font-size="16" fill="#7f8c8d" font-weight="bold">
                                How much of the circle is filled?
                            </text>
                        </svg>
                    `;
                }
                
                return {
                    diagram: diagram,
                    problem: `Convert ${decimal} to a percent`,
                    answer: percent,
                    hint: `Multiply by 100 and add the % sign`
                };
                
            } else if (type === 'percent-to-decimal') {
                const percent = Math.floor(Math.random() * 95) + 5; // 5-99
                const decimal = percent / 100;
                
                // PIZZA/PIE CHART visualization!
                const slices = 10; // 10 slices for 10% each
                const slicesToFill = Math.floor(percent / 10);
                const extraPercent = percent % 10;
                
                let pieSlices = '';
                const centerX = 170, centerY = 170, radius = 100;
                
                // Generate pie slices
                for (let i = 0; i < slices; i++) {
                    const startAngle = (i * 36) - 90; // Start at top
                    const endAngle = ((i + 1) * 36) - 90;
                    
                    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
                    
                    const isFilled = i < slicesToFill || (i === slicesToFill && extraPercent >= 5);
                    const fillColor = isFilled ? '#3498db' : '#ecf0f1';
                    const strokeColor = '#34495e';
                    
                    pieSlices += `
                        <path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z"
                            fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>
                    `;
                }
                
                let diagram = `
                    <svg width="340" height="340" viewBox="0 0 340 340">
                        <text x="170" y="30" text-anchor="middle" font-size="20" fill="#2c3e50" font-weight="bold">
                            Convert ${percent}% to a decimal
                        </text>
                        
                        ${pieSlices}
                        
                        <text x="170" y="180" text-anchor="middle" font-size="52" fill="white" font-weight="bold"
                            stroke="#2c3e50" stroke-width="2" paint-order="stroke">
                            ${percent}%
                        </text>
                        
                        <text x="170" y="310" text-anchor="middle" font-size="16" fill="#7f8c8d" font-weight="bold">
                            Divide by 100 to get a decimal
                        </text>
                    </svg>
                `;
                
                return {
                    diagram: diagram,
                    problem: `Convert ${percent}% to a decimal`,
                    answer: decimal,
                    hint: `Divide by 100`
                };
                
            } else {
                // FRACTION TO PERCENT with BAR MODEL
                const fractions = [
                    {num: 1, den: 2, percent: 50},
                    {num: 1, den: 4, percent: 25},
                    {num: 3, den: 4, percent: 75},
                    {num: 1, den: 5, percent: 20},
                    {num: 2, den: 5, percent: 40},
                    {num: 3, den: 5, percent: 60},
                    {num: 4, den: 5, percent: 80},
                    {num: 1, den: 10, percent: 10},
                    {num: 3, den: 10, percent: 30},
                    {num: 7, den: 10, percent: 70}
                ];
                const frac = fractions[Math.floor(Math.random() * fractions.length)];
                
                // BAR MODEL - divide into denominator parts, shade numerator parts
                const barWidth = 300;
                const barHeight = 60;
                const startX = 20;
                const startY = 120;
                const segmentWidth = barWidth / frac.den;
                
                let segments = '';
                for (let i = 0; i < frac.den; i++) {
                    const x = startX + (i * segmentWidth);
                    const isFilled = i < frac.num;
                    const fillColor = isFilled ? '#e74c3c' : '#ecf0f1';
                    const strokeColor = '#2c3e50';
                    
                    segments += `<rect x="${x}" y="${startY}" width="${segmentWidth}" height="${barHeight}" 
                        fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>`;
                }
                
                // Calculate the decimal to show the process
                const decimal = (frac.num / frac.den).toFixed(2);
                
                let diagram = `
                    <svg width="380" height="320" viewBox="0 0 380 320">
                        <text x="190" y="30" text-anchor="middle" font-size="22" fill="#2c3e50" font-weight="bold">
                            Convert to a percent:
                        </text>
                        
                        <text x="190" y="70" text-anchor="middle" font-size="48" fill="#2c3e50" font-weight="bold">
                            ${frac.num}/${frac.den}
                        </text>
                        
                        ${segments}
                        
                        <text x="190" y="200" text-anchor="middle" font-size="16" fill="#e74c3c" font-weight="bold">
                            ${frac.num} out of ${frac.den} parts shaded
                        </text>
                    </svg>
                    
                    <div style="margin-top: 15px; color: #3498db; font-weight: bold; font-size: 15px;">
                        Step 1: Use long division to get a decimal
                    </div>
                    
                    <div style="margin: 10px 0; font-size: 1.3rem;">
                        <span class="katex-formula">${frac.den} \\overline{)${frac.num}.00} = \\underline{\\hspace{1.5cm}}</span>
                    </div>
                    
                    <div style="margin-top: 10px; color: #3498db; font-weight: bold; font-size: 15px;">
                        Step 2: Multiply by 100
                    </div>
                    
                    <div style="margin: 5px 0; font-size: 1.2rem;">
                        <span class="katex-formula">\\underline{\\hspace{1.5cm}} \\times 100 = \\text{?}\\%</span>
                    </div>
                    
                    <div style="margin-top: 10px; color: #7f8c8d; font-size: 13px;">
                        Hint: Move the decimal point 2 places right!<br>
                        (Answer should be a whole number)
                    </div>
                `;
                
                return {
                    diagram: diagram,
                    problem: `Convert ${frac.num}/${frac.den} to a percent`,
                    answer: frac.percent,
                    hint: `Divide the numerator by the denominator, then multiply by 100`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.01;
        }
    },
    
    'solve-equations': {
        id: 'solve-equations',
        name: 'Solve Equations',
        description: 'Practice solving one-step and two-step equations',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 50,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        generate: function() {
            const types = ['one-step-add', 'one-step-multiply', 'two-step'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'one-step-add') {
                const x = Math.floor(Math.random() * 20) + 1;
                const addend = Math.floor(Math.random() * 30) + 5;
                const sum = x + addend;
                const isAdd = Math.random() > 0.5;
                
                if (isAdd) {
                    const diagram = `
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 1.5rem; margin-bottom: 20px;">
                                <span class="katex-formula">x + ${addend} = ${sum}</span>
                            </div>
                            
                            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 850px;">
                                <div style="color: #3498db; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                    Get x by itself
                                </div>
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 8px;">
                                    Subtract ${addend} from BOTH sides:
                                </div>
                                <div style="font-size: 1.3rem;">
                                    <span class="katex-formula">x + ${addend} - ${addend} = ${sum} - ${addend}</span>
                                </div>
                                <div style="font-size: 1.3rem; margin-top: 10px;">
                                    <span class="katex-formula">x = \\text{?}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    return {
                        diagram: diagram,
                        problem: `Solve for x: x + ${addend} = ${sum}`,
                        answer: x,
                        hint: `Subtract ${addend} from both sides`
                    };
                } else {
                    const result = x - addend;
                    const diagram = `
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 1.5rem; margin-bottom: 20px;">
                                <span class="katex-formula">x - ${addend} = ${result}</span>
                            </div>
                            
                            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 850px;">
                                <div style="color: #3498db; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                    Get x by itself
                                </div>
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 8px;">
                                    Add ${addend} to BOTH sides:
                                </div>
                                <div style="font-size: 1.3rem;">
                                    <span class="katex-formula">x - ${addend} + ${addend} = ${result} + ${addend}</span>
                                </div>
                                <div style="font-size: 1.3rem; margin-top: 10px;">
                                    <span class="katex-formula">x = \\text{?}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    return {
                        diagram: diagram,
                        problem: `Solve for x: x - ${addend} = ${result}`,
                        answer: x,
                        hint: `Add ${addend} to both sides`
                    };
                }
            } else if (type === 'one-step-multiply') {
                const x = Math.floor(Math.random() * 15) + 2;
                const multiplier = Math.floor(Math.random() * 8) + 2;
                const product = x * multiplier;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 1.5rem; margin-bottom: 20px;">
                            <span class="katex-formula">${multiplier}x = ${product}</span>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 850px;">
                            <div style="color: #3498db; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                Get x by itself
                            </div>
                            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 8px;">
                                Divide BOTH sides by ${multiplier}:
                            </div>
                            <div style="font-size: 1.3rem;">
                                <span class="katex-formula">\\frac{${multiplier}x}{${multiplier}} = \\frac{${product}}{${multiplier}}</span>
                            </div>
                            <div style="font-size: 1.3rem; margin-top: 10px;">
                                <span class="katex-formula">x = \\text{?}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    diagram: diagram,
                    problem: `Solve for x: ${multiplier}x = ${product}`,
                    answer: x,
                    hint: `Divide both sides by ${multiplier}`
                };
            } else {
                // Two-step: ax + b = c
                const x = Math.floor(Math.random() * 10) + 1;
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 20) + 5;
                const c = a * x + b;
                
                // Calculate the intermediate step
                const afterSubtract = c - b;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 1.5rem; margin-bottom: 20px;">
                            <span class="katex-formula">${a}x + ${b} = ${c}</span>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 850px;">
                            <div style="color: #3498db; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                Step 1: Get rid of the + ${b}
                            </div>
                            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 8px;">
                                Subtract ${b} from BOTH sides:
                            </div>
                            <div style="font-size: 1.3rem;">
                                <span class="katex-formula">${a}x + ${b} - ${b} = ${c} - ${b}</span>
                            </div>
                            <div style="font-size: 1.3rem; margin-top: 10px;">
                                <span class="katex-formula">${a}x = \\underline{\\hspace{2cm}}</span>
                            </div>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 850px;">
                            <div style="color: #3498db; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                Step 2: Get x by itself
                            </div>
                            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 8px;">
                                Divide BOTH sides by ${a}:
                            </div>
                            <div style="font-size: 1.3rem;">
                                <span class="katex-formula">\\frac{${a}x}{${a}} = \\frac{\\underline{\\hspace{1.5cm}}}{${a}}</span>
                            </div>
                            <div style="font-size: 1.3rem; margin-top: 10px;">
                                <span class="katex-formula">x = \\text{?}</span>
                            </div>
                        </div>
                        
                        <div style="color: #7f8c8d; font-size: 13px; margin-top: 15px;">
                            Fill in the blanks, then solve for x!
                        </div>
                    </div>
                `;
                
                return {
                    diagram: diagram,
                    problem: `Solve for x: ${a}x + ${b} = ${c}`,
                    answer: x,
                    hint: `First subtract ${b}, then divide by ${a}`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'coordinate-plane': {
        id: 'coordinate-plane',
        name: 'Coordinate Plane',
        description: 'Practice plotting and identifying points on coordinate plane',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 25,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        generate: function() {
            const x = Math.floor(Math.random() * 11) - 5; // -5 to 5 (11 possible values)
            const y = Math.floor(Math.random() * 11) - 5; // -5 to 5 (11 possible values)
            
            const diagram = `
                <svg width="360" height="360" viewBox="0 0 360 360">
                    <!-- Grid background - DARKER for better visibility -->
                    <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#bdc3c7" stroke-width="1.5"/>
                        </pattern>
                    </defs>
                    <rect width="360" height="360" fill="url(#grid)"/>
                    
                    <!-- Axes -->
                    <line x1="180" y1="0" x2="180" y2="360" stroke="#2c3e50" stroke-width="3"/>
                    <line x1="0" y1="180" x2="360" y2="180" stroke="#2c3e50" stroke-width="3"/>
                    
                    <!-- Axis labels -->
                    <text x="350" y="175" font-size="16" fill="#2c3e50" font-weight="bold">x</text>
                    <text x="185" y="15" font-size="16" fill="#2c3e50" font-weight="bold">y</text>
                    
                    <!-- The point - NOW ON GRID INTERSECTIONS! -->
                    <circle cx="${180 + x * 30}" cy="${180 - y * 30}" r="7" fill="#e74c3c" stroke="#c0392b" stroke-width="3"/>
                    
                    <!-- Tick marks and labels (every unit from -5 to 5) -->
                    ${[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(n => `
                        <line x1="${180 + n * 30}" y1="175" x2="${180 + n * 30}" y2="185" stroke="#34495e" stroke-width="2"/>
                        <text x="${180 + n * 30}" y="200" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">${n}</text>
                        <line x1="175" y1="${180 - n * 30}" x2="185" y2="${180 - n * 30}" stroke="#34495e" stroke-width="2"/>
                        <text x="165" y="${180 - n * 30 + 4}" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">${n}</text>
                    `).join('')}
                    
                    <text x="180" y="350" text-anchor="middle" font-size="14" fill="#e74c3c" font-weight="bold">What are the coordinates?</text>
                </svg>
            `;
            
            return {
                problem: `What are the coordinates of the red point?`,
                answer: {x: x, y: y}, // Two-part answer!
                hint: `Count from the origin (0,0). Right/left is x, up/down is y`,
                diagram: diagram,
                inputType: 'coordinate' // Special flag for two-box input
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            // userAnswer will be {x: value, y: value} from the special input
            if (typeof userAnswer === 'object') {
                return parseInt(userAnswer.x) === correctAnswer.x && 
                       parseInt(userAnswer.y) === correctAnswer.y;
            }
            // Fallback for single string input
            const cleaned = userAnswer.replace(/\s+/g, '');
            return cleaned === `(${correctAnswer.x},${correctAnswer.y})`;
        }
    },
    
    'division-fractions': {
        id: 'division-fractions',
        name: 'Division with Fractions',
        description: 'Practice dividing fractions by fractions',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 45,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'fractions',
        
        generate: function() {
            // Generate first fraction
            const den1 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
            const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
            
            // Generate second fraction
            const den2 = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
            const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
            
            // Answer: (num1/den1) ÷ (num2/den2) = (num1/den1) × (den2/num2) = (num1×den2)/(den1×num2)
            const answerNum = num1 * den2;
            const answerDen = den1 * num2;
            
            // Simplify the answer
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(answerNum, answerDen);
            const simplifiedNum = answerNum / divisor;
            const simplifiedDen = answerDen / divisor;
            
            // Convert to mixed number if improper
            let answer;
            if (simplifiedNum >= simplifiedDen) {
                const whole = Math.floor(simplifiedNum / simplifiedDen);
                const remainder = simplifiedNum % simplifiedDen;
                if (remainder === 0) {
                    answer = whole.toString();
                } else {
                    answer = `${whole} ${remainder}/${simplifiedDen}`;
                }
            } else {
                answer = `${simplifiedNum}/${simplifiedDen}`;
            }
            
            // Create KEEP CHANGE FLIP visual
            const diagram = `
                <div style="text-align: center; margin: 10px 0; padding-top: 10px;">
                    <div style="font-size: 1.6rem; margin-bottom: 15px; font-weight: bold; padding: 15px 10px 5px 10px; line-height: 1.4;">
                        <span class="katex-formula">\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}}</span>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            ✨ KEEP • CHANGE • FLIP ✨
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px; display: flex; justify-content: space-around; align-items: center; gap: 12px;">
                            <div style="flex: 1; text-align: center;">
                                <div style="color: #e74c3c; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
                                    1️⃣ KEEP
                                </div>
                                <div style="font-size: 1.2rem; color: #e74c3c;">
                                    <span class="katex-formula">\\frac{${num1}}{${den1}}</span>
                                </div>
                            </div>
                            
                            <div style="font-size: 1.5rem; color: #95a5a6;">→</div>
                            
                            <div style="flex: 1; text-align: center;">
                                <div style="color: #f39c12; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
                                    2️⃣ CHANGE
                                </div>
                                <div style="font-size: 1.2rem; color: #f39c12;">
                                    <span class="katex-formula">\\div \\rightarrow \\times</span>
                                </div>
                            </div>
                            
                            <div style="font-size: 1.5rem; color: #95a5a6;">→</div>
                            
                            <div style="flex: 1; text-align: center;">
                                <div style="color: #27ae60; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
                                    3️⃣ FLIP
                                </div>
                                <div style="font-size: 1.2rem; color: #27ae60;">
                                    <span class="katex-formula">\\frac{${num2}}{${den2}} \\rightarrow \\frac{${den2}}{${num2}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <div style="font-size: 17px; font-weight: bold; margin-bottom: 8px;">
                            🔥 NOW YOU TRY! 🔥
                        </div>
                        <div style="font-size: 1.4rem; margin: 10px 0;">
                            <span class="katex-formula">\\frac{${num1}}{${den1}} \\times \\frac{${den2}}{${num2}} = \\text{?}</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 13px; border: 2px dashed rgba(255,255,255,0.5);">
                            💡 <strong>PRO TIP:</strong> Multiply across the top, multiply across the bottom, then simplify!
                        </div>
                    </div>
                </div>
            `;
            
            return {
                diagram: diagram,
                problem: `Divide: ${num1}/${den1} ÷ ${num2}/${den2}`,
                answer: answer,
                hint: `Remember: KEEP • CHANGE • FLIP!`,
            };
        },
        
        check: function(userAnswer, correctAnswer) {
            // Remove spaces and normalize the answer format
            const cleaned = userAnswer.trim().replace(/\s+/g, ' ');
            const cleanedCorrect = correctAnswer.trim().replace(/\s+/g, ' ');
            
            // Check if they match exactly
            if (cleaned === cleanedCorrect) return true;
            
            // Also accept equivalent forms (e.g., "8" or "8/1")
            if (cleaned.includes('/')) {
                const [num, den] = cleaned.split('/').map(x => parseFloat(x.trim()));
                const expectedValue = num / den;
                
                if (cleanedCorrect.includes('/')) {
                    const [correctNum, correctDen] = cleanedCorrect.split('/').map(x => parseFloat(x.trim()));
                    return Math.abs(expectedValue - (correctNum / correctDen)) < 0.01;
                } else if (cleanedCorrect.includes(' ')) {
                    const parts = cleanedCorrect.split(' ');
                    const wholeNum = parseFloat(parts[0]);
                    const [fracNum, fracDen] = parts[1].split('/').map(x => parseFloat(x.trim()));
                    const correctValue = wholeNum + (fracNum / fracDen);
                    return Math.abs(expectedValue - correctValue) < 0.01;
                } else {
                    return Math.abs(expectedValue - parseFloat(cleanedCorrect)) < 0.01;
                }
            } else if (cleaned.includes(' ')) {
                const parts = cleaned.split(' ');
                const wholeNum = parseFloat(parts[0]);
                const [fracNum, fracDen] = parts[1].split('/').map(x => parseFloat(x.trim()));
                const userValue = wholeNum + (fracNum / fracDen);
                
                if (cleanedCorrect.includes('/')) {
                    const [correctNum, correctDen] = cleanedCorrect.split('/').map(x => parseFloat(x.trim()));
                    return Math.abs(userValue - (correctNum / correctDen)) < 0.01;
                } else if (cleanedCorrect.includes(' ')) {
                    const correctParts = cleanedCorrect.split(' ');
                    const correctWhole = parseFloat(correctParts[0]);
                    const [correctFracNum, correctFracDen] = correctParts[1].split('/').map(x => parseFloat(x.trim()));
                    const correctValue = correctWhole + (correctFracNum / correctFracDen);
                    return Math.abs(userValue - correctValue) < 0.01;
                } else {
                    return Math.abs(userValue - parseFloat(cleanedCorrect)) < 0.01;
                }
            }
            
            return false;
        }
    },
    
    'unit-rates': {
        id: 'unit-rates',
        name: 'Unit Rates',
        description: 'Practice finding unit rates (cost per item, speed, etc.)',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 35,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'ratios',
        
        generate: function() {
            const scenarios = [
                {type: 'cost', unit: 'per item', prefix: '$'},
                {type: 'speed', unit: 'per hour', prefix: ''},
                {type: 'rate', unit: 'per minute', prefix: ''}
            ];
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            if (scenario.type === 'cost') {
                const items = Math.floor(Math.random() * 8) + 3; // 3-10 items
                const cost = items * (Math.floor(Math.random() * 8) + 2); // $2-10 per item
                const unitRate = cost / items;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 17px; font-weight: bold; margin-bottom: 12px;">
                                💰 UNIT RATE: Find the cost of ONE item
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px; display: flex; justify-content: space-around; align-items: center; gap: 15px;">
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #e67e22; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        📦 TOTAL
                                    </div>
                                    <div style="font-size: 1.3rem; color: #e67e22;">
                                        <span class="katex-formula">\\text{\\$${cost}}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        ${items} items
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">÷</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #3498db; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        🔢 DIVIDE BY
                                    </div>
                                    <div style="font-size: 1.3rem; color: #3498db;">
                                        <span class="katex-formula">${items}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        items
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">=</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #27ae60; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        ✨ UNIT RATE
                                    </div>
                                    <div style="font-size: 1.3rem; color: #27ae60;">
                                        <span class="katex-formula">\\text{?}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        per item
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 10px; margin: 15px auto; max-width: 850px;">
                            <div style="color: #e74c3c; font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                                💡 Remember: Unit rate = <strong>Total ÷ Number of units</strong>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the unit rate:\n\n${items} items cost $${cost}\n\nHow much does 1 item cost?`,
                    answer: unitRate,
                    hint: `Divide total cost by number of items: ${cost} ÷ ${items}`,
                    diagram: diagram
                };
            } else if (scenario.type === 'speed') {
                const hours = Math.floor(Math.random() * 4) + 2; // 2-5 hours
                const miles = hours * (Math.floor(Math.random() * 30) + 40); // 40-70 mph
                const unitRate = miles / hours;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 17px; font-weight: bold; margin-bottom: 12px;">
                                🚗 SPEED: Find miles per HOUR
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px; display: flex; justify-content: space-around; align-items: center; gap: 15px;">
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #e67e22; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        📍 DISTANCE
                                    </div>
                                    <div style="font-size: 1.3rem; color: #e67e22;">
                                        <span class="katex-formula">${miles}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        miles
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">÷</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #3498db; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        ⏰ TIME
                                    </div>
                                    <div style="font-size: 1.3rem; color: #3498db;">
                                        <span class="katex-formula">${hours}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        hours
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">=</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #27ae60; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        ⚡ SPEED
                                    </div>
                                    <div style="font-size: 1.3rem; color: #27ae60;">
                                        <span class="katex-formula">\\text{?}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        mph
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 10px; margin: 15px auto; max-width: 850px;">
                            <div style="color: #e74c3c; font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                                💡 Remember: Speed = <strong>Distance ÷ Time</strong>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the unit rate:\n\nA car travels ${miles} miles in ${hours} hours\n\nHow many miles per hour?`,
                    answer: unitRate,
                    hint: `Divide miles by hours: ${miles} ÷ ${hours}`,
                    diagram: diagram
                };
            } else {
                const minutes = Math.floor(Math.random() * 5) + 2; // 2-6 minutes
                const pages = minutes * (Math.floor(Math.random() * 3) + 2); // 2-4 pages per min
                const unitRate = pages / minutes;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: linear-gradient(135deg, #16a085 0%, #138d75 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 17px; font-weight: bold; margin-bottom: 12px;">
                                📖 READING RATE: Find pages per MINUTE
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px; display: flex; justify-content: space-around; align-items: center; gap: 15px;">
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #e67e22; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        📄 TOTAL PAGES
                                    </div>
                                    <div style="font-size: 1.3rem; color: #e67e22;">
                                        <span class="katex-formula">${pages}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        pages
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">÷</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #3498db; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        ⏱️ TIME
                                    </div>
                                    <div style="font-size: 1.3rem; color: #3498db;">
                                        <span class="katex-formula">${minutes}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        minutes
                                    </div>
                                </div>
                                
                                <div style="font-size: 2rem; color: #95a5a6;">=</div>
                                
                                <div style="flex: 1; text-align: center;">
                                    <div style="color: #27ae60; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                                        📚 RATE
                                    </div>
                                    <div style="font-size: 1.3rem; color: #27ae60;">
                                        <span class="katex-formula">\\text{?}</span>
                                    </div>
                                    <div style="font-size: 13px; color: #7f8c8d; margin-top: 5px;">
                                        per minute
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 10px; margin: 15px auto; max-width: 850px;">
                            <div style="color: #e74c3c; font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                                💡 Remember: Rate = <strong>Total ÷ Time</strong>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the unit rate:\n\nYou read ${pages} pages in ${minutes} minutes\n\nHow many pages per minute?`,
                    answer: unitRate,
                    hint: `Divide pages by minutes: ${pages} ÷ ${minutes}`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.01;
        }
    },
    
    'integers-operations': {
        id: 'integers-operations',
        name: 'Integer Operations',
        description: 'Practice all operations with positive and negative integers',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 30,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'integers',
        
        generate: function() {
            const operations = ['add', 'subtract', 'multiply', 'divide'];
            const op = operations[Math.floor(Math.random() * operations.length)];
            
            if (op === 'add') {
                // Mix of pos+neg, neg+neg, neg+pos
                const scenarios = [
                    {a: Math.floor(Math.random() * 20) + 5, b: -(Math.floor(Math.random() * 15) + 1)},
                    {a: -(Math.floor(Math.random() * 15) + 5), b: -(Math.floor(Math.random() * 15) + 5)},
                    {a: -(Math.floor(Math.random() * 15) + 1), b: Math.floor(Math.random() * 20) + 5}
                ];
                const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                const answer = scenario.a + scenario.b;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 17px; font-weight: bold; margin-bottom: 12px;">
                                ➕ ADDING INTEGERS
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 18px; border-radius: 8px;">
                                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">
                                    Think about it like a number line:
                                </div>
                                
                                <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                                    <div style="flex: 1; text-align: center; padding: 15px; background: ${scenario.a >= 0 ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; margin: 0 5px;">
                                        <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 5px;">Start here</div>
                                        <div style="font-size: 2rem; font-weight: bold; color: ${scenario.a >= 0 ? '#27ae60' : '#e74c3c'};">
                                            ${scenario.a}
                                        </div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; font-size: 2rem; color: #95a5a6; padding: 0 10px;">+</div>
                                    
                                    <div style="flex: 1; text-align: center; padding: 15px; background: ${scenario.b >= 0 ? '#e8f5e9' : '#ffebee'}; border-radius: 8px; margin: 0 5px;">
                                        <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 5px;">${scenario.b >= 0 ? 'Move right' : 'Move left'}</div>
                                        <div style="font-size: 2rem; font-weight: bold; color: ${scenario.b >= 0 ? '#27ae60' : '#e74c3c'};">
                                            ${scenario.b}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f39c12;">
                                    <div style="font-size: 14px; color: #856404;">
                                        💡 <strong>Quick Tip:</strong> ${scenario.a >= 0 && scenario.b < 0 ? 'Positive + Negative = Subtract and keep the sign of the bigger number' : 
                                        scenario.a < 0 && scenario.b < 0 ? 'Negative + Negative = Add and stay negative' :
                                        'Negative + Positive = Subtract and keep the sign of the bigger number'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `${scenario.a} + (${scenario.b}) = ?`,
                    answer: answer,
                    hint: `Think about moving on a number line`,
                    diagram: diagram
                };
            } else if (op === 'subtract') {
                const a = Math.floor(Math.random() * 20) + 5;
                const b = Math.random() < 0.5 ? -(Math.floor(Math.random() * 15) + 1) : Math.floor(Math.random() * 15) + 1;
                const answer = a - b;
                
                const diagram = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 18px; border-radius: 10px; margin: 15px auto; max-width: 850px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="font-size: 17px; font-weight: bold; margin-bottom: 12px;">
                                ➖ SUBTRACTING INTEGERS
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 18px; border-radius: 8px;">
                                <div style="font-size: 16px; font-weight: bold; color: #e74c3c; margin-bottom: 15px; text-transform: uppercase;">
                                    🔄 SECRET TRICK: Keep • Change • Change!
                                </div>
                                
                                <div style="display: flex; justify-content: space-around; align-items: center; margin: 20px 0; gap: 10px;">
                                    <div style="flex: 1; text-align: center; padding: 12px; background: #e3f2fd; border-radius: 8px;">
                                        <div style="font-size: 12px; color: #1976d2; margin-bottom: 5px; font-weight: bold;">1️⃣ KEEP</div>
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">
                                            ${a}
                                        </div>
                                    </div>
                                    
                                    <div style="font-size: 1.5rem; color: #95a5a6;">→</div>
                                    
                                    <div style="flex: 1; text-align: center; padding: 12px; background: #fff3e0; border-radius: 8px;">
                                        <div style="font-size: 12px; color: #f57c00; margin-bottom: 5px; font-weight: bold;">2️⃣ CHANGE</div>
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #f57c00;">
                                            − → +
                                        </div>
                                    </div>
                                    
                                    <div style="font-size: 1.5rem; color: #95a5a6;">→</div>
                                    
                                    <div style="flex: 1; text-align: center; padding: 12px; background: #e8f5e9; border-radius: 8px;">
                                        <div style="font-size: 12px; color: #388e3c; margin-bottom: 5px; font-weight: bold;">3️⃣ CHANGE</div>
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #388e3c;">
                                            ${b} → ${-b}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="background: #f3e5f5; padding: 12px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #9c27b0;">
                                    <div style="font-size: 15px; color: #4a148c;">
                                        ⚡ <strong>Now solve:</strong> ${a} + (${-b}) = ?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `${a} − (${b}) = ?`,
                    answer: answer,
                    hint: `Keep-Change-Change: Turn subtraction into addition`,
                    diagram: diagram
                };
            } else if (op === 'multiply') {
                const a = Math.random() < 0.5 ? Math.floor(Math.random() * 8) + 2 : -(Math.floor(Math.random() * 8) + 2);
                const b = Math.random() < 0.5 ? Math.floor(Math.random() * 6) + 2 : -(Math.floor(Math.random() * 6) + 2);
                const answer = a * b;
                
                // Create hash marks for number line
                const hashMarks = [];
                for (let i = -10; i <= 10; i++) {
                    if (i !== 0) {
                        const x = 400 + (i * 35);
                        hashMarks.push(`<line x1="${x}" y1="35" x2="${x}" y2="45" stroke="#ecf0f1" stroke-width="2"/>`);
                        if (i % 5 === 0) {
                            hashMarks.push(`<text x="${x}" y="65" text-anchor="middle" font-size="14" fill="#ecf0f1" font-weight="bold">${i}</text>`);
                        }
                    }
                }
                
                const diagram = `
                    <div style="text-align: center; margin: 15px 0;">
                        <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 15px; border-radius: 10px; margin: 10px auto; max-width: 850px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                                ✖️ MULTIPLYING INTEGERS: ${a} × ${b}
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px;">
                                <div style="background: #34495e; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                    <!-- Number line with hash marks -->
                                    <svg width="100%" height="80" viewBox="0 0 800 80" style="margin: 0;">
                                        <!-- Main line (BOLD & BRIGHT) -->
                                        <line x1="50" y1="40" x2="750" y2="40" stroke="#ecf0f1" stroke-width="6"/>
                                        
                                        <!-- Hash marks -->
                                        ${hashMarks.join('\n                                        ')}
                                        
                                        <!-- Zero marker (EXTRA BOLD) -->
                                        <line x1="400" y1="28" x2="400" y2="52" stroke="#ffffff" stroke-width="6"/>
                                        <text x="400" y="70" text-anchor="middle" font-size="18" fill="#ffffff" font-weight="bold">0</text>
                                        
                                        <!-- Direction arrow (SUBTLE) -->
                                        ${b > 0 ? 
                                            `<path d="M 420 40 L 700 40" stroke="${a > 0 ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.5)'}" stroke-width="8" fill="none" marker-end="url(#arrowhead)"/>` :
                                            `<path d="M 380 40 L 100 40" stroke="${a > 0 ? 'rgba(231, 76, 60, 0.5)' : 'rgba(46, 204, 113, 0.4)'}" stroke-width="8" fill="none" marker-end="url(#arrowhead2)"/>`
                                        }
                                        
                                        <!-- Arrow markers -->
                                        <defs>
                                            <marker id="arrowhead" markerWidth="14" markerHeight="14" refX="12" refY="5" orient="auto">
                                                <polygon points="0 0, 14 5, 0 10" fill="${a > 0 ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.5)'}" />
                                            </marker>
                                            <marker id="arrowhead2" markerWidth="14" markerHeight="14" refX="2" refY="5" orient="auto">
                                                <polygon points="14 0, 0 5, 14 10" fill="${a > 0 ? 'rgba(231, 76, 60, 0.5)' : 'rgba(46, 204, 113, 0.4)'}" />
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>
                                
                                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
                                    <div style="background: ${b > 0 ? '#e3f2fd' : '#fff3e0'}; padding: 10px 15px; border-radius: 8px; border: 3px solid ${b > 0 ? '#2196f3' : '#f57c00'};">
                                        <span style="font-size: 13px; color: #666;">Direction: </span>
                                        <strong style="font-size: 15px; color: ${b > 0 ? '#1976d2' : '#e65100'};">
                                            ${b > 0 ? '➡️ RIGHT' : '⬅️ LEFT'} (${b > 0 ? '+' : '−'})
                                        </strong>
                                    </div>
                                    
                                    <div style="background: ${a > 0 ? '#e8f5e9' : '#ffebee'}; padding: 10px 15px; border-radius: 8px; border: 3px solid ${a > 0 ? '#27ae60' : '#e74c3c'};">
                                        <span style="font-size: 13px; color: #666;">Jumps: </span>
                                        <strong style="font-size: 15px; color: ${a > 0 ? '#27ae60' : '#e74c3c'};">
                                            ${Math.abs(b)} times of ${a}
                                        </strong>
                                    </div>
                                    
                                    <div style="background: #f3e5f5; padding: 10px 15px; border-radius: 8px; border: 3px solid #9c27b0;">
                                        <span style="font-size: 13px; color: #666;">🤔 </span>
                                        <strong style="font-size: 15px; color: #6a1b9a;">Where do you land?</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `${a} × ${b} = ?`,
                    answer: answer,
                    hint: `Make ${Math.abs(b)} jumps of ${a} on the number line`,
                    diagram: diagram
                };
            } else { // divide
                // Make sure division results in whole number
                const divisor = Math.random() < 0.5 ? Math.floor(Math.random() * 8) + 2 : -(Math.floor(Math.random() * 8) + 2);
                const quotient = Math.random() < 0.5 ? Math.floor(Math.random() * 10) + 2 : -(Math.floor(Math.random() * 10) + 2);
                const dividend = divisor * quotient;
                const answer = quotient;
                
                const sameSign = (dividend > 0 && divisor > 0) || (dividend < 0 && divisor < 0);
                
                const diagram = `
                    <div style="text-align: center; margin: 15px 0;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #d68910 100%); color: white; padding: 15px; border-radius: 10px; margin: 10px auto; max-width: 850px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                                ➗ DIVIDING INTEGERS: ${dividend} ÷ ${divisor}
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.95); color: #2c3e50; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 16px; font-weight: bold; color: #f39c12; margin-bottom: 10px;">
                                    🎯 SIGN RULES (Same as multiplication!)
                                </div>
                                
                                <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                                    <div style="text-align: center; padding: 12px 20px; background: #e8f5e9; border-radius: 8px; border: 3px solid #27ae60;">
                                        <div style="font-size: 14px; font-weight: bold; color: #27ae60; margin-bottom: 5px;">SAME SIGNS</div>
                                        <div style="font-size: 13px; color: #666;">+ ÷ + = <strong>+</strong></div>
                                        <div style="font-size: 13px; color: #666;">− ÷ − = <strong>+</strong></div>
                                    </div>
                                    
                                    <div style="text-align: center; padding: 12px 20px; background: #ffebee; border-radius: 8px; border: 3px solid #e74c3c;">
                                        <div style="font-size: 14px; font-weight: bold; color: #e74c3c; margin-bottom: 5px;">DIFFERENT SIGNS</div>
                                        <div style="font-size: 13px; color: #666;">+ ÷ − = <strong>−</strong></div>
                                        <div style="font-size: 13px; color: #666;">− ÷ + = <strong>−</strong></div>
                                    </div>
                                </div>
                                
                                <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #f39c12;">
                                    <div style="font-size: 14px; color: #856404;">
                                        🤔 <strong>Check the signs:</strong> Do ${dividend} and ${divisor} have the same or different signs?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `${dividend} ÷ ${divisor} = ?`,
                    answer: answer,
                    hint: `Look at the signs, then divide the absolute values`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'order-of-operations': {
        id: 'order-of-operations',
        name: 'Order of Operations',
        description: 'Practice PEMDAS with multi-step expressions',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 45,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        generate: function() {
            const types = ['parentheses', 'exponent-mult', 'mult-add', 'all-operations'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'parentheses') {
                const a = Math.floor(Math.random() * 8) + 2;
                const b = Math.floor(Math.random() * 8) + 2;
                const c = Math.floor(Math.random() * 5) + 2;
                const answer = (a + b) * c;
                return {
                    problem: `(${a} + ${b}) × ${c} = ?`,
                    answer: answer,
                    hint: `Do parentheses first: (${a + b}) × ${c}`
                };
            } else if (type === 'exponent-mult') {
                const a = Math.floor(Math.random() * 3) + 2; // 2-4
                const exp = 2; // Keep it simple
                const b = Math.floor(Math.random() * 5) + 2;
                const answer = Math.pow(a, exp) * b;
                return {
                    problem: `${a}² × ${b} = ?`,
                    answer: answer,
                    hint: `Exponents first: ${Math.pow(a, exp)} × ${b}`
                };
            } else if (type === 'mult-add') {
                const a = Math.floor(Math.random() * 8) + 2;
                const b = Math.floor(Math.random() * 8) + 2;
                const c = Math.floor(Math.random() * 8) + 2;
                const answer = a * b + c;
                return {
                    problem: `${a} × ${b} + ${c} = ?`,
                    answer: answer,
                    hint: `Multiply first: ${a * b} + ${c}`
                };
            } else {
                const a = Math.floor(Math.random() * 5) + 2;
                const b = Math.floor(Math.random() * 5) + 2;
                const c = Math.floor(Math.random() * 4) + 2;
                const d = Math.floor(Math.random() * 5) + 1;
                const answer = a + b * c - d;
                return {
                    problem: `${a} + ${b} × ${c} - ${d} = ?`,
                    answer: answer,
                    hint: `Multiply first: ${a} + ${b * c} - ${d}, then left to right`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    'absolute-value': {
        id: 'absolute-value',
        name: 'Absolute Value',
        description: 'Practice finding absolute value and comparing integers',
        difficulty: 2,
        stars: '⭐⭐',
        reward: 25,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'integers',
        
        generate: function() {
            const types = ['simple', 'compare', 'expression'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'simple') {
                const n = -(Math.floor(Math.random() * 50) + 1); // -1 to -50
                const answer = Math.abs(n);
                
                return {
                    problem: `Find the absolute value:\n\n|${n}| = ?`,
                    answer: answer,
                    hint: `Absolute value is the distance from zero (always positive)`
                };
            } else if (type === 'compare') {
                const a = -(Math.floor(Math.random() * 30) + 10);
                const b = Math.floor(Math.random() * 40) + 5;
                const answer = Math.abs(a) > b ? '>' : Math.abs(a) < b ? '<' : '=';
                
                return {
                    problem: `Compare using <, >, or =:\n\n|${a}| ___ ${b}`,
                    answer: answer,
                    hint: `|${a}| = ${Math.abs(a)}, then compare to ${b}`
                };
            } else {
                const a = Math.floor(Math.random() * 10) + 5;
                const b = -(Math.floor(Math.random() * 10) + 5);
                const answer = Math.abs(b) - a;
                
                return {
                    problem: `Evaluate:\n\n|${b}| - ${a} = ?`,
                    answer: answer,
                    hint: `First find |${b}| = ${Math.abs(b)}, then subtract ${a}`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            if (typeof correctAnswer === 'string') {
                return userAnswer.trim() === correctAnswer;
            }
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // ==========================================
    // NEW LESSONS 1-10 (Base Implementation)
    // ==========================================
    
    // LESSON 5: EXPONENTS
    'exponents': {
        id: 'exponents',
        name: 'Exponents',
        description: 'Evaluate expressions with exponents',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 40,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        generate: function() {
            const types = ['single', 'addition', 'write-notation'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'single') {
                // Single exponent: 2⁵ = ?
                const base = Math.floor(Math.random() * 5) + 2; // 2-6
                const exp = Math.floor(Math.random() * 4) + 2; // 2-5
                const answer = Math.pow(base, exp);
                
                // Build visual scaffolding showing repeated multiplication
                const multArray = Array(exp).fill(base);
                const multString = multArray.join(' × ');
                const steps = multArray.slice(0, Math.min(3, exp)).join(' × ');
                const remaining = exp > 3 ? ` × ... (${exp} times total)` : '';
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3);">
                            <div style="background: white; padding: 30px; border-radius: 10px;">
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                        ⚡ EXPONENT POWER!
                                    </div>
                                    <div style="font-size: 48px; color: #2d3748; margin: 20px 0;">
                                        ${base}<sup style="font-size: 32px; color: #e53e3e;">${exp}</sup>
                                    </div>
                                    <div style="font-size: 16px; color: #718096; margin-top: 10px;">
                                        The base is <span style="color: #2d3748; font-weight: bold;">${base}</span>, 
                                        the exponent is <span style="color: #e53e3e; font-weight: bold;">${exp}</span>
                                    </div>
                                </div>
                                
                                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                    <div style="font-size: 16px; color: #4a5568; margin-bottom: 12px;">
                                        <strong style="color: #667eea;">What this means:</strong>
                                    </div>
                                    <div style="font-size: 22px; color: #2d3748; text-align: center; margin: 15px 0; font-family: 'Courier New', monospace;">
                                        ${base}<sup>${exp}</sup> = ${multString}
                                    </div>
                                    <div style="text-align: center; color: #718096; font-size: 14px; margin-top: 12px;">
                                        Multiply ${base} by itself ${exp} times
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px; padding: 15px; background: #fff5f5; border-radius: 8px; border: 2px dashed #fc8181;">
                                    <div style="font-size: 15px; color: #c53030; font-weight: bold; text-align: center;">
                                        💡 Calculate: ${steps}${remaining} = ?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Evaluate: ${base}<sup>${exp}</sup> = ?`,
                    answer: answer,
                    hint: `Multiply ${base} × ${base} (${exp} times total)`,
                    diagram: diagram
                };
            } else if (type === 'addition') {
                // Addition: 4² + 3³ = ?
                const base1 = Math.floor(Math.random() * 3) + 2; // 2-4
                const exp1 = 2;
                const base2 = Math.floor(Math.random() * 3) + 2; // 2-4
                const exp2 = 3;
                const val1 = Math.pow(base1, exp1);
                const val2 = Math.pow(base2, exp2);
                const answer = val1 + val2;
                
                const mult1 = Array(exp1).fill(base1).join(' × ');
                const mult2 = Array(exp2).fill(base2).join(' × ');
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(240,147,251,0.3);">
                            <div style="background: white; padding: 30px; border-radius: 10px;">
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <div style="font-size: 18px; color: #d53f8c; font-weight: bold; margin-bottom: 15px;">
                                        ⚡ EXPONENTS + ADDITION
                                    </div>
                                    <div style="font-size: 48px; color: #2d3748; margin: 20px 0;">
                                        ${base1}<sup style="font-size: 32px; color: #e53e3e;">${exp1}</sup> 
                                        <span style="color: #667eea; font-size: 40px;">+</span> 
                                        ${base2}<sup style="font-size: 32px; color: #e53e3e;">${exp2}</sup>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                                    <div style="flex: 1; background: #f0fff4; padding: 15px; border-radius: 8px; border-left: 4px solid #48bb78;">
                                        <div style="font-size: 14px; color: #2f855a; font-weight: bold; margin-bottom: 8px;">STEP 1: First exponent</div>
                                        <div style="font-size: 20px; color: #2d3748; text-align: center; margin: 10px 0;">
                                            ${base1}<sup>${exp1}</sup> = ${mult1}
                                        </div>
                                        <div style="text-align: center; color: #48bb78; font-weight: bold; font-size: 24px;">
                                            = ${val1}
                                        </div>
                                    </div>
                                    
                                    <div style="flex: 1; background: #fffaf0; padding: 15px; border-radius: 8px; border-left: 4px solid #ed8936;">
                                        <div style="font-size: 14px; color: #c05621; font-weight: bold; margin-bottom: 8px;">STEP 2: Second exponent</div>
                                        <div style="font-size: 20px; color: #2d3748; text-align: center; margin: 10px 0;">
                                            ${base2}<sup>${exp2}</sup> = ${mult2}
                                        </div>
                                        <div style="text-align: center; color: #ed8936; font-weight: bold; font-size: 24px;">
                                            = ${val2}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px; padding: 20px; background: #fff5f5; border-radius: 8px; border: 2px dashed #fc8181;">
                                    <div style="font-size: 15px; color: #742a2a; font-weight: bold; text-align: center; margin-bottom: 10px;">
                                        STEP 3: Add them together
                                    </div>
                                    <div style="font-size: 28px; color: #2d3748; text-align: center;">
                                        ${val1} + ${val2} = <span style="color: #c53030;">?</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Evaluate: ${base1}<sup>${exp1}</sup> + ${base2}<sup>${exp2}</sup> = ?`,
                    answer: answer,
                    hint: `First calculate each exponent: ${base1}<sup>${exp1}</sup> = ${val1}, then ${base2}<sup>${exp2}</sup> = ${val2}, then add`,
                    diagram: diagram
                };
            } else {
                // Write using exponents: 5×5×5×5 = ?
                const base = Math.floor(Math.random() * 4) + 3; // 3-6
                const exp = Math.floor(Math.random() * 3) + 3; // 3-5
                const answer = exp; // They write the exponent
                const multiplication = Array(exp).fill(base).join(' × ');
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(250,112,154,0.3);">
                            <div style="background: white; padding: 30px; border-radius: 10px;">
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <div style="font-size: 18px; color: #d53f8c; font-weight: bold; margin-bottom: 15px;">
                                        ✍️ WRITE USING EXPONENTS
                                    </div>
                                </div>
                                
                                <div style="background: #f7fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                                    <div style="font-size: 16px; color: #4a5568; margin-bottom: 15px; text-align: center;">
                                        <strong>Given repeated multiplication:</strong>
                                    </div>
                                    <div style="font-size: 32px; color: #2d3748; text-align: center; margin: 20px 0; font-family: 'Courier New', monospace;">
                                        ${multiplication}
                                    </div>
                                </div>
                                
                                <div style="background: #edf2f7; padding: 20px; border-radius: 8px; border: 2px solid #cbd5e0; margin-bottom: 20px;">
                                    <div style="font-size: 15px; color: #2d3748; margin-bottom: 15px;">
                                        <strong style="color: #d53f8c;">💡 Hint:</strong> Count how many times <strong style="font-size: 20px; color: #2d3748;">${base}</strong> appears
                                    </div>
                                    <div style="text-align: center; margin-top: 15px;">
                                        ${Array(exp).fill(`<span style="display: inline-block; width: 50px; height: 50px; line-height: 50px; background: #667eea; color: white; border-radius: 50%; margin: 5px; font-size: 24px; font-weight: bold;">${base}</span>`).join('')}
                                    </div>
                                    <div style="text-align: center; margin-top: 15px; font-size: 18px; color: #4a5568;">
                                        Count: <span style="color: #e53e3e; font-weight: bold; font-size: 24px;">${exp}</span> times
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px; padding: 20px; background: #fff5f5; border-radius: 8px; border: 2px dashed #fc8181;">
                                    <div style="font-size: 15px; color: #742a2a; font-weight: bold; text-align: center; margin-bottom: 10px;">
                                        Write in exponent form:
                                    </div>
                                    <div style="font-size: 42px; color: #2d3748; text-align: center;">
                                        ${base}<sup style="font-size: 32px; background: #fef5e7; padding: 5px 10px; border-radius: 5px; color: #e53e3e;">?</sup>
                                    </div>
                                    <div style="text-align: center; color: #718096; font-size: 14px; margin-top: 15px;">
                                        (Enter just the exponent number)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Write using exponents: ${multiplication} = ${base}<sup>?</sup>`,
                    answer: answer,
                    hint: `Count how many times ${base} appears in the multiplication`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 6: GCF AND LCM
    'gcf-lcm': {
        id: 'gcf-lcm',
        name: 'GCF and LCM',
        description: 'Find greatest common factor and least common multiple',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 35,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'number-theory',
        
        // Future: scaffoldingEnabled will be controlled by teacher/parent settings
        // For now, scaffolding is always available but collapsed by default
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['gcf', 'lcm'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Helper function to get prime factorization
            function getPrimeFactors(n) {
                const factors = [];
                let num = n;
                for (let i = 2; i <= num; i++) {
                    while (num % i === 0) {
                        factors.push(i);
                        num = num / i;
                    }
                }
                return factors;
            }
            
            // Helper to format factors as multiplication
            function formatFactors(factors) {
                return factors.join(' × ');
            }
            
            if (type === 'gcf') {
                // GCF problems - use numbers with common factors
                const pairs = [
                    [12, 18, 6], [24, 36, 12], [15, 25, 5], [20, 30, 10],
                    [8, 12, 4], [14, 21, 7], [16, 24, 8], [18, 27, 9]
                ];
                const pair = pairs[Math.floor(Math.random() * pairs.length)];
                const num1 = pair[0];
                const num2 = pair[1];
                const gcf = pair[2];
                
                // Get prime factorizations
                const factors1 = getPrimeFactors(num1);
                const factors2 = getPrimeFactors(num2);
                
                // Find common factors
                const commonFactors = [];
                const temp2 = [...factors2];
                factors1.forEach(f => {
                    const idx = temp2.indexOf(f);
                    if (idx !== -1) {
                        commonFactors.push(f);
                        temp2.splice(idx, 1);
                    }
                });
                
                // Unique factors for each number (for Venn diagram)
                const unique1 = factors1.filter(f => !commonFactors.includes(f) || factors1.filter(x => x === f).length > commonFactors.filter(x => x === f).length);
                const unique2 = factors2.filter(f => !commonFactors.includes(f) || factors2.filter(x => x === f).length > commonFactors.filter(x => x === f).length);
                
                // Build Venn diagram
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <!-- Collapsible Scaffolding Button -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="gcf-help-btn" onclick="
                                const content = document.getElementById('gcf-scaffolding');
                                const btn = document.getElementById('gcf-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " 
                                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <!-- Scaffolding Content (Hidden by Default) -->
                        <div id="gcf-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🔢 GREATEST COMMON FACTOR (GCF)
                                        </div>
                                        <div style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">
                                            Find the <strong style="color: #667eea;">largest number</strong> that divides both numbers evenly
                                        </div>
                                    </div>
                                    
                                    <!-- Prime Factorizations -->
                                    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                                        <div style="flex: 1; background: #f0f4ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                            <div style="font-size: 28px; font-weight: bold; color: #2d3748; margin-bottom: 10px; text-align: center;">
                                                ${num1}
                                            </div>
                                            <div style="font-size: 18px; color: #4a5568; text-align: center; margin-top: 10px;">
                                                = ${formatFactors(factors1)}
                                            </div>
                                        </div>
                                        
                                        <div style="flex: 1; background: #fff5f0; padding: 20px; border-radius: 8px; border-left: 4px solid #ed8936;">
                                            <div style="font-size: 28px; font-weight: bold; color: #2d3748; margin-bottom: 10px; text-align: center;">
                                                ${num2}
                                            </div>
                                            <div style="font-size: 18px; color: #4a5568; text-align: center; margin-top: 10px;">
                                                = ${formatFactors(factors2)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Venn Diagram -->
                                    <div style="position: relative; height: 220px; margin: 30px 0;">
                                        <svg width="100%" height="220" viewBox="0 0 600 200" style="max-width: 700px; margin: 0 auto; display: block;">
                                            <!-- Left Circle (num1) - DAD BOD VERSION! -->
                                            <circle cx="200" cy="100" r="90" fill="#667eea" opacity="0.3" stroke="#667eea" stroke-width="3"/>
                                            
                                            <!-- Right Circle (num2) - DAD BOD VERSION! -->
                                            <circle cx="400" cy="100" r="90" fill="#ed8936" opacity="0.3" stroke="#ed8936" stroke-width="3"/>
                                            
                                            <!-- Labels -->
                                            <text x="200" y="30" text-anchor="middle" font-size="22" font-weight="bold" fill="#667eea">${num1}</text>
                                            <text x="400" y="30" text-anchor="middle" font-size="22" font-weight="bold" fill="#ed8936">${num2}</text>
                                            
                                            <!-- Unique to num1 (left only) -->
                                            ${unique1.length > 0 ? `
                                                <text x="140" y="100" text-anchor="middle" font-size="24" font-weight="bold" fill="#2d3748">
                                                    ${formatFactors(unique1.slice(0, 3))}
                                                </text>
                                                ${unique1.length > 3 ? `<text x="140" y="125" text-anchor="middle" font-size="18" fill="#4a5568">...</text>` : ''}
                                            ` : '<text x="140" y="100" text-anchor="middle" font-size="18" fill="#718096">—</text>'}
                                            
                                            <!-- Common factors (intersection) -->
                                            <text x="300" y="95" text-anchor="middle" font-size="28" font-weight="bold" fill="#2d3748">
                                                ${formatFactors(commonFactors)}
                                            </text>
                                            <text x="300" y="120" text-anchor="middle" font-size="16" font-style="italic" fill="#48bb78">
                                                Common!
                                            </text>
                                            
                                            <!-- Unique to num2 (right only) -->
                                            ${unique2.length > 0 ? `
                                                <text x="460" y="100" text-anchor="middle" font-size="24" font-weight="bold" fill="#2d3748">
                                                    ${formatFactors(unique2.slice(0, 3))}
                                                </text>
                                                ${unique2.length > 3 ? `<text x="460" y="125" text-anchor="middle" font-size="18" fill="#4a5568">...</text>` : ''}
                                            ` : '<text x="460" y="100" text-anchor="middle" font-size="18" fill="#718096">—</text>'}
                                        </svg>
                                    </div>
                                    
                                    <!-- GCF Calculation -->
                                    <div style="background: #f0fff4; padding: 20px; border-radius: 8px; border: 2px solid #48bb78; margin-top: 25px;">
                                        <div style="font-size: 16px; color: #2f855a; font-weight: bold; margin-bottom: 10px; text-align: center;">
                                            ✅ MULTIPLY THE COMMON FACTORS:
                                        </div>
                                        <div style="font-size: 32px; color: #2d3748; text-align: center; margin: 15px 0;">
                                            ${formatFactors(commonFactors)} = <span style="color: #48bb78; font-weight: bold;">${gcf}</span>
                                        </div>
                                        <div style="text-align: center; color: #2f855a; font-size: 16px; margin-top: 10px;">
                                            The GCF is the product of all common prime factors!
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 20px; padding: 15px; background: #fff5f5; border-radius: 8px; border: 2px dashed #fc8181;">
                                        <div style="font-size: 15px; color: #c53030; font-weight: bold; text-align: center;">
                                            🎯 What is the GCF of ${num1} and ${num2}?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the GCF of ${num1} and ${num2}`,
                    answer: gcf,
                    hint: `Look for the common prime factors of both numbers`,
                    diagram: diagram
                };
            } else {
                // LCM problems
                const pairs = [
                    [4, 6, 12], [6, 8, 24], [3, 5, 15], [4, 5, 20],
                    [6, 9, 18], [8, 12, 24], [5, 10, 10], [3, 7, 21]
                ];
                const pair = pairs[Math.floor(Math.random() * pairs.length)];
                const num1 = pair[0];
                const num2 = pair[1];
                const lcm = pair[2];
                
                // Get prime factorizations
                const factors1 = getPrimeFactors(num1);
                const factors2 = getPrimeFactors(num2);
                
                // For LCM: take max count of each prime factor
                const allPrimes = [...new Set([...factors1, ...factors2])].sort((a, b) => a - b);
                const lcmFactors = [];
                allPrimes.forEach(prime => {
                    const count1 = factors1.filter(f => f === prime).length;
                    const count2 = factors2.filter(f => f === prime).length;
                    const maxCount = Math.max(count1, count2);
                    for (let i = 0; i < maxCount; i++) {
                        lcmFactors.push(prime);
                    }
                });
                
                // Build Venn diagram
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <!-- Collapsible Scaffolding Button -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="lcm-help-btn" onclick="
                                const content = document.getElementById('lcm-scaffolding');
                                const btn = document.getElementById('lcm-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " 
                                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(240,147,251,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <!-- Scaffolding Content (Hidden by Default) -->
                        <div id="lcm-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(240,147,251,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #d53f8c; font-weight: bold; margin-bottom: 15px;">
                                            🔢 LEAST COMMON MULTIPLE (LCM)
                                        </div>
                                        <div style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">
                                            Find the <strong style="color: #d53f8c;">smallest number</strong> that both numbers divide into evenly
                                        </div>
                                    </div>
                                    
                                    <!-- Prime Factorizations -->
                                    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                                        <div style="flex: 1; background: #fef5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #d53f8c;">
                                            <div style="font-size: 28px; font-weight: bold; color: #2d3748; margin-bottom: 10px; text-align: center;">
                                                ${num1}
                                            </div>
                                            <div style="font-size: 18px; color: #4a5568; text-align: center; margin-top: 10px;">
                                                = ${formatFactors(factors1)}
                                            </div>
                                        </div>
                                        
                                        <div style="flex: 1; background: #fff5f0; padding: 20px; border-radius: 8px; border-left: 4px solid #ed8936;">
                                            <div style="font-size: 28px; font-weight: bold; color: #2d3748; margin-bottom: 10px; text-align: center;">
                                                ${num2}
                                            </div>
                                            <div style="font-size: 18px; color: #4a5568; text-align: center; margin-top: 10px;">
                                                = ${formatFactors(factors2)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Visual Representation -->
                                    <div style="background: #f7fafc; padding: 25px; border-radius: 8px; margin: 20px 0;">
                                        <div style="font-size: 16px; color: #2d3748; font-weight: bold; margin-bottom: 15px; text-align: center;">
                                            📊 LCM Strategy: Take the MAXIMUM count of each prime
                                        </div>
                                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                                            ${allPrimes.map(prime => {
                                                const count1 = factors1.filter(f => f === prime).length;
                                                const count2 = factors2.filter(f => f === prime).length;
                                                const maxCount = Math.max(count1, count2);
                                                return `
                                                    <div style="background: white; padding: 15px 20px; border-radius: 8px; border: 2px solid #cbd5e0; min-width: 120px;">
                                                        <div style="font-size: 28px; font-weight: bold; color: #2d3748; text-align: center;">
                                                            ${prime}
                                                        </div>
                                                        <div style="font-size: 14px; color: #718096; text-align: center; margin-top: 8px;">
                                                            ${num1}: ${count1}x | ${num2}: ${count2}x
                                                        </div>
                                                        <div style="font-size: 16px; color: #d53f8c; font-weight: bold; text-align: center; margin-top: 8px;">
                                                            Use: ${maxCount}x
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                    
                                    <!-- LCM Calculation -->
                                    <div style="background: #fff5f0; padding: 20px; border-radius: 8px; border: 2px solid #ed8936; margin-top: 25px;">
                                        <div style="font-size: 16px; color: #c05621; font-weight: bold; margin-bottom: 10px; text-align: center;">
                                            ✅ MULTIPLY ALL FACTORS (taking max of each):
                                        </div>
                                        <div style="font-size: 32px; color: #2d3748; text-align: center; margin: 15px 0;">
                                            ${formatFactors(lcmFactors)} = <span style="color: #ed8936; font-weight: bold;">${lcm}</span>
                                        </div>
                                        <div style="text-align: center; color: #c05621; font-size: 16px; margin-top: 10px;">
                                            The LCM includes each prime factor the maximum number of times it appears!
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 20px; padding: 15px; background: #fff5f5; border-radius: 8px; border: 2px dashed #fc8181;">
                                        <div style="font-size: 15px; color: #c53030; font-weight: bold; text-align: center;">
                                            🎯 What is the LCM of ${num1} and ${num2}?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the LCM of ${num1} and ${num2}`,
                    answer: lcm,
                    hint: `Find the smallest number that both ${num1} and ${num2} divide into evenly`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 4: ALGEBRAIC EXPRESSIONS
    'algebraic-expressions': {
        id: 'algebraic-expressions',
        name: 'Algebraic Expressions',
        description: 'Evaluate and simplify expressions with variables',
        difficulty: 3,
        stars: '⭐⭐⭐',
        reward: 35,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        generate: function() {
            const types = ['evaluate', 'simplify'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'evaluate') {
                // Evaluate: 3x + 7 when x = 4
                const coef = Math.floor(Math.random() * 6) + 2; // 2-7
                const constant = Math.floor(Math.random() * 8) + 1; // 1-8
                const xValue = Math.floor(Math.random() * 6) + 2; // 2-7
                const answer = coef * xValue + constant;
                return {
                    problem: `Evaluate: ${coef}x + ${constant} when x = ${xValue}`,
                    answer: answer,
                    hint: `Substitute ${xValue} for x, then calculate`
                };
            } else {
                // Simplify: 5a + 3 + 2a - 1
                const coef1 = Math.floor(Math.random() * 5) + 3; // 3-7
                const coef2 = Math.floor(Math.random() * 4) + 2; // 2-5
                const const1 = Math.floor(Math.random() * 5) + 2; // 2-6
                const const2 = Math.floor(Math.random() * 4) + 1; // 1-4
                const answer = coef1 + coef2; // Combined coefficient
                return {
                    problem: `Simplify: ${coef1}a + ${const1} + ${coef2}a - ${const2} (What's the coefficient of a?)`,
                    answer: answer,
                    hint: `Combine like terms: ${coef1}a + ${coef2}a`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 19: EQUIVALENT EXPRESSIONS
    'equivalent-expressions': {
        id: 'equivalent-expressions',
        name: 'Equivalent Expressions',
        description: 'Expand and factor using distributive property',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 50,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        generate: function() {
            const types = ['expand', 'factor'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'expand') {
                // Expand: 4(x + 3) = ?x + ?
                const outside = Math.floor(Math.random() * 5) + 2; // 2-6
                const inside = Math.floor(Math.random() * 7) + 2; // 2-8
                const answer = outside * inside; // Constant term
                return {
                    problem: `Expand: ${outside}(x + ${inside}). What's the constant term?`,
                    answer: answer,
                    hint: `Multiply ${outside} by both x and ${inside}`
                };
            } else {
                // Factor: 6x + 12 = ?(x + ?)
                const gcf = Math.floor(Math.random() * 4) + 2; // 2-5
                const term = Math.floor(Math.random() * 5) + 2; // 2-6
                const constant = gcf * term;
                return {
                    problem: `Factor out the GCF from: ${gcf}x + ${constant}. What's the GCF?`,
                    answer: gcf,
                    hint: `What number divides both ${gcf} and ${constant}?`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 3: SURFACE AREA FROM NETS
    // LESSON 10: SURFACE AREA FROM NETS (v64 - ENHANCED WITH SCAFFOLDING)
    'surface-area': {
        id: 'surface-area',
        name: 'Surface Area from Nets',
        description: 'Calculate surface area using 2D net diagrams',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 50,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        // Future: scaffoldingEnabled will be controlled by teacher/parent settings
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['rectangular-prism', 'cube', 'triangular-prism', 'square-pyramid', 'cylinder'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'cube') {
                const edge = Math.floor(Math.random() * 6) + 3; // 3-8
                const answer = 6 * edge * edge; // 6 faces
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        
                        <!-- COLLAPSIBLE BUTTON -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="surface-area-help-btn" onclick="
                                const content = document.getElementById('surface-area-scaffolding');
                                const btn = document.getElementById('surface-area-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <!-- HIDDEN SCAFFOLDING CONTENT -->
                        <div id="surface-area-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    
                                    <!-- TITLE -->
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📦 CUBE NET DIAGRAM - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <!-- CUBE NET SVG (CROSS PATTERN) - GENERIC EXAMPLE -->
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="0 0 400 500" style="width: 100%; max-width: 400px; height: auto; margin: 0 auto; display: block;">
                                            <defs>
                                                <pattern id="cubeGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
                                                </pattern>
                                            </defs>
                                            
                                            <!-- CROSS PATTERN: TOP -->
                                            <rect x="150" y="25" width="100" height="100" fill="url(#cubeGrid)" stroke="#667eea" stroke-width="3"/>
                                            <text x="200" y="80" text-anchor="middle" font-size="16" fill="#667eea" font-weight="bold">Top</text>
                                            <text x="200" y="100" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                            
                                            <!-- LEFT -->
                                            <rect x="50" y="125" width="100" height="100" fill="url(#cubeGrid)" stroke="#48bb78" stroke-width="3"/>
                                            <text x="100" y="170" text-anchor="middle" font-size="16" fill="#48bb78" font-weight="bold">Left</text>
                                            <text x="100" y="190" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                            
                                            <!-- FRONT (CENTER) -->
                                            <rect x="150" y="125" width="100" height="100" fill="url(#cubeGrid)" stroke="#e53e3e" stroke-width="3"/>
                                            <text x="200" y="170" text-anchor="middle" font-size="16" fill="#e53e3e" font-weight="bold">Front</text>
                                            <text x="200" y="190" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                            
                                            <!-- RIGHT -->
                                            <rect x="250" y="125" width="100" height="100" fill="url(#cubeGrid)" stroke="#f59e0b" stroke-width="3"/>
                                            <text x="300" y="170" text-anchor="middle" font-size="16" fill="#f59e0b" font-weight="bold">Right</text>
                                            <text x="300" y="190" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                            
                                            <!-- BOTTOM -->
                                            <rect x="150" y="225" width="100" height="100" fill="url(#cubeGrid)" stroke="#8b5cf6" stroke-width="3"/>
                                            <text x="200" y="270" text-anchor="middle" font-size="16" fill="#8b5cf6" font-weight="bold">Bottom</text>
                                            <text x="200" y="290" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                            
                                            <!-- BACK -->
                                            <rect x="150" y="325" width="100" height="100" fill="url(#cubeGrid)" stroke="#ec4899" stroke-width="3"/>
                                            <text x="200" y="370" text-anchor="middle" font-size="16" fill="#ec4899" font-weight="bold">Back</text>
                                            <text x="200" y="390" text-anchor="middle" font-size="14" fill="#2d3748">s × s</text>
                                        </svg>
                                    </div>
                                    
                                    <!-- EXPLANATION -->
                                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📐 CUBE SURFACE AREA</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">
                                            A cube has <strong>6 equal square faces</strong><br>
                                            Each face area = edge × edge = s²<br>
                                            Total surface area = 6 × s²
                                        </div>
                                    </div>
                                    
                                    <!-- STEP-BY-STEP WITH EXAMPLE -->
                                    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #f59e0b;">📝 EXAMPLE (edge = 4 cm):</strong>
                                        </div>
                                        <div style="font-size: 16px; color: #2d3748; line-height: 2;">
                                            <strong>1. Find one face area:</strong> 4 × 4 = 16 cm²<br>
                                            <strong>2. Count all faces:</strong> 6 faces total<br>
                                            <strong>3. Multiply:</strong> 6 × 16 = <strong style="color: #e53e3e;">96 cm²</strong>
                                        </div>
                                    </div>
                                    
                                    <!-- PRO TIP -->
                                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #10b981;">
                                        <div style="font-size: 14px; color: #4a5568;">
                                            <strong style="color: #10b981;">💡 Formula:</strong> SA = 6s² (where s = edge length)
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `A cube has edge length ${edge} cm. Find the surface area.`,
                    answer: answer,
                    hint: `A cube has 6 equal square faces. Formula: SA = 6s²`,
                    diagram: diagram
                };
                
            } else if (type === 'rectangular-prism') {
                // Rectangular prism
                const length = Math.floor(Math.random() * 6) + 4; // 4-9
                const width = Math.floor(Math.random() * 5) + 2; // 2-6
                const height = Math.floor(Math.random() * 5) + 3; // 3-7
                const answer = 2 * (length*width + length*height + width*height);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="surface-area-help-btn" onclick="
                                const content = document.getElementById('surface-area-scaffolding');
                                const btn = document.getElementById('surface-area-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="surface-area-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📦 RECTANGULAR PRISM NET - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 10px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <!-- RECTANGULAR PRISM NET (T-SHAPE) - GENERIC -->
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="0 0 500 400" style="width: 100%; max-width: 600px; height: auto; margin: 0 auto; display: block;">
                                            <defs>
                                                <pattern id="rectGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
                                                </pattern>
                                            </defs>
                                            
                                            <!-- TOP (l × w) -->
                                            <rect x="200" y="20" width="100" height="60" 
                                                  fill="url(#rectGrid)" stroke="#667eea" stroke-width="3"/>
                                            <text x="250" y="45" text-anchor="middle" font-size="14" fill="#667eea" font-weight="bold">Top</text>
                                            <text x="250" y="65" text-anchor="middle" font-size="12" fill="#2d3748">l × w</text>
                                            
                                            <!-- LEFT SIDE (w × h) -->
                                            <rect x="140" y="80" width="60" height="80" 
                                                  fill="url(#rectGrid)" stroke="#48bb78" stroke-width="3"/>
                                            <text x="170" y="115" text-anchor="middle" font-size="14" fill="#48bb78" font-weight="bold">Left</text>
                                            <text x="170" y="135" text-anchor="middle" font-size="12" fill="#2d3748">w × h</text>
                                            
                                            <!-- FRONT (l × h) -->
                                            <rect x="200" y="80" width="100" height="80" 
                                                  fill="url(#rectGrid)" stroke="#e53e3e" stroke-width="3"/>
                                            <text x="250" y="115" text-anchor="middle" font-size="14" fill="#e53e3e" font-weight="bold">Front</text>
                                            <text x="250" y="135" text-anchor="middle" font-size="12" fill="#2d3748">l × h</text>
                                            
                                            <!-- RIGHT SIDE (w × h) -->
                                            <rect x="300" y="80" width="60" height="80" 
                                                  fill="url(#rectGrid)" stroke="#f59e0b" stroke-width="3"/>
                                            <text x="330" y="115" text-anchor="middle" font-size="14" fill="#f59e0b" font-weight="bold">Right</text>
                                            <text x="330" y="135" text-anchor="middle" font-size="12" fill="#2d3748">w × h</text>
                                            
                                            <!-- BOTTOM (l × w) -->
                                            <rect x="200" y="160" width="100" height="60" 
                                                  fill="url(#rectGrid)" stroke="#8b5cf6" stroke-width="3"/>
                                            <text x="250" y="185" text-anchor="middle" font-size="14" fill="#8b5cf6" font-weight="bold">Bottom</text>
                                            <text x="250" y="205" text-anchor="middle" font-size="12" fill="#2d3748">l × w</text>
                                        </svg>
                                    </div>
                                    
                                    <!-- FACE BREAKDOWN -->
                                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📐 SIX FACES (3 PAIRS):</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568; line-height: 2;">
                                            <strong style="color: #667eea;">Top & Bottom:</strong> 2 × (length × width)<br>
                                            <strong style="color: #e53e3e;">Front & Back:</strong> 2 × (length × height)<br>
                                            <strong style="color: #48bb78;">Left & Right:</strong> 2 × (width × height)
                                        </div>
                                    </div>
                                    
                                    <!-- CALCULATION EXAMPLE -->
                                    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #f59e0b;">📝 EXAMPLE (L=6, W=4, H=5):</strong>
                                        </div>
                                        <div style="font-size: 16px; color: #2d3748; line-height: 2;">
                                            <strong>Top/Bottom:</strong> 2 × (6 × 4) = 2 × 24 = 48 cm²<br>
                                            <strong>Front/Back:</strong> 2 × (6 × 5) = 2 × 30 = 60 cm²<br>
                                            <strong>Left/Right:</strong> 2 × (4 × 5) = 2 × 20 = 40 cm²<br>
                                            <strong>Total:</strong> 48 + 60 + 40 = <strong style="color: #e53e3e;">148 cm²</strong>
                                        </div>
                                    </div>
                                    
                                    <!-- PRO TIP -->
                                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #10b981;">
                                        <div style="font-size: 14px; color: #4a5568;">
                                            <strong style="color: #10b981;">💡 Formula:</strong> SA = 2(lw + lh + wh) — Add all 6 faces!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Rectangular prism: length ${length} cm, width ${width} cm, height ${height} cm. Surface area?`,
                    answer: answer,
                    hint: `Find all 6 faces: 2(lw) + 2(lh) + 2(wh)`,
                    diagram: diagram
                };
            } else if (type === 'triangular-prism') {
                // Triangular prism: 2 triangular faces + 3 rectangular faces
                const base = Math.floor(Math.random() * 5) + 4; // 4-8
                const height = Math.floor(Math.random() * 4) + 3; // 3-6
                const length = Math.floor(Math.random() * 6) + 5; // 5-10
                
                const triangleArea = (base * height) / 2;
                const rect1 = base * length;
                const rect2 = height * length;
                const rect3 = Math.sqrt(base*base + height*height) * length; // slant side
                const answer = Math.round(2 * triangleArea + rect1 + rect2 + rect3);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="surface-area-help-btn" onclick="
                                const content = document.getElementById('surface-area-scaffolding');
                                const btn = document.getElementById('surface-area-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="surface-area-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🔺 TRIANGULAR PRISM NET - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <svg viewBox="0 0 600 350" style="max-width: 600px; display: block; margin: 0 auto 20px;">
                                        <!-- Three rectangles (sides unfolded) -->
                                        <rect x="50" y="100" width="150" height="80" fill="#93c5fd" stroke="#1e40af" stroke-width="2"/>
                                        <text x="125" y="145" text-anchor="middle" font-size="14" fill="#1e3a8a">Side 1: b × L</text>
                                        
                                        <rect x="50" y="180" width="150" height="80" fill="#86efac" stroke="#15803d" stroke-width="2"/>
                                        <text x="125" y="225" text-anchor="middle" font-size="14" fill="#14532d">Side 2: h × L</text>
                                        
                                        <rect x="50" y="260" width="150" height="80" fill="#fca5a5" stroke="#b91c1c" stroke-width="2"/>
                                        <text x="125" y="305" text-anchor="middle" font-size="14" fill="#7f1d1d">Side 3: s × L</text>
                                        
                                        <!-- Two triangular ends -->
                                        <polygon points="300,100 375,180 225,180" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                                        <text x="300" y="165" text-anchor="middle" font-size="14" fill="#713f12">Triangle</text>
                                        <text x="300" y="180" text-anchor="middle" font-size="12" fill="#713f12">½bh</text>
                                        
                                        <polygon points="450,100 525,180 375,180" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                                        <text x="450" y="165" text-anchor="middle" font-size="14" fill="#713f12">Triangle</text>
                                        <text x="450" y="180" text-anchor="middle" font-size="12" fill="#713f12">½bh</text>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Formula:</strong> SA = 2(½bh) + (b × L) + (h × L) + (s × L)
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (base=6, height=4, length=8):</strong><br>
                                            1. Two triangular ends: 2 × (½ × 6 × 4) = 2 × 12 = 24 cm²<br>
                                            2. Bottom rectangle: 6 × 8 = 48 cm²<br>
                                            3. Back rectangle: 4 × 8 = 32 cm²<br>
                                            4. Slant rectangle: √(6²+4²) × 8 ≈ 7.2 × 8 ≈ 58 cm²<br>
                                            5. Total: 24 + 48 + 32 + 58 = <strong>162 cm²</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Triangular prism: base ${base} cm, height ${height} cm, length ${length} cm. Surface area? (round to nearest whole number)`,
                    answer: answer,
                    hint: `2 triangular ends + 3 rectangular sides`,
                    diagram: diagram
                };
            } else if (type === 'square-pyramid') {
                // Square pyramid: 1 square base + 4 triangular faces
                const base = Math.floor(Math.random() * 6) + 4; // 4-9
                const slantHeight = Math.floor(Math.random() * 5) + 6; // 6-10
                
                const baseArea = base * base;
                const triangleArea = (base * slantHeight) / 2;
                const answer = baseArea + (4 * triangleArea);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="surface-area-help-btn" onclick="
                                const content = document.getElementById('surface-area-scaffolding');
                                const btn = document.getElementById('surface-area-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="surface-area-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🔺 SQUARE PYRAMID NET - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <svg viewBox="0 0 500 500" style="max-width: 500px; display: block; margin: 0 auto 20px;">
                                        <!-- Square base (center) -->
                                        <rect x="175" y="175" width="150" height="150" fill="#93c5fd" stroke="#1e40af" stroke-width="3"/>
                                        <text x="250" y="255" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Base</text>
                                        <text x="250" y="275" text-anchor="middle" font-size="14" fill="#1e3a8a">s × s</text>
                                        
                                        <!-- Top triangle -->
                                        <polygon points="250,25 175,175 325,175" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                                        <text x="250" y="130" text-anchor="middle" font-size="14" fill="#713f12">½ × s × h</text>
                                        
                                        <!-- Bottom triangle -->
                                        <polygon points="250,475 175,325 325,325" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                                        <text x="250" y="380" text-anchor="middle" font-size="14" fill="#713f12">½ × s × h</text>
                                        
                                        <!-- Left triangle -->
                                        <polygon points="25,250 175,175 175,325" fill="#86efac" stroke="#15803d" stroke-width="2"/>
                                        <text x="110" y="255" text-anchor="middle" font-size="14" fill="#14532d">½sh</text>
                                        
                                        <!-- Right triangle -->
                                        <polygon points="475,250 325,175 325,325" fill="#86efac" stroke="#15803d" stroke-width="2"/>
                                        <text x="390" y="255" text-anchor="middle" font-size="14" fill="#14532d">½sh</text>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Formula:</strong> SA = s² + 4(½sh) = s² + 2sh
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (base=5, slant height=7):</strong><br>
                                            1. Square base: 5 × 5 = 25 cm²<br>
                                            2. One triangle: ½ × 5 × 7 = 17.5 cm²<br>
                                            3. Four triangles: 4 × 17.5 = 70 cm²<br>
                                            4. Total: 25 + 70 = <strong>95 cm²</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Square pyramid: base ${base} cm, slant height ${slantHeight} cm. Surface area?`,
                    answer: answer,
                    hint: `1 square base + 4 triangular sides`,
                    diagram: diagram
                };
            } else if (type === 'cylinder') {
                // Cylinder: 2 circular ends + 1 rectangular wrap
                const radius = Math.floor(Math.random() * 4) + 3; // 3-6
                const height = Math.floor(Math.random() * 6) + 5; // 5-10
                
                const circleArea = Math.PI * radius * radius;
                const rectangleArea = 2 * Math.PI * radius * height;
                const answer = Math.round(2 * circleArea + rectangleArea);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="surface-area-help-btn" onclick="
                                const content = document.getElementById('surface-area-scaffolding');
                                const btn = document.getElementById('surface-area-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="surface-area-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🥫 CYLINDER NET - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <svg viewBox="0 0 600 350" style="max-width: 600px; display: block; margin: 0 auto 20px;">
                                        <!-- Top circle -->
                                        <circle cx="150" cy="80" r="60" fill="#93c5fd" stroke="#1e40af" stroke-width="2"/>
                                        <text x="150" y="85" text-anchor="middle" font-size="14" fill="#1e3a8a">Circle</text>
                                        <text x="150" y="100" text-anchor="middle" font-size="12" fill="#1e3a8a">πr²</text>
                                        
                                        <!-- Rectangle (unrolled side) -->
                                        <rect x="75" y="170" width="250" height="100" fill="#86efac" stroke="#15803d" stroke-width="2"/>
                                        <text x="200" y="215" text-anchor="middle" font-size="14" fill="#14532d">Rectangle: 2πr × h</text>
                                        <text x="200" y="235" text-anchor="middle" font-size="12" fill="#14532d">(circumference × height)</text>
                                        
                                        <!-- Bottom circle -->
                                        <circle cx="450" cy="80" r="60" fill="#93c5fd" stroke="#1e40af" stroke-width="2"/>
                                        <text x="450" y="85" text-anchor="middle" font-size="14" fill="#1e3a8a">Circle</text>
                                        <text x="450" y="100" text-anchor="middle" font-size="12" fill="#1e3a8a">πr²</text>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Formula:</strong> SA = 2πr² + 2πrh = 2πr(r + h)
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (radius=4, height=7):</strong><br>
                                            1. Two circular ends: 2 × π × 4² = 2 × 16π ≈ 100 cm²<br>
                                            2. Rectangular wrap: 2π × 4 × 7 = 56π ≈ 176 cm²<br>
                                            3. Total: 100 + 176 = <strong>276 cm²</strong><br>
                                            <em>Note: Use π ≈ 3.14 and round to nearest whole number</em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Cylinder: radius ${radius} cm, height ${height} cm. Surface area? (use π ≈ 3.14, round to nearest whole number)`,
                    answer: answer,
                    hint: `2 circular ends + 1 rectangular wrap: 2πr² + 2πrh`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 11: VOLUME WITH FRACTIONS (v68 - ENHANCED WITH SCAFFOLDING)
    'volume-fractions': {
        id: 'volume-fractions',
        name: 'Volume with Fractions',
        description: 'Calculate volume with fractional dimensions',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 60,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['whole-numbers', 'decimals', 'missing-dimension'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'whole-numbers') {
                // Easy: V = l × w × h with whole numbers
                const length = Math.floor(Math.random() * 5) + 3; // 3-7
                const width = Math.floor(Math.random() * 4) + 2; // 2-5
                const height = Math.floor(Math.random() * 4) + 3; // 3-6
                const answer = length * width * height;
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="volume-help-btn" onclick="
                                const content = document.getElementById('volume-scaffolding');
                                const btn = document.getElementById('volume-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="volume-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📦 VOLUME OF RECTANGULAR PRISM - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <!-- 3D ISOMETRIC BOX -->
                                    <svg viewBox="0 0 400 280" style="max-width: 850px; display: block; margin: 0 auto 20px;">
                                        <defs>
                                            <marker id="arrowhead-volume" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                                                <polygon points="0,0 10,5 0,10" fill="#dc2626"/>
                                            </marker>
                                        </defs>
                                        
                                        <!-- Top face (lightest) -->
                                        <polygon points="100,80 150,40 300,40 250,80" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Right face (depth) -->
                                        <polygon points="250,80 300,40 300,200 250,240" fill="#60a5fa" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Front face (main) -->
                                        <polygon points="100,80 100,240 250,240 250,80" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Dimension Labels -->
                                        <text x="225" y="30" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Length (l)</text>
                                        <text x="210" y="265" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Width (w)</text>
                                        <text x="70" y="160" text-anchor="end" font-size="16" fill="#1e3a8a" font-weight="bold">Height (h)</text>
                                        
                                        <!-- Arrow indicators -->
                                        <!-- Length: horizontal on top face (X-axis) -->
                                        <line x1="150" y1="35" x2="290" y2="35" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Width: diagonal showing DEPTH (Z-axis going back) -->
                                        <line x1="125" y1="255" x2="275" y2="255" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Height: vertical on left edge (Y-axis) -->
                                        <line x1="95" y1="90" x2="95" y2="230" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Formula:</strong> V = length × width × height = l × w × h
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (L=5, W=3, H=4):</strong><br>
                                            1. Write the formula: V = l × w × h<br>
                                            2. Substitute values: V = 5 × 3 × 4<br>
                                            3. Multiply first two: 5 × 3 = 15<br>
                                            4. Multiply by height: 15 × 4 = <strong>60 cm³</strong><br><br>
                                            <strong>💡 Pro Tip:</strong> Order doesn't matter! 5×3×4 = 3×4×5 = 4×5×3
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Rectangular prism: length ${length} cm, width ${width} cm, height ${height} cm. Volume?`,
                    answer: answer,
                    hint: `V = length × width × height`,
                    diagram: diagram
                };
                
            } else if (type === 'decimals') {
                // Medium: one decimal dimension
                const length = (Math.floor(Math.random() * 4) + 2) + 0.5; // 2.5-5.5
                const width = Math.floor(Math.random() * 4) + 2; // 2-5
                const height = Math.floor(Math.random() * 4) + 3; // 3-6
                const answer = length * width * height;
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="volume-help-btn" onclick="
                                const content = document.getElementById('volume-scaffolding');
                                const btn = document.getElementById('volume-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="volume-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📦 VOLUME WITH DECIMALS - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <!-- 3D ISOMETRIC BOX -->
                                    <svg viewBox="0 0 400 280" style="max-width: 850px; display: block; margin: 0 auto 20px;">
                                        <defs>
                                            <marker id="arrowhead-volume" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                                                <polygon points="0,0 10,5 0,10" fill="#dc2626"/>
                                            </marker>
                                        </defs>
                                        
                                        <!-- Top face (lightest) -->
                                        <polygon points="100,80 150,40 300,40 250,80" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Right face (depth) -->
                                        <polygon points="250,80 300,40 300,200 250,240" fill="#60a5fa" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Front face (main) -->
                                        <polygon points="100,80 100,240 250,240 250,80" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Dimension Labels -->
                                        <text x="225" y="30" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Length (l)</text>
                                        <text x="210" y="265" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Width (w)</text>
                                        <text x="70" y="160" text-anchor="end" font-size="16" fill="#1e3a8a" font-weight="bold">Height (h)</text>
                                        
                                        <!-- Arrow indicators -->
                                        <!-- Length: horizontal on top face (X-axis) -->
                                        <line x1="150" y1="35" x2="290" y2="35" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Width: diagonal showing DEPTH (Z-axis going back) -->
                                        <line x1="125" y1="255" x2="275" y2="255" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Height: vertical on left edge (Y-axis) -->
                                        <line x1="95" y1="90" x2="95" y2="230" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Formula:</strong> V = l × w × h (works with decimals too!)
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (L=4.5, W=3, H=2):</strong><br>
                                            1. V = 4.5 × 3 × 2<br>
                                            2. First: 4.5 × 3 = 13.5<br>
                                            3. Then: 13.5 × 2 = <strong>27 cm³</strong><br><br>
                                            <strong>💡 Decimal Tips:</strong><br>
                                            • Line up decimals carefully when multiplying<br>
                                            • 4.5 × 3 = (45 × 3) ÷ 10 = 135 ÷ 10 = 13.5<br>
                                            • Or: 4.5 = 4½, so 4.5 × 3 = (4 × 3) + (0.5 × 3) = 12 + 1.5 = 13.5
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Rectangular prism: length ${length} cm, width ${width} cm, height ${height} cm. Volume?`,
                    answer: answer,
                    hint: `Multiply all three dimensions (decimals work the same way!)`,
                    diagram: diagram
                };
                
            } else {
                // Challenge: find missing dimension
                const length = Math.floor(Math.random() * 5) + 3; // 3-7
                const width = Math.floor(Math.random() * 4) + 2; // 2-5
                const height = Math.floor(Math.random() * 4) + 3; // 3-6
                const volume = length * width * height;
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="volume-help-btn" onclick="
                                const content = document.getElementById('volume-scaffolding');
                                const btn = document.getElementById('volume-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="volume-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🔍 FIND MISSING DIMENSION - HOW TO SOLVE
                                        </div>
                                        <div style="font-size: 16px; color: #e53e3e; margin: 15px 0;">
                                            This shows the METHOD - use YOUR numbers!
                                        </div>
                                    </div>
                                    
                                    <!-- 3D ISOMETRIC BOX -->
                                    <svg viewBox="0 0 400 280" style="max-width: 850px; display: block; margin: 0 auto 20px;">
                                        <defs>
                                            <marker id="arrowhead-volume" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                                                <polygon points="0,0 10,5 0,10" fill="#dc2626"/>
                                            </marker>
                                        </defs>
                                        
                                        <!-- Top face (lightest) -->
                                        <polygon points="100,80 150,40 300,40 250,80" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Right face (depth) -->
                                        <polygon points="250,80 300,40 300,200 250,240" fill="#60a5fa" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Front face (main) -->
                                        <polygon points="100,80 100,240 250,240 250,80" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
                                        
                                        <!-- Dimension Labels -->
                                        <text x="225" y="30" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Length (l)</text>
                                        <text x="210" y="265" text-anchor="middle" font-size="16" fill="#1e3a8a" font-weight="bold">Width (w)</text>
                                        <text x="70" y="160" text-anchor="end" font-size="16" fill="#1e3a8a" font-weight="bold">Height (h)</text>
                                        
                                        <!-- Arrow indicators -->
                                        <!-- Length: horizontal on top face (X-axis) -->
                                        <line x1="150" y1="35" x2="290" y2="35" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Width: diagonal showing DEPTH (Z-axis going back) -->
                                        <line x1="125" y1="255" x2="275" y2="255" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                        
                                        <!-- Height: vertical on left edge (Y-axis) -->
                                        <line x1="95" y1="90" x2="95" y2="230" stroke="#dc2626" stroke-width="2" marker-end="url(#arrowhead-volume)"/>
                                    </svg>
                                    
                                    <div style="margin-top: 25px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 15px; color: #1e3a8a; margin-bottom: 15px;">
                                            <strong>Strategy:</strong> Divide volume by the two known dimensions
                                        </div>
                                        <div style="font-size: 14px; color: #334155; line-height: 1.8;">
                                            <strong>EXAMPLE (V=60, L=5, W=3, find H):</strong><br>
                                            1. Start with formula: V = l × w × h<br>
                                            2. Substitute known values: 60 = 5 × 3 × h<br>
                                            3. Multiply known dimensions: 5 × 3 = 15<br>
                                            4. So: 60 = 15 × h<br>
                                            5. Solve: h = 60 ÷ 15 = <strong>4 cm</strong><br><br>
                                            <strong>💡 Quick Method:</strong> h = V ÷ (l × w) = 60 ÷ 15 = 4
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Volume = ${volume} cm³, length = ${length} cm, width = ${width} cm. Find the height.`,
                    answer: height,
                    hint: `Divide: Volume ÷ (length × width) = height`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseFloat(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 22: VARIABLE RELATIONSHIPS
    // LESSON 22: VARIABLE RELATIONSHIPS (v76 - ENHANCED WITH SCAFFOLDING)
    'variable-relationships': {
        id: 'variable-relationships',
        name: 'Variable Relationships',
        description: 'Complete function tables and identify patterns',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 60,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        // Future: scaffoldingEnabled will be controlled by teacher/parent settings
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['linear', 'find-output', 'find-rule'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Build scaffolding diagram (shown for all types) - ULTRA COMPACT
            const scaffoldingHTML = `
                <div style="max-width: 850px; margin: 10px auto; font-family: 'Georgia', serif;">
                    
                    <!-- COLLAPSIBLE BUTTON -->
                    <div style="text-align: center; margin-bottom: 8px;">
                        <button id="variables-help-btn" onclick="toggleScaffolding('variables-scaffolding', 'variables-help-btn')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 3px 6px rgba(102,126,234,0.3); transition: all 0.3s;">
                            🔽 Show Visual Help
                        </button>
                    </div>
                    
                    <!-- HIDDEN SCAFFOLDING CONTENT -->
                    <div id="variables-scaffolding" style="display: none;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 10px; border-radius: 10px; box-shadow: 0 4px 8px rgba(102,126,234,0.3); margin-top: 8px;">
                            <div style="background: white; padding: 12px; border-radius: 6px;">
                                
                                <!-- TITLE & WARNING - INLINE -->
                                <div style="text-align: center; margin-bottom: 10px;">
                                    <span style="font-size: 15px; color: #667eea; font-weight: bold;">🔄 Function Tables Quick Guide</span>
                                    <span style="font-size: 12px; color: #e53e3e; margin-left: 15px;">⚠️ Use YOUR numbers!</span>
                                </div>
                                
                                <!-- SINGLE ROW: TABLE + STEPS + PATTERN SIDE BY SIDE -->
                                <div style="display: grid; grid-template-columns: 200px 250px 250px; gap: 10px; margin-bottom: 10px;">
                                    
                                    <!-- TINY TABLE -->
                                    <div style="background: #f0f9ff; padding: 4px; border-radius: 6px; border: 2px solid #3b82f6;">
                                        <div style="font-size: 11px; font-weight: bold; color: #1e40af; margin-bottom: 2px; text-align: center; line-height: 1;">y = 3x - 1</div>
                                        <div style="line-height: 1;">
                                            <table style="width: 100%; border-collapse: collapse; font-size: 11px; line-height: 1;">
                                                <tr style="height: 16px;">
                                                    <th style="background: #3b82f6; color: white; padding: 1px 3px; border: 1px solid #2563eb; line-height: 1;">x</th>
                                                    <th style="background: #10b981; color: white; padding: 1px 3px; border: 1px solid #059669; line-height: 1;">y</th>
                                                </tr>
                                                <tr style="height: 16px;">
                                                    <td style="background: #dbeafe; padding: 1px 3px; border: 1px solid #3b82f6; text-align: center; font-weight: bold; line-height: 1;">1</td>
                                                    <td style="background: #d1fae5; padding: 1px 3px; border: 1px solid #10b981; text-align: center; font-weight: bold; line-height: 1;">2</td>
                                                </tr>
                                                <tr style="height: 16px;">
                                                    <td style="background: #dbeafe; padding: 1px 3px; border: 1px solid #3b82f6; text-align: center; font-weight: bold; line-height: 1;">2</td>
                                                    <td style="background: #d1fae5; padding: 1px 3px; border: 1px solid #10b981; text-align: center; font-weight: bold; line-height: 1;">5</td>
                                                </tr>
                                                <tr style="height: 16px;">
                                                    <td style="background: #dbeafe; padding: 1px 3px; border: 1px solid #3b82f6; text-align: center; font-weight: bold; line-height: 1;">3</td>
                                                    <td style="background: #d1fae5; padding: 1px 3px; border: 1px solid #10b981; text-align: center; font-weight: bold; line-height: 1;">8</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    <!-- STEPS - INLINE -->
                                    <div style="background: #fef3c7; padding: 8px; border-radius: 6px; border: 2px solid #f59e0b;">
                                        <div style="font-size: 13px; font-weight: bold; color: #92400e; margin-bottom: 4px;">🔍 Substitute:</div>
                                        <div style="font-size: 12px; color: #78350f; line-height: 1.4;">
                                            <strong>x=1:</strong> y=3(1)-1=2 ✓<br>
                                            <strong>x=2:</strong> y=3(2)-1=5 ✓<br>
                                            <strong>x=3:</strong> y=3(3)-1=8 ✓
                                        </div>
                                    </div>
                                    
                                    <!-- PATTERN - INLINE -->
                                    <div style="background: #f3e8ff; padding: 8px; border-radius: 6px; border: 2px solid #9333ea;">
                                        <div style="font-size: 13px; font-weight: bold; color: #6b21a8; margin-bottom: 4px;">🎯 Pattern:</div>
                                        <div style="font-size: 12px; color: #6b21a8; line-height: 1.4;">
                                            y=2, 5, 8... <strong style="color: #dc2626;">(+3 each)</strong><br>
                                            ✅ Rule = <strong>3x</strong>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <!-- BOTTOM ROW: VARIABLES + TIPS INLINE -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    
                                    <div style="background: #e0f2fe; padding: 8px; border-radius: 6px; border: 2px solid #3b82f6;">
                                        <div style="font-size: 13px; font-weight: bold; color: #1e40af; margin-bottom: 4px;">📊 Variables:</div>
                                        <div style="font-size: 12px; color: #1e40af; line-height: 1.4;">
                                            <strong style="color: #3b82f6;">x</strong> = Input (you choose) | <strong style="color: #10b981;">y</strong> = Output (depends on x)
                                        </div>
                                    </div>
                                    
                                    <div style="background: #dcfce7; padding: 8px; border-radius: 6px; border: 2px solid #10b981;">
                                        <div style="font-size: 13px; font-weight: bold; color: #065f46; margin-bottom: 4px;">💡 Tips:</div>
                                        <div style="font-size: 12px; color: #065f46; line-height: 1.4;">
                                            Substitute x → Multiply first → Add/subtract → Find pattern
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            if (type === 'linear') {
                // y = mx + b, find y
                const m = Math.floor(Math.random() * 5) + 2; // 2-6
                const b = Math.floor(Math.random() * 6) + 1; // 1-6
                const x = Math.floor(Math.random() * 5) + 2; // 2-6
                const answer = m * x + b;
                return {
                    problem: scaffoldingHTML + `<div style="font-size: 18px; margin-top: 20px; text-align: center;">If <strong style="color: #667eea;">y = ${m}x + ${b}</strong>, find <strong style="color: #10b981;">y</strong> when <strong style="color: #3b82f6;">x = ${x}</strong></div>`,
                    answer: answer,
                    hint: `Substitute ${x} for x: y = ${m}(${x}) + ${b}`
                };
            } else if (type === 'find-output') {
                // Simple doubling or tripling
                const mult = Math.floor(Math.random() * 3) + 2; // 2-4
                const x = Math.floor(Math.random() * 6) + 3; // 3-8
                const answer = mult * x;
                return {
                    problem: scaffoldingHTML + `<div style="font-size: 18px; margin-top: 20px; text-align: center;">Rule: <strong style="color: #667eea;">y = ${mult}x</strong>. When <strong style="color: #3b82f6;">x = ${x}</strong>, what is <strong style="color: #10b981;">y</strong>?</div>`,
                    answer: answer,
                    hint: `Multiply ${x} by ${mult}`
                };
            } else {
                // Find the multiplier
                const mult = Math.floor(Math.random() * 4) + 2; // 2-5
                const x1 = 2;
                const y1 = mult * x1;
                const x2 = 3;
                const y2 = mult * x2;
                return {
                    problem: scaffoldingHTML + `<div style="font-size: 18px; margin-top: 20px; text-align: center;">Pattern: <strong style="color: #3b82f6;">x=2</strong>→<strong style="color: #10b981;">y=${y1}</strong>, <strong style="color: #3b82f6;">x=3</strong>→<strong style="color: #10b981;">y=${y2}</strong>. What's the rule? <strong style="color: #667eea;">y = ?x</strong></div>`,
                    answer: mult,
                    hint: `Look at the pattern: ${y1} ÷ 2 = ?`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 26: INEQUALITIES (v62 - ENHANCED WITH SCAFFOLDING)
    'inequalities': {
        id: 'inequalities',
        name: 'Inequalities',
        description: 'Graph and solve inequalities on number lines',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 50,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'algebra',
        
        // Future: scaffoldingEnabled will be controlled by teacher/parent settings
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['graph-simple', 'graph-compound', 'solve-graph', 'write'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'graph-simple') {
                // Graph x > 5, x ≤ 3, etc.
                const num = Math.floor(Math.random() * 9) - 2; // -2 to 6
                const inequalities = [
                    { symbol: '>', text: `x > ${num}`, circle: 'open', arrow: 'right', desc: 'greater than' },
                    { symbol: '<', text: `x < ${num}`, circle: 'open', arrow: 'left', desc: 'less than' },
                    { symbol: '≥', text: `x ≥ ${num}`, circle: 'closed', arrow: 'right', desc: 'greater than or equal to' },
                    { symbol: '≤', text: `x ≤ ${num}`, circle: 'closed', arrow: 'left', desc: 'less than or equal to' }
                ];
                const ineq = inequalities[Math.floor(Math.random() * inequalities.length)];
                
                // Build number line SVG with scaffolding
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        
                        <!-- COLLAPSIBLE BUTTON -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="inequality-help-btn" onclick="
                                const content = document.getElementById('inequality-scaffolding');
                                const btn = document.getElementById('inequality-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <!-- HIDDEN SCAFFOLDING CONTENT -->
                        <div id="inequality-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    
                                    <!-- TITLE -->
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📊 GRAPHING INEQUALITIES ON A NUMBER LINE
                                        </div>
                                        <div style="font-size: 28px; color: #2d3748; margin: 15px 0;">
                                            ${ineq.text}
                                        </div>
                                        <div style="font-size: 16px; color: #4a5568;">
                                            x is <strong style="color: #667eea;">${ineq.desc}</strong> ${num}
                                        </div>
                                    </div>
                                    
                                    <!-- NUMBER LINE VISUALIZATION -->
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="0 0 800 120" style="width: 100%; max-width: 800px; height: auto;">
                                            <!-- Number line -->
                                            <line x1="50" y1="60" x2="750" y2="60" stroke="#2d3748" stroke-width="3"/>
                                            
                                            <!-- Tick marks and labels -->
                                            ${Array.from({length: 11}, (_, i) => {
                                                const val = i - 5 + num;
                                                const x = 50 + (i * 70);
                                                return `
                                                    <line x1="${x}" y1="55" x2="${x}" y2="65" stroke="#2d3748" stroke-width="2"/>
                                                    <text x="${x}" y="85" text-anchor="middle" font-size="16" fill="#2d3748">${val}</text>
                                                `;
                                            }).join('')}
                                            
                                            <!-- Highlight point at ${num} -->
                                            <circle cx="400" cy="60" r="${ineq.circle === 'open' ? '10' : '8'}" 
                                                    fill="${ineq.circle === 'open' ? 'white' : '#e53e3e'}" 
                                                    stroke="#e53e3e" stroke-width="3"/>
                                            
                                            <!-- Arrow -->
                                            ${ineq.arrow === 'right' ? `
                                                <line x1="400" y1="60" x2="740" y2="60" stroke="#48bb78" stroke-width="6"/>
                                                <polygon points="740,60 725,54 725,66" fill="#48bb78"/>
                                            ` : `
                                                <line x1="60" y1="60" x2="400" y2="60" stroke="#48bb78" stroke-width="6"/>
                                                <polygon points="60,60 75,54 75,66" fill="#48bb78"/>
                                            `}
                                        </svg>
                                    </div>
                                    
                                    <!-- CIRCLE EXPLANATION -->
                                    <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${ineq.circle === 'open' ? '#ed8936' : '#e53e3e'}; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 10px;">
                                            <strong style="color: ${ineq.circle === 'open' ? '#ed8936' : '#e53e3e'};">
                                                ${ineq.circle === 'open' ? '○ OPEN CIRCLE' : '● CLOSED CIRCLE'}
                                            </strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568;">
                                            ${ineq.circle === 'open' ? 
                                                `The number ${num} is <strong>NOT included</strong> in the solution.<br>Use an open circle for < or >.` :
                                                `The number ${num} <strong>IS included</strong> in the solution.<br>Use a closed circle for ≤ or ≥.`
                                            }
                                        </div>
                                    </div>
                                    
                                    <!-- ARROW EXPLANATION -->
                                    <div style="background: #f0fff4; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 10px;">
                                            <strong style="color: #48bb78;">→ ARROW DIRECTION</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568;">
                                            Arrow points <strong>${ineq.arrow === 'right' ? 'RIGHT' : 'LEFT'}</strong> because all numbers 
                                            ${ineq.arrow === 'right' ? 'greater than' : 'less than'} ${num} are solutions.
                                        </div>
                                    </div>
                                    
                                    <!-- STEP-BY-STEP -->
                                    <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📝 GRAPHING STEPS:</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">
                                            <strong>1.</strong> Draw a number line with ${num} marked<br>
                                            <strong>2.</strong> Put ${ineq.circle === 'open' ? 'an <strong>open circle ○</strong>' : 'a <strong>closed circle ●</strong>'} at ${num}<br>
                                            <strong>3.</strong> Draw an arrow pointing <strong>${ineq.arrow === 'right' ? 'RIGHT →' : 'LEFT ←'}</strong><br>
                                            <strong>4.</strong> Test a value: Does x = ${num + (ineq.arrow === 'right' ? 2 : -2)} work? 
                                            ${ineq.arrow === 'right' ? 
                                                `${num + 2} ${ineq.symbol} ${num}? ✓ Yes!` : 
                                                `${num - 2} ${ineq.symbol} ${num}? ✓ Yes!`
                                            }
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Graph the inequality: ${ineq.text}. Which direction is the arrow? (1=Right, 2=Left)`,
                    answer: ineq.arrow === 'right' ? 1 : 2,
                    hint: `Think: Is x ${ineq.desc} ${num}? Numbers get ${ineq.arrow === 'right' ? 'bigger' : 'smaller'} to the ${ineq.arrow}.`,
                    diagram: diagram
                };
                
            } else if (type === 'solve-graph') {
                // Solve x + 3 < 10 and identify the graph
                const a = Math.floor(Math.random() * 5) + 2; // 2-6
                const b = Math.floor(Math.random() * 8) + 8; // 8-15
                const answer = b - a;
                const symbol = '<';
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="inequality-help-btn" onclick="
                                const content = document.getElementById('inequality-scaffolding');
                                const btn = document.getElementById('inequality-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="inequality-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            🔧 SOLVING & GRAPHING INEQUALITIES
                                        </div>
                                        <div style="font-size: 24px; color: #2d3748; margin: 15px 0;">
                                            x + ${a} ${symbol} ${b}
                                        </div>
                                    </div>
                                    
                                    <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">STEP 1: Solve for x</strong>
                                        </div>
                                        <div style="font-size: 18px; color: #2d3748; line-height: 2;">
                                            x + ${a} ${symbol} ${b}<br>
                                            <span style="color: #e53e3e;">− ${a}</span> on both sides<br>
                                            <span style="border-top: 2px solid #e53e3e; display: inline-block; padding-top: 5px;">
                                                x ${symbol} ${answer}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style="background: #f0fff4; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #48bb78;">STEP 2: Graph x < ${answer}</strong>
                                        </div>
                                        <svg viewBox="0 0 800 120" style="width: 100%; max-width: 800px; height: auto;">
                                            <line x1="50" y1="60" x2="750" y2="60" stroke="#2d3748" stroke-width="3"/>
                                            ${Array.from({length: 11}, (_, i) => {
                                                const val = i - 5 + answer;
                                                const x = 50 + (i * 70);
                                                return `
                                                    <line x1="${x}" y1="55" x2="${x}" y2="65" stroke="#2d3748" stroke-width="2"/>
                                                    <text x="${x}" y="85" text-anchor="middle" font-size="16" fill="#2d3748">${val}</text>
                                                `;
                                            }).join('')}
                                            <circle cx="400" cy="60" r="10" fill="white" stroke="#e53e3e" stroke-width="3"/>
                                            <line x1="60" y1="60" x2="400" y2="60" stroke="#48bb78" stroke-width="6"/>
                                            <polygon points="60,60 75,54 75,66" fill="#48bb78"/>
                                        </svg>
                                        <div style="font-size: 14px; color: #4a5568; margin-top: 10px; text-align: center;">
                                            ○ Open circle at ${answer} (not included)<br>
                                            ← Arrow points LEFT (values less than ${answer})
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Solve and graph: x + ${a} < ${b}. What is x less than?`,
                    answer: answer,
                    hint: `Subtract ${a} from both sides: x < ${answer}`,
                    diagram: diagram
                };
                
            } else {
                // Write inequality from words
                const num = Math.floor(Math.random() * 12) + 3; // 3-14
                const phrases = [
                    { text: `x is greater than ${num}`, symbol: '>', answer: 1 },
                    { text: `x is less than ${num}`, symbol: '<', answer: 2 },
                    { text: `x is at least ${num}`, symbol: '≥', answer: 3 },
                    { text: `x is at most ${num}`, symbol: '≤', answer: 4 },
                    { text: `x is no more than ${num}`, symbol: '≤', answer: 4 },
                    { text: `x is no less than ${num}`, symbol: '≥', answer: 3 }
                ];
                const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="inequality-help-btn" onclick="
                                const content = document.getElementById('inequality-scaffolding');
                                const btn = document.getElementById('inequality-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="inequality-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📝 INEQUALITY SYMBOL GUIDE
                                        </div>
                                    </div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 2px solid #667eea;">
                                            <div style="font-size: 24px; color: #667eea; text-align: center; margin-bottom: 10px;">></div>
                                            <div style="font-size: 14px; color: #2d3748; text-align: center;">
                                                <strong>Greater than</strong><br>
                                                "more than"<br>
                                                <em>Choice: 1</em>
                                            </div>
                                        </div>
                                        
                                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 2px solid #ed8936;">
                                            <div style="font-size: 24px; color: #ed8936; text-align: center; margin-bottom: 10px;"><</div>
                                            <div style="font-size: 14px; color: #2d3748; text-align: center;">
                                                <strong>Less than</strong><br>
                                                "fewer than"<br>
                                                <em>Choice: 2</em>
                                            </div>
                                        </div>
                                        
                                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 2px solid #48bb78;">
                                            <div style="font-size: 24px; color: #48bb78; text-align: center; margin-bottom: 10px;">≥</div>
                                            <div style="font-size: 14px; color: #2d3748; text-align: center;">
                                                <strong>At least</strong><br>
                                                "no less than"<br>
                                                "minimum"<br>
                                                <em>Choice: 3</em>
                                            </div>
                                        </div>
                                        
                                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 2px solid #e53e3e;">
                                            <div style="font-size: 24px; color: #e53e3e; text-align: center; margin-bottom: 10px;">≤</div>
                                            <div style="font-size: 14px; color: #2d3748; text-align: center;">
                                                <strong>At most</strong><br>
                                                "no more than"<br>
                                                "maximum"<br>
                                                <em>Choice: 4</em>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">
                                            <strong>💡 Memory Trick:</strong><br>
                                            • The symbol "points" to the smaller number<br>
                                            • "At least" includes the number (≥)<br>
                                            • "At most" includes the number (≤)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `"${phrase.text}". Write as inequality. (1:> 2:< 3:≥ 4:≤)`,
                    answer: phrase.answer,
                    hint: `"${phrase.text.split(' ').slice(2).join(' ')}" means ${phrase.symbol}`,
                    diagram: diagram
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 28: COORDINATE PLANE PROBLEMS
    // LESSON 28: COORDINATE PLANE PROBLEMS (v63 - ENHANCED WITH SCAFFOLDING)
    'coordinate-problems': {
        id: 'coordinate-problems',
        name: 'Coordinate Plane Problems',
        description: 'Find distances, perimeter, and area on coordinate plane',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 60,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'geometry',
        
        // Future: scaffoldingEnabled will be controlled by teacher/parent settings
        scaffoldingEnabled: true,
        
        generate: function() {
            const types = ['horizontal-distance', 'vertical-distance', 'rectangle-area', 'rectangle-perimeter'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'horizontal-distance') {
                // Same y-coordinate (horizontal line)
                const y = Math.floor(Math.random() * 7) - 3; // -3 to 3
                const x1 = Math.floor(Math.random() * 5) - 5; // -5 to -1
                const x2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
                const answer = Math.abs(x2 - x1);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        
                        <!-- COLLAPSIBLE BUTTON -->
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="coordinate-help-btn" onclick="
                                const content = document.getElementById('coordinate-scaffolding');
                                const btn = document.getElementById('coordinate-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <!-- HIDDEN SCAFFOLDING CONTENT -->
                        <div id="coordinate-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    
                                    <!-- TITLE -->
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📍 HORIZONTAL DISTANCE ON COORDINATE PLANE
                                        </div>
                                        <div style="font-size: 20px; color: #2d3748; margin: 15px 0;">
                                            Points: (${x1}, ${y}) and (${x2}, ${y})
                                        </div>
                                    </div>
                                    
                                    <!-- COORDINATE GRID -->
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="-10 -10 620 620" style="width: 100%; max-width: 600px; height: auto; margin: 0 auto; display: block;">
                                            <!-- Grid background -->
                                            <rect x="0" y="0" width="600" height="600" fill="#f7fafc"/>
                                            
                                            <!-- Grid lines (light) -->
                                            ${Array.from({length: 21}, (_, i) => {
                                                const pos = i * 30;
                                                return `
                                                    <line x1="${pos}" y1="0" x2="${pos}" y2="600" stroke="#e2e8f0" stroke-width="1"/>
                                                    <line x1="0" y1="${pos}" x2="600" y2="${pos}" stroke="#e2e8f0" stroke-width="1"/>
                                                `;
                                            }).join('')}
                                            
                                            <!-- Y-axis (blue) -->
                                            <line x1="300" y1="0" x2="300" y2="600" stroke="#3b82f6" stroke-width="3"/>
                                            <text x="310" y="15" font-size="14" fill="#3b82f6" font-weight="bold">y</text>
                                            
                                            <!-- X-axis (red) -->
                                            <line x1="0" y1="300" x2="600" y2="300" stroke="#ef4444" stroke-width="3"/>
                                            <text x="585" y="290" font-size="14" fill="#ef4444" font-weight="bold">x</text>
                                            
                                            <!-- Axis labels -->
                                            ${Array.from({length: 11}, (_, i) => {
                                                const val = i - 5;
                                                const pos = 300 + (val * 30);
                                                if (val !== 0) {
                                                    return `
                                                        <text x="${pos}" y="320" text-anchor="middle" font-size="12" fill="#2d3748">${val}</text>
                                                        <text x="280" y="${300 - (val * 30) + 5}" text-anchor="end" font-size="12" fill="#2d3748">${val}</text>
                                                    `;
                                                }
                                                return '';
                                            }).join('')}
                                            <text x="300" y="320" text-anchor="middle" font-size="12" fill="#2d3748" font-weight="bold">0</text>
                                            
                                            <!-- Plot points -->
                                            <circle cx="${300 + x1 * 30}" cy="${300 - y * 30}" r="6" fill="#e53e3e" stroke="white" stroke-width="2"/>
                                            <text x="${300 + x1 * 30}" y="${300 - y * 30 - 12}" text-anchor="middle" font-size="14" fill="#e53e3e" font-weight="bold">(${x1},${y})</text>
                                            
                                            <circle cx="${300 + x2 * 30}" cy="${300 - y * 30}" r="6" fill="#10b981" stroke="white" stroke-width="2"/>
                                            <text x="${300 + x2 * 30}" y="${300 - y * 30 - 12}" text-anchor="middle" font-size="14" fill="#10b981" font-weight="bold">(${x2},${y})</text>
                                            
                                            <!-- Distance line -->
                                            <line x1="${300 + x1 * 30}" y1="${300 - y * 30}" 
                                                  x2="${300 + x2 * 30}" y2="${300 - y * 30}" 
                                                  stroke="#f59e0b" stroke-width="4" stroke-dasharray="5,5"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- EXPLANATION -->
                                    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #f59e0b;">↔️ HORIZONTAL DISTANCE</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">
                                            Both points have <strong>y = ${y}</strong> (same height)<br>
                                            Points are on a <strong>horizontal line</strong><br>
                                            Distance = difference in x-coordinates
                                        </div>
                                    </div>
                                    
                                    <!-- STEP-BY-STEP CALCULATION -->
                                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📝 CALCULATION STEPS:</strong>
                                        </div>
                                        <div style="font-size: 16px; color: #2d3748; line-height: 2;">
                                            <strong>Formula:</strong> Distance = |x₂ - x₁|<br>
                                            <strong>Substitute:</strong> |${x2} - (${x1})|<br>
                                            <strong>Simplify:</strong> |${x2 - x1}|<br>
                                            <strong>Answer:</strong> <span style="color: #f59e0b; font-size: 20px; font-weight: bold;">${answer} units</span>
                                        </div>
                                    </div>
                                    
                                    <!-- PRO TIP -->
                                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #10b981;">
                                        <div style="font-size: 14px; color: #4a5568;">
                                            <strong style="color: #10b981;">💡 Pro Tip:</strong> Same y-value = horizontal line. Just count spaces between x-values!
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the distance between points (${x1}, ${y}) and (${x2}, ${y}) on a coordinate plane.`,
                    answer: answer,
                    hint: `Same y-value means horizontal line. Distance = |${x2} - (${x1})|`,
                    diagram: diagram
                };
                
            } else if (type === 'vertical-distance') {
                // Same x-coordinate (vertical line)
                const x = Math.floor(Math.random() * 7) - 3; // -3 to 3
                const y1 = Math.floor(Math.random() * 5) - 5; // -5 to -1
                const y2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
                const answer = Math.abs(y2 - y1);
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="coordinate-help-btn" onclick="
                                const content = document.getElementById('coordinate-scaffolding');
                                const btn = document.getElementById('coordinate-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="coordinate-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📍 VERTICAL DISTANCE ON COORDINATE PLANE
                                        </div>
                                        <div style="font-size: 20px; color: #2d3748; margin: 15px 0;">
                                            Points: (${x}, ${y1}) and (${x}, ${y2})
                                        </div>
                                    </div>
                                    
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="-10 -10 620 620" style="width: 100%; max-width: 600px; height: auto; margin: 0 auto; display: block;">
                                            <rect x="0" y="0" width="600" height="600" fill="#f7fafc"/>
                                            ${Array.from({length: 21}, (_, i) => {
                                                const pos = i * 30;
                                                return `
                                                    <line x1="${pos}" y1="0" x2="${pos}" y2="600" stroke="#e2e8f0" stroke-width="1"/>
                                                    <line x1="0" y1="${pos}" x2="600" y2="${pos}" stroke="#e2e8f0" stroke-width="1"/>
                                                `;
                                            }).join('')}
                                            <line x1="300" y1="0" x2="300" y2="600" stroke="#3b82f6" stroke-width="3"/>
                                            <text x="310" y="15" font-size="14" fill="#3b82f6" font-weight="bold">y</text>
                                            <line x1="0" y1="300" x2="600" y2="300" stroke="#ef4444" stroke-width="3"/>
                                            <text x="585" y="290" font-size="14" fill="#ef4444" font-weight="bold">x</text>
                                            ${Array.from({length: 11}, (_, i) => {
                                                const val = i - 5;
                                                const pos = 300 + (val * 30);
                                                if (val !== 0) {
                                                    return `
                                                        <text x="${pos}" y="320" text-anchor="middle" font-size="12" fill="#2d3748">${val}</text>
                                                        <text x="280" y="${300 - (val * 30) + 5}" text-anchor="end" font-size="12" fill="#2d3748">${val}</text>
                                                    `;
                                                }
                                                return '';
                                            }).join('')}
                                            <text x="300" y="320" text-anchor="middle" font-size="12" fill="#2d3748" font-weight="bold">0</text>
                                            
                                            <circle cx="${300 + x * 30}" cy="${300 - y1 * 30}" r="6" fill="#e53e3e" stroke="white" stroke-width="2"/>
                                            <text x="${300 + x * 30 + 25}" y="${300 - y1 * 30 + 5}" font-size="14" fill="#e53e3e" font-weight="bold">(${x},${y1})</text>
                                            
                                            <circle cx="${300 + x * 30}" cy="${300 - y2 * 30}" r="6" fill="#10b981" stroke="white" stroke-width="2"/>
                                            <text x="${300 + x * 30 + 25}" y="${300 - y2 * 30 + 5}" font-size="14" fill="#10b981" font-weight="bold">(${x},${y2})</text>
                                            
                                            <line x1="${300 + x * 30}" y1="${300 - y1 * 30}" 
                                                  x2="${300 + x * 30}" y2="${300 - y2 * 30}" 
                                                  stroke="#f59e0b" stroke-width="4" stroke-dasharray="5,5"/>
                                        </svg>
                                    </div>
                                    
                                    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #f59e0b;">↕️ VERTICAL DISTANCE</strong>
                                        </div>
                                        <div style="font-size: 14px; color: #4a5568; line-height: 1.8;">
                                            Both points have <strong>x = ${x}</strong> (same position left/right)<br>
                                            Points are on a <strong>vertical line</strong><br>
                                            Distance = difference in y-coordinates
                                        </div>
                                    </div>
                                    
                                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📝 CALCULATION STEPS:</strong>
                                        </div>
                                        <div style="font-size: 16px; color: #2d3748; line-height: 2;">
                                            <strong>Formula:</strong> Distance = |y₂ - y₁|<br>
                                            <strong>Substitute:</strong> |${y2} - (${y1})|<br>
                                            <strong>Simplify:</strong> |${y2 - y1}|<br>
                                            <strong>Answer:</strong> <span style="color: #f59e0b; font-size: 20px; font-weight: bold;">${answer} units</span>
                                        </div>
                                    </div>
                                    
                                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #10b981;">
                                        <div style="font-size: 14px; color: #4a5568;">
                                            <strong style="color: #10b981;">💡 Pro Tip:</strong> Same x-value = vertical line. Just count spaces between y-values!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Find the distance between points (${x}, ${y1}) and (${x}, ${y2}) on a coordinate plane.`,
                    answer: answer,
                    hint: `Same x-value means vertical line. Distance = |${y2} - (${y1})|`,
                    diagram: diagram
                };
                
            } else if (type === 'rectangle-area') {
                // Rectangle area
                const x1 = Math.floor(Math.random() * 3) + 1; // 1-3
                const y1 = Math.floor(Math.random() * 3) + 1; // 1-3
                const width = Math.floor(Math.random() * 3) + 3; // 3-5
                const height = Math.floor(Math.random() * 3) + 2; // 2-4
                const x2 = x1 + width;
                const y2 = y1 + height;
                const answer = width * height;
                
                const diagram = `
                    <div style="max-width: 850px; margin: 20px auto; font-family: 'Georgia', serif;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <button id="coordinate-help-btn" onclick="
                                const content = document.getElementById('coordinate-scaffolding');
                                const btn = document.getElementById('coordinate-help-btn');
                                if (content.style.display === 'none') {
                                    content.style.display = 'block';
                                    btn.textContent = '🔼 Hide Visual Help';
                                } else {
                                    content.style.display = 'none';
                                    btn.textContent = '🔽 Show Visual Help';
                                }
                            " style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(102,126,234,0.3); transition: all 0.3s;">
                                🔽 Show Visual Help
                            </button>
                        </div>
                        
                        <div id="coordinate-scaffolding" style="display: none;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; box-shadow: 0 8px 16px rgba(102,126,234,0.3); margin-top: 15px;">
                                <div style="background: white; padding: 30px; border-radius: 10px;">
                                    <div style="text-align: center; margin-bottom: 25px;">
                                        <div style="font-size: 18px; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                                            📦 RECTANGLE AREA ON COORDINATE PLANE
                                        </div>
                                        <div style="font-size: 20px; color: #2d3748; margin: 15px 0;">
                                            Vertices: (${x1},${y1}), (${x2},${y1}), (${x2},${y2}), (${x1},${y2})
                                        </div>
                                    </div>
                                    
                                    <div style="margin: 30px 0;">
                                        <svg viewBox="-10 -10 620 620" style="width: 100%; max-width: 600px; height: auto; margin: 0 auto; display: block;">
                                            <rect x="0" y="0" width="600" height="600" fill="#f7fafc"/>
                                            ${Array.from({length: 21}, (_, i) => {
                                                const pos = i * 30;
                                                return `
                                                    <line x1="${pos}" y1="0" x2="${pos}" y2="600" stroke="#e2e8f0" stroke-width="1"/>
                                                    <line x1="0" y1="${pos}" x2="600" y2="${pos}" stroke="#e2e8f0" stroke-width="1"/>
                                                `;
                                            }).join('')}
                                            <line x1="300" y1="0" x2="300" y2="600" stroke="#3b82f6" stroke-width="3"/>
                                            <text x="310" y="15" font-size="14" fill="#3b82f6" font-weight="bold">y</text>
                                            <line x1="0" y1="300" x2="600" y2="300" stroke="#ef4444" stroke-width="3"/>
                                            <text x="585" y="290" font-size="14" fill="#ef4444" font-weight="bold">x</text>
                                            ${Array.from({length: 11}, (_, i) => {
                                                const val = i - 5;
                                                const pos = 300 + (val * 30);
                                                if (val !== 0) {
                                                    return `
                                                        <text x="${pos}" y="320" text-anchor="middle" font-size="12" fill="#2d3748">${val}</text>
                                                        <text x="280" y="${300 - (val * 30) + 5}" text-anchor="end" font-size="12" fill="#2d3748">${val}</text>
                                                    `;
                                                }
                                                return '';
                                            }).join('')}
                                            <text x="300" y="320" text-anchor="middle" font-size="12" fill="#2d3748" font-weight="bold">0</text>
                                            
                                            <rect x="${300 + x1 * 30}" y="${300 - y2 * 30}" 
                                                  width="${width * 30}" height="${height * 30}"
                                                  fill="rgba(102, 126, 234, 0.2)" stroke="#667eea" stroke-width="3"/>
                                            
                                            <circle cx="${300 + x1 * 30}" cy="${300 - y1 * 30}" r="5" fill="#e53e3e"/>
                                            <circle cx="${300 + x2 * 30}" cy="${300 - y1 * 30}" r="5" fill="#e53e3e"/>
                                            <circle cx="${300 + x2 * 30}" cy="${300 - y2 * 30}" r="5" fill="#e53e3e"/>
                                            <circle cx="${300 + x1 * 30}" cy="${300 - y2 * 30}" r="5" fill="#e53e3e"/>
                                            
                                            <text x="${300 + (x1 + width/2) * 30}" y="${300 - y1 * 30 + 20}" 
                                                  text-anchor="middle" font-size="14" fill="#f59e0b" font-weight="bold">width = ${width}</text>
                                            <text x="${300 + x1 * 30 - 35}" y="${300 - (y1 + height/2) * 30 + 5}" 
                                                  text-anchor="middle" font-size="14" fill="#10b981" font-weight="bold">height = ${height}</text>
                                        </svg>
                                    </div>
                                    
                                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                                        <div style="font-size: 16px; color: #2d3748; margin-bottom: 15px;">
                                            <strong style="color: #667eea;">📝 FINDING DIMENSIONS:</strong>
                                        </div>
                                        <div style="font-size: 16px; color: #2d3748; line-height: 2;">
                                            <strong style="color: #f59e0b;">Width:</strong> |${x2} - ${x1}| = ${width} units<br>
                                            <strong style="color: #10b981;">Height:</strong> |${y2} - ${y1}| = ${height} units<br>
                                            <strong style="color: #667eea;">Formula:</strong> Area = width × height<br>
                                            <strong>Calculate:</strong> ${width} × ${height} = <span style="color: #e53e3e; font-size: 20px;">${answer} square units</span>
                                        </div>
                                    </div>
                                    
                                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                                        <div style="font-size: 14px; color: #4a5568;">
                                            <strong style="color: #10b981;">💡 Pro Tip:</strong> Count the length and width on the grid, then multiply!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                return {
                    problem: `Rectangle with vertices at (${x1},${y1}), (${x2},${y1}), (${x2},${y2}), (${x1},${y2}). Find the area.`,
                    answer: answer,
                    hint: `Width = ${width}, Height = ${height}. Area = width × height`,
                    diagram: diagram
                };
                
            } else {
                // Rectangle perimeter
                const x1 = Math.floor(Math.random() * 2) + 1; // 1-2
                const y1 = Math.floor(Math.random() * 2) + 1; // 1-2
                const width = Math.floor(Math.random() * 3) + 3; // 3-5
                const height = Math.floor(Math.random() * 3) + 3; // 3-5
                const x2 = x1 + width;
                const y2 = y1 + height;
                const answer = 2 * (width + height);
                
                return {
                    problem: `Rectangle with corners at (${x1},${y1}), (${x2},${y1}), (${x2},${y2}), (${x1},${y2}). Find the perimeter.`,
                    answer: answer,
                    hint: `Width = ${width}, Height = ${height}. Perimeter = 2(w + h)`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    },
    
    // LESSON 32: MEAN & MAD
    'mean-mad': {
        id: 'mean-mad',
        name: 'Mean & MAD',
        description: 'Calculate mean and mean absolute deviation',
        difficulty: 4,
        stars: '⭐⭐⭐⭐',
        reward: 60,
        xpReward: 10,
        gradeLevel: '6th Grade',
        category: 'statistics',
        
        generate: function() {
            const types = ['mean', 'find-missing', 'deviation'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            if (type === 'mean') {
                // Find the mean
                const count = Math.floor(Math.random() * 3) + 4; // 4-6 values
                const values = [];
                for (let i = 0; i < count; i++) {
                    values.push(Math.floor(Math.random() * 12) + 5); // 5-16
                }
                const sum = values.reduce((a, b) => a + b, 0);
                const answer = Math.round(sum / count);
                return {
                    problem: `Find the mean (round to nearest whole): ${values.join(', ')}`,
                    answer: answer,
                    hint: `Add all values, divide by ${count}`
                };
            } else if (type === 'find-missing') {
                // Given mean, find missing value
                const known = [8, 12, 10, 14]; // 4 values
                const mean = 11;
                const sum = known.reduce((a, b) => a + b, 0);
                const missing = mean * 5 - sum;
                return {
                    problem: `Mean of 5 numbers is ${mean}. Four numbers: ${known.join(', ')}. Fifth number?`,
                    answer: missing,
                    hint: `Total sum = mean × count`
                };
            } else {
                // Simple deviation from mean
                const mean = 10;
                const value = Math.floor(Math.random() * 8) + 6; // 6-13
                const answer = Math.abs(value - mean);
                return {
                    problem: `Mean = ${mean}. What's the absolute deviation of ${value}?`,
                    answer: answer,
                    hint: `|${value} - ${mean}| = ?`
                };
            }
        },
        
        check: function(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        }
    }
};

// Get math type by ID
function getMathType(id) {
    return MATH_TYPES[id] || MATH_TYPES['mult-1-12'];
}

// Generate a problem from current math type
function generateProblem(mathTypeId) {
    const mathType = getMathType(mathTypeId);
    const problem = mathType.generate();
    
    return {
        ...problem,
        mathType: mathType,
        reward: mathType.reward,
        xpReward: mathType.xpReward
    };
}

// Check answer
function checkAnswer(userAnswer, correctAnswer, mathTypeId) {
    const mathType = getMathType(mathTypeId);
    return mathType.check(userAnswer, correctAnswer);
}

console.log('🧮 Math Types loaded! 33 types ready to DOMINATE! 💪');
