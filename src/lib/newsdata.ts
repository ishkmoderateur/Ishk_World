// NewsData.io API Integration
// Sign up at: https://newsdata.io/register
// Free tier: 200 requests/day

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  content: string;
  pubDate: string;
  source_id: string;
  source_name: string;
  source_url: string;
  source_icon: string;
  country: string[];
  category: string[];
  language: string;
  image_url: string;
  video_url: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

export async function fetchNews(
  category?: 'politics' | 'sports' | 'business' | 'technology' | 'entertainment',
  country?: string,
  language: string = 'en'
): Promise<NewsResponse> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    // Return mock news data when API key is not set
    return getMockNews(category);
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    language,
  });

  if (category) {
    params.append('category', category);
  }

  if (country) {
    params.append('country', country);
  }

  const url = `https://newsdata.io/api/1/news?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`NewsData API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Fallback to mock data on error
    return getMockNews(category);
  }
}

export async function searchNews(
  query: string,
  language: string = 'en'
): Promise<NewsResponse> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    // Return mock search results when API key is not set
    return getMockSearchResults(query);
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    q: query,
    language,
  });

  const url = `https://newsdata.io/api/1/news?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`NewsData API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching news:', error);
    // Fallback to mock data on error
    return getMockSearchResults(query);
  }
}

// Mock data functions for when API key is not available
function getMockNews(category?: string): NewsResponse {
  const mockArticles: NewsArticle[] = [
    {
      article_id: '1',
      title: 'Breaking: Major Development in Global Politics',
      description: 'A significant political event has unfolded with worldwide implications...',
      content: 'Full article content here...',
      pubDate: new Date().toISOString(),
      source_id: 'mock-source',
      source_name: 'Global News Network',
      source_url: 'https://example.com',
      source_icon: '',
      country: ['US'],
      category: category ? [category] : ['politics'],
      language: 'en',
      image_url: 'https://via.placeholder.com/400x200?text=News+Image',
      video_url: ''
    },
    {
      article_id: '2',
      title: 'Sports Championship Finals Set for This Weekend',
      description: 'The highly anticipated finals are approaching with both teams showing strong performance...',
      content: 'Full article content here...',
      pubDate: new Date().toISOString(),
      source_id: 'mock-source',
      source_name: 'Sports Central',
      source_url: 'https://example.com',
      source_icon: '',
      country: ['US'],
      category: ['sports'],
      language: 'en',
      image_url: 'https://via.placeholder.com/400x200?text=Sports+News',
      video_url: ''
    },
    {
      article_id: '3',
      title: 'Economic Indicators Show Positive Growth',
      description: 'Latest economic data reveals promising trends for the coming quarter...',
      content: 'Full article content here...',
      pubDate: new Date().toISOString(),
      source_id: 'mock-source',
      source_name: 'Business Daily',
      source_url: 'https://example.com',
      source_icon: '',
      country: ['US'],
      category: ['business'],
      language: 'en',
      image_url: 'https://via.placeholder.com/400x200?text=Business+News',
      video_url: ''
    }
  ];

  // Filter by category if specified
  const filteredArticles = category
    ? mockArticles.filter(article => article.category.includes(category))
    : mockArticles;

  return {
    status: 'success',
    totalResults: filteredArticles.length,
    results: filteredArticles,
    nextPage: undefined
  };
}

function getMockSearchResults(query: string): NewsResponse {
  const mockArticles: NewsArticle[] = [
    {
      article_id: 'search-1',
      title: `Latest Updates on "${query}"`,
      description: `Comprehensive coverage of recent developments related to ${query}...`,
      content: 'Full article content here...',
      pubDate: new Date().toISOString(),
      source_id: 'mock-source',
      source_name: 'Search Results News',
      source_url: 'https://example.com',
      source_icon: '',
      country: ['US'],
      category: ['general'],
      language: 'en',
      image_url: 'https://via.placeholder.com/400x200?text=Search+Results',
      video_url: ''
    }
  ];

  return {
    status: 'success',
    totalResults: mockArticles.length,
    results: mockArticles,
    nextPage: undefined
  };
}
