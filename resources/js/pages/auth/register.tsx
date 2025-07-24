import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    role: 'student' | 'staff';
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        role: 'student',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to register">
            <Head title="Register" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                value={data.firstName}
                                onChange={(e) => setData('firstName', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="First Name"
                            />
                            <InputError message={errors.firstName} />
                        </div>

                        <div>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                type="text"
                                value={data.middleName}
                                onChange={(e) => setData('middleName', e.target.value)}
                                disabled={processing}
                                placeholder="Middle Name (optional)"
                            />
                            <InputError message={errors.middleName} />
                        </div>

                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                value={data.lastName}
                                onChange={(e) => setData('lastName', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Last Name"
                            />
                            <InputError message={errors.lastName} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            required
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            required
                            placeholder="Address"
                        />
                        <InputError message={errors.address} />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            required
                            placeholder="98XXXXXXXX"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            className="border rounded px-3 py-2 w-full"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value as 'student' | 'staff')}
                            disabled={processing}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            required
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            required
                            placeholder="Confirm Password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <TextLink href={route('login')}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
