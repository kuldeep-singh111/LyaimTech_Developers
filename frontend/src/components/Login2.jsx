'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validation logic
    const validate = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format.';
        }
        if (!formData.password.trim()) {
            errors.password = 'Password is required.';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({}); alert('Submitted');
            console.log('Login successful with:', formData);
            // Handle successful login (e.g., API call)
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center"
            style={{
                backgroundImage: "url(images/registration_ground.png)",
            }}
        >
            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-b"></div> */}
            <div className="flex justify-between items-center p-3 max-w-3xl mx-auto text-white">
                <div className="font-alex font-medium text-3xl text-[#977108]">Lyaim</div>
                <div className="flex gap-5 text-lg">
                    <Link href={'home'}>Home</Link>
                    <Link href={'help'}>Help</Link>
                </div>
            </div>

            <h1 className="text-2xl font-bold font-alegreya text-white mb-2 text-center">
                LOG IN AND PLAY TO WIN!
            </h1>

            {/* Login Container */}
            <div className="flex bg-white/5 backdrop-blur-md shadow-lg rounded-xl overflow-hidden max-w-4xl w-full mx-auto">
                {/* Left Section: Image */}
                <div className="w-1/3 hidden md:block">
                    <Image
                        src="/images/registration.png"
                        alt="Player"
                        width={270} // Adjust width as needed
                        height={300} // Adjust height as needed
                        className="object-cover"
                        layout="intrinsic"
                    />
                </div>

                {/* Right Section: Form */}
                <div className="flex-1 p-8 md:p-12">
                    <div className="my-5 text-black text-center font-semibold font-aleo text-2xl">
                        Login
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-6">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => handleChange(e)}
                                className="w-full border-b bg-transparent font-aleo text-xl placeholder-black outline-none pl-2"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border-b bg-transparent font-aleo text-xl outline-none placeholder-black pl-2"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center text-white text-lg">
                                <input
                                    type="checkbox"
                                    className="mr-2 border-gray-400 rounded"
                                />
                                Remember me
                            </label>
                            <Link
                                href="#"
                                className="text-xl text-white hover:underline"
                            >
                                Forget Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-1 rounded-full text-green-800 text-lg font-bold hover:bg-green-600 transition"
                            style={{
                                background: 'linear-gradient(150deg, #5fff4d, #008000)',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Login
                        </button>
                    </form>

                    {/* Register Section */}
                    <p className="text-center text-white mt-6">
                        Don't have an account?{" "}
                        <Link href="#" className="text-[#1E1E1E] text-xl font-medium hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
