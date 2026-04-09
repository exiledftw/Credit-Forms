'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, CheckCircle2 } from "lucide-react";

export default function DisputeExpertPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dispute Expert</h1>
          <p className="text-gray-600 mb-6">
            This page is for credit dispute expert services. Content coming soon.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Services</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Dispute negative items on your credit report</li>
              <li>• Professional dispute letter preparation</li>
              <li>• Credit bureau communication</li>
              <li>• Removal of inaccurate information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
