
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters')
});

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input data
      const result = contactSchema.safeParse(formData);
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: result.data.name,
            email: result.data.email,
            message: result.data.message
          }
        ]);

      if (error) {
        toast.error('Failed to send message. Please try again.');
        return;
      }

      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{t('contact.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t('contact.getInTouch')}</h2>
            <p className="text-gray-700 mb-6">
              {t('contact.subtitle')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.name')}
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" 
                  placeholder={t('contact.name')} 
                />
                <p className="text-xs text-gray-500 mt-1">{formData.name.length}/100</p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.email')}
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  maxLength={255}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" 
                  placeholder={t('contact.email')} 
                />
                <p className="text-xs text-gray-500 mt-1">{formData.email.length}/255</p>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.message')}
                </label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  value={formData.message} 
                  onChange={handleChange} 
                  maxLength={1000}
                  className="w-full min-h-[150px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent" 
                  placeholder={t('contact.message')} 
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/1000</p>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-brand-accent hover:bg-brand-accent/90">
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </Button>
            </form>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-800">{t('contact.contactInfo')}</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{t('contact.address')}</h3>
                  <p className="text-gray-600">
                   Ray Street<br />
                    Qusia<br />
                    Asuit
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9am - 6pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{t('contact.phone')}</h3>
                  <p className="text-gray-600">
                    Email: novaecommerce@novashop.com<br />
                    Phone: +201062698964
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
