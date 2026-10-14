import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-20 animate-in fade-in duration-500 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#ff6201] mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We'd love to hear from you. Whether you have a question about our products or just want to say hello.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-[#ff6201] via-[#f75e00] to-[#e65500] p-10 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300/40 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-3xl font-serif text-white mb-8 relative z-10">Contact Information</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-orange-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-white text-lg">Our Office</h4>
                  <p className="text-white/90 mt-1">123 Devotion Lane, Spiritual Hub<br/>Chennai, Tamil Nadu 600001</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-orange-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-white text-lg">Call Us</h4>
                  <p className="text-white/90 mt-1">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-orange-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-white text-lg">Email Us</h4>
                  <p className="text-white/90 mt-1">hello@vedhakarpooram.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-10 lg:p-12">
            <h3 className="text-2xl font-serif text-gray-900 mb-6">Send a Message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6201] focus:border-transparent transition-all" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6201] focus:border-transparent transition-all" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6201] focus:border-transparent transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-[#ff6201] hover:bg-[#ea5500] text-white font-medium py-3.5 px-4 rounded-lg shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center space-x-2">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
