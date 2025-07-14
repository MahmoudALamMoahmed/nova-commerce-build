
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Error submitting message:', error);
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
      console.error('Error submitting message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-24 pb-16">
  <div className="container mx-auto px-6 max-w-5xl">
    <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center rtl:text-right">{t('contact.title')}</h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Form Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 rtl:text-right">{t('contact.getInTouch')}</h2>
        <p className="text-gray-700 mb-6 rtl:text-right">{t('contact.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">
              {t('contact.name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder={t('contact.name')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">
              {t('contact.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder={t('contact.email')}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">
              {t('contact.message')}
            </label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full min-h-[150px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder={t('contact.message')}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-brand-accent hover:bg-brand-accent/90"
          >
            {isSubmitting ? t('contact.sending') : t('contact.send')}
          </Button>
        </form>
      </div>

      {/* Contact Info Card */}
      <div>
        <Card dir="ltr">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">{t('contact.contactInfo')}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">{t('contact.address')}</h3>
              <p className="text-gray-600">
                123 Design Street<br />
                San Francisco, CA 94107<br />
                United States
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
                Email: info@novashop.com<br />
                Phone: (555) 123-4567
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
