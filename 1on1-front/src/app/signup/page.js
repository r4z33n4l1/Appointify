"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/utils/authHelper';

export default function Signup() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            return;
        }

        const { confirmPassword, ...signupData } = userData; // Exclude confirmPassword from data sent to backend
        const result = await signup(signupData);

        if (result.success) {
            router.push('/login');
        } else {
            setErrors(result.errors);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="username" placeholder="Username" value={userData.username} onChange={handleChange} />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                
                <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="Retype Password" value={userData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                
                <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
