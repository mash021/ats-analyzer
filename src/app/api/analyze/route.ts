import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const resume = data.get('resume') as File;
    
    if (!resume) {
      return NextResponse.json(
        { error: 'لطفاً یک فایل رزومه انتخاب کنید' },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: 'لطفاً فقط فایل‌های متنی، PDF یا Word آپلود کنید' },
        { status: 400 }
      );
    }

    const text = await resume.text();
    
    // بررسی محتوای متن
    if (!text || text.length < 50 || /^[0-9\s]+$/.test(text)) {
      return NextResponse.json(
        { error: 'محتوای فایل نامعتبر است. لطفاً یک رزومه واقعی آپلود کنید' },
        { status: 400 }
      );
    }

    // ارسال درخواست به Ollama
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi',
      prompt: `Analyze this resume and answer these questions:
1. Is this resume likely generated by AI? Give your confidence level and reasoning.
2. What is the likelihood of this candidate getting an interview? Explain why.
3. What are the main strengths and weaknesses of this resume?

Resume text:
${text}`,
      stream: false
    });

    return NextResponse.json({
      analysis: ollamaResponse.data.response
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: 'خطا در آنالیز رزومه. لطفاً دوباره تلاش کنید' },
      { status: 500 }
    );
  }
} 