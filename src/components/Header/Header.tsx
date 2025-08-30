import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Image
          id="logo"
          src="/assets/img/logo.png"
          alt="Leo Oli - Fotógrafo"
          width={350}
          height={200}
          priority
          style={{
            width: '90%',
            maxWidth: '350px',
            height: 'auto',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </motion.h1>
      <motion.p 
        className="portfolio-text"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Portfolio
      </motion.p>
    </motion.header>
  );
};

export default Header;