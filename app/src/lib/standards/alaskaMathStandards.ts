import { Standard } from './types';

// ============================================================================
// ALASKA MATH STANDARDS (Grades 6-8)
// Source: https://education.alaska.gov/akstandards/math/adopted_math.pdf
// Alaska adopted standards closely aligned with Common Core
// These map directly to the Math Quiz system problem types
// ============================================================================

export const ALASKA_MATH_STANDARDS: Standard[] = [
  // ====================
  // GRADE 6 STANDARDS
  // ====================
  
  // Ratios and Proportional Relationships
  {
    id: 'AK-MATH-6RP-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.RP.1',
    title: 'Understand Ratios',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6RP-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.RP.2',
    title: 'Unit Rates',
    description: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6RP-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.RP.3',
    title: 'Ratio and Rate Reasoning',
    description: 'Use ratio and rate reasoning to solve real-world and mathematical problems.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6RP-3c',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.RP.3c',
    title: 'Percent Problems',
    description: 'Find a percent of a quantity as a rate per 100; solve problems involving finding the whole, given a part and the percent.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // The Number System
  {
    id: 'AK-MATH-6NS-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.1',
    title: 'Division of Fractions',
    description: 'Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6NS-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.2',
    title: 'Multi-Digit Division',
    description: 'Fluently divide multi-digit numbers using the standard algorithm.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6NS-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.3',
    title: 'Decimal Operations',
    description: 'Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6NS-5',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.5',
    title: 'Positive and Negative Numbers',
    description: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6NS-6',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.6',
    title: 'Rational Numbers on Number Line',
    description: 'Understand a rational number as a point on the number line. Extend number line diagrams to represent points on the line.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6NS-7',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.NS.7',
    title: 'Ordering Rational Numbers',
    description: 'Understand ordering and absolute value of rational numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Expressions and Equations
  {
    id: 'AK-MATH-6EE-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.1',
    title: 'Exponents',
    description: 'Write and evaluate numerical expressions involving whole-number exponents.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6EE-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.2',
    title: 'Algebraic Expressions',
    description: 'Write, read, and evaluate expressions in which letters stand for numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6EE-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.3',
    title: 'Equivalent Expressions',
    description: 'Apply the properties of operations to generate equivalent expressions.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6EE-5',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.5',
    title: 'Solving Equations',
    description: 'Understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true?',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6EE-6',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.6',
    title: 'Variables in Expressions',
    description: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6EE-7',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.EE.7',
    title: 'One-Variable Equations',
    description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Geometry
  {
    id: 'AK-MATH-6G-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.G.1',
    title: 'Area of Polygons',
    description: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6G-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.G.2',
    title: 'Volume of Prisms',
    description: 'Find the volume of a right rectangular prism with fractional edge lengths.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6G-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.G.4',
    title: 'Surface Area',
    description: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Statistics and Probability
  {
    id: 'AK-MATH-6SP-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.SP.1',
    title: 'Statistical Questions',
    description: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6SP-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.SP.3',
    title: 'Measures of Center',
    description: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-6SP-5',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '6',
    code: 'AK.MATH.6.SP.5',
    title: 'Summarize Data',
    description: 'Summarize numerical data sets in relation to their context.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // ====================
  // GRADE 7 STANDARDS
  // ====================
  
  // Ratios and Proportional Relationships
  {
    id: 'AK-MATH-7RP-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.RP.1',
    title: 'Unit Rates with Fractions',
    description: 'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7RP-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.RP.2',
    title: 'Proportional Relationships',
    description: 'Recognize and represent proportional relationships between quantities.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7RP-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.RP.3',
    title: 'Multi-Step Ratio Problems',
    description: 'Use proportional relationships to solve multistep ratio and percent problems.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // The Number System
  {
    id: 'AK-MATH-7NS-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.NS.1',
    title: 'Add and Subtract Rationals',
    description: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7NS-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.NS.2',
    title: 'Multiply and Divide Rationals',
    description: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7NS-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.NS.3',
    title: 'Rational Number Operations',
    description: 'Solve real-world and mathematical problems involving the four operations with rational numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Expressions and Equations
  {
    id: 'AK-MATH-7EE-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.EE.1',
    title: 'Linear Expressions',
    description: 'Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7EE-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.EE.3',
    title: 'Multi-Step Problems',
    description: 'Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form, using tools strategically.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7EE-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.EE.4',
    title: 'Equations and Inequalities',
    description: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Geometry
  {
    id: 'AK-MATH-7G-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.G.1',
    title: 'Scale Drawings',
    description: 'Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7G-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.G.4',
    title: 'Circles',
    description: 'Know the formulas for the area and circumference of a circle and use them to solve problems.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7G-5',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.G.5',
    title: 'Angle Relationships',
    description: 'Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7G-6',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.G.6',
    title: 'Area, Volume, Surface Area',
    description: 'Solve real-world and mathematical problems involving area, volume and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Statistics and Probability
  {
    id: 'AK-MATH-7SP-5',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.SP.5',
    title: 'Probability',
    description: 'Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring. Larger numbers indicate greater likelihood.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-7SP-6',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '7',
    code: 'AK.MATH.7.SP.6',
    title: 'Experimental Probability',
    description: 'Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // ====================
  // GRADE 8 STANDARDS
  // ====================
  
  // The Number System
  {
    id: 'AK-MATH-8NS-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.NS.1',
    title: 'Irrational Numbers',
    description: 'Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8NS-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.NS.2',
    title: 'Rational Approximations',
    description: 'Use rational approximations of irrational numbers to compare the size of irrational numbers.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Expressions and Equations
  {
    id: 'AK-MATH-8EE-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.1',
    title: 'Integer Exponents',
    description: 'Know and apply the properties of integer exponents to generate equivalent numerical expressions.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8EE-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.2',
    title: 'Square and Cube Roots',
    description: 'Use square root and cube root symbols to represent solutions to equations. Evaluate square roots of small perfect squares and cube roots of small perfect cubes.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8EE-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.3',
    title: 'Scientific Notation',
    description: 'Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8EE-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.4',
    title: 'Operations with Scientific Notation',
    description: 'Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8EE-7',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.7',
    title: 'Linear Equations',
    description: 'Solve linear equations in one variable.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8EE-8',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.EE.8',
    title: 'Systems of Equations',
    description: 'Analyze and solve pairs of simultaneous linear equations.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Functions
  {
    id: 'AK-MATH-8F-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.F.1',
    title: 'Functions',
    description: 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8F-2',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.F.2',
    title: 'Compare Functions',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8F-3',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.F.3',
    title: 'Linear Functions',
    description: 'Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8F-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.F.4',
    title: 'Model with Functions',
    description: 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Geometry
  {
    id: 'AK-MATH-8G-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.G.1',
    title: 'Transformations',
    description: 'Verify experimentally the properties of rotations, reflections, and translations.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8G-6',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.G.6',
    title: 'Pythagorean Theorem Proof',
    description: 'Explain a proof of the Pythagorean Theorem and its converse.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8G-7',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.G.7',
    title: 'Apply Pythagorean Theorem',
    description: 'Apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems in two and three dimensions.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8G-8',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.G.8',
    title: 'Distance on Coordinate Plane',
    description: 'Apply the Pythagorean Theorem to find the distance between two points in a coordinate system.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8G-9',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.G.9',
    title: 'Volume of 3D Figures',
    description: 'Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  
  // Statistics and Probability
  {
    id: 'AK-MATH-8SP-1',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.SP.1',
    title: 'Scatter Plots',
    description: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
  {
    id: 'AK-MATH-8SP-4',
    framework: 'alaska-math',
    subject: 'math',
    gradeLevel: '8',
    code: 'AK.MATH.8.SP.4',
    title: 'Two-Way Tables',
    description: 'Understand that patterns of association can also be seen in bivariate categorical data by displaying frequencies and relative frequencies in a two-way table.',
    sourceUrl: 'https://education.alaska.gov/akstandards/math/adopted_math.pdf'
  },
];

export default ALASKA_MATH_STANDARDS;
