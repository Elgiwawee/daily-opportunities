import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Bitcoin, CreditCard, Banknote, Wallet, PoundSterling, DollarSign, Euro, Coins, BadgeDollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Donate = () => {
  const [showCurrencyInfo, setShowCurrencyInfo] = React.useState<boolean>(false);
  
  const cryptoAddresses = [
    {
      name: "Bitcoin (BTC)",
      address: "1FF37e2JiN7kwGfgrg4icDyP8sSrmJnLkS",
      icon: <Bitcoin className="w-6 h-6 text-orange-500" />
    },
    {
      name: "USDT (TRC20)",
      address: "TGpgH4LYQJ2LFfWcJzmaPkQd5m2m7g8DyB",
      icon: <Bitcoin className="w-6 h-6 text-green-500" />
    }
  ];

  const bankDetails = {
    name: "Zaharaddeen Umar",
    bankName: "Opay",
    accountNumber: "610-207-4340"
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    document.getElementById('copyMessage')?.classList.remove('opacity-0');
    document.getElementById('copyMessage')?.classList.add('opacity-100');
    
    setTimeout(() => {
      document.getElementById('copyMessage')?.classList.remove('opacity-100');
      document.getElementById('copyMessage')?.classList.add('opacity-0');
    }, 2000);
  };

  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', icon: <DollarSign className="w-4 h-4 text-blue-500" /> },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', icon: <PoundSterling className="w-4 h-4 text-green-500" /> },
    { code: 'EUR', name: 'Euro', symbol: '€', icon: <Euro className="w-4 h-4 text-yellow-500" /> },
    { code: 'GBP', name: 'British Pound', symbol: '£', icon: <PoundSterling className="w-4 h-4 text-purple-500" /> },
    { code: 'USDT', name: 'Tether', symbol: 'USDT', icon: <Coins className="w-4 h-4 text-teal-500" /> },
    { code: 'BTC', name: 'Bitcoin', symbol: 'BTC', icon: <Bitcoin className="w-4 h-4 text-orange-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-amber-800 mb-4">Support Our Work</h1>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Your donation helps us continue providing valuable opportunities and resources to students around the world.
            </p>
            <button 
              onClick={() => setShowCurrencyInfo(true)}
              className="mt-4 inline-flex items-center text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
              <Coins className="w-4 h-4 mr-1" />
              View all supported currencies
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Card & Bank Payments</h2>
              </div>

              <div className="space-y-8">
                {/* Card Payment Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">Credit/Debit Card</h3>
                  <p className="text-gray-600 mb-4">
                    Make a secure donation using your credit or debit card in your local currency.
                  </p>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select currency:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {supportedCurrencies.slice(0, 4).map(curr => (
                        <div key={curr.code} className="bg-white border border-gray-200 rounded p-2 text-center">
                          <div className="flex justify-center mb-1">{curr.icon}</div>
                          <div className="text-xs font-medium">{curr.symbol}</div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">More currencies available at checkout</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[5, 10, 20, 50].map(amount => (
                      <button
                        key={amount}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 rounded-md transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or enter custom amount:</label>
                    <div className="flex rounded-md">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-medium transition-colors">
                    Donate Now
                  </button>
                </div>

                {/* Bank Transfer Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Banknote className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="font-medium text-gray-800">Bank Transfer</h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium text-gray-800">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium text-gray-800">{bankDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Account Number:</span>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-2">{bankDetails.accountNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(bankDetails.accountNumber)}
                          className="text-amber-600 hover:text-amber-700 text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Money Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Wallet className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="font-medium text-gray-800">Mobile Money</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Send money directly to our mobile money account:
                  </p>
                  
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">MTN Phone Number:</span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 mr-2">+2347040930552</span>
                      <button 
                        onClick={() => copyToClipboard("+2347040930552")}
                        className="text-amber-600 hover:text-amber-700 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Available for MTN Money transfers
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-amber-100"
            >
              <div className="flex items-center mb-6">
                <Bitcoin className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Cryptocurrency</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Support our work by donating cryptocurrency. We accept various tokens:
              </p>

              <div className="space-y-6">
                {cryptoAddresses.map((crypto, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      {crypto.icon}
                      <h3 className="font-medium text-gray-800 ml-2">{crypto.name}</h3>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        value={crypto.address}
                        readOnly
                        className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm font-mono break-all"
                      />
                      <button
                        onClick={() => copyToClipboard(crypto.address)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p className="font-medium text-amber-700 mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Please double-check the address before sending any cryptocurrency</li>
                  <li>Make sure you're sending the correct type of cryptocurrency to its corresponding address</li>
                  <li>Transactions are irreversible</li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 opacity-0" id="copyMessage">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
              Copied to clipboard!
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Why Support Us?</h3>
            <div className="max-w-3xl mx-auto text-gray-700">
              <p className="mb-4">
                Your donation helps us maintain and improve our platform, ensuring that we can continue to provide 
                valuable resources and connect students with scholarship and job opportunities around the world.
              </p>
              <p>
                We are committed to making education and career opportunities accessible to everyone, regardless of 
                their background or circumstances. With your support, we can make an even bigger impact.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Currency Information Dialog */}
      <Dialog open={showCurrencyInfo} onOpenChange={setShowCurrencyInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supported Currencies</DialogTitle>
            <DialogDescription>
              We accept donations in multiple currencies and automatically convert them to Naira or USDT.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {supportedCurrencies.map(currency => (
              <div key={currency.code} className="flex items-center p-3 border rounded-md">
                <div className="mr-3">{currency.icon}</div>
                <div>
                  <p className="font-medium">{currency.code}</p>
                  <p className="text-xs text-gray-500">{currency.name}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm bg-amber-50 p-3 rounded-md">
            <h4 className="font-medium text-amber-800">How Currency Conversion Works</h4>
            <p className="mt-1 text-gray-700">
              When you donate in your local currency, the amount is automatically converted to Nigerian Naira (NGN) 
              or USDT based on the current exchange rate. This allows us to receive funds in our preferred currencies 
              while you can donate in the currency most convenient for you.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donate;
