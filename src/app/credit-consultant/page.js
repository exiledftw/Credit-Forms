'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";

export default function CreditConsultantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">Credit Consultant</h1>
          <p className="text-gray-600 mb-6">
            This page is for credit consultant services. Content coming soon.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Services</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Professional credit consultation</li>
              <li>• Personalized improvement strategies</li>
              <li>• Credit score analysis</li>
              <li>• One-on-one guidance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
