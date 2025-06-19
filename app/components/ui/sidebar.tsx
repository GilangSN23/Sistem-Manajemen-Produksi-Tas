"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode, useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface SidebarProviderProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}

interface SidebarLinkProps {
  link: {
    href: string;
    label: string;
    icon: ReactNode;
  };
  className?: string;
}

interface SidebarProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animate?: boolean;
}

const SidebarContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  animate: boolean;
} | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  );
};

export const DesktopSidebar: React.FC<{ children: ReactNode; className?: string }> = ({
    className,
    children,
  }) => {
    const { open, setOpen, animate } = useSidebar();
  
    return (
      <motion.div
        className={cn(
          "fixed top-0 left-0 h-screen overflow-y-auto px-4 py-4 md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>
    );
  };  

export const MobileSidebar: React.FC<{ children: ReactNode; className?: string }> = ({
  className,
  children,
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full",
        className
      )}>
      <div className="flex justify-end z-20 w-full">
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between"
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink: React.FC<SidebarLinkProps> = ({ link, className }) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn("flex items-center gap-2 py-2 group/sidebar", className)}
    >
      {link.icon}
      <motion.span
        animate={{ opacity: animate ? (open ? 1 : 0) : 1 }}
        className="text-neutral-700 dark:text-neutral-200 text-sm transition duration-150"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
