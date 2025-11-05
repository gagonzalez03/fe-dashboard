import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { category, subtopic, questionType } = await request.json();

    if (!category || !subtopic || !questionType) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert FE Civil exam question generator. Generate a single ${questionType} question for the FE Civil CBT exam.

Topic: ${category} - ${subtopic}

${getTypeSpecificInstructions(questionType)}

Return ONLY valid JSON (no markdown, no code blocks):
${getJsonTemplate(questionType)}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse Claude response' },
        { status: 500 }
      );
    }

    const question = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ 
      success: true, 
      question: {
        type: questionType,
        ...question
      }
    });

  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate question'
      },
      { status: 500 }
    );
  }
}

function getTypeSpecificInstructions(type: string): string {
  const instructions: { [key: string]: string } = {
    'multiple-choice': `For Multiple Choice:
- Create exactly 4 options
- One or more options should be correct
- Incorrect options should be plausible but wrong
- Include common misconceptions`,
    
    'fill-in-blank': `For Fill in Blank:
- Create a question with a single blank space
- Answer should be numerical (with units) or short text
- Accept multiple answer variations`,
    
    'point-and-click': `For Point and Click:
- Describe an engineering diagram with labeled clickable areas
- Must have 3-4 hotspots labeled A, B, C, D
- User must click the correct location`,
    
    'drag-and-drop': `For Drag and Drop:
- Create 3-5 items to be matched/categorized
- Create 3-5 categories or definitions
- Each item matches exactly one category`
  };
  return instructions[type] || '';
}

function getJsonTemplate(type: string): string {
  const templates: { [key: string]: string } = {
    'multiple-choice': `{
  "text": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswers": [0, 2],
  "explanation": "Why these answers are correct"
}`,
    
    'fill-in-blank': `{
  "text": "The distance between points (3, 4) and (6, 8) is _____ units.",
  "correctAnswers": ["5", "5.0"],
  "explanation": "Using distance formula..."
}`,
    
    'point-and-click': `{
  "text": "Click on the correct location",
  "correctAnswer": "B",
  "correctAnswerLabel": "At support",
  "explanation": "This is the correct location because..."
}`,
    
    'drag-and-drop': `{
  "text": "Match items to categories",
  "items": [
    {"id": "item1", "label": "Item 1"},
    {"id": "item2", "label": "Item 2"}
  ],
  "dropzones": [
    {"id": "zone1", "label": "Category 1"},
    {"id": "zone2", "label": "Category 2"}
  ],
  "correctMatches": {
    "zone1": "item1",
    "zone2": "item2"
  },
  "explanation": "Explanation here"
}`
  };
  return templates[type] || '{}';
}