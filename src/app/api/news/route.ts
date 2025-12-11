import { NextRequest, NextResponse } from 'next/server';
import { fetchNews, searchNews } from '@/lib/newsdata';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as 'politics' | 'sports' | 'business' | null;
    const country = searchParams.get('country') || undefined;
    const language = searchParams.get('language') || 'en';
    const query = searchParams.get('q');

    let news;
    if (query) {
      news = await searchNews(query, language);
    } else {
      news = await fetchNews(category || undefined, country, language);
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
