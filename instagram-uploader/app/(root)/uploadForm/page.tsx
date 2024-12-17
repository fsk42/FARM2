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

const uploadSchema = z.object({
  instagramUsername: z.string().min(1, 'Instagram Benutzername ist erforderlich'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
  caption: z.string().min(1, 'Bildunterschrift ist erforderlich'),
  photo: z.any().refine(files => files && files.length > 0, 'Bild ist erforderlich'),
});

const UploadForm = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      instagramUsername: '',
      password: '',
      caption: '',
      photo: undefined,
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('username', values.instagramUsername);
    formData.append('password', values.password);
    formData.append('caption', values.caption);
    formData.append('photo', values.photo[0]); // Extract the file from FileList

    try {
      const response = await fetch('http://127.0.0.1:5000/api/uploadnow', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResponseMessage(JSON.stringify(data)); // Convert response to string and display

      if (data.uploaded) {
        toast.success('Bild erfolgreich hochgeladen!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setResponseMessage('An error occurred while connecting to the server.');
      console.error(error);
      toast.error('Fehler beim Verbinden mit dem Server.');
    }
  };

  return (
    <section className="upload-form">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Bild hochladen</h1>
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
            <FormField
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bildunterschrift</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Deine Bildunterschrift" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bild</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Hochladen
            </Button>
          </form>
        </Form>
        {responseMessage && <p>{responseMessage}</p>} {/* Show server response */}
      </div>
    </section>
  );
};

export default UploadForm;