import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import RootLayout from "@/routes/root";
import HomePage from "@/routes/home";
import ModPage from "@/routes/mod";
import SettingsPage from "@/routes/settings";
import VerifyPage from "@/routes/verify";
import AppBar from "@/components/app-bar";

import "@/styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

const router = createHashRouter([
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
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/verify",
        element: <VerifyPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="aeromod-theme">
      <AppBar />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
