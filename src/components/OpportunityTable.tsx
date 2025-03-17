
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OpportunityTableProps {
  onEdit: (opportunity: any) => void;
}

const OpportunityTable = ({ onEdit }: OpportunityTableProps) => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        () => {
          fetchOpportunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Opportunity deleted successfully!');
      await fetchOpportunities();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting opportunity');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading opportunities...</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-8">
      {opportunities.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No opportunities found. Click "Add New Opportunity" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity, index) => (
                <TableRow key={opportunity.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{opportunity.title}</TableCell>
                  <TableCell>{opportunity.organization}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      opportunity.type === 'scholarship' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {opportunity.type === 'scholarship' ? 'Scholarship' : 'Job'}
                    </span>
                  </TableCell>
                  <TableCell>{opportunity.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        onClick={() => onEdit(opportunity)}
                        variant="default"
                        size="icon"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => onEdit(opportunity)}
                        variant="default"
                        size="icon"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(opportunity.id)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OpportunityTable;
