import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContact } from '../api/client';
import type { ContactForm } from '../types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

const contactCards = [
  { icon: '✉', title: 'Email', value: 'anishshrestha2007@gmail.com' },
  { icon: '📱', title: 'Phone', value: '9818184662' },
  { icon: '📍', title: 'Location', value: 'Nepal, kathmandu' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await submitContact(data);
      setSubmitted(true);
    } catch {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">✦ Contact</div>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h2>Let's work together</h2>
            <p>
              Have a project in mind? I'd love to hear about it. Send me a
              message and let's build something great.
            </p>
            <div className="contact-cards">
              {contactCards.map((card) => (
                <motion.div
                  key={card.title}
                  className="card contact-card"
                  whileHover={{ x: 4 }}
                >
                  <div className="contact-card-icon">{card.icon}</div>
                  <div>
                    <h4>{card.title}</h4>
                    <p>{card.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {submitted ? (
              <div className="card contact-form">
                <div className="form-success">
                  <h3>Message Sent! 🎉</h3>
                  <p>
                    Thank you for reaching out. I'll get back to you as soon
                    as possible.
                  </p>
                </div>
              </div>
            ) : (
              <form className="card contact-form" onSubmit={handleSubmit(onSubmit)}>
                <h3>Send a Message</h3>

                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" {...register('name')} placeholder="Your name" />
                  {errors.name && <div className="form-error">{errors.name.message}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" {...register('email')} placeholder="your@email.com" />
                  {errors.email && <div className="form-error">{errors.email.message}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" {...register('subject')} placeholder="What's this about?" />
                  {errors.subject && <div className="form-error">{errors.subject.message}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" {...register('message')} placeholder="Tell me about your project..." />
                  {errors.message && <div className="form-error">{errors.message.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
