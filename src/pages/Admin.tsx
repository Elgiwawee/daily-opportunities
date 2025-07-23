
import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OpportunityForm } from '@/components/OpportunityForm';
import OpportunityTable from '@/components/OpportunityTable';
import { BlogPostForm } from '@/components/BlogPostForm';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Home, Plus, X, Newspaper, FileText } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);

  useEffect(() => {
    checkUser();
    
    // Check if edit parameter is in URL
    const query = new URLSearchParams(location.search);
    const editId = query.get('edit');
    
    if (editId) {
      fetchOpportunityForEdit(editId);
    }
  }, [location]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
      setIsLoading(false);
    } catch (error) {
      navigate('/auth');
    }
  };

  const fetchOpportunityForEdit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setEditingOpportunity(data);
      setShowForm(true);
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(error.message || 'Error fetching opportunity for editing');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };

  const handleEditOpportunity = (opportunity: any) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
    // Clear the edit parameter from URL
    navigate('/admin');
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOpportunity(null);
    // Clear the edit parameter from URL
    navigate('/admin');
    toast.success(editingOpportunity ? 'Opportunity updated successfully!' : 'Opportunity created successfully!');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <Link to="/" className="ml-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home size={16} />
                  Back to Home
                </Button>
              </Link>
              <Link to="/admin/news" className="ml-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Newspaper size={16} />
                  Manage News
                </Button>
              </Link>
              <Button 
                onClick={() => setShowBlogForm(!showBlogForm)}
                variant="outline" 
                className="ml-4 flex items-center gap-2"
              >
                <FileText size={16} />
                {showBlogForm ? 'Close Blog Form' : 'Create Blog Post'}
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  setEditingOpportunity(null);
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
                    Add New Opportunity
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
        {showBlogForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Blog Post</h2>
            <BlogPostForm
              onSuccess={() => {
                setShowBlogForm(false);
                toast.success('Blog post created successfully!');
              }}
              onCancel={() => setShowBlogForm(false)}
            />
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
            </h2>
            <OpportunityForm
              opportunity={editingOpportunity}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-4">All Opportunities</h2>
        <OpportunityTable
          onEdit={handleEditOpportunity}
        />
      </main>
    </div>
  );
};

export default Admin;
