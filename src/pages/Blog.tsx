import Navbar from '../components/Navbar';
import GoogleAdCard from '../components/GoogleAdCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "How to Find the Best Scholarships in 2024",
      excerpt: "Discover the most effective strategies for finding and applying to scholarships that match your profile...",
      date: "2024-01-15",
      author: "Daily Opportunities Team"
    },
    {
      id: 2,
      title: "Top 10 Countries for International Students",
      excerpt: "Explore the best destinations for international education with comprehensive guides on requirements...",
      date: "2024-01-10",
      author: "Daily Opportunities Team"
    },
    {
      id: 3,
      title: "Job Search Tips for Recent Graduates",
      excerpt: "Essential tips and strategies to help recent graduates land their first job in today's competitive market...",
      date: "2024-01-05",
      author: "Daily Opportunities Team"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Daily Opportunities Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and insights about scholarships, jobs, and educational opportunities worldwide.
            </p>
          </div>

          {/* Ad Card - Top Banner */}
          <div className="mb-8">
            <GoogleAdCard
              adSlot="1234567890"
              adFormat="horizontal"
              className="w-full"
            />
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {blogPosts.map((post, index) => (
                <div key={post.id}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold hover:text-primary cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                      <button className="mt-4 text-primary hover:underline font-medium">
                        Read More →
                      </button>
                    </CardContent>
                  </Card>

                  {/* Insert ad after every 2nd blog post */}
                  {(index + 1) % 2 === 0 && index < blogPosts.length - 1 && (
                    <div className="my-8">
                      <GoogleAdCard
                        adSlot="1234567891"
                        adFormat="horizontal"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Sidebar Ad */}
              <GoogleAdCard
                adSlot="1234567892"
                adFormat="vertical"
                className="w-full"
              />

              {/* Popular Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Popular Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={`popular-${post.id}`} className="border-b border-border pb-4 last:border-b-0">
                      <h4 className="font-medium text-sm hover:text-primary cursor-pointer line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Another Sidebar Ad */}
              <GoogleAdCard
                adSlot="1234567893"
                adFormat="square"
                className="w-full"
              />
            </div>
          </div>

          {/* Bottom Ad */}
          <div className="mt-12 mb-8">
            <GoogleAdCard
              adSlot="1234567894"
              adFormat="horizontal"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;