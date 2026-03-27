export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold font-poppins mb-4">
              ULAB <span className="text-[#fbbf24]">Scholar Space</span>
            </h3>
            <p className="text-gray-300 text-sm max-w-sm">
              A smart study and collaboration system for ULAB students, fostering learning, connection, and growth.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4 text-[#fbbf24]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white text-gray-300 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white text-gray-300 transition-colors">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white text-gray-300 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white text-gray-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4 text-[#fbbf24]">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors"><i className="fa-brands fa-facebook fa-lg"></i></a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors"><i className="fa-brands fa-twitter fa-lg"></i></a>
              <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white transition-colors"><i className="fa-brands fa-linkedin fa-lg"></i></a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors"><i className="fa-brands fa-instagram fa-lg"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm text-gray-300">
          <p>&copy; 2026 ULAB Scholar Space. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
