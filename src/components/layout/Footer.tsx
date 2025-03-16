
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-16 border-t pt-8 pb-6 text-center text-sm text-muted-foreground">
      <p>© {currentYear} Mobile Shop. All rights reserved.</p>
      <p className="mt-1">Developed by Elevorix Solutions</p>
    </footer>
  );
};

export default Footer;
