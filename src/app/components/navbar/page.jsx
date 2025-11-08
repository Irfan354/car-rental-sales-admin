"use client"; // because Menubar is client-side

import React from "react";
import { Menubar } from "primereact/menubar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const items = [
    // home
    {
      label: "Home",icon: "pi pi-home",command: () => router.push("/"),
    },
    // admin -> users,....
    {
      label: "Admin",
      icon: "pi pi-user-edit",
      items: [
        {
          label: "Users",
          icon: "pi pi-users",
          command: () => router.push("/admin/users"),
        },
        {
          label : "Brands",
          icon : "pi pi-car",
          command: () => router.push("/admin/brands"),
        },
        {
          label : "Models",
          icon : " pi pi-car",
          command : () => router.push("/admin/models"),
        },
        {
          label : "Variants",
          icon : "pi pi-car",
          command: () => router.push("/admin/variants"),
        },
        {
          label : "States",
          icon : " pi pi-map",
          command : () => router.push("/admin/states"),
        },
        {
          label : "Cities",
          icon : "pi pi-map",
          command: () => router.push("/admin/cities"),
        },
        {
          label : "Checklist Categories",
          icon : " pi pi-list",
          command : () => router.push("/admin/checklist-categories"),
        },
        {
          label : "Checklist Options",
          icon : "pi pi-list",
          command: () => router.push("/admin/checklist-options"),
        },
        {
          label : "Settings",
          icon : " pi pi-cog",
          command : () => router.push("/admin/settings"),
        },
      ],
    },
    // Inventory
    {
      label: "Inventory",
      icon: "pi pi-warehouse",
      items: [
        {
          label: "Available Vehicles",
          icon: "pi pi-check-circle",
          command: () => router.push("/inventory/available-vehicles"),
        },
        {
          label: "Pending Vehicles",
          icon: "pi pi-times-circle",
          command: () => router.push("/inventory/pending-vehicles"),
        },
      ],
    },
    // Bookings
    {
      label: "Bookings",
      icon: "pi pi-calendar",
      items: [
        {
          label: "Vehicle Bookings",
          icon: "pi pi-book",
          command: () => router.push("/bookings/vehicle-bookings"),
        },
        {
          label: "Booking Logs",
          icon: "pi pi-file",
          command: () => router.push("/bookings/booking-logs"),
        },
      ],
    },

    // hosters
    {
      label: "Hosters",
      icon: "pi pi-user-plus",
      command: () => router.push("/hosters"),
    },

    // Customers
    {
      label: "Customers",
      icon: "pi pi-users",
      command: () => router.push("/customers"),
    },
    // Billing
    {
      label: "Billing",
      icon: "pi pi-dollar",
      items : [
        {
          label : "Invoices",
          icon : "pi pi-file",
          command : () => router.push("/billing/invoices"),
        },
        {
          label : "Payment History",
          icon : "pi pi-calendar",
          command : () => router.push("/billing/payment-history")
        }
      ]
    },
    // Reports
    {
      label: "Reports",
      icon: "pi pi-chart-line",
      command: () => router.push("/reports"),
    },
    // support
    {
      label: "Support",
      icon: "pi pi-wrench",
      command : () => router.push("/support"),
    },

    {
      label: "Logout",
      icon: "pi pi-power-off",
      command: () => router.push("/auth/login"), // handle logout later
    },
  ];

  return (
    <div className="card w-full">
      <Menubar model={items} />
    </div>
  );
}
