
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OpportunityForm } from '@/components/OpportunityForm';
import OpportunityTable from '@/components/OpportunityTable';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
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
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setEditingOpportunity(null);
                  setShowForm(!showForm);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {showForm ? 'Cancel' : 'Add New Opportunity'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <OpportunityForm
            opportunity={editingOpportunity}
            onSuccess={() => {
              setShowForm(false);
              setEditingOpportunity(null);
            }}
          />
        )}
        
        <OpportunityTable
          onEdit={(opportunity) => {
            setEditingOpportunity(opportunity);
            setShowForm(true);
          }}
        />
      </main>
    </div>
  );
};

export default Admin;
