import { CheckCircle2, CreditCard, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { toast } from 'sonner';

interface CheckoutDialogProps {
  onComplete: (shippingData: { fullName: string; address: string; city: string; zipCode: string }) => void;
  items: CartItem[];
  total: number;
}

export default function CheckoutDialog({ onComplete, items, total }: CheckoutDialogProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email || !formData.address) {
        toast.error('Please fill in required shipping details');
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      
      try {
        // Call the backend API to send confirmation email
        const response = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            orderTotal: total.toLocaleString(),
            itemsCount: items.reduce((acc, item) => acc + item.quantity, 0)
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          console.error('Failed to send email:', result.error);
          // We still proceed to success step even if email fails, but log it
        }
      } catch (error) {
        console.error('Error calling email API:', error);
      }

      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
      }, 1000);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <AnimatePresence mode="wait">
        {step === 4 ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Thank you for your purchase. We've sent a confirmation email to your inbox.
            </p>
            <Button className="w-full" onClick={() => onComplete({
              fullName: `${formData.firstName} ${formData.lastName}`,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode
            })}>
              Back to Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl">Checkout Process</DialogTitle>
              <DialogDescription>
                Step {step} of 3: {step === 1 ? 'Shipping Details' : step === 2 ? 'Payment Method' : 'Review Order'}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        placeholder="Doe" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipping Address</label>
                    <Input 
                      placeholder="123 Luxury Ave" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        placeholder="New York" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zip Code</label>
                      <Input 
                        placeholder="10001" 
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-secondary border-primary/20 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Credit / Debit Card</p>
                      <p className="text-xs text-primary/70">Secure encrypted payment</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input 
                      placeholder="**** **** **** 1234" 
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input 
                        placeholder="MM/YY" 
                        value={formData.expiry}
                        onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input 
                        placeholder="***" 
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>Standard Shipping (3-5 business days)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ShieldCheck className="w-4 h-4 text-gray-400" />
                      <span>1-Year Manufacturer Warranty included</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order Summary</span>
                      <span className="font-medium">{items.reduce((acc, item) => acc + item.quantity, 0)} Items</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {step > 1 && (
                <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button className="flex-[2] bg-primary hover:bg-primary/90" onClick={handleNext} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : step === 3 ? 'Complete Purchase' : 'Continue'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}
