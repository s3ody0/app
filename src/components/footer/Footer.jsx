import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 mt-10">
            <div className="max-w-screen-xl mx-auto p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <Link to="/" className="flex items-center mb-4 md:mb-0">
                        <span className="text-2xl font-bold text-blue-500 ">Kda kteer</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Pages</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/posts" className="hover:underline">Posts</Link></li>
                            <li><Link to="/about" className="hover:underline">About</Link></li>
                            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Resources</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:underline">Docs</a></li>
                            <li><a href="#" className="hover:underline">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Community</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:underline">Discord</a></li>
                            <li><a href="#" className="hover:underline">Twitter</a></li>
                            <li><a href="#" className="hover:underline">GitHub</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Legal</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover:underline">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-300 dark:border-gray-700 mb-6" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm mb-4 sm:mb-0">
                        © {new Date().getFullYear()} MyLinkedApp. All rights reserved.
                    </span>

                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white">FB</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white">Twitter</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
