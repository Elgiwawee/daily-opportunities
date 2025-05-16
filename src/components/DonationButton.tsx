
import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonationModal from './DonationModal';

interface DonationButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'coffee';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

const DonationButton: React.FC<DonationButtonProps> = ({ 
  variant = 'coffee',
  size = 'default',
  className = '',
  showIcon = true,
  label = 'Buy Staff Coffee'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openDonationModal = () => {
    setIsModalOpen(true);
  };
  
  const closeDonationModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openDonationModal}
        className={className}
      >
        {showIcon && <Coffee className="w-4 h-4" />}
        {label}
      </Button>
      
      <DonationModal
        isOpen={isModalOpen}
        onClose={closeDonationModal}
      />
    </>
  );
};

export default DonationButton;
