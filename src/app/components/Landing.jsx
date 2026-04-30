'use client';

import React from "react";
import Link from "next/link";
import { FileText, User, Shield } from "lucide-react";

export default function Landing() {
  const services = [
    {
      title: "Credit Repair Form",
      description: "Original credit repair form for client assessment.",
      icon: FileText,
      href: "/credit-form",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Credit Repair Form v2",
      description: "Enhanced version with improved UX and multi-step flow.",
      icon: FileText,
      href: "/client-form",
      color: "from-emerald-500 to-emerald-600",
    },
    // {
    //   title: "Consultant Form",
    //   description: "What form the credit consultant will fill out to send it to the dispute experts.",
    //   icon: User,
    //   href: "/consultant-form",
    //   color: "from-indigo-500 to-indigo-600",
    // },
    // {
    //   title: "Dispute Expert",
    //   description: "What form the dispute expert will fill out and send it to the consultant for a follow up with the client.",
    //   icon: Shield,
    //   href: "/dispute-expert",
    //   color: "from-green-500 to-green-600",
    // },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Credit Forms
          </h1>
          <p className="text-xl text-gray-300">
            Click on the preview buttons below to view the forms.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.href}
                href={service.href}
                className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-block p-3 bg-white/20 rounded-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {service.title}
                    </h2>
                    <p className="text-white/90">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    Preview
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>By Khizer</p>
        </div>
      </div>
    </div>
  );
}
