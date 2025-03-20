
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-8 md:mt-16 border-t pt-4 pb-4 md:pt-8 md:pb-6 text-center text-xs md:text-sm text-muted-foreground">
      <p>© {currentYear} Mobile Shop. All rights reserved.</p>
      <p className="mt-1">Developed by Elevorix Solutions</p>
    </footer>
  );
};

export default Footer;
