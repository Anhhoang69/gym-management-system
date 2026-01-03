import React, { useState } from 'react';
import Banner from '../components/Banner'; // import đúng file Banner.jsx
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">About GymChain</h1>
      <p className="text-gray-700">
        GymChain is a modern platform for managing gym branches, memberships, trainers, and staff
        efficiently.
      </p>
    </div>
  );
}
