"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, Clock, Globe, Share2, Bookmark, ExternalLink } from "lucide-react";

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  // Mock data - replace with actual API call
  const article = {
    id: articleId,
    title: "Climate Action Summit Brings World Leaders Together",
    region: "Global",
    summary: "World leaders gather to discuss new climate commitments and renewable energy transitions.",
    content: `
      <p>In a historic gathering, world leaders from over 150 countries convened at the Climate Action Summit to address the urgent challenges posed by climate change. The summit, held in Geneva, marks a pivotal moment in global environmental policy.</p>
      
      <h2>Key Commitments</h2>
      <p>Several nations announced ambitious new targets for carbon neutrality, with many pledging to achieve net-zero emissions by 2040. The European Union reaffirmed its commitment to reducing greenhouse gas emissions by 55% by 2030.</p>
      
      <h2>Renewable Energy Transition</h2>
      <p>A major focus of the summit was the transition to renewable energy sources. Countries shared innovative approaches to solar, wind, and hydroelectric power implementation. Investment pledges totaling $500 billion were announced to support developing nations in their green energy transitions.</p>
      
      <h2>Youth Activism</h2>
      <p>Young climate activists played a prominent role, with several addressing the assembly and calling for immediate action. Their voices emphasized the urgency of the climate crisis and the need for concrete, measurable steps.</p>
      
      <h2>Looking Forward</h2>
      <p>The summit concluded with a joint declaration outlining specific action items and accountability measures. Follow-up meetings are scheduled quarterly to track progress and adjust strategies as needed.</p>
    `,
    time: "2 hours ago",
    publishedAt: "2024-01-15T10:30:00Z",
    topics: ["Environment", "Politics", "Global Affairs"],
    sourceUrl: "https://example.com/original-article",
    author: "ISHK News Team",
    readTime: "5 min read",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy via-navy/95 to-sky/10">
      <Navbar />

      <article className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sky hover:text-sky/80 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to News
          </motion.button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-xs font-medium text-sky/80 bg-sky/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {article.region}
              </span>
              <div className="flex items-center gap-1 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                {article.time}
              </div>
              <span className="text-white/60 text-sm">{article.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-sky/90 mb-8 leading-relaxed">
              {article.summary}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-sm text-sky/70 bg-sky/5 px-3 py-1 rounded-full border border-sky/20"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-12 pb-8 border-b border-white/10">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-sky/20 hover:bg-sky/30 text-sky rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Original
                </a>
              )}
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              color: "rgba(255, 255, 255, 0.8)",
            }}
          />

          {/* Author & Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-between text-white/60 text-sm">
              <span>By {article.author}</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
            </div>
          </motion.div>

          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-heading font-bold text-white mb-6">
              Related News
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-sky/20 hover:border-sky/40 hover:bg-white/15 transition-all cursor-pointer"
                  onClick={() => router.push(`/news/${i + 10}`)}
                >
                  <span className="text-xs font-medium text-sky/80 bg-sky/10 px-3 py-1 rounded-full">
                    Europe
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-white mt-3 mb-2">
                    Related Article Title {i}
                  </h3>
                  <p className="text-white/70 text-sm">
                    Brief summary of the related article...
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
