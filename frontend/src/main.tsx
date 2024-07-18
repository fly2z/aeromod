import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import RootLayout from "@/routes/root";
import HomePage from "@/routes/home";
import ModPage from "@/routes/mod";
import "@/styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/mod/:id",
        element: <ModPage />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="aeromod-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
