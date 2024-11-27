import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
          <span> {new Date().getFullYear()} Sentiment Analyzer • Developed by Nikilesh Reddy T</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;