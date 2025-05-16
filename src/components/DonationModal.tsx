import React, { useState } from 'react';
import { X, Coffee, CreditCard, DollarSign, Bitcoin, Wallet, Banknote, PoundSterling } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'card' | 'crypto' | 'bank' | 'mobile';
type Currency = 'USD' | 'NGN' | 'EUR' | 'GBP' | 'USDT' | 'BTC' | 'ETH';

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<number>(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll just show a success message
    // In a real app, you'd integrate with a payment gateway here
    toast.success(`Thank you for your ${amount} ${currency} donation!`, {
      description: "Your support helps us provide better opportunities.",
    });
    
    // Reset and close
    setAmount('');
    setStep(1);
    onClose();
  };
  
  const predefinedAmounts = [5, 10, 20, 50];
  
  const renderPaymentDetails = () => {
    switch(paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700">Credit/Debit Card</h3>
              <p className="text-sm text-gray-500">
                Secure payment via Stripe. You'll be redirected to complete payment.
              </p>
              <button 
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md"
                onClick={() => toast.info("This would connect to Stripe in production")}
              >
                Pay with Card
              </button>
            </div>
          </div>
        );
      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700">Cryptocurrency</h3>
              <div className="space-y-3 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">USDT (TRC20)</label>
                  <div className="flex mt-1">
                    <input 
                      readOnly
                      value="TLancr79aB2ZyNYTFSA3EgxVuTKqMrB6J3" 
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                    />
                    <button 
                      className="ml-2 px-3 py-1 bg-gray-200 rounded-md text-sm"
                      onClick={() => {
                        navigator.clipboard.writeText("TLancr79aB2ZyNYTFSA3EgxVuTKqMrB6J3");
                        toast.success("Address copied to clipboard");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BTC</label>
                  <div className="flex mt-1">
                    <input 
                      readOnly
                      value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                    />
                    <button 
                      className="ml-2 px-3 py-1 bg-gray-200 rounded-md text-sm"
                      onClick={() => {
                        navigator.clipboard.writeText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
                        toast.success("Address copied to clipboard");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-red-600">
                Please make sure to send only the selected cryptocurrency to its corresponding address.
              </p>
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700">Bank Transfer (Naira)</h3>
              <div className="space-y-2 mt-2">
                <p className="text-sm">
                  <span className="font-medium">Bank Name:</span> First Bank Nigeria
                </p>
                <p className="text-sm">
                  <span className="font-medium">Account Number:</span> 12345678901
                </p>
                <p className="text-sm">
                  <span className="font-medium">Account Name:</span> Scholarship Portal
                </p>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Please include your name as reference when making the transfer.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700">Generate Remita Payment</h3>
              <p className="text-sm text-gray-500 mt-1">
                Generate a Remita payment reference to pay via any bank.
              </p>
              <button 
                className="mt-3 w-full bg-green-600 text-white py-2 rounded-md"
                onClick={() => toast.info("This would generate a Remita RRR in production")}
              >
                Generate Remita RRR
              </button>
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700">Mobile Money</h3>
              <p className="text-sm text-gray-500 mt-1">
                Send to this number: +234 8012345678
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Available for MTN, Airtel, Glo, and 9mobile
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-amber-600" />
                  Buy Staff Coffee
                </h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {step === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select amount
                      </label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {predefinedAmounts.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setAmount(preset.toString())}
                            className={`py-2 rounded-md text-center ${
                              amount === preset.toString()
                                ? "bg-amber-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                          >
                            ${preset}
                          </button>
                        ))}
                      </div>
                      <div className="flex rounded-md">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          {currency === 'USDT' || currency === 'BTC' || currency === 'ETH' ? (
                            <Bitcoin className="h-4 w-4" />
                          ) : currency === 'NGN' ? (
                            <PoundSterling className="h-4 w-4" />
                          ) : (
                            <DollarSign className="h-4 w-4" />
                          )}
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select currency
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['USD', 'NGN', 'EUR', 'GBP', 'USDT', 'BTC', 'ETH'] as Currency[]).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => setCurrency(curr)}
                            className={`py-1.5 rounded-md text-center text-sm ${
                              currency === curr
                                ? "bg-amber-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="coffee"
                      size="lg"
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Select payment method</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            paymentMethod === 'card'
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? "text-amber-600" : "text-gray-500"}`} />
                          <span className="mt-1 text-sm">Credit Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('crypto')}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            paymentMethod === 'crypto'
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Bitcoin className={`h-6 w-6 ${paymentMethod === 'crypto' ? "text-amber-600" : "text-gray-500"}`} />
                          <span className="mt-1 text-sm">Crypto</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank')}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            paymentMethod === 'bank'
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Banknote className={`h-6 w-6 ${paymentMethod === 'bank' ? "text-amber-600" : "text-gray-500"}`} />
                          <span className="mt-1 text-sm">Bank Transfer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('mobile')}
                          className={`flex flex-col items-center p-3 rounded-lg border ${
                            paymentMethod === 'mobile'
                              ? "border-amber-600 bg-amber-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Wallet className={`h-6 w-6 ${paymentMethod === 'mobile' ? "text-amber-600" : "text-gray-500"}`} />
                          <span className="mt-1 text-sm">Mobile Money</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{currency} {amount}</span>
                      </div>
                      
                      {renderPaymentDetails()}
                      
                      <div className="flex gap-2 mt-6">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button 
                          variant="coffee"
                          className="flex-1"
                          onClick={handleSubmit}
                        >
                          Complete Donation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  Your donation helps us maintain and improve our platform
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
