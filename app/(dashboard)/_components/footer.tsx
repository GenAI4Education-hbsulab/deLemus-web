import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-sm font-semibold mb-2">HBSULAB EduPlatform</h2>
          <p className="text-gray-400">
            Innovate & Discover. Your journey to learning starts here.
          </p>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold mb-2">Quick Links</h2>
          <ul>
            <li className="mb-1">
              <Link href={{ pathname: "/about" }}>
                <span className="text-gray-400 hover:text-white">About Us</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link href={{ pathname: "/contact" }}>
                <span className="text-gray-400 hover:text-white">Contact</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link href={{ pathname: "/privacy" }}>
                <span className="text-gray-400 hover:text-white">
                  Privacy Policy
                </span>
              </Link>
            </li>
            <li className="mb-1">
              <Link href={{ pathname: "/terms" }}>
                <span className="text-gray-400 hover:text-white">
                  Terms of Service
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 text-center md:text-right">
          <h2 className="text-sm font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-400">Email: support@eduplatform.com</p>
          <p className="text-gray-400">Phone: +123 456 7890</p>
          <p className="text-gray-400">
            Address: 123 Learning Lane, Knowledge City
          </p>
        </div>
        <div className="flex-1 text-center md:text-right">
          <h2 className="text-sm font-semibold mb-2">Follow Us</h2>
          <div className="flex justify-center md:justify-end space-x-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center mt-4 text-xs">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} HBSULAB. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
