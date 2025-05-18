
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NewsForm } from "@/components/NewsForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Home, Plus, X, Trash2, Edit, Coffee } from "lucide-react";
import { format } from "date-fns";
import DonationButton from "@/components/DonationButton";

interface NewsItem {
  id: string;
  subject: string;
  body: string;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

const AdminNews = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    checkUser();
    fetchNews();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      }
      setIsLoading(false);
    } catch (error) {
      navigate("/auth");
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsItems(data as NewsItem[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch news items");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };

  const handleEditNews = (news: NewsItem) => {
    setEditingNews(news);
    setShowForm(true);
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      try {
        const { error } = await supabase
          .from("news_items")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("News item deleted successfully!");
        fetchNews();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete news item");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">News Management</h1>
              <Link to="/" className="ml-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home size={16} />
                  Back to Home
                </Button>
              </Link>
              <Link to="/admin" className="ml-4">
                <Button variant="outline" className="flex items-center gap-2">
                  Admin Dashboard
                </Button>
              </Link>
              <div className="ml-4">
                <DonationButton variant="coffee" size="sm" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  setEditingNews(null);
                  setShowForm(!showForm);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                variant="default"
              >
                {showForm ? (
                  <>
                    <X size={16} className="mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1" />
                    Add News Item
                  </>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                variant="secondary"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingNews ? "Edit News Item" : "Create News Item"}
            </h2>
            <NewsForm
              newsItem={editingNews}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">All News Items</h2>
        
        {newsItems.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No news items yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{news.subject}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {format(new Date(news.created_at), "MMMM d, yyyy")}
                      </p>
                      <div className="prose max-w-none mb-4">
                        <p className="line-clamp-3">{news.body}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <DonationButton
                        variant="outline"
                        size="sm"
                        label="Support"
                        showIcon={false}
                      />
                      <Button
                        onClick={() => handleEditNews(news)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit size={16} />
                        <span className="ml-1">Edit</span>
                      </Button>
                      <Button
                        onClick={() => handleDeleteNews(news.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 size={16} />
                        <span className="ml-1">Delete</span>
                      </Button>
                    </div>
                  </div>

                  {news.attachments && news.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Attachments ({news.attachments.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {news.attachments.slice(0, 4).map((attachment, index) => (
                          <div key={index} className="relative h-20">
                            {attachment.type?.startsWith("image/") ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="h-full w-full object-cover rounded"
                              />
                            ) : attachment.type?.startsWith("video/") ? (
                              <video
                                src={attachment.url}
                                className="h-full w-full object-cover rounded"
                                controls
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded">
                                {attachment.name}
                              </div>
                            )}
                          </div>
                        ))}
                        {news.attachments.length > 4 && (
                          <div className="flex items-center justify-center h-20 bg-gray-100 rounded">
                            +{news.attachments.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminNews;
