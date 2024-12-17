"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createAdminClient } from '@/lib/server/appwrite2';

const instaLinkSchema = z.object({
  instagramUsername: z.string().min(1, 'Instagram Benutzername ist erforderlich'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

const InstaLink = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(instaLinkSchema),
    defaultValues: {
      instagramUsername: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.instagramUsername, password: values.password }),
      });

      const data = await response.json();
      setResponseMessage(JSON.stringify(data)); // Convert response to string and display


    } catch (error) {
      setResponseMessage('An error occurred while connecting to the server.');
      console.error(error);
    }
  };

  return (
    <section className="instalink-page">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Instagram verlinken</h1>
        <p className="mb-4">Hier kannst du deinen Instagram-Account verlinken.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="instagramUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Benutzername</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dein Instagram Benutzername" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Dein Passwort" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Verlinken
            </Button>
          </form>
        </Form>
        {responseMessage && <p>{responseMessage}</p>} {/* Show server response */}
      </div>
    </section>
  );
};

export default InstaLink;