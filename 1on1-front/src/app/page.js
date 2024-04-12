'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnboardingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /onboarding
    router.push('/onboarding');
  }, []);

  return;
};

export default OnboardingPage;
